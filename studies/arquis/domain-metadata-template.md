# Domain Metadata Template (PS-2)

When reading or generating domain metadata, use the following template:

```json
{
  "domain"  : {
    "name": "<Domain Name>",
    "description": "<Domain Description>",
    "version": "<Domain Version>",
    "invariants": ["<Domain Invariants>"],
    "services": ["<Domain Services>"],
    "events": ["<Domain Events>"],
  },
  "aggregates": {
    "<AggregateName>": {
      "description": "<Aggregate Description>",
      "root": "<Entity Name>",
      "valueObjects": {
            "<ValueObjectName>": {
               "description": "Some contact information",
               "fields": {
                  "<fieldName>": { "type": "String", "notnull": true },
                  *********** ficou por aqui *****
               },
            },

      },
      "entities": {},
      "enumerations": {},
      "operations": [],
      "validations": []
    }
  }
}
```
