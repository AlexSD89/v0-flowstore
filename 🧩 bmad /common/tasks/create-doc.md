# Intelligent Document Creation
## Context-Aware, Adaptive Generation

**🧠 INTELLIGENCE-FIRST APPROACH**

**THIS IS AN INTELLIGENT WORKFLOW - ADAPTS TO CONTEXT AND USER NEEDS**

When this task is invoked:

1. **ANALYZE PROJECT CONTEXT** - Understand project type, complexity, and existing information
2. **ADAPTIVE INTERACTION MODE** - Choose interaction level based on context quality and user expertise
3. **SMART PRE-POPULATION** - Auto-fill known information, focus questions on unknowns
4. **DYNAMIC SECTION SELECTION** - Include only relevant sections for the specific project type
5. **EFFICIENCY OPTIMIZATION** - Minimize redundant questions, maximize value delivery

**SUCCESS INDICATOR:** Users get exactly what they need for their project type, efficiently and accurately.

## 🎯 Intelligent Template Selection

**SMART DISCOVERY PROCESS:**
1. **Analyze User Input**: Extract project type, complexity, and context from user request
2. **Auto-Select Template**: Choose optimal template based on detected project characteristics
3. **Context-Aware Adaptation**: Modify template sections based on project-specific needs
4. **Fallback Options**: If uncertain, present 2-3 most relevant template options with reasoning

## 🧠 Intelligent Interaction Modes

**ADAPTIVE INTERACTION BASED ON CONTEXT:**

### Mode 1: Smart Pre-Population (High Confidence)
**When**: Clear project context, standard patterns detected
**Process**: 
1. Auto-generate section content based on project analysis
2. Present with reasoning: "Based on [project_type], I've generated [section]. Here's my reasoning: [logic]"
3. Ask: "Does this capture your intent, or would you like adjustments?"

### Mode 2: Focused Clarification (Medium Confidence)  
**When**: Some uncertainty about specific decisions or trade-offs
**Process**:
1. Present generated content with identified uncertainties
2. Ask targeted questions: "I need clarity on [specific_aspect] to ensure accuracy"
3. Provide 2-3 concrete options with trade-offs

### Mode 3: Collaborative Discovery (Low Confidence)
**When**: Complex projects, minimal context, or user prefers detailed exploration
**Process**:
1. Present section framework
2. Use structured elicitation methods from .claude/bmad-core/data/elicitation-methods
3. Build content iteratively through guided discovery

**INTELLIGENCE PRINCIPLE:** Match interaction depth to context quality and user needs.

## 🚀 Intelligent Processing Flow

### Phase 1: Context Analysis & Template Intelligence
1. **Project Detection**: Auto-identify project type (web/mobile/API), complexity (MVP/standard/enterprise), context (greenfield/brownfield)
2. **Template Selection**: Choose optimal template and adapt sections based on project analysis
3. **Information Assessment**: Evaluate existing context, user expertise, and time constraints
4. **Mode Selection**: Choose appropriate interaction mode (pre-population/clarification/discovery)

### Phase 2: Smart Content Generation
5. **Section Relevance**: Include only sections relevant to detected project type
6. **Auto-Population**: Pre-fill sections where project context provides clear answers
7. **Strategic Elicitation**: Focus questions on high-impact unknowns and decisions
8. **Progressive Disclosure**: Start with core content, add complexity only when needed

### Phase 3: Quality & Efficiency
9. **Context Validation**: Ensure generated content aligns with project goals
10. **Completeness Check**: Verify all necessary elements are covered for project type
11. **User Confirmation**: Present complete document with rationale for review
12. **Iterative Refinement**: Adjust based on user feedback efficiently

## Detailed Rationale Requirements

When presenting section content, ALWAYS include rationale that explains:

- Trade-offs and choices made (what was chosen over alternatives and why)
- Key assumptions made during drafting
- Interesting or questionable decisions that need user attention
- Areas that might need validation

## Elicitation Results Flow

After user selects elicitation method (2-9):

1. Execute method from .claude/bmad-core/data/elicitation-methods
2. Present results with insights
3. Offer options:
   - **1. Apply changes and update section**
   - **2. Return to elicitation menu**
   - **3. Ask any questions or engage further with this elicitation**

## 🎭 Intelligent Agent Orchestration

**SMART AGENT SELECTION BASED ON PROJECT ANALYSIS:**

### Project-Type Driven Agent Selection
- **Simple MVP**: PM + Dev (skip Architect for basic projects)
- **Standard Web App**: PM + UX-Expert + Architect + Dev
- **Enterprise System**: Analyst + PM + Architect + UX-Expert + Dev + QA
- **API/Backend Only**: PM + Architect + Dev (skip UX-Expert)
- **Brownfield Enhancement**: Analyst + PM + Dev (focus on integration)

### Dynamic Permission & Routing
- **Intelligent Handoffs**: Pass rich context between agents, not just section names
- **Parallel Processing**: Allow multiple agents to work simultaneously when dependencies allow
- **Context Preservation**: Maintain project understanding across agent switches
- **Smart Specialization**: Route sections to agents with optimal expertise for the task

## ⚡ Efficiency Modes

### Rapid Generation Mode
**Trigger**: `#rapid` or detected simple project with clear requirements
**Process**: Auto-generate complete document based on project analysis, present for review

### Comprehensive Mode  
**Trigger**: `#comprehensive` or complex enterprise projects
**Process**: Full collaborative discovery with detailed elicitation

### Focused Mode
**Trigger**: `#focused [section]` or when user wants to work on specific areas
**Process**: Deep dive on specific sections while maintaining document coherence

## 🎯 Intelligence Guidelines

**✅ SMART PRINCIPLES:**

- **Context-First**: Always analyze project context before proceeding
- **Relevance-Driven**: Include only sections relevant to the specific project type
- **Efficiency-Optimized**: Minimize redundant questions, maximize value delivery
- **Adaptive Interaction**: Match detail level to user needs and project complexity
- **Quality-Focused**: Ensure generated content serves the actual project goals

**🧠 INTELLIGENCE BEHAVIORS:**

- **Auto-Detect**: Project type, complexity, and optimal approach
- **Pre-Populate**: Known information based on context and patterns
- **Smart Questions**: Ask only about unknowns and critical decisions
- **Rich Context**: Provide reasoning and trade-offs for all recommendations
- **Goal Alignment**: Ensure every section serves the user's actual objectives
