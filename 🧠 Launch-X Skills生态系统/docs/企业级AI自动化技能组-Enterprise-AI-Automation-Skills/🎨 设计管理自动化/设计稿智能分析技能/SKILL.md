{
  "skill_config": {
    "name": "设计稿智能分析技能",
    "version": "1.0.0",
    "type": "design_analysis",
    "level": "M",
    "activation_keywords": [
      "设计分析",
      "设计对比",
      "版本分析",
      "设计审核",
      "质量评估",
      "设计优化",
      "视觉分析",
      "设计稿分析",
      "喜临门设计",
      "商家页面分析"
    ],
    "target_paths": [
      "**/*.psd",
      "**/*.ai",
      "**/*.fig",
      "**/*.sketch",
      "**/*.png",
      "**/*.jpg",
      "**/*.svg",
      "**/*.pdf"
    ],
    "token_threshold": 1000,
    "activation_mode": "contextual",
    "supported_formats": [
      "image",
      "design_file",
      "mockup",
      "prototype"
    ]
  },
  "analysis_capabilities": {
    "visual_composition": {
      "golden_ratio_analysis": {
        "enabled": true,
        "tolerance": 0.1,
        "weight": 0.3
      },
      "rule_of_thirds_analysis": {
        "enabled": true,
        "grid_divisions": 9,
        "weight": 0.25
      },
      "visual_balance": {
        "enabled": true,
        "asymmetry_tolerance": 0.15,
        "weight": 0.2
      },
      "focus_point_detection": {
        "enabled": true,
        "importance_threshold": 0.7,
        "weight": 0.25
      }
    },
    "color_analysis": {
      "harmony_assessment": {
        "enabled": true,
        "modes": ["monochromatic", "analogous", "complementary", "triadic", "tetradic"],
        "weight": 0.3
      },
      "contrast_evaluation": {
        "enabled": true,
        "wcag_aa_standard": 4.5,
        "wcag_aaa_standard": 7.0,
        "weight": 0.25
      },
      "emotional_analysis": {
        "enabled": true,
        "brand_alignment": true,
        "user_targeting": true,
        "weight": 0.2
      },
      "accessibility_check": {
        "enabled": true,
        "color_blind_friendly": true,
        "weight": 0.25
      }
    },
    "typography_analysis": {
      "hierarchy_assessment": {
        "enabled": true,
        "levels": ["H1", "H2", "H3", "Body"],
        "weight": 0.3
      },
      "readability_check": {
        "enabled": true,
        "max_characters_per_line": 75,
        "min_font_size": 14,
        "weight": 0.25
      },
      "spacing_evaluation": {
        "enabled": true,
        "line_height_ratio_range": [1.4, 1.6],
        "letter_spacing_adaptive": true,
        "weight": 0.2
      },
      "font_compatibility": {
        "enabled": true,
        "fallback_fonts": true,
        "weight": 0.25
      }
    },
    "brand_consistency": {
      "vi_compliance": {
        "enabled": true,
        "color_deviation_tolerance": 0.15,
        "weight": 0.4
      },
      "typography_standards": {
        "enabled": true,
        "font_consistency_check": true,
        "weight": 0.3
      },
      "visual_elements": {
        "enabled": true,
        "logo_usage_check": true,
        "icon_style_consistency": true,
        "weight": 0.3
      }
    }
  },
  "comparison_features": {
    "version_comparison": {
      "enabled": true,
      "difference_detection": {
        "pixel_level": true,
        "element_level": true,
        "layout_level": true
      },
      "change_tracking": {
        "enabled": true,
        "additions": true,
        "modifications": true,
        "removals": true
      },
      "evolution_analysis": {
        "enabled": true,
        "pattern_recognition": true,
        "trend_identification": true
      }
    },
    "multi_design_comparison": {
      "enabled": true,
      "similarity_analysis": true,
      "pattern_extraction": true,
      "benchmark_comparison": true
    }
  },
  "quality_assessment": {
    "scoring_system": {
      "visual_composition": {
        "weight": 0.25,
        "excellent": 9.0,
        "good": 7.0,
        "fair": 5.0,
        "poor": 3.0
      },
      "color_harmony": {
        "weight": 0.20,
        "excellent": 9.0,
        "good": 7.5,
        "fair": 6.0,
        "poor": 4.0
      },
      "typography": {
        "weight": 0.20,
        "excellent": 9.0,
        "good": 7.0,
        "fair": 5.5,
        "poor": 3.5
      },
      "brand_consistency": {
        "weight": 0.20,
        "excellent": 9.5,
        "good": 8.0,
        "fair": 6.5,
        "poor": 4.5
      },
      "usability": {
        "weight": 0.15,
        "excellent": 8.5,
        "good": 7.0,
        "fair": 5.5,
        "poor": 3.5
      }
    },
    "quality_thresholds": {
      "excellent": 8.5,
      "good": 7.0,
      "acceptable": 6.0,
      "needs_improvement": 5.0,
      "poor": 4.0
    }
  },
  "recommendation_engine": {
    "specific_suggestions": {
      "enabled": true,
      "priority_factors": ["impact", "feasibility", "alignment"],
      "max_suggestions": 8,
      "confidence_threshold": 0.7
    },
    "best_practices": {
      "enabled": true,
      "industry_standards": true,
      "competitive_analysis": true,
      "trend_application": true
    },
    "innovation_opportunities": {
      "enabled": true,
      "differentiation_points": true,
      "ux_enhancements": true,
      "technical_innovations": true
    }
  },
  "project_specific": {
    "xilinmen_brand": {
      "brand_colors": ["#E74C3C", "#2C3E50", "#ECF0F1"],
      "secondary_colors": ["#F39C12", "#27AE60", "#8E44AD"],
      "typography": {
        "primary_fonts": ["PingFang SC", "Microsoft YaHei"],
        "secondary_fonts": ["Arial", "Helvetica"]
      },
      "design_standards": {
        "grid_system": "12-column",
        "spacing_unit": "8px",
        "brand_guidelines": true
      }
    },
    "merchant_pages": {
      "common_elements": [
        "navigation_bar",
        "product_showcase",
        "information_hierarchy",
        "call_to_action"
      ],
      "interaction_patterns": {
        "progressive_disclosure": true,
        "visual_feedback": true,
        "responsive_behavior": true
      }
    }
  },
  "integration": {
    "design_tools": {
      "adobe_photoshop": {
        "enabled": true,
        "operations": ["layer_analysis", "color_extraction", "measurement"]
      },
      "adobe_illustrator": {
        "enabled": true,
        "operations": ["vector_analysis", "path_detection", "typography_check"]
      },
      "figma": {
        "enabled": true,
        "operations": ["component_analysis", "style_inspection", "prototype_review"]
      }
    },
    "collaboration_platforms": {
      "yuque": {
        "enabled": true,
        "operations": ["document_sync", "comment_analysis", "version_tracking"]
      }
    },
    "ai_services": {
      "image_analysis": {
        "enabled": true,
        "provider": "gpt-4v",
        "capabilities": ["visual_understanding", "pattern_recognition"]
      }
    }
  },
  "performance_targets": {
    "analysis_speed": {
      "single_design": 10,
      "batch_analysis": 30,
      "comparison_analysis": 20
    },
    "accuracy_metrics": {
      "visual_analysis_accuracy": 0.90,
      "color_analysis_accuracy": 0.85,
      "typography_accuracy": 0.88,
      "brand_consistency_accuracy": 0.92
    },
    "quality_improvement": {
      "design_consistency_improvement": 0.70,
      "usability_enhancement": 0.70,
      "brand_alignment_improvement": 0.80
    }
  },
  "learning_capabilities": {
    "pattern_learning": {
      "enabled": true,
      "historical_data_usage": true,
      "feedback_integration": true
    },
    "personalization": {
      "enabled": true,
      "brand_specific_learning": true,
      "user_preference_adaptation": true
    },
    "continuous_improvement": {
      "enabled": true,
      "algorithm_optimization": true,
      "standard_updates": true
    }
  },
  "output_formats": {
    "analysis_report": {
      "format": "markdown",
      "sections": [
        "executive_summary",
        "detailed_analysis",
        "scores",
        "recommendations",
        "next_steps"
      ]
    },
    "comparison_report": {
      "format": "markdown",
      "sections": [
        "version_overview",
        "differences",
        "evolution_analysis",
        "recommendations"
      ]
    },
    "quality_dashboard": {
      "format": "json",
      "metrics": [
        "overall_score",
        "dimension_scores",
        "improvement_areas",
        "benchmark_comparison"
      ]
    }
  }
}