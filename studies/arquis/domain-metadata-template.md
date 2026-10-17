# Domain Metadata Template

When reading or generating domain metadata, use the following template:

```javascript
export const MODEL_DEFINITION = {
  domain: {
    name: "<Domain Name>",
    description: "<Domain Description>"
  },
  aggregates: {
    <AggregateName>: {
      description: "<Aggregate Description>",
      root: "<Aggregate Root>",
      valueObjects: {
            <ValueObjectName>: {
               description: "Some contact information",
               fields: {
                  <fieldName>: { type: "String", notnull: true },
                  *********** ficou por aqui *****
               },
            },

      },
      entities: {},
      enumerations: {},
      operations: [],
      validations: []
    }
  }
}
```
