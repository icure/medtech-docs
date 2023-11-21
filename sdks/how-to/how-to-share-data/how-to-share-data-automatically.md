---
slug: how-to-share-data-automatically
---

# Sharing data automatically with other data owners

iCure allows to share data between different data owners, as explained in the guide 
[How to share data between data owners](/{{sdk}}/how-to/how-to-share-data), however this requires to perform an explicit request every time
we want to share a new entity. 

In some cases you may need to always share all data created by a data owner with other data-owners, for example you may
want to always share all data created by a patient with their general practitioner. 
In these situations it may be more convenient to use the automatic-sharing feature of iCure. 

:::note

In the following examples we use different instances of `{{CodeSdkName}}SDK`s, to perform the requests as different users.
The api we use are `hcp1Api` and `hcp2Api` to act as two different healthcare practitioners data owners (`hcp1` and
`hcp2`, respectively) and `pApi` to act as a patient data owner (`p`).

:::

## Start sharing data with another user

You can use the `shareAllFutureDataWith` method from the `userApi` to start sharing all new data the user creates with
another user. This method lets you specify with whom you are sharing data and what is the kind of data you are sharing.

The following example shows how to automatically share the medical information for all new entities which will be created by `hcp1` with `hcp2`.

:::info

The supported values for the `kind` argument of `shareAllFutureDataWith` are `medicalInformation`, `administrativeInformation` and `all`.
If the kind argument is omitted, all data will be shared.

:::

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:auto share-->
```typescript
```
<!-- output://code-samples/{{sdk}}/how-to/auto-share/user.txt -->
<details>
<summary>user</summary>

```json
```
</details>

<details>
    <summary>Data creation example</summary>

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:sample creation-->
```typescript
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/patient1.txt -->
<details>
<summary>patient1</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/patient2.txt -->
<details>
<summary>patient2</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSample.txt -->
<details>
<summary>dataSample</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSample1.txt -->
<details>
<summary>dataSample1</summary>

```json
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSample2.txt -->
<details>
<summary>dataSample2</summary>

```json
```
</details>

## No automatic share on modify

The automatic data sharing applies only on entity creation, and not on modification. If a user is sharing data with 
another user and modifies an entity that is not yet shared with that user the updated entity won't automatically be 
shared with them.

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:not on modify-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSampleNotOnModify.txt -->
<details>
<summary>dataSampleNotOnModify</summary>

```json
```
</details>


## Uni-directional

Note that the auto-share is uni-directional: if `hcp1` is automatically sharing data with `hcp2` it does not mean that
`hcp2` will automatically data with `hcp1`. Anything created by `hcp2` won't be accessible to `hcp1` until `hcp2` shares
it.

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:one directional-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSampleNotSharedBy2.txt -->
<details>
<summary>dataSampleNotSharedBy2</summary>

```json
```
</details>

## Stop sharing

You can stop the automatic data share using the `stopSharingDataWith` method.

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:stop auto share-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/auto-share/userWithoutShare.txt -->
<details>
<summary>userWithoutShare</summary>

```json
```
</details>

<details>
    <summary>Data creation example</summary>

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:sample no share-->
```typescript
```
</details>

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSampleNotSharedAnymore.txt -->
<details>
<summary>dataSampleNotSharedAnymore</summary>

```json
```
</details>

## Non-retroactivity

Both the `shareAllFutureDataWith` and `stopSharingDataWith` methods are not retroactive. This means that when a user
starts sharing data with another user they will not give access to already existing data, and when they stop sharing 
data they will not revoke access to shared data.

## Applicable to all data owners

Any data owner can automatically share data with any other data owner, regardless of their type (patient, healthcare 
professional, or medical device).

## No chaining of automatic data share

The automatic data sharing applies only to entities created by the user which is sharing the data. If `hcp1` shares all 
data with `p` and `p` shares all data with `hcp2` when `hcp1` creates a new entity it will only be shared with `p`, and
not also with `hcp2`.

<!-- file://code-samples/{{sdk}}/how-to/auto-share/index.mts snippet:share chain-->
```typescript
```

<!-- output://code-samples/{{sdk}}/how-to/auto-share/dataSampleNoChaining.txt -->
<details>
<summary>dataSampleNoChaining</summary>

```json
```
</details>
