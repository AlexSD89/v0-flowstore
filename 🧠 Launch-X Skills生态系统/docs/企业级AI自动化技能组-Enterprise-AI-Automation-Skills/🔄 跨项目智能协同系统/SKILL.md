{
  "skill_config": {
    "name": "跨项目智能协同系统",
    "version": "1.0.0",
    "type": "cross_project_coordination",
    "level": "M",
    "activation_keywords": [
      "跨项目协同",
      "项目协调",
      "资源调度",
      "冲突解决",
      "流程优化",
      "设计需求风控协同",
      "H5微报协调",
      "知识共享",
      "多项目管理",
      "团队协作",
      "智能调度",
      "协同管理",
      "工作流优化",
      "项目群管理"
    ],
    "target_paths": [
      "**/projects/**",
      "**/coordination/**",
      "**/collaboration/**",
      "**/workflow/**",
      "**/synchronization/**"
    ],
    "token_threshold": 1200,
    "activation_mode": "contextual",
    "supported_formats": [
      "project_data",
      "workflow_data",
      "resource_data",
      "collaboration_data",
      "knowledge_base"
    ]
  },
  "coordination_engine": {
    "project_monitoring": {
      "real_time_tracking": {
        "enabled": true,
        "progress_metrics": ["completion_rate", "velocity", "burn_down", "cycle_time"],
        "health_indicators": ["team_satisfaction", "quality_score", "risk_level"],
        "update_frequency": "real_time",
        "weight": 0.3
      },
      "milestone_management": {
        "enabled": true,
        "dependency_tracking": true,
        "critical_path_analysis": true,
        "delay_prediction": true,
        "weight": 0.25
      },
      "resource_utilization": {
        "enabled": true,
        "capacity_planning": true,
        "efficiency_metrics": true,
        "utilization_optimization": true,
        "weight": 0.25
      },
      "risk_assessment": {
        "enabled": true,
        "risk_identification": true,
        "impact_analysis": true,
        "mitigation_planning": true,
        "weight": 0.2
      }
    },
    "resource_scheduling": {
      "skill_matching": {
        "enabled": true,
        "competency_mapping": true,
        "availability_tracking": true,
        "performance_history": true,
        "weight": 0.3
      },
      "workload_balancing": {
        "enabled": true,
        "capacity_analysis": true,
        "burn_rate_monitoring": true,
        "team_productivity": true,
        "weight": 0.3
      },
      "time_optimization": {
        "enabled": true,
        "critical_path_optimization": true,
        "parallel_processing": true,
        "dependency_minimization": true,
        "weight": 0.2
      },
      "budget_allocation": {
        "enabled": true,
        "cost_optimization": true,
        "roi_analysis": true,
        "value_based_allocation": true,
        "weight": 0.2
      }
    },
    "team_collaboration": {
      "skill_analysis": {
        "enabled": true,
        "competency_matrix": true,
        "gap_identification": true,
        "development_planning": true,
        "weight": 0.25
      },
      "communication_efficiency": {
        "enabled": true,
        "meeting_optimization": true,
        "information_flow": true,
        "feedback_loops": true,
        "weight": 0.25
      },
      "collaboration_patterns": {
        "enabled": true,
        "team_dynamics": true,
        "work_style_compatibility": true,
        "cultural_fit": true,
        "weight": 0.25
      },
      "knowledge_sharing": {
        "enabled": true,
        "expertise_mapping": true,
        "knowledge_transfer": true,
        "community_building": true,
        "weight": 0.25
      }
    }
  },
  "data_synchronization": {
    "real_time_sync": {
      "critical_metrics": {
        "enabled": true,
        "sync_frequency": "real_time",
        "data_sources": ["project_status", "resource_allocation", "risk_events"],
        "priority": "high"
      },
      "key_updates": {
        "enabled": true,
        "sync_frequency": "hourly",
        "data_sources": ["milestone_updates", "stakeholder_decisions", "team_changes"],
        "priority": "high"
      },
      "general_information": {
        "enabled": true,
        "sync_frequency": "daily",
        "data_sources": ["progress_reports", "team_updates", "administrative_data"],
        "priority": "medium"
      }
    },
    "knowledge_sync": {
      "best_practices": {
        "enabled": true,
        "automatic_extraction": true,
        "pattern_recognition": true,
        "sharing_mechanism": "push_based",
        "weight": 0.3
      },
      "lessons_learned": {
        "enabled": true,
        "automatic_capture": true,
        "categorization": true,
        "distribution": "targeted",
        "weight": 0.25
      },
      "templates": {
        "enabled": true,
        "standardization": true,
        "version_control": true,
        "access_management": true,
        "weight": 0.25
      },
      "expertise": {
        "enabled": true,
        "expert_matching": true,
        "consultation_requests": true,
        "knowledge_graph": true,
        "weight": 0.2"
      }
    },
    "delivery_coordination": {
      "artifacts": {
        "enabled": true,
        "sharing_protocol": true,
        "version_management": true,
        "access_permissions": true,
        "weight": 0.3
      },
      "quality_standards": {
        "enabled": true,
        "standard_alignment": true,
        "validation_process": true,
        "continuous_improvement": true,
        "weight": 0.3
      },
      "delivery_timeline": {
        "enabled": true,
        "synchronization": true,
        "dependency_coordination": true,
        "release_planning": true,
        "weight": 0.2
      },
      "acceptance_criteria": {
        "enabled": true,
        "standardization": true,
        "stakeholder_alignment": true,
        "quality_metrics": true,
        "weight": 0.2
      }
    }
  },
  "conflict_resolution": {
    "resource_conflicts": {
      "detection": {
        "enabled": true,
        "overlap_analysis": true,
        "scarcity_identification": true,
        "urgency_assessment": true,
        "weight": 0.3
      },
      "resolution_strategies": {
        "priority_based": {
          "business_impact": 0.4,
          "customer_value": 0.3,
          "strategic_importance": 0.2,
          "urgency": 0.1
        },
        "optimization_based": {
          "efficiency_gain": 0.5,
          "cost_reduction": 0.3,
          "quality_improvement": 0.2
        },
        "negotiation_based": {
          "stakeholder_consensus": 0.6,
          "win_win_solutions": 0.4
        }
      }
    },
    "priority_conflicts": {
      "analysis_framework": {
        "project_value_scoring": {
          "revenue_impact": 0.4,
          "user_impact": 0.3,
          "strategic_alignment": 0.2,
          "competitive_advantage": 0.1
        },
        "urgency_factors": {
          "time_sensitivity": 0.4,
          "compliance_requirements": 0.3,
          "market_pressure": 0.2,
          "customer_demand": 0.1
        },
        "dependency_analysis": {
          "upstream_impact": 0.4,
          "downstream_impact": 0.3,
          "critical_path": 0.2,
          "resource_bottlenecks": 0.1
        }
      },
      "resolution_mechanisms": {
        "automatic_rebalancing": {
          "ai_recommendations": true,
          "confidence_threshold": 0.8,
          "human_approval": "strategic_decisions"
        },
        "escalation_process": {
          "timely_escalation": true,
          "clear_resolution_paths": true,
          "stakeholder_notification": true
        }
      }
    },
    "technical_conflicts": {
      "compatibility_analysis": {
        "enabled": true,
        "technology_stack": true,
        "integration_challenges": true,
        "data_consistency": true,
        "security_standards": true,
        "weight": 0.3
      },
      "solution_strategies": {
        "integration_friendly": {
          "api_standardization": true,
          "data_format_unification": true,
          "security_alignment": true
        },
        "bridge_solutions": {
          "middleware_implementation": true,
          "translation_layers": true,
          "adapter_patterns": true
        },
        "consolidation_opportunities": {
          "platform_unification": true,
          "tool_consolidation": true,
          "process_standardization": true
        }
      }
    }
  },
  "workflow_optimization": {
    "process_mapping": {
      "current_state_analysis": {
        "enabled": true,
        "workflow_visualization": true,
        "bottleneck_identification": true,
        "efficiency_benchmarks": true,
        "weight": 0.3
      },
      "stakeholder_mapping": {
        "enabled": true,
        "responsibility_matrices": true,
        "handoff_points": true,
        "communication_flows": true,
        "weight": 0.2
      },
      "data_flow_analysis": {
        "enabled": true,
        "information_flows": true,
        "decision_points": true,
        "feedback_loops": true,
        "weight": 0.2
      },
      "tool_integration": {
        "enabled": true,
        "system_dependencies": true,
        "integration_points": true,
        "automation_opportunities": true,
        "weight": 0.3
      }
    },
    "optimization_recommendations": {
      "process_simplification": {
        "enabled": true,
        "waste_elimination": true,
        "bottleneck_removal": true,
        "value_stream_optimization": true,
        "weight": 0.3
      },
      "automation_opportunities": {
        "enabled": true,
        "routine_task_automation": true,
        "intelligent_assistance": true,
        "predictive_automation": true,
        "weight": 0.3
      },
      "tool_integration": {
        "enabled": true,
        "workflow_tools": true,
        "collaboration_platforms": true,
        "monitoring_systems": true,
        "weight": 0.2
      },
      "best_practice_application": {
        "enabled": true,
        "industry_standards": true,
        "benchmarking": true,
        "continuous_improvement": true,
        "weight": 0.2
      }
    },
    "continuous_improvement": {
      "performance_monitoring": {
        "enabled": true,
        "kpi_tracking": true,
        "trend_analysis": true,
        "benchmarking": true,
        "weight": 0.3
      },
      "feedback_integration": {
        "enabled": true,
        "user_satisfaction": true,
        "stakeholder_input": true,
        "team_feedback": true,
        "metric_driven": true,
        "weight": 0.3
      },
      "learning_mechanisms": {
        "enabled": true,
        "experience_capture": true,
        "pattern_recognition": true,
        "knowledge_extraction": true,
        "ai_insights": true,
        "weight": 0.2
      },
      "adaptation_strategies": {
        "enabled": true,
        "flexible_frameworks": true,
        "scalable_solutions": true,
        "responsive_design": true,
        "future_proofing": true,
        "weight": 0.2
      }
    }
  },
  "integration_capabilities": {
    "project_management_platforms": {
      "jira": {
        "enabled": true,
        "integration_type": "api",
        "features": ["issue_tracking", "project_management", "roadmap_planning"]
      },
      "asana": {
        "enabled": true,
        "integration_type": "api",
        "features": ["task_management", "project_coordination", "team_workspaces"]
      },
      "trello": {
        "enabled": true,
        "integration_type": "api",
        "features": ["visual_workflow", "card_management", "board_organization"]
      },
      "monday.com": {
        "enabled": true,
        "integration_type": "api",
        "features": ["visual_project_management", "workflow_automation", "team_collaboration"]
      }
    },
    "collaboration_tools": {
      "slack": {
        "enabled": true,
        "integration_type": "webhook",
        "features": ["team_communication", "notification_system", "app_integrations"]
      },
      "microsoft_teams": {
        "enabled": true,
        "integration_type": "api",
        "features": ["team_collaboration", "file_sharing", "video_conferencing"]
      },
      "notion": {
        "enabled": true,
        "integration_type": "api",
        "features": ["knowledge_management", "project_wikis", "task_tracking"]
      },
      "yuque": {
        "enabled": true,
        "integration_type": "api",
        "features": ["document_collaboration", "knowledge_sharing", "version_control"]
      }
    },
    "monitoring_systems": {
      "github": {
        "enabled": true,
        "integration_type": "api",
        "features": ["code_repository", "issue_tracking", "ci_cd_monitoring"]
      },
      "gitlab": {
        "enabled": true,
        "integration_type": "api",
        "features": ["repository_management", "ci_cd_pipelines", "project_monitoring"]
      },
      "prometheus": {
        "enabled": true,
        "integration_type": "api",
        "features": ["metrics_collection", "alerting", "dashboard_visualization"]
      }
    }
  },
  "performance_targets": {
    "coordination_efficiency": {
      "collaboration_speed_improvement": "≥60%",
      "information_sync_accuracy": "≥95%",
      "conflict_resolution_time": "≤2 hours",
      "resource_utilization_improvement": "≥50%"
    },
    "quality_improvement": {
      "project_success_rate_increase": "≥40%",
      "team_collaboration_satisfaction": "≥4.5/5.0",
      "knowledge_reuse_rate": "≥80%",
      "delivery_consistency": "≥90%"
    },
    "cost_benefits": {
      "communication_cost_reduction": "≥50%",
      "duplicate_work_elimination": "≥70%",
      "decision_speed_improvement": "≥60%",
      "error_rate_reduction": "≥80%"
    }
  },
  "project_specific": {
    "design_requirement_risk_coordination": {
      "project_types": ["design_management", "requirement_processing", "risk_control"],
      "coordination_points": [
        {
          "phase": "planning",
          "coordination_items": ["design_requirements_alignment", "risk_compliance_check", "timeline_synchronization"]
        },
        {
          "phase": "execution",
          "coordination_items": ["progress_sync", "quality_consistency", "change_coordination"]
        },
        {
          "phase": "delivery",
          "coordination_items": ["acceptance_alignment", "delivery_coordination", "feedback_integration"]
        }
      ]
    },
    "h5_micro_report_coordination": {
      "dual_track_design": {
        "enabled": true,
        "coordination_frequency": "daily",
        "synchronization_points": [
          "design_specifications",
          "user_experience",
          "brand_consistency",
          "technical_feasibility"
        ]
      },
      "resource_optimization": {
        "enabled": true,
        "shared_resources": ["design_assets", "development_team", "quality_assurance"],
        "efficiency_metrics": ["design_reuse", "development_speed", "quality_improvement"]
      }
    }
  },
  "scalability_config": {
    "project_capacity": {
      "current_projects": 10,
      "maximum_projects": 100,
      "team_size_capacity": 500,
      "scalability_factor": 10
    },
    "data_volume": {
      "real_time_data_points": 1000,
      "historical_data_retention": "5_years",
      "knowledge_base_size": "10000+ documents",
      "processing_throughput": "10000+ events/hour"
    },
    "integration_points": {
      "api_integrations": 50,
      "webhook_endpoints": 100,
      "data_sources": 200,
      "notification_channels": 50
    }
  },
  "quality_assurance": {
    "validation_framework": {
      "data_accuracy": {
        "completeness_validation": true,
        "consistency_checks": true,
        "accuracy_verification": true,
        "timeliness_monitoring": true
      },
      "coordination_effectiveness": {
        "goal_alignment": true,
        "efficiency_measurement": true,
        "stakeholder_satisfaction": true,
        "outcome_assessment": true
      },
      "system_reliability": {
        "availability_monitoring": true,
        "performance_testing": true,
        "error_handling": true,
        "disaster_recovery": true
      }
    },
    "continuous_monitoring": {
      "real_time_alerts": {
        "performance_thresholds": true,
        "error_rates": true,
        "resource_constraints": true,
        "deadline_risks": true
      },
      "periodic_reviews": {
        "weekly_health_checks": true,
        "monthly_performance_reviews": true,
        "quarterly_strategic_assessments": true,
        "annual_optimization_planning": true
      },
      "feedback_loops": {
        "user_experience": true,
        "stakeholder_satisfaction": true,
        "team_productivity": true,
        "system_effectiveness": true
      }
    }
  }
}