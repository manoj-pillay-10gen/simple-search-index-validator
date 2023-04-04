#!/usr/bin/env bash

SCHEMA_DIR="../schema"
SAMPLE_DATA_DIR="../data/sampleData"
for filename in "${SAMPLE_DATA_DIR}"/**/*.json; do
  echo "Validating $filename"
  npx ajv validate \
  -s $SCHEMA_DIR/index.json \
  -d $filename \
  -r "$SCHEMA_DIR/components/**/*.json" \
  --strict=false
done