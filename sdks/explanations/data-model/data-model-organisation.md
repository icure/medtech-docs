!!ehrlite
---
slug: organisation
tags:
    - data model
    - data owner
    - organisation
---
# Organisation

An Organisation is an entity that groups {{Practitioners}}.

An Organisation can:
- have its own encryption keys
- have users attached directly to it
- have a parent organisation

## When to Use an Organisation?

The main use of an Organisation is the rationalisation of the encryption keys. 
If you have a group of users that share the same encryption keys, you should create an Organisation for them.
Be aware that a single user can have access to several encryption keys. That means that a user can choose to encrypt some data with the key of the Organisation and other data with its own key.
Only the data encrypted with the key of the Organisation will be accessible to other users of the Organisation.
