import { ClaudeAgentOptions, AgentDefinition } from "@anthropic-ai/claude-agent-sdk";
import * as fs from 'fs';
import * as path from 'path';

export interface UniversalEnterpriseMethodologistConfig {
  name: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
  allowedTools: string[];
  disallowedTools?: string[];
  methodology: {
    rounds: {
      production: RoundConfig;
      validation: RoundConfig;
      critical: RoundConfig;
      integration: RoundConfig;
    };
    patternFramework: {
      complexityAssessment: string[];
      dialogueConfirmation: string[];
      qualityAssurance: string[];
      externalValidation: string[];
    };
  };
}

export interface RoundConfig {
  purpose: string;
  outputType: string;
  successCriteria: string;
  keyActivities: string[];
}

export class UniversalEnterpriseMethodologist implements AgentDefinition {
  private config: UniversalEnterpriseMethodologistConfig;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || path.join(__dirname, '../config/agents-sdk-config.json');
    this.loadConfiguration();
  }

  private loadConfiguration(): void {
    try {
      const configData = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      const agentConfig = configData.agents.universal_enterprise_methodologist;

      const systemPromptPath = path.join(__dirname, '../config/prompts/universal_enterprise_methodologist.md');
      const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');

      this.config = {
        name: agentConfig.name,
        description: agentConfig.description,
        systemPrompt: systemPrompt,
        capabilities: agentConfig.capabilities,
        allowedTools: agentConfig.allowed_tools,
        disallowedTools: agentConfig.disallowed_tools,
        methodology: {
          rounds: {
            production: {
              purpose: "Initial solution design based on current understanding",
              outputType: "initial_solution_document",
              successCriteria: "Solid foundation with internal consistency",
              keyActivities: ["Problem analysis", "Stakeholder mapping", "Solution architecting"]
            },
            validation: {
              purpose: "External validation and enhancement with industry intelligence",
              outputType: "validated_enhanced_solution",
              successCriteria: "Solution validated against external best practices",
              keyActivities: ["Market research", "Competitive analysis", "Industry benchmarking"]
            },
            critical: {
              purpose: "Critical analysis and optimization identification",
              outputType: "optimization_analysis",
              successCriteria: "Quality gaps identified, improvements proposed",
              keyActivities: ["Risk assessment", "Quality gates", "Optimization opportunities"]
            },
            integration: {
              purpose: "Integrate improvements and finalize optimized solution",
              outputType: "final_optimized_solution",
              successCriteria: "Solution ready for implementation with quality assurance",
              keyActivities: ["Integration planning", "Final validation", "Implementation roadmap"]
            }
          },
          patternFramework: {
            complexityAssessment: ["stakeholder_complexity", "technical_complexity", "business_complexity", "execution_complexity"],
            dialogueConfirmation: ["initial_understanding", "layered_deepening", "iterative_refinement"],
            qualityAssurance: ["value_layer", "strategy_layer", "execution_layer", "implementation_layer"],
            externalValidation: ["industry_best_practices", "academic_research", "market_standards", "regulatory_requirements"]
          }
        }
      };
    } catch (error) {
      console.error('Failed to load Universal Enterprise Methodologist configuration:', error);
      throw error;
    }
  }

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description;
  }

  getSystemPrompt(): string {
    return this.config.systemPrompt;
  }

  getClaudeAgentOptions(): ClaudeAgentOptions {
    return {
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      systemPrompt: this.config.systemPrompt,
      permissionMode: "grantEdits",
      allowedTools: this.config.allowedTools,
      disallowedTools: this.config.disallowedTools,
      settingSources: ["project"], // Load project-level settings
      maxTokens: 8000,
      temperature: 0.1
    };
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  getMethodology(): any {
    return this.config.methodology;
  }

  /**
   * 返回对应的Claude Code原生subagent类型
   */
  getSubagentType(): string {
    return 'business-analyst';
  }

  /**
   * 直接执行方法（降级选项）
   */
  async execute(prompt: string, options?: Partial<ClaudeAgentOptions>): Promise<any> {
    console.log(`Executing UniversalEnterpriseMethodologist directly...`);

    // 这里可以实现直接的执行逻辑
    // 或者返回一个模拟结果用于降级情况
    return {
      agent: 'universal_enterprise_methodologist',
      prompt: prompt,
      execution: 'direct_fallback',
      result: `Methodology analysis for: ${prompt}`,
      timestamp: new Date().toISOString()
    };
  }

  // Execute specific methodology round
  async executeRound(roundName: 'production' | 'validation' | 'critical' | 'integration', context: any): Promise<any> {
    const round = this.config.methodology.rounds[roundName];

    console.log(`Executing ${roundName} round: ${round.purpose}`);

    // Here you would integrate with Claude Agent SDK to actually execute the round
    // For now, return the round configuration
    return {
      round: roundName,
      config: round,
      context: context,
      timestamp: new Date().toISOString()
    };
  }

  // Validate solution against methodology criteria
  validateSolution(solution: any): {
    isValid: boolean;
    gaps: string[];
    recommendations: string[];
  } {
    const gaps: string[] = [];
    const recommendations: string[] = [];
    let isValid = true;

    // Implement validation logic based on methodology criteria
    if (!solution.stakeholderAnalysis) {
      gaps.push("Missing stakeholder analysis");
      recommendations.push("Conduct comprehensive stakeholder mapping");
      isValid = false;
    }

    if (!solution.riskAssessment) {
      gaps.push("Missing risk assessment");
      recommendations.push("Perform thorough risk analysis");
      isValid = false;
    }

    if (!solution.qualityAssurance) {
      gaps.push("Missing quality assurance plan");
      recommendations.push("Implement multi-layer quality validation");
      isValid = false;
    }

    return {
      isValid,
      gaps,
      recommendations
    };
  }

  // Generate comprehensive methodology report
  generateMethodologyReport(context: any, results: any): string {
    const report = `
# Universal Enterprise Methodology Report

## Project Overview
${JSON.stringify(context, null, 2)}

## Methodology Application
### Round 1: Production
${results.production ? results.production.summary : 'Not executed'}

### Round 2: Validation
${results.validation ? results.validation.summary : 'Not executed'}

### Round 3: Critical
${results.critical ? results.critical.summary : 'Not executed'}

### Round 4: Integration
${results.integration ? results.integration.summary : 'Not executed'}

## Solution Quality Assessment
${results.validation ? results.validation.assessment : 'Assessment pending'}

## Recommendations
${results.recommendations ? results.recommendations.join('\n') : 'No recommendations available'}

## Implementation Roadmap
${results.roadmap ? results.roadmap : 'Roadmap pending'}

---
Generated by Universal Enterprise Methodologist Agent
BMAD v5.2 - Claude Agent SDK Integration
    `.trim();

    return report;
  }
}

export default UniversalEnterpriseMethodologist;