#!/usr/bin/env bash

npx ajv compile \
  -s ../schema/index.json \
  -r "../schema/components/**/*.json" \
  --strict=false

npx ajv compile \
  -s ../schema/fullIndex.json \
  -r "../schema/components/**/*.json" \
  --strict=false
