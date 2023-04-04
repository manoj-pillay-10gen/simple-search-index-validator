#!/usr/bin/env bash

SCHEMA_DIR="../schema"

FULL_INDEX_SAMPLE_DATA_DIR="../data/sampleData/fullIndexSamples"
for filename in "${FULL_INDEX_SAMPLE_DATA_DIR}"/**/*.json; do
  echo "Validating $filename"
  npx ajv validate \
  -s $SCHEMA_DIR/fullIndex.json \
  -d $filename \
  -r "$SCHEMA_DIR/components/**/*.json" \
  --strict=false
done

JSON_EDITOR_SAMPLE_DATA_DIR="../data/sampleData/JSONEditorSamples"
for filename in "${JSON_EDITOR_SAMPLE_DATA_DIR}"/**/*.json; do
  echo "Validating $filename"
  npx ajv validate \
  -s $SCHEMA_DIR/index.json \
  -d $filename \
  -r "$SCHEMA_DIR/components/**/*.json" \
  --strict=false
done