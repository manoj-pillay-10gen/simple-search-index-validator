const basicIndexDefinitionJSON = `// Minimal search index definition. 
// Please customize as required. 
{
  "mappings": {
    "dynamic": true
  }
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
};
export default files;
