"""
Base Agent Framework for LaunchX v4.0
Provides the foundation for all specialized agents in the Agent OS.
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any, AsyncGenerator
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import json
import logging
from enum import Enum

from pydantic import BaseModel
from anthropic import Anthropic


class AgentStatus(Enum):
    """Agent lifecycle status"""
    INITIALIZING = "initializing"
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    SHUTTING_DOWN = "shutting_down"


class MessageType(Enum):
    """Message types for agent communication"""
    TASK_REQUEST = "task_request"
    TASK_RESPONSE = "task_response"
    STATUS_UPDATE = "status_update"
    ERROR_REPORT = "error_report"
    HEARTBEAT = "heartbeat"


@dataclass
class AgentMessage:
    """Message structure for agent communication"""
    id: str
    sender_id: str
    receiver_id: str
    message_type: MessageType
    payload: Dict[str, Any]
    timestamp: datetime = field(default_factory=datetime.now)
    correlation_id: Optional[str] = None


@dataclass
class AgentTask:
    """Task structure for agent execution"""
    id: str
    task_type: str
    parameters: Dict[str, Any]
    priority: int = 1
    created_at: datetime = field(default_factory=datetime.now)
    deadline: Optional[datetime] = None
    status: str = "pending"


class BaseAgent(ABC):
    """
    Base class for all agents in the Agent OS.
    Provides common functionality for agent lifecycle, communication, and task execution.
    """

    def __init__(
        self,
        agent_id: str,
        name: str,
        capabilities: List[str],
        tools: List[str],
        config: Optional[Dict[str, Any]] = None
    ):
        self.agent_id = agent_id
        self.name = name
        self.capabilities = capabilities
        self.tools = tools
        self.config = config or {}
        self.status = AgentStatus.INITIALIZING
        self.current_task: Optional[AgentTask] = None
        self.task_queue: asyncio.Queue = asyncio.Queue()
        self.message_handlers: Dict[MessageType, callable] = {}
        self.logger = logging.getLogger(f"agent.{self.agent_id}")

        # Claude client for AI capabilities
        self.claude_client = Anthropic(
            api_key=self.config.get("anthropic_api_key")
        )

        # Register default handlers
        self._register_default_handlers()

        # Metrics tracking
        self.metrics = {
            "tasks_completed": 0,
            "tasks_failed": 0,
            "average_task_time": 0.0,
            "last_activity": None
        }

    def _register_default_handlers(self):
        """Register default message handlers"""
        self.message_handlers[MessageType.TASK_REQUEST] = self._handle_task_request
        self.message_handlers[MessageType.STATUS_UPDATE] = self._handle_status_update
        self.message_handlers[MessageType.HEARTBEAT] = self._handle_heartbeat

    async def start(self):
        """Start the agent and begin processing messages"""
        self.logger.info(f"Starting agent {self.name} ({self.agent_id})")
        self.status = AgentStatus.IDLE

        # Start message processing loop
        asyncio.create_task(self._message_loop())

        # Start heartbeat
        asyncio.create_task(self._heartbeat_loop())

        self.logger.info(f"Agent {self.name} started successfully")

    async def stop(self):
        """Stop the agent gracefully"""
        self.logger.info(f"Stopping agent {self.name}")
        self.status = AgentStatus.SHUTTING_DOWN

        # Wait for current task to complete or timeout
        if self.current_task:
            await asyncio.wait_for(
                self._complete_current_task(),
                timeout=30.0
            )

        self.logger.info(f"Agent {self.name} stopped")

    async def send_message(self, message: AgentMessage):
        """Send a message to another agent"""
        # This would be implemented with actual message routing
        # For now, just log the message
        self.logger.debug(f"Sending message: {message.id} to {message.receiver_id}")

    async def receive_message(self, message: AgentMessage):
        """Receive and process a message"""
        try:
            handler = self.message_handlers.get(message.message_type)
            if handler:
                await handler(message)
            else:
                self.logger.warning(f"No handler for message type: {message.message_type}")
        except Exception as e:
            self.logger.error(f"Error processing message {message.id}: {e}")
            await self._send_error_report(message.id, str(e))

    async def _message_loop(self):
        """Main message processing loop"""
        while self.status != AgentStatus.SHUTTING_DOWN:
            try:
                # Process messages from queue
                message = await asyncio.wait_for(
                    self.task_queue.get(),
                    timeout=1.0
                )
                await self.receive_message(message)
            except asyncio.TimeoutError:
                # No message received, continue
                continue
            except Exception as e:
                self.logger.error(f"Error in message loop: {e}")
                await asyncio.sleep(1.0)

    async def _heartbeat_loop(self):
        """Send periodic heartbeat messages"""
        while self.status != AgentStatus.SHUTTING_DOWN:
            try:
                heartbeat = AgentMessage(
                    id=f"heartbeat_{self.agent_id}_{int(datetime.now().timestamp())}",
                    sender_id=self.agent_id,
                    receiver_id="master",
                    message_type=MessageType.HEARTBEAT,
                    payload={
                        "status": self.status.value,
                        "current_task": self.current_task.id if self.current_task else None,
                        "queue_size": self.task_queue.qsize(),
                        "metrics": self.metrics
                    }
                )
                await self.send_message(heartbeat)
                await asyncio.sleep(30.0)  # Heartbeat every 30 seconds
            except Exception as e:
                self.logger.error(f"Error in heartbeat loop: {e}")
                await asyncio.sleep(30.0)

    async def _handle_task_request(self, message: AgentMessage):
        """Handle incoming task requests"""
        task_data = message.payload
        task = AgentTask(
            id=task_data["id"],
            task_type=task_data["task_type"],
            parameters=task_data["parameters"],
            priority=task_data.get("priority", 1),
            deadline=datetime.fromisoformat(task_data["deadline"]) if task_data.get("deadline") else None
        )

        # Add to queue based on priority
        await self.task_queue.put(task)
        self.logger.info(f"Received task {task.id} of type {task.task_type}")

    async def _handle_status_update(self, message: AgentMessage):
        """Handle status update messages"""
        self.logger.debug(f"Received status update: {message.payload}")

    async def _handle_heartbeat(self, message: AgentMessage):
        """Handle heartbeat messages"""
        self.logger.debug(f"Received heartbeat from {message.sender_id}")

    async def _send_error_report(self, original_message_id: str, error: str):
        """Send error report for failed message processing"""
        error_message = AgentMessage(
            id=f"error_{self.agent_id}_{int(datetime.now().timestamp())}",
            sender_id=self.agent_id,
            receiver_id="master",
            message_type=MessageType.ERROR_REPORT,
            payload={
                "original_message_id": original_message_id,
                "error": error,
                "timestamp": datetime.now().isoformat()
            }
        )
        await self.send_message(error_message)

    async def _complete_current_task(self):
        """Complete the current task"""
        if self.current_task:
            try:
                start_time = datetime.now()

                # Execute the task
                result = await self.execute_task(self.current_task)

                # Calculate execution time
                execution_time = (datetime.now() - start_time).total_seconds()
                self._update_metrics(execution_time, success=True)

                # Send task completion response
                response = AgentMessage(
                    id=f"response_{self.current_task.id}",
                    sender_id=self.agent_id,
                    receiver_id="master",
                    message_type=MessageType.TASK_RESPONSE,
                    payload={
                        "task_id": self.current_task.id,
                        "status": "completed",
                        "result": result,
                        "execution_time": execution_time
                    }
                )
                await self.send_message(response)

                self.logger.info(f"Completed task {self.current_task.id}")

            except Exception as e:
                self._update_metrics(0, success=False)
                await self._send_error_report(self.current_task.id, str(e))
                self.logger.error(f"Failed to complete task {self.current_task.id}: {e}")

            finally:
                self.current_task = None
                self.status = AgentStatus.IDLE

    def _update_metrics(self, execution_time: float, success: bool):
        """Update agent metrics"""
        if success:
            self.metrics["tasks_completed"] += 1
            # Update average task time
            total_completed = self.metrics["tasks_completed"]
            current_avg = self.metrics["average_task_time"]
            self.metrics["average_task_time"] = (
                (current_avg * (total_completed - 1) + execution_time) / total_completed
            )
        else:
            self.metrics["tasks_failed"] += 1

        self.metrics["last_activity"] = datetime.now()

    @abstractmethod
    async def execute_task(self, task: AgentTask) -> Dict[str, Any]:
        """
        Execute a specific task. Must be implemented by subclasses.

        Args:
            task: The task to execute

        Returns:
            Dict containing the task result
        """
        pass

    async def call_claude(self, prompt: str, max_tokens: int = 2000) -> str:
        """
        Call Claude AI model for task execution

        Args:
            prompt: The prompt to send to Claude
            max_tokens: Maximum tokens in response

        Returns:
            Claude's response text
        """
        try:
            response = self.claude_client.messages.create(
                model=self.config.get("claude_model", "claude-3-sonnet-20240229"),
                max_tokens=max_tokens,
                temperature=self.config.get("claude_temperature", 0.7),
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.content[0].text
        except Exception as e:
            self.logger.error(f"Error calling Claude: {e}")
            raise

    async def use_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Any:
        """
        Use a tool available to the agent

        Args:
            tool_name: Name of the tool to use
            parameters: Parameters for the tool

        Returns:
            Tool execution result
        """
        # This would be implemented with actual tool integration
        # For now, just log the tool usage
        self.logger.info(f"Using tool {tool_name} with parameters: {parameters}")

        # Mock tool usage for demonstration
        if tool_name == "xiaohongshu-mcp":
            return {"status": "success", "message": "Content published successfully"}
        elif tool_name == "tavily-search":
            return {"results": [{"title": "Mock result", "url": "https://example.com"}]}
        else:
            raise ValueError(f"Unknown tool: {tool_name}")

    def get_status(self) -> Dict[str, Any]:
        """Get current agent status"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status.value,
            "current_task": self.current_task.id if self.current_task else None,
            "queue_size": self.task_queue.qsize(),
            "capabilities": self.capabilities,
            "tools": self.tools,
            "metrics": self.metrics
        }