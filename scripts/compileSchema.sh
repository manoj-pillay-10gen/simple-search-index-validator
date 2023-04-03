#!/usr/bin/env bash

npx ajv compile \
  -s ../schema/index.json \
  -r "../schema/components/**/*.json" \
  --strict=false