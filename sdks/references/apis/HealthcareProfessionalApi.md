[@icure/medical-device-sdk](../modules) / HealthcareProfessionalApi

# SDK API: HealthcareProfessionalApi

The HealthcareProfessionalApi interface provides methods to manage {{ hcps }}.

## Table of contents

### Methods

- [createOrModifyHealthcareProfessional](HealthcareProfessionalApi#createormodifyhealthcareprofessional)
- [deleteHealthcareProfessional](HealthcareProfessionalApi#deletehealthcareprofessional)
- [filterHealthcareProfessionalBy](HealthcareProfessionalApi#filterhealthcareprofessionalby)
- [getHealthcareProfessional](HealthcareProfessionalApi#gethealthcareprofessional)
- [matchHealthcareProfessionalBy](HealthcareProfessionalApi#matchhealthcareprofessionalby)

## Methods

### createOrModifyHealthcareProfessional

▸ **createOrModifyHealthcareProfessional**(`healthcareProfessional`): `Promise`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\>

A {{ hcp }} must have a login, an email or a mobilePhone defined, a {{ hcp }} should be linked to either a Healthcare Professional, a Patient or a Device. When modifying an {{ hcp }}, you must ensure that the rev obtained when getting or creating the {{ hcp }} is present as the rev is used to guarantee that the {{ hcp }} has not been modified by a third party.
Create a new {{ Hcp }} or modify an existing one.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `healthcareProfessional` | [`HealthcareProfessional`](../classes/HealthcareProfessional) | The {{ hcp }} that must be created in the database. |

#### Returns

`Promise`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\>

#### Defined in

[src/apis/HealthcareProfessionalApi.ts:15](https://github.com/icure/icure-medical-device-js-sdk/blob/95efac3/src/apis/HealthcareProfessionalApi.ts#L15)

___

### deleteHealthcareProfessional

▸ **deleteHealthcareProfessional**(`hcpId`): `Promise`<`string`\>

Deletes the {{ hcp }} identified by the provided unique hcpId.
Delete an existing {{ hcp }}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hcpId` | `string` | The UUID that uniquely identifies the {{ hcp }} to be deleted. |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/apis/HealthcareProfessionalApi.ts:21](https://github.com/icure/icure-medical-device-js-sdk/blob/95efac3/src/apis/HealthcareProfessionalApi.ts#L21)

___

### filterHealthcareProfessionalBy

▸ **filterHealthcareProfessionalBy**(`filter`, `nextHcpId?`, `limit?`): `Promise`<[`PaginatedListHealthcareProfessional`](../classes/PaginatedListHealthcareProfessional)\>

Filters are complex selectors that are built by combining basic building blocks. Examples of filters available for {{ Hcps }} are AllHealthcareProfessionalsFilter and HealthcareProfessionalsByIdsFilter. This method returns a paginated list of {{ hcps }} (with a cursor that lets you query the following items).
Load {{ hcps }} from the database by filtering them using the provided Filter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `Filter`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\> | The Filter object that describes which condition(s) the elements whose the ids should be returned must fulfill |
| `nextHcpId?` | `string` | The id of the first {{ Hcp }} in the next page |
| `limit?` | `number` | The number of {{ hcps }} to return in the queried page |

#### Returns

`Promise`<[`PaginatedListHealthcareProfessional`](../classes/PaginatedListHealthcareProfessional)\>

#### Defined in

[src/apis/HealthcareProfessionalApi.ts:29](https://github.com/icure/icure-medical-device-js-sdk/blob/95efac3/src/apis/HealthcareProfessionalApi.ts#L29)

___

### getHealthcareProfessional

▸ **getHealthcareProfessional**(`hcpId`): `Promise`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\>

Each {{ hcp }} is uniquely identified by a {{ hcp }} id. The {{ hcp }} id is a UUID. This hcpId is the preferred method to retrieve one specific {{ hcp }}.
Get a {{ Hcp }} by id.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hcpId` | `string` | The UUID that identifies the {{ hcp }} uniquely |

#### Returns

`Promise`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\>

#### Defined in

[src/apis/HealthcareProfessionalApi.ts:35](https://github.com/icure/icure-medical-device-js-sdk/blob/95efac3/src/apis/HealthcareProfessionalApi.ts#L35)

___

### matchHealthcareProfessionalBy

▸ **matchHealthcareProfessionalBy**(`filter`): `Promise`<`string`[]\>

Filters are complex selectors that are built by combining basic building blocks. Examples of filters available for {{ Hcps }} are All{{ Hcps }}Filter and {{ Hcps }}ByIdsFilter. This method returns the list of the ids of the {{ hcps }} matching the filter.
Load {{ hcp }} ids from the database by filtering them using the provided Filter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filter` | `Filter`<[`HealthcareProfessional`](../classes/HealthcareProfessional)\> | The Filter object that describes which condition(s) the elements whose the ids should be returned must fulfill |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/apis/HealthcareProfessionalApi.ts:41](https://github.com/icure/icure-medical-device-js-sdk/blob/95efac3/src/apis/HealthcareProfessionalApi.ts#L41)
