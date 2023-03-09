const basicIndexDefinitionJSON = `
{
  "mappings": {
    "dynamic": true
  }
}
`;

const intermediateIndexDefinitionJSON = `
{
  "analyzer": "lucene.simple",
  "searchAnalyzer": "lucene.english",
  "mappings": {
    "dynamic": true
  },
  "storedSource": true
}
`;

const files = {
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
