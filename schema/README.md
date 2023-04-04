# Atlas Search Schema

This directory hosts the schema files to define an atlas search index. There are two files
1. [**index.json**](https://github.com/manoj-pillay-10gen/simple-search-index-validator/blob/main/schema/index.json): 
The specification matches the Atlas Search JSON editor. Notably, it does not validate on required 
fields `name`, `collectionName` and `database`.
2. [**fullIndex.json**](https://github.com/manoj-pillay-10gen/simple-search-index-validator/blob/main/schema/fullIndex.json): 
The specification matches a full atlas search index as required by the [Atlas Search Index Create 
API](https://www.mongodb.com/docs/atlas/reference/api-resources-spec/#tag/Atlas-Search/operation/createAtlasSearchIndex)

By default, index.json is hooked up with https://simple-index-validator.cloud-atlas-search.staging.corp.mongodb.com
for allowing easy review of schema changes that affect the Atlas Search JSON editor.

## Reference

For a detailed reference, please see: https://github.com/10gen/mms/blob/master/client/js/search/schema/README.md
