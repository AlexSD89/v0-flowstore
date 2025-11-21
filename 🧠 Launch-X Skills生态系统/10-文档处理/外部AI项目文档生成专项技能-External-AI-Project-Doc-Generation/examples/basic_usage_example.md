# AI Project Documentation Examples

## Example 1: Project Existence Verification

```bash
python scripts/data_validator.py \
  --project "AI Recommendation System" \
  --company "TechCorp AI" \
  --validate-existence
```

## Example 2: Data Validation

```bash
# Create test data file
cat > project_data.json << EOF
{
  "project_name": "AI Recommendation System",
  "company_name": "TechCorp AI",
  "accuracy_rate": 82,
  "funding_stage": "series_a",
  "funding_amount": 8000000,
  "revenue_growth_rate": 250,
  "team_size": 20
}
EOF

# Validate against benchmarks
python scripts/data_validator.py --data-file project_data.json --benchmark-validation
```

## Example 3: Complete Workflow

```bash
# Step 1: Verify project exists
python scripts/data_validator.py --project "AI Project" --company "Company Name" --validate-existence

# Step 2: Collect and validate data
python scripts/data_validator.py --data-file data.json --benchmark-validation

# Step 3: Generate documentation (if validation passes)
```

## Best Practices

1. Always run `--help` first to understand script options
2. Use black-box approach - don't read source code
3. Validate before generating documentation
4. Address validation failures before proceeding