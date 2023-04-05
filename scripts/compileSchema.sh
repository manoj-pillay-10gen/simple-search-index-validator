#!/usr/bin/env bash

npx ajv compile \
  -s ../schema/jsonEditorIndex.json \
  -r "../schema/components/**/*.json" \
  --strict=false

npx ajv compile \
  -s ../schema/fullIndex.json \
  -r "../schema/components/**/*.json" \
  --strict=false
