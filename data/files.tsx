const basicIndexDefinitionJSON = `// Minimal search index definition. 
// Please customize as required. 
{
  "mappings": {
    "dynamic": true
  }
}
`;

const vectorSearchIndexDefinitionJSON1 = `// Vector search index definition. 
// Please customize as required. 
{
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "<field-name>",
      "numDimensions": <num-dimensions>,
      "similarity": "<similarity-function>"
    }
  ]
}
`;

const vectorSearchIndexDefinitionJSON2 = `// Vector search index definition. 
// Please customize as required. 
{
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "<field-name>",
      "numDimensions": 0,
      "similarity": "<similarity-function>"
    }
  ]
}
`;

const intermediateIndexDefinitionJSON = `// Search index definition with additional options.
// Please customize as required.
{
  "analyzer": "lucene.simple",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": true
  },
  "storedSource": true
}
`;

const files: { [index: string]: any } = {
  "basic.json": {
    name: "basic.json",
    language: "json",
    value: basicIndexDefinitionJSON,
  },
  "intermediate.json": {
    name: "intermediate.json",
    language: "json",
    value: intermediateIndexDefinitionJSON,
  },
  "vector1.json": {
    name: "vector1.json",
    language: "json",
    value: vectorSearchIndexDefinitionJSON1,
  },
  "vector2.json": {
    name: "vector2.json",
    language: "json",
    value: vectorSearchIndexDefinitionJSON2,
  },
};
export default files;
