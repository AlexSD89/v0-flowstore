---
name: ai-project-docs
description: "Create or validate documentation for AI projects. Use when users need AI project documentation or data validation"
license: Complete terms in LICENSE.txt
---

# AI Project Documentation

## Overview
A user may ask you to create documentation for AI projects or validate project data.

## Workflow Decision Tree

### Creating New Documentation
Use "Project documentation creation" workflow

### Validating Existing Data
Use "Data validation scripts" in scripts/

## Helper Scripts Available

### Validation Scripts
- `scripts/data_validator.py` - Project existence and data validation

### Documentation Scripts
- `scripts/doc_generator.py` - Generate AI project documentation from validated data

### Workflow Scripts
- `scripts/workflow_executor.py` - Orchestrate complete documentation workflow

### Data Collection Scripts
- `scripts/data_collector.py` - Multi-source project data collection

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary. These scripts are designed as black-box tools for reliable operation without context window pollution.