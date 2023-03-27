---
slug: how-to-filter-data-with-advanced-search-criteria
description: Learn how to filter data using advanced search criteria
tags:
- Filter
- Entities
---

# How to Filter Data Using Advanced Search Criteria

All the services in the iCure MedTech SDK offer the `filter` and the `match` methods. They allow you to use complex search
criteria to get entities and id of entities, respectively.  
We can take as example the two method defined in the `PatientAPI`:

```typescript
filterPatients(filter: Filter<Patient>, nextPatientId?: string, limit?: number): Promise<PaginatedListPatient>
matchPatients(filter: Filter<Patient>): Promise<Array<string>>
```

you can learn more about these methods, their parameter and their return type in the [reference](../references/interfaces/PatientApi.md).
As for now, let us focus on the `filter` parameter.

## The Filter DSL

### Simple Queries

You can instantiate a filter for the Patient entity using the `Filter` builder class.

:::note

There is a filter class for each entity, the full list is available below

:::

The Filter exposes some methods that let you define a query to filter your entity.  
In the following example we will get all the Patients that a Healthcare Professional can access.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients for hcp-->
```typescript
const patientsForHcpFilter = await new PatientFilter().forDataOwner(healthcarePartyId).build()
const patientsForHcp = await api.patientApi.filterPatients(patientsForHcpFilter)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/patientsForHcpFilter.txt -->
<details>
<summary>patientsForHcpFilter</summary>

```json
{
  "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
  "$type": "PatientByHealthcarePartyFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/patientsForHcp.txt -->
<details>
<summary>patientsForHcp</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 189,
  "rows": [
    {
      "id": "00c0926a-4aa0-43f3-9589-fc735b9417be",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-db2c01bdca2377a4b92f235fc42ee718",
      "created": 1679920305842,
      "modified": 1679920305842,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+wopsvvv7@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "GkrmmmWRIBZ5op1xoXbCZHKxE21qt5fGwQ/FI8QTzrA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "03d42c21-1f27-478c-86d6-9179f32a537a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-ba13f29fa16e462a2b892893fd9f5899",
      "created": 1679929377199,
      "modified": 1679929377199,
      "author": "cf7bddc1-1df7-45d0-9488-ecde2e57abc0",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "uj598ar29-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100da8b8a2b3ebae02018509394828f388dd77085d62f3d8172533892594964edc0cd529031da699b7df5406c15ece42239eb15b1c00b04e9e3ca9d0e51909039073e89ac10698936fa0c86c3a74d8b220e36cc3d9707374ce196fb20724db3f535caca8c88e963ad44ea276ec8506bc9c84d90a38bd25e90a14754a48f9f730843e0b9a1fbc03e98393e3a746bd33f3fda1d537d6681c5ce30605bbdabaa37dd07edabd6c769c75ddec50cd87022e84c34aceaf9ece5b88d8a342b28f22b6ce4eb2550b1f9893c3817eca1fb9f16685e8aa5c05a3fe9d23f83ee522e7843c8d411ffd47103772919174ff2d1e5271e082f7724030d8e3d8c58f7e19a551f96380d0203010001",
        "hcPartyKeys": {
          "03d42c21-1f27-478c-86d6-9179f32a537a": [
            "108283468b7530d9cf9e18fdfc6d42b0a222bbf7507f2da02ed084af8f32724c0eb03f653b24ac531a65c0b5b1b9198550428c79e4ea4c1aeddb969c4d23b8d4a0f5e6d87c91f3625ab448da939ac21fd9b88e39175a61819a12b36a1ed8a2a777ce10c43c49b08f5dbbbaa08f526341260df300dc112cacc6cda9b32b1c6f439a287338856fe392ecf6cb2af24a55f56fcc2d3cd70b695503b2e91eaa8fd9e0facec3c43ee8c9ae9583286e94282f398d76112b54248eb85f998aac50398e1efcc8beff72d4580b41c6aceec0606cab13a33f282ac74caf7f5ea79700e35ab575bd49268210c1589ef16317d335d876f0acaa5b3c024735fc02ed1c0ecf575a",
            "108283468b7530d9cf9e18fdfc6d42b0a222bbf7507f2da02ed084af8f32724c0eb03f653b24ac531a65c0b5b1b9198550428c79e4ea4c1aeddb969c4d23b8d4a0f5e6d87c91f3625ab448da939ac21fd9b88e39175a61819a12b36a1ed8a2a777ce10c43c49b08f5dbbbaa08f526341260df300dc112cacc6cda9b32b1c6f439a287338856fe392ecf6cb2af24a55f56fcc2d3cd70b695503b2e91eaa8fd9e0facec3c43ee8c9ae9583286e94282f398d76112b54248eb85f998aac50398e1efcc8beff72d4580b41c6aceec0606cab13a33f282ac74caf7f5ea79700e35ab575bd49268210c1589ef16317d335d876f0acaa5b3c024735fc02ed1c0ecf575a"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "d643ff2be8e01f644d27e22cc4d7683a394ce19232c65e87371f90e99f117e44b647f67c365dd46486f3b8e8df2e4695128a0fbc454c545a5c75b701b97d1e1a06c4bbade02c58c227646d89e40c4159dab46ed7b836173c32ebb41bbf04664aee2e7d25b9d0c82fd5226d9042ea67c4cc8f31cd05c7c1e8b7407e0e337707a897e3ebd37e3f910ca7fe9619c60858a1e15746060f13af096c1a1aaa9a4d74a4d9bcfb634ab0f1d045d17a4b56dca2fb2ee6969961dd4ac0fee8d50525764086b033314bed27c0b4b41095914983d022a297cd38cdab6af2f4b9cca09c60b88b3fc1c67b8a4b770ab63d52732278d981810b7c3e1907bf70ae10fccc5f55a935",
            "2ae244d34079876bb1c4cd806aaa4c2fa439e12d54839506cde739124f923048ffaba569fc5c5670567de2bc7a7b17fc01494d28e80726575fd608e6b45b4d11d009aa0dc0e9b3248b03a0a9750f58dec4011e52d5050e90e520a0e898158ffd34d415493dc37d5d5c84156068b630b1a1576350edd75fb973e332c424e0dc5a94f3f1ed77fedb8017e052c94a7d43da2d3e0b633c54cea0395dbafb2dcdbd8c312665ed3e470fa24921de924ca281778e830727430f4d001cae680c16b40521eaa4e25a07b4a65e911de5e168e009ce845e5b3db1a8f22a2e8d73dca946ac20e8a909b17bd9223bd05a00858150f4b660b9d82734ba5e640722fbfa5b58169e"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100da8b8a2b3ebae02018509394828f388dd77085d62f3d8172533892594964edc0cd529031da699b7df5406c15ece42239eb15b1c00b04e9e3ca9d0e51909039073e89ac10698936fa0c86c3a74d8b220e36cc3d9707374ce196fb20724db3f535caca8c88e963ad44ea276ec8506bc9c84d90a38bd25e90a14754a48f9f730843e0b9a1fbc03e98393e3a746bd33f3fda1d537d6681c5ce30605bbdabaa37dd07edabd6c769c75ddec50cd87022e84c34aceaf9ece5b88d8a342b28f22b6ce4eb2550b1f9893c3817eca1fb9f16685e8aa5c05a3fe9d23f83ee522e7843c8d411ffd47103772919174ff2d1e5271e082f7724030d8e3d8c58f7e19a551f96380d0203010001": {
            "03d42c21-1f27-478c-86d6-9179f32a537a": {
              "3d8c58f7e19a551f96380d0203010001": "108283468b7530d9cf9e18fdfc6d42b0a222bbf7507f2da02ed084af8f32724c0eb03f653b24ac531a65c0b5b1b9198550428c79e4ea4c1aeddb969c4d23b8d4a0f5e6d87c91f3625ab448da939ac21fd9b88e39175a61819a12b36a1ed8a2a777ce10c43c49b08f5dbbbaa08f526341260df300dc112cacc6cda9b32b1c6f439a287338856fe392ecf6cb2af24a55f56fcc2d3cd70b695503b2e91eaa8fd9e0facec3c43ee8c9ae9583286e94282f398d76112b54248eb85f998aac50398e1efcc8beff72d4580b41c6aceec0606cab13a33f282ac74caf7f5ea79700e35ab575bd49268210c1589ef16317d335d876f0acaa5b3c024735fc02ed1c0ecf575a"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "3d8c58f7e19a551f96380d0203010001": "d643ff2be8e01f644d27e22cc4d7683a394ce19232c65e87371f90e99f117e44b647f67c365dd46486f3b8e8df2e4695128a0fbc454c545a5c75b701b97d1e1a06c4bbade02c58c227646d89e40c4159dab46ed7b836173c32ebb41bbf04664aee2e7d25b9d0c82fd5226d9042ea67c4cc8f31cd05c7c1e8b7407e0e337707a897e3ebd37e3f910ca7fe9619c60858a1e15746060f13af096c1a1aaa9a4d74a4d9bcfb634ab0f1d045d17a4b56dca2fb2ee6969961dd4ac0fee8d50525764086b033314bed27c0b4b41095914983d022a297cd38cdab6af2f4b9cca09c60b88b3fc1c67b8a4b770ab63d52732278d981810b7c3e1907bf70ae10fccc5f55a935",
              "223f55731820b91ccd18010203010001": "2ae244d34079876bb1c4cd806aaa4c2fa439e12d54839506cde739124f923048ffaba569fc5c5670567de2bc7a7b17fc01494d28e80726575fd608e6b45b4d11d009aa0dc0e9b3248b03a0a9750f58dec4011e52d5050e90e520a0e898158ffd34d415493dc37d5d5c84156068b630b1a1576350edd75fb973e332c424e0dc5a94f3f1ed77fedb8017e052c94a7d43da2d3e0b633c54cea0395dbafb2dcdbd8c312665ed3e470fa24921de924ca281778e830727430f4d001cae680c16b40521eaa4e25a07b4a65e911de5e168e009ce845e5b3db1a8f22a2e8d73dca946ac20e8a909b17bd9223bd05a00858150f4b660b9d82734ba5e640722fbfa5b58169e",
              "07b5d279ad7ddb604de1c30203010001": "d117471ddb3078b24d4813cb8d5631d1ccef69e547b8cb85fc1ef09b6cfc8522baf028068709e17fecc2290f41eea87a508655579c7bc51bbdad7dce159856e79aee9bf9d39becf945bf7cd108e24be6045262bade45b92a6a7bd81b39df74ff173d3416b7387eba09d6a93b274ba6da2df2b8a4e875f11efd3d9f32e36cc972b63622cb4beecea270aba02a0e083608481e2927561ae9fd0484370b2f641a55fbc90c9ceabef6219c93f14c8daceb49340787431e55dae394024115a203819d610672e602bed01f3fda475489b030aa873c009ada4661775b47f5152da69576fe13424db5d98f1370aca2ed550296ea06dc5a5b98164c3184047ff583f5389a"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d73a6930a70cad7aa1c856679ddc502f8dfa08822f27db6a517b1948a07ce3c97123b1d8da524612b6041e2cacca4139ed0ae8e067fb64ef033a31b36b2d756af0ea2f4f933540d65b99953fbdd1e3d7badbd3ec452162394d433d08b28d1f125288344d36f5a1339b4e69776194cce7e7dc0077ace862db92bcf9eca9aea405774a3aafe011408fecc6e9ad362812ef36f5cafef741c6f541480b44b115ed10510f348086c6daedc82b25ee5ac9feaa6bfdd4336735b6b7f6620d9fd970bb60c432f7b7665427e271297543cad03576cd1ac12a86938df1aced718e9d41673dfad1ff8e2b8a80a0ec502ffd7434b9074091885ddc07b5d279ad7ddb604de1c30203010001": {
            "03d42c21-1f27-478c-86d6-9179f32a537a": {
              "07b5d279ad7ddb604de1c30203010001": "6f7fc3be3fb1f9892dfaa75341a318ae348e8ce57324a5680efec1e9cdd17275f274a40315db31c4b8d6d899efb7b03a393978f9343f6c0e6b82a1ae06d209a93b7d203c4162def32f26fa5f7982b56b4ebe3985b730493cca3dce7b38bdf2b846a83ba94bfd8c6940c485144a51ce4d5ca687be4ac40a4de3bd949126a5994ccca3d8700aa7b566656e427d9cb8964f1bc265f48e7ad1eadd969170cfeee57c6b5d040804840fc41ae1630c8e8c53c69fce63429d6b9c2c59f1ee54d3c3111f6add8e52c7c90dbff533ee6ff17637b71118a6927c6a30cd2fcd42f211f8f760883b006edc5147fb0da0bd8fd8412ec73ff5fbb5a6ff8de81a64110bbcf10389",
              "3d8c58f7e19a551f96380d0203010001": "19f6a9ea9cf313c3a537b581a49169f7ca3bc42288c6ce66aec399771f5764b800b333c4e1919babb2eff60c4ea9941cc46b006bc1202a61a423622b3bc1c5bc01687b2d3a8a6228b667ef2d6cced4ccf90152c803787198bd01857ecee1c278eabe60597a42e9e98d5b801cc24cfe0e4d6c0fc5a0d3360a9e9efec3ae423a684a61a7c84a91afd960960117133611ab72f76bedb80040faa0d9158ec9bc0d9610a6796664661b6cd130f1cd70df166c1afca3d4691a3e51ffee478306f93c57ccfec111400895c33e1bef5c84a12370a02a67b1d7569bcb1ba3cde194b6b21608436198fad9c56dba64ec2035e620e24edf0e5ae2975e2a63980a0229f547f9"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "07b5d279ad7ddb604de1c30203010001": "433296e4ce93de73da55beff769468b5d6e02f45c6fb0b356d4d063a7ace1ed6b3c8cccd9ef5f87f679b6e2b4b1441b3ddeede204c9451983691ef503417575f5dd37ddbb9ab2f93f5a7789dbc7afe85cc5a44938a5e435ac508d5fc0ca952417c0a03721fb5f968953dc972d91e8a52f15025171876ee055f3598453fa72ad43d59546b13866c79c413f91df21f4edd49b6efb81f977847708796334885723d6d4ef0b063348e9ed40db15073be329a8a4c2a81acfd1aaf8f5e981e6d9e77ec4c17b51a4e1cc14488fdb6b0c2b8ed31c568b4eff0e269a63568341f852a3dd00e1d838902ce1548482a1d301343103d90b32aedc440b8cc97eec6d66f2bee77",
              "223f55731820b91ccd18010203010001": "9fef2e378967ee4b3429dd18ff217cb4ff63bcd6aa4874fcb985b73f731df248378a8d06263e539f2f605561a505a5ac81b28c6ffe280f7d1d66c77668c4cfe617985390dafbc4763069656065485809339ffe3fb9e88191477e7d8f63fb5973882c17d658664bc1c5e6221cef212496b9a0fbb0ea95c36aa30e1e8012768217790e92720320fd0a2a1c62e87b6af9cadb9a9960a3b7baad562d6f88cd840e4dea8c423c4377dbe2dbbc1e479eead1b13a3046ef6797e31fd9d3d5534856c6974efc922b87796d26f841502b06e0ae20c1dc1b3376fd506cef798ac275cc05f45dcebc2c558d239608f231e496abccb0307c3aade4d24f033b4a6e898bdada31"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100da8b8a2b3ebae02018509394828f388dd77085d62f3d8172533892594964edc0cd529031da699b7df5406c15ece42239eb15b1c00b04e9e3ca9d0e51909039073e89ac10698936fa0c86c3a74d8b220e36cc3d9707374ce196fb20724db3f535caca8c88e963ad44ea276ec8506bc9c84d90a38bd25e90a14754a48f9f730843e0b9a1fbc03e98393e3a746bd33f3fda1d537d6681c5ce30605bbdabaa37dd07edabd6c769c75ddec50cd87022e84c34aceaf9ece5b88d8a342b28f22b6ce4eb2550b1f9893c3817eca1fb9f16685e8aa5c05a3fe9d23f83ee522e7843c8d411ffd47103772919174ff2d1e5271e082f7724030d8e3d8c58f7e19a551f96380d0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d73a6930a70cad7aa1c856679ddc502f8dfa08822f27db6a517b1948a07ce3c97123b1d8da524612b6041e2cacca4139ed0ae8e067fb64ef033a31b36b2d756af0ea2f4f933540d65b99953fbdd1e3d7badbd3ec452162394d433d08b28d1f125288344d36f5a1339b4e69776194cce7e7dc0077ace862db92bcf9eca9aea405774a3aafe011408fecc6e9ad362812ef36f5cafef741c6f541480b44b115ed10510f348086c6daedc82b25ee5ac9feaa6bfdd4336735b6b7f6620d9fd970bb60c432f7b7665427e271297543cad03576cd1ac12a86938df1aced718e9d41673dfad1ff8e2b8a80a0ec502ffd7434b9074091885ddc07b5d279ad7ddb604de1c30203010001": "628b0c90a76f189c98e6a1a609a69b92a187a51bd5fabbf4bf70dec61de0d61d2e48c97319f9b0ba4c9a40b499744a1053653b846dec81b110c52ed788b80726fde6b0f116a5ab280f9b2c0708fa135d4607012e9acc8ffee1fdcea81012c04babc0719cfb41aeee796b7c46b296abddd5cd55026ec89345ff6ff8d226a7cec36b9b4798d1db0b4a88321be5f30fee4a42a2b2c625dba0fe3d5410a26cd1c56a3e77cd482120b8c4cf9039220e4022207a78882ccc83039a9d1c4ca99f0f48cf55db2246eec25dd3fbdbc22f17223dfd2f9bfb92655870cea655a21beecd34bed87faafed8bf8335e1b4ef201fabf854928d4d402e5c9b45772d5f7babf75e332bfd8d7113426785e043784abadcbc8cd7f426e2e8404923223a3d543d0779a6feae3a1a1b127b4b9d6145639ed4746c124479b433ae50f723470d084c2fc62f4dc4b02d6cd38c8e4f4e447516a59ea49df7a4640c05c250a5ec3994ad3e1f3ae307587cf6a69c5804c0bc81b05f65f663767ab6472b2607490d53c2d3bd5b41e57f1c1ac8eb19edee79bce5b630d9f48c0087f8ba5d7477809624dbe9d6564399735da96a8a62fabc5b7c1f4574b4ab48fddf36bd806cab89c6dc70df562d6e2481f115d3267f08bca68ed11d9a2e93d8628acc7f963d40c41fd185f0d9976a6a72cdd997db5708b9577767ec0e36350863594495a087a7a57560ba215e8bfa44b043574ba6add8a273c34ecaef6717a380cfa488094075b01ab7ceb5c8e0574f206a6ffc08024cdb1825bb77cd9d4064e60596543e90f7e58099f677eb86781b5d6dfc6d5ee6a268cb59e4b9a13da4164864197a87baeca70a49ab21d0ff10ec6721c1e5a0464a468579a48c5895261514278cfbd6135ee3039ee1a1366fad9813f52bcbda10004d32122c595e66b2c9329a21ad96b50e245fa4a649c616a519d98cc6282c83315d9e0c88da9b94f2d79142d66fceeb87bd70e48440395906a35b2626605f2946814522e25aad23f8afc42351fb3ac5c709971d1f1da4053f405d5aa87d7f387fc4d520048929603c547b8e1289b6e5a47e9ed8153f3e99fbb05ef56331ddd77b2bc437395cdcddd43ee0b36d9056514ed5347369b161daa174ab8f62aa115c518d11c6d5e435e226ea1e00315c59afc5e7cae96e888b2273276ba24f85c68bbd88351a5dfb9ac71f70aa5b9787c2d080f386cfc579508f493f274fe40b00242bf467388f24d98bf847f0994563aac6c0e70a55ae667def0ab8a5db4e77f781dce908fc5eef19922b71dbb33b5709e9071aaa43cc6b2f3e9a5412e4dbcdde92a1f916ed11bc7d26a55f34a08ecd03d4b9f14cac9da408e14977f535a575cc9e4305e9bfb9d1c0ee2133d55119cf69652d793ceeae4b8af0977aca7c7cf1ed3c3fe7c628683184a58a0d1adac784a736c4452450425abdbdf8e337c74b66d23b27200101dba924452cd8e5bee3216d3dd312bab1b9593daacc12292651f17c8feebdf42ceddfdaef2626febc17b799dab0702da8c84cb50e666821bc1e612aab3397e8815095265ea352c3f83053ee26bee45b275e11cbb09361f6c7d18217d3c1cebe8405ec48951d50e2ada93013030637f654168c17d59c873b5ef8a92ce355f4111c142e0d6ffbe33f4d7e5b64b53d71d99b7900f00d0bbad1f6810b690e9f32579b50e06770a331655c6902e727de57a0e85e83c5f7f40003bcb199d0248c2d76f2a76ec84b21a123923fca985d6ed8405a312829e5c1"
          }
        },
        "encryptedSelf": "FIlFyPoRyQ5CQo0knP8bQkTKHpnLXC1/Ukt9dnwKd0w=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "03d42c21-1f27-478c-86d6-9179f32a537a": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "03d42c21-1f27-478c-86d6-9179f32a537a": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "0692fb7e-3b3e-430e-8b3b-9f3ab0e77339",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4a8d10e122afe23b4d4f3bc9a06b37e7",
      "created": 1679929406525,
      "modified": 1679929406525,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "LU0jhw/GylGgy215I5TTtevMpo4KGUaFSmq0MGuwpGUmueNQ46nWFy12rTg865nH",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "06a2adb3-28cd-4ec3-98e0-f0aa16c8adb4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-f4591fb6afaeb533e77d2433d0be9ed5",
      "created": 1679927891850,
      "modified": 1679927891850,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "mIbOnxoXCuxsrWFRQf0NPzh2lL7CPBfA5qH36IW+7w8HV9wDiDE+08qfykAOKrL4",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "0845fd80-c94f-46bb-b0d6-3416a74b791f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-772eb119fb38530812461728aab33866",
      "created": 1679925852628,
      "modified": 1679925852628,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+shl5ov5p@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Pyu6RGXkm2VWnLyUsulgOYc1jObacYl+iI2OG7Hx93w=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-016d3308490a074a3dea849d4ce488b8",
      "created": 1679924351562,
      "modified": 1679924351562,
      "author": "82bdd9de-3235-4ed2-a8fe-a1644617b152",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "0byinmfcb-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ed276889925df2786d77e34a3f642e7a1b77f6ce7e48adbd37b7c4c515b9d71996fdcecea23bb7d11d6e94ded545f8dfeaf8ea013f9247ce94a2084f31e221678c959c2f2a3a70e43ff2db08a85839d68bc430c599187725bb3b77c2a56a21ba5819d6fbc6cb6533da8d27549e4c18fc98925c2c1436348dd20f7e186fd4b20a65ce69bde551ae62ecaa8d81f3939ceb2687d51c374260b7cd4d6793cd10adab74da1dc1ac0a26bafde2749f2a37ef37ba64806b8dd1903142f929003ad39e32f8d3682ffd742f1575437556dbdff68184569486666566a1d0d9956260a82ad09782c7416013f1dca093892aee6fdc84cd1cb6880f70294e5ef3f74163261db10203010001",
        "hcPartyKeys": {
          "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": [
            "4fb0d5610f76c491a30c5202f59a5c686de007c93e38bcdd21bbbff677e1bf19ba77bd36a79e007f27d93d6a42acab58fad011624ad47f850da915043814fb3bbb69c384f33128e7c4145863ed2b8f0118322c89ceaa03a3d71a1b5dcd7f78e973ad4f364236c45313c11d8036ec9fb676a32f2b66677728152403ad5819e7cd76991df304d55a4a2e8aadd2f05dcfc6df993df1f740375d88fa063a85e28e42972a9f168e56e5b4884b72a5d63d23bf40db9af6abff0971ad560a1f475b2e911ccaf96380e4c1de04502d76a0c57af3177b8538a7a572ce298eedc5eed6e0e4d2b0a5491e350534164a3060eeedf38a6494798951ee5cc201fa2b3694d8eca9",
            "4fb0d5610f76c491a30c5202f59a5c686de007c93e38bcdd21bbbff677e1bf19ba77bd36a79e007f27d93d6a42acab58fad011624ad47f850da915043814fb3bbb69c384f33128e7c4145863ed2b8f0118322c89ceaa03a3d71a1b5dcd7f78e973ad4f364236c45313c11d8036ec9fb676a32f2b66677728152403ad5819e7cd76991df304d55a4a2e8aadd2f05dcfc6df993df1f740375d88fa063a85e28e42972a9f168e56e5b4884b72a5d63d23bf40db9af6abff0971ad560a1f475b2e911ccaf96380e4c1de04502d76a0c57af3177b8538a7a572ce298eedc5eed6e0e4d2b0a5491e350534164a3060eeedf38a6494798951ee5cc201fa2b3694d8eca9"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "3b53f72249b6ffee7b16c989732d9d61182eff6a227a08c9ac57544f8e18c1a04f13cbec1b9ce20a6620c1814c28d72ded091f5f1cb87f5f94380c27b42cfa17dafb5caf6224e605dc42b8dae9e1dab7fcab33233c267b60d968e289884eafb3b6d505cfd4c4165557dc3aeb3ebe4b9149875195b872f156ffb19635cb8304836d9535b0c7c1b6ac2ec281daf064379410eb87a1acee73ae223dae6be173a2dbeaf8f7766aa975783082aa34b455e8efc115a86d2081382cc1730cf6cea58dc39c45d009ad5fbd7d47f7856579865dff65482170f2941aed59f76281e5ec441b803325bf910e343ea26d43a86cda8546e08bee5aff749287d374834ab244bb4c",
            "5242f9a49e89b94355e7e3bda0cbe996c0bd01985ca8c9e00329afe72edeae7ddd44608410b5ce41fdafe1af63ad79cb44eaf2ed95b2046a5f914bcc4e6af58d4dbcf75a5d67fc25f9f4650b77c0c5e6f2064b2e2bd0d9c303c8161cf7be6e0c21efeb0023b144498f1cdf3296526137915ddeaae9b1ed61409fb378567e41832325f596649f25ca77af707dd1dce784cb9eea7018459c9be97f7aad48e3d952f16d936bd95f885747427085689cc613a9b76a0527b927a36a7eefd8d93d2ddb408e4f4970bff8ec8b59aaacbc2bc3fa69b7c0fe55c9bd062cca78f1bf7957fb15c0fd9ca1c74e3cb6eef4d1c9c26d2c69f811a26361ab1c81d3f647dce2eab5"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ed276889925df2786d77e34a3f642e7a1b77f6ce7e48adbd37b7c4c515b9d71996fdcecea23bb7d11d6e94ded545f8dfeaf8ea013f9247ce94a2084f31e221678c959c2f2a3a70e43ff2db08a85839d68bc430c599187725bb3b77c2a56a21ba5819d6fbc6cb6533da8d27549e4c18fc98925c2c1436348dd20f7e186fd4b20a65ce69bde551ae62ecaa8d81f3939ceb2687d51c374260b7cd4d6793cd10adab74da1dc1ac0a26bafde2749f2a37ef37ba64806b8dd1903142f929003ad39e32f8d3682ffd742f1575437556dbdff68184569486666566a1d0d9956260a82ad09782c7416013f1dca093892aee6fdc84cd1cb6880f70294e5ef3f74163261db10203010001": {
            "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {
              "70294e5ef3f74163261db10203010001": "4fb0d5610f76c491a30c5202f59a5c686de007c93e38bcdd21bbbff677e1bf19ba77bd36a79e007f27d93d6a42acab58fad011624ad47f850da915043814fb3bbb69c384f33128e7c4145863ed2b8f0118322c89ceaa03a3d71a1b5dcd7f78e973ad4f364236c45313c11d8036ec9fb676a32f2b66677728152403ad5819e7cd76991df304d55a4a2e8aadd2f05dcfc6df993df1f740375d88fa063a85e28e42972a9f168e56e5b4884b72a5d63d23bf40db9af6abff0971ad560a1f475b2e911ccaf96380e4c1de04502d76a0c57af3177b8538a7a572ce298eedc5eed6e0e4d2b0a5491e350534164a3060eeedf38a6494798951ee5cc201fa2b3694d8eca9"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "70294e5ef3f74163261db10203010001": "3b53f72249b6ffee7b16c989732d9d61182eff6a227a08c9ac57544f8e18c1a04f13cbec1b9ce20a6620c1814c28d72ded091f5f1cb87f5f94380c27b42cfa17dafb5caf6224e605dc42b8dae9e1dab7fcab33233c267b60d968e289884eafb3b6d505cfd4c4165557dc3aeb3ebe4b9149875195b872f156ffb19635cb8304836d9535b0c7c1b6ac2ec281daf064379410eb87a1acee73ae223dae6be173a2dbeaf8f7766aa975783082aa34b455e8efc115a86d2081382cc1730cf6cea58dc39c45d009ad5fbd7d47f7856579865dff65482170f2941aed59f76281e5ec441b803325bf910e343ea26d43a86cda8546e08bee5aff749287d374834ab244bb4c",
              "223f55731820b91ccd18010203010001": "5242f9a49e89b94355e7e3bda0cbe996c0bd01985ca8c9e00329afe72edeae7ddd44608410b5ce41fdafe1af63ad79cb44eaf2ed95b2046a5f914bcc4e6af58d4dbcf75a5d67fc25f9f4650b77c0c5e6f2064b2e2bd0d9c303c8161cf7be6e0c21efeb0023b144498f1cdf3296526137915ddeaae9b1ed61409fb378567e41832325f596649f25ca77af707dd1dce784cb9eea7018459c9be97f7aad48e3d952f16d936bd95f885747427085689cc613a9b76a0527b927a36a7eefd8d93d2ddb408e4f4970bff8ec8b59aaacbc2bc3fa69b7c0fe55c9bd062cca78f1bf7957fb15c0fd9ca1c74e3cb6eef4d1c9c26d2c69f811a26361ab1c81d3f647dce2eab5",
              "53835f5fe4178b9756a5550203010001": "8122f68590961071c4fbdbbb843648403ad691ede528eeab2092522b0edbe7244eef79bbe2822f95c053eb0605ab1a98479c1d02e1798ef80c7446445bd39a12f6326abf903c276fcb4a2175477d63a94ffdd66bb2aa3be1adcb542947924a7d12ed65df9a8661bf17a7a55a9b53729c1f90070da28df1aec7936ebe9e1da434235eb993a8de87c52132371ffcc2e667cf68fc1a6f6c0b912bd669e6e666680a4193cfe4b5322b0b4e084f08cfb5ba97c6dfac44a8ae2bbfe9264dbbc4e9a10ecd89a7bf26d6e34f740ae47dd704d06b38aedee9decdfcdbcf177eaf6ca47f6aef7f8f1e17db4cbb17bc2c3da30158689df455a5d48610a542ce84d295524fca"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100de6f56b118c5d5ccf2a643a0a6e0f255f8eca847852c48a4ea9e23dd0f30e9f42f4d4ded244906d4d7fef2ed2c1dedacb9c89250d480766ef92877e968610b6731d94741dddfe2169d72be8b126e17fa38dc2d2f5f2ec89dfa1d65ecf210afb9b1ae4f3112257b2b89d3aa093c03b1d17c839e53d71d57101d7f9961fc02301ca73cddb04ebc469d783a124d00b19d90e3bf1023223bac447ff3489347cf7d203e6b32a9eb982f0c200e9f37585f7435b94682f0ef343f273e9b5452f86fed7504b00b0be3064f70f2916997e5b2749f22608bf357026ac92270ef5d1c48d98fde179e4091062e235246952a5ee76c78094e80aaf153835f5fe4178b9756a5550203010001": {
            "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {
              "53835f5fe4178b9756a5550203010001": "2102ae20de3d39c146869529dc1e27772a5aa8dba6a1a5ca9ac8659af9a1d6d5f2c44bf408c23f6dd829567acf48dcd1acdca2db7af7601d38d4fbf78b84662fc0b342ebef2cefcf879d7e9fcb035c60fbe82bd8931fa35936c2520e8c32a3450590d56a649e6ce1379043de6ccc801d9a6e0f01d8e9442b2493e74b5bc1f64e81a07a11df9fb9103b04a1283f0533bc2050d1b16e71d37ecdbd874a9d7fc5a07e01ed1bf14d03f61677958e0f23294b66f976bfec4eeaffb49908b7779076e8a270a76143c9686327a526c73ec50a151a8c9096169c999c31adfb20ec519b820ea95adc4c2be49ec648cdc39a3043b40fd877dc37b59d4dea904f0aca260f94",
              "70294e5ef3f74163261db10203010001": "8d79b9dc7ceefa4410bf40eb80834c3d0740af2254e1f8ee704a0e79930e03e9e0c85448ce07f2906d05ce4d13893011fa03568035e9e572c5d5a8288dd46537335811f1b18f52cf7199edcaeaf4f6811cf6c1b5a930a7a6b27d7423389ddf4b4a3832363ba683658a203af5329c20fdd0078ccf0d189fe72ba1b88c6b9c9efbc4c0869dc11ed3c34335dd9ae31bfe47630e05f58a0b494c2168dbe86b96c3f9c25df5c276c92156e94407a620cf92bcb0546c737ca6a71b6df0735f35dbc054cbefe4b79ebfc8e4fc530852c76c0f7e56624bbff2036cb179f9fff5749193a8f9517d2e2abba85d0156fb4efd41a41a8306e3eaf95cb3d07280320d7c794706"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "53835f5fe4178b9756a5550203010001": "98b094d08c6f2b85a9c41bdf457f3d16348988af65ca076c71a552472beeb4ba9d2ef6467d23faa2c4dd8b21bb66ed2ba527d3049b46e70f0f586592b66337d7c8114a44c88000b66a7043a543c09eee8579bc54734581f365b5d293c74f522f0bf422e40b2e01531095af1a39136c4ad252e2b6335e4041556f839a20bb273bc14e7feda2e583fa1a4676ebfe967e7a69681ea7cd22aef882c1f4288e0bfd7651e996545896d497f3c9625f798948a782253ccdb213c3929f3e2dba7fd1e73bc5666cd92085a67d2fef9bf3b6ba2db769ca36d9f230952ffe2a6ebf6dc495b6f9e11dfd2dc47866a293865e7e73082e5843523334b452e5c016c3c79adb7d1c",
              "223f55731820b91ccd18010203010001": "0f390066ae64ad7f67ff8f3c0444755fa8a2971d0b15f7baf607a795363668ac9ba508486d7c5830561d924433bc1183575a84a0684ccec9e6bcde14f0a1ea324f118dc23c34c8d29cd3d502d3ec3e8c6ae9a0fb1c385aa93db87ca2f5e2b76ed359edb802e22dda9915de02b252ee83aa7379729b3a7f29f86acada1e65a96ec2ce8a864c5982c4b6596fdeeced2a5b5883ee2d423ac1445624b5865c2346080481573f119ecf574cc10a2168fa687ecd58a352539ec083a4072d879a9e62105f8a883bc8ef3933f1f00d03e2fd6c0dd097ba39667becf9424516891159fff2a1ba30ca39ac9ebe73b02342b1ca30a2b0145f0869857bf728121cde65457e0e"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ed276889925df2786d77e34a3f642e7a1b77f6ce7e48adbd37b7c4c515b9d71996fdcecea23bb7d11d6e94ded545f8dfeaf8ea013f9247ce94a2084f31e221678c959c2f2a3a70e43ff2db08a85839d68bc430c599187725bb3b77c2a56a21ba5819d6fbc6cb6533da8d27549e4c18fc98925c2c1436348dd20f7e186fd4b20a65ce69bde551ae62ecaa8d81f3939ceb2687d51c374260b7cd4d6793cd10adab74da1dc1ac0a26bafde2749f2a37ef37ba64806b8dd1903142f929003ad39e32f8d3682ffd742f1575437556dbdff68184569486666566a1d0d9956260a82ad09782c7416013f1dca093892aee6fdc84cd1cb6880f70294e5ef3f74163261db10203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100de6f56b118c5d5ccf2a643a0a6e0f255f8eca847852c48a4ea9e23dd0f30e9f42f4d4ded244906d4d7fef2ed2c1dedacb9c89250d480766ef92877e968610b6731d94741dddfe2169d72be8b126e17fa38dc2d2f5f2ec89dfa1d65ecf210afb9b1ae4f3112257b2b89d3aa093c03b1d17c839e53d71d57101d7f9961fc02301ca73cddb04ebc469d783a124d00b19d90e3bf1023223bac447ff3489347cf7d203e6b32a9eb982f0c200e9f37585f7435b94682f0ef343f273e9b5452f86fed7504b00b0be3064f70f2916997e5b2749f22608bf357026ac92270ef5d1c48d98fde179e4091062e235246952a5ee76c78094e80aaf153835f5fe4178b9756a5550203010001": "75ef3ebe310433bcab966542df0be7fffdb4de13c9f359213fc9be29e579a17d3172be92d170c63780be09a3b54db45f54e813b12374e6b81cb46ab5d9873b5dc2e2e6bb812135ed0ce429d3778fb0c7b6aa4d8f9fa823e86db3f5624acd2736bbaad796cf70013c87d32b65eaf3ced23702e8612922ddbbaabef335a5e9172aa31f2f0fdd58d9c87b190480e2c56175da38dbcc76f01c6b9a03c729cd48632ef2ebe296054db0eeb3b6b54bb023d1feef9cba33c829014ce4516fa5467e0e5466ac9f92f4e75123bf932fca0bc6c4db23abfb7db2ab63e8f373ee934d5ec9ec6d1b380ac50dbae0574e0d46e634c7a62d169330bc3244ad89fedd6b8d99250a2c05abe4371f424c4269a621a351d45044708c4064a097a8d1f93462599896c3827e8a89435460ea874b4b6052e0d9bda8e0fd7bfa91c30af68d9761573d2afe119e32394443d82798af592562e0fbc163b6da5b0392172d46252d2c68e85c2a67405332d8b72996a14474aef0a35ba5544a2f94aa154735fdba4908d1d3e28a4d9f4835ef9edcc60006fd287ef0d460d45892bb312d25730805218b1dd2c7899b8b4bb1f6acc2c9dd89c296dd27ea70f51bf51f7c80369a636cc7904e377294a3cc47a3e63795b43f5f2c54ae92fa24c5c74144657d3543fba7459980542fc3bb4027964f313cb2e65223590c528a489b2011ccb2c4554dde92ba54bf10195a4866605594c68278d8b39d1252634f3a99545502608673a709c0ea9ecb1485e0027093fb2f3fda4ac8f4b90c112dcd7eae0744c1149084604f24a56a920d9600338a62f55f7bf16e6a6ff720455e953cd89ffe3516ec96d3c30ca7783ff112c0af3a943a2b969d837b8090309a7a932a64ae4e1cc38372f8c169b375459b5c6d6586dce4fed8d4dd2a75fb05880a008a4b54ab5edfca3a88dbca2c8a5c005ead6950bc348cd2495ed2918bc14f4b03482ed2f3151839ec92e844c77b7ca1093f6d82eda617f08fb0f5f08d9a73b7460ce4378392dd150cfd2122aaedb010562133e6390e8ef5b5f37a4e3f409dc4f4081d6171a419aa0657330a68cbad03136e0b6711a5195a4552ac2706d4488e18f028d8898fc9176353dc75ebfd690f75fe8d37821d81757c6486aaee46979066735de473720a8ad0dbc748636c0e2a50fa0f030647c7ebf54ee148840be1ddacecd6df4dec3e80528156837477e4453fafe6a6ed5f9172ab64ef68d21583d47c6cbe76ba895c1f04bc364cd5e08c4da6c6bab515edd1a35da8b4c3050f9a5c062c5898765a3f3fe8652e912cbebce4e33dcdd8ff4d5fa770c6b824a46236d37343b66dc7a69361b7f5c1b30c4f0d8cd09b489c6ad92ee235b513ec2050c53d487d64d05e2b437e07b2bbe6a5e67d0470b7875138059eb0c07da91a03e5dd808064fb9cad2ae0bd761b0244be7b3934a87f8d8a85f4b76b28594ca5e17729a8bd58825cd09446b1a028cd40b4495b211eb31ffb14d7a44ebcf2053356dade0c37fa739da17f91a30cd2cd46fedda40c4345570c8f5cce7f88f92b92f7ceb925a66b437d469a1ac907e368333204403145472872155d1f50fbde463d7a26395239ff1e755ca3c9462e9532e71dcd50576b4380484a5f6dbee9f5c4b31e0d75c62cc7ed01e1935de377bd7b236e624d9db53a7f690c49e473394f6e0f8ea3662ae26a4cea16bc6506745c8d1e184dca956ae90ab8f8a276e5b60846485109b33ee672e5fe37dae9a4699c145f231cf862cc22"
          }
        },
        "encryptedSelf": "G3NriRUpUDXw+qsvWMsH6i6VkAGztbET6i2KroNQQCg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "0ced21aa-3ad5-4ba6-8c91-c6e2e4ffaff2": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "0f5500b7-f0e7-4cc3-acf4-ff6c3a7a8377",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5a796ae1e7614ca722a15c1c3a0d048a",
      "created": 1679924677160,
      "modified": 1679924677160,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "KENGoKlIfM0oKA9cCT/2QhbmfR3WB+MSFyKX2DtxQgM=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "11a39ee0-c896-4a4e-a261-0969f60a109c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b41b4d02737c927c6295d8022bb9e585",
      "created": 1679920638035,
      "modified": 1679920638035,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "WHa7KWHctnORaRdmfc8Zw/iIaLnA/p5Eq/GERHt+E6ergw7peZFO2wdE8UwmC7Zj",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "13a7498c-a03c-4537-afbf-5e7ace8fa6b9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-7725334bc35a22d7661860ddb28717b3",
      "created": 1679923815400,
      "modified": 1679923815400,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "0phBNsd2j8qavgyQXfgGipPvmHCMRm2dgXM6/4AvHBmABFK9ofdjstgcM7SwrLIc",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "170e8a97-c08e-4f85-a8e1-406b2b0a5362",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-28be9ecf04a95bc4d2c5e86e0681a1c7",
      "created": 1679928188988,
      "modified": 1679928188988,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "g2pkAaUBHqzYITXTevaIfQVKHvFdmFezS5xmbzSFu19wkZRklfyf9EBl8IcMk2Bk",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "1778a91b-73da-4f01-863b-de8748cd9734",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-03611707d6b4a62fe832a9505728f215",
      "created": 1679923807381,
      "modified": 1679923807382,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Jk+zFYv+UtuCC7c1UkmHQinUlVHFuh++9F6HA6ZmwajdCN98XDetBZ7lnl/pGpIq",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "1d043c36-c843-4aeb-899f-0561e832aedf",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1d53c7184c6a459abe930755478b33af",
      "created": 1679925814849,
      "modified": 1679925814849,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "d070ea55@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "cCvD8SdWh2OoHBKZngYFyE0hwG9LsftsqRixjtvfYYo=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "1f9b06bc-6977-4ab4-b7e9-bab2b81b57eb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-28e167b018ecdd58d7ff3df9a493a685",
      "created": 1679927902952,
      "modified": 1679927902952,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "cseGk5Kib4Nti7yampcnosg7/DuCy5pa0aQpGQbPLkma2PUVPHfEgBvlsRXnLTY+",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "20da859e-442b-4791-8507-031766d805c6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fe2810b9de7b554c80f6af8e3fa59a19",
      "created": 1679923800135,
      "modified": 1679923800135,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+mhoama2yi@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "yY6whUkTd4tkeOygroq+h+3tM7VZLngynGBG9/M1O4U=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "20fa64fc-3963-452c-8448-275dc6904bed",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-83c72d41cc73f43b94fe33fd7cc0d2ac",
      "created": 1679926574468,
      "modified": 1679926574468,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "mLy2u8PYLkYyENhjJ8p4drNtWNCmImo4Ll+EQKaGv5qHqbH2mQ9+LSiPUkQU4JtT",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "21f475ff-d295-4a21-86bc-dbef393f7920",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7c0e038184f11d5c06df8c1ddaed03a1",
      "created": 1679926252834,
      "modified": 1679926252834,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1rHPloFs9DcT1NN1q627IHC7CSLmVmnCSK2nj/HiJPndss2x2QaF58GNvygOQE5L",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "221e04c0-7197-42f2-a955-192b0ee9435a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-9452a1420dbc942fcd04426a234ddebf",
      "created": 1679920665667,
      "modified": 1679920665667,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ibdSByF2haoLHRAY6Ivg9RmXOFdU1QIeZC0wCCQtk3h1/A/9xWXKitB+qDoqxEED",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "251df84d-e759-4c64-9fb0-4d427772a4f3",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ef4d775fd52b903cd9f3fe94ce6c2b07",
      "created": 1679924419514,
      "modified": 1679924419514,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "13xHGYnybbd/C10FIAadNzIkZo/SvkzucpYme49zEhE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "25c2f3b0-4d0d-4c4e-971d-8203285707ec",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-f9d572ca305e93dbeade0246ca3e1232",
      "created": 1679926565255,
      "modified": 1679926565255,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "9V+AVnE7LYmGj//hmVxi2cmuOMGe7NL3M7JZM0zdIQ4lB3NMBJ78E/zxCy8HNlWg",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "26e0959f-775b-4572-9b40-4c60b1fda72d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-1146987490c4ceb82a636e18b3739697",
      "created": 1679927168809,
      "modified": 1679927168809,
      "author": "18373c7b-2285-4544-84bf-aef3a324c9d8",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "bj8e2jmd-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a02820101009b8da36daad05aaabbc68a58388c0c4dcb0b7cffc73b761639f6e35410227edf6bebac793b2969dc69cf4d0e7b2942d7aa6c4ee516b49ed46c7188d0796cd38592bb26b5ec3af39c64c15abb6fda169b684899c580471f4c98e7ee945ffea413fb9ac14b158568ee93f29f83b2aa050c0aeed374f88387fa6ab8f35301122e8bd1aaf8c17306c95d86b3e9e956ed60bd98d2af3407234df937bf7d9e8985ffc1a5eedaf8d2aa2faa94af6f55deb9cd19af9714d597599f42dd0602a374cbb9f8c283b5ed6c262cac7f8dcac621eca63f7054a32925e6cab887ea3c5e220bbd688e065859cab370c1d2790dbcd1b5519b9f1429a481924542a1148a3a5089797d0203010001",
        "hcPartyKeys": {
          "26e0959f-775b-4572-9b40-4c60b1fda72d": [
            "8d6df4b15bbff607a22baef5281593126ae923644731ac7b7abb76ef7f412a32936680ba57332b1a91c0a66a3ac422085e9b5a02ba2520868535307985a39c0b3e6471f8a28ed735ef07b202b076fdef9dcdbb07aab066ecd5c1aa5eb32db6b80474098df7bb05250716491ed2119de729367153748fb3e67729d09bcf968fee77c2c698e7ab205d8abc1f5c35f69cc20978d722210283d848ff18acb9b46fa552982cfb8293759f3911a38b7f3dd2bcebf36d6fb4a4566f3107307e2167c3fc9e79afd8abe50adef937a9528573ca0484b02a71bc2e41046339ded474d785f639b465ae15da9805370f76a949d3ef618f20b07d9f013bd2a68d8f4fca0460ee",
            "8d6df4b15bbff607a22baef5281593126ae923644731ac7b7abb76ef7f412a32936680ba57332b1a91c0a66a3ac422085e9b5a02ba2520868535307985a39c0b3e6471f8a28ed735ef07b202b076fdef9dcdbb07aab066ecd5c1aa5eb32db6b80474098df7bb05250716491ed2119de729367153748fb3e67729d09bcf968fee77c2c698e7ab205d8abc1f5c35f69cc20978d722210283d848ff18acb9b46fa552982cfb8293759f3911a38b7f3dd2bcebf36d6fb4a4566f3107307e2167c3fc9e79afd8abe50adef937a9528573ca0484b02a71bc2e41046339ded474d785f639b465ae15da9805370f76a949d3ef618f20b07d9f013bd2a68d8f4fca0460ee"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "5c6415e2d4c679b83b2249a218385db0c54504f381708a87adbf2f37d90a590488b91330e141fb94059946ebe13490ed11f7cb98bf0f05027032d944dc25b40eabf6fc5425d468e95f8bb9643d0b1586311e2947b1c2db01d072519b5c29fb1da11916232ca5f05e2d5b536b2476ffd72c59613c2eabe3a16283a8ea4b232ea47d9a6baba0a42b03ea5e6a1110feb420a48ef4a434e97dcbfb2c5c3fc84aeb84f4d96dafb175849689cc02a3f5664bbd59a948585767dfd48d26002425945be16685bbbaaa6d024c3e79f88746b9d964342ae355a90c659fae24ba521b8f816a18051e4e011e60f22cf02f8c8a35a33267e4e88fec5a306aad456571b60e7315",
            "887ab34573661b4f746960b825137679132ff3e8d832489afbc3d607b830d63b7a6e959ce6472edbd94bbbbb96be6ccbb52b399e6c286054970cca3b4046d8b609de355fb51f4634c440210ac66700a6ce03f52039581701d761d6102472751d550dafa2aae11a98429827c50f13e82d0912d4f2dc2945bdcb4bffad4bc7ac24b69af67f3bf59a2a230b8e13435eaed9cf3b88970c5ae6bd9e3a0d5dbe9a503291adf780ab74351799840ea574a67faa8b1b22e02ac9d5eaecf777dd3256276ba0c16c82ab5bcf41450308c4ab8819b410fda7ed922fbfd780ab29e8cf7649964748fb8791876cfa40078cc3f7817674f3d96d6d266ecd0a0ba38198936caf86"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a02820101009b8da36daad05aaabbc68a58388c0c4dcb0b7cffc73b761639f6e35410227edf6bebac793b2969dc69cf4d0e7b2942d7aa6c4ee516b49ed46c7188d0796cd38592bb26b5ec3af39c64c15abb6fda169b684899c580471f4c98e7ee945ffea413fb9ac14b158568ee93f29f83b2aa050c0aeed374f88387fa6ab8f35301122e8bd1aaf8c17306c95d86b3e9e956ed60bd98d2af3407234df937bf7d9e8985ffc1a5eedaf8d2aa2faa94af6f55deb9cd19af9714d597599f42dd0602a374cbb9f8c283b5ed6c262cac7f8dcac621eca63f7054a32925e6cab887ea3c5e220bbd688e065859cab370c1d2790dbcd1b5519b9f1429a481924542a1148a3a5089797d0203010001": {
            "26e0959f-775b-4572-9b40-4c60b1fda72d": {
              "924542a1148a3a5089797d0203010001": "8d6df4b15bbff607a22baef5281593126ae923644731ac7b7abb76ef7f412a32936680ba57332b1a91c0a66a3ac422085e9b5a02ba2520868535307985a39c0b3e6471f8a28ed735ef07b202b076fdef9dcdbb07aab066ecd5c1aa5eb32db6b80474098df7bb05250716491ed2119de729367153748fb3e67729d09bcf968fee77c2c698e7ab205d8abc1f5c35f69cc20978d722210283d848ff18acb9b46fa552982cfb8293759f3911a38b7f3dd2bcebf36d6fb4a4566f3107307e2167c3fc9e79afd8abe50adef937a9528573ca0484b02a71bc2e41046339ded474d785f639b465ae15da9805370f76a949d3ef618f20b07d9f013bd2a68d8f4fca0460ee"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "924542a1148a3a5089797d0203010001": "5c6415e2d4c679b83b2249a218385db0c54504f381708a87adbf2f37d90a590488b91330e141fb94059946ebe13490ed11f7cb98bf0f05027032d944dc25b40eabf6fc5425d468e95f8bb9643d0b1586311e2947b1c2db01d072519b5c29fb1da11916232ca5f05e2d5b536b2476ffd72c59613c2eabe3a16283a8ea4b232ea47d9a6baba0a42b03ea5e6a1110feb420a48ef4a434e97dcbfb2c5c3fc84aeb84f4d96dafb175849689cc02a3f5664bbd59a948585767dfd48d26002425945be16685bbbaaa6d024c3e79f88746b9d964342ae355a90c659fae24ba521b8f816a18051e4e011e60f22cf02f8c8a35a33267e4e88fec5a306aad456571b60e7315",
              "223f55731820b91ccd18010203010001": "887ab34573661b4f746960b825137679132ff3e8d832489afbc3d607b830d63b7a6e959ce6472edbd94bbbbb96be6ccbb52b399e6c286054970cca3b4046d8b609de355fb51f4634c440210ac66700a6ce03f52039581701d761d6102472751d550dafa2aae11a98429827c50f13e82d0912d4f2dc2945bdcb4bffad4bc7ac24b69af67f3bf59a2a230b8e13435eaed9cf3b88970c5ae6bd9e3a0d5dbe9a503291adf780ab74351799840ea574a67faa8b1b22e02ac9d5eaecf777dd3256276ba0c16c82ab5bcf41450308c4ab8819b410fda7ed922fbfd780ab29e8cf7649964748fb8791876cfa40078cc3f7817674f3d96d6d266ecd0a0ba38198936caf86",
              "3cb719d49f8adca7798e410203010001": "2e15d8f704c3e4d8600f2b00401091796931f78a8b7fddc623cebdfe257ef9972641f655e76f245244f62758720ae059b6fb8b1b04bd242268554d0e7fc50ad0f8262c921231a7cbe73a576f86d23515b3f4d5dd369bc798186fca1ad34df25196e35d14e50ff4de9c47d0eaa5bdc3c3156c5f6baa938320388e3384930cdedb8d6a5b004ce27cce9bd8ff34fb9116e2051f9cd1227afdd7114ac33b244298b50ca2c37fdac5db830f5bd8f477d6142c2b7c0bc3d6e76c7e95e920cfea9573be00456b7a51177597b38c963797c8b9896aea96bcf62430de52b0810cbe66aa13ff0d72109ec13ce0ee0dba71c8188c6d93df528296b2bd9dff9b5b8df98fc2b8"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d3cc6ef61bcb6becfe49090bee4b0749d89fcc886537c6092e9131fcc29a55c037642a08945748515d5b64cc86bd62772777b4d35d570d60bc56adcbcf2079a90004fbd87da29415a142ba09388d5d624456ebe0738ac907667fb413ee83ed926b1ad7bc9a728fc313b8ac56bf85748502437ad78d5beca0888c3e81f86c6f3b508feb9c2556fc25d08151d576898b0a8fe47d05311b7ac0f7123f15f1dca87e35c75a726ef2aa0ee6baa408b7b4864407b5b623f03847a42463499dfb226fdb541f80ba840c4b9ebf8d49c79de791a0cb93dfeb3d562f156c0f5c239001005843a85939f06bf09212e0ec7f70ac05568a2a35fec23cb719d49f8adca7798e410203010001": {
            "26e0959f-775b-4572-9b40-4c60b1fda72d": {
              "3cb719d49f8adca7798e410203010001": "9f8d77fa3d6b7f35afadb895dea0f8a8d11acf27edb0dea54b8a2d09b202fd2a9fd96059a5428599cc60e0f762e83d1908b0033b2ce649977ae90d01bb59d665fe5aab6477200884d09dd82eb858be79267250e7b5fd4cb8a6763f512bbf825b27b982ee520a8effbcbb10c0db54b69ad7eb7b5fe6403b93fe4fb3a55d6dca851bce166bf39ab5af2527ec9c99c05ad850f1b316f9608a69bd8230539f6e23bc0423d8539ae81ca8ba4ca302cc967cfa1d37f6b57ffd73da1adac4b400706354892407d6e6bb2484be35a7325984197915ab97475c2a118b1a4048df1f82a4256523fe276a866ff7f3bca95df9821e6c10858a3a7db34c8b294f8e8b05092c73",
              "924542a1148a3a5089797d0203010001": "7d245dcf21e0b06245ba52480a34a1c496b90a94d86d6fd2c6ded83f163192da3e7e8ecaa4db8cb0fb283ada4e9572f409996f5f8682b7f50b0b3c76322b6c0c1220e858d413ca19236d85d14e43a46ac8d7406f8de728a6013f06999f44c35d60c2c59967192f59ccabd15c87eedb2f86b321ddd95b74963f6b831707476e644b01e84770ed09ee4242bad07de41db0a6f37d68627948d3a53aac929700d5114cb4e5881b016ce1ed73f048ecc1271e982bd3c3881c85b4cba642835688c48e29f77c107a4ec005e7fa9f2945a8cd57b7f6ec0e5557cd01dfe3bbe94c9a88b73a6bcb8df20e0727922bc01418e8d35c7d329792b8ae0140c0d251b52b4b392e"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "3cb719d49f8adca7798e410203010001": "ba97c7477db8d92f253b7af43e4f99a59a3b7b8f398c0c29089462ba706efe975aed660405b9a0a41fdbbd08de5b547b6ef35e01a899dc3cdaaea4a81d4c872d07d84408e6cf01f98fbeb8d87f750be6f3be4ba6ce68210b07355aac5034cf116b96e8928e3237704e882505ee7035feb467ad5b753984996f27f045bac07b796b705394c528ab528e5792d681815d94bc35454bfc9c23048203d46a542db5e9fa9a26ad804cf98cc2af056adc318385120bb788de7fcc0e84481fa129aaf73567b797d803d3ded351cdbb2e8f0af6e0a7c620112988e72eae290ad1ea64f87c737a8185b611fa5930557fbd5266b2976ad20d5f6cbfdf8166c615a2b5ca7796",
              "223f55731820b91ccd18010203010001": "2aca4edde6c829d77c5e47f58edbbce2e3a211f9395966cef236ddd635eebba9f78f2171a1cdf0b49757b6fa101d9849c27b2b2dd1169200bd82e8943d2a815714dc690261d3d3a9b049f5906232d63e42ef542c94ddbe310b9fbb6890bf3b6ce036f310ce6ba3dd595c1bdc1be455872d781c93fa815ecb71df478f5996fbee4a30d15348ca28e9a8aff52d23c97732f089a47674225c86ee5a3180dd144b5f0d9253eed87594d9295f387c481ac2d9557f24d71cf3b43ccc0ce9f6e105593bc6c3473efd737495bdd1db5f11bc04d5e07e1a9d90ef57c15ee9de990f3ff76301084296ad162e3cd9dc2000aac27a6a3d97ccf48c787ed02fff64b9fefafcdb"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a02820101009b8da36daad05aaabbc68a58388c0c4dcb0b7cffc73b761639f6e35410227edf6bebac793b2969dc69cf4d0e7b2942d7aa6c4ee516b49ed46c7188d0796cd38592bb26b5ec3af39c64c15abb6fda169b684899c580471f4c98e7ee945ffea413fb9ac14b158568ee93f29f83b2aa050c0aeed374f88387fa6ab8f35301122e8bd1aaf8c17306c95d86b3e9e956ed60bd98d2af3407234df937bf7d9e8985ffc1a5eedaf8d2aa2faa94af6f55deb9cd19af9714d597599f42dd0602a374cbb9f8c283b5ed6c262cac7f8dcac621eca63f7054a32925e6cab887ea3c5e220bbd688e065859cab370c1d2790dbcd1b5519b9f1429a481924542a1148a3a5089797d0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d3cc6ef61bcb6becfe49090bee4b0749d89fcc886537c6092e9131fcc29a55c037642a08945748515d5b64cc86bd62772777b4d35d570d60bc56adcbcf2079a90004fbd87da29415a142ba09388d5d624456ebe0738ac907667fb413ee83ed926b1ad7bc9a728fc313b8ac56bf85748502437ad78d5beca0888c3e81f86c6f3b508feb9c2556fc25d08151d576898b0a8fe47d05311b7ac0f7123f15f1dca87e35c75a726ef2aa0ee6baa408b7b4864407b5b623f03847a42463499dfb226fdb541f80ba840c4b9ebf8d49c79de791a0cb93dfeb3d562f156c0f5c239001005843a85939f06bf09212e0ec7f70ac05568a2a35fec23cb719d49f8adca7798e410203010001": "46df0934e84846eb31e576dc119b9f30ea4f396a2c184cd436db3546a5d6313270f2edf9e00dcdd0088a820fb1df9f36c97f078c246b645370caa022e162770e704e3a3f2df93e7355d1f262c3a4e91137b3e53341ee347f05fabe3a5cbad7a08430bd9b839d3fdb507763032636ff552acc1221adb2dabf0acf5d7cf004bb5118c20286dcb1067f5b5f51f079cfc05a4a5540ad4f93fddbb9f633ea819db8490ffc6addbfff553e26f3916e32cd13a70c75150ecc345daeca57ce66c6aafbc7e59c6987e8fdcd9aebb33528c7b3d0e217e4eac27058d71072842ef7ff17de45648728ff6791aff8a3767317b68f94e5d0f38495ac7fb76d6602f63699a32f550872831ff36f8c1ccb12df3af5dfca941c7b217568dff525df28572c84ff865a756cc020e134f595f9cbb97d28728fdd5796673164e5497aae75453b54161a602c60aa4aba13649c6dbff17d3f74cd0b214d715af52ea5719e55bc7c4f494a24de681c30b7b3a400935af25dade03012f4962798d13d725b0aed21931dd0544941db8e79663589a2a97fe0ce08b02d942895e5ce3e1e0b74c0306dd8d5e33cf0d75885a0642558c097e34557936d905da47382cdcbf6edc17d0729ada2ed5ab563bd45925bcfd7b4d9963b6dbda0c05be3b2caa649068373a1337fb29e795bf139825b1dcf7087ac2eaba6e40b9c644fbf86da0891d5251ac4e94c9fef8dab92abf52a9c7cac5479b716d59730009c23962b617c6797b3a8a29d74194dff650a6c183f8471f5f39e7c8c4ce694cf9c7463a3445715056bcb6687efe8ac8cbcd8b0884ffe8074283466cdd064fd930442b87b580643ed989e194f5235a57d74e1427fe1738b15fec364ae0832bbdd0ccfb6bae99f79b5d65c9143270d60a5bb82e3d051048dc75cd8b0883a092a44c4a6f379e58d6599c6b2681deb8879e0291fd3780ba938051d4b1fe124126bb3f15760c2efb8717122f91cbe9c10458867646e11e66512e9dbac180770b0cd1c83229089acfa7fffef2fdb0015371b49b01c289d6673259468039daa140299cdf26f25cff3f1423c124101586409f49007abe73170a1ea70e192dadfc1deb6145a4af49e1fd8809cbc36d86f96e2004bf598681e01ce96cf8f7c9f87b71d3f3425bb2fb4725ee3ce9eee655c93eb0ae90c4952a96b8d10de73703c2227634e0af2c02989b3314d98caa95404f8b76d0fa4bd4b1ddd426c9a2c081e91d99c900294bc1318863dbe927e90528bfa74550204226dda10f2c8d7bafdbaeae74759bc0b86116fd95d3f77e2cc3d1608af587c47fd00fb65b1d5ac458e5a239ad58699147a433236334e22d1b768d9a06cf2b8e20d0a74aed9bb4545af98f5c9f8b7d8379449b1cbd5e61d69b2f8d2a9ed8710f8b50132fc9bb6f218c6b6a2239af99a6d549baf86270eda310789aba29b769251cd0074b12f6aa280ac25374d6d0aba4b8e6a5cd1e914552c589aba28dd4468dab3706fc639bb479894376bcc8e6fda9a8418063978768708db82d35b9ce555627f4c58b3477708dc5c2c55135e2ce88d6f06f624b358b26feb60715ad1bf6b86d5d508826023415c88691bdcd292e8ecca6a9e8d47142f13f3c01a9896eb1683eaae51e377a7465f192ff5bdd7cf81cf554845bc87f4e0eeeb6382eef25a2a1a039b4891cb5a413b7cd61f33e5a17d2dbfd514d04b62115d5a96bb9d8e1c95ef8f8d9cbdb16d0f6952ecd5df394ccf18928d888b6849657973b944860de6e6cdae"
          }
        },
        "encryptedSelf": "MeiM4XxD7kkDQWmV6opI3XhwFWNQQyiKOhcECTF54g8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "26e0959f-775b-4572-9b40-4c60b1fda72d": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "279b2783-e021-45ec-a20d-c98edba8c04d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d11a8830ce9b205b74cafe66f38cb4db",
      "created": 1679920303551,
      "modified": 1679920303551,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "oOnn0YI0JrcERqJAm+MThciRLxfHCxs9sixW4zqGJzYB1gx2pEOB9HxMLplVnI+h",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-cbdf5946f8996e0665e6608876cef55a",
      "created": 1679928166067,
      "modified": 1679928166067,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "baba14ca@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d2010965fd398ca18c6036c755a2174e1fda105be21daf0730d76f3bc91ad8e8ece74ee4b98e81cb97f09695a9f4000da4eed4451acd25a0e8558c6fe78d4dce037777ec9eb19c60a606e60cbfd9267971ecf4b09d0fdfd745449ed3f029f4b78c3fa39b48e43aa7d4243efd96fe2a03681a4698e284545a239fe7e2861959bbef2bea69a5390d5cce5f450253f1d26c1d6fe906a2a07ce3e64d6053bd7d19099c1bdf2148226e588589f92e43ad46a98fc5e3e688155b0cbc9329fd92ad68f97c0be638548348087fbc474bea3a5d1e3b06bc18880b2a861ccade6e830d297210f96a850930ce7e3630b38b4b1fe0c9fa963eaf02a841c31a2638bb431e858d0203010001",
        "hcPartyKeys": {
          "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": [
            "5bbe37ab1cf60f81025bfa049e2d6e762dbf2b3546d3ace9084d25e717d988e1f339effc3cd34711544a16df5fa25a149d79ea2d8b05533789cf44a5cdb2fd8470448a1be2357c712f098ec7fd8e34482dd53c4b1e30dc4657e7e62ccf63a3be7b9258f4fa0470ca73b73b95004a02f46203b461fb94353a40580bb87251db7e8a4abca46dc6ee9b564f431b1c9ad437c4992948d771bdafe1ed3b06fcc721d302b9591576ac46e16bb5b138bc694261ad984b6b7d2c90ad9ac2e54d3c26cdf043f8ac38d6dc7ef619ef1486c306d33aa320065b7bc741ee811cd102889453884cff053fc31b6400cac07eb7f41cd7a643d2790cb938f2c2433ad80b9f268bfe",
            "5bbe37ab1cf60f81025bfa049e2d6e762dbf2b3546d3ace9084d25e717d988e1f339effc3cd34711544a16df5fa25a149d79ea2d8b05533789cf44a5cdb2fd8470448a1be2357c712f098ec7fd8e34482dd53c4b1e30dc4657e7e62ccf63a3be7b9258f4fa0470ca73b73b95004a02f46203b461fb94353a40580bb87251db7e8a4abca46dc6ee9b564f431b1c9ad437c4992948d771bdafe1ed3b06fcc721d302b9591576ac46e16bb5b138bc694261ad984b6b7d2c90ad9ac2e54d3c26cdf043f8ac38d6dc7ef619ef1486c306d33aa320065b7bc741ee811cd102889453884cff053fc31b6400cac07eb7f41cd7a643d2790cb938f2c2433ad80b9f268bfe"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "a79ec0b6749e79bfc670b2cc664f27d6f17deec72fe3782b7e12c6f8e971cb60ddc96449b5dcd8888bf3612df5385bd1febb5aaa3b78f0e0edfc0316524557e2760ba7c47bd02b906f70da9e1d9ad36947d2815a4345bd9fca1496a1045e3f1d340ad225be519b21c11a5b2f4fc29f1ce798065318aefda9fa08dfa9b97d26bd0a8305b85eb3894e01b1c06ccd2fce99e4b3db411f22fb32076b749762ddafe634fb845968d2d629b6ca328fd6d3e5a8a61eae7d3a05556fa78d78423f03a54650a588b6a34817f4994e4afcf21eb5097207caf2a2c365ccd01d751d61675802f61795eed4580ccf5f333b31fb3fb24b0d336c1ee0f3f361a52c1fd92e1e8934",
            "5aaad6d5544ca27d50f470d99da16686d23b0150ff65fe1f3acb582cd9cac0c7b26c1ebae44282a23e9bed9571ed49d83f23df45cb7af1789e61e72b9903b94365bc6c97d23c8823fbb37b4d561f83c0def0f5ebd5ffae7904584017e218a9583853ae165d03a0cfee82127e1c5b1bc6e5940f528e7b9e4e15eefebc75ec7777f43ed83b99b316fa38ef44d455982928d694452d5a0395c151d331c8e0eabdb6e8e69b84f8554ac7692add9e574d3c9b685cd6fe9cb6a9821a11773af7eab20c48219c4d933f66e5e1b4351c2c38f015a7db9007ccfd4903b44734327ffad3f3f602f1b295630595606b6794c960bfaf8bb7ffdabb9bc84d59f8aae4256dab6c"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d2010965fd398ca18c6036c755a2174e1fda105be21daf0730d76f3bc91ad8e8ece74ee4b98e81cb97f09695a9f4000da4eed4451acd25a0e8558c6fe78d4dce037777ec9eb19c60a606e60cbfd9267971ecf4b09d0fdfd745449ed3f029f4b78c3fa39b48e43aa7d4243efd96fe2a03681a4698e284545a239fe7e2861959bbef2bea69a5390d5cce5f450253f1d26c1d6fe906a2a07ce3e64d6053bd7d19099c1bdf2148226e588589f92e43ad46a98fc5e3e688155b0cbc9329fd92ad68f97c0be638548348087fbc474bea3a5d1e3b06bc18880b2a861ccade6e830d297210f96a850930ce7e3630b38b4b1fe0c9fa963eaf02a841c31a2638bb431e858d0203010001": {
            "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {
              "a841c31a2638bb431e858d0203010001": "5bbe37ab1cf60f81025bfa049e2d6e762dbf2b3546d3ace9084d25e717d988e1f339effc3cd34711544a16df5fa25a149d79ea2d8b05533789cf44a5cdb2fd8470448a1be2357c712f098ec7fd8e34482dd53c4b1e30dc4657e7e62ccf63a3be7b9258f4fa0470ca73b73b95004a02f46203b461fb94353a40580bb87251db7e8a4abca46dc6ee9b564f431b1c9ad437c4992948d771bdafe1ed3b06fcc721d302b9591576ac46e16bb5b138bc694261ad984b6b7d2c90ad9ac2e54d3c26cdf043f8ac38d6dc7ef619ef1486c306d33aa320065b7bc741ee811cd102889453884cff053fc31b6400cac07eb7f41cd7a643d2790cb938f2c2433ad80b9f268bfe"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "a841c31a2638bb431e858d0203010001": "a79ec0b6749e79bfc670b2cc664f27d6f17deec72fe3782b7e12c6f8e971cb60ddc96449b5dcd8888bf3612df5385bd1febb5aaa3b78f0e0edfc0316524557e2760ba7c47bd02b906f70da9e1d9ad36947d2815a4345bd9fca1496a1045e3f1d340ad225be519b21c11a5b2f4fc29f1ce798065318aefda9fa08dfa9b97d26bd0a8305b85eb3894e01b1c06ccd2fce99e4b3db411f22fb32076b749762ddafe634fb845968d2d629b6ca328fd6d3e5a8a61eae7d3a05556fa78d78423f03a54650a588b6a34817f4994e4afcf21eb5097207caf2a2c365ccd01d751d61675802f61795eed4580ccf5f333b31fb3fb24b0d336c1ee0f3f361a52c1fd92e1e8934",
              "223f55731820b91ccd18010203010001": "5aaad6d5544ca27d50f470d99da16686d23b0150ff65fe1f3acb582cd9cac0c7b26c1ebae44282a23e9bed9571ed49d83f23df45cb7af1789e61e72b9903b94365bc6c97d23c8823fbb37b4d561f83c0def0f5ebd5ffae7904584017e218a9583853ae165d03a0cfee82127e1c5b1bc6e5940f528e7b9e4e15eefebc75ec7777f43ed83b99b316fa38ef44d455982928d694452d5a0395c151d331c8e0eabdb6e8e69b84f8554ac7692add9e574d3c9b685cd6fe9cb6a9821a11773af7eab20c48219c4d933f66e5e1b4351c2c38f015a7db9007ccfd4903b44734327ffad3f3f602f1b295630595606b6794c960bfaf8bb7ffdabb9bc84d59f8aae4256dab6c"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "J3Er2+ksEDhYhRk2Gaz9tjdY4V3wZPGVDVWhkPR642I=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "27bb93a1-f9f2-4932-bc89-fc78b0c52e3d": {}
        }
      }
    },
    {
      "id": "28032b87-7cc1-409f-bde8-a914e664a2c8",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-434530c73444718ed8313a26b4c55816",
      "created": 1679924626308,
      "modified": 1679924626308,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "2LW5gHnOeLmToI52eRishI4fFvsO8tpylGUx9WZ6TapUARhLixfadtNvCJQsLyUG",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "282f6fb9-9caa-4ecc-8ea7-f2e8434d19f6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e669f27d2798d970c6c43e657fef9aaa",
      "created": 1679924347413,
      "modified": 1679924347413,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "4AU0kdQSytVe3XTpa/WcgkFSmw8BhHJHTZIvW1keS3AEHWlEm7ijIBHAnf8wMQYF",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "2ca82608-87e0-46aa-8295-cc4bf0366a3c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-a7969845749ceeb79673898284109391",
      "created": 1679920263138,
      "modified": 1679920263138,
      "author": "8dec4a36-dcd0-4619-b078-219a76cb60a7",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "ojedaqje-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c928dfc1fb2aa9b8a1e208aa164cd862a67e0aec2cb3aace7513afeca70e185f194e55e6f90e6e794b7cd18009d5947dc5c1d22d56a383d935b96ce7055506e52b4f3791a36e87a6bf62d5530763f960d00ad1dcd08e2dd61da87b12a6a743d29ed5cfa14c5017fdb81b1274ed8c8beba47ee4150bcdc8d9cd9d4a7a72ce31640dfcf85fec7de10d8d1157b6f7ba650450657b4c1ca201b76ed894585e04abd5223bda434787847e4fafcc495496477a7dd9f67e3170435a0bcbedad4b1963b673d288b8697b664523b94e6f3b6031234320ba4b4e121d02e1dafea24b6b971097bfefbb52e2d843ade28a84fcade50a694564a913003174c872dd2545ddeef10203010001",
        "hcPartyKeys": {
          "2ca82608-87e0-46aa-8295-cc4bf0366a3c": [
            "1c25e220a3e935a8847042f027adef46347c39bdcf38e25873cea07cad7d89a58433803eb7d7b629adf88b5cc12da6fc4eff55bf804dd0a2507f156e3b0add645debf4564f64189edd9f6f7a5ed260e186abf1abd82f18b6287a02b107356fb24179b9941a0dabc3473023fc878aef66678f6b5155e2b97e3360205a41fb362d590a899e6f19d0e0b1964e0673a877d1c4443a93b963967262e70645f1a92f3c4cfa0ef4e2db3b4a86c0be06ed5318cc4cce1750a1cc7e044d39866b0feecf26ee528dea8a2c77cd997389e11d4793f931e79e7a61ed295bd1e79bea45fe238ec1b083dc0e2f5b0277c33364d5cb26e69e63a5c8fbca284329eb65892a1aaca8",
            "1c25e220a3e935a8847042f027adef46347c39bdcf38e25873cea07cad7d89a58433803eb7d7b629adf88b5cc12da6fc4eff55bf804dd0a2507f156e3b0add645debf4564f64189edd9f6f7a5ed260e186abf1abd82f18b6287a02b107356fb24179b9941a0dabc3473023fc878aef66678f6b5155e2b97e3360205a41fb362d590a899e6f19d0e0b1964e0673a877d1c4443a93b963967262e70645f1a92f3c4cfa0ef4e2db3b4a86c0be06ed5318cc4cce1750a1cc7e044d39866b0feecf26ee528dea8a2c77cd997389e11d4793f931e79e7a61ed295bd1e79bea45fe238ec1b083dc0e2f5b0277c33364d5cb26e69e63a5c8fbca284329eb65892a1aaca8"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "71156fa3da8bdde48d767003fa9a3aef56e4dc53138f1537fde0fc4b6133f0d3220ebad7db38a85f1607fa6a3aeb7e047197a20d2cf8ebe92032fd98e0de50e1426be7779ec49160e2a0a426993a149884578b47868e7e07afe607faaa615db353f254ef55a664e43e400aa2c8066d5f3e5acca65c3501b7f584dbd5b32f120ab5c331a06f6e75ec5c53090bbb51208d58d1195998abad7fb472ffae8c87d67d556cdb6b24ae5a8eb1757c00d4d93cde5c1fb21a4d465957315fe2e4de5675060d5bed6639383b37b364e6b0a70a780f6e7b54db50c1140b2a6e470fdc39f3307edd4087bfe9ad390b718faed4a41e24cc23b208fed596e1fd34e7fb689d35e6",
            "be8e86bf5e44a53bf3bd36071f809c40b68fc4b015807e53023857115f5f7ee69c2439dd3c653ef58c9eedad5592ae6d8b464c6bcb90a221fa10c26f58a07e8ce5a7ce3140629d275747e33d9e1eed298501f66ebb3fa61ccd859d6a833feb8d37b893870ebcd51dadb649f07d3368c1d3e9b5acdd40b836d09e6516bca7322100baed5e6c570a0d65595b5e72c83063c9634184d6a6199e7c574a0c9028358de8a0c4e0a6145241b066bc30d4d78673aac321293030a3f45a04f432d53083d1f1b07f62db84d423faee412a625de8e5f3af6f45ad2f73c52bd3e0af6c24867190d3fa1c7ff948807f656c770fd175f9e261096faea275c3ced4c13647e2e4e8"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c928dfc1fb2aa9b8a1e208aa164cd862a67e0aec2cb3aace7513afeca70e185f194e55e6f90e6e794b7cd18009d5947dc5c1d22d56a383d935b96ce7055506e52b4f3791a36e87a6bf62d5530763f960d00ad1dcd08e2dd61da87b12a6a743d29ed5cfa14c5017fdb81b1274ed8c8beba47ee4150bcdc8d9cd9d4a7a72ce31640dfcf85fec7de10d8d1157b6f7ba650450657b4c1ca201b76ed894585e04abd5223bda434787847e4fafcc495496477a7dd9f67e3170435a0bcbedad4b1963b673d288b8697b664523b94e6f3b6031234320ba4b4e121d02e1dafea24b6b971097bfefbb52e2d843ade28a84fcade50a694564a913003174c872dd2545ddeef10203010001": {
            "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {
              "003174c872dd2545ddeef10203010001": "1c25e220a3e935a8847042f027adef46347c39bdcf38e25873cea07cad7d89a58433803eb7d7b629adf88b5cc12da6fc4eff55bf804dd0a2507f156e3b0add645debf4564f64189edd9f6f7a5ed260e186abf1abd82f18b6287a02b107356fb24179b9941a0dabc3473023fc878aef66678f6b5155e2b97e3360205a41fb362d590a899e6f19d0e0b1964e0673a877d1c4443a93b963967262e70645f1a92f3c4cfa0ef4e2db3b4a86c0be06ed5318cc4cce1750a1cc7e044d39866b0feecf26ee528dea8a2c77cd997389e11d4793f931e79e7a61ed295bd1e79bea45fe238ec1b083dc0e2f5b0277c33364d5cb26e69e63a5c8fbca284329eb65892a1aaca8"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "003174c872dd2545ddeef10203010001": "71156fa3da8bdde48d767003fa9a3aef56e4dc53138f1537fde0fc4b6133f0d3220ebad7db38a85f1607fa6a3aeb7e047197a20d2cf8ebe92032fd98e0de50e1426be7779ec49160e2a0a426993a149884578b47868e7e07afe607faaa615db353f254ef55a664e43e400aa2c8066d5f3e5acca65c3501b7f584dbd5b32f120ab5c331a06f6e75ec5c53090bbb51208d58d1195998abad7fb472ffae8c87d67d556cdb6b24ae5a8eb1757c00d4d93cde5c1fb21a4d465957315fe2e4de5675060d5bed6639383b37b364e6b0a70a780f6e7b54db50c1140b2a6e470fdc39f3307edd4087bfe9ad390b718faed4a41e24cc23b208fed596e1fd34e7fb689d35e6",
              "223f55731820b91ccd18010203010001": "be8e86bf5e44a53bf3bd36071f809c40b68fc4b015807e53023857115f5f7ee69c2439dd3c653ef58c9eedad5592ae6d8b464c6bcb90a221fa10c26f58a07e8ce5a7ce3140629d275747e33d9e1eed298501f66ebb3fa61ccd859d6a833feb8d37b893870ebcd51dadb649f07d3368c1d3e9b5acdd40b836d09e6516bca7322100baed5e6c570a0d65595b5e72c83063c9634184d6a6199e7c574a0c9028358de8a0c4e0a6145241b066bc30d4d78673aac321293030a3f45a04f432d53083d1f1b07f62db84d423faee412a625de8e5f3af6f45ad2f73c52bd3e0af6c24867190d3fa1c7ff948807f656c770fd175f9e261096faea275c3ced4c13647e2e4e8",
              "522071efd7ff988a95e9cb0203010001": "b540942a3a5b85eb73b18746110ea2d04c0fcdc4c3206ae6a21e24c6edb5ddde2dfd94abe6c578565853ccc260df5016523b67ecef1b7995866b08a0d006b6430aa4feecce3199faa399c240d8d4798dd6b3f68e656697b0551475883180b48b380ef5e5a107a2eee1041859f027ed847688d3bf4d3f7b0d7337755bb5d80384f0e06101ae48641a3ee56243089d51d4e7eab2b3b7005365e7edde254c0fdc84e2ee7ff69a96058e1ec96a0ed54a111de8b705bc1f75c3db99ca4c1413ffcf5f019497b03086a1fb891c6ff93db21b94f11f813179757f896fe1c3dcdbffa598f284dfc6022dde181356a5fde5543fe5cb5b98688bcfaacc768e2a619a19c20e"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dc50fde2afe664b1e67b605f26026f86324cac3d7c589e00d9718d6694fad654f2f5570aff43a8fba16ad4b7adf4a297c8ba16597f4bb029a00d031f80153915de53dadf65ec0ee5d72ee8e9491faafac6554b2e80ff9a28b39838bfdc115aee07f0dca44efa6fcce613134eb454b3fc3a79132b90efc8b9bb7055dc02949f032c7feeab637e599a3bc705c6ce7042bef61e74915fc68962ee05933a26272940a47d8386b5c80c32ec7375e3a81b6ff61830965f35e64afeb93d6353ac2fa9b861ac91cc75caf7d3ae623d3965540775a63dd92e74479fe124387d938a106c68fb651a13ce65763537f22ed0e33fddfc0ca1da9c05522071efd7ff988a95e9cb0203010001": {
            "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {
              "522071efd7ff988a95e9cb0203010001": "00e7ceddd1dfb37016d2e1341a5c504f53b11c2700369af4b208c5c5dc89465b03b5d72fb9b74f04cec1fd9462da50cc86f3c766c3bc5d6167d6de62b435d409c69847ce3ca38130784bd14ea5d72fe2e1edd7c90586a4228d0df29aaf7ec09d0cd57042e2f798ea34438e3844c726549b776317be745b5eec168fb58c418d43be5214c0d804f6862d1c9f5586470214ab6eeab34980b9c1faafb1d4b1e9eae64d58dcf54cc0e32a9e285ea1cff0fc994ca60bc10f7146a5e57f005e63d77b68fe40a058061252a67453bd5ec58cc2a8932e100757f7543ada6f838abc5344f0ae3e37a7f7bdccc604323487ca638a34f79cb184260da450422db74b6b2e2ec1",
              "003174c872dd2545ddeef10203010001": "2520cbae770a975db2fb97abf8310654495ab8973bb19d828104c9604269a2ec87cd643db0d8cdaf2ee38b104f92c6be3832c0ea7742c1dd6dc8ef55c1133d18a7eadae1f8236abd0c50c06f84e3cb2a304c53979f0e0a3e7803b9b81141243a1c578818be17a6821262d22a5e9813d74fd126f542d3a3e67c3c3d0e75fa056210c55f9beb562bd7105d3e4a3b1dee30c929301f688fe9cc011fb1cfd2072bb24a2a02d75c647d60e3d781df8d6cc853bca485c1944d76f15837098a5ddd7c0f4426248d984fcc7a16e52cdf9b28e0f27eacf41f60d290e6c0a2a69cb9ee655673c56ddc7d3d3f5511b68b7707ad2ed1731849f030ea7eeb764eb28d0d52fde5"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "522071efd7ff988a95e9cb0203010001": "61d63feea5f2ac0351f8869e7a7b2af7a04f205d18a71d7cac45ac780eeb5bdf34099dd90a7813763fbf602d2ba2f29d07f1987530508b795985fdb78d57804ccae80cfc85bf335232afeca79a0c5ff22d3c5b38e3a291171940fd5e2204010e9a3d9321111b6bfcc5bcfee3faad6fc791e8c31d3e00599a49a712deb803e68658213e395ca7bd72e569279b5b042ffa93def79dd6a2e075920b2fcfbf3a1b2920b2ee14595eb89821a03b16746be9e175ba6e69035b1af3a51e01f2055f58f20fa36327b2408f4364472eba46075dd1c0c2c672d45411c95f1e433b3807d33ae89e6bfb783e7afcb3d76609e74e153da7281a7ec41e80514d494d87989f60e8",
              "223f55731820b91ccd18010203010001": "64ad0179ea1957e26185585a3fe58962312e2cef3fb3c73447a497727ece50b7e88a78168a9e09c6d2baa24460c38065cd6908d8fd770e9904fe277fc20e3ccab058e628bd51716a654e30fa1c8c1077679eede94b5c4b28e6c316732b9f17a2631dc3ef648ed2c04964739fc265aab7da86ec2b7dbdd12edf607d037f3a17688d713dc1848fae7ff28132853a01d072d296987a448e73513b9d24bf3a95de479bb385e3a6865632061bd6df53d44a9d7b316bf14eecba9a6c0ed3ca0255643df924aab7e183ade583537f354265bdd67025165095bfd240e36f0c3febb4f74a248ecd539ab1ef4970c31aff1029e37accf34ed2c268610734db7476682eacda"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c928dfc1fb2aa9b8a1e208aa164cd862a67e0aec2cb3aace7513afeca70e185f194e55e6f90e6e794b7cd18009d5947dc5c1d22d56a383d935b96ce7055506e52b4f3791a36e87a6bf62d5530763f960d00ad1dcd08e2dd61da87b12a6a743d29ed5cfa14c5017fdb81b1274ed8c8beba47ee4150bcdc8d9cd9d4a7a72ce31640dfcf85fec7de10d8d1157b6f7ba650450657b4c1ca201b76ed894585e04abd5223bda434787847e4fafcc495496477a7dd9f67e3170435a0bcbedad4b1963b673d288b8697b664523b94e6f3b6031234320ba4b4e121d02e1dafea24b6b971097bfefbb52e2d843ade28a84fcade50a694564a913003174c872dd2545ddeef10203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dc50fde2afe664b1e67b605f26026f86324cac3d7c589e00d9718d6694fad654f2f5570aff43a8fba16ad4b7adf4a297c8ba16597f4bb029a00d031f80153915de53dadf65ec0ee5d72ee8e9491faafac6554b2e80ff9a28b39838bfdc115aee07f0dca44efa6fcce613134eb454b3fc3a79132b90efc8b9bb7055dc02949f032c7feeab637e599a3bc705c6ce7042bef61e74915fc68962ee05933a26272940a47d8386b5c80c32ec7375e3a81b6ff61830965f35e64afeb93d6353ac2fa9b861ac91cc75caf7d3ae623d3965540775a63dd92e74479fe124387d938a106c68fb651a13ce65763537f22ed0e33fddfc0ca1da9c05522071efd7ff988a95e9cb0203010001": "339d939a030267f5689ab969880a7afc26bb3479bc0a2f10c96da3ab5d3ff34ddc4c3040da9a45207c56eebc70d70a38523db0d66f99f46912412e0efaca14e18c579247f6bcaba0de8c32cf64c6f01a610b2d3c93c7d3f020c37dae6394ce3f061dba91cf2b29e4ae6100dadcc096249eb11ddf303b240e468b316794563312710f2d40eefe8d54ecd0f511a0da733e9adecec34be0e3888fb2763eb07f5da57881c76533140109ebe079126aad9484384aaed683355aa31f9cb014cc42c2b6bc4fbb49b30425680b5a8f98eddb3bcd1e860deef1217df50391eec4eb4d74a31eda916819d0939fce3f0deea19e0502a37933d6103d0b8425750062ec80388a59e27bf6d34866a180e82a28d92725bf24b4d4094d8ddc5d46d8b719ff5915fdd45ae90c22177fbc6a18ebf9a07b88a51e7ab1712f4affa1188db5bd37b8f2fdfa550c427502f56073e9e956085f5d86cdf56863308aa05fe38c8ebd1d60cae9abee765569cdca6566fe5483e2cfcbbdd65310cf8da74f7f8ea4e5e9d5c659230b86cb967d2cc06a603908e6b3dcf11838aba920edf71c9152223b790fa072497b7f27c7416dabe073b13876fd44b1f15c0b66e8ccf9793bd520836e86d2a0468d963a4de2416a085c5e5a8db1aa2b4035ac5477245a05e6a8e5e2b3b83bb218a0f40197682baea60d097def80887c37641da5c08c3e525cc861e32216f9ec7340f5c85958868f45b72df67b5f86d4524b32a27f1fa68dba57eaab07dad0e21eaf33ed617bc0ade56f12b5a69b9fd609724d9102916dc0e7e4abf940cb9de78c62fbdf55bf7cc7e3cefbfbbfea1fd319733ec3599ba98731864b9871fc11f3fb6b0e3bb9da702c289db5d977fba3f39c2235c24edc8aefccd3e902518537cf79b0161b065140afd05b7f69f1091530b02d09cf5c04670f800d371e00133981b42dfefe37f1e63457dd43a371dcb3664487acdd7c27fd65c8df62e88430eac47ba0e5f255c9e508d757abe0ff2bff57a55943cfbe7f2f110bad9b56a9b3eab64285d067e61fa35e6af9ad8697349d7f690442672227015140fdb92d34deabeabfdcca7b0ee38f0cbe669adc4e060a199e9cf3c8fc14b18133cfa1049ed2a03ce6b62e1fa713e47e0bcf838168202830726a0ea5f17b4cde4db35a24f46346cbf6633558432b71fe16213dea4aa4a05f5793449cb5c3a739a560c87c39838cb6ee1f38ee50b495864c669f79de2848a54b0fb76712d3e1c4240e7a5c6e69e7ed42ffe3fbfbd09f12be78ac3674beec573c7e0bb000870d5ad645cc3454cf4ce9f675a5148536200dca9e22a172a95785ada6761d793cc6fcd402fce92d215f29a8f894fa004beef6180b7944c29f1388fa70fcfca0bfb00d2608e231db530b02744c860083b5fe7768b49cd5e9c986f7da891030c34ef74f64415e2931d230d3572c8850829cc17a49daf4e4c8a6eeb3b438ac630a1f5aab3b1cbb1612808ea76a063204032662ef645244733011d16a863dda8f89908cfb5068a9259ac3689d343c3619b052ff24ff1688ef0ede2f110dd203fe6e40d5866b008e33a8b81ddda7b11b23fa0bf962421b6046ce1c89988fb4a2a7ba5dd770620c85c80acb76a5887346d6660b9ae5c63baf624236473c547bcadc8467e595e31d275ca3c65094814c6db979543f5e916078c93d0f25daa96afb454d939d1902d043729d7e45db35419b1a06c4711251a6e3bd5c6bfc771c5029dc47eeb64754e0b17d3a0f89edf5"
          }
        },
        "encryptedSelf": "Q/hnQkCAYUx591UrjIxKP9IuUHk55nIjW/wehfGNOv8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "2ca82608-87e0-46aa-8295-cc4bf0366a3c": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "2df64961-21f7-4fef-a7bc-559684501bb5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-4d60fc60183b9eed05469658efeea80c",
      "created": 1679923773115,
      "modified": 1679923773115,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "18299946@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ad69be78d19fc27c4d17c27c6076df1369e3115b9fe8236126dfe6d0adcdc72f715160cbc56b7d82cf190ad18c344253d6f96860d2e62f3711d391eab819ed97dac2cb15c3b14e1415cae4512a27b89bde835a41277d7cc2734b2895bbefc6f466c652f7be201d70317ad78dfe1df6ac3c8adeefc9a58312935e723d78c1d368c0c26ea2fb7fc38357b1526fe5b1a573b3fe9c01e0252d4b5557a547e6f0a638a945799f0d503bb167c76bf36ee015fbef714cf7f89a42adaccbca94acf9b12de8bc573cba50a3841b0067f8c158c2e4c8bc38013ae9771d9404d6c7057cd3e72d69b5a468d79d2c5446f4f714224c404faa7cbfb4a3cc812006fc2df240b4df0203010001",
        "hcPartyKeys": {
          "2df64961-21f7-4fef-a7bc-559684501bb5": [
            "0163c9ea48d9b66f78906d1605ffd6f08c76caa5c89e3fd38acd8e1ebd3cbaa70e9c1d6e7c35dd44fd49c2d6a9a99e8e999fc38565b7616bdc91dc616accf002766f95c53f62784c31e7e0efb544342e557e11410bdc5a6ad2479e8c65473d4c6fcc3bc378b8f3a53df0d344761ac200c56fe37c44013ff65464a5cb702843efa2a675a1b924a321fbdbcd07660bfb3ca61489f1d694eb567ecafe8a5002837d067615ec5ff9f5a8b182cd289262708ae18afa37b6d28553aaad1827f3d3fa39ef929cc96d19d4c90958407e5b6ac1c1ffebda9750ec11e84dfbc7ce30e3304b10f0fc9fcd72a6a4b6c27a76fdff5bb3d0c11b7ac0bf7ff014b30813ad1450dd",
            "0163c9ea48d9b66f78906d1605ffd6f08c76caa5c89e3fd38acd8e1ebd3cbaa70e9c1d6e7c35dd44fd49c2d6a9a99e8e999fc38565b7616bdc91dc616accf002766f95c53f62784c31e7e0efb544342e557e11410bdc5a6ad2479e8c65473d4c6fcc3bc378b8f3a53df0d344761ac200c56fe37c44013ff65464a5cb702843efa2a675a1b924a321fbdbcd07660bfb3ca61489f1d694eb567ecafe8a5002837d067615ec5ff9f5a8b182cd289262708ae18afa37b6d28553aaad1827f3d3fa39ef929cc96d19d4c90958407e5b6ac1c1ffebda9750ec11e84dfbc7ce30e3304b10f0fc9fcd72a6a4b6c27a76fdff5bb3d0c11b7ac0bf7ff014b30813ad1450dd"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "17ebf799c5142fe66d99c79abc0bf805878a173230af8edc7d1385797dd63e38a316afba6506fecec02d0dd896fdd21e0dc7ba34f3745857ee7670d03e8fbb0c354e5e424bae13d708c7ebcd4a26ba5cd0eb773be09c661d1d2422432831d076b6dc6c40b0e13f4512b77c922070e86d8dca5feb9e40861f221b0ca1561d1c1d639483c23204d1e21c5b1af01337abeb1b384e8dc0a1b153f1782e1bd341688d3e9a503dd5737778621b5491630a26c2bf3fc9c36b6a6f95263fcce15216ca022193615c8c63aa88d1ce55eb8ebfeca42733fadd65b8862215dd379d977930f3fee014318de82250a50b7e986e531cccf2940652ba0f6ef2cb27c439e15278df",
            "b6dfd9fbcd6e434e2362967dac1004acb39dc7e75422bcee2293e3cfc1a5578f71fcbbfe211b2966ba271339b75cf482a610492ebb481ffa8ae26b2320adbdabd3abec972bdbce3e5b833d779c98866c202feb1e9af1636a8ee3317154a162fbb81139912fdf237c72aab13b7fc5fc838de8828022fe0646680d7aa7712feae91dae26bdc06fb4e258bbe1213bdef417efd90df76313c73b4d489700666c150c9b7aeba16e51e2faf4ee63506339bb245e66e82f805a7cd0e08876ca60759de316308640f5a1b90771b264ee8ed2467dd37d4de3ebd9d0cee3027067026cb2855045265f15ba8c0564753c0bbfcfb8c71ceb3b22233f29268a5718fd40f037f0"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ad69be78d19fc27c4d17c27c6076df1369e3115b9fe8236126dfe6d0adcdc72f715160cbc56b7d82cf190ad18c344253d6f96860d2e62f3711d391eab819ed97dac2cb15c3b14e1415cae4512a27b89bde835a41277d7cc2734b2895bbefc6f466c652f7be201d70317ad78dfe1df6ac3c8adeefc9a58312935e723d78c1d368c0c26ea2fb7fc38357b1526fe5b1a573b3fe9c01e0252d4b5557a547e6f0a638a945799f0d503bb167c76bf36ee015fbef714cf7f89a42adaccbca94acf9b12de8bc573cba50a3841b0067f8c158c2e4c8bc38013ae9771d9404d6c7057cd3e72d69b5a468d79d2c5446f4f714224c404faa7cbfb4a3cc812006fc2df240b4df0203010001": {
            "2df64961-21f7-4fef-a7bc-559684501bb5": {
              "a3cc812006fc2df240b4df0203010001": "0163c9ea48d9b66f78906d1605ffd6f08c76caa5c89e3fd38acd8e1ebd3cbaa70e9c1d6e7c35dd44fd49c2d6a9a99e8e999fc38565b7616bdc91dc616accf002766f95c53f62784c31e7e0efb544342e557e11410bdc5a6ad2479e8c65473d4c6fcc3bc378b8f3a53df0d344761ac200c56fe37c44013ff65464a5cb702843efa2a675a1b924a321fbdbcd07660bfb3ca61489f1d694eb567ecafe8a5002837d067615ec5ff9f5a8b182cd289262708ae18afa37b6d28553aaad1827f3d3fa39ef929cc96d19d4c90958407e5b6ac1c1ffebda9750ec11e84dfbc7ce30e3304b10f0fc9fcd72a6a4b6c27a76fdff5bb3d0c11b7ac0bf7ff014b30813ad1450dd"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "a3cc812006fc2df240b4df0203010001": "17ebf799c5142fe66d99c79abc0bf805878a173230af8edc7d1385797dd63e38a316afba6506fecec02d0dd896fdd21e0dc7ba34f3745857ee7670d03e8fbb0c354e5e424bae13d708c7ebcd4a26ba5cd0eb773be09c661d1d2422432831d076b6dc6c40b0e13f4512b77c922070e86d8dca5feb9e40861f221b0ca1561d1c1d639483c23204d1e21c5b1af01337abeb1b384e8dc0a1b153f1782e1bd341688d3e9a503dd5737778621b5491630a26c2bf3fc9c36b6a6f95263fcce15216ca022193615c8c63aa88d1ce55eb8ebfeca42733fadd65b8862215dd379d977930f3fee014318de82250a50b7e986e531cccf2940652ba0f6ef2cb27c439e15278df",
              "223f55731820b91ccd18010203010001": "b6dfd9fbcd6e434e2362967dac1004acb39dc7e75422bcee2293e3cfc1a5578f71fcbbfe211b2966ba271339b75cf482a610492ebb481ffa8ae26b2320adbdabd3abec972bdbce3e5b833d779c98866c202feb1e9af1636a8ee3317154a162fbb81139912fdf237c72aab13b7fc5fc838de8828022fe0646680d7aa7712feae91dae26bdc06fb4e258bbe1213bdef417efd90df76313c73b4d489700666c150c9b7aeba16e51e2faf4ee63506339bb245e66e82f805a7cd0e08876ca60759de316308640f5a1b90771b264ee8ed2467dd37d4de3ebd9d0cee3027067026cb2855045265f15ba8c0564753c0bbfcfb8c71ceb3b22233f29268a5718fd40f037f0"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "Lgjfv78VFZ+m8JqWZe2Oz4L5/8kWFkpqIw5LBXVexPs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "2df64961-21f7-4fef-a7bc-559684501bb5": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "2df64961-21f7-4fef-a7bc-559684501bb5": {}
        }
      }
    },
    {
      "id": "2e34eb09-7474-4bdc-8eac-ff056663c0be",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-4b28db0209b4ac6ff7dce934119c5726",
      "created": 1679927926960,
      "modified": 1679927926960,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "g68jgCu6I8j9BVPy76Pt3M3m4dNpfxIuqSHnrG+umSH9H0LuwcT1pvivZ0FQVRdF",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "2e3d40a8-51b6-494f-921d-e806c5b83010",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-4c707ef1819d19039fa844ba4434a63e",
      "created": 1679926412025,
      "modified": 1679926412025,
      "author": "f5cbc6d5-87eb-4952-bbe8-e27937762b55",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "azgrmfno9-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6d7672b31c8d4f85f245886b3e2c4c3e19adc76102074b848af084dcefe25475d833194ecddfc223b0a2c1853bb689c40aaa42811df92e240b17796bf29516f6719ca77a9f0fd067f75e4d94a5567fcc6ef3fd1e97339bfcd28dca9f1de262bb5a4140bffa193719c751fa0ebe2589467193ee9157d619e66f4f445e4c44b2091b27248de8ee0cad5f056cf565ed431aeaee84f3a9245fa9cb699ec86de2646fdbfbcf9ce2b83724f68418c9825de8d8647c64b401fad7745e65eaa8a8a33cb0062fe1cf70949ce37b3b7e86bbe25029d45eed29da2751a47dae0a9ab5a9f448dce7df82d3ac85d03a68fd078dd16c67a3151e90edd6d8016347b443a3e643b0203010001",
        "hcPartyKeys": {
          "2e3d40a8-51b6-494f-921d-e806c5b83010": [
            "5647f81a9690381bf20001831420f202b866524e4c1b921c255675ae150bab3e782e0c7ed60bf04557b374e1f185012321b23aa8a5384f9485a3ca18e09fedd50db5c4c3a6da950aa398b791cdceaf99475b1cff7b72108792f75807cdb5aa8643a6032a2d153fcc73bddcda643769e07e21ae4f0f620a8b0713f7b1cc7699c339ea2674eefd9ba4b43973fc3c4bccf2da431507d18be779002dc2b6d51c16566ead26f7569272dc8276db6a63810694ca35a127fbc0fb6345150dea838f1e0637c5caacb458f66e145f9ffadb8740aa47af5cff2d0316ab7c7ee39009254ddb6cf2758a9b9e45101d19148ae08b6c44ffa93c2ea616a5c740e7041a4aeb2d18",
            "5647f81a9690381bf20001831420f202b866524e4c1b921c255675ae150bab3e782e0c7ed60bf04557b374e1f185012321b23aa8a5384f9485a3ca18e09fedd50db5c4c3a6da950aa398b791cdceaf99475b1cff7b72108792f75807cdb5aa8643a6032a2d153fcc73bddcda643769e07e21ae4f0f620a8b0713f7b1cc7699c339ea2674eefd9ba4b43973fc3c4bccf2da431507d18be779002dc2b6d51c16566ead26f7569272dc8276db6a63810694ca35a127fbc0fb6345150dea838f1e0637c5caacb458f66e145f9ffadb8740aa47af5cff2d0316ab7c7ee39009254ddb6cf2758a9b9e45101d19148ae08b6c44ffa93c2ea616a5c740e7041a4aeb2d18"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "47155022015727f1411c9cf58ec01177d41c1b3cf20ba8aa2dcbb715f5184ae4bcf03337398f4180740ebcec79a1a7adeee2caf250857abb5cfa86439504299f3a5a002283c4e0ab6b3a0ddf451e36bbbc3bea7f921a1c6d818f94ddce74f31c1032ddc7aa24a52f579a080a0bbf9f8d7815c00a95fd5509c3c65c1a52ebc993af529ae589b927cd0e5fe9e5e4cfd5e93e27711f436207ccfb33eaa95350c3259ec82fde029d7f7ca67357395c3cc3e76eff46bbdcb4b5ceabb756119942e677e9cb41fc1983e5eb60c9b17f26af7007238972946e58c1421a89846d9a167adc0279bb82783d905d3fa8dde310d985a557fa7ec6d20429df4d33780578b06cdc",
            "426497e3a34df73339bee3b9145ada3cfa6e82524ac8861876413608ef1859d32377066dbab019a656804205a29212a24cbdbca51d0928210e64fd383c319b7deed1f04797e1c2686e2a89ef24756a9278bacf1d48160d119a631b97dd518480710a90d2359b85543c8db6d1e0fe03e7e8c91c0a8f2a74f204053e27471826e4fd4e9f45c8b66df1975adc75099e5978be067aa17c5e8e4541e1d3767218210e1afbc7bc4243df312686015c221ab4a3d50702ea6a11a73540884a381235ac1b9a93aa71e6968edd9f71331956772a025ebfb6b36df2edead684c2523186247ed51c9c26f464415af3044561b0f8d2f5b04ee8ff66c3b45bed00c2e19205216e"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6d7672b31c8d4f85f245886b3e2c4c3e19adc76102074b848af084dcefe25475d833194ecddfc223b0a2c1853bb689c40aaa42811df92e240b17796bf29516f6719ca77a9f0fd067f75e4d94a5567fcc6ef3fd1e97339bfcd28dca9f1de262bb5a4140bffa193719c751fa0ebe2589467193ee9157d619e66f4f445e4c44b2091b27248de8ee0cad5f056cf565ed431aeaee84f3a9245fa9cb699ec86de2646fdbfbcf9ce2b83724f68418c9825de8d8647c64b401fad7745e65eaa8a8a33cb0062fe1cf70949ce37b3b7e86bbe25029d45eed29da2751a47dae0a9ab5a9f448dce7df82d3ac85d03a68fd078dd16c67a3151e90edd6d8016347b443a3e643b0203010001": {
            "2e3d40a8-51b6-494f-921d-e806c5b83010": {
              "dd6d8016347b443a3e643b0203010001": "5647f81a9690381bf20001831420f202b866524e4c1b921c255675ae150bab3e782e0c7ed60bf04557b374e1f185012321b23aa8a5384f9485a3ca18e09fedd50db5c4c3a6da950aa398b791cdceaf99475b1cff7b72108792f75807cdb5aa8643a6032a2d153fcc73bddcda643769e07e21ae4f0f620a8b0713f7b1cc7699c339ea2674eefd9ba4b43973fc3c4bccf2da431507d18be779002dc2b6d51c16566ead26f7569272dc8276db6a63810694ca35a127fbc0fb6345150dea838f1e0637c5caacb458f66e145f9ffadb8740aa47af5cff2d0316ab7c7ee39009254ddb6cf2758a9b9e45101d19148ae08b6c44ffa93c2ea616a5c740e7041a4aeb2d18"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "dd6d8016347b443a3e643b0203010001": "47155022015727f1411c9cf58ec01177d41c1b3cf20ba8aa2dcbb715f5184ae4bcf03337398f4180740ebcec79a1a7adeee2caf250857abb5cfa86439504299f3a5a002283c4e0ab6b3a0ddf451e36bbbc3bea7f921a1c6d818f94ddce74f31c1032ddc7aa24a52f579a080a0bbf9f8d7815c00a95fd5509c3c65c1a52ebc993af529ae589b927cd0e5fe9e5e4cfd5e93e27711f436207ccfb33eaa95350c3259ec82fde029d7f7ca67357395c3cc3e76eff46bbdcb4b5ceabb756119942e677e9cb41fc1983e5eb60c9b17f26af7007238972946e58c1421a89846d9a167adc0279bb82783d905d3fa8dde310d985a557fa7ec6d20429df4d33780578b06cdc",
              "223f55731820b91ccd18010203010001": "426497e3a34df73339bee3b9145ada3cfa6e82524ac8861876413608ef1859d32377066dbab019a656804205a29212a24cbdbca51d0928210e64fd383c319b7deed1f04797e1c2686e2a89ef24756a9278bacf1d48160d119a631b97dd518480710a90d2359b85543c8db6d1e0fe03e7e8c91c0a8f2a74f204053e27471826e4fd4e9f45c8b66df1975adc75099e5978be067aa17c5e8e4541e1d3767218210e1afbc7bc4243df312686015c221ab4a3d50702ea6a11a73540884a381235ac1b9a93aa71e6968edd9f71331956772a025ebfb6b36df2edead684c2523186247ed51c9c26f464415af3044561b0f8d2f5b04ee8ff66c3b45bed00c2e19205216e",
              "98afa9fcfa6c0ef0ef773f0203010001": "581c9b4a58c9196eb63b217c33ea836a8b4098360cc6248c156893ee18679e507fee04f9e01cf7c348f03bdc29c8068c952143a68beac66a192d6c1e05860b0c0c4da827ac804401efeabec2139cdf9906a326a2aa74b004ade23e19e82bfb104f0275feebcc5abe4343af956e4d94e2f648baa2d19bc04390a0092680fa00172e4042d8129b47a0bb9ab9eeda393bc0edd8680b0bc10e4f46d8b0a432a11382fc2bde7a18f3df0d7b065dd996674025e47efbf71b2f44fcb8615a43470e845c8cb1e8757b10e00bc2dec07180c3f04bc5b2d6adc5f8a57b7316659ce3c43c178e92d790c434983b13cc180637b1f5a5c9ab4cf9c7fd80a1772486c7283ad6cd"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a1b97a2317702a4f0627c4c47ff12ff9449c582eb8a1f82e13353eb4172ff778db4e99cc4f0d5f4de9ddee558172345b1c9259939336a76eec995d257c3fa48f23d3301c96129ed6a5cc3288004e72f5e1fdfd71b64f10631b608fcf800c6a5bc67b87f35d0c7a98042a78744c60d0acb797a0e6d6e589cdd13a0d33a234f0c61d8287437a4486be3e5f03d5d523dd6057c858622e49f995b7e097de087fbf4ffeff3295bbff889cd1477c30a2c4074a6a47e60525453fd28b8f38b3d3b2d78db3f1883d744557680b543d6a84d0e407c6d3b80511fd645bdc273ea3f0684f536d977ccbd43dbe314518ef7e932a971841afca1e3d98afa9fcfa6c0ef0ef773f0203010001": {
            "2e3d40a8-51b6-494f-921d-e806c5b83010": {
              "98afa9fcfa6c0ef0ef773f0203010001": "01384c713748f1c8604e0c372001f8d3053371aa4115c48850f86b4ff1d7920dad60670772f5a65dd3d42cc63788985e70a61be6fc3ed2665a64d27e4f9817f0cb481b1bf298ee5691113a3ed1e9a5013d4521d9652805daf3188de975611f02d23174bc201924f711f248f67d3ed0c1b8475fc4bf7e1d247fecec4631647783f29919c5eee159a0749f190bf4285985e5064d0ac78d9adc2d0a4267e1ed45e07caef201b0c71e93ada4b12bacbaca1c11e3efae6e7a1981913a30cb249754b5ec258843741dc5f140f42c5f11a590fdd62bfa1c2c525655d0cede3e9b2fa20260112740309e17951dd515e8cd4ab44419fd3959ff0139d9e56a413b4f51cf5d",
              "dd6d8016347b443a3e643b0203010001": "429857a585c47b56d0fbc36817f97e5ef05df96bc073dc482025ba620fdd30a2800ece4849235e1fb088630379d586baef9375e13124a386f5e1196a7d34a8a5258b63202b21c806c6946badd2131c6713435305ca00b659f890e519237ba337bf5181d7c14ba83425dbb0c0a1c3a5d296d63402e486f857abedbf4b351416d511ecc99218c65cedf2d5bcd3f9aedd733555aa9abd97fb2de5d637a9084f0309507664684baaae59a4d2172b89828541f63d732e4fdc9f87dfda09d88e972447995a91c6dc3a40fc3cb6c9b774659cf5331b403ed9006caa5ede82a5806cecaed2b1478da9883b064ae9edfae35ec581a1b5eb7f5a8c9bc6bdbdf9c3909c5a94"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "98afa9fcfa6c0ef0ef773f0203010001": "635b3a9211e88ab5f638d6ef61ce501aeef768e830bea6e8dcdd5a31af22c8ee6c46d13b8ef7489948ceda1024573050542149f89fe43eb40b0c8b24740281c29d804ac0b071142d3b20409068aeafb71c1f3c39edd90a9fbcc7dc8b4dbe03919ed334c975b2ac5bca071fbdb9302a03252cd9749a446d6b1311eb6cda1aa3e9c18b2060c9987216890295e52844c9adf1d55f9e1483e77541517e23354997a47b812537797ea5cab4f197cfaf816089cff1dd36fff8e22dbfa8b698fe6b8c37cb1b6296bb69e37aae376fd7eb2d47fef6f7b29f0bd7456a4d38101fffef1c01a5792a646cba9190284b4e32a2bdaa8754053b95fcfc581e5a8efbf5035b99c0",
              "223f55731820b91ccd18010203010001": "0cfb4fa0760be320b864b12015e51221c48c609782e37feb51b46d9885eccf6a6ca2e297e196d47909aca45e4af0a52f3632d03b35a2286c36b1ec6146bd69a48a9e33129ad7cb3cc63deb39d1c433cb6f27887dd6158ffa4c9f32d2b1441bd1e18a304dac20b3a93d544e5deaa46bf540eb37a9df7aa2644f48d19f639ea5a2f2ef6babf34f1f307a88efbba8fe798f35e835c54ce28cd5d19611e17f62d6e50f810b7a53b40a9937c2c88abf28ede848af7e1d9d73d329022290b688a1f33edc8ab005d18d8e7111897d86cf49c2963208050cb32c7da801a57777b450e130c153074037a47f5e540ff9ec05c71eb089a6cb655d035e95fd74d2c4800b5c08"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6d7672b31c8d4f85f245886b3e2c4c3e19adc76102074b848af084dcefe25475d833194ecddfc223b0a2c1853bb689c40aaa42811df92e240b17796bf29516f6719ca77a9f0fd067f75e4d94a5567fcc6ef3fd1e97339bfcd28dca9f1de262bb5a4140bffa193719c751fa0ebe2589467193ee9157d619e66f4f445e4c44b2091b27248de8ee0cad5f056cf565ed431aeaee84f3a9245fa9cb699ec86de2646fdbfbcf9ce2b83724f68418c9825de8d8647c64b401fad7745e65eaa8a8a33cb0062fe1cf70949ce37b3b7e86bbe25029d45eed29da2751a47dae0a9ab5a9f448dce7df82d3ac85d03a68fd078dd16c67a3151e90edd6d8016347b443a3e643b0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a1b97a2317702a4f0627c4c47ff12ff9449c582eb8a1f82e13353eb4172ff778db4e99cc4f0d5f4de9ddee558172345b1c9259939336a76eec995d257c3fa48f23d3301c96129ed6a5cc3288004e72f5e1fdfd71b64f10631b608fcf800c6a5bc67b87f35d0c7a98042a78744c60d0acb797a0e6d6e589cdd13a0d33a234f0c61d8287437a4486be3e5f03d5d523dd6057c858622e49f995b7e097de087fbf4ffeff3295bbff889cd1477c30a2c4074a6a47e60525453fd28b8f38b3d3b2d78db3f1883d744557680b543d6a84d0e407c6d3b80511fd645bdc273ea3f0684f536d977ccbd43dbe314518ef7e932a971841afca1e3d98afa9fcfa6c0ef0ef773f0203010001": "f5b96c09a360166f671b7f63c6da603fab11552299b7c8c742a4bdc1803a792d032cb4e993a9a1e07f8a484b8e6892f37f7664116382a9cbdfe7fb821f72c40da67b06dc94c62f2fbc5ffcf5b3e491f7cd7b6f0aa5ad910fd698b13b0bb62e1e47caf51c1e1b0bcad7f3295d1103a46938b363fc2206373c948aa1abe0f43b5b471d43e033f2e327a38a9c43ad55a7d4a24b35440cd3968f463a567fcfa0a4724d01bdeafa5cd8f112f59cf84e0efcac96e9fad63a8a827e63a8ee0037749d86d2bcc3e77579111664d5e66d0e47806ae792ae48df0cd45fc9773ce054f8cc90404c8e797c1049a464ff4672c2d41dd7e09f8b0c6600527527240b4eba109066fe4816d81849752a9f7862c0fafda7b5c147bfc568b44893cdee2b3fb66a4e5dc2787a3273502cda11900dbca94105ed083c9cdc83c1e6e417730dce011d7e729c3cf0fd8eec6d3c0049a1b2313589ed5b75b00d0143226e3be2b19a2fbdd826d9c49cee2c1f7027d29d18fc4698ef5ccaed80a50cbf27d46d2978bb03d55b1f0cb7ccbbc879395c9913f6c48713c8235d95c82a249fbb6d155fe666062e0b8fd84fd783e121d5a558a416dcfa26aff5d35080de74d043991c47ee832f5222293de3fa183bab2206b994302316e77375fba8b871817afea317ab928d9f1db8813227d5f5e53c191a3ac86323fae06d83d087401bb29a6e8c0375acbf5547b2d1d53e44ff0853fe8ccc70ca1847c082e7ae55d93fb995f7b409fe2158c92526993fa57f862d9df5300d495ad915815b1807151064b8891d6d5873d66991e89d945769015457c9a381bca3f3dc04a683e6c8ba6463fd0f7210342a9778f65ebee9f9c374ebe7d5efb6ea192e152e84f6635eec2c265c4f701d17c4408c28b6327ddcb9881e58f250bc1d24b5c3258e4b047c4ad64b11bf2814aa366b1ca8944766d13299b22ac1c738f74626789d6a7a4acbfe1282629fa4c00dcce658b0bf311418ebd50978c10760ea90fbb7640e4105c1264262b26b69c23fc17c8e742e9da52e95996cb3ffe2507ae6e02afac5e6abfe228e3a92a334172088bf1c3c3a98afe3d6880134e21fc70f4fdf0a456fa372240965b842752dbbadea1cb03f2ba3c2398dc8846f507e0d2ae8bc7a9cc4f619aa6aec36007f78127653b62ec5b0e74444debd2c8bc5eb24d42d285932fd4f52f0e9298923660b2daaa136ae1319edb1f54d77e3412f4981ad14f7005aa24d28ea2a1eddc62659d4462cfa93ada98e19854c0c57acc2758f518c5391b6929dcc4d5e4056a9af8ae6cbac724621a553148e143460615657029abcbd85571dac6ee1606138d3c195f24859ae1df9c22024dc63dad4a69e65f669560091345486152dc94ec8b97b0920dfa3bd383cb56f40d6c37c8d1eb892f00c866c5768579e765759dd445bd2031f7ba2b257f59245ed3284413259da7c51e366e080c9e78eee59c6ba7dc2569624617471889f5c0fc9a8acfa638f633101d92a4eeeb94db1ca1f2523d94e9aff5596211a81613bef8e4721605f206f0b89177446c6762ddade6fa80f33e0fe5f8463b126e93fe045a6bb52c89424c05e0efd77f791151119b998295a8f7c6f2cd2ebdd0aad7ea7b766add10e15a479d0285bf69135c000e1ae7ce1439257ce03f9bf38945bbaf6fdc2707eafd819b6447022f4212e9c86b5cd69211116f28d999e6060eff3021463a7736b58e63aa7774a97a322ad530f156b564b4a420998a1afff0106d9793b7aee"
          }
        },
        "encryptedSelf": "CVsBl5IPOk3aXj7TuV1qjzpaAKhqz3jO+ZQedqGFtM0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "2e3d40a8-51b6-494f-921d-e806c5b83010": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "2e3d40a8-51b6-494f-921d-e806c5b83010": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "2e7c411c-189c-42dd-acf8-203136c36dcd",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1973882c0d58b49bddfd236263eddc66",
      "created": 1679924680377,
      "modified": 1679924680377,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "7acfe419@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "JOrUqM1Mft8BxDPQFZEYZo/lmtZ3q+Jbt3MrHGeRewc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "2f8009d1-9ce2-4c52-b338-40b818fa0685",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-a48a4f011a477a860ef52901e7057e50",
      "created": 1679925818503,
      "modified": 1679925818503,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tZNCLclx94/ZhCAdBQxlMQbryuX6QcMo4e8HAedAHTOI8d5JBegzJhLIcxFaNIff",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "319178f8-1926-430b-bcc7-9f13487e55eb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-577de37647935d8fa00049629647e7fa",
      "created": 1679925847636,
      "modified": 1679925847636,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ODjjicyJIooojjlq2cUxE4nCPgYMkqwVETkay0hhn9Esf1hOp/Dy+Us8CMgG8HpF",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "3238dd4f-be09-4375-bb5b-0bf9d737ac94",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "31-34972e8c714e16797aa612476b1143c0",
      "created": 1679919818818,
      "modified": 1679919818818,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "80f9f1",
      "lastName": "a6cf06",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "80f9f1"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "a6cf06",
          "text": "a6cf06 80f9f1",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b30a66e845bc0854c700ce03450474245e76e1ba81300b24717301524ac9790bc464475c5992c362f6ddf8601939e6258ca4902331610f5b5a1cef78cfaf6e5483b56bbef821026c8dc1b3965ff8925cf62a98a1922ba4de46b189e8a3c23a74d1130ffa3d8574b4ecb25ef3f83af4d8e07bb0fc3e46dc837a8adb7c588630cbc250fc95ec00ab36afd7a9122837d481957dd6121d564a365e0907e50b9f664b22faa8aa7fc143eeb1c7c9b75089ae12671b0e752998935a4f6adc7a9cbd77ac505b2de6e8da3c408349770fd92eb3094dea978dc8f201eec3b95a893af162fe5fdd4988537673df7c89ad71f7022e8a367dd8626f34ac91b295673a63ccf39d0203010001",
        "hcPartyKeys": {
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": [
            "544f52f8eb16990f3b7666a298eade801d0202a219c8d4656f4e7ae98ea9cd0bd872d5b1215c77941f23fedcff4d043b9eacb4f48c33ecc0e45663c00520816d74d7ea5740fc7180c9d2cdbb20e9c147133f87c2f72c0e89944a3788ebdb929368a9e83dbbb41f26c250a5b02d6e73da5976cab18260873ace3c2c899061c9213bfb545a8a1b1134f0045ecf446d3bcea518747753361c54d0ecac34f9d63475e6b9cb7f03c68ac876a8836e61ddcd352a4e04b5f980b37c665380bca0e1ecd42d6fa9e6ae40e3bce72d96d60125da45c3925b65a18cd3837dc4814931eacca837835a47b8ba685aef64dab695e62bd16a97cc0d3db94c9315a0a93854f62548",
            "544f52f8eb16990f3b7666a298eade801d0202a219c8d4656f4e7ae98ea9cd0bd872d5b1215c77941f23fedcff4d043b9eacb4f48c33ecc0e45663c00520816d74d7ea5740fc7180c9d2cdbb20e9c147133f87c2f72c0e89944a3788ebdb929368a9e83dbbb41f26c250a5b02d6e73da5976cab18260873ace3c2c899061c9213bfb545a8a1b1134f0045ecf446d3bcea518747753361c54d0ecac34f9d63475e6b9cb7f03c68ac876a8836e61ddcd352a4e04b5f980b37c665380bca0e1ecd42d6fa9e6ae40e3bce72d96d60125da45c3925b65a18cd3837dc4814931eacca837835a47b8ba685aef64dab695e62bd16a97cc0d3db94c9315a0a93854f62548"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "8a189c2c0dc6690263bf2cac600b6f781361edf4b38f189d947e69784a1b0261f128fa614b778d0d38efd13298a524f4a8a564294009a74ed3643398928909fd1536eeab47b68a103a80b502aaac24c0aacd6353b68fe9bd1b53bdcd007c01aaea61c89b5339d4fac5efe869628b05a5bbcfd921008e3d434c2d6961a43d191cdbeb6f06831c3e411ed442be4c735a871ae801bbe371f4433d9da19cd3bcccdccef8bb9cfd67cf9a7881677ce1641514cc646f2399bfa8195b97606072362f6e120be9ae0a4ae98230c322125158454bd3076b84a106f520d450b3c9937d8d4f319f093bbae8cc7f8154591599010cdc9c42b290c7a5c2a42cbc889ab43ab7f0",
            "9a42d85ad4cbd8ae63807577b994afbf5fce06acc2eaf0f704b57bcf874ab6df6e7b0ecc35973e0fa1fb8cce9d73ec0ab50b27607defb8d24b1e89fd1b5b2a1b39006e1cb5c3f79ac36453888f7e69c9746ae5b160a5742bbc9baae9dd5b7492684c7330ae15cee4b546949547834fec8d7b8921963bb42d982a40f479f2cd060d3103432517dac7f752f22d5e761a136e5b640de66201a7c35b0ff6aed6a8f42d6751deb6a261179ba2b3e3e164c4da5c8a186ada356dcbf41dd6f9f2577316dc348a98c0193edf1a5acf760202b765bc0973c77eef168be62c1828b4a05dd6069920f0891866da7ab3c0e952fbcabcbbb874ae41bdeaf61a33a6b2551f6226"
          ],
          "396f6d45-1d92-4bca-888c-086d8415aef9": [
            "899dfd7d773c7b5f1d80927e1e90caeced0785af6f8d3ba3df3420e3ce172bca6ddb8c0901afc183b692fc7ef8f2e462e4fa6c7f5ae03d8aed9af8ffce86da1bfdae75aeef810745613b69d6c49132d6fd235a764fb6af6cd552af45c10fa76558161ebdbef8c65d700ca370cf47bb1c680d908a094a23ab2527351a14e11bc8ffee43bb77067914b86a903c8a42d2317248edb5c6ca5232efd278b441010035990be81b23586f038eaf061543328ae64ba57c14823f8a0e1d65da0859e1320ac97d31fd79446fe4bc4caa5b5dd5d05b9cf23efda396c43b7e3b9b334215830f7baba610d604f27b3284ca6390a25fa022a49fd218899420192e288bb7ea0311",
            "0ad56e3d8ba74bb3a1c46c2728dcf055f84270d43260af8013ba8333ca905983f1e2314fb0fdb4e1c3e39542cd8f2940f225bfd12bba3815289f6b88c0f780ede55ed7b6ee8c32d525b16f0feb6046212a0fb446b8e28973c2161d4a193bd0da7bbe5dbd8f8849aaa0aac64dd596d6050d8137d172fc94c5504318537fb337b67d17fcf0ca17f25f5e2316190f88b7378c8f4653702823570310c09e10d4135d3e6a00fa04d121ba1bfd6a7dfc4a05e0d8bbac9c9d0086b07e3272cdede50d7f0b26fd88704cf47b5fd9b6bb6374826edd3ffd98af4f1f92bacce39a151a9d0e92372903d5494cb65eeb888f8675bef77cb2963aade2286efe1269bec50fba25"
          ],
          "0b71f1ba-cc4d-4424-8be8-431a4fd8d1c1": [
            "a56b62bb7ec50c883bf70ad9c323d3d89f9238659d59bf343167fa4f4612eca5c4aeaf7b2a3953443a583ce8f27218d24d9a21234a18bbdc2473b974848772b31feff134e489cde6164b3b46af2a1980b34f783874b74e540d041540819aed0b3480edd472d6dd0509c22ffdf4dd3594461a33efc9ef86eb3629c9180aba470fadf130be4bbc39e3bab5ec976745b6d4690855d664320c7b64c7e5b9a8dc11318bf663fd0d21608b25cc105cf32e0c1376572f0d562dc6e1ef472b7e69958ecd1d8c7963984a4b1f6cde546fda373897ed49357dda908382c1bb4b2c7fd82c873b9b41f799c741538c8598975795c828b511d7a66fde1e62b528ec570f7fdb76",
            "933b1ad487f282d721f1b951bc99f78f6c13a4b9cc58489a768fbbb398e485faa30d7964f0c7f252e3218510628e43a7601a06d0a935c13dd54ffbf1580a2200c24cb6c4f897e3daa1f9e4dcd66f91f3bc7fe3f2acb470dcd4ff17f69e462ad70a22bbdf235631968ddb7b9ad36715834a7160b4cf181df6e99a36fb3ecb3d94b3f016a276c61a05d7100679076d790b0c0ad119aee20eb52a1d4918c2a1633fcad1a3c954b541f3b07faabd3fe1c200fccaf17938b98caa85981c040c231b3a87e58bd74ae0da38bd3451975ede702869b7ec3022376cf7da6b8db1221f8dcf399fd13b687ebfaa0308451b4a7031552f9f1d3c31c8f24294d6857c4ad82f50"
          ],
          "c2b6006a-2c83-4e54-9402-331511b3d5b6": [
            "60e4f2fc51670abcd1c615b5653c3c410d6e909a1d505440fe20c7e5aa7105e20dea7eff94459b6870469fc83230ed6e3424b27f2783931c972963db6f1b1223723fb6eabe50996ce93bef76ea4a6744b2db78f537c3dcc05c1fcefbdfbd5bf30ba788a7c0729ebcf7e3f653210d26ae6641f84c4756dbe4b285ef9a78117c50508634881847e71c5fee3a0f36906a07ceca3c09ed678d39e42cf1de35c37db3c93748d78bc523ea2ffd639871c042210176c7bb85c2a0b9801da5863a8c446381df374d87e955ace8c68a63c1c99edc87f769f906a028223ee9e2290d6754deecb331c67cadaa66e6746f44cbe21052f6e26394ad11de01bac479990066a0b2",
            "352f23249405765bfc383d7a2fd5f2878ffcd6b54809c61e34c179bb9934fe1cd2d8780c6416859ca309c5d1cd75242eb1639375e3668b6f73d3b0b36c1f5be4d0be9a266c78437c8a2fc0db5fbcbafd3ad687b12304a2918f3789125363be1431a376e35647a46b4d99f4f31055de94d2f0f0f6ca34bb1f6b821f4f0874ead68657dfd082e8c884e65108005c3282e38cb220264a6a52e6fc8fb542a69e7439d9acb64283e7f901d262896b459e8a3fb5f43917f0ab33ad34d06f55a8892de231573c60800b8038c121965034251dd9fcb8c3c6eb9b2e1e4472961242fb569f75bd2682158d4c47c380a19d6637706eb85c2337984e1d9aff693995b1900ab7"
          ],
          "0019fe11-0c03-41f1-8b7c-dcda4ffca25d": [
            "9ace9e34d0f731092d14a5fde8c644d518b9c07f0b79eb3c9a8a602e85352e88f4c894a727f8deded0dbcd9ba28f8f556b11d272df0b5b27cbfe2fd12abfc0ddbd7faf8af38a26383eb853ce3a397fb79858746e248ead1aad20c4a0f04bc8d2c61ec1f09ef9235ca32b0c580821e77dbe2298df267266fc5a7dea8f43fef43f29cddf1f584910f13a4c43a157159165e8174699fdc1b3059998a13e27a144f042731ce3ffeb1f05cfdaec4a11990c75f30f203cb04ccdf7cdbac48c3d64380cad2187ac4b277b2fb151d93dc5a64cd264b0a7e6b7bcbae7ac45c116225b56e802f819289a08ff63be25f775bbee3a721dc43d146f4c3f83fbf89dd792638f39",
            "6d21dbf74a1fb88d5b1b5715ce88e36650756fdb79591afe5041e692044c26d739def8af01f043a24d83d197d09c8447c4802e8d0585547df73bab2ea76df4cc95a388190d7e90a91c3d7fb8f3a5232ee4a8f20766840932d4ecf55f369b2958e1c1607a70699ee454044c9d9478486aa89f5b9ef84bc9801b4d74e4e8182f326ebf16a1d5912121239ce9456db35a5762fcf5182c288b8992272c532fe973af4d95b0d65d80537163c0abd1c59c24f18a8944b461ea549adc2f4a05a0c44da24622cb829e843354cee06f3a25da74917af1da2c0eb140e4547974217f511efcb7e0617ae33e98d297d1472a21ba2a90b013f8d351026b6969530669cfd6611e"
          ],
          "94dee587-c7ba-4f53-86ab-280a44525c0a": [
            "68d231f1d95dd1e0059339c6bb4c9e6e04a8f916f4e9a5f25fc4a507d7e86fe6c3bf919c22d6c905bb18e21220e2a88cfe503be90857807f80d19f50b868ab9491db1dc7c9644fc8f59708e49ab337d151dfc0d731946336abf070c5eee949ac71b12adbc46c748f94b93b048e6899c19470b7f27d3c56532ae23581a9d22d30822be242085dd2bec78dae1b37b9749e8ba8011fee08da8039470f1d6b4a758aa01a3f0a3b96b1052852a7ad1f4b9d97cf244e48672bb38bf2e5561dd9f12146c55bd6c4b21806f5a21ee27f2435b01ede1221d338485d48274c8e3b078a15a2c201c70643bd208908f14c4fd9719c6b85f65a779b7573e4f93832f2f0b72daf",
            "3fd61a01828de963c86d9b3260fdc0bfe4f807f7bbf35bad8ea9f8516f7100445ac0f62c0edd834d79b15e6cfe415774178d1cf4c804b745e9bf02d8c0f9d4402154ee62367bd181bcda96669de99a4537f8569908b273f7ca125fa72d3dd9b5f59cba6baaa317ea0c8da05907a8fd91ef7658eef603649870948d3fc7098295984156b15061c1af1a80b2a5fa1a54a02764264e9dcb6f20a175aa444bf71c07325db2ba65166224a2b01719165243be064e88eb57c8aa911d37c26947f7866eb7a9b34afa08e3e88ef163c0635de3eac151f61914227280cd41edd5a137148c51680c6b6fdaaed156d0c2e6735a4fafd6c83f23ede5c819b46de7760e22b454"
          ],
          "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": [
            "360f08c57188fda91f39f92497b1c3dd5beb4904a653f0433c76f775678888a417833c7a9a157e3050ffc2ff30596bc5f320c130d75429256d9e01914b42b8e215e35bb11d493d3f6ab41bc54579691b05c0bc81cecfadcc0ab50b9483644d3ab682373aa463927bba65379a36af35a4320b70430ff98ac3c60b96e1b50ea6cdc1fb0a33b70d68966ce3dedd9a2bc5284db50ef3ba4205dd1f7eadccfcd4db7276cded2bb294272ee2386094d33ab14a0f266abc89a536790c029adc2c18176bb4327bc051cbc161fc924c61b81f953b6843d104219cb8916282a3d79f738a857ea2d4baa4d6fd381c89422e035f03726224041ca5caa51fd8ade5781f639534",
            "d4db66da762005582926261a50243ad87ea60502bdd521b3acb38e61b28c42be06b690bb72792f60f3237b82c4e111f055a78fa80af79c4f5edd6b7cf9f935ad40ed64c623b85a708d1776d1e5cdfe0cb0f0ca8d55102f09e93e22d567cd7d96928a7582ded09cb7f5bcf20655f5170e1c95a38a92f9d0fe7610fd2a4152138ea181206cdbe57982b3c97779b3df493cfb0cea989114c1d5e30cf352f347b908198947e98d39c58766b67acc7c732933ccc9776289100a35d7b2a06841352cbbee6834dfa3817cef66afe3cfedbc8e6784b81f083a888fb03a37d292b33c9f23da38f8e2f0c757ce9a40de7a20599f0e89d462ba51cb248e4440efc0c83709bb"
          ],
          "7be8ff35-5402-44a9-a1e1-dec1ba9e9387": [
            "513314197a2a99b385c7c3a7c12d81c93264355fc241fe7a2cf99ae1d21030c75c4d2db4fd97889335d0500bfa3376e442ca5009c6fd895e5a6dc72fd394eb07058c2a26d64810cfb0b13cf11c264e21de192eeae6a17712e7912b243172c44433e02fff08e4dd461dbf34677ad9c4459a4f79cd8d030b269b99cf518ae6ae8f8222cf0e8252dcc7ac1cc76f8e794ec77301d50a09b5783c144d82d1d6e954f9080bbc00e3831b24b5949221d727b27aaeb9db2bc0cac2346b580d803c6f9460495ff1bf07f8eb451191b563d96f616253d46aa71a0b74940f41aa7c6bb05aefaaec5c7c9606db22c72a89cdaa76729e1de415676f7ca9d0947041198183fa17",
            "9ea941bf89070c2c2bee05c3c2c9ffe4c9f4c621024fe14922e7331cae63e9d95103e45c0f131deed07346dffc0ed2256b4245e5ef2f1b67524a6a3337a0fe5d954ec6cb2613ffbb6f4a4047fae07de712b0f89a8a8ea084b54f4deb8101b69c9a8ccb9502d2ef786855b1336d2a70080d6112c1b95f824d567aed1607c138e0fbd33196fde3aea07ca99687c8ce2a40ebd1d9852c0785308ba7b58efa34018ea68c0891feb3a162e80ab631c35dba0b2b8bb77ddc42372768351924f37d659eaa3f7a1f52e527aef3302b8c7badd95bbd883fa88c228b79a1191812710609364f9ad8610a23fb73254c718724503bceee54a52b981e630098f519bf21b73174"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b30a66e845bc0854c700ce03450474245e76e1ba81300b24717301524ac9790bc464475c5992c362f6ddf8601939e6258ca4902331610f5b5a1cef78cfaf6e5483b56bbef821026c8dc1b3965ff8925cf62a98a1922ba4de46b189e8a3c23a74d1130ffa3d8574b4ecb25ef3f83af4d8e07bb0fc3e46dc837a8adb7c588630cbc250fc95ec00ab36afd7a9122837d481957dd6121d564a365e0907e50b9f664b22faa8aa7fc143eeb1c7c9b75089ae12671b0e752998935a4f6adc7a9cbd77ac505b2de6e8da3c408349770fd92eb3094dea978dc8f201eec3b95a893af162fe5fdd4988537673df7c89ad71f7022e8a367dd8626f34ac91b295673a63ccf39d0203010001": {
            "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {
              "34ac91b295673a63ccf39d0203010001": "544f52f8eb16990f3b7666a298eade801d0202a219c8d4656f4e7ae98ea9cd0bd872d5b1215c77941f23fedcff4d043b9eacb4f48c33ecc0e45663c00520816d74d7ea5740fc7180c9d2cdbb20e9c147133f87c2f72c0e89944a3788ebdb929368a9e83dbbb41f26c250a5b02d6e73da5976cab18260873ace3c2c899061c9213bfb545a8a1b1134f0045ecf446d3bcea518747753361c54d0ecac34f9d63475e6b9cb7f03c68ac876a8836e61ddcd352a4e04b5f980b37c665380bca0e1ecd42d6fa9e6ae40e3bce72d96d60125da45c3925b65a18cd3837dc4814931eacca837835a47b8ba685aef64dab695e62bd16a97cc0d3db94c9315a0a93854f62548"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "34ac91b295673a63ccf39d0203010001": "8a189c2c0dc6690263bf2cac600b6f781361edf4b38f189d947e69784a1b0261f128fa614b778d0d38efd13298a524f4a8a564294009a74ed3643398928909fd1536eeab47b68a103a80b502aaac24c0aacd6353b68fe9bd1b53bdcd007c01aaea61c89b5339d4fac5efe869628b05a5bbcfd921008e3d434c2d6961a43d191cdbeb6f06831c3e411ed442be4c735a871ae801bbe371f4433d9da19cd3bcccdccef8bb9cfd67cf9a7881677ce1641514cc646f2399bfa8195b97606072362f6e120be9ae0a4ae98230c322125158454bd3076b84a106f520d450b3c9937d8d4f319f093bbae8cc7f8154591599010cdc9c42b290c7a5c2a42cbc889ab43ab7f0",
              "223f55731820b91ccd18010203010001": "9a42d85ad4cbd8ae63807577b994afbf5fce06acc2eaf0f704b57bcf874ab6df6e7b0ecc35973e0fa1fb8cce9d73ec0ab50b27607defb8d24b1e89fd1b5b2a1b39006e1cb5c3f79ac36453888f7e69c9746ae5b160a5742bbc9baae9dd5b7492684c7330ae15cee4b546949547834fec8d7b8921963bb42d982a40f479f2cd060d3103432517dac7f752f22d5e761a136e5b640de66201a7c35b0ff6aed6a8f42d6751deb6a261179ba2b3e3e164c4da5c8a186ada356dcbf41dd6f9f2577316dc348a98c0193edf1a5acf760202b765bc0973c77eef168be62c1828b4a05dd6069920f0891866da7ab3c0e952fbcabcbbb874ae41bdeaf61a33a6b2551f6226"
            },
            "396f6d45-1d92-4bca-888c-086d8415aef9": {
              "34ac91b295673a63ccf39d0203010001": "899dfd7d773c7b5f1d80927e1e90caeced0785af6f8d3ba3df3420e3ce172bca6ddb8c0901afc183b692fc7ef8f2e462e4fa6c7f5ae03d8aed9af8ffce86da1bfdae75aeef810745613b69d6c49132d6fd235a764fb6af6cd552af45c10fa76558161ebdbef8c65d700ca370cf47bb1c680d908a094a23ab2527351a14e11bc8ffee43bb77067914b86a903c8a42d2317248edb5c6ca5232efd278b441010035990be81b23586f038eaf061543328ae64ba57c14823f8a0e1d65da0859e1320ac97d31fd79446fe4bc4caa5b5dd5d05b9cf23efda396c43b7e3b9b334215830f7baba610d604f27b3284ca6390a25fa022a49fd218899420192e288bb7ea0311",
              "1df017564d4496ab656d6f0203010001": "0ad56e3d8ba74bb3a1c46c2728dcf055f84270d43260af8013ba8333ca905983f1e2314fb0fdb4e1c3e39542cd8f2940f225bfd12bba3815289f6b88c0f780ede55ed7b6ee8c32d525b16f0feb6046212a0fb446b8e28973c2161d4a193bd0da7bbe5dbd8f8849aaa0aac64dd596d6050d8137d172fc94c5504318537fb337b67d17fcf0ca17f25f5e2316190f88b7378c8f4653702823570310c09e10d4135d3e6a00fa04d121ba1bfd6a7dfc4a05e0d8bbac9c9d0086b07e3272cdede50d7f0b26fd88704cf47b5fd9b6bb6374826edd3ffd98af4f1f92bacce39a151a9d0e92372903d5494cb65eeb888f8675bef77cb2963aade2286efe1269bec50fba25"
            },
            "0b71f1ba-cc4d-4424-8be8-431a4fd8d1c1": {
              "34ac91b295673a63ccf39d0203010001": "a56b62bb7ec50c883bf70ad9c323d3d89f9238659d59bf343167fa4f4612eca5c4aeaf7b2a3953443a583ce8f27218d24d9a21234a18bbdc2473b974848772b31feff134e489cde6164b3b46af2a1980b34f783874b74e540d041540819aed0b3480edd472d6dd0509c22ffdf4dd3594461a33efc9ef86eb3629c9180aba470fadf130be4bbc39e3bab5ec976745b6d4690855d664320c7b64c7e5b9a8dc11318bf663fd0d21608b25cc105cf32e0c1376572f0d562dc6e1ef472b7e69958ecd1d8c7963984a4b1f6cde546fda373897ed49357dda908382c1bb4b2c7fd82c873b9b41f799c741538c8598975795c828b511d7a66fde1e62b528ec570f7fdb76",
              "9cefe7a4d0b424457c2ab50203010001": "933b1ad487f282d721f1b951bc99f78f6c13a4b9cc58489a768fbbb398e485faa30d7964f0c7f252e3218510628e43a7601a06d0a935c13dd54ffbf1580a2200c24cb6c4f897e3daa1f9e4dcd66f91f3bc7fe3f2acb470dcd4ff17f69e462ad70a22bbdf235631968ddb7b9ad36715834a7160b4cf181df6e99a36fb3ecb3d94b3f016a276c61a05d7100679076d790b0c0ad119aee20eb52a1d4918c2a1633fcad1a3c954b541f3b07faabd3fe1c200fccaf17938b98caa85981c040c231b3a87e58bd74ae0da38bd3451975ede702869b7ec3022376cf7da6b8db1221f8dcf399fd13b687ebfaa0308451b4a7031552f9f1d3c31c8f24294d6857c4ad82f50"
            },
            "c2b6006a-2c83-4e54-9402-331511b3d5b6": {
              "34ac91b295673a63ccf39d0203010001": "60e4f2fc51670abcd1c615b5653c3c410d6e909a1d505440fe20c7e5aa7105e20dea7eff94459b6870469fc83230ed6e3424b27f2783931c972963db6f1b1223723fb6eabe50996ce93bef76ea4a6744b2db78f537c3dcc05c1fcefbdfbd5bf30ba788a7c0729ebcf7e3f653210d26ae6641f84c4756dbe4b285ef9a78117c50508634881847e71c5fee3a0f36906a07ceca3c09ed678d39e42cf1de35c37db3c93748d78bc523ea2ffd639871c042210176c7bb85c2a0b9801da5863a8c446381df374d87e955ace8c68a63c1c99edc87f769f906a028223ee9e2290d6754deecb331c67cadaa66e6746f44cbe21052f6e26394ad11de01bac479990066a0b2",
              "f8ecd289bad12b121a6a810203010001": "352f23249405765bfc383d7a2fd5f2878ffcd6b54809c61e34c179bb9934fe1cd2d8780c6416859ca309c5d1cd75242eb1639375e3668b6f73d3b0b36c1f5be4d0be9a266c78437c8a2fc0db5fbcbafd3ad687b12304a2918f3789125363be1431a376e35647a46b4d99f4f31055de94d2f0f0f6ca34bb1f6b821f4f0874ead68657dfd082e8c884e65108005c3282e38cb220264a6a52e6fc8fb542a69e7439d9acb64283e7f901d262896b459e8a3fb5f43917f0ab33ad34d06f55a8892de231573c60800b8038c121965034251dd9fcb8c3c6eb9b2e1e4472961242fb569f75bd2682158d4c47c380a19d6637706eb85c2337984e1d9aff693995b1900ab7"
            },
            "0019fe11-0c03-41f1-8b7c-dcda4ffca25d": {
              "34ac91b295673a63ccf39d0203010001": "9ace9e34d0f731092d14a5fde8c644d518b9c07f0b79eb3c9a8a602e85352e88f4c894a727f8deded0dbcd9ba28f8f556b11d272df0b5b27cbfe2fd12abfc0ddbd7faf8af38a26383eb853ce3a397fb79858746e248ead1aad20c4a0f04bc8d2c61ec1f09ef9235ca32b0c580821e77dbe2298df267266fc5a7dea8f43fef43f29cddf1f584910f13a4c43a157159165e8174699fdc1b3059998a13e27a144f042731ce3ffeb1f05cfdaec4a11990c75f30f203cb04ccdf7cdbac48c3d64380cad2187ac4b277b2fb151d93dc5a64cd264b0a7e6b7bcbae7ac45c116225b56e802f819289a08ff63be25f775bbee3a721dc43d146f4c3f83fbf89dd792638f39",
              "2bc265b79eec889ac924290203010001": "6d21dbf74a1fb88d5b1b5715ce88e36650756fdb79591afe5041e692044c26d739def8af01f043a24d83d197d09c8447c4802e8d0585547df73bab2ea76df4cc95a388190d7e90a91c3d7fb8f3a5232ee4a8f20766840932d4ecf55f369b2958e1c1607a70699ee454044c9d9478486aa89f5b9ef84bc9801b4d74e4e8182f326ebf16a1d5912121239ce9456db35a5762fcf5182c288b8992272c532fe973af4d95b0d65d80537163c0abd1c59c24f18a8944b461ea549adc2f4a05a0c44da24622cb829e843354cee06f3a25da74917af1da2c0eb140e4547974217f511efcb7e0617ae33e98d297d1472a21ba2a90b013f8d351026b6969530669cfd6611e"
            },
            "94dee587-c7ba-4f53-86ab-280a44525c0a": {
              "34ac91b295673a63ccf39d0203010001": "68d231f1d95dd1e0059339c6bb4c9e6e04a8f916f4e9a5f25fc4a507d7e86fe6c3bf919c22d6c905bb18e21220e2a88cfe503be90857807f80d19f50b868ab9491db1dc7c9644fc8f59708e49ab337d151dfc0d731946336abf070c5eee949ac71b12adbc46c748f94b93b048e6899c19470b7f27d3c56532ae23581a9d22d30822be242085dd2bec78dae1b37b9749e8ba8011fee08da8039470f1d6b4a758aa01a3f0a3b96b1052852a7ad1f4b9d97cf244e48672bb38bf2e5561dd9f12146c55bd6c4b21806f5a21ee27f2435b01ede1221d338485d48274c8e3b078a15a2c201c70643bd208908f14c4fd9719c6b85f65a779b7573e4f93832f2f0b72daf",
              "c2947b546871d5a06232530203010001": "3fd61a01828de963c86d9b3260fdc0bfe4f807f7bbf35bad8ea9f8516f7100445ac0f62c0edd834d79b15e6cfe415774178d1cf4c804b745e9bf02d8c0f9d4402154ee62367bd181bcda96669de99a4537f8569908b273f7ca125fa72d3dd9b5f59cba6baaa317ea0c8da05907a8fd91ef7658eef603649870948d3fc7098295984156b15061c1af1a80b2a5fa1a54a02764264e9dcb6f20a175aa444bf71c07325db2ba65166224a2b01719165243be064e88eb57c8aa911d37c26947f7866eb7a9b34afa08e3e88ef163c0635de3eac151f61914227280cd41edd5a137148c51680c6b6fdaaed156d0c2e6735a4fafd6c83f23ede5c819b46de7760e22b454"
            },
            "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {
              "34ac91b295673a63ccf39d0203010001": "360f08c57188fda91f39f92497b1c3dd5beb4904a653f0433c76f775678888a417833c7a9a157e3050ffc2ff30596bc5f320c130d75429256d9e01914b42b8e215e35bb11d493d3f6ab41bc54579691b05c0bc81cecfadcc0ab50b9483644d3ab682373aa463927bba65379a36af35a4320b70430ff98ac3c60b96e1b50ea6cdc1fb0a33b70d68966ce3dedd9a2bc5284db50ef3ba4205dd1f7eadccfcd4db7276cded2bb294272ee2386094d33ab14a0f266abc89a536790c029adc2c18176bb4327bc051cbc161fc924c61b81f953b6843d104219cb8916282a3d79f738a857ea2d4baa4d6fd381c89422e035f03726224041ca5caa51fd8ade5781f639534",
              "ee70db3e45d397eeb8ea3b0203010001": "d4db66da762005582926261a50243ad87ea60502bdd521b3acb38e61b28c42be06b690bb72792f60f3237b82c4e111f055a78fa80af79c4f5edd6b7cf9f935ad40ed64c623b85a708d1776d1e5cdfe0cb0f0ca8d55102f09e93e22d567cd7d96928a7582ded09cb7f5bcf20655f5170e1c95a38a92f9d0fe7610fd2a4152138ea181206cdbe57982b3c97779b3df493cfb0cea989114c1d5e30cf352f347b908198947e98d39c58766b67acc7c732933ccc9776289100a35d7b2a06841352cbbee6834dfa3817cef66afe3cfedbc8e6784b81f083a888fb03a37d292b33c9f23da38f8e2f0c757ce9a40de7a20599f0e89d462ba51cb248e4440efc0c83709bb"
            },
            "7be8ff35-5402-44a9-a1e1-dec1ba9e9387": {
              "34ac91b295673a63ccf39d0203010001": "513314197a2a99b385c7c3a7c12d81c93264355fc241fe7a2cf99ae1d21030c75c4d2db4fd97889335d0500bfa3376e442ca5009c6fd895e5a6dc72fd394eb07058c2a26d64810cfb0b13cf11c264e21de192eeae6a17712e7912b243172c44433e02fff08e4dd461dbf34677ad9c4459a4f79cd8d030b269b99cf518ae6ae8f8222cf0e8252dcc7ac1cc76f8e794ec77301d50a09b5783c144d82d1d6e954f9080bbc00e3831b24b5949221d727b27aaeb9db2bc0cac2346b580d803c6f9460495ff1bf07f8eb451191b563d96f616253d46aa71a0b74940f41aa7c6bb05aefaaec5c7c9606db22c72a89cdaa76729e1de415676f7ca9d0947041198183fa17",
              "9cbd96aa56fa1dc2c5b68b0203010001": "9ea941bf89070c2c2bee05c3c2c9ffe4c9f4c621024fe14922e7331cae63e9d95103e45c0f131deed07346dffc0ed2256b4245e5ef2f1b67524a6a3337a0fe5d954ec6cb2613ffbb6f4a4047fae07de712b0f89a8a8ea084b54f4deb8101b69c9a8ccb9502d2ef786855b1336d2a70080d6112c1b95f824d567aed1607c138e0fbd33196fde3aea07ca99687c8ce2a40ebd1d9852c0785308ba7b58efa34018ea68c0891feb3a162e80ab631c35dba0b2b8bb77ddc42372768351924f37d659eaa3f7a1f52e527aef3302b8c7badd95bbd883fa88c228b79a1191812710609364f9ad8610a23fb73254c718724503bceee54a52b981e630098f519bf21b73174"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "9UGFD/e0V/yy+ZKVKpNvHBoSy1/yuObHitxjV5w84DQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "0b71f1ba-cc4d-4424-8be8-431a4fd8d1c1": {},
          "c2b6006a-2c83-4e54-9402-331511b3d5b6": {},
          "0019fe11-0c03-41f1-8b7c-dcda4ffca25d": {},
          "94dee587-c7ba-4f53-86ab-280a44525c0a": {},
          "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {},
          "7be8ff35-5402-44a9-a1e1-dec1ba9e9387": {}
        },
        "encryptionKeys": {
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "0b71f1ba-cc4d-4424-8be8-431a4fd8d1c1": {},
          "c2b6006a-2c83-4e54-9402-331511b3d5b6": {},
          "0019fe11-0c03-41f1-8b7c-dcda4ffca25d": {},
          "94dee587-c7ba-4f53-86ab-280a44525c0a": {},
          "d7d5efb0-010e-4f95-9d6d-6e3b9fe4fcfd": {},
          "7be8ff35-5402-44a9-a1e1-dec1ba9e9387": {}
        }
      }
    },
    {
      "id": "33afc7f9-1311-43c0-9288-2335adb5532a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-50b3d43487f06679f802c280f853c7cf",
      "created": 1679923819353,
      "modified": 1679923819353,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "GwVJhEQzq2tI4gNm7m3WVSMLfHx8OwqXUuDUBfyzLQo=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "348f99d7-d67e-435a-9423-829d7909bf22",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-8cf3428c7bd0baed2456ca8ef0977cea",
      "created": 1679929529663,
      "modified": 1679929529663,
      "author": "8f5db3f2-c6b3-4f2e-b448-4c2fc5a731f3",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "z3r2w2ui8-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6f632ba676791d8b558bbe508a24c1834113cd2725e787f7f757cc9be647fd72b4f9de2ce521d794093402b4b0f1be432ea3f784037bc8cba23c4cd27b36d4fd1eec1c49d9334e8c0e505fc7c902a4780e244ea2f16f56e2b2faec8b7882aaf72d24e9b26659fbee50a599a59f148bb140e1536dc9c3b47871e24ece2787178eeddba8a606541dca6a3a2ea4c9dd5760511d2348d1aa4461f6835d7a9859ad2bd2e69f2260d03fea5f5d972fe67d5f22fc62156730910991ebee847375330268616f487d868bda1188fe25522f1967e6ae83f6959596a36fda28e2e35b0b14f136ccca37364d482ad97d3f8417481ade0e0a9cfc5147f0459941fd6cc2667270203010001",
        "hcPartyKeys": {
          "348f99d7-d67e-435a-9423-829d7909bf22": [
            "246145c68bb4898565c21c399e1e7669452070405bf5f9973cd0f08bc42c50a783a5d1e9a153b3d8bfa1432b817cf45b82af207d6e9ea8fed409ba093e9a08eae848e6a98010bf9e9519e5f8ff5f487b2594b3118f48ae9e9732df9659196df66fed10afaabeb2aa9b1118156f4ed13c2a5e4b525dd590aa29bc89a8865b6a709fb6329f13a2e82f5908046590fe479a7e50c3674a77abd2843beac57c03b20efc7993abe2e02bf56a4bd4daf31f73c76cad1fa11c70aec44ca0423d5f2994b39ce17c853cdb2b2c5c51e99d7e8f3e2caac5d87108c15208411c1cd8e5867322786a377194dace03f2c06faca26867753e99fe0e233718bbbfeb415762297b0e",
            "246145c68bb4898565c21c399e1e7669452070405bf5f9973cd0f08bc42c50a783a5d1e9a153b3d8bfa1432b817cf45b82af207d6e9ea8fed409ba093e9a08eae848e6a98010bf9e9519e5f8ff5f487b2594b3118f48ae9e9732df9659196df66fed10afaabeb2aa9b1118156f4ed13c2a5e4b525dd590aa29bc89a8865b6a709fb6329f13a2e82f5908046590fe479a7e50c3674a77abd2843beac57c03b20efc7993abe2e02bf56a4bd4daf31f73c76cad1fa11c70aec44ca0423d5f2994b39ce17c853cdb2b2c5c51e99d7e8f3e2caac5d87108c15208411c1cd8e5867322786a377194dace03f2c06faca26867753e99fe0e233718bbbfeb415762297b0e"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "448fee0ebdc0b7b5c5b1fc26a9cb5b45b1babb7231f30a06c13c318428272d86d63baf21b898b0ffe2f02d15ab48cd02465e4644339a871267c412985f180536e5e8a92238b2e857fd2f080dd76b579f3ea466aba419ad4199068a746481798a43fb0c02d9cebcdad537b96e85b8b569b6958ef6cddd3688c8025b97310ef41cea5217210cc7ca9b4179f37f24961b5539536bfe14918ce866d62f12db86f1e50dd831f2c67ad0477d6ebd82b7adc1599e2ad5310db5744803e294d5720d8bfe26755013aa6057be2452b4d3195ed6ebaebe6080a8fb690608a6776b6df8a6676418e14079b52765b8ec7b16201c61366cb4fc141b578e81acf797f382c8d13d",
            "b13a89e68f8bd2475db9140fd73fe76c04aee8868c35b91114408fae2e9e9f57dfa114b5358152072045ea986cddda53100908eb792dad7640b209a369ba059e33951043069452f25e5424c476eb0251bfc8447d8bf9bedcd89759636c0d7ad6076ef1f02a8dfa5c2e4c74f3829fbcfb0f8787a6296d53bdbfd2cb286b4e91bd3490e830bed2086ebc928aef4e163beaeda70da516122d3b459e592e9b7424f3ab673a64e81cd40336106cdc5dd3eef0b67a65816208e6a3cef9b25f5ed374eb18132464ce8e947500f12b4f9f3106345ac9c69f4d5ac3327d6d174e6908ae05befca809766aae7cae0ff7a97f9253eff7d1d18e87a8634e38892c14647c4d5c"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6f632ba676791d8b558bbe508a24c1834113cd2725e787f7f757cc9be647fd72b4f9de2ce521d794093402b4b0f1be432ea3f784037bc8cba23c4cd27b36d4fd1eec1c49d9334e8c0e505fc7c902a4780e244ea2f16f56e2b2faec8b7882aaf72d24e9b26659fbee50a599a59f148bb140e1536dc9c3b47871e24ece2787178eeddba8a606541dca6a3a2ea4c9dd5760511d2348d1aa4461f6835d7a9859ad2bd2e69f2260d03fea5f5d972fe67d5f22fc62156730910991ebee847375330268616f487d868bda1188fe25522f1967e6ae83f6959596a36fda28e2e35b0b14f136ccca37364d482ad97d3f8417481ade0e0a9cfc5147f0459941fd6cc2667270203010001": {
            "348f99d7-d67e-435a-9423-829d7909bf22": {
              "147f0459941fd6cc2667270203010001": "246145c68bb4898565c21c399e1e7669452070405bf5f9973cd0f08bc42c50a783a5d1e9a153b3d8bfa1432b817cf45b82af207d6e9ea8fed409ba093e9a08eae848e6a98010bf9e9519e5f8ff5f487b2594b3118f48ae9e9732df9659196df66fed10afaabeb2aa9b1118156f4ed13c2a5e4b525dd590aa29bc89a8865b6a709fb6329f13a2e82f5908046590fe479a7e50c3674a77abd2843beac57c03b20efc7993abe2e02bf56a4bd4daf31f73c76cad1fa11c70aec44ca0423d5f2994b39ce17c853cdb2b2c5c51e99d7e8f3e2caac5d87108c15208411c1cd8e5867322786a377194dace03f2c06faca26867753e99fe0e233718bbbfeb415762297b0e"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "147f0459941fd6cc2667270203010001": "448fee0ebdc0b7b5c5b1fc26a9cb5b45b1babb7231f30a06c13c318428272d86d63baf21b898b0ffe2f02d15ab48cd02465e4644339a871267c412985f180536e5e8a92238b2e857fd2f080dd76b579f3ea466aba419ad4199068a746481798a43fb0c02d9cebcdad537b96e85b8b569b6958ef6cddd3688c8025b97310ef41cea5217210cc7ca9b4179f37f24961b5539536bfe14918ce866d62f12db86f1e50dd831f2c67ad0477d6ebd82b7adc1599e2ad5310db5744803e294d5720d8bfe26755013aa6057be2452b4d3195ed6ebaebe6080a8fb690608a6776b6df8a6676418e14079b52765b8ec7b16201c61366cb4fc141b578e81acf797f382c8d13d",
              "223f55731820b91ccd18010203010001": "b13a89e68f8bd2475db9140fd73fe76c04aee8868c35b91114408fae2e9e9f57dfa114b5358152072045ea986cddda53100908eb792dad7640b209a369ba059e33951043069452f25e5424c476eb0251bfc8447d8bf9bedcd89759636c0d7ad6076ef1f02a8dfa5c2e4c74f3829fbcfb0f8787a6296d53bdbfd2cb286b4e91bd3490e830bed2086ebc928aef4e163beaeda70da516122d3b459e592e9b7424f3ab673a64e81cd40336106cdc5dd3eef0b67a65816208e6a3cef9b25f5ed374eb18132464ce8e947500f12b4f9f3106345ac9c69f4d5ac3327d6d174e6908ae05befca809766aae7cae0ff7a97f9253eff7d1d18e87a8634e38892c14647c4d5c",
              "f9eeaa6d65ad581ee9becd0203010001": "5c174c8fc4b113296bba1cb74bd5ca86a7f01a70d0fe96f31b0a9d51c63954019874a5e1953799edf778f8eba5b0232835053006763e67da12efb13e396646e4221c050173230efce368dfc17e3f43dcab778f26eb70f36faf3f31dfd489dfb3db1c644fd6c6552576954d0ad12e4231948c48d21c42a056ef06065d677d8a2a98ac258bbcb80ff53c5c3dc7fdef94993994752fab3edbf1a5343079719f6f4513d887a2236b18fc3a1762cd9967481e5e3a5800cdd806aa435dc84783c38bb6fc01c93f71884fcf7cf035c81461a19f026939f98e1536439629e6cd40c88c1c9923d68b509c59fa2087392148515256ca949adfc163a56ffce798f219998a3d"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a9e333cb8a01c33749903703029c8660dd4cc39d4668d0862d2398baa075915ba4be4a9f9127dc84fc2b813cf20936143fa84415d4d9e06b441fb267e4b783c14a4a7c9ad4600270dd8d6ed7732ca3f7fe835ce5f9d4a4b81f59cadc015ff19c90f1d47eeba792cfc639b7d5335804a0c08ed56820bfd721cda57a148d3cd7ed0d96c6d84b5feb5e4125dd873ced0fe4478f841cd84c9f49008c25212c7aafb73ae97d2b1b479f1bde15b39e08a7db9cbf7cfe30b0bccfc64c64331b0451a3e4943de7a366739ed429510f2b6efcf669d10214e058b7b66e7aacfa6c9f4945dc0c345538c5c4ff724aa75837f2e17b1d92cc73b414f9eeaa6d65ad581ee9becd0203010001": {
            "348f99d7-d67e-435a-9423-829d7909bf22": {
              "f9eeaa6d65ad581ee9becd0203010001": "663d4473513986176b50bb98a7b61c0a8cb468273e3b53dd245ba87e1a88ddf7faa103da910ef4efff11e36cdfb59d8c64f5ef41586f97fbaf775a16f3998ae67ecddb08a20211325bf0ecc3548a1c0cf8e0950151974cc4affca47e8dbe5fe8c308f725c27ba20e284e063b2ec743f3c0228672f2969025a2f3e9be29a985509522e0c5013dcc49ee8c52b6adb46d77f3290d1e6f231f06c3ec56d4971b282431478792069fb20699d385cf67641f0a59d2cf86773ccb6bc242d0be910dfbe1f7694001409b7953557936790d16b5482188cd4eee9de9669f5ff23e39e9d388bfcac5011abf74344b3066b1dbe50d897dbbf41de02707309f0e7c31fcb4facd",
              "147f0459941fd6cc2667270203010001": "62ec1e6da8d3c47ccebd08d99874aeecff6c58d9587bb8f4b66e24a632cba5c71035164205021b322940a30b2647defdca96f68c6a740aaa9da0eef6d36fc242ed3bc0ebdb5e738fda22b572ab9a8b52c3620c267906edb706977a3252e7630968e8d4402a7fefc022bd6605ff9ab6ae0c712c0735476706d40939c4c7fb569c65891daad3f8c35e707200d09d033be3b6ce642c8082f1d69b81558e952f2404246576d4fb510a9b692eedd32a178b362799480d5b99f3e4c513e77e174d01aeb5c6420d8e802d700222995b78d76508066618a6b3154f750208425026c61eb6d215c959c451909d870b3785cf75832bcd59454d3e7b6b3b184551ab53bc0e90"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "f9eeaa6d65ad581ee9becd0203010001": "2b913f2690e44d8bb3f6c56ed7505e9ebfe6c4ed53a5f7e423f58c7804f014a39c516cbdd2ea312f4eac6bae45a322746e3adaa3423120331fac99ac9a707d3c1cd8648c5e936d522581238a3dd24a2eabfbf8cedc1c0be1f79f6c600e15f9b350c3056e79072fdb3aca2d20f1b02c35d66956a61b92d834049cfe76971e8135f048ec1f6bafee231938187b3702566b03229d1313938867994566793f8aaf767a373b15f5553d67b243f91482b06c7968507089a932009130513c51d34cf28a7776ad8b08a9d4fa3b95f4880ae18fffa429ef1ed1fecca8f91151f6f524d5c0a80a41b78cfb8a007e2db9932a132637aeaf57621cbd511700ceab2ab1550132",
              "223f55731820b91ccd18010203010001": "999ad56198c5bead409b62bf18f698c43bf5575124f700d5ed161cb634b7b3bcbb51b00725ee77c536c200afd46c961e022afb5c23799ba13826d6d83c6f7f1c914cad1c73e8a55fe5f403df1834688e7b2aa84b4a5898fa4224840b7e79f924fcca9e3ea7870e75217bcaadd5a5bd0b582eece8079ff3cba3955c02d4e37849c66b58f84cf4b0a9fea75cb972449ec0d067708e1beb66eb603b9a1c543d5e5254111e269b5a526b2afd7d6a20ba9d1f3ceba15c087f276586e76ec437218a645d69b856ba2e2f11ab736cc24b1921b3fccf9223a38017574c08c9580c40563a672fd9edeb7d9febb144bee0e64eb0994309944f8f8dc850de8bf59f0beaba79"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a6f632ba676791d8b558bbe508a24c1834113cd2725e787f7f757cc9be647fd72b4f9de2ce521d794093402b4b0f1be432ea3f784037bc8cba23c4cd27b36d4fd1eec1c49d9334e8c0e505fc7c902a4780e244ea2f16f56e2b2faec8b7882aaf72d24e9b26659fbee50a599a59f148bb140e1536dc9c3b47871e24ece2787178eeddba8a606541dca6a3a2ea4c9dd5760511d2348d1aa4461f6835d7a9859ad2bd2e69f2260d03fea5f5d972fe67d5f22fc62156730910991ebee847375330268616f487d868bda1188fe25522f1967e6ae83f6959596a36fda28e2e35b0b14f136ccca37364d482ad97d3f8417481ade0e0a9cfc5147f0459941fd6cc2667270203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a9e333cb8a01c33749903703029c8660dd4cc39d4668d0862d2398baa075915ba4be4a9f9127dc84fc2b813cf20936143fa84415d4d9e06b441fb267e4b783c14a4a7c9ad4600270dd8d6ed7732ca3f7fe835ce5f9d4a4b81f59cadc015ff19c90f1d47eeba792cfc639b7d5335804a0c08ed56820bfd721cda57a148d3cd7ed0d96c6d84b5feb5e4125dd873ced0fe4478f841cd84c9f49008c25212c7aafb73ae97d2b1b479f1bde15b39e08a7db9cbf7cfe30b0bccfc64c64331b0451a3e4943de7a366739ed429510f2b6efcf669d10214e058b7b66e7aacfa6c9f4945dc0c345538c5c4ff724aa75837f2e17b1d92cc73b414f9eeaa6d65ad581ee9becd0203010001": "b0a9edd6906218dfea70278867a15f11149777e7ffe6b43fc9b16fd6a10ba53accfacb30649d347554db90e5c76f8668b56102a70082bad51fd46199f80029d3d639ea2d636855d37811488a0615e8dd288da91d15a99c416f9c42b32fa5723db839a4f47a5a4d42dc1d7dee56facea702e30528d57c319e32b40974c34a2e3c0d005b800237060f37ff92bb1adcbfd5bce900a4e2e0dc2be73abbde41b94371ffa8b8855d2d913eb83834ebe8f844b068fb2c04b587f51d0c88c67bee557a5e39c6b7ee1964e9022268cb32c160600324fffdfb0aa6dd469ecde43b9f2a7110794168416f689cca2fc8ff9c135533bd4ac70aadb00984b148bf9b369704082c89146ccdd43780403e6af64e261a47b80f8d26fcc127f80c3c0cd50e92deb9f318fa5b3300b1b369e03e1810808a4c2c4be133c9df45d373a73d39f7fa31862e97ac830a1aed84f899fbc3701f08b45e35ed1bc8a01439bb036535e47eaca1a0f81fbc2b497e4f6eebcc7159dcf3605a1c594ade1aae19b8ed39ed20d5ea5e840ba99c09b03f5f8375eb524d38e3eb5f933be5da324026bf25b729b9c841e62ab074967944e033d25c5f81157f3d0d8bf730d779c50a103a06c866a9169abcbfbbd9a40485677d7b684138367e403544e92e1df1f31acec2cb5e90ec158d567dd1aaa8cbdbf91bf8ad023431cc3d6781d7b8114be191c0f3319194ffa73deaeff40f58b8e2d591ec3c5ce52854b4ee046a118775f78ccf892de4ecd4444f1a35090175b5e99eeafd519dd6598168e1614390cbbb85656ef0cfa0c03be2dc5e6a299ecf09541361b6c3b0242e0fb85cdbe3b537e77a93e8bee479147fd8e91403c214a4e6759925b11203a70f02edf5033c918542e956c1a3fc4614cafc8a35e9a2048a6a4fea9ae1fdda933f7d3e6d42c66440617bf74758cd89de2b953ba51afdd90c107adc17c65ba9b3825959e2493f51796d40f9591db41ce5caf62491238921b54c3ce58b979d2ff4cab35ed570cdafd19264dae31349500b75da094f43339bf170f42df574a5d8238a120bbbae7ac902f0453be6875a59b75550e93a4927c2f8b712c678239915517d9f450862bbc4262a534ab4e6388c4beb7fcf3ef0f88e980f9f028975da9ac5f86591b5c289f2061476acca4077fa0eeaa897ab3539c81c52eaeaaef0bc2769ad616abc8bb01820b717bd2162800d93f09e13054a64a3307d20ad9c6457aed92b37cdaeef6c4d1ca0e68ccaa1d4960d081d8946fd7b660c74af7cd41b904869d24700d4048be2959903c7fe64794a97d09011846323d07a4ef7b1af05b1e0e1d9026a22dbb1c80091f352f6cdcb3c11bff8210222080db3d3de056476f6207ed9d32d58468f2bac395181a3eb316718c9db8eddf9bdbaf1ea98dd91b888f5e41b57a2b3a6bdcc4e12cf8de2ae2b02c4c88d56a947414925adcf86abfe3873ed971dcaf8424b76eb285ee6ebe64e473785561edb5a148c966a64f1ba2f7b20194c9140f6df3feadaacd75a3df830a73286abc46176963e3a99149ba8252ba9d517cec4faa4ff2565ef6ecdd9ef41e9f009297d41c1679ff18e35be87c2fcf49066ecaab77c8fed409be5817b3551850c6df1e293e0382131016250ac37f7f1e910bd3ebf37879e941513071470c5481d41c06e5aa764d465967c5bd3d9d3c065c840545d0503d4a29fd0b08ad743ab25eecd967e96b0bd81fbe3155bf09929be92511907beb6d3f2703ee5e50485ea95d8876217be"
          }
        },
        "encryptedSelf": "18imXT/zc9L7iuakGCbr73px3czrtuouir7c82KenH4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "348f99d7-d67e-435a-9423-829d7909bf22": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "348f99d7-d67e-435a-9423-829d7909bf22": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "34b5e063-45ab-4216-888a-3326160d7262",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-d1bf99ae80c744b1e4be1ebf2a90bbcd",
      "created": 1679929540051,
      "modified": 1679929540051,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "3700ccba@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a02820101009a5dbbfa5f71872ea6e0d9a4a2beb45699228585dace097892f6126804e51309b838faa760a290cf74c6801acf33d99dc39ca8fa2696a89da7f5a8bba8095a9a7a2f66a65581aee721454f3a97c3474b165aa0909cc6ff7167301cbac389f02e2e86e89e7ebdb534823d4d4d2e135477f3947f3252c9d47d041850426c643434d5e5d6d430cf1d919f9f991fef026b19e9d7f265f6048a08249325256fe72db1236352dec7d8e29aaefbadaa66de40025e08770b630de129de07d8a7821a9693309bec80f936825c9664badc26dddd1c5c5149a9f57d900f7a47c089e898839482c4ec29b3ffe612376ac7c7ca775c00de5112d5f28929c47f2aa72f8a89ffdb0203010001",
        "hcPartyKeys": {
          "34b5e063-45ab-4216-888a-3326160d7262": [
            "75dd4c05cdc18c99cb58fe13ed8f88839a500ae4242a3aaa925f004dee6dfc54188ba29594b35a33078d30b41ba170b0a5742784f91e2a53c054e43539c1e14179294b62f9233f1e153f1e7dffbeee39eeadf99c706e678587eef0d5611b276ca38b80de5313789894a18294bb8ee3a1f6a94d468f57b9a4c23ccfb34d49cc1893801e647948b7ebde33b070066e16f76a8ebb97c1d9e89eac9a839bbed37030c18053a42c1764251cf6e3f93cb09a850eb709c7b3fb19fa1a973735efe3400c7273c6c8a4e9d961ca67863696136ec8b9893406675852062ccf9b5ac35029b0b6801b8563093f5bf450f7a8ae95440e851732a2c588943ff35f3f9b0c11c4d6",
            "75dd4c05cdc18c99cb58fe13ed8f88839a500ae4242a3aaa925f004dee6dfc54188ba29594b35a33078d30b41ba170b0a5742784f91e2a53c054e43539c1e14179294b62f9233f1e153f1e7dffbeee39eeadf99c706e678587eef0d5611b276ca38b80de5313789894a18294bb8ee3a1f6a94d468f57b9a4c23ccfb34d49cc1893801e647948b7ebde33b070066e16f76a8ebb97c1d9e89eac9a839bbed37030c18053a42c1764251cf6e3f93cb09a850eb709c7b3fb19fa1a973735efe3400c7273c6c8a4e9d961ca67863696136ec8b9893406675852062ccf9b5ac35029b0b6801b8563093f5bf450f7a8ae95440e851732a2c588943ff35f3f9b0c11c4d6"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "295636bca19c21b5028013a9b9d14ea5c1a086296a162b9407e31e9e357517b9098877b1a9294e92419ca4d1c2b11de8a8cc9bf5034c27ba6d434552cb8da196760a01058dd42fab237c2684cb6a74cc005fd04c5eb83b1cf11ce339c45bcc8359915aa78048803dad2b55383c38853b013f25e639ffa6ee5bf6aa7acb2da48b270acac3ba64d52de3e9dff453d700f470b4f7528ab879df742a7f2003f6d20a973bb650a326443747ac465a65b802ffcc7cd95544f548f70f9a0df9c7b5f5911421d8bda2ba9a172c891e5e562a788c425b9ba4a7a3a42a241c98bd43f9f771a8b3578a81ea2e79943e6faa1dd8b6bff8b0167177c9addda4d1b43bda22dc87",
            "c4df3a28f389bfddaebabbf7a958603224489eb0ea6ec61e872fb69333ec9d22383e707a3b52907573e71a1a7fd071b61564a579888eb3d293680112477465eecbf090d9afc3c59670bd536b23df923fa177ddb7a6fb074cec5c2fce28b293830b8df4678b34075a7d99dd3a1f399f7f0957aba079ef4afc7ea4f61693a1d3f7e86f75b1c72e7813f729bd1a5fb2a699fc5f02f27409fa1ee6253adbd76d4b2ac1efa34ffb27e0d3a14b8ea3b1160f0cb8f40828c5a4d1457f27c9ce48efdc75378107e336f8fbff95bfad9fdc79c7b4a6e45e698b80d01a44b06cb7caf0f788a82112d261d93f24cf37e25a8342bf3cbf70d11fd5db3890afcfe05678e45f3e"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a02820101009a5dbbfa5f71872ea6e0d9a4a2beb45699228585dace097892f6126804e51309b838faa760a290cf74c6801acf33d99dc39ca8fa2696a89da7f5a8bba8095a9a7a2f66a65581aee721454f3a97c3474b165aa0909cc6ff7167301cbac389f02e2e86e89e7ebdb534823d4d4d2e135477f3947f3252c9d47d041850426c643434d5e5d6d430cf1d919f9f991fef026b19e9d7f265f6048a08249325256fe72db1236352dec7d8e29aaefbadaa66de40025e08770b630de129de07d8a7821a9693309bec80f936825c9664badc26dddd1c5c5149a9f57d900f7a47c089e898839482c4ec29b3ffe612376ac7c7ca775c00de5112d5f28929c47f2aa72f8a89ffdb0203010001": {
            "34b5e063-45ab-4216-888a-3326160d7262": {
              "8929c47f2aa72f8a89ffdb0203010001": "75dd4c05cdc18c99cb58fe13ed8f88839a500ae4242a3aaa925f004dee6dfc54188ba29594b35a33078d30b41ba170b0a5742784f91e2a53c054e43539c1e14179294b62f9233f1e153f1e7dffbeee39eeadf99c706e678587eef0d5611b276ca38b80de5313789894a18294bb8ee3a1f6a94d468f57b9a4c23ccfb34d49cc1893801e647948b7ebde33b070066e16f76a8ebb97c1d9e89eac9a839bbed37030c18053a42c1764251cf6e3f93cb09a850eb709c7b3fb19fa1a973735efe3400c7273c6c8a4e9d961ca67863696136ec8b9893406675852062ccf9b5ac35029b0b6801b8563093f5bf450f7a8ae95440e851732a2c588943ff35f3f9b0c11c4d6"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "8929c47f2aa72f8a89ffdb0203010001": "295636bca19c21b5028013a9b9d14ea5c1a086296a162b9407e31e9e357517b9098877b1a9294e92419ca4d1c2b11de8a8cc9bf5034c27ba6d434552cb8da196760a01058dd42fab237c2684cb6a74cc005fd04c5eb83b1cf11ce339c45bcc8359915aa78048803dad2b55383c38853b013f25e639ffa6ee5bf6aa7acb2da48b270acac3ba64d52de3e9dff453d700f470b4f7528ab879df742a7f2003f6d20a973bb650a326443747ac465a65b802ffcc7cd95544f548f70f9a0df9c7b5f5911421d8bda2ba9a172c891e5e562a788c425b9ba4a7a3a42a241c98bd43f9f771a8b3578a81ea2e79943e6faa1dd8b6bff8b0167177c9addda4d1b43bda22dc87",
              "223f55731820b91ccd18010203010001": "c4df3a28f389bfddaebabbf7a958603224489eb0ea6ec61e872fb69333ec9d22383e707a3b52907573e71a1a7fd071b61564a579888eb3d293680112477465eecbf090d9afc3c59670bd536b23df923fa177ddb7a6fb074cec5c2fce28b293830b8df4678b34075a7d99dd3a1f399f7f0957aba079ef4afc7ea4f61693a1d3f7e86f75b1c72e7813f729bd1a5fb2a699fc5f02f27409fa1ee6253adbd76d4b2ac1efa34ffb27e0d3a14b8ea3b1160f0cb8f40828c5a4d1457f27c9ce48efdc75378107e336f8fbff95bfad9fdc79c7b4a6e45e698b80d01a44b06cb7caf0f788a82112d261d93f24cf37e25a8342bf3cbf70d11fd5db3890afcfe05678e45f3e"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "A7Gl9OfzcYxuOO4cgHDSdkflJGAjO+fx435xz1b2HH0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "34b5e063-45ab-4216-888a-3326160d7262": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "34b5e063-45ab-4216-888a-3326160d7262": {}
        }
      }
    },
    {
      "id": "38ab3318-263d-44d0-9fb9-6c17483d920f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-50ac812167df23434f35fe98e4237b17",
      "created": 1679923819453,
      "modified": 1679923819453,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Wp8/xsSlifg4MzZr15sONGUfWK3MwGVL+SZLsLZZLCc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "3dd37df4-3351-4d3c-b0b4-dcb0344e735f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e5e97f0ab823a8f977786b253c3833cb",
      "created": 1679920185165,
      "modified": 1679920185165,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+6qne3okvm@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "6VdfC5PDH9SviYe08d0kFSUcjqpjTlTUxK5sfNo1/hg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "3df147c3-c011-47f1-8f84-4d4df12aa4cc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-75d3e4bf6a8dc968492c2b806c0b8866",
      "created": 1679926240046,
      "modified": 1679926240046,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ZPgIE6bWu7I0JaTFIC/1D1kP9vFltd1/7PUgAv+YBh5UJH+CmyU+U6UtQDpO7bAQ",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "3f56fb2c-9713-4a34-86c0-5769e4429826",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0a5db2c5ed3a5f8fd2eb7a1fc66879dd",
      "created": 1679929596477,
      "modified": 1679929596477,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "etGO3WeGfzrRhjdbd5WqGkaxhO5SldwmPztPSoedVJo=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "422e3d0c-0f7b-432a-87ff-7e03f2eff554",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cb59452b635c4046b332d1aafeae0fa1",
      "created": 1679924652296,
      "modified": 1679924652296,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "HSy3NxiOzPKZoqglAfxkoKoXoVYbDD3U/yznJ6w//EvltX+y9lwGli5HBS2wVCSd",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "426c614a-34f6-4337-a12a-b5aeef9e93dc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6ce8626df109b8a7adf0bb579256f6fa",
      "created": 1679926212755,
      "modified": 1679926212755,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Qt39hNcKchmoXQnP3ik5y7lxxUL7qAH1J5azbXk1Uw5Z35Lqszg4rRm5wZrYR5bO",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "4300e125-a76a-42c1-8b95-93f5d157a52a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ca8cf454fccf3a101e8fe000a1cd56c0",
      "created": 1679928236831,
      "modified": 1679928236831,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "4AiNdhIpwm4rdTM1QPit+wQKAqc0GUVNfad4Jvb7N4MGSrJRIJKOfzEeBE9wkvj8",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "433c5f0d-7729-40f3-be00-996f89a62c93",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-779d9a5460eac465694f6cb57b471c00",
      "created": 1679926583577,
      "modified": 1679926583577,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "rhbmYnggOOf67/RBN40X0DXdqdMS8BykyhGSiCpVTnc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "44918764-135c-4ff5-8332-46f49f06fc0b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-32b3f3163d06ca4179c4b6d158b65299",
      "created": 1679926261544,
      "modified": 1679926261544,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "48UhhldSHVf21TUyNrKk8IrQYSON3vz2i4GPwZ8jmPQbB/Y6fzNNvMDFuzyOqMeN",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "46e0cefe-3ebf-4401-83b1-b756b257e297",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-551345fc5e0e671605c816b8309765f1",
      "created": 1679926245965,
      "modified": 1679926245965,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+5eigz381j@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ub1+DOZOqNnHOi+NT6InYHYdM3Ua6YOdM0x3zVMWHr4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "4860c510-a28a-4c31-a3a6-e0210f798ad6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1224537645d4232f527f6153cabeed54",
      "created": 1679929521152,
      "modified": 1679929521152,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "myFlbpe69YfxYWN4QOalGxCvzl5EE75qjJ5IbDN45pjwYt+1kCRyPCvPq330Pom8",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "486a6b23-2fb8-4815-b81d-dd3b5040ce12",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-b6f21753f031bd3d5ca131051835aeec",
      "created": 1679925869851,
      "modified": 1679925869851,
      "author": "40d44232-c0a3-4fca-b842-9598767fddf8",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "jkiafinf-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c714446550ac977b39396f397e32b0384b6ffecbdb772def2bed45479684610baa721fbf2e79406f161d74059d32f0514d4aaf3d8852c735f1327227880877ec6c828317f26e7724467023137d55ee806bc7dc82f4ef5109a0b391f4bc7a8da0ec0a3a87106460f32d6b3d878a49757bd2a4ff8d2b18f8d829186497fa4ce19a289ef6718eb73819ff02f6be039f41124dcb4b5f97d7d732acdd53f3a0a3ebfee455c1c0d138cb8b728c496ac4b38524690e2596869f39c73ebe391e79fa2df44aec65ffff52e635bfbefbe685a0b069c1609c55c944045533773724ee353d67faa57ad71a468d4ffbbb4a7d697f394bd89b7e6d96e9b56cf7037856c64ed34d0203010001",
        "hcPartyKeys": {
          "486a6b23-2fb8-4815-b81d-dd3b5040ce12": [
            "5710ace5fba23f213df046bc9ba3f437bab8ddfab9c48170b560e5af7a1241259507d085a12de1afe786ef266d5ee494b8b5773bb8169cff4d151f356d33f80ecb6150acc9ef4872b68ec35197961bbcb58001f99dbdf377b06ebcb113dcbdbf68be6f40b722324b3b9b2e7d93b1c2ca33d35145aca065ddfe26b5a81c6f6abcb2466e10eae03a8b380014ffedad3630b8ea06c5155b7ae0decbc7bbe477c33574daf03c08562c283a2ba3108a2864621bc087e86504a0f62fbe43014a1330e7349089e77ff709d5dd3482af84d0c1563231a65c0c5e0108c12e2dbc8db13d4dca20c6cd195c492f1aca02aea151e3df56fd65ffdb244dc0815d188c06df5db6",
            "5710ace5fba23f213df046bc9ba3f437bab8ddfab9c48170b560e5af7a1241259507d085a12de1afe786ef266d5ee494b8b5773bb8169cff4d151f356d33f80ecb6150acc9ef4872b68ec35197961bbcb58001f99dbdf377b06ebcb113dcbdbf68be6f40b722324b3b9b2e7d93b1c2ca33d35145aca065ddfe26b5a81c6f6abcb2466e10eae03a8b380014ffedad3630b8ea06c5155b7ae0decbc7bbe477c33574daf03c08562c283a2ba3108a2864621bc087e86504a0f62fbe43014a1330e7349089e77ff709d5dd3482af84d0c1563231a65c0c5e0108c12e2dbc8db13d4dca20c6cd195c492f1aca02aea151e3df56fd65ffdb244dc0815d188c06df5db6"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "2fa171008e8cf6e24285c09beb09780eae001e8fb7eb1eea0b7dfce79638b50af1ee3ae8fd5f805f60b689b40c19678611b8a382f8140216601a99fca91dd95f0c2ee2f4b9916bb85b04e34e751603a9e0c73c9bab440581475a3bed39617317df4dbd637a5ee9b2f6e0d864c6c786fe9ae691d4d3414285d7496a9c21c4b6481ce9dea33357a447fb34207ad26dd65395d496feaa3e9670850e3d2fa7a72c4a8bea024aeb906f3a2fabcaf895e8905c25b103c355973f3e6e7d85a8647761c720166cfdc0fd02fee9d7351460f2ed77b934158f9e858ee89abfd7de270976bc5eeaaeb5ce5755cae26399d4c68d9a7e18f56bbc8a5a20dec6b8c8c975aae209",
            "a5abf648881dd21b221eee0ece8eef23acb4e68e032ca41b54a6e4ec11b72d9c242183ccca60c8a47bba900cf5e0b1769e97af3fc4c8d2869572cf6554ca0f09214ebd5881ac71939c983f5de42eab49e1445e5872ad23bbf2490c67a195784458a97e17edac7cdfcece43ce01f815c3a06d82753a404bce204ea091511fe9c1aa1ff8db7de43c5ad1aaf51f5476e3b5c82bf85806ff6d8b21234a617370224dc6aa8f98aa13d3398c0f86776b88b5788d0f3d2caa8b9d9aae7c3482977634bd7639165a7e943b7a08f7ce43720869d151593e0f029ea3657d8a95de5531a050332bd5db132944fbee6b1be5f8c9619ea693c3af71dcf9096bb7340ec7eacfad"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c714446550ac977b39396f397e32b0384b6ffecbdb772def2bed45479684610baa721fbf2e79406f161d74059d32f0514d4aaf3d8852c735f1327227880877ec6c828317f26e7724467023137d55ee806bc7dc82f4ef5109a0b391f4bc7a8da0ec0a3a87106460f32d6b3d878a49757bd2a4ff8d2b18f8d829186497fa4ce19a289ef6718eb73819ff02f6be039f41124dcb4b5f97d7d732acdd53f3a0a3ebfee455c1c0d138cb8b728c496ac4b38524690e2596869f39c73ebe391e79fa2df44aec65ffff52e635bfbefbe685a0b069c1609c55c944045533773724ee353d67faa57ad71a468d4ffbbb4a7d697f394bd89b7e6d96e9b56cf7037856c64ed34d0203010001": {
            "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {
              "e9b56cf7037856c64ed34d0203010001": "5710ace5fba23f213df046bc9ba3f437bab8ddfab9c48170b560e5af7a1241259507d085a12de1afe786ef266d5ee494b8b5773bb8169cff4d151f356d33f80ecb6150acc9ef4872b68ec35197961bbcb58001f99dbdf377b06ebcb113dcbdbf68be6f40b722324b3b9b2e7d93b1c2ca33d35145aca065ddfe26b5a81c6f6abcb2466e10eae03a8b380014ffedad3630b8ea06c5155b7ae0decbc7bbe477c33574daf03c08562c283a2ba3108a2864621bc087e86504a0f62fbe43014a1330e7349089e77ff709d5dd3482af84d0c1563231a65c0c5e0108c12e2dbc8db13d4dca20c6cd195c492f1aca02aea151e3df56fd65ffdb244dc0815d188c06df5db6"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "e9b56cf7037856c64ed34d0203010001": "2fa171008e8cf6e24285c09beb09780eae001e8fb7eb1eea0b7dfce79638b50af1ee3ae8fd5f805f60b689b40c19678611b8a382f8140216601a99fca91dd95f0c2ee2f4b9916bb85b04e34e751603a9e0c73c9bab440581475a3bed39617317df4dbd637a5ee9b2f6e0d864c6c786fe9ae691d4d3414285d7496a9c21c4b6481ce9dea33357a447fb34207ad26dd65395d496feaa3e9670850e3d2fa7a72c4a8bea024aeb906f3a2fabcaf895e8905c25b103c355973f3e6e7d85a8647761c720166cfdc0fd02fee9d7351460f2ed77b934158f9e858ee89abfd7de270976bc5eeaaeb5ce5755cae26399d4c68d9a7e18f56bbc8a5a20dec6b8c8c975aae209",
              "223f55731820b91ccd18010203010001": "a5abf648881dd21b221eee0ece8eef23acb4e68e032ca41b54a6e4ec11b72d9c242183ccca60c8a47bba900cf5e0b1769e97af3fc4c8d2869572cf6554ca0f09214ebd5881ac71939c983f5de42eab49e1445e5872ad23bbf2490c67a195784458a97e17edac7cdfcece43ce01f815c3a06d82753a404bce204ea091511fe9c1aa1ff8db7de43c5ad1aaf51f5476e3b5c82bf85806ff6d8b21234a617370224dc6aa8f98aa13d3398c0f86776b88b5788d0f3d2caa8b9d9aae7c3482977634bd7639165a7e943b7a08f7ce43720869d151593e0f029ea3657d8a95de5531a050332bd5db132944fbee6b1be5f8c9619ea693c3af71dcf9096bb7340ec7eacfad",
              "7c3eeec92c8f0506bc012d0203010001": "34a58a43e6306b6a24b2ea8965b6b28fd59d80a2c74a4802616937cc709ebcbecbdce493609d68de34c09f467ef7ae3d789d100da9b055843d29ee2a54ddb77e036db040afb0d5165d02ca8be7b70f67eaf067e7fc433981685cb6ef9b4542a48f69e23cdef5834c8fb160c4be78b73ba43f37022a2bb53b57670231739012f2dcd83f2c57d64626693a656d1c425701b43db36181d3a78918a42cb89e710c47029ac5d59a5ff72e344d52bb3111af73367ea97f73e1096eb920d8909c6183972244c0d5000eaded4c9b8c003525de713340006f470ac91940906ff9a07d979ce85069560bc8d55db6ea2962205237ae7710d0af64ada49466596fe407733357"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bdece43e8320d67a4a99afa3b229acb4904d658206a06f33bd647db4339ce9f505301a2370c42944e7ac45b6b54bf6245d5fde39a1e46329884dcc3fcbfaddc0009e668f63a7906ebee58bb1ede39f3b6a97166a7fd36756949d98297c97acfada5ee3e0e237c305e1808339ee11712b7729ed1a73335b645362b29faf2d68a2c1dda7575bfc0a7f0d990627b98e9c36a644b3621a81155947c99657ec7936c3fa2420142c613f7fa7e2760dd1ce795c3b99cef8bb6129a45a7ac808ee575c947dbcc7197ef68f4385a51ac246bb372f97ac1230eff1a77d0555f25df7e940af77d8807e2f3a3fcdbee5dc4cdd898e4caa503ffd107c3eeec92c8f0506bc012d0203010001": {
            "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {
              "7c3eeec92c8f0506bc012d0203010001": "645160cc12e4de97cdb63f56812100ab744649fd4edc4b9195b345f5285960a0b04122c6ddde77ff8c9bf5a669d23119c248d0bcde4b239eadcd7bd78a28ad37f2d4b30dea680a33c73c51a17deb9227d2f8670280577cabf9d2072625d70b883790c61edfb702010e3bf122d3824897524cac3e320bc48a3a5c645a8ae06fa1a421a63bf41f04f243f745f553a8801f12339360c6a685c1662225399429c55a815610ddad6cace1041e33d154dabbd8aab3bc221c864fffe8c33fe1a52e237a0a832bf161309435582dccc0054f37c12cb56b9bb7044130f4740819e09662cc864816a07766809f36a81888d5ed4b5ffba72e5cca2807b241ded6cbf4aef893",
              "e9b56cf7037856c64ed34d0203010001": "70a973d967003c522678784ec3ddd5fc516171dbfe4b7e31eeac59b812cca15404cd378302650d80d28e1d714f07430bc881a8120156e18c2dc434b9fa9e35d66b9d496c849387bc1fa46d1898d9c3f2479232e49a143f85aa327228e4f6688608cad30eb01b24d57e1498e37f59b54a7b44981c8c49ba5e559b40a37358a4cae74e414485ab0d41416d8e16a61b4501eeea44d04e671271718412eea46ed842e575b124f21da4f4d55de53f0bd2c3f2ed6c48a94d77627263f737b4a8378fd344cc89c9d43c7ef47a604789a39d50b6f2e84002f1557f1fea0c00acef46bf593cbb2867bdc364acc9940ec1a87b4d63902ca52aab14670e010d98041dbd6026"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "7c3eeec92c8f0506bc012d0203010001": "03678486f4f4419f9e25498dc3af49efa04fd1defc134bf67eaec1fb7f4bffb9303a49a8ff507993aef44495f62d34fbd417b43ca3dc7d01cfbbab736a66fa667ca0fa3b4e407f26d42e491d1e5f252d3d2b70c954d2c385bc9f4192b31a9a7ccab3bf3ebd0e75a7414557e16866a423fe1e2845613e58d94bdb8a94e7cb6faf5c9903ffd1882fadeb396463a7e5665d805ce097d254f63d1133bd26bf0473a516eebb3d7a0b6bf221a4bf2d58d74e1acc9dfd1d752e29f774bd2244eacb60b44038378ddd7ea66e27f553e55fb40bbf1daef819095c6088ce975172360cd267ee9e3d7c12fe0b463dace794dac92db7c90c344136447d50331c375db8cd0f59",
              "223f55731820b91ccd18010203010001": "bf7e80ccdbce42f55adb8b69ac7eaced74425c3d861605e0125513433decc562aa645e4b7bdb20ff8af7f458b1fc72562f6b3c9614fe37c5b8a4f665fc72c4837813fc058529cb5bfed185ffb6adb97d1478bc1ad4b1da919bf8132c26bc360e9516f9e81ae34e952e9a8b43df3ba191f8c5f060f16d4a77a989a3a745510a2a163535726d65483b6328ffcf87b532f26653edcc9fced1e1399b30ff746ff7cd909fc565772c2be23e8ccce6ccf1158a45d8ddd553c5af24023e48bbf0d8dd44b09cb7c4bc1a1f2f62b0ca2ce47a71927080e619ef40cf373c5ed68ddde2fe220eaebaebfbfb0fac8baedf4b8084ca28f3487bc1265a0abc14ed39edc11fab85"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c714446550ac977b39396f397e32b0384b6ffecbdb772def2bed45479684610baa721fbf2e79406f161d74059d32f0514d4aaf3d8852c735f1327227880877ec6c828317f26e7724467023137d55ee806bc7dc82f4ef5109a0b391f4bc7a8da0ec0a3a87106460f32d6b3d878a49757bd2a4ff8d2b18f8d829186497fa4ce19a289ef6718eb73819ff02f6be039f41124dcb4b5f97d7d732acdd53f3a0a3ebfee455c1c0d138cb8b728c496ac4b38524690e2596869f39c73ebe391e79fa2df44aec65ffff52e635bfbefbe685a0b069c1609c55c944045533773724ee353d67faa57ad71a468d4ffbbb4a7d697f394bd89b7e6d96e9b56cf7037856c64ed34d0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bdece43e8320d67a4a99afa3b229acb4904d658206a06f33bd647db4339ce9f505301a2370c42944e7ac45b6b54bf6245d5fde39a1e46329884dcc3fcbfaddc0009e668f63a7906ebee58bb1ede39f3b6a97166a7fd36756949d98297c97acfada5ee3e0e237c305e1808339ee11712b7729ed1a73335b645362b29faf2d68a2c1dda7575bfc0a7f0d990627b98e9c36a644b3621a81155947c99657ec7936c3fa2420142c613f7fa7e2760dd1ce795c3b99cef8bb6129a45a7ac808ee575c947dbcc7197ef68f4385a51ac246bb372f97ac1230eff1a77d0555f25df7e940af77d8807e2f3a3fcdbee5dc4cdd898e4caa503ffd107c3eeec92c8f0506bc012d0203010001": "80f14d0428f676a7b0e91d4907874649977366aeda07b2dbe26b431178b89ea06ddb7085aa8622b3786a10a9ba56bbc62183bd5a64e85f0a9dc8de3fe996c3b013b06212ffb64e147256dae59788e5775911d96ebca8b28675131b9779884c0f231fb86f8be9c2d23ee5e6e9029ded88cb3b997b3115e2bf5eadfee1d6a57f7abb7487a7895288a37deb8379ce025608b911d160e7498280a6a038a5d5198d65b363eb69055d1edcbdd57251cd8be71f3899dfab27823464cea0868086927368de28ef9254516849107cb2c82fc5b2f5729d5871ff5f87b01b24692a7bea61eaf33b18aadb01c891ed63966545d5ef6abce6491d5f6001b235fb54471f037c6358027bbdb65c7653987dbe14a6754515b3a2b82e3f265bf1a0da6d7de12caa8fc9016480ce63d8c71827fef533c13add84bbc1db5273e8cc8d01f5da447d988abbd5d7222ddc170ae882fb23fdeda7c65217c91efbc7dbf3505c03ab0a030b7f3cb99fb832880fba5e42ff85ba1676f7cea0c1c158411bfbf0e3ba008860732e1a2e6cf6be2ea5003fd6db87f7f3cdd76a48c989a96f8477343efc33327e4a6cabc710008e2c20e453a6bb842329a630114c55f08d9411bb7a396b2e0c81ade4167b40949cba22b3a25e33fe0dcdc5a820d67000481649b1071ce10d733b5e4560263be10cb75ea26fc3a95f0a04ddae9d9fd163dcda96bfa04b0a4215e3cffe116ef3f6139773317356b30c4178245e7732f37f6bc55abdf6dd8053956dab55f0129c2ee3d9f1b9493e452b6490871332e1d6dcda220a8553371b2a2332fee7737875f73e12d086f839b4073a48dcb62a0255437179917e9dfb08e21cfe282fd8a12f21ae93dc8ca6ce1a26ae45f934756fa660056b394e365018b1205f8f9784a5c8692551b151dc658bdf24acae70b68440680679b772071bf3f8e7d5135efdd80c2105e849a7300cdcdc55077bb3f64b938585bdb0154ba29d8928eb1193dd917d0946aed2cccc980b92003fdcbd01cfe30880bee2a79c106e707ceb5268fd27630993b6987c3c432f265f4ba60ccdf6b7157ee417580aaeba737a422a0dd8793afb45759069416f54e169e25270e06c9966486d1163d91e31a988ae73db48ecd37d6af8be3f11d5dda0ed71d0d081770a905688d96ff4226386c8a2ad169d44cfd733c600fcc039acf483eb85412eb43be83f277fc44a077c76ca67899278b96faeb5805e462c5e11dfdc7e0ad3b6a3be176a5954c9c45dc8f06a7ce11582288b0760e1eacfa4d725373904c3dee5cb3db3c08458e2bfd5a3713e55fa6ed7b36425a726a9a3509f4adc434ed3aded7a4ab680d76d8205357762095bd246e5883eb4e819d2ce5e4016051dd4d71c168913d5c222e59bc3e662de30e3af8a1ff20283ad365ab3c1e70bd49d5c79734430bdaed2297054ccc801bf40074ba9c6a3d72ecd1bf45003f3acf4bb33a8b92ee556d55ba693c9364205833750952dcaf3c6726353f43ae9f5af0ec8918a70fe520c5f437b91a86fa5f4d508e08a2ac70a2578330a599bf2c539e1dc48a7223696a5dc149be9704821443556a80d23cd04f87182f32d0b6353ee52c7df297c2989bbc12b26238eeebd9cdfabee68561db31fb89fa008d8fa239668ae92c1504d0b4a9285445459c9bc6feabfbd396e4c18f53634e9ed04ec4236f36e140f0a832a72d8fa7683b8ae5c9388bc43a967b1eaf1498ee601900367917e30d560c3a174ae6b08e7e0d66738a7835807372a"
          }
        },
        "encryptedSelf": "udC4ilCUlZLP30c3jz4HTh0hvnS5061a097YLHp4W30=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "486a6b23-2fb8-4815-b81d-dd3b5040ce12": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "49df0fda-f2a7-4e0c-8dde-25f805608eb7",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7a8c5ce5cf2f7cb3c6b701e1a9a2a221",
      "created": 1679926268901,
      "modified": 1679926268901,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "bd652025@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "cjigzWmp3qoKdSYN8gcJ44y5hxzLGCxXYlYkwcdYzhE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "4a265a36-f0a8-4901-ad8d-2b6b585ec01f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1ad6a7a9a8a76d87abf984ea7138f4f2",
      "created": 1679929596379,
      "modified": 1679929596379,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1jIDw/HlaU0A1F2pPElRbZGzGiv4iJe5mmscO11TCRk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "4b7c976f-a819-4a10-a532-e76a0262a7a5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-f7ab3404b80f1cc880ef15ae5172f862",
      "created": 1679927896235,
      "modified": 1679927896235,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "b93RZYtt5O2ZTUZPVKRpKrQWHgxBdH/R+S5SyGXZMoqEwGHWx1CjgXI1471mwdGo",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "4c760021-cebd-4e2d-a60c-fab767ca5b2d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7ef011ba2eadf216928b6e0e97e0cf1c",
      "created": 1679920192372,
      "modified": 1679920192372,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qeIPu41y9kCPeEah/HP6tLoA7AIHqt4PZNfXU9xSz0NRVg1B/YnBOBAZp4Q1sAjH",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "4f19919c-1a11-49f7-9d0e-a1eabacdce81",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-66c6fa9080c376e9da504587b661ad8c",
      "created": 1679926265461,
      "modified": 1679926265461,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "xMPLtlaxU4YMgDsL+w/06+UeWyAmJ+Zu+7kj5jTmwFM=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "5091e6dd-ea1e-4697-9407-acb6b06479a6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fbbb31e1420131c333beff68a43aaceb",
      "created": 1679925835356,
      "modified": 1679925835356,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "o7w+KmxPFVAIT9AmZSTlMK2A9U5cMdpsAohSiSxW5B+TYEgfRY2WUx75lrEdBvRn",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "51a9d196-e0e1-43a7-95a3-9f807c3de96f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-68f088785664f32a0f31c95ac360adc7",
      "created": 1679920630932,
      "modified": 1679920630932,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1u1k+3+NBee4mjHt0zdbi8e/Saes7lS/FIrkyo88uBWEb2Hqq7QNOZR77+DHoBJb",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "525ffed0-2ebf-4763-ae74-7cdd49aadf3b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bba8b49773be07fa4a2ee718748a99ed",
      "created": 1679926241875,
      "modified": 1679926241875,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "4dFHlOpcC6VcYtykhgSpnN/xO7fg0HtJgyEeoU8Aq76c7mKrLz2etEJHXKzpuJ6e",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "532374c0-9b10-4218-bd6a-cc379cc4457f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-3d3311991fca41f7781e93c4bfa2b6cb",
      "created": 1679920149963,
      "modified": 1679920149963,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "pDSXGX4GUMZxuEnmDQfkooAAwMAx+rOlrQSOOoMG+amnjO75ikm7bubyBnsCqfOm",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "5448c371-8efc-4a27-b20e-8baf3464d93c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c388aff28b5f053aac9ee09d8779fcae",
      "created": 1679929588138,
      "modified": 1679929588138,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Z1XE9kKEteRsWkGYTxhDi8TcnWk9UI0F5DPtvf6YIuMFSNg3EpyXLNiA8lA773Jk",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "553ed1d9-5fec-48c4-86a0-0e67b2a97172",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0e3aa991420f86939b7f60f7fe2cbdd1",
      "created": 1679925859262,
      "modified": 1679925859262,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "UQxgEs/mkj+nbSyF1l6AEA87snqSJnc1xBEXapSWoV4h1KRu98HUhVR4m6Lc0DNF",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "563d32da-1887-496b-866f-41a6b2fc8e5e",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1b85a9e8d667982c4a35b29d85279de7",
      "created": 1679929446014,
      "modified": 1679929446014,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "QwQUR5PPfc05WXFMxi0RkixVzOZdgEqSI6rESYel24WG7iipIrd6bseIxNwJHbVm",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "5932c51b-fd73-438e-a7ed-0d8423db4b1f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-03c5da970aee951d1d83d022804c16ec",
      "created": 1679920146125,
      "modified": 1679920146125,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Rq5+FhNffjF9653OPntntubObzHuT6ofLa/TmFxfYXZFU7K5kkj7UNo+i4yXK73I",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "5c0264a1-b767-4af3-ae16-837a18ab8edc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-d3b0e8b8868d88437934301ed7dded97",
      "created": 1679929584295,
      "modified": 1679929584295,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bsaQldpQ5OvYui9IrZu63yHO3RAKltF45G2bPWQNu7CYp+n5Gl4UYztqhAIAHuy9",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "6242e684-c1dc-4492-aaaf-0904878f7cee",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-40a200bb6dcbb07c842b7ce696879ecb",
      "created": 1679924677253,
      "modified": 1679924677253,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "0w/paboOMR7HxHha5Mrk+0TvgrGS5TvLpHAf1sU2K+0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "63002f77-ad14-415c-9694-c3518a70d1c4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-291edd4532c45e97fd2240086489f841",
      "created": 1679927861138,
      "modified": 1679927861138,
      "author": "4f1c27b8-ae05-44ae-8853-4b20a0d988ef",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "bllsstcil-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e165b3eb6cefa444c8cff6c82b126d4187e0d40b680ec5c8735daf9f08879ed59fadede3ce12e5c8691f7a591959c3e1a1c2d61662659af68ab35fe56de22d57d91a8ec814e7c74ff8df75427a8f9f123232cbe81478693ae6f0ea11a50603e9d82ab19852226000ec706ed8bb08a2f6e55de11962e54d84900cbf7b1848e675dc50804ccc5c995763cb6fb02d42e539812e7fb83193d8df59391c5b8373d1257bcc34c09d0b1005115167452eb647c4bd407dbe1ad640016b32cd96b2784a02a0527c86e972f900345f41559ea82f9ff4a4d0209a37b02fe5d6e42031ea7472bff7aca9e0d8e5a4830b8885570935b8977982e5cfc444d559b48231b4fbaf090203010001",
        "hcPartyKeys": {
          "63002f77-ad14-415c-9694-c3518a70d1c4": [
            "1c643b36e5f6ca1f1acf52c065838c15c3c1e773870ba1e9952e2f90487bb1c1e610719f7340c33bc9a281be6b42b6b68f19686c96a1c78838a7fa7887828db739b3b20dc1da31256d5ed08af8a960495d9f91eb437e12f190286893aaafa13142b08aec98fec12f1f58fc0621304c6fe464f4132422104523caf938d5fd0d1827600aed158dc4e37c6b93fc43a9735c5bcf17778e4302a9ebc69d278f4a2e453b8d6f4e83b4c86260812951d1e688ea754d5881c51bf943b20964eee4b45edd602c44894f362986224487fd454dce411250e8da04bbe7472132dd8989fb8ab7ba923b55c10f02aeec7c1c48e66eb82087c8daa50e3f8344424d174d576f6f9f",
            "1c643b36e5f6ca1f1acf52c065838c15c3c1e773870ba1e9952e2f90487bb1c1e610719f7340c33bc9a281be6b42b6b68f19686c96a1c78838a7fa7887828db739b3b20dc1da31256d5ed08af8a960495d9f91eb437e12f190286893aaafa13142b08aec98fec12f1f58fc0621304c6fe464f4132422104523caf938d5fd0d1827600aed158dc4e37c6b93fc43a9735c5bcf17778e4302a9ebc69d278f4a2e453b8d6f4e83b4c86260812951d1e688ea754d5881c51bf943b20964eee4b45edd602c44894f362986224487fd454dce411250e8da04bbe7472132dd8989fb8ab7ba923b55c10f02aeec7c1c48e66eb82087c8daa50e3f8344424d174d576f6f9f"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "1ba042ebfd06185531385b14cd09dad85f6c3bc74c840799980f605994ee79c83221678fb0fad1da1c945e0119e1f4fde0a36164c1789f7a4ea6cfc2baf97a4acfee2adc9a0260c03e00c7e57e02c2c2c4c571f74e9a7c03e2dfe56b305b6a1b7caa02b132270459b798ced69e841f6a55b77e413d19a7bdad44c46ece6bf17a7d8790a3a614151713b0d754d593f0c94147059943935d384d313708edb9644cd46d0f99ab35b45ad89cd66641a7068cc9a6c00f4438e628673bbda436e6e9e4c55db483d898e00c6a60b08a332923a9129fa00d737de9ed549f82836e14ca585ed03230c992a24d221c4427adfc01e1a7da09d9a5241835320f31ce2283a6aa",
            "364a82968f68309f6e6ffd4ea6aa29ff6682b6dec3793cd74a1bfb75087fb8f12faae73174d3032ad1d3f0916dfa910adf9caf6625d650e94a676af47429323eb1e2b4deba6f872214b99ee3a67f70342aa87628fe1336bcd872fa0c41ab0616bd55179d1598a84e708c0cff24a23973b25de030a4498c646bb6894e1a3c3171172c255b51ed355813d96d894b7183ab4dc2336ab92fb7fbe4e8dbe36ba41481608012db59a92d91adade7f84e5cd46b832078aefdcf993a66e433a7bf30197a41dfdc3ff2bd87b441f63d2ca685cac901a48109c8adab7d0b2ca9e68882cff9f2835b5320df50f1b1648c920328f45840dbc2afd1855ac37af1bdb1e8927473"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e165b3eb6cefa444c8cff6c82b126d4187e0d40b680ec5c8735daf9f08879ed59fadede3ce12e5c8691f7a591959c3e1a1c2d61662659af68ab35fe56de22d57d91a8ec814e7c74ff8df75427a8f9f123232cbe81478693ae6f0ea11a50603e9d82ab19852226000ec706ed8bb08a2f6e55de11962e54d84900cbf7b1848e675dc50804ccc5c995763cb6fb02d42e539812e7fb83193d8df59391c5b8373d1257bcc34c09d0b1005115167452eb647c4bd407dbe1ad640016b32cd96b2784a02a0527c86e972f900345f41559ea82f9ff4a4d0209a37b02fe5d6e42031ea7472bff7aca9e0d8e5a4830b8885570935b8977982e5cfc444d559b48231b4fbaf090203010001": {
            "63002f77-ad14-415c-9694-c3518a70d1c4": {
              "c444d559b48231b4fbaf090203010001": "1c643b36e5f6ca1f1acf52c065838c15c3c1e773870ba1e9952e2f90487bb1c1e610719f7340c33bc9a281be6b42b6b68f19686c96a1c78838a7fa7887828db739b3b20dc1da31256d5ed08af8a960495d9f91eb437e12f190286893aaafa13142b08aec98fec12f1f58fc0621304c6fe464f4132422104523caf938d5fd0d1827600aed158dc4e37c6b93fc43a9735c5bcf17778e4302a9ebc69d278f4a2e453b8d6f4e83b4c86260812951d1e688ea754d5881c51bf943b20964eee4b45edd602c44894f362986224487fd454dce411250e8da04bbe7472132dd8989fb8ab7ba923b55c10f02aeec7c1c48e66eb82087c8daa50e3f8344424d174d576f6f9f"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "c444d559b48231b4fbaf090203010001": "1ba042ebfd06185531385b14cd09dad85f6c3bc74c840799980f605994ee79c83221678fb0fad1da1c945e0119e1f4fde0a36164c1789f7a4ea6cfc2baf97a4acfee2adc9a0260c03e00c7e57e02c2c2c4c571f74e9a7c03e2dfe56b305b6a1b7caa02b132270459b798ced69e841f6a55b77e413d19a7bdad44c46ece6bf17a7d8790a3a614151713b0d754d593f0c94147059943935d384d313708edb9644cd46d0f99ab35b45ad89cd66641a7068cc9a6c00f4438e628673bbda436e6e9e4c55db483d898e00c6a60b08a332923a9129fa00d737de9ed549f82836e14ca585ed03230c992a24d221c4427adfc01e1a7da09d9a5241835320f31ce2283a6aa",
              "223f55731820b91ccd18010203010001": "364a82968f68309f6e6ffd4ea6aa29ff6682b6dec3793cd74a1bfb75087fb8f12faae73174d3032ad1d3f0916dfa910adf9caf6625d650e94a676af47429323eb1e2b4deba6f872214b99ee3a67f70342aa87628fe1336bcd872fa0c41ab0616bd55179d1598a84e708c0cff24a23973b25de030a4498c646bb6894e1a3c3171172c255b51ed355813d96d894b7183ab4dc2336ab92fb7fbe4e8dbe36ba41481608012db59a92d91adade7f84e5cd46b832078aefdcf993a66e433a7bf30197a41dfdc3ff2bd87b441f63d2ca685cac901a48109c8adab7d0b2ca9e68882cff9f2835b5320df50f1b1648c920328f45840dbc2afd1855ac37af1bdb1e8927473",
              "8895a0553e9388e7eeb7550203010001": "03dbfb6f0787e569fb09395753882a68d90d861a0e5bab065eaa7499c9b6e59e92715ea3c61dbfd3cf9ffa69c80ef4e889dc6450dd154acbe59af974d40bd2d1c901715227e55766e100bbb2414ab6ed60bd7235a2060f5d1dc3dea94919843741fa8badc463f991eb30043ae749916aa63139c2b3938697b8bfdfa656293f957ee08b10df47b4879f8387b7cb6cf8cfcef6956da4dfcb17b5ceca7b9f820f203e4c2a1a751395078c1a8ac0d58ffa44030294469e188278f696913e2c1ae701760950b0fb7cecea53048fd5f42829ad419062a47d2e63caa5dc0a558650626b4831e4dfe9d6cf6b6d771b1cfac1ae3a0827843f69ea3b2c09c8c1b1a3b960bb"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100be68f1d9b0bc455cf7dcc84cb1b1958a067d082f5be523f10eed309d06b9991a94f3f4683ca1489e5373fcaf958754c9a2a31468f916465ac3c43c7fe621d87a435f253ae64c9e39ec96198112dd9561d94cfff417ba18504bc3c21d0afc02b45baeb4f39408f52dd3a7578a50f4c5d6c45cbe3e9733ac6b64066677b70b5d81019ba1f41d2d19edbe85f6fc7be44f5aff39693bed2cd834d62345721938ad6eb35718c676844afc684933af560497775d848381f82b3514b0728a8e899d66bdcbc37757a6a7fb291bd34e5a937c8770ac0f4ffaa3c5b4560e0f214a33a6d5f26527f3e6e6d3c467255c67207f6689a4ada0e0f7cf8895a0553e9388e7eeb7550203010001": {
            "63002f77-ad14-415c-9694-c3518a70d1c4": {
              "8895a0553e9388e7eeb7550203010001": "1f9df3b67b16172a6a9ccb356b9d8d09e3b8d28e5793b9e0e6d03baafaf744b36ac8300bf330895e1bdc3f3129e8d932053a627a3abfbcf8ff81721f2a009ce9864c28f083c98bdfe0b74e75d06862cff57800dade54e04fa3d6be2bd021c89989027c064113de69a21667921153544d26a1632c262636173e36e5622adb9db0069e8c2ac10153aa3a0e8cb30ea19141c241fac1cd2524736821a24435fd8271c05fccff1d162b1719a9a7e0e9a8490b5d2a990eb7e31bbb553e26c4c4c8e5300e5dd0c63097c40c787fd3c3f80c2de2ee11d6f3f5fd08a7789ff0b4115c2361357a296987c81c28d30bdb24257792a553de8c90aec28053b24f92dcffd64ddd",
              "c444d559b48231b4fbaf090203010001": "8c3e4e0fc8ab1f5aca9af03e9d37eb1e4ce83f32cd8dae504a2be5db960a1c98fbc1e039f121b0f317a5836642e5247d158a1051ebaa7a786fbdcff281dd5971d7fc0cf7e35067955aa454c794466bee6c881a99c5a597995ac0d5c6ba3cd40ffdf5667a3d2d78366232b57ffae4acbd96432917e188e08f0d170f766a24370400a40cd77fa3ad57b300366be844b4637054c30008c15a5a82235b0c349688e90f117291f4af3b22c3e51370975645f81033cf251b61d9afc59c26e6eec23f8199624a9e93c452b95b2b4bfad1995566a99c4526036cc43c30f532f2925f9c89446818beeb535c8d5ed9856c88e3ee03685e7a9670dc67ec52942e1f8c188a0a"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "8895a0553e9388e7eeb7550203010001": "20eec07879b9c2bdfffb3c8deb1635ae35fae874dc88d92e4a142092dd993fda83f780833b720bf39d8539eac279642c3f670a0a2b44e558e33417a779407628d6a256be44b7d3625b8861dc5af281f8246fddbbbe19b3ee15bdadee241e71afcd274663d50ebc7fd22421d39d99ea6a90ad7a3a70fb68a0b58c73a0c807edb4a25ac3889ea057726180ee375b1691f1550f2ecdb75ed473ad9b8325a95eca93c950434a5ec0f8e4961b4bbb58fd235b74b23ed035216e737f9f7edcd86709cd813a8e670f92ea9fcebd357ddd7e66db14ccb4eabaec689c8dc36a833ee3f37fc39b8b096baac60db3ce374190f047e7694d8987d1798a7364cf95deb12c008f",
              "223f55731820b91ccd18010203010001": "6d60513051d830d81463d63161330a4846f9c7fc3b014871449c3f6c19505ba21152118bfb07ebed79da75bda50f367959d695e57189617efa31020d7cd93c1abef2831a8102222724aca200d2ad81890974a33205f33b042d562487ef3914e9867621f61a97cd2e6c1aaba0c03e3702f9aed3a6b83dab12279805539e6989b1389e86d1aaaa3b26d8a773893cf5380036e7a3e76d8466ceabdae10b1d3095ca04c8bab30eb9e9994ab9ac74766abbdb1bcbf1e6a27b8ea934ae0aa24a0986108f696064ad5354a9c3f58bc419e32a71597e9a7f655145e0cebaae23d014681f3055570d2d46600eed113c675c0862c7916f61cbb87a4b36a33d50dfe30317a1"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e165b3eb6cefa444c8cff6c82b126d4187e0d40b680ec5c8735daf9f08879ed59fadede3ce12e5c8691f7a591959c3e1a1c2d61662659af68ab35fe56de22d57d91a8ec814e7c74ff8df75427a8f9f123232cbe81478693ae6f0ea11a50603e9d82ab19852226000ec706ed8bb08a2f6e55de11962e54d84900cbf7b1848e675dc50804ccc5c995763cb6fb02d42e539812e7fb83193d8df59391c5b8373d1257bcc34c09d0b1005115167452eb647c4bd407dbe1ad640016b32cd96b2784a02a0527c86e972f900345f41559ea82f9ff4a4d0209a37b02fe5d6e42031ea7472bff7aca9e0d8e5a4830b8885570935b8977982e5cfc444d559b48231b4fbaf090203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100be68f1d9b0bc455cf7dcc84cb1b1958a067d082f5be523f10eed309d06b9991a94f3f4683ca1489e5373fcaf958754c9a2a31468f916465ac3c43c7fe621d87a435f253ae64c9e39ec96198112dd9561d94cfff417ba18504bc3c21d0afc02b45baeb4f39408f52dd3a7578a50f4c5d6c45cbe3e9733ac6b64066677b70b5d81019ba1f41d2d19edbe85f6fc7be44f5aff39693bed2cd834d62345721938ad6eb35718c676844afc684933af560497775d848381f82b3514b0728a8e899d66bdcbc37757a6a7fb291bd34e5a937c8770ac0f4ffaa3c5b4560e0f214a33a6d5f26527f3e6e6d3c467255c67207f6689a4ada0e0f7cf8895a0553e9388e7eeb7550203010001": "06b7d48e583033755cde91a526a3b5a3c2f8181398a2196981546c89aa728b2ebfe7302abe28df2e4e261f1d9aade813269e478d12cce67db59daa8e29be1f26448e0bdcc1f8fc565b9b506c3390b0acfb75e21ba56112b7c653464ade12479bd57456028aeba28e66ebbd39afe597bc1c7cc0dd6ecbd18cd2cecc7f60eacdf1bb0cef8e105c239f88cd97d103b27dba9abec37b17ebeecd2d4e8b97b03a6511796fad34a548de9bb0dba208d432093c71d9546fbb30a75a8707a61baaadf47aa391cb24acaee4e7fa741b363eaa110d559ed68766e8d8ee1a7eb1a16eacbdbed0a858e90c2bcddca5ff2dbbaab1950a7f338ef9f7d872d63db28c2da1e8ee7ab57da461c738c70fc53b1b59ee1e5410fc78890b01a24ca458914983b6c8f760502a628c18db28bfc46b075a638c5f1a88de716c13dbb6bff45e7af051d08675c798eb231b0794e12fef37fd3276dc2e04831d42cd54d5e84c33248c1c46b77662075f133e374808e362c3881014539d18f004a886c06355706b47e3e8ab169cc7d1bbc13945a03b241d75d4394e894b223693e6014da142bf669cbb42ee8e365c0628b20b4ba83dc876fd0db8dfae3de1e381c75c86f58459cad1fa97386b3a991349c845108387ca22a72d1abfb3b61aba56da5e86c9b562204aad3951c420159fb7987c012db110d4af77d9f37f17fec92bb040ee737230346cf5b867141959650290533747c0644c0b140dee6442f64bebd10020cf82e9fad069e83095b25207acdba2e16183603318956f0db19826c615a546f8f0347cbeda1a07be449db70961266a4930de52966cfd4d487cd65b597f2aa4314db30b035d0b5db61abc80fc3bfa3133000a87e2477a5de5acff10c655021d26791eddc9c0ae95e3fa520eed30513b4a6305879536a07725ecafd28b294a9fe1ae2edafaf66214db4f8fad934108d792dd08a172434b9e5b23317e40dc94eadd2ab38fa5e47fb5fa4d75aa4de03af10199e7a42447e156636a5869781f85d388a88f5966831c5a7226638ea7e010e092a5f44fe172ad25fb087c30363b3cccdc2c36392a5c4fb83d1ba47ba02f8990de7f6564a5d81e01dd3f111d6146712d75ae1b6698db80cbef89388c1ff896d028e908a9af3a83399c63956221826747f2910e7b12bd400288de1c6b974ac1c2b24496e419c77673e550a52af886d68beab1dd968db031968f3657a38dfe02654912adc53e62a52fd10713e0ae51a07aa8d0fcaf91a2fb80c72e10bdce0a5264fed2a9c31ca866b60a4bf57f20448458c88948971c5444a3ac6c790656fac85e8922e01ec57085a941f7b77e231cab1350559c20ddecfd4c93ed62ad0e9a9a7c0b474ed76b68d328dfb6330de7ff7f6ecc9c5a21f9a34e96715896ed43b24d5773693608b6e2b7c75fc7593a6bead5e771bb5ea6d04a8f106845de97745fbaa0ac57c369be9a3cb3beca44328579f6d402ca3368b3854b941adf14ab474a380ceef622d5432359140bc9b06f82c5594a9c294edeef589f9349ace415b19f280dc9a3c6fc359c5461bd526157f97306f2ee773418d0d9737a3d76c06f29726a1acec0401096fd49423266f519681beb8ad2facb0404e061aae3e9d8f45bd7d335d7fe831af76e4e843b969c8b078c3096606efd6251b233e3e5108f3fd16192a9aae8136ae67d4ec87a7bb18c9eb2d2da8a3e4dc4659dc0a2aed1303a8700d44dd3c4cbdbe2e6a96be7b82a873cf714d23d3b29a52148c4d89ca5e9"
          }
        },
        "encryptedSelf": "ZnSzNSFSlNAdt58hbu/ktjrq1prbM9p9AKm95jDFkoE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "63002f77-ad14-415c-9694-c3518a70d1c4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "63002f77-ad14-415c-9694-c3518a70d1c4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "65aae741-1ec1-4804-bfd8-9805954dc277",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6cb13d1b28d29914e5aa64b6f0e2bd5e",
      "created": 1679924677206,
      "modified": 1679924677206,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tCAd3jqSfPs/+W/kehJHn3iVat2Sjja651FRTPeaPvQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "68c77d4e-8691-4cab-b6d0-d5b93f49885f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d80104a3aa864a5ace53e2fd11cc2158",
      "created": 1679929426993,
      "modified": 1679929426993,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ocx8Bt4oreEJX1M2TBZF1NnJbhNGNDOwkcmNZKsqw7Q=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6bfae4ab-b5df-4b6c-8268-d9a97282359c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4e4322a73f114d2e067e8e06692dea72",
      "created": 1679926583841,
      "modified": 1679926583841,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qdE2Zxav8ZLAtGnMwLFx9FQvB+bMBQTXs7AKrL7nuhs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6e17112f-4e9b-4d1f-aab7-697b24d620bc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c009f19e85e158443b7a9a0c0506a342",
      "created": 1679923819398,
      "modified": 1679923819398,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tWmRIQ542ErVqEtOMyWE8dWEVM63PBB68AwlOwNiDG0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6e2e13c2-9b7a-40fd-8fe9-568efbe7778b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-26cb7256755a95578d39eba8abcb86d1",
      "created": 1679929552655,
      "modified": 1679929552655,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "d0EwFOKTbleUed7+5mHZZxNFM6GJMrVrgXNc2rbN4PeCzrNj90l6I4PR15ZKZKjy",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "718ff78a-ba9a-4a15-8e0a-f8c6147da86b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-81914a609311a79853ad1123bbe6f458",
      "created": 1679920302096,
      "modified": 1679920302096,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "vNMp/SgD1tWpIdNgcpgeLIlTDnGL0IiNuxezvJqQtNbBdoEZe0oXqHD7kWSzrhZb",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "72c94d08-177b-4c04-a9c0-89a3d413df21",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2b33fab2ca5c45139996ec0b71b5f6de",
      "created": 1679927906236,
      "modified": 1679927906236,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "nPUXK3c/R9UK2EPgCy345CVlqeTq4WnFoTgSQq1iaNJiLk06JAbH+1qHEgjBvgMT",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "73b3f1fb-9f92-407e-be4c-27e248ad9ef3",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b91552fb8927460cf363682db9ea7bec",
      "created": 1679924645128,
      "modified": 1679924645128,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "x95fMLjWmq6xaJX2l3tI0cBeHmY8imJa/NustnFZAvRB5U5SDQZlZwBrgSJEZ6WE",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "746ec0c1-8941-489d-b5de-ed6cf6858659",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-00fcf263c5fdc7e8f5d639f6d8e940b5",
      "created": 1679926796940,
      "modified": 1679926796940,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "8f3f8f2a@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "K+6ZMOzV9U8UfnkfYXUTHOq/FG8uVdUHyiq33ht16bY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7660711a-4a65-4515-a7e1-08780d6c1a64",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6b02a40b0ffa8456c289c504a5c2b219",
      "created": 1679928215926,
      "modified": 1679928215926,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "7fQ6wPWcEGw8e/ZNY/ktw5h/MUtnpU41kAh+NUYvQOOO5NocS0NlFnnP/SE3Cmuw",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "773ce6ed-b10c-4e23-9c81-cd1945b75637",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-73897c36d6677c34ba8176be13404fc3",
      "created": 1679924392460,
      "modified": 1679924392460,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "2OVy2ULifr2a6cVo/ZjcTP1UocVASB3XM1kFg5bgbjW0OvOKPDA1gWSfjVPdKYEr",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "77a39266-c1a4-4bf9-a003-8bb08e88dd54",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2aff875cab590d545473df809e187069",
      "created": 1679926230706,
      "modified": 1679926230706,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1jRTRdEXKcUJmUWF3MbRMDuJmZf2RMIL5BVTTkk3mghFg2Kuzg/oyV3IxOAtDdC1",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "78c08b10-405a-41e5-ba2f-3e14bfea33ee",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d22d3eaa169ec9c4feba8e392f295563",
      "created": 1679920668554,
      "modified": 1679920668554,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "67862dca@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "r6Q4ZjeLl6bSxfvlFrkV3pybIxOxRp+odTvecukUkz0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7902fbf6-0249-46f0-93da-746972ec1785",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-23b430b5738a5ef2fb045d97d19f1678",
      "created": 1679927930297,
      "modified": 1679927930297,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DNrbSjgWraNidVFu55ApZgiITPgCiuACMD/3O0T5IcY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7951c859-ed7f-48fb-8200-d9b7a1a5413b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-423a132eeb00464d764f2b007425a986",
      "created": 1679920653680,
      "modified": 1679920653680,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "VRPk9P+/HBQxNSteke1hKEQX0j/JC4gaiDusj8CsdN8zRxZJ0QHogi2UDULa5RY/",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "7be9d261-9af7-4c3a-989e-ce7ace579164",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fa3521cb82f1c6b138f3a627787aee32",
      "created": 1679929426949,
      "modified": 1679929426949,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "djXg30lm1/VfQ5rhFg/MYdudmQ4bHqaiHDhxCUKSTsg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-1390055ca2c2abe94e4f0db000b21f3a",
      "created": 1679926482720,
      "modified": 1679926482720,
      "author": "98b2638c-8050-45f9-b01a-34fea17d5ab7",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "mra0rqcq9-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a735e09950582c8f7271a92027db36d3f532ed07a3e0f69050e044afe863c1aebe541fb9f2e90b762f39da1d0bca86ca163ea5a184c4f42890860cf012044ff1ce2f9604452688f592a699823a79e3c19e7895de3b69eb6b7f1686006b460210c5e576d9413a77a4239074b3fb7c00fd8874040e2cc17507d84fd1e9bac85f41db011db759e07400917d6d1b1eb1b1d897d83b4a026ab43f47ff74d752944ac04faef7eb4e16643450beb6cf2296c358dd71123b22657c17e665f0ad824d7b581404e50ce92495f1d7e8921208739a0852f2a96f95bf282b03119d859d4534091ceb375b68bb474e650cc345f58622ea5994889926c8338fe9710c892fd321cf0203010001",
        "hcPartyKeys": {
          "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": [
            "8673106a9c4c940724cd32ed01fa6d1f6380279969d16f51f58b22c8e3cecd81133f445555371a788d5543c9ba88b314925617289477ef52a736595304f80083df2ddb40c9dd2bbd6775d20bac61a445280dac693fcdba6f39feea67e17153863d768cee5a0c96d7b8583c4e53c79af5e0f3512236334c97638daadb601c90f09c90134dd6188ae8d4031241731302d0f4c0bc854c9ba0ef4d82b07050cb0b3e5244f363796d669b7056030ba5b911c1922b61ce27d43b616c7d0532717c5dea8a0a1089ced764ebd7b8bf257532334aa850e76bf76969cbd81f5f43b0034cf1d893a445b9d6f754f6d7297549046066f459d59bfafee01b57c0c94f5401f5ee",
            "8673106a9c4c940724cd32ed01fa6d1f6380279969d16f51f58b22c8e3cecd81133f445555371a788d5543c9ba88b314925617289477ef52a736595304f80083df2ddb40c9dd2bbd6775d20bac61a445280dac693fcdba6f39feea67e17153863d768cee5a0c96d7b8583c4e53c79af5e0f3512236334c97638daadb601c90f09c90134dd6188ae8d4031241731302d0f4c0bc854c9ba0ef4d82b07050cb0b3e5244f363796d669b7056030ba5b911c1922b61ce27d43b616c7d0532717c5dea8a0a1089ced764ebd7b8bf257532334aa850e76bf76969cbd81f5f43b0034cf1d893a445b9d6f754f6d7297549046066f459d59bfafee01b57c0c94f5401f5ee"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "63f45c8b37c2e9b8fea913ef4ac38b7ed109cc16d1286650e776e427ab147aa41fc6b0d29077250b0f3d44b1235059478f79a9f7d9916ca110d89013a58294d1b50a9b0615de1c506a87e715b5967dffd6a868564c5c08816f44dbbccb90cbd59e0721bfda2bd4c09fe5e5e475a3c9a916f847a8465b5970820da6c674ffbde61548a31382251f4648d410aa765d56ade962aa0b343a000e47256b31391c3ea4a4db2134dba1d1ab9a19811949cf8b636424036c5b8d25918e3aa166f603346c183af788f34d4fc5c08916e2a8e9184bd884a173d63b21737f5d51e5b92524f356a857c0bd2718eb2e753d253dd73e24b6bf26509442b38624245e66888d606c",
            "dcfe9e6c123d51bf2404714f3b0df6c5eb5fdd8d36598609100875e0b8a9283e443e589d897b47fb3bbe7aee3c882f500ca4144ab772f1fb193c5de799d981c9a52285e472accaf74a503c63327f42bf0e57de3e3489e7d71aefd87cb90043450d9377dcc8d5a55e93aab49faf6a5f50d1811e9f25a8486eaacb6a8ae580bd0a60422d9b77d06d01b1b9ce52f6d9a7b16f45a6236c1ce9c560aa341f88b477694625bcafe47e38a49e5a3e3a7ef722799ffbf9278bf8c5b9a76c8446174cb6fedf459c18bc76b599b9b798d5058a6beee1fe708575e56e676ddd60019da11662709df85396f67bf7bcfd7e67205f3cd1987fd8bb528da6c91e8d117be40a1cda"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a735e09950582c8f7271a92027db36d3f532ed07a3e0f69050e044afe863c1aebe541fb9f2e90b762f39da1d0bca86ca163ea5a184c4f42890860cf012044ff1ce2f9604452688f592a699823a79e3c19e7895de3b69eb6b7f1686006b460210c5e576d9413a77a4239074b3fb7c00fd8874040e2cc17507d84fd1e9bac85f41db011db759e07400917d6d1b1eb1b1d897d83b4a026ab43f47ff74d752944ac04faef7eb4e16643450beb6cf2296c358dd71123b22657c17e665f0ad824d7b581404e50ce92495f1d7e8921208739a0852f2a96f95bf282b03119d859d4534091ceb375b68bb474e650cc345f58622ea5994889926c8338fe9710c892fd321cf0203010001": {
            "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {
              "c8338fe9710c892fd321cf0203010001": "8673106a9c4c940724cd32ed01fa6d1f6380279969d16f51f58b22c8e3cecd81133f445555371a788d5543c9ba88b314925617289477ef52a736595304f80083df2ddb40c9dd2bbd6775d20bac61a445280dac693fcdba6f39feea67e17153863d768cee5a0c96d7b8583c4e53c79af5e0f3512236334c97638daadb601c90f09c90134dd6188ae8d4031241731302d0f4c0bc854c9ba0ef4d82b07050cb0b3e5244f363796d669b7056030ba5b911c1922b61ce27d43b616c7d0532717c5dea8a0a1089ced764ebd7b8bf257532334aa850e76bf76969cbd81f5f43b0034cf1d893a445b9d6f754f6d7297549046066f459d59bfafee01b57c0c94f5401f5ee"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "c8338fe9710c892fd321cf0203010001": "63f45c8b37c2e9b8fea913ef4ac38b7ed109cc16d1286650e776e427ab147aa41fc6b0d29077250b0f3d44b1235059478f79a9f7d9916ca110d89013a58294d1b50a9b0615de1c506a87e715b5967dffd6a868564c5c08816f44dbbccb90cbd59e0721bfda2bd4c09fe5e5e475a3c9a916f847a8465b5970820da6c674ffbde61548a31382251f4648d410aa765d56ade962aa0b343a000e47256b31391c3ea4a4db2134dba1d1ab9a19811949cf8b636424036c5b8d25918e3aa166f603346c183af788f34d4fc5c08916e2a8e9184bd884a173d63b21737f5d51e5b92524f356a857c0bd2718eb2e753d253dd73e24b6bf26509442b38624245e66888d606c",
              "223f55731820b91ccd18010203010001": "dcfe9e6c123d51bf2404714f3b0df6c5eb5fdd8d36598609100875e0b8a9283e443e589d897b47fb3bbe7aee3c882f500ca4144ab772f1fb193c5de799d981c9a52285e472accaf74a503c63327f42bf0e57de3e3489e7d71aefd87cb90043450d9377dcc8d5a55e93aab49faf6a5f50d1811e9f25a8486eaacb6a8ae580bd0a60422d9b77d06d01b1b9ce52f6d9a7b16f45a6236c1ce9c560aa341f88b477694625bcafe47e38a49e5a3e3a7ef722799ffbf9278bf8c5b9a76c8446174cb6fedf459c18bc76b599b9b798d5058a6beee1fe708575e56e676ddd60019da11662709df85396f67bf7bcfd7e67205f3cd1987fd8bb528da6c91e8d117be40a1cda",
              "b0daf22e60dd51354ba6d50203010001": "0deac07c439182a02b906519e4ed599b8b566d025aa4f97e3f8c5518edf4aa2fdbe4e1ef91237e882975040fab065672e3c3d69ee344952ba22acc137776fe8ae64aa97fe1c37df79b4ff20de3750c076b1ef6658edd735c2b370ecc97be5e00d2848f6b41a67a38623a0375a10dc427b67c08634900e4b02c1e3395a05b2479fb9e2965ef8e7f5c21aaadbc8746c71d111a9f0356c9f94cb36122f3bc4ca6e9451e942b6ee4eb961d06b67d6aed97b707cb128ad67decfe9e9b5eb9698dde68424477da2960650327973132735748c78072cc5a55ce77f2a72fc4f63435cb8f83d3c94d9990a272ad44269806e1b47c35d164069c59e1a1508d3bf0321cf594"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cf5629d52249b02ea52dad14fb4ba7c22e08a192235ca5c4cc974f190a7a742e203f9dcbd2af1bb7c86def838bce88d452440f1dd6b1b2de940cbd5276515814a4cabf61180466d279e86f03af35dd208a17246f3ddb57c9bc7c6f91044e8d6d072e7ee69547f10e557f9ca411106a875b6a878fe087438520c6da6bf31a0f54ffef4f26e21c0b9e09d6dfec5eb33e4a5c04db0467695022bc43157d88de116cc100639d92090bbe6bd20c1e7a06e03629e48044ae713bdf3c9b0d4294449a982be7bf43d29216eed3ab854628e819c22d1a65d46323378bed9c0747bbd1c8d969735d299bf734d5ef95146b9412f78f67526e23c8b0daf22e60dd51354ba6d50203010001": {
            "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {
              "b0daf22e60dd51354ba6d50203010001": "a0b4da74a2ccf573e12c8b5a1b13ae35ec9f22241734882bc1c89d385577261baaa1332b7903181c08ab27878202ce0cebf7ab33d240d48f3e53ebcc64668a3653583575bcdc37bd004a686658975d24d2928af8af01ea0d20bcf1f3108336c1cea694196262e4d9adac255a8cb7ed88997d31f0d73b50b7d8d3456ede6d66f41e3dca6a005d75707d7a16829cd28d6869b3a0a81acfc3135db2ace6b49a17b2785e9afa09663babbc7006a95c1c9c80ef36150c673f0233b2cf6590afb818e0de4eb31879062a1524b10f4db582c92f9d73fe42bf4af0fb0e0ab743f72af93dbd0fd87c11d8101fea603cde6887db1587c509141385a8cdafac910e81f623b9",
              "c8338fe9710c892fd321cf0203010001": "3bdf08dc0ce656044e63b87acc615c39adada65cd65a8123b1211df4bc1cf9114c1af7397cfc237993b715890b509596179ac8a513b4ab0f80457c6b519b83573b1a2fb5509ab8f672ba87ec03cb5904e8d4429ba426d0616295c05a62dbb45b7ebcf26e05f3e5155ceae0a1598c145e38b42ddfae9084ffb475e5937678b96f15a01ba22629d910e283c7e20f34332b35c39afed28f237d3be59079fb467347c97ce69e2dd1a0746c95608983140ea87b1313cc07c06bd6975d494a91b0c82aa6e52b52f13daf9f29f3c17940bc14f309bb40a8541089422725a6c706c10a5f8aab1445db8698527fe3a08496f8432e4ec90189bd38ec1acc08df2d014383bf"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "b0daf22e60dd51354ba6d50203010001": "807da14873e81eb2d66697c0563ad22d98085b4890c7d5291b88cc3587c3e62f876c6786eea47ff974069d4aad0fe5e6c0b3dd399f6e0e7beb62592b75be9c2812c84963d146675c49a442abd7c60bdd3a470bd1b4db480640edfb4a70effb49d47284f8371af257ab6b038eddf9afeaa0780cc097dbb0831b71e26aca01ddd7ef718fb7be0c0b6123b2f3a43781b81d84eeb454ad80d825767b39e282f5b36299c081418920997141136063c80a87519dd5cf8372b06250df79cb55f2b9ea00f12242a318a4e77029ffa52aa2f5a3faf5ba3a4f071872cdb4ab44c09608fc27e975ba09b0a3ea9d23d493d9edfd98a58b7ad8efc665381612e221e8489055af",
              "223f55731820b91ccd18010203010001": "0a19985ce9ef4e126c568aecff740b180e3dc4eaf728273f5354db6510e91910ed89f2943c3bb24290f39708c6874b8604fcb1c7de228997e5611597841f5b802af49d7a11cffc917ee8825f99fc24ffca42bce488993ca67d46d725c415c50920d18e9cdc2bd3430223810a7660465572c0ef8d00507c308bc123bab772581b0a9bf3513ad0370a003bbc6aaca8f72ab2ff31e37ce244b2d2553e929f23161fd0943b565c2763a8281606cfc1b22e59bd9ae258b04a0bc40ae5b9d305ad163428fbe5b44d9551b904642359335122c6612074afe62efff9b15c8fda9f3940439a3752eda5e906041a10330b03297206def07ea4ba53c01f3aaa8267f3caf37c"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a735e09950582c8f7271a92027db36d3f532ed07a3e0f69050e044afe863c1aebe541fb9f2e90b762f39da1d0bca86ca163ea5a184c4f42890860cf012044ff1ce2f9604452688f592a699823a79e3c19e7895de3b69eb6b7f1686006b460210c5e576d9413a77a4239074b3fb7c00fd8874040e2cc17507d84fd1e9bac85f41db011db759e07400917d6d1b1eb1b1d897d83b4a026ab43f47ff74d752944ac04faef7eb4e16643450beb6cf2296c358dd71123b22657c17e665f0ad824d7b581404e50ce92495f1d7e8921208739a0852f2a96f95bf282b03119d859d4534091ceb375b68bb474e650cc345f58622ea5994889926c8338fe9710c892fd321cf0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cf5629d52249b02ea52dad14fb4ba7c22e08a192235ca5c4cc974f190a7a742e203f9dcbd2af1bb7c86def838bce88d452440f1dd6b1b2de940cbd5276515814a4cabf61180466d279e86f03af35dd208a17246f3ddb57c9bc7c6f91044e8d6d072e7ee69547f10e557f9ca411106a875b6a878fe087438520c6da6bf31a0f54ffef4f26e21c0b9e09d6dfec5eb33e4a5c04db0467695022bc43157d88de116cc100639d92090bbe6bd20c1e7a06e03629e48044ae713bdf3c9b0d4294449a982be7bf43d29216eed3ab854628e819c22d1a65d46323378bed9c0747bbd1c8d969735d299bf734d5ef95146b9412f78f67526e23c8b0daf22e60dd51354ba6d50203010001": "d0cfa1a65b6ff4b367fcec53f3a583f5d6d8edee7c900a2ac9d8ad4e965d94c0f101f7241eb5f2f1fa1ab418ebf04b87bee39b3e28943aa1653163735683a01728d909316535fa2a61eb118016622e0f0fed4c41f9d0510829d1fbc5a300f6db439b219c037d5e8e3d42062ef27ad921d49a25337363849c432df15493cbb53b73a2eb6ae6579fdbcd18b6d6b00db950b78d96626ae4bc8cff2a42a79b011286eff9aabbb0bc551494901cae3392e9faf2b71744c8ea7c63c095165476cb17305e70d3003b042704ed3a65135c7a58032667d99547d0079a6aac201ff902201b594162fe1f784f1a8c869b34a48429ac98e2a4321f4015fa54b92096399ce93ec5585792fec79e1fe13dfd593899c0bb6a03dce2236d4ca99e874464abe530de0531e887d9da224deed1da8727ef2bab2372419002f0df20824cf05ab2c96b3636371ad3a6fa1c0e99d1af74770ac2df85f3c43ac0af41d9027b04fe469950f3bb6e0ec4f064aaa2090b59efd47030e1d6450424b8cc9ac59ee96c87ebf6840fd0a225b2ab1c1772db3e095d6c038d902478fb70a5e11d8d93a62e0f4cdd6b1ceab296814786ac5127fc2fdc145630177e3d7aedf251392b387c431ec27109d5eaa927c6d47d95d1f6d301ce22639cb158950c511080f1eb0681174c6abe6d7f6c0c86057dd8ad15c37e460f15f26ed1de87d93758f68be5c000a7c7ed6f66b2867b72834350ea42d22a48e5ae991a19f9667b2056dfe7c6c45150d103725fd9a07c784076026aa8b6913fac49d132cac5f27982f9b91fb590f9bbd5c9c8224762696350c5953d17fb981f1ba0b73f998092236e5e167f5aeb92014a28d7857605e83905b927d2971aff68cc206a1a3ee27aeba58f68d204e29986b817730efa027d58c4cf7c77ee85808ada8913f33a2f6aaa07b3c0c850b053b37e9e1a43858e78073bff74e77ef89958fc9f770e7496e62b361024e818020bfc6165609db33917a351b8f15b191057fe127989939518faa6c58593fac6937dae6aadd53938e57d18affa3973acde67c317435b8819809f66f2284412a1cf121adb4ad449840e886233ebc74a425cc651668b3b4d56c3fe8dbbf0d11ce34c763502306c22dd6b836c155c940b97fbf16e5a25f460678c5214c0b257e0690ad5c42e92117e2353121afc181744584d0d3eafad02afab6f429c9b6c097201eb4d6f0324d0adc566965a090bb6bce703567f414e575e922a432bad08db62f8e47950d92015c79a32a7287da7c4773995752fc73914cfc156421cbdf2cecbbe3f2381ee9488bf55bfdedec9f4d90c5b2a6b7719e1a10cb4bbda993386f38198919568c8ff768eda1328671113e292699aeea1ad1fbf66cce27ddd9d7821a98b799139f575d1d4c7f87996c82b7a69784a8c9b5233509e7375c93690a7e8b763786db331abd76cc0fc94dd9d6d987bfdbd37650dc87870122a1fb97b66c4261a1fa553ded7dcab69654ef441a2e5b15e8845f1e506c1260a5176e3ade5267b8ecec9c58c528d53905bdee5e977a4082da9222c2a150414706f4d73a468425e4d21c4c676b5de687f00ccdc591da7e3a46839ad5376c30b5ed9b9e32d5c78313b4092ed8eb656d41fb9656ef2a27c10e23151938499c432618ee663a21fa43f7d8bb3c39daf9d5d87c65d07e5d0f64486f069ac9b20f3a38a431ec69721cd0706828014362e8d31ef3faf767f92cf180eb1a6128f3cd134dd073835cb486d0967f5587bdb71a8fda3"
          }
        },
        "encryptedSelf": "WsfLvvdk+6Qtrl2dDWq3evuNNZ0ienx65TvYxaSWOGM=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "7d3fb98a-6452-4c7f-8ae8-31d8cac6fcb8": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8097f34c-fe44-47cc-ac4b-99ab541faafd",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-e2c7ef1670f41411695a80334305aea3",
      "created": 1679924415232,
      "modified": 1679924415232,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RI+CdsOkmJR5KttmjdKWpXYVj1P9pg5eOn5C/94x2/bIrh6XFx+4vElz/S7ZT6sT",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "8133371b-41f3-4f16-b567-36e0a82df720",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cb5273d31107e411bb81b1eb2a2deaf2",
      "created": 1679926265560,
      "modified": 1679926265560,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "gzQYnYmJgfOErFz5c+52XwP57UdQJYwkVD/ZKIYYIlI=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "833da281-4969-4f97-b0fd-646791006105",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fcf4dfb83c5af82eb6fd235d5a14c8cb",
      "created": 1679929596429,
      "modified": 1679929596429,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iqx5ZTJwJmNtOiYXt1z3gPvgdxffmfCGG+YT3IcZky8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "83cf5973-87df-4eee-b8b3-b94e9fc64db4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-e1a855bcc4a112685582ecbfd422e563",
      "created": 1679927872887,
      "modified": 1679927872888,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "4a2cecae@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a5a4d949d8fc5cb0dcde076a80daced91620399e7b2a2cc0ed25c6bf58f4c93be3c717c2df4e61f17999902bbabfaff0e7ddd306d28f8039028e4027969872b5d1c1684ac52d8f713ea53a2bf0dd82dcf6737961bf13cdfdb0f80fa6e0626c37984fdf8edf41d0d01ab1c8c286d8309797c9c815218fc1bb4f200b7c1f0017326d4941d51351dbe371a526d5c0be0ee5277f463a1f86b25045f26cbf47612f2f2e09c6752bc628cf7564ab1faa2e2d8e3f17ef18292af0f9d1aa31838b54a18759e68c3274399eba82cfa9a9bb72049fd6ca22a7b699c406d035581c9cca6da673fc476691490378889e68eba21f8335152fdd49a382ac14e5c394a172f888930203010001",
        "hcPartyKeys": {
          "83cf5973-87df-4eee-b8b3-b94e9fc64db4": [
            "56b0b18513bb119af8097fca3df35211b6f39c820e4800acbaafd9727f3ba71509aaf5efe2a9b6dbbeeb9a7d218c0e97051ec217b7988a1c8c13dd27c59d56b43d5585845531505dc951422a5b007e4c917909008397ab31e59933347e7d3e24bc07a96eb313144bf0e142c6236cd382a9d7892dad007c1e1b814c667a13604d54bf0f465f6731d21b1b58e2cdd45cacccc574d37babb524cd48041b06737048bc19559c6eda997ed764231ef3df9caee42101504106aedfd1dab91fda291bbce75516be3bed745a38e234a1aacf91a44a184f5fb41203b0d6332676bd2310af713bdaf9304731e3ea5f35d08dfc8c84ecf4e01554ac9516f1400263eace981e",
            "56b0b18513bb119af8097fca3df35211b6f39c820e4800acbaafd9727f3ba71509aaf5efe2a9b6dbbeeb9a7d218c0e97051ec217b7988a1c8c13dd27c59d56b43d5585845531505dc951422a5b007e4c917909008397ab31e59933347e7d3e24bc07a96eb313144bf0e142c6236cd382a9d7892dad007c1e1b814c667a13604d54bf0f465f6731d21b1b58e2cdd45cacccc574d37babb524cd48041b06737048bc19559c6eda997ed764231ef3df9caee42101504106aedfd1dab91fda291bbce75516be3bed745a38e234a1aacf91a44a184f5fb41203b0d6332676bd2310af713bdaf9304731e3ea5f35d08dfc8c84ecf4e01554ac9516f1400263eace981e"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "5b952ef9d4433b77ad6b287dce495df4b39e860bbac0fbc21474a342b75c6812d0d90451e5eaca96fff027763a6ff64ec9a09fae1edf706592bced469c67fe34ccae65510ea70aaa3781c91bd45636bb54f737392ec62feb659f2ae0b07960d29d9158f2f52d23aa3a8cb59a92b1058247c1903c3a81c1707aa435785a19d5763f13b78e17434a387b22578a3a0b0fdcee6565769de7f9201c424d8909bc07e35260143d5c3f8b57ea229fca8f4194fd1f6e7e212d15299223b603353615ae1a147fa2c16559a8ee1a2a308af73748d93e7ef297dcfe774d5b9401c4527fbabcfbeefbbeb9405dbba877604f2cad129ae4c10ff0ef5379d720e195fdf42de0e5",
            "dad6679b66cb87e061a5f168c37c726909734098ea31058f7a19b57b11a8b560671a8cf218d26a894f0274205d4294162e5977588d6eb1f48f3d8c64fe2ba85d908ce0e28e631c24ab4f32356ab909a7f00f85c61ac5669fc55bfaa101b7b14ce4391cfa983d18cc7065f16adfc6861df9792b321ee8bd60298109e1ced0af8efd5673baf10b6aa9be6acf5e90bfb1da1f9f2d7d1a2b325da4e618cc0c9150f923a1ce289365688f43f711f27336b7cd0de3786768dceab1b8ab6cb7a891f9696a39dc4397643c8d48ccce6ed29d4c7bedad3d3f0853b68d9becf5ddda70941f7c9e96b39f2a9c786787806f4e22ca3ba6904c3f1d8b90636731b3005b0f9cf5"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a5a4d949d8fc5cb0dcde076a80daced91620399e7b2a2cc0ed25c6bf58f4c93be3c717c2df4e61f17999902bbabfaff0e7ddd306d28f8039028e4027969872b5d1c1684ac52d8f713ea53a2bf0dd82dcf6737961bf13cdfdb0f80fa6e0626c37984fdf8edf41d0d01ab1c8c286d8309797c9c815218fc1bb4f200b7c1f0017326d4941d51351dbe371a526d5c0be0ee5277f463a1f86b25045f26cbf47612f2f2e09c6752bc628cf7564ab1faa2e2d8e3f17ef18292af0f9d1aa31838b54a18759e68c3274399eba82cfa9a9bb72049fd6ca22a7b699c406d035581c9cca6da673fc476691490378889e68eba21f8335152fdd49a382ac14e5c394a172f888930203010001": {
            "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {
              "82ac14e5c394a172f888930203010001": "56b0b18513bb119af8097fca3df35211b6f39c820e4800acbaafd9727f3ba71509aaf5efe2a9b6dbbeeb9a7d218c0e97051ec217b7988a1c8c13dd27c59d56b43d5585845531505dc951422a5b007e4c917909008397ab31e59933347e7d3e24bc07a96eb313144bf0e142c6236cd382a9d7892dad007c1e1b814c667a13604d54bf0f465f6731d21b1b58e2cdd45cacccc574d37babb524cd48041b06737048bc19559c6eda997ed764231ef3df9caee42101504106aedfd1dab91fda291bbce75516be3bed745a38e234a1aacf91a44a184f5fb41203b0d6332676bd2310af713bdaf9304731e3ea5f35d08dfc8c84ecf4e01554ac9516f1400263eace981e"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "82ac14e5c394a172f888930203010001": "5b952ef9d4433b77ad6b287dce495df4b39e860bbac0fbc21474a342b75c6812d0d90451e5eaca96fff027763a6ff64ec9a09fae1edf706592bced469c67fe34ccae65510ea70aaa3781c91bd45636bb54f737392ec62feb659f2ae0b07960d29d9158f2f52d23aa3a8cb59a92b1058247c1903c3a81c1707aa435785a19d5763f13b78e17434a387b22578a3a0b0fdcee6565769de7f9201c424d8909bc07e35260143d5c3f8b57ea229fca8f4194fd1f6e7e212d15299223b603353615ae1a147fa2c16559a8ee1a2a308af73748d93e7ef297dcfe774d5b9401c4527fbabcfbeefbbeb9405dbba877604f2cad129ae4c10ff0ef5379d720e195fdf42de0e5",
              "223f55731820b91ccd18010203010001": "dad6679b66cb87e061a5f168c37c726909734098ea31058f7a19b57b11a8b560671a8cf218d26a894f0274205d4294162e5977588d6eb1f48f3d8c64fe2ba85d908ce0e28e631c24ab4f32356ab909a7f00f85c61ac5669fc55bfaa101b7b14ce4391cfa983d18cc7065f16adfc6861df9792b321ee8bd60298109e1ced0af8efd5673baf10b6aa9be6acf5e90bfb1da1f9f2d7d1a2b325da4e618cc0c9150f923a1ce289365688f43f711f27336b7cd0de3786768dceab1b8ab6cb7a891f9696a39dc4397643c8d48ccce6ed29d4c7bedad3d3f0853b68d9becf5ddda70941f7c9e96b39f2a9c786787806f4e22ca3ba6904c3f1d8b90636731b3005b0f9cf5"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "Oqf4I6UXc4a+lsgrJcJPgZXiipcJwQIx1f5mRetkqf0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "83cf5973-87df-4eee-b8b3-b94e9fc64db4": {}
        }
      }
    },
    {
      "id": "85534cf6-b5a5-476c-9dcd-941a0ce67463",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-43af410178dd8b9ffe877606eea9764f",
      "created": 1679920657299,
      "modified": 1679920657299,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "/DgJkKRVL7DvIj3XCdp43KZw+W29W84cFxHwJjVMLOF2czeTXctkyeMPQQEqag/o",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "893f6ecf-1bd5-4a1f-b4bf-378bde652f92",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-5dd92ad4c9622216a251f344a8be3600",
      "created": 1679929429326,
      "modified": 1679929429326,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iTgi7ok00HiXO+BLxB7XX1YTywtIfkTGlXmtJKbXoOIqQITVXhtMbAbWxGVl+lJ8",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "8c31cd4e-9ed7-4d96-a62f-f571480a4702",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-3197e5c107813cdb3c3ca333835e1746",
      "created": 1679929559628,
      "modified": 1679929559628,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "CcsT1awmH2nfoZSWTFSHKVPrXUc2bYH83kwVXc6+AlYhSYsBsArRRPuADozjY24O",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8cad5593-2d03-4270-918d-3186f41fb9d1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-185a2040ac51f60e65307ca87f88b06f",
      "created": 1679920203703,
      "modified": 1679920203703,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RYxZmQ3sgNpMl5qEtbY1d/UhfoC4ZCofj6535uWmEQQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8d4d83e0-c2e9-4029-aa37-2275bbb21f33",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c38211fe7cbfb6807fe133f7553b697d",
      "created": 1679926690083,
      "modified": 1679926690083,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "2573e52e@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ys2JGPU3s5r1cu742rkG1wq6x0CY+d4+aLX3Avnlrsg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8d6619d6-5ed6-4ad2-8b4f-904a494a2ae6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c0815636ecae5058c0fb40b1e1c836a4",
      "created": 1679924403257,
      "modified": 1679924403257,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+81yfzzdxz@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Ss0DTyGaqoFCko61HC21dq9KFlNbP4xO28OwODURzKw=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8d8c35e6-2f39-498a-92a0-992652ec12a6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-df091e492448a66ea2215d4ccd8944ef",
      "created": 1679929368245,
      "modified": 1679929368245,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "k26SA9h6mVVohQSC46xsUDAEENRHW1NVgwQO2s0yhTubYMQVNool0sTXSxwySWE/",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "8e48ac95-0151-4b45-88f0-fa1ba7530944",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-8f168aa9ab7da87f8c7187aa169a9dfb",
      "created": 1679920153617,
      "modified": 1679920153617,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "00acc25f@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1b8286e101710a796de3ed4c02defade5ca7a893cffbaa4cf3c89de2f9437ba273692094affd12db7e007d626cef4daf3bb9f4203b276ffdac02b97b2f5a0b02c5db708e0ce8467c797ce50105962478b6d592dc285cbae019daca4a0e2b485938a920d08186b369a37a0adad1ff7bd055f2acf35ba3a3bc1e5586b85cfdcc7715660b28d2ff8d4ce3c6b2b344f0951b233c2faca3aa09050f62555a4ad3488f7a5ec536e7f1059cf6e31b208ccf0f2aac0ad6e269a3cb6b0930fdf84fef248c72553855c0207e00d5053f5b9653fa000aa258a2281b8d9697f27669df0960d5ae1a88d0150eecbf99db820303adf708eaad0f5b78bce95c5d275fc6a7b70430203010001",
        "hcPartyKeys": {
          "8e48ac95-0151-4b45-88f0-fa1ba7530944": [
            "73caf11d78addc176f021eb804231741a46b6fd25b712ded275cc643777904e070316e7d1efa6e167deca12575c7bc33c389c6da69c6c7d936e687b05f0081ecb6447d726c80064086df456ab9387c5d04f2cf4ea0d14e1b99e48848d89f40d90fbed8cef6445ac617291a2b4a4583545e2bafa186d902cb5f9091f8ef227b4f43d125461b21e1f3d63b7c2b33a7cdb43e5dd05b66581cc0cf0eca769a68de149f6919f658ed87fef3f5677202907375abd36e82fe62252b4d05a83f8921d50d26ea2924bd22620f7c3e32652625ec00d237c33a3149ad1db5406a19031e2f93e4da6616ae670ec7030db638f071b72338c4c1b33ad21073e89567ba3aa3f8e2",
            "73caf11d78addc176f021eb804231741a46b6fd25b712ded275cc643777904e070316e7d1efa6e167deca12575c7bc33c389c6da69c6c7d936e687b05f0081ecb6447d726c80064086df456ab9387c5d04f2cf4ea0d14e1b99e48848d89f40d90fbed8cef6445ac617291a2b4a4583545e2bafa186d902cb5f9091f8ef227b4f43d125461b21e1f3d63b7c2b33a7cdb43e5dd05b66581cc0cf0eca769a68de149f6919f658ed87fef3f5677202907375abd36e82fe62252b4d05a83f8921d50d26ea2924bd22620f7c3e32652625ec00d237c33a3149ad1db5406a19031e2f93e4da6616ae670ec7030db638f071b72338c4c1b33ad21073e89567ba3aa3f8e2"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "b32f839ae55f261a91a0e6415aabb6ddc8c56c587fa6d33a6f9214b6b4a5605f8265e9e8564a77b6676d8ed442578bd730e124479c4ef89dfb609d8d5c1c215b4c5740a149d1af6180fa9e20d14da537e76429304ca820faa3dfcec079a66d54991d308693507a6654d59b004d4cbbd817fb4425e81dec41a8d58d65a86829aa1baf915e6bcd9d449c4ef86a63a3a0e0e0a90a6322770c892eb52769ad40e5cac0d49c9fb46c2775dfe947e05f6e651e4193284c064c829b70902eec69a746b1ac84ca67bdf7f7632c2eaf83b5a938645661c43a8d24542e242daf55a13ba9fee3506a8c500ea6653acd74ef51925df7be44f63faf7872449f792036211c9949",
            "35eed81e1a3ab1b06bf0640536e3359dd0e28069144919d571943e60ba754abf87daf6d8994192e67060cbab8013a9d8de06601b34ee59da4f2a6823fe6182fc3d79631693c1e34c3fdd494673851e2b3dab7cc8ea19572f0abc80746b7abd6402b72a35a87fa94a78cd0ab6027d57870cec2b21e8e90e19a1fa7bf85e3fa450369d01010845f753566001b53ef093536bcc088178df5d033c422d6ff79358e45a18c2d1f7da314c7a89419653d3324feaf2a88e3183a8c238448a13fe9782fd9ca73d7b6eba681fdb28cf63ce415cfd9772a067131832e6b914e830a016cfed8c2c948468405b211ee7a8c499614bd1adc06f6b400a2c76abb81eeb6a0a4565"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1b8286e101710a796de3ed4c02defade5ca7a893cffbaa4cf3c89de2f9437ba273692094affd12db7e007d626cef4daf3bb9f4203b276ffdac02b97b2f5a0b02c5db708e0ce8467c797ce50105962478b6d592dc285cbae019daca4a0e2b485938a920d08186b369a37a0adad1ff7bd055f2acf35ba3a3bc1e5586b85cfdcc7715660b28d2ff8d4ce3c6b2b344f0951b233c2faca3aa09050f62555a4ad3488f7a5ec536e7f1059cf6e31b208ccf0f2aac0ad6e269a3cb6b0930fdf84fef248c72553855c0207e00d5053f5b9653fa000aa258a2281b8d9697f27669df0960d5ae1a88d0150eecbf99db820303adf708eaad0f5b78bce95c5d275fc6a7b70430203010001": {
            "8e48ac95-0151-4b45-88f0-fa1ba7530944": {
              "8bce95c5d275fc6a7b70430203010001": "73caf11d78addc176f021eb804231741a46b6fd25b712ded275cc643777904e070316e7d1efa6e167deca12575c7bc33c389c6da69c6c7d936e687b05f0081ecb6447d726c80064086df456ab9387c5d04f2cf4ea0d14e1b99e48848d89f40d90fbed8cef6445ac617291a2b4a4583545e2bafa186d902cb5f9091f8ef227b4f43d125461b21e1f3d63b7c2b33a7cdb43e5dd05b66581cc0cf0eca769a68de149f6919f658ed87fef3f5677202907375abd36e82fe62252b4d05a83f8921d50d26ea2924bd22620f7c3e32652625ec00d237c33a3149ad1db5406a19031e2f93e4da6616ae670ec7030db638f071b72338c4c1b33ad21073e89567ba3aa3f8e2"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "8bce95c5d275fc6a7b70430203010001": "b32f839ae55f261a91a0e6415aabb6ddc8c56c587fa6d33a6f9214b6b4a5605f8265e9e8564a77b6676d8ed442578bd730e124479c4ef89dfb609d8d5c1c215b4c5740a149d1af6180fa9e20d14da537e76429304ca820faa3dfcec079a66d54991d308693507a6654d59b004d4cbbd817fb4425e81dec41a8d58d65a86829aa1baf915e6bcd9d449c4ef86a63a3a0e0e0a90a6322770c892eb52769ad40e5cac0d49c9fb46c2775dfe947e05f6e651e4193284c064c829b70902eec69a746b1ac84ca67bdf7f7632c2eaf83b5a938645661c43a8d24542e242daf55a13ba9fee3506a8c500ea6653acd74ef51925df7be44f63faf7872449f792036211c9949",
              "223f55731820b91ccd18010203010001": "35eed81e1a3ab1b06bf0640536e3359dd0e28069144919d571943e60ba754abf87daf6d8994192e67060cbab8013a9d8de06601b34ee59da4f2a6823fe6182fc3d79631693c1e34c3fdd494673851e2b3dab7cc8ea19572f0abc80746b7abd6402b72a35a87fa94a78cd0ab6027d57870cec2b21e8e90e19a1fa7bf85e3fa450369d01010845f753566001b53ef093536bcc088178df5d033c422d6ff79358e45a18c2d1f7da314c7a89419653d3324feaf2a88e3183a8c238448a13fe9782fd9ca73d7b6eba681fdb28cf63ce415cfd9772a067131832e6b914e830a016cfed8c2c948468405b211ee7a8c499614bd1adc06f6b400a2c76abb81eeb6a0a4565"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "JkNt9KNe9XYHY/Sadh6nW+KBKwj9qJQqMfoMLG87hVA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "8e48ac95-0151-4b45-88f0-fa1ba7530944": {}
        }
      }
    },
    {
      "id": "8f29506a-46fb-4de2-b682-dd83c43b9706",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-3721e0b1fce0bb1aa5821ad7381cf49b",
      "created": 1679928225409,
      "modified": 1679928225409,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "7ad50e14@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "k+8auUnzdQudwqcDAg+QKdG2sLvOQHnFWWpZ5obuCuk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8faf93cd-2e35-46e9-8d30-45723b34a4af",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-27b91b43ad2be227a0ecdb2df19a9c85",
      "created": 1679920140691,
      "modified": 1679920140691,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "664963ed@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "+lnRSOI5OKDRBiNmuEMyVtZfgMhFFv6dATpx5oxKXUk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8fbaf409-8510-4bab-b920-42bfefbff909",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-abd55e100b9bacef9c92b5d2fc86c2dc",
      "created": 1679929409902,
      "modified": 1679929409902,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+nsr0yfoq8@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "GaDWTy7tZcLglgpZZ14uLgiOHpH+wsB5WWGFZRtQiDs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9148d804-111b-4c19-a02a-2e405bc72fed",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0e69a95a5199b9bf4f34dfbd4868f0e5",
      "created": 1679928181117,
      "modified": 1679928181117,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "B50sdC+IBLpgiqynG6ldjE9OMsbU+OflKKsfpznPFTLJvwqgz/XPSvdq/sOQo4Bg",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9313d25c-292b-4277-9fa4-18bb9bb50090",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-15d6498006df1cf8ab206738f374465d",
      "created": 1679926599642,
      "modified": 1679926599642,
      "author": "4bf2e02d-9370-4145-bcac-f7340b375627",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "h7izxznau-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c82b5d44e24b3caec3f29c4a318713f73fa9752299e2558a3acb2cc5c86af99b094e2820c6842b88fdff8474f9ff3b8c9136f99a59f26820bd651f78ceee0df9081172e63fa513069ae25428697dd1d0005aa36ba66d1872eebe92f173b603018c73ce223c7a92133c1e8f32c422b3355db599cdaf84693763b7d4914a42eec0545e5b914dbf1c7a66ac7d3315444827112a24a3eba36ab783b42c85272b3da3a394b5175a3517874a5fe081efae792c70a8097ed2fb1fecc5b3165a9b9ce54a56109bae78a795bba1a18687c4cd8741a65b2609d14130704288d7cc7223955ce351c6d944c9ecc0f0bd8f541a11bdb467c3b7e13dfc5fa2821f34a1779c621f0203010001",
        "hcPartyKeys": {
          "9313d25c-292b-4277-9fa4-18bb9bb50090": [
            "11971bb79a2711bd9a2e18a0daaf38d2d7e8deb42c6cc7c414581516e46094123217720a181412bc5a2bd25ca177c2f03bea908679831358d3ec9d51d6ea39b7e0157d563007e46e745671307888c3dfb4a71397cc07c6b4d7f39e4c63fcece152887caa23a5d9aadd2b1df8e434369dae1d54e7cf9f114db4f313651a34f19a100e7f270458af8acdf1d57e8cf6a78d5673db24486eb19ff3985186d364e003110c10c85a21b30ffc9409eb9e5b551d23e043a6569d170f807d665952e0d775eaa7bfd1ef21794c8f6ad11eef93e5f0105168e1b6c325a4ed17c9a8892e66d2b7c598904224760e164c5cc435ef216d213c0f865af73c4610bac1a0427284f6",
            "11971bb79a2711bd9a2e18a0daaf38d2d7e8deb42c6cc7c414581516e46094123217720a181412bc5a2bd25ca177c2f03bea908679831358d3ec9d51d6ea39b7e0157d563007e46e745671307888c3dfb4a71397cc07c6b4d7f39e4c63fcece152887caa23a5d9aadd2b1df8e434369dae1d54e7cf9f114db4f313651a34f19a100e7f270458af8acdf1d57e8cf6a78d5673db24486eb19ff3985186d364e003110c10c85a21b30ffc9409eb9e5b551d23e043a6569d170f807d665952e0d775eaa7bfd1ef21794c8f6ad11eef93e5f0105168e1b6c325a4ed17c9a8892e66d2b7c598904224760e164c5cc435ef216d213c0f865af73c4610bac1a0427284f6"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "70e4cb6e6039456e07e0731664345e79c43605fc56b37a365da49ac2ac8bf49387e3e5598da7308cf280076cd9453b1062cbac41722c3097cbe50568ea3f3ba59d88a621e72261046867c150f639ac4f6dca860939e69852bf03d5f78fc2818f52b2d0c1a73380eb4c42939596dd9701a11b7f3ce28acab6a986d1b85cabf5b59da1fcb894885049abc798a6ea126e08af451752de4ec823b37a94c4165d94049fcd988a1291e331be5ded62dba8bd27f1f18b345032eb228c6d1037d760c788ba57916eea04258dccc5702287885dc04985d217da7dac70b7625a64417252938b601630f583e1e8d7badc7b09513a4ed5525e52348aa9b128f4c861fef417a4",
            "66b7c37f17857a18301ce28d9984d6f7c6302d3d137476fa7d55634e29179fdc276186b9188a71c4b29adb9d25720299019d95662825399dee96d3f0102842f4a71e1fabf350a254796549e0b17bfc83616c46fa0086e131f87c1145eabb4811154f50bc6f847ea403cdd20d02332b929d60551dc5d0a7719e32f1e8aac39b609982b5a4de3eb78dc0c50dd91533db23b2b577a1d485ad63023d23906ed50e6e1ac88e2ea7e852fef53de77f78aed051a09767ae356d36031787b9b36b8e4e4539c407a1a5a038fc414b98a2a66517234ea834167139aaedc9d9c48be0108e2525780e369ef1ddea04341552c6eaa1c5629306a2a2acf1d0c6b592750678924f"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c82b5d44e24b3caec3f29c4a318713f73fa9752299e2558a3acb2cc5c86af99b094e2820c6842b88fdff8474f9ff3b8c9136f99a59f26820bd651f78ceee0df9081172e63fa513069ae25428697dd1d0005aa36ba66d1872eebe92f173b603018c73ce223c7a92133c1e8f32c422b3355db599cdaf84693763b7d4914a42eec0545e5b914dbf1c7a66ac7d3315444827112a24a3eba36ab783b42c85272b3da3a394b5175a3517874a5fe081efae792c70a8097ed2fb1fecc5b3165a9b9ce54a56109bae78a795bba1a18687c4cd8741a65b2609d14130704288d7cc7223955ce351c6d944c9ecc0f0bd8f541a11bdb467c3b7e13dfc5fa2821f34a1779c621f0203010001": {
            "9313d25c-292b-4277-9fa4-18bb9bb50090": {
              "fc5fa2821f34a1779c621f0203010001": "11971bb79a2711bd9a2e18a0daaf38d2d7e8deb42c6cc7c414581516e46094123217720a181412bc5a2bd25ca177c2f03bea908679831358d3ec9d51d6ea39b7e0157d563007e46e745671307888c3dfb4a71397cc07c6b4d7f39e4c63fcece152887caa23a5d9aadd2b1df8e434369dae1d54e7cf9f114db4f313651a34f19a100e7f270458af8acdf1d57e8cf6a78d5673db24486eb19ff3985186d364e003110c10c85a21b30ffc9409eb9e5b551d23e043a6569d170f807d665952e0d775eaa7bfd1ef21794c8f6ad11eef93e5f0105168e1b6c325a4ed17c9a8892e66d2b7c598904224760e164c5cc435ef216d213c0f865af73c4610bac1a0427284f6"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "fc5fa2821f34a1779c621f0203010001": "70e4cb6e6039456e07e0731664345e79c43605fc56b37a365da49ac2ac8bf49387e3e5598da7308cf280076cd9453b1062cbac41722c3097cbe50568ea3f3ba59d88a621e72261046867c150f639ac4f6dca860939e69852bf03d5f78fc2818f52b2d0c1a73380eb4c42939596dd9701a11b7f3ce28acab6a986d1b85cabf5b59da1fcb894885049abc798a6ea126e08af451752de4ec823b37a94c4165d94049fcd988a1291e331be5ded62dba8bd27f1f18b345032eb228c6d1037d760c788ba57916eea04258dccc5702287885dc04985d217da7dac70b7625a64417252938b601630f583e1e8d7badc7b09513a4ed5525e52348aa9b128f4c861fef417a4",
              "223f55731820b91ccd18010203010001": "66b7c37f17857a18301ce28d9984d6f7c6302d3d137476fa7d55634e29179fdc276186b9188a71c4b29adb9d25720299019d95662825399dee96d3f0102842f4a71e1fabf350a254796549e0b17bfc83616c46fa0086e131f87c1145eabb4811154f50bc6f847ea403cdd20d02332b929d60551dc5d0a7719e32f1e8aac39b609982b5a4de3eb78dc0c50dd91533db23b2b577a1d485ad63023d23906ed50e6e1ac88e2ea7e852fef53de77f78aed051a09767ae356d36031787b9b36b8e4e4539c407a1a5a038fc414b98a2a66517234ea834167139aaedc9d9c48be0108e2525780e369ef1ddea04341552c6eaa1c5629306a2a2acf1d0c6b592750678924f",
              "d5f8894cabbfe8b22671ed0203010001": "9a7563b84b8997a430f339d320ba9c2a6d09e3f71dac07a458473d84ccd6852458bd35dcecb59a6746899c97e4326cf185853e66c7db9033fb8ea4e9716c2889453a8276416d527ce303d54026efa20afa71d302a7e8497db602c9324e79d636c08d27b72d25a59b042e3d00e81bafaaf1ffc1d5521c5989045bacdaafb798f3722245da4fec4d93975202768a041d9e00cece59328928290bca68c950c92c6586c0f3258773ceec5901feba4e88e4fae75e3236653882e9cefee3444ee544ced10c8664e10df9321aa822cd7a5198768b18a730e0a913cdebd8773129f50da070a7cb4cb275f7adecb3cc9c5dde110f34e6ffe5c0439685e7c1ea133bcd52de"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cb4eef41d065c838e45601e9a5cc2c00476e402520fd15493a8f760ebf2b543bbcf3c09bd29beabf517fdcb702de3bf28c6cac1f2b002ccf52335a1e84bda4baa1043f717224e21a39f5f5658666aa1e25ac5686580ace8f4c3d29db69d310a3e0f791c5d68ebc62e1b9e523e5b70f8e04b387382647b0fa9a7711bb98d291e691e30975df21d0e04fc8690a5d419052ed4bbcec5a6e34f257dcf384ac1e49a6b04f09cf1c82a33baf8cf46f57b469d7b53e4e34c39fe0527370f8c08ec6da1f2a5e74a022c321293e7450a2d8770c1dcef4d56c5b8632b8cfa8d4c1ad9e2043ebb7dcb13a3ca849f83690a310514a20e02347ad8ad5f8894cabbfe8b22671ed0203010001": {
            "9313d25c-292b-4277-9fa4-18bb9bb50090": {
              "d5f8894cabbfe8b22671ed0203010001": "5ffb5848121f6e1393b4b3022215288d73694bc7183c2186d1c1e69210c05fd79d0556fc9e267624f33b482776659543a4d557a533a1badab5b4d276b1f0ed33ab79dff59ed8277f3dbf9e8ba7d41af7bfb912539bf62a005ba92c79675430340d39bc0bb24e862cdb68ce51437a5ec02c48db8b14b1c2b092c577f72dee379953cddcc5cffdd11dce63351f3db1364b6af4816eddea8e01c490298f718c3c0c927f9b4a436831735e6c83bd48bc556f9876819d6a4264eb9a9d6f1d17a083639a4197178174551f82233ddbee62b2144222beeb313a04c9169fd5b6b76a899b2cd1d366e62e344ba2d513438d572fa839d5c435b73d06521ba9d657a06bfd19",
              "fc5fa2821f34a1779c621f0203010001": "9e5774f19b4bf6d41f209efde3e34752b8ef69fdf507d2f102a211392a2c7d9d10cc5155476ce0d16b9fc59e240883c4f2aa4668069e066364bac927429b8fc2fb22d54d3c8f14aeaa1efd967f88d6787232c932d587df828eb139c7332e6c359a91c53583e47e783b24b9c9762ded2d57fab5d4f4204eb672e7846a1b047bf13c2aa7be7e8fce8b70cc2013b3e43cabe254fe17e6554bc71c7fbe34f9cabbacca0df7d21da725d23ff134e157227c418c489037d1bb2193e09e96fc95972812a17fb97ad369c022c091b7e7f2255374508863d423b9fcac8f9105e71efe839115c8bae919cc4156bc5cae2ecdb37159d023fd96c06892ff93c2a170bd395363"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "d5f8894cabbfe8b22671ed0203010001": "9e4bc1c98c172125835b79473f40aca6e235386d835f54cebcc40607947c0d4e7f157137c01ffc10853f041b986fb363ad62d9e8872e135679ebfc04fb042b3f72d9c9ede10dd913439a226dcb3490265a25381261a5797b0c520ee2703f0a427021ed70886206f92fc572fc26a084de26f0e918a6f3c8a5eb4cb8b7dba12c766075b005845f3139eaf4989e3aae18accfa032091291afb0f79792233af30619fd801b1c1eea520337ae6bd0be1ac74cb8c1410792ca1f3f11f0f18015e032e2b39d4bcfc5b769d60742e3ce6aa788c76317a7a743bd9769b228d7c0a0af135b812b20ca8a576ce7a66de2c4ebe7ab8a0d52492208e5c33cf1175085c8fd38c5",
              "223f55731820b91ccd18010203010001": "7546722c93da84c28b855a1b182649609b72bd50632f0ed49c54c78b39be02a727646fed5c448748e24fbd2a27cf9de63a23b0f73b9bac21fb2f9ed60a9e5c25a780955532150fa3aed305dedf5ff5f64553aaeb28045a475f3e16c115f1181a4fddec67503530bfe150799a9baf036c960f83f13397f7316a35179494236e89f7f5c6938322b9d205a2bfaa2104308cf66a75fa7aa5765e1d8be61687c7d42277ba829cafaf536134d80cbf003a55793b445fdd03eca1ddc64d6b2d35ad62cc6d5a6691a479e1a39e20419f59c2749621e7c94f657b5fbd276d37cb6da72667134406a24afab1f6bb201c5fa983b04842759a368a3374e1fb389ea08e9e4825"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c82b5d44e24b3caec3f29c4a318713f73fa9752299e2558a3acb2cc5c86af99b094e2820c6842b88fdff8474f9ff3b8c9136f99a59f26820bd651f78ceee0df9081172e63fa513069ae25428697dd1d0005aa36ba66d1872eebe92f173b603018c73ce223c7a92133c1e8f32c422b3355db599cdaf84693763b7d4914a42eec0545e5b914dbf1c7a66ac7d3315444827112a24a3eba36ab783b42c85272b3da3a394b5175a3517874a5fe081efae792c70a8097ed2fb1fecc5b3165a9b9ce54a56109bae78a795bba1a18687c4cd8741a65b2609d14130704288d7cc7223955ce351c6d944c9ecc0f0bd8f541a11bdb467c3b7e13dfc5fa2821f34a1779c621f0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100cb4eef41d065c838e45601e9a5cc2c00476e402520fd15493a8f760ebf2b543bbcf3c09bd29beabf517fdcb702de3bf28c6cac1f2b002ccf52335a1e84bda4baa1043f717224e21a39f5f5658666aa1e25ac5686580ace8f4c3d29db69d310a3e0f791c5d68ebc62e1b9e523e5b70f8e04b387382647b0fa9a7711bb98d291e691e30975df21d0e04fc8690a5d419052ed4bbcec5a6e34f257dcf384ac1e49a6b04f09cf1c82a33baf8cf46f57b469d7b53e4e34c39fe0527370f8c08ec6da1f2a5e74a022c321293e7450a2d8770c1dcef4d56c5b8632b8cfa8d4c1ad9e2043ebb7dcb13a3ca849f83690a310514a20e02347ad8ad5f8894cabbfe8b22671ed0203010001": "c18caf758d5dc9214f74cbce21e58bef027d6f14b8636167ec10b503bf754360dcb93a7cfa0dda899fa530125e063ebf7f97ae0710783ab4d538daf80b333fa680c2aa44e92ac630627d36a45564c8f67a24f0bce776ae38122224dc315d59b6fa8469c32d4ef4dd1ad82825be80770507bd809d1cb49796c145acbf649283dfb3c452c23e1fcc60538ba538e90f80900193f8de7fde8f0c85dc5a38ba6e13ab6e0114870c446214a18d14b149d375f86653e5b29affa91d068a33f0d1a830096608292dd4475dbb907f10c0ce489e184a66889c417952317f35b1fac877801f5974c3e3c3c82c74629b4ce45b436afbc43bf7a68e6fcc3e13b29d1200b4a822a6f14adf07947d38323c2bdb297fccb0799a203c759b3fac744b8fd017ba4dfdea493c0769307291af00d8580c3c5a2341141bca26b862c3f9b410f2d6c5b48a0e4bf19221295f24ef7d81f09d4dec6040b83847ba144912917c7f85b6b9b621fece65da1814ac47b7d6ec7bfefe3a9166b21001cef9bb7edb479e0e8af82d2fb7ed7984e0a35b418ff77a47cdd95cd147ca3711eb0e3e789867552d5e8fc7035d10199a5e94e01983bac252e63a3f5a3a776df72a01f4dfd5e1bccce995022b24da20fbd796d420b5f2bddcdec8bd9df7292362ecac56f6d822b6225bb8257eeb295a6ee4012ebb9141e353053371e39472c546c51d02615c69ff4bd140bf31d32218c0e25367f99e52e6f892666e58a0bbb481e4ee184e56a1c560cdde6affd140a611404811f862c4685145415bc343a67d1ea8528f6d597a6cc330d7c51359fce6fb13e40c4bc89065dd86d86d11a6b598e583a4e1831293e1803aa4aff6aa6339a88d5d06c3c0e78428713d364e2ba7a8aa133c0a3205fc19d7c8a8069ca4a556d92ee37a32ca315e44732dd4444f7dab573a78de506c1a195aa5f8f252e97a688c14d4e5ea7eef0590a2ac30b317ff36208549833f9b86484927fc26ef451c6593318c49e578088ce096e192a25b2f679e029d9aea4207c0abdda9960bf340e78e5ea541337f3b5cdd536d6e98af2b09e7c77a69effd8a886efcb312a786d2a8449e8b35cc5d2cc32e8c327d83d7baedc7c0bee9aefe3a37d5d05deba38e7f8a4f2316a41e563930eb042d41a9b33cbb8d2b71d4c2c78cfed8ae46648555d53bce2b6373ff52c2683593c9117809d419760090e789c980fa8fa0747614ff67bcc70a4ad7c312c20c58861bbf329fafd49abcf8d57102de01b3c1851236295e3f50622aa83b31ac2f35481865d7ce994eb85ec1203cdc76292a9cfdb32d88c883666cd8a85d55f84eb4637ad813102995ba42922396ac2226286ef8b09f194b4ece105a72c5191fa479a949d34edbc98611a6137a12a392f0dd187fcc21c8cd25b272628f309705017612cae26e8cc2fbb1e075505ebffbff42f000bbb9b8e207cdc3ad45c4986550d84f643db06048d0755a0e96e8f73265630a845e4589e4350ab9fd3d2772cc856d7402cef04dbab1874295c48348bcdbcb9f1db4093aefba5608a6e0c6bb966d28161639c87977a5181049cd0cd5d6960553a68a335c8b3b1af14658767b93ef1871e3c5b59f67441f683850bae7467d8c08296fad1ba531858531b2aff1b449f295ff2783986f221befe132c9ab366d3e7f197c7b8d2f23dfb74ef9a2b81bf914a15793dfccfbb215d91906347126592e179ab9efe90a3282dd2d1da0dbb4b17a4601ad23cf991c719d4869f81bed84143bcb34ae"
          }
        },
        "encryptedSelf": "8zkrENE709RMcqfvWTvpX0Y/wcFf3SdFAGotS0gN0wQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "9313d25c-292b-4277-9fa4-18bb9bb50090": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "9313d25c-292b-4277-9fa4-18bb9bb50090": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9388453b-8f65-488d-9ff8-ef1fb6be0ee0",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-fc373d62c367376050a098e779229e32",
      "created": 1679926509085,
      "modified": 1679926509085,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "7a1ff865@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c15c66085bb02a60b6f02ab1b3d2180c3ace33673284d3c7b1d39bd939964e5c70f0c151253398ca860e413b8595bfedf253c075dbc9d41addb8ff8e6c12e2f0c2e6d4a2901fb13d849423a2045501512e61fed16a5b8b5d3e6db5d8a76a942329bcff94e5b1e32327472aa6028b98ae941c073d07a27cc7bd9e1262c0ba52fcc84374b5ea43df06ebe69a72ab922d9c013b36ac0b7e146ec1415826ccc6c67cfd2f2f6ac787cc273ed971614750f7a8beef17e8c53000470cf618304192c1ebe661a74ebfd80426cca4a0d089abb4b847e60b0f46d3eb3b79309f8d21bfa869f4a8e48eebd0e22ea4b7cff427ad59d1b686935502a5168cdbabcfd2506b09f10203010001",
        "hcPartyKeys": {
          "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": [
            "badbbd72deb5416170e62fe655e759ea39cb9727ce8ea3c7adc687e33e4d146539351327ea59d5065d777e1fa37650435c360ef1949bad99397e60c66fe425b72c41adb42490acefb6464fa37b739318410b0f134049dda98f5a2dad79b7adef18cb84b2103022a43655a09ce21af0289022f56f5bab069418e3f6583ca0266ff9a3457e794e844d305a3f7e177b7f5f48468c431c3b2420daa682f34084db65fe347816c2ae01b2c2a14efaf78b3f063aada51769b76ce6ce2f2263487921de405f61f354a4a4bd7c0479d41d9383044703d1f7df736ed4dc6076f74542e3cf674476769a7f2cc7ffcdc5751edc0448cf4375b44bf9033e0f7e2dca3409ab12",
            "badbbd72deb5416170e62fe655e759ea39cb9727ce8ea3c7adc687e33e4d146539351327ea59d5065d777e1fa37650435c360ef1949bad99397e60c66fe425b72c41adb42490acefb6464fa37b739318410b0f134049dda98f5a2dad79b7adef18cb84b2103022a43655a09ce21af0289022f56f5bab069418e3f6583ca0266ff9a3457e794e844d305a3f7e177b7f5f48468c431c3b2420daa682f34084db65fe347816c2ae01b2c2a14efaf78b3f063aada51769b76ce6ce2f2263487921de405f61f354a4a4bd7c0479d41d9383044703d1f7df736ed4dc6076f74542e3cf674476769a7f2cc7ffcdc5751edc0448cf4375b44bf9033e0f7e2dca3409ab12"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "8cece3eccad790757322d5bffdc4a626fb66ebbd71cb4b37fbad5fe5395c84ea2e274936550647f371c107c960dbf95f5764e0650e0c52285460e1968891dbcabbff965d0d7a7ee4ef47a879d3f57921bae55d3e659dfd73630012149df9d440dc01cc792727b4e6fcfa51b38e854b1f86f16a01316d62cb33743158d86b9cffddc017cd1192a818f5a1976f49a9c3c079535e099dfdfd8e896cbdb04a8c3d3602fa9b170853914adbdc35ae7738f1dc1e224a16cb62447f67c215702ebd08ae1321f31d549763b36b5e619502637db83ead66c55297c86af24afe575aaaf66b429fd7a958426941fe05e9ece6bfeac0c69e2258a76c568085068bc6af4fa03f",
            "31f04d8c872bea6f3170f442f98521c4669ebdde006229b52d877dedbc5fac5d0e2cdfc784bf0938e8b071cc9f4c06dcf255124009cacdc6a32409734b1e295468469bc6252951c592b3a8f4e3368ad4831e481fa19dbaacc4b18fb68a3a80e96b6f55ed393a410bae6e05dbf057646baff11db0e0df9bbc3ea43ae36d61a21121fd9dd73218a2d216d16c3132af997fae6ac2772d52cc4f32b39822e6d57a525d211adc223e0b08eba8f751b34a3382f20e8f279e7ec906bcb08716b7b4899b535fcf56f322e4734d70a1cb501d9f0ad3ee9cb96b9f403f36ca025697d2142fd3f04f4b58b086df1cc1b3b2639ad25a8eb8aea8de5482723c36ef5be15952fe"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c15c66085bb02a60b6f02ab1b3d2180c3ace33673284d3c7b1d39bd939964e5c70f0c151253398ca860e413b8595bfedf253c075dbc9d41addb8ff8e6c12e2f0c2e6d4a2901fb13d849423a2045501512e61fed16a5b8b5d3e6db5d8a76a942329bcff94e5b1e32327472aa6028b98ae941c073d07a27cc7bd9e1262c0ba52fcc84374b5ea43df06ebe69a72ab922d9c013b36ac0b7e146ec1415826ccc6c67cfd2f2f6ac787cc273ed971614750f7a8beef17e8c53000470cf618304192c1ebe661a74ebfd80426cca4a0d089abb4b847e60b0f46d3eb3b79309f8d21bfa869f4a8e48eebd0e22ea4b7cff427ad59d1b686935502a5168cdbabcfd2506b09f10203010001": {
            "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {
              "a5168cdbabcfd2506b09f10203010001": "badbbd72deb5416170e62fe655e759ea39cb9727ce8ea3c7adc687e33e4d146539351327ea59d5065d777e1fa37650435c360ef1949bad99397e60c66fe425b72c41adb42490acefb6464fa37b739318410b0f134049dda98f5a2dad79b7adef18cb84b2103022a43655a09ce21af0289022f56f5bab069418e3f6583ca0266ff9a3457e794e844d305a3f7e177b7f5f48468c431c3b2420daa682f34084db65fe347816c2ae01b2c2a14efaf78b3f063aada51769b76ce6ce2f2263487921de405f61f354a4a4bd7c0479d41d9383044703d1f7df736ed4dc6076f74542e3cf674476769a7f2cc7ffcdc5751edc0448cf4375b44bf9033e0f7e2dca3409ab12"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "a5168cdbabcfd2506b09f10203010001": "8cece3eccad790757322d5bffdc4a626fb66ebbd71cb4b37fbad5fe5395c84ea2e274936550647f371c107c960dbf95f5764e0650e0c52285460e1968891dbcabbff965d0d7a7ee4ef47a879d3f57921bae55d3e659dfd73630012149df9d440dc01cc792727b4e6fcfa51b38e854b1f86f16a01316d62cb33743158d86b9cffddc017cd1192a818f5a1976f49a9c3c079535e099dfdfd8e896cbdb04a8c3d3602fa9b170853914adbdc35ae7738f1dc1e224a16cb62447f67c215702ebd08ae1321f31d549763b36b5e619502637db83ead66c55297c86af24afe575aaaf66b429fd7a958426941fe05e9ece6bfeac0c69e2258a76c568085068bc6af4fa03f",
              "223f55731820b91ccd18010203010001": "31f04d8c872bea6f3170f442f98521c4669ebdde006229b52d877dedbc5fac5d0e2cdfc784bf0938e8b071cc9f4c06dcf255124009cacdc6a32409734b1e295468469bc6252951c592b3a8f4e3368ad4831e481fa19dbaacc4b18fb68a3a80e96b6f55ed393a410bae6e05dbf057646baff11db0e0df9bbc3ea43ae36d61a21121fd9dd73218a2d216d16c3132af997fae6ac2772d52cc4f32b39822e6d57a525d211adc223e0b08eba8f751b34a3382f20e8f279e7ec906bcb08716b7b4899b535fcf56f322e4734d70a1cb501d9f0ad3ee9cb96b9f403f36ca025697d2142fd3f04f4b58b086df1cc1b3b2639ad25a8eb8aea8de5482723c36ef5be15952fe"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "ljwH/943zzu0WbbNSPPDvR5VGHlck0Us7CpWPCaMpyg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "9388453b-8f65-488d-9ff8-ef1fb6be0ee0": {}
        }
      }
    },
    {
      "id": "95c6c084-f4bb-498f-a0d2-de61a0d50697",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-01efaa85c81a8957c648f99ad151ca07",
      "created": 1679920641009,
      "modified": 1679920641009,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "wuomsG0n+eMGlsmHoVRcNhg5zF7Y76cjcTZcHtgySTLCaPhjkl0OYdiusJtkE/8D",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9690e168-5786-41aa-99da-f5849d647761",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-af343cf8d31095e7fab6a02fab5f504a",
      "created": 1679927918924,
      "modified": 1679927918924,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "dVihQ+rR+QXDHqwYs94jYdBNBaywAEe0p+gXJYnpV85hjnrpkFBLzCFTkzLyO6WX",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "96f92ad5-c4a3-4064-b10a-c2c3e5762453",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-22343ac02433c331404597009c885bba",
      "created": 1679920278304,
      "modified": 1679920278304,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "W9ZgM9z0xIWGoAI3i8TEua5wXvnJKjAEiSyX2o+u/Vx13Ga2ddstKrwgyeoTTD6r",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "973a04df-aae1-4a1e-b934-8c7fcc700801",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-9019bcd4b44dbccb60474267466fbf73",
      "created": 1679927941851,
      "modified": 1679927941851,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "certts+C5g2OnOjnENndQZLm3ieEkbHZA1OMHTQar5R2LNQOtd3Z7RYsQz/WKD2O",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "97f29ca6-5158-4d1b-89d0-62b6d7548d60",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d2ae38bc53e92f41c1f28b78f9001abf",
      "created": 1679927912217,
      "modified": 1679927912217,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+5zsxojsof@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "5GuRvCCC0vPgmaF+6quNTaSacsTsAaxJBwrqVkUtfCY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9895f64e-5ca5-4a9b-84ba-57760543ab13",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fd35c16b50e28f746d635c85980a9163",
      "created": 1679924383588,
      "modified": 1679924383588,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "t+QFbM0EvO6tVa3jHH04/u+9fmgHsnLjmKa6aixXo96QK5AfOgfPpUL70EgGLQhn",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "98fc2260-a159-4547-8f0b-ce43400803f2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1e8e5f406c1bd4bae7d47d1ea56b4838",
      "created": 1679924419615,
      "modified": 1679924419615,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "gmE1Rq0gMaXoIi+D4PuMVeOzX9LCYXAJr8j4OKikNKs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "993de78a-acdb-4173-97c0-3b1cac273ea8",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-2fb65e629405ea2fa65dcd32cc956010",
      "created": 1679929442500,
      "modified": 1679929442500,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "8b41ab82@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Z9XBfz4We88HBqcwio4rfMvWMtWcRH+smWq880Bhel8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9ab45e4a-93f1-49db-875e-13799756454b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bdfe7cb1c186a01913275ac747f13b00",
      "created": 1679926499767,
      "modified": 1679926499767,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "KPN88ia0OgrcrHpVASJTqt2XufJA1b93k2zzOGqrV5tfhZe+whJn8IxZaGbQckjN",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "9ad8bde7-0df7-42ea-ba1b-dadef65dc872",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fc2ad16ec042310d2241752276a45d4f",
      "created": 1679920646047,
      "modified": 1679920646047,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+gkpy2qo4@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "oQM+YAlaLADNc9DnrYBQfdtd+BpbTTsZIadCjOsqRmk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9af24447-4928-4c55-ab35-6cb5a4ceae4d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-c8be56b8d279dfd7a4a11df317224a17",
      "created": 1679920619220,
      "modified": 1679920619220,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "bb77ab9e@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ad90d4d16906b453ca0a36449d78b9cd58b252fd30722eb14f344b9440abe16486525d43f434523adbb09ce99dbd88d4517ad0d1a87a446514d1ac79a71ff46c05f8dd9f6459adfd5a4acf0f6b66703728a36fb6e335de97ca834baf4583a8d948884ac3f87606bf5e5c499cb04f3f65821b66d10654f130f48d00b16f81aaf717e5aa9f37138a875beb1ce95d893fd36ab502e9f111987e657840651565605f79a10153fd59470d59afcbf4880103e97042a4a7e092d47ec0694d578704afb89f6b8e81ee6621febc7b6819b01978e67a550e243309b0d0863f61af07e18ee4c45482dd855ae99f0cf74440fe73b394d7231be02fee98ff27bfdc16aea956d10203010001",
        "hcPartyKeys": {
          "9af24447-4928-4c55-ab35-6cb5a4ceae4d": [
            "596b02ddbd6224a2587ac6ffa0a1ac91ab4f9627868ab46922769c4409679952aff0646109a1887ca4c4452fde1a43c9abd6a4899f17ea4e2b90e17611cd7a3b4a7807e8bf454cfad5740b7b64f27cfd1bb755889bf0343bee4e83c310791a33d37192ced02de95c3da0aa4e3945c7a89ecea1eaeca94b9a48984be997b5df97dc9d19a3544fcbea2fd7c3646e3ec392e57de301d671724c30e6bd94ccc0ce9739ad1a52b85039d3b64942f226d60ef50635035b68d81433e8f19f07457fe900bae191d5027b21568875d2b7f60bf4dc52d57d44277a0995d3bf49d6f20d075545b7e34e4b1f38578a2c0a7732caa3b4631df95278ad7ea952801b8e5f9bfde4",
            "596b02ddbd6224a2587ac6ffa0a1ac91ab4f9627868ab46922769c4409679952aff0646109a1887ca4c4452fde1a43c9abd6a4899f17ea4e2b90e17611cd7a3b4a7807e8bf454cfad5740b7b64f27cfd1bb755889bf0343bee4e83c310791a33d37192ced02de95c3da0aa4e3945c7a89ecea1eaeca94b9a48984be997b5df97dc9d19a3544fcbea2fd7c3646e3ec392e57de301d671724c30e6bd94ccc0ce9739ad1a52b85039d3b64942f226d60ef50635035b68d81433e8f19f07457fe900bae191d5027b21568875d2b7f60bf4dc52d57d44277a0995d3bf49d6f20d075545b7e34e4b1f38578a2c0a7732caa3b4631df95278ad7ea952801b8e5f9bfde4"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "6f195710171b92ea6bbbee644dde1557cbfa300ba79965b2d400ae10784b19574e169dd715797e8297b99910b8806364397f4cbf35e4b85a1d460f871f4d5a49adce7fd7580c0820b1b635fb58507ed69f141802dae00bfe7ed8ead4d6890a1bb21a78c6368459c0a854b68de1406212e88334d5baecb75e1b76ecab8137a0a639fbeabc7753f25dde2992c2b7fc310126510e43763868070e9a0e1b88a03653311ff19760b0762fe178feca286d0bab4dbac6088bc16c21a16e0f1c51af910fd24adb80471f2c15b8612bb1d2499165db6c222b1623cab90d156b2abb8922165f0637d0619c9cbc2d363cf063b376eb02ab26ca3a13a0da548aed7d1907bfa2",
            "2ec23dcef4c1fa04858810c77f6c39e489db2218ec13b32828c293d08b24bb182873b95d8514a700baef67d790a9d708e4b570895ffee6617d2d7bd91b4cbb326bb94d2d1db1eec34d18a508353456bf3220ecfdc50a72748563dad4cbacf559ea26cd734b85abc77d641bc9d5aa045b956f4da28df4ec750e94c33de10676b26ba5246ca91a93d9470172968d0ef57944d7b368fa9b5da93ad65ab3e7ca8f70b11f0dd80f41bb0b84a2540cf7028c8eaa5614a373434061f0ae11e99668ae9c7938af5e332cd15c1d93921bb0457e8dde60a890ef0a778b3b4fadf8ce488975fba3fb0884080a5804eeb8ec42088e2306dceb60a5ceac1fdfb1066684fd5430"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ad90d4d16906b453ca0a36449d78b9cd58b252fd30722eb14f344b9440abe16486525d43f434523adbb09ce99dbd88d4517ad0d1a87a446514d1ac79a71ff46c05f8dd9f6459adfd5a4acf0f6b66703728a36fb6e335de97ca834baf4583a8d948884ac3f87606bf5e5c499cb04f3f65821b66d10654f130f48d00b16f81aaf717e5aa9f37138a875beb1ce95d893fd36ab502e9f111987e657840651565605f79a10153fd59470d59afcbf4880103e97042a4a7e092d47ec0694d578704afb89f6b8e81ee6621febc7b6819b01978e67a550e243309b0d0863f61af07e18ee4c45482dd855ae99f0cf74440fe73b394d7231be02fee98ff27bfdc16aea956d10203010001": {
            "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {
              "ee98ff27bfdc16aea956d10203010001": "596b02ddbd6224a2587ac6ffa0a1ac91ab4f9627868ab46922769c4409679952aff0646109a1887ca4c4452fde1a43c9abd6a4899f17ea4e2b90e17611cd7a3b4a7807e8bf454cfad5740b7b64f27cfd1bb755889bf0343bee4e83c310791a33d37192ced02de95c3da0aa4e3945c7a89ecea1eaeca94b9a48984be997b5df97dc9d19a3544fcbea2fd7c3646e3ec392e57de301d671724c30e6bd94ccc0ce9739ad1a52b85039d3b64942f226d60ef50635035b68d81433e8f19f07457fe900bae191d5027b21568875d2b7f60bf4dc52d57d44277a0995d3bf49d6f20d075545b7e34e4b1f38578a2c0a7732caa3b4631df95278ad7ea952801b8e5f9bfde4"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "ee98ff27bfdc16aea956d10203010001": "6f195710171b92ea6bbbee644dde1557cbfa300ba79965b2d400ae10784b19574e169dd715797e8297b99910b8806364397f4cbf35e4b85a1d460f871f4d5a49adce7fd7580c0820b1b635fb58507ed69f141802dae00bfe7ed8ead4d6890a1bb21a78c6368459c0a854b68de1406212e88334d5baecb75e1b76ecab8137a0a639fbeabc7753f25dde2992c2b7fc310126510e43763868070e9a0e1b88a03653311ff19760b0762fe178feca286d0bab4dbac6088bc16c21a16e0f1c51af910fd24adb80471f2c15b8612bb1d2499165db6c222b1623cab90d156b2abb8922165f0637d0619c9cbc2d363cf063b376eb02ab26ca3a13a0da548aed7d1907bfa2",
              "223f55731820b91ccd18010203010001": "2ec23dcef4c1fa04858810c77f6c39e489db2218ec13b32828c293d08b24bb182873b95d8514a700baef67d790a9d708e4b570895ffee6617d2d7bd91b4cbb326bb94d2d1db1eec34d18a508353456bf3220ecfdc50a72748563dad4cbacf559ea26cd734b85abc77d641bc9d5aa045b956f4da28df4ec750e94c33de10676b26ba5246ca91a93d9470172968d0ef57944d7b368fa9b5da93ad65ab3e7ca8f70b11f0dd80f41bb0b84a2540cf7028c8eaa5614a373434061f0ae11e99668ae9c7938af5e332cd15c1d93921bb0457e8dde60a890ef0a778b3b4fadf8ce488975fba3fb0884080a5804eeb8ec42088e2306dceb60a5ceac1fdfb1066684fd5430"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "ROJ3qTskCzJD7FXBoEKoeEVdGxdq4+Xak+5HKwpqtN4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "9af24447-4928-4c55-ab35-6cb5a4ceae4d": {}
        }
      }
    },
    {
      "id": "9af2ac37-edc3-4dde-b1eb-9362892f6167",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-5d02c0c50950b68f9fbe278454098e5c",
      "created": 1679927254778,
      "modified": 1679927254778,
      "author": "ebe4c24a-a717-4a79-b1a2-982db6ce96b7",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "9y6rnrt4g-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e7ca904f31a621d6eeda5ccb184df1acdfe5ce60399f273e866b7a0744a0cf8f091eac9e0f98caed69749fc6fd81231ed641a9751b1328b17ba9e16db1374af5e789f2291d64bf737aa53d03daa77c1fb55f8f8f7cea857a6c51f380b5e4daa0a15ee34b1f10169ef302de355c6a8bfad6e041bbad82dc60cbf4018831a32555b1e06ea0623ea284ba37ccf8e3771de3d86be2d640af1f4162f87bab51a4918ddad39e9701d1927e54d4989fca4b0fbcfa4fdc4c9306cab9c53dff54a472e385d07cda081cdc008562269355fa482530df4af09f36fac9ad379e718836cd9e6ce56d86de43359ce7afc4922370695b502a5d47a4bc5bddd1fb8ee905b8b6bb670203010001",
        "hcPartyKeys": {
          "9af2ac37-edc3-4dde-b1eb-9362892f6167": [
            "6dbd8b4c22a484dc7db986f37f5c0f76f6cb980927a3985946cf99d9f0f0ec6e853119e6b789fb9ebe66ea788b42d2875fa7ec9d51e7433cf4ba37026b031b3c11789c89df3abe7843c24f52eb1a1280df8af73c71546c323787a954c7087f00304345b99fd6db3b2944186013273e735d7bdc2bbe5fc4620f63b0c1c07bce381b6c84ab615a16821589b16aa30110d27528bfab20b2c229d422a2794712e074b54ba876fe1ea7f9f80ebf5af316d18ae3939a99578d5439085703822ccb54aa3b63c030edc88d0bcd64e6b81a450cb7d018bfc7953de7884c631e78e16d51bee6f3f1620d7e867f93728251f878494992d018be1ca10074faddc5dffe719db9",
            "6dbd8b4c22a484dc7db986f37f5c0f76f6cb980927a3985946cf99d9f0f0ec6e853119e6b789fb9ebe66ea788b42d2875fa7ec9d51e7433cf4ba37026b031b3c11789c89df3abe7843c24f52eb1a1280df8af73c71546c323787a954c7087f00304345b99fd6db3b2944186013273e735d7bdc2bbe5fc4620f63b0c1c07bce381b6c84ab615a16821589b16aa30110d27528bfab20b2c229d422a2794712e074b54ba876fe1ea7f9f80ebf5af316d18ae3939a99578d5439085703822ccb54aa3b63c030edc88d0bcd64e6b81a450cb7d018bfc7953de7884c631e78e16d51bee6f3f1620d7e867f93728251f878494992d018be1ca10074faddc5dffe719db9"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "6cddabc78e6c08f0595865f837340ff721e67029fb16b205bf70086f2547b47133157cf7f82a069eeff052573b7ca748cce43b3e1371b76c877fe968ef918eabcf8451841b47ffec2bdb1b53fee9de5224f9f1c2383b6d087a0d91f277697d110306e2cd6bbfc6c536cbca9cd3a7d838bdf77d32d5f2e7b63a6a6964aa564042a48718047bea0a1a77d12e285dbee44dfaa96c0418d3f0967b96b206fcdd44927240e70efde14d8280621e6e414bcb23ce428d9839185aeb538beafe2c9a4e20f1d6ebfe07fa10c3e9c6fb9428db5d99523388acc7bc553dc3d60e1beceb80c5519a96435254f83e0b08c8c21b80958cc882ce284960dcda986460bdf0e951fe",
            "08b7283d117db150466ec9fbbe493f15be1003a37bdfe75dd540b24530da267e3d2b9fdc5492b70e1154d3e93789337990997e382a64d72111f3081a2d1bf9843c123f5b4bac0a4bee9fdcec1cfe943bc92626aacc8952f48822d10c0d70ac20540ea623fd63aa79df4fa7d1fa4d39e1d7c937f119c006a4747e1d976593fcf1539da49dc54d28bc43c205def708777ee05d5a1c929565ed35d151cf81f8cded88e8a99da75402964132cf12221d7d7cb18e899ec4fd3a3c73d9d88e66fd7b45623c66f65b4d72f98a55a684f15c3a516cafd3b2b90a3da764618a97ce129b02f0fd35c68d700625c23b49613d29a33a23d691ff4f48d0eecc05114ae2a4ea68"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e7ca904f31a621d6eeda5ccb184df1acdfe5ce60399f273e866b7a0744a0cf8f091eac9e0f98caed69749fc6fd81231ed641a9751b1328b17ba9e16db1374af5e789f2291d64bf737aa53d03daa77c1fb55f8f8f7cea857a6c51f380b5e4daa0a15ee34b1f10169ef302de355c6a8bfad6e041bbad82dc60cbf4018831a32555b1e06ea0623ea284ba37ccf8e3771de3d86be2d640af1f4162f87bab51a4918ddad39e9701d1927e54d4989fca4b0fbcfa4fdc4c9306cab9c53dff54a472e385d07cda081cdc008562269355fa482530df4af09f36fac9ad379e718836cd9e6ce56d86de43359ce7afc4922370695b502a5d47a4bc5bddd1fb8ee905b8b6bb670203010001": {
            "9af2ac37-edc3-4dde-b1eb-9362892f6167": {
              "5bddd1fb8ee905b8b6bb670203010001": "6dbd8b4c22a484dc7db986f37f5c0f76f6cb980927a3985946cf99d9f0f0ec6e853119e6b789fb9ebe66ea788b42d2875fa7ec9d51e7433cf4ba37026b031b3c11789c89df3abe7843c24f52eb1a1280df8af73c71546c323787a954c7087f00304345b99fd6db3b2944186013273e735d7bdc2bbe5fc4620f63b0c1c07bce381b6c84ab615a16821589b16aa30110d27528bfab20b2c229d422a2794712e074b54ba876fe1ea7f9f80ebf5af316d18ae3939a99578d5439085703822ccb54aa3b63c030edc88d0bcd64e6b81a450cb7d018bfc7953de7884c631e78e16d51bee6f3f1620d7e867f93728251f878494992d018be1ca10074faddc5dffe719db9"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "5bddd1fb8ee905b8b6bb670203010001": "6cddabc78e6c08f0595865f837340ff721e67029fb16b205bf70086f2547b47133157cf7f82a069eeff052573b7ca748cce43b3e1371b76c877fe968ef918eabcf8451841b47ffec2bdb1b53fee9de5224f9f1c2383b6d087a0d91f277697d110306e2cd6bbfc6c536cbca9cd3a7d838bdf77d32d5f2e7b63a6a6964aa564042a48718047bea0a1a77d12e285dbee44dfaa96c0418d3f0967b96b206fcdd44927240e70efde14d8280621e6e414bcb23ce428d9839185aeb538beafe2c9a4e20f1d6ebfe07fa10c3e9c6fb9428db5d99523388acc7bc553dc3d60e1beceb80c5519a96435254f83e0b08c8c21b80958cc882ce284960dcda986460bdf0e951fe",
              "223f55731820b91ccd18010203010001": "08b7283d117db150466ec9fbbe493f15be1003a37bdfe75dd540b24530da267e3d2b9fdc5492b70e1154d3e93789337990997e382a64d72111f3081a2d1bf9843c123f5b4bac0a4bee9fdcec1cfe943bc92626aacc8952f48822d10c0d70ac20540ea623fd63aa79df4fa7d1fa4d39e1d7c937f119c006a4747e1d976593fcf1539da49dc54d28bc43c205def708777ee05d5a1c929565ed35d151cf81f8cded88e8a99da75402964132cf12221d7d7cb18e899ec4fd3a3c73d9d88e66fd7b45623c66f65b4d72f98a55a684f15c3a516cafd3b2b90a3da764618a97ce129b02f0fd35c68d700625c23b49613d29a33a23d691ff4f48d0eecc05114ae2a4ea68",
              "8eb62a6b14a3e938a35a850203010001": "3c7c3ef86ecf6a0d4e33db8a0cccd305d6eb7837ddea18c84a1cdd27aa584f1bf101d318dc74b85cd0a2a7ee01bee95432f1e2779c735afdc553aedb35b75c12ad521c9ec7b2cdbea24fb5b5dcf5e29da59a95be78270155f47b17c3049ee46d40e38698ca00315c9a6a6d27295f414697a9a5670d3ed477231a2badd1699fef0ab150f520c98a7ff552680396ea1c14050370c9ac9e3358c8ec99eee41776938ad35a0a1db932737985393a3e238aba2a1719336428987bd9adb68eb36049a3ac93a7ba9d02a7ab3b9a32d1b5115247a918c155b62ccdbeba48fac32d687979681ec46867b2c2a2940b47ad4d0b0f6f78d7dbb15d787292bd0e6953d6b0d4bc"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b19c234107a6bff5d98f5940a8f9af44ac7078a3ecb7c9257444f615bacb260e79ca80d94c85cac601b9e98e85238a63bc6d3983787841d74b2dc6f6cac0e6e6b3369e4cca21be9f373814527ffd789219023ea9d450adba417fb2f1687e8380c1a927b4ee5222db83e93b0bb7eb875a7616afa78ebdd3956bee7ee49edd76225d506c0780e46f98998f52409dc29b09be7e3958b2efecca2d676617a42676ae7db63131c082354e2a97a67dd0fd173db6d57d88e7602d3a46f07d0f707f224305fb568388ce49125072a2f8aa757da0a996d75641eacec8bda31f3119e5c915ddd2b94493c370aee3ea648ed27e0366a2d1f7526b8eb62a6b14a3e938a35a850203010001": {
            "9af2ac37-edc3-4dde-b1eb-9362892f6167": {
              "8eb62a6b14a3e938a35a850203010001": "a099e26659384bc3751ec7e6f41fd97b33fb2f2d0f735ba0457d4aa3333ad17680c7fe9068819917a66be07cc35eccfdf8250ccac737225f470bd1de29dafc73700301ff20a9b7c78153893e71055a58d15ef830a693706a2de748b0b274673bdf352ea4e1183797b9795aac5b4f5f9cb1c7094bfae45951de68933c1f6a79bcf8f1ba2c16f642305d9332f2b3ce84422b39f00abf61f32289c909d21a63bf930fbad47ec3ec4a27d3df851526979beed13f6e0718162dc03132f4ddc4d05911e25e16d68395d3ea15515525137b8766b33c2fa9902dd47179a505101aea62d8d6e608aff0c69484b82c95536ced3a371951a82105ec79d3811a113d00bbcc3a",
              "5bddd1fb8ee905b8b6bb670203010001": "04d12481523daff08152b589c2954abe67ceb6a6dbd925b105966ef6338852b51963954969907621f8c2d59d00af5a9b908d0698e95ea14d6670bb59f2ca74a9e0a835ba637e275ff82cec3c4b5457277a3064d6a13553e190994e293639b8965a2fac61334a425ea12fa8dd45cd481a7f8f2c81d290a254b164cc9ee329cfe784039eec0718c32396bcc474540c4f11dd8398fabb7d8b0c15eb742d9e4426396a26608b2b509f48db074d9e57745b6d4d041899e7c76bc1f5d266a0ce3f252b2b41e8fecfd1758b9756beeb8ee30f3d3e223c332c8357d0c7b2bd31f55b740bc36fd00e4e6a73dcdf29be341ed9831159443cbaac71b6a1379c518b4ce56f3e"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "8eb62a6b14a3e938a35a850203010001": "94a9127240c8b2971475a911a743474c12bbbedd33f37320a173389ede5d4d5f81c9c321370336098e0c2fb118de7c5c80311c29d3a7600cd723afc54f2d64e8bdf08a20682426f6e3efb486e7669106ebed2bff578e38035b834ad5275a280297de77dc6365457906f04481e05fbd144334f83b63e0e04eac305b9b74d1f73a919fc452d98b5d85d71397e74b241021fd2666fddae3f3d93f778a88672a6a57bf92aa1805bc5c7d2a650fd7aa2b1c07786feee0d0a6f3ddc9aeccc4d6ddfea42bdfdd60131e0343365fdc4e75798fc22bd4b9382d4bec95324cb5d73817f5008b8eb8f501b6b0754544b9579b4b0f08128ce21b0b92f18fdb90b18abbaf25d6",
              "223f55731820b91ccd18010203010001": "b2a23054c7acfcac6d62a5b97f96335612e9337e225ffe64d18688360236ce92475337dbe1d2c3071226ac9b1ec47028e10d075afb13dd0493419ce0f55ff995d415c348757b16ac4cc6008327fefa2d24a41376289e283e406f736d9c6be135925f6afc10a11d864bfa123312f8eb25dc4638a48461e4aa0940aa6c5db0ce581772f771ded49a133c519a8cf6ad568ce943a28e369fdedb4aa2709741b8d3267d9630723d8c8a73e1f1d29b751cb992137c92c2b8dc74cae7e41ef1fbfe746f40dc89e9ceddb4550a0694c52e5eb8dbfc34334a25ac7780657dd499ee2554cc7ed5be528d54746c74deedd44652675fa2e33fae55485e28078f26855e17f3bd"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e7ca904f31a621d6eeda5ccb184df1acdfe5ce60399f273e866b7a0744a0cf8f091eac9e0f98caed69749fc6fd81231ed641a9751b1328b17ba9e16db1374af5e789f2291d64bf737aa53d03daa77c1fb55f8f8f7cea857a6c51f380b5e4daa0a15ee34b1f10169ef302de355c6a8bfad6e041bbad82dc60cbf4018831a32555b1e06ea0623ea284ba37ccf8e3771de3d86be2d640af1f4162f87bab51a4918ddad39e9701d1927e54d4989fca4b0fbcfa4fdc4c9306cab9c53dff54a472e385d07cda081cdc008562269355fa482530df4af09f36fac9ad379e718836cd9e6ce56d86de43359ce7afc4922370695b502a5d47a4bc5bddd1fb8ee905b8b6bb670203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b19c234107a6bff5d98f5940a8f9af44ac7078a3ecb7c9257444f615bacb260e79ca80d94c85cac601b9e98e85238a63bc6d3983787841d74b2dc6f6cac0e6e6b3369e4cca21be9f373814527ffd789219023ea9d450adba417fb2f1687e8380c1a927b4ee5222db83e93b0bb7eb875a7616afa78ebdd3956bee7ee49edd76225d506c0780e46f98998f52409dc29b09be7e3958b2efecca2d676617a42676ae7db63131c082354e2a97a67dd0fd173db6d57d88e7602d3a46f07d0f707f224305fb568388ce49125072a2f8aa757da0a996d75641eacec8bda31f3119e5c915ddd2b94493c370aee3ea648ed27e0366a2d1f7526b8eb62a6b14a3e938a35a850203010001": "15f2d19060c087c8961ddec141ac93b30128a9d40670a243124b35f8b5d37db554ee8f2793b27864d2bf1f96e84df37631eb65443c383f23161943a77122e44018dc35dbd477b5a214e95923ef582544b4f4a2faab645004978a69ea40d1ab4cf611594a9e958e618c24d7c34925404e0ff979b82964deb6d866b44978df56a1683e57148ba43a3a730865225376fe2765cc1dc16aa4f8f0795eeb4e839d87220a43e871685dc8b3b1135f9dbc0eb23c4ac4172778683f343b8beb1f64d7dc617960119cc49dc91b0ef31b04478f9c452143bb40f228e592788c19cd3c60a3ab140259bef5577ca0be015af38015fba8ab940031a622e55591c68a1bc84ec449c1f64462a7960d39efdf78f9780a78118d72f7db7a4045c871291313d59b14accbaf1baccf9718dd71d6c88bdda49c39e70eb554694da8c1f74b1febf8f5f22e256b7d4858a28310fd2228ad479c31a2866c6a9708945e22bee5781b9e05d05a691b75b9c00a20ff1a17a9b6f205aeb6753726f894c687324f1e1953efde1a6e60da2e6d56c99b7ce50e6875cf7d693136d491fd54ff9e1adce308f1577da0606403353445b59cfa04d9065252b9f2d83047c6d06ad81a3dea01c29af9b1c16d280d8a5a6d98fe60b311de3cb976493aeb45d4cd379b97ee2acccb30bb554922c3428949ecffc8c79cd11c87f367e45d53ff2356814614245ad63d0d783c048da345e519e4e7a67dc4642d4223b2c86828c8a8ae9f5c1b6c12a8ac60db55e2e68d2f341bbccac81e40b4b6eddc069efda505584e8a90b9926381ae34bc8b3371d7f0383fa6d0ebbe38f4c9a10827525f216f195aa8cab081e87d120815b7cba05a1a5d94b05d5e78673d41c09b18c6eab66daba4b6b5703cb52e218624b27485e66748e91d0a57936a13f8aca43b020e3777db48ad1bc47d0fe333ac6a511850f37254c266fcf42dec5985f3a892fc512a0cc2a769c8800c88bdc1efb5eb0b986c0907e49827fd37eaced720e168922c68d35279eba4bd2b0696fc5f3bf1833d2866ee64c8d8b607dea60c44ddad0873407986d8f8adb486a468adb74a03177394a1831bd81c4f6b797f15a16861fce3aeea7af14e9de58e396b143f06279242371545d1060fa54153aa46f9340a5d06c5ce458575f59dc22bee10633975a65fadf331f53d5fd2635135525ab294d472cf1cf1909b5924b6b6078fd16820ba947e4e53efce8c9fe52ed293f89699d019eef1355dec33ec3f1329e4f06b7c3e5b6d4e82bfc6e6d71512f304ff16951a6af5441e36c75e9a77949a1253b60ef09e33740eedbbbc774eda7529976bf18f04e2be01d5e19ef0b31f110eb9d9a69ded0e3b87789257d758ff37d5169b6458dee26cab713f6acb756f25c7dd49f0a2ac97bb50ff184bd9397f5fb85e3d1c7833e92216ebbc5763b6e2839f2b005f269475b86bf322ba0a5d18ed17cc87c76b673810835ae8a2ec796c14a0cda628ddc306cfbe3843f541bbda6ab50a95d2d2d0e45d1b7a9cf99ef2d166a7b254ba11a6ce2c0165119a8be887313db9dcc520730081e3c09b4bbed01d27414be44ef49200a3e5673b4cf12bf1761b8edfe6cb52c635c0639d28f322be31df26012d66389bf97708014ee76656762bda2db37c76362c37f5a748732ec34bb25d6c75e1ea046ccde07169342fbc5c97328167080ba577d5368d18f6d9efd6407f211b3a5cd4d0492123f20410e137c17097e95bfbd00e72d26abbcc3bd52d59c2663b4f82"
          }
        },
        "encryptedSelf": "Le06illVcaEwBlpjPGd90brseUU6ALobeuDFDb3JGys=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "9af2ac37-edc3-4dde-b1eb-9362892f6167": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9c12f189-3bdf-472c-b31a-3ab4cb849d22",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b1bfe588a37ef03584af8f509502c355",
      "created": 1679924655629,
      "modified": 1679924655629,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "aixeLWyiGIliG7dvvyac24FgFmOW4HF6dksrRnVocA8swpQh+aSKxrHgoy+rXSHx",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "9f00d3b9-765a-4b3e-b171-d75336429ec7",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7ab09787d5aa57eaf476e3787bf4d5f6",
      "created": 1679920253896,
      "modified": 1679920253896,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "efc10bed@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "aA1/BBR0Rr/7Mb+jtv0Bzf/2LW0hmF5m75brm72yaqg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a04eb776-74bd-46aa-9e59-b7ce86f845d1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-906c72808d2bfe9fd9e31221b87a22ef",
      "created": 1679925842907,
      "modified": 1679925842907,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "gM6inxlSjEAWU/Fr38HqFLgJKiX86dIbkcUQhKIit5JrCtDrubt/frUk7p74fpzB",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a0788477-2774-4c46-98e7-e78ccf136be0",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-457187f744393980311f0e84fb1f87ea",
      "created": 1679928194435,
      "modified": 1679928194435,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+i5qcqomll@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bEbBjgBT+JZAKe2KnJ1RiTOTSRsu1tILhuBQPRfvzD4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a2bf8e81-0155-465c-8eef-7ef68b510daa",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4ab0a19c997a92ab9f2ef2fa30eb48e7",
      "created": 1679926554832,
      "modified": 1679926554832,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+fpou08319@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "pUfGQ5W6qBKcfNto4B7tZHMNfoim0auje5P/g/Kste4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a329e3ec-60e9-4984-aad9-b611794321e1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d684a0704e30f69ce612ea8da429f3a9",
      "created": 1679924419559,
      "modified": 1679924419559,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "+MoXjWPT05eMDPMojBdHEa7Y4sJJE5m5oEcpgb9qadg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a4740c7a-7622-476b-a2f0-7193357d8db1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d5faf489839d6bd1e75de4a9546bd872",
      "created": 1679927940082,
      "modified": 1679927940082,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "a5aa98f1@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "fWH6Skm8ghJKAtZXSo0PxEZ9ce/txeeS4TNzat0nTX0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a5de74f0-c651-487f-a132-0554640e59ae",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-c9f7233117956466fbd3be5956379f6f",
      "created": 1679925894318,
      "modified": 1679925894318,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "QvNCskumCX1lheQ3l965c1j6YnY871izd0S9miXINDQyfE3FkWI5TiG90XJqtfCu",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "a7548170-65a1-49d0-b976-29ad127a2987",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b321a1b43c300b6c766214d05cb161f7",
      "created": 1679920075952,
      "modified": 1679920075952,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "2c9b40f4@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "XzOA7ZgmsqAGGPoYU5fOU4O8K1adLebG1zAIvdE5Iw8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a8298b4a-8a42-4451-b8b6-2a2eda5448a1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-31c9a2254acfef483ad58f1eca338ab6",
      "created": 1679920282007,
      "modified": 1679920282007,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "2b53f201@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d7056418b9918bcc9789e81df55b64def12f5c23aad13d1bd06dc3054ca342b6feb5916dc3201d9416f20b60d19fa1827a23db3c91d92e9d0f3786332cae5b2934fa7e47d4bb5f942480cd1a0332584e8b60eb23840c7db5b92ddc233e9848cac3a7c992e7774d0ca14ec1aef17e98d536aa9152e22c97095a0a3e2246cb356212bbdb6e48cec8d0503e75f17090957e7d1dcdb2cdd54512aaf5969e1f1d778c216ed601bad512f3544fb1627a57f67a6ff8d923e19c38175e2997d8165fea72e978ea5a19c6eefce061461d2f22e5aec7b0c4c8093620ec9ebc5558767631cb6201da1ba7805ff253dee7eac34a93224066220b5622a50e70c7a55edca3e31d0203010001",
        "hcPartyKeys": {
          "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": [
            "6cb62a6aa33448529f763e2dcb88462f73c025cf2e99aff888fb78e139b602527c185907eaefa135becbe74260c8a39fbb39de375bd0bf8934842ea49b4ec56aad3bfcaa52ac2b9fe6151251fdf8415699802ec46d6e012bc39095eb9bf1769c01ab18c1653725be004bc579ee0f07404e3f942d9aced3fa6a53acdcb1129c77dcc3c864521f73f2e9e076e22d2926c2eb3152f8c2b141ba262a2816331c99ed3e5e4d6efebcaa86da43dce8401d2b9865602764d6c174ec9b3a4bdb1b332a8a85857f1dfd5394bea724aca879ff6c75a7b5f294ce78693f1060b5267566cce164b8d6668c2953bbe3c4070af8b5681845f762a5dff8d114da8492131b916467",
            "6cb62a6aa33448529f763e2dcb88462f73c025cf2e99aff888fb78e139b602527c185907eaefa135becbe74260c8a39fbb39de375bd0bf8934842ea49b4ec56aad3bfcaa52ac2b9fe6151251fdf8415699802ec46d6e012bc39095eb9bf1769c01ab18c1653725be004bc579ee0f07404e3f942d9aced3fa6a53acdcb1129c77dcc3c864521f73f2e9e076e22d2926c2eb3152f8c2b141ba262a2816331c99ed3e5e4d6efebcaa86da43dce8401d2b9865602764d6c174ec9b3a4bdb1b332a8a85857f1dfd5394bea724aca879ff6c75a7b5f294ce78693f1060b5267566cce164b8d6668c2953bbe3c4070af8b5681845f762a5dff8d114da8492131b916467"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "2d1dd6e64cc5b7b67f0a48601ffd63d6bfa4732522f1d3018fca074d7f4b579b3bc39d88a5144918c3d3b83ed375dabfd4d4343c01f80e7a808995ae292ae274e5918d3fda42421cdd0c8b75d0b45f2ed2db61dfc081379031922524f4ba4de3f36de7dc6c983d3ff291d4cffd9dd22eb3fef736796a3ed943689163628fa5c1ef04f83f5c9094e9a803c65c89d424f8db78e2b76928db00aabe965abe1cc01b4398277e352014139f351e56ddd85380296fbbb7fcfa9a361e91846440ad753ba48dbffcc97c608e6febf6011a71c12010fc3a2ad2fb2cd17cdf043fe7a0634fa991379086b9c1fa55176fe6ab2c2b997b4ad2d39a4c3d5206c979653fcbadd3",
            "4db34c1edb2f1b25ded836cde38815a86cfede7e894b913f0adfbca89ec283d73558e6a2baa836d7cb44bb863313cc1d9d25eef4483e70384b78531c1afab6fb143ddff602f088f1774ebe8ec5acc3355c123e183abbe1b283b4a0ec0df6007ae959b92ac5738972c7132b5d25e5a880a71a4e061953a4dc42f7b45cf023d1debadbdd8e475f75cc918ace1559c042891d9fd7964c6c28c7ed2147daa87ecf020624021a79cf3b39dc4e1c55ed378fe03529c38f1f74e95e0b04e470b15dd0b25648cf9ca543d826f62fc1d46d71ae73390ad0496e3c1d066339e8ca2ccecb750d2854111b7874483394ae924e566c16a53da123751d7c3ef8f335335399c2ea"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d7056418b9918bcc9789e81df55b64def12f5c23aad13d1bd06dc3054ca342b6feb5916dc3201d9416f20b60d19fa1827a23db3c91d92e9d0f3786332cae5b2934fa7e47d4bb5f942480cd1a0332584e8b60eb23840c7db5b92ddc233e9848cac3a7c992e7774d0ca14ec1aef17e98d536aa9152e22c97095a0a3e2246cb356212bbdb6e48cec8d0503e75f17090957e7d1dcdb2cdd54512aaf5969e1f1d778c216ed601bad512f3544fb1627a57f67a6ff8d923e19c38175e2997d8165fea72e978ea5a19c6eefce061461d2f22e5aec7b0c4c8093620ec9ebc5558767631cb6201da1ba7805ff253dee7eac34a93224066220b5622a50e70c7a55edca3e31d0203010001": {
            "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {
              "22a50e70c7a55edca3e31d0203010001": "6cb62a6aa33448529f763e2dcb88462f73c025cf2e99aff888fb78e139b602527c185907eaefa135becbe74260c8a39fbb39de375bd0bf8934842ea49b4ec56aad3bfcaa52ac2b9fe6151251fdf8415699802ec46d6e012bc39095eb9bf1769c01ab18c1653725be004bc579ee0f07404e3f942d9aced3fa6a53acdcb1129c77dcc3c864521f73f2e9e076e22d2926c2eb3152f8c2b141ba262a2816331c99ed3e5e4d6efebcaa86da43dce8401d2b9865602764d6c174ec9b3a4bdb1b332a8a85857f1dfd5394bea724aca879ff6c75a7b5f294ce78693f1060b5267566cce164b8d6668c2953bbe3c4070af8b5681845f762a5dff8d114da8492131b916467"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "22a50e70c7a55edca3e31d0203010001": "2d1dd6e64cc5b7b67f0a48601ffd63d6bfa4732522f1d3018fca074d7f4b579b3bc39d88a5144918c3d3b83ed375dabfd4d4343c01f80e7a808995ae292ae274e5918d3fda42421cdd0c8b75d0b45f2ed2db61dfc081379031922524f4ba4de3f36de7dc6c983d3ff291d4cffd9dd22eb3fef736796a3ed943689163628fa5c1ef04f83f5c9094e9a803c65c89d424f8db78e2b76928db00aabe965abe1cc01b4398277e352014139f351e56ddd85380296fbbb7fcfa9a361e91846440ad753ba48dbffcc97c608e6febf6011a71c12010fc3a2ad2fb2cd17cdf043fe7a0634fa991379086b9c1fa55176fe6ab2c2b997b4ad2d39a4c3d5206c979653fcbadd3",
              "223f55731820b91ccd18010203010001": "4db34c1edb2f1b25ded836cde38815a86cfede7e894b913f0adfbca89ec283d73558e6a2baa836d7cb44bb863313cc1d9d25eef4483e70384b78531c1afab6fb143ddff602f088f1774ebe8ec5acc3355c123e183abbe1b283b4a0ec0df6007ae959b92ac5738972c7132b5d25e5a880a71a4e061953a4dc42f7b45cf023d1debadbdd8e475f75cc918ace1559c042891d9fd7964c6c28c7ed2147daa87ecf020624021a79cf3b39dc4e1c55ed378fe03529c38f1f74e95e0b04e470b15dd0b25648cf9ca543d826f62fc1d46d71ae73390ad0496e3c1d066339e8ca2ccecb750d2854111b7874483394ae924e566c16a53da123751d7c3ef8f335335399c2ea"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "btwyo5vKo8jxhOPAyZvB7TycMcJ554DqpxQzJqEQteY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "a8298b4a-8a42-4451-b8b6-2a2eda5448a1": {}
        }
      }
    },
    {
      "id": "a920ea49-1390-4b72-977c-5a4890b9f1fc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-8a8c777e02d41a27ea024f0ac253b925",
      "created": 1679924371433,
      "modified": 1679924371433,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "8b2442d8@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1770533724d4b648f8b32842fffdd2a672d7f860b6577a6b0735819e14c31fca3efcc4293bec4c555274d4a81d6ad4de88f5803c1593e15e4e6ebdf0400ba1331cc1ec0ee264a438a5fe9f80a7d25817714a1a42f3133263f1b991dfa5b3c89cda37cda03a792d854435c7697129e1f13039bd88254947be522b7abb6b1b0e4f608a145109f86a9b41a95bc31574af36c58f247250e922b0e66a057c894b347cfc263a68b3ce33a37e170e9a71636d6b18d4b295c38ae85193aa0b4138b4a6618799f47a5affb59dc0707b00051e19cf15d4eef5d18478f63e06d883c631c7c9737fe37c58caf01d213f00b7a4f0dc9b7354ed4c3c6865a970bbdfda6c62ebd0203010001",
        "hcPartyKeys": {
          "a920ea49-1390-4b72-977c-5a4890b9f1fc": [
            "b1b4496761d65a7da1898e53b247abcf997a54011d332deed85d21c2cedeff579d54dd1d127eece9a7cd7d400cc0e729d36569130881473c39a7a035f281a2e5c5d67edef0de4b4f2bef71943afcc649fc69a323af5bf66ef9f3055bdc0fd6a2d147d740b9f67b5246834faf5b541a6ae610cf48b7dafca6f0144bc080aaea1d6e0553ab3a8500e633f1306fe0a703408d090ee88d28c76a6f0e0b3ea7f0f3696bd1d35097171048bf03693405776c8ac1f79cf031e90c8d0d8bb52ed716a4ee01636e42ddfb3ccc12b6982af776915791e78fc37df82105cd57065140dfdd42d0d710dbe0ee23e55b9395f3f0bddb8e85890d5b6a7483690ca1a7e490edc976",
            "b1b4496761d65a7da1898e53b247abcf997a54011d332deed85d21c2cedeff579d54dd1d127eece9a7cd7d400cc0e729d36569130881473c39a7a035f281a2e5c5d67edef0de4b4f2bef71943afcc649fc69a323af5bf66ef9f3055bdc0fd6a2d147d740b9f67b5246834faf5b541a6ae610cf48b7dafca6f0144bc080aaea1d6e0553ab3a8500e633f1306fe0a703408d090ee88d28c76a6f0e0b3ea7f0f3696bd1d35097171048bf03693405776c8ac1f79cf031e90c8d0d8bb52ed716a4ee01636e42ddfb3ccc12b6982af776915791e78fc37df82105cd57065140dfdd42d0d710dbe0ee23e55b9395f3f0bddb8e85890d5b6a7483690ca1a7e490edc976"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "673b9ca0ac6468a35328385c07aaf6ed45072bb51b4d77a890425c6b63b52658aad22c4b38408dbfc2ac519f3368afcc4e347840705843a375c9d6317cb84e93ffb2c58ae4c02a31868a4b7fc64db3ce736ed16afffd47ae6d4b4353eaeddf04f15d263c2abdfa68b3fdbfa3e2b89eccef62205b1a773943e881a17fe3bcad0b6cc941b8cf41d0bb9e4b1de98111233f2916366c7d7ceb9b3c3abf74a448bf3737a85afc9e67014ded4dadb8b2907a68acb176e442bdee69230fcb117f0cd1dc489dcdfc695fdcab97a4afdbcec589c48f0e25e3ab49c0ac2fe17ebdf527c60b7c4115f8fbcdd6a1fbc4d3a5fa5046ee6e23a74390e53288d89056d8bed23fd4",
            "c92cda35f21a62d2e8e2548336a143b9b73465ca10321bbb6fd2a0eb7c094fbb55828e15b9728d10209d5498afb4537b6c328f152a071aeeb88bab7188903d539d94b018c255a17cc98e23441cf70fbf3f87f4b2f5379d95dd99d64c92595d9956eea5b544177644de945796671965a884fb19054475d119004a6492f720d0fc1c5777bb678a45d0897ec9dea9307808d468554b3daa329cdf0658f168cff7b1b31e7fbfafc912dab5aa176d23421f2bcf4a47ed6d07610c061e6129464bee5f16f3bc7c4a9ff3f5e75053c100eb438f87bb79fd16068d454b838164f53e32fe9e46f903d7d03505d945c6221e1b3902b76c64cebecae8e852f0417a5f6e99a5"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1770533724d4b648f8b32842fffdd2a672d7f860b6577a6b0735819e14c31fca3efcc4293bec4c555274d4a81d6ad4de88f5803c1593e15e4e6ebdf0400ba1331cc1ec0ee264a438a5fe9f80a7d25817714a1a42f3133263f1b991dfa5b3c89cda37cda03a792d854435c7697129e1f13039bd88254947be522b7abb6b1b0e4f608a145109f86a9b41a95bc31574af36c58f247250e922b0e66a057c894b347cfc263a68b3ce33a37e170e9a71636d6b18d4b295c38ae85193aa0b4138b4a6618799f47a5affb59dc0707b00051e19cf15d4eef5d18478f63e06d883c631c7c9737fe37c58caf01d213f00b7a4f0dc9b7354ed4c3c6865a970bbdfda6c62ebd0203010001": {
            "a920ea49-1390-4b72-977c-5a4890b9f1fc": {
              "c6865a970bbdfda6c62ebd0203010001": "b1b4496761d65a7da1898e53b247abcf997a54011d332deed85d21c2cedeff579d54dd1d127eece9a7cd7d400cc0e729d36569130881473c39a7a035f281a2e5c5d67edef0de4b4f2bef71943afcc649fc69a323af5bf66ef9f3055bdc0fd6a2d147d740b9f67b5246834faf5b541a6ae610cf48b7dafca6f0144bc080aaea1d6e0553ab3a8500e633f1306fe0a703408d090ee88d28c76a6f0e0b3ea7f0f3696bd1d35097171048bf03693405776c8ac1f79cf031e90c8d0d8bb52ed716a4ee01636e42ddfb3ccc12b6982af776915791e78fc37df82105cd57065140dfdd42d0d710dbe0ee23e55b9395f3f0bddb8e85890d5b6a7483690ca1a7e490edc976"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "c6865a970bbdfda6c62ebd0203010001": "673b9ca0ac6468a35328385c07aaf6ed45072bb51b4d77a890425c6b63b52658aad22c4b38408dbfc2ac519f3368afcc4e347840705843a375c9d6317cb84e93ffb2c58ae4c02a31868a4b7fc64db3ce736ed16afffd47ae6d4b4353eaeddf04f15d263c2abdfa68b3fdbfa3e2b89eccef62205b1a773943e881a17fe3bcad0b6cc941b8cf41d0bb9e4b1de98111233f2916366c7d7ceb9b3c3abf74a448bf3737a85afc9e67014ded4dadb8b2907a68acb176e442bdee69230fcb117f0cd1dc489dcdfc695fdcab97a4afdbcec589c48f0e25e3ab49c0ac2fe17ebdf527c60b7c4115f8fbcdd6a1fbc4d3a5fa5046ee6e23a74390e53288d89056d8bed23fd4",
              "223f55731820b91ccd18010203010001": "c92cda35f21a62d2e8e2548336a143b9b73465ca10321bbb6fd2a0eb7c094fbb55828e15b9728d10209d5498afb4537b6c328f152a071aeeb88bab7188903d539d94b018c255a17cc98e23441cf70fbf3f87f4b2f5379d95dd99d64c92595d9956eea5b544177644de945796671965a884fb19054475d119004a6492f720d0fc1c5777bb678a45d0897ec9dea9307808d468554b3daa329cdf0658f168cff7b1b31e7fbfafc912dab5aa176d23421f2bcf4a47ed6d07610c061e6129464bee5f16f3bc7c4a9ff3f5e75053c100eb438f87bb79fd16068d454b838164f53e32fe9e46f903d7d03505d945c6221e1b3902b76c64cebecae8e852f0417a5f6e99a5"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "ScqYNbtRcFv18EKPL3Wo0DhnlTkqj+iPHLPeD1WyzH8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "a920ea49-1390-4b72-977c-5a4890b9f1fc": {}
        }
      }
    },
    {
      "id": "a9d5e13f-cca1-4696-b485-7b7cb1671e24",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-da64079938bbc1e49c9ea13028016034",
      "created": 1679925890323,
      "modified": 1679925890323,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bXGDNQx4vvx3KvSSRqhgBB3AZrAjpvqyRaYl/DbONd4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "aa2c8fa9-0bb9-4a65-bc22-3cba0647dd9c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-73a902e0979da97e7406a9b0d8c58904",
      "created": 1679926863817,
      "modified": 1679926863817,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "57f9b172@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "JGe17QPZwqtnUjV8CHmggszaozChtMdcpLupRlH6qpE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "aa6acadd-9593-4ad3-9ca2-daa5ca37cb26",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5f0b3be8545911fc6cb45e7fe9995b8d",
      "created": 1679920293302,
      "modified": 1679920293302,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "E0KdYYrmz+iGzZkVt8NzfGygr4CCWzKuRUdwGDd99nWjA0cQ8h8Rk9PI1mxEokJJ",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "aaa9a475-8625-4667-a17d-ec284dd2becb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-8e6b923767809fb5505d3dcb91d49117",
      "created": 1679924686577,
      "modified": 1679924686577,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iIE8abXaaL2QmaHkGRFYW0BDJhwM1a27Xy8Yq9kGAtG+hNij2jdU5TgUhsP7ej/Q",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ab456690-52c8-4a7e-a99e-29d580bbcb62",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-69a8d58922a06e5222c957a3fba9e4d8",
      "created": 1679926542348,
      "modified": 1679926542348,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "aWNNwX/dM58KoNT3U6PIP8VVtJ7Mi2cioqSY0zHCFUswM09qvE49yoNgiuInFOlX",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ac933532-b26b-4a19-b6e9-ead6b3043e6e",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-8512139a54101c80f3b482fe5c309c01",
      "created": 1679925822755,
      "modified": 1679925822755,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "7d487bd5@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ae2afdd26aa96d9f836f04fcdb1d7227b03b42ecc1bad63cab640bd97e5a29b57c965d7c5fed982adbaeabdcc600c1d97cba1653a390ec128d85fca82aa0ea8a1e7a935459f0fe6f92f76a6d7e072b1d667cd6a9f36de81076fa8b0739307abe7bfc250de2ef36faaff7c8741bf1cbc38534beddb1864f6285fd98bbce11833dcc664008a1bb39edc992398c0cffbf1c6c9511fd59f2da57893ee27a86fbcab224c068c4478399babe7caefaebea74d6b55183d1190e1341fa35b5e62dbef9553504fa495d760c0156efd0a97683b94a655c55fdb077528db279080f2ef281598bbbc10d10472f966c50eef5f1a99b7f4430fdbe65397622daae71a4b0329e990203010001",
        "hcPartyKeys": {
          "ac933532-b26b-4a19-b6e9-ead6b3043e6e": [
            "03f12ba199496cdcfdcc4ed35d32db0eef1f5dd3ace164406afed00626cd279e10f912186adadb4fb69947953fa11eaf13e9547b3769d13fcdbe4eabeb05f0c3f3ee846d4ece29002ae58b1d229099cfd16d62896a0250c5332ffe3f6d4f6b657447deb0c49173ca5952b5fd95f7bed388c8915025d6f0e0a45c66c2041bbc933a086459a4fe08aa8f4c44e578d4aa993eb3ef5c36215443c02e6462af3cc7c387e7368972a0430c40ef92d6119036ffd64fa391d0140350b44d1d191b27b8f8b8ea1e41046ed9a150208f8a4acc27b72d1ac46a9a9d2913b779c75cd2aac1f8798c5a2009108ea311907a744b216263e71432f90e3d26b992ecd74349dbf59d",
            "03f12ba199496cdcfdcc4ed35d32db0eef1f5dd3ace164406afed00626cd279e10f912186adadb4fb69947953fa11eaf13e9547b3769d13fcdbe4eabeb05f0c3f3ee846d4ece29002ae58b1d229099cfd16d62896a0250c5332ffe3f6d4f6b657447deb0c49173ca5952b5fd95f7bed388c8915025d6f0e0a45c66c2041bbc933a086459a4fe08aa8f4c44e578d4aa993eb3ef5c36215443c02e6462af3cc7c387e7368972a0430c40ef92d6119036ffd64fa391d0140350b44d1d191b27b8f8b8ea1e41046ed9a150208f8a4acc27b72d1ac46a9a9d2913b779c75cd2aac1f8798c5a2009108ea311907a744b216263e71432f90e3d26b992ecd74349dbf59d"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "146013cfc12937b5c8ccd5500954a41767e14c422c980e3d1b77b5c7504928032c1ef392b2d77770d5e441a9bf74d4f2e10b8a04b7b1d4bffabd64b575a0cad61436036c86182d885938028ae24ab96c0064c9d185364a335cd22d8f8081bf77d2b2dd708953cbf85d677713608a58d2134b820afd3be6b85798096f2d67c7c070c630a72ad79ecafedd57675477c5668c313dfdd8ef20e9c86d0ce6ab6f62b2a31fe5fe9ad8dea8d78938af23b596ca699fcdb2e161d13810cc24ac55d8eead15d37cf8db0ca51d0d9e5b5bc16fc7846b8a5de6f16843ffcd5526fd2c15b803d2668ef8ba99cceb9c2e1a6d6be51a7c2fac2a6242344dfd136b294247d253de",
            "3b3a76678f80d4b498dc6901653b02003d64c621fa632d2500da79bd50ad924a34bf8167f2b6377adcd07dc6bf95607b58c82d3f8497e23de5c3ab0b7d4a34cb7cc075d48c82d14920da4877fa914929de23ef776c0e10bed1924c4017fc67b2c385a972b8dfccfc2d5068bbf68ed777600aab809914e384e716fbea27737de8e172f05524c6720b61d9f079a932f5d96fb68903d478e1190046b7cbd4aba9730303a0681acf029cb25a28ea28351d4139fe6fa133bfb47caef37b3b122ea22e48e7bdccddaec978b4272e8cf94fb6d304f34a3599823809e2db1b93600081895c9c84b6858d27e2617b23a77de18fc50c93fcc7a64bd682131db50050097b26"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ae2afdd26aa96d9f836f04fcdb1d7227b03b42ecc1bad63cab640bd97e5a29b57c965d7c5fed982adbaeabdcc600c1d97cba1653a390ec128d85fca82aa0ea8a1e7a935459f0fe6f92f76a6d7e072b1d667cd6a9f36de81076fa8b0739307abe7bfc250de2ef36faaff7c8741bf1cbc38534beddb1864f6285fd98bbce11833dcc664008a1bb39edc992398c0cffbf1c6c9511fd59f2da57893ee27a86fbcab224c068c4478399babe7caefaebea74d6b55183d1190e1341fa35b5e62dbef9553504fa495d760c0156efd0a97683b94a655c55fdb077528db279080f2ef281598bbbc10d10472f966c50eef5f1a99b7f4430fdbe65397622daae71a4b0329e990203010001": {
            "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {
              "397622daae71a4b0329e990203010001": "03f12ba199496cdcfdcc4ed35d32db0eef1f5dd3ace164406afed00626cd279e10f912186adadb4fb69947953fa11eaf13e9547b3769d13fcdbe4eabeb05f0c3f3ee846d4ece29002ae58b1d229099cfd16d62896a0250c5332ffe3f6d4f6b657447deb0c49173ca5952b5fd95f7bed388c8915025d6f0e0a45c66c2041bbc933a086459a4fe08aa8f4c44e578d4aa993eb3ef5c36215443c02e6462af3cc7c387e7368972a0430c40ef92d6119036ffd64fa391d0140350b44d1d191b27b8f8b8ea1e41046ed9a150208f8a4acc27b72d1ac46a9a9d2913b779c75cd2aac1f8798c5a2009108ea311907a744b216263e71432f90e3d26b992ecd74349dbf59d"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "397622daae71a4b0329e990203010001": "146013cfc12937b5c8ccd5500954a41767e14c422c980e3d1b77b5c7504928032c1ef392b2d77770d5e441a9bf74d4f2e10b8a04b7b1d4bffabd64b575a0cad61436036c86182d885938028ae24ab96c0064c9d185364a335cd22d8f8081bf77d2b2dd708953cbf85d677713608a58d2134b820afd3be6b85798096f2d67c7c070c630a72ad79ecafedd57675477c5668c313dfdd8ef20e9c86d0ce6ab6f62b2a31fe5fe9ad8dea8d78938af23b596ca699fcdb2e161d13810cc24ac55d8eead15d37cf8db0ca51d0d9e5b5bc16fc7846b8a5de6f16843ffcd5526fd2c15b803d2668ef8ba99cceb9c2e1a6d6be51a7c2fac2a6242344dfd136b294247d253de",
              "223f55731820b91ccd18010203010001": "3b3a76678f80d4b498dc6901653b02003d64c621fa632d2500da79bd50ad924a34bf8167f2b6377adcd07dc6bf95607b58c82d3f8497e23de5c3ab0b7d4a34cb7cc075d48c82d14920da4877fa914929de23ef776c0e10bed1924c4017fc67b2c385a972b8dfccfc2d5068bbf68ed777600aab809914e384e716fbea27737de8e172f05524c6720b61d9f079a932f5d96fb68903d478e1190046b7cbd4aba9730303a0681acf029cb25a28ea28351d4139fe6fa133bfb47caef37b3b122ea22e48e7bdccddaec978b4272e8cf94fb6d304f34a3599823809e2db1b93600081895c9c84b6858d27e2617b23a77de18fc50c93fcc7a64bd682131db50050097b26"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "ZkJ6JAUbfuyp1X+Ui4KQZ194zy5tLC4aeauWQWgGBio=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "ac933532-b26b-4a19-b6e9-ead6b3043e6e": {}
        }
      }
    },
    {
      "id": "ad680a90-5e32-4724-988c-18eda5305062",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e8e94b5f66503782d5b99751104e3c2c",
      "created": 1679926526285,
      "modified": 1679926526285,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "rKPRBUTplILD0pUoACEkexM99RrvUmZAvKtJ2w4pf1qknuw9bnwPsVugCW2YYrja",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "af44b903-8ccf-453b-a6e1-b9c843b1ac58",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cf5b360d6cb424ba249c71ee574ff812",
      "created": 1679924367037,
      "modified": 1679924367037,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Dp5QzE30BYvqZjghcFDf5/R06PHlzWRMVvbHq6KD03RMuZK7ejMQb9VtMqGWP7/3",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "af7b724a-0a67-4726-975d-bda46f524e52",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-bed1fc931f2511457b1ca23e87247ea9",
      "created": 1679924631956,
      "modified": 1679924631956,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "952f6e3e@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100daa89900f519319167f5e8d4a0ac8741a33af531d5f929fe8397fa36ab1ee114f33828aedd4789a6b969189334904422326961b65acbcd7a559a4651be66016da053816958fbdc0dd2fe112db0221f3cbc04c5b118ca0745e664a3a867eabab9656f12990823f078e11b6b67bc06b6017ea0136ae87f8f79f1e4a07e55814db33beb1e5b2cb7a6136bb9ad2a55fba41f82875c7e2b9141284a2b8f7594721186544561544869d70786baef35167e86a4e1be2b7935f8d8cba7ae7b6137acae5c7cc3fb3b6a686bbd227dc3820c0c5e1221aea79ba3f51d821f5f4c37590c7a78ad0d93bfe39205201683ae4f3b4e5671ef1514ce08268a66a98521c8748e95cd0203010001",
        "hcPartyKeys": {
          "af7b724a-0a67-4726-975d-bda46f524e52": [
            "1ef3d3e74c50c60da50753e2e1575322efb8c06d77439d32d676f4cc844fb8250d34501ba75debbbc3ece02f49753fe967ce6f15e87f940d5d51a4d26a758ea0ad62f86fc029b85e2480c48e2aed31d85e19c5389b68f4e96e9232112536da22d97df48469b11b6cf07dfac8b0b5107b63db04c88a8d58fd29b5390aac7973fd633f15f1609b09dcdb067d8c83aec39982225e6d7399ecdcfaf67d0f459675f54185f24473903a66e475883a649af3e675c5a803232f7c041e8160422f99fd87ac8cf78451c7a44069d37ce43926957293091f6ee735c27f6cbd64d0e77a4e18e24564f40e8ce54eff545d58100b4c7adf2e5a4eec9b1dc33f319c6d2110658b",
            "1ef3d3e74c50c60da50753e2e1575322efb8c06d77439d32d676f4cc844fb8250d34501ba75debbbc3ece02f49753fe967ce6f15e87f940d5d51a4d26a758ea0ad62f86fc029b85e2480c48e2aed31d85e19c5389b68f4e96e9232112536da22d97df48469b11b6cf07dfac8b0b5107b63db04c88a8d58fd29b5390aac7973fd633f15f1609b09dcdb067d8c83aec39982225e6d7399ecdcfaf67d0f459675f54185f24473903a66e475883a649af3e675c5a803232f7c041e8160422f99fd87ac8cf78451c7a44069d37ce43926957293091f6ee735c27f6cbd64d0e77a4e18e24564f40e8ce54eff545d58100b4c7adf2e5a4eec9b1dc33f319c6d2110658b"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "5780c7090c9616251fa5415b09bff58e0f695bb057c39b242162e9fae1a83b884a2641f4f06cd307bcf22d7acc2b7f731ed1bc8ba0afdc4e9da35f1677fadfde149e6a764f3ebdd03a4e16544dccb83cd5f43992c645f9ace29f309e66a6143b81187b969cc56315c6068f3786d9b048aeb84fdf9532b01481fb2c58fcc67a04e3c717b8d651d005033129bf15abd84a5366923622282ebf4eb9f89107866dd0273c6e51ad087980c66fe7bfd923fed8ac1678bcbd083028fda3718850f8721d85940b12979d28c20379ebe20f763a6828b190ef7973e2f5ed017f94b4b97989e19fa570ddb18c95404f5f119346c6379e37c8bf42ae5a2dc88fcd737a32a09f",
            "7cb6a0bcd81e36d0df6b4d4a27b74d16ac92a7fb6697ca29974639ab7eaa9f5fbd8c2de863ad59396b6d67daf85d615282271527e48dfc0a54f2d769db31a50dc5a8ea89fefe4bf4432c80786adb565032f8f58c7b3be50dee4d7fab5d8c48886e14e2505ba1b45aa3645b82e8288a02d3448e65c04598b2a6eca4ed706bfaf4dbf5bad3a4abd52d88e7f8ca5fb956d03161846ed0a4b1d9809de91ccf2efbe984d1212a5efebbb1b7d1550a8990ed26bffb1852a45ff17539dda9b940fb1a7e862798ce3d9e670e17eafa2b7e1baa527289b0d09bca91572738a6d31290bf86abb059d17e54284f440911119d38fa56390e1087998ed8d1d5d31d4b629e3f91"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100daa89900f519319167f5e8d4a0ac8741a33af531d5f929fe8397fa36ab1ee114f33828aedd4789a6b969189334904422326961b65acbcd7a559a4651be66016da053816958fbdc0dd2fe112db0221f3cbc04c5b118ca0745e664a3a867eabab9656f12990823f078e11b6b67bc06b6017ea0136ae87f8f79f1e4a07e55814db33beb1e5b2cb7a6136bb9ad2a55fba41f82875c7e2b9141284a2b8f7594721186544561544869d70786baef35167e86a4e1be2b7935f8d8cba7ae7b6137acae5c7cc3fb3b6a686bbd227dc3820c0c5e1221aea79ba3f51d821f5f4c37590c7a78ad0d93bfe39205201683ae4f3b4e5671ef1514ce08268a66a98521c8748e95cd0203010001": {
            "af7b724a-0a67-4726-975d-bda46f524e52": {
              "268a66a98521c8748e95cd0203010001": "1ef3d3e74c50c60da50753e2e1575322efb8c06d77439d32d676f4cc844fb8250d34501ba75debbbc3ece02f49753fe967ce6f15e87f940d5d51a4d26a758ea0ad62f86fc029b85e2480c48e2aed31d85e19c5389b68f4e96e9232112536da22d97df48469b11b6cf07dfac8b0b5107b63db04c88a8d58fd29b5390aac7973fd633f15f1609b09dcdb067d8c83aec39982225e6d7399ecdcfaf67d0f459675f54185f24473903a66e475883a649af3e675c5a803232f7c041e8160422f99fd87ac8cf78451c7a44069d37ce43926957293091f6ee735c27f6cbd64d0e77a4e18e24564f40e8ce54eff545d58100b4c7adf2e5a4eec9b1dc33f319c6d2110658b"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "268a66a98521c8748e95cd0203010001": "5780c7090c9616251fa5415b09bff58e0f695bb057c39b242162e9fae1a83b884a2641f4f06cd307bcf22d7acc2b7f731ed1bc8ba0afdc4e9da35f1677fadfde149e6a764f3ebdd03a4e16544dccb83cd5f43992c645f9ace29f309e66a6143b81187b969cc56315c6068f3786d9b048aeb84fdf9532b01481fb2c58fcc67a04e3c717b8d651d005033129bf15abd84a5366923622282ebf4eb9f89107866dd0273c6e51ad087980c66fe7bfd923fed8ac1678bcbd083028fda3718850f8721d85940b12979d28c20379ebe20f763a6828b190ef7973e2f5ed017f94b4b97989e19fa570ddb18c95404f5f119346c6379e37c8bf42ae5a2dc88fcd737a32a09f",
              "223f55731820b91ccd18010203010001": "7cb6a0bcd81e36d0df6b4d4a27b74d16ac92a7fb6697ca29974639ab7eaa9f5fbd8c2de863ad59396b6d67daf85d615282271527e48dfc0a54f2d769db31a50dc5a8ea89fefe4bf4432c80786adb565032f8f58c7b3be50dee4d7fab5d8c48886e14e2505ba1b45aa3645b82e8288a02d3448e65c04598b2a6eca4ed706bfaf4dbf5bad3a4abd52d88e7f8ca5fb956d03161846ed0a4b1d9809de91ccf2efbe984d1212a5efebbb1b7d1550a8990ed26bffb1852a45ff17539dda9b940fb1a7e862798ce3d9e670e17eafa2b7e1baa527289b0d09bca91572738a6d31290bf86abb059d17e54284f440911119d38fa56390e1087998ed8d1d5d31d4b629e3f91"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "268LuKphxh30W7Tk5oviQr4sZyfocEoPfSNtdoBn5aU=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "af7b724a-0a67-4726-975d-bda46f524e52": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "af7b724a-0a67-4726-975d-bda46f524e52": {}
        }
      }
    },
    {
      "id": "b1c12a90-ef92-4b38-946a-6f9144a6bc16",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e0bcca035e5370e21e4556d7796b4bd1",
      "created": 1679929399444,
      "modified": 1679929399444,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1CgQ7iJogUVw0gzNW4yi7BEW9y6/UKnpuuQlDZk4HLz/DjZiWqcZV3zR4omr63Dt",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-a470a9d8c654eb430f0fd1d9dcd3d375",
      "created": 1679923752102,
      "modified": 1679923752102,
      "author": "804c058a-5877-4424-8bed-4eba5300655f",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "ptiaizrls-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ca23de6907555319b6e8397479c9d749cc345b1e31fcdda52a0cac94f315b18aabf013e6974c42240783c6c2cee4c4a0b8ea0a35b07d99cebada41e44efd73cb4dd2844166459954ab22a7175fbdf735d7f31b722b33a3dfb9929985fbd1531a037b93bf76a6e2708a6cf1807339615bc9746958e2519fdace9bbf6d76d10cfb7b2f24cef382eb1a0438fdc3ddb8dd551ea5193cb14889a7071d9d5b1bd481d5be611de8be91dc71338c8896b9c979a8f52ba98c298c4c9bbd6491b0bb950a9195382ea6e90e4e517d677ff791b13bec3713126cb4b8162a5aac596e7e414f5c5aa4e0c77fb40a021b8ba6529e388909105c9d4cee49de524320449413dc72090203010001",
        "hcPartyKeys": {
          "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": [
            "348fceda4e6dab2dad2adf4a5aa801d269a9a00ba328cb1eb09a5cc833aa525c5b1928706f8c5d4539bf0ed5f7979544c10ebf20b24b0a3248e62edee3afd4d7d9492246d254115f7925f393518d4ae7606e7a43baac48c8fdfbdcc00f11d0d21881f4397fc3af1145f92218169395b2a0395fbc213070bf9bc12bd7943d1dcf1c145f6661d6fe62c16034b3b2586cbc2978f9e79a3b4769d0419806e158be1c286f0bb513721ccbff8d6057e73ebed3e42f1c9f6beb55033ac20116da44926257ede6105bced789a62ce8fb598b8695065c0c38e7d4ac10c6a19885ab8afd77a334f2b33cfcfb6f51e874861fe92e36a13b073ca85dc83d363a2420b23c90fb",
            "348fceda4e6dab2dad2adf4a5aa801d269a9a00ba328cb1eb09a5cc833aa525c5b1928706f8c5d4539bf0ed5f7979544c10ebf20b24b0a3248e62edee3afd4d7d9492246d254115f7925f393518d4ae7606e7a43baac48c8fdfbdcc00f11d0d21881f4397fc3af1145f92218169395b2a0395fbc213070bf9bc12bd7943d1dcf1c145f6661d6fe62c16034b3b2586cbc2978f9e79a3b4769d0419806e158be1c286f0bb513721ccbff8d6057e73ebed3e42f1c9f6beb55033ac20116da44926257ede6105bced789a62ce8fb598b8695065c0c38e7d4ac10c6a19885ab8afd77a334f2b33cfcfb6f51e874861fe92e36a13b073ca85dc83d363a2420b23c90fb"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "6fd536044d033a69683d4f2563dd39ff557e8cbdaebbcdf1b99bc563a8fd7805b48914e4fa23b0f3ccdff11606b272e05a318842142ddc0677f7739fe2b34bd1d1177e114943b16a69452b8b8b3aefa2cbdff525b38581b68e4f34548b93ddb04730032bc38eb273f8f8568ea4fbe4dce9f43dafd63b984747f950baa58890af1b97b632eeb4ba55f3e6c48440db0198797502e7efe7612a2682b48eafe3de92fbfd5dc55975cd27beb3fa86cf24b0729d8d8555e171df6d87dd8b034814cadbf031bf1f70c5365f5dc15c553911ace269e75a8d751390f7c8aa4193aa2cb88c1e36409e61bb0476df6ac812b8df5814cf5d0002e663bc5f2e9d286f327edfc9",
            "0854f2ba0bab7519ba2593f1d072fe99da6eebea1a17f7d448d9135361329fb18469f1346da2fcb91e210103c3c2836d742e9dc98df238ca59ef863379cb223416c5d4b21b38c31b50082a761c64904be0b28a47b4c86794b662c6bf6977269b1d58bbfb13c5dac83c0e86e771abcbc3e3dfeefc9016d9177b256328b3d8a892900533b01112659e5129ab35c4ab4b46c11ffe5e04e55576742b9d9bd038f9ba99dbaccc3060fb372f4825a805e0d52947f903484f9c205f75373f577fb604b77ecdd098f1dd7a6171281b6b651fd3d8aedd0fc63fab4a078a1cd519f45151eb99572511f62cfec1fd9ea9bdd2d897d0f90722bbb3ecd447a3d24164ea3b638b"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ca23de6907555319b6e8397479c9d749cc345b1e31fcdda52a0cac94f315b18aabf013e6974c42240783c6c2cee4c4a0b8ea0a35b07d99cebada41e44efd73cb4dd2844166459954ab22a7175fbdf735d7f31b722b33a3dfb9929985fbd1531a037b93bf76a6e2708a6cf1807339615bc9746958e2519fdace9bbf6d76d10cfb7b2f24cef382eb1a0438fdc3ddb8dd551ea5193cb14889a7071d9d5b1bd481d5be611de8be91dc71338c8896b9c979a8f52ba98c298c4c9bbd6491b0bb950a9195382ea6e90e4e517d677ff791b13bec3713126cb4b8162a5aac596e7e414f5c5aa4e0c77fb40a021b8ba6529e388909105c9d4cee49de524320449413dc72090203010001": {
            "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {
              "49de524320449413dc72090203010001": "348fceda4e6dab2dad2adf4a5aa801d269a9a00ba328cb1eb09a5cc833aa525c5b1928706f8c5d4539bf0ed5f7979544c10ebf20b24b0a3248e62edee3afd4d7d9492246d254115f7925f393518d4ae7606e7a43baac48c8fdfbdcc00f11d0d21881f4397fc3af1145f92218169395b2a0395fbc213070bf9bc12bd7943d1dcf1c145f6661d6fe62c16034b3b2586cbc2978f9e79a3b4769d0419806e158be1c286f0bb513721ccbff8d6057e73ebed3e42f1c9f6beb55033ac20116da44926257ede6105bced789a62ce8fb598b8695065c0c38e7d4ac10c6a19885ab8afd77a334f2b33cfcfb6f51e874861fe92e36a13b073ca85dc83d363a2420b23c90fb"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "49de524320449413dc72090203010001": "6fd536044d033a69683d4f2563dd39ff557e8cbdaebbcdf1b99bc563a8fd7805b48914e4fa23b0f3ccdff11606b272e05a318842142ddc0677f7739fe2b34bd1d1177e114943b16a69452b8b8b3aefa2cbdff525b38581b68e4f34548b93ddb04730032bc38eb273f8f8568ea4fbe4dce9f43dafd63b984747f950baa58890af1b97b632eeb4ba55f3e6c48440db0198797502e7efe7612a2682b48eafe3de92fbfd5dc55975cd27beb3fa86cf24b0729d8d8555e171df6d87dd8b034814cadbf031bf1f70c5365f5dc15c553911ace269e75a8d751390f7c8aa4193aa2cb88c1e36409e61bb0476df6ac812b8df5814cf5d0002e663bc5f2e9d286f327edfc9",
              "223f55731820b91ccd18010203010001": "0854f2ba0bab7519ba2593f1d072fe99da6eebea1a17f7d448d9135361329fb18469f1346da2fcb91e210103c3c2836d742e9dc98df238ca59ef863379cb223416c5d4b21b38c31b50082a761c64904be0b28a47b4c86794b662c6bf6977269b1d58bbfb13c5dac83c0e86e771abcbc3e3dfeefc9016d9177b256328b3d8a892900533b01112659e5129ab35c4ab4b46c11ffe5e04e55576742b9d9bd038f9ba99dbaccc3060fb372f4825a805e0d52947f903484f9c205f75373f577fb604b77ecdd098f1dd7a6171281b6b651fd3d8aedd0fc63fab4a078a1cd519f45151eb99572511f62cfec1fd9ea9bdd2d897d0f90722bbb3ecd447a3d24164ea3b638b",
              "27a27e0a9112b427910dbb0203010001": "0e85d21ab05b728ba26909ca1391a4621884f0c7d7baa9f85402f5cc419df0a14ce09373360f438aa0d317b6a44779036cc6600ad58181c3ad17924a39490cc4e6dbe50edbe35435b13fbed818a08d2bbd4c6e47c7967ad664c94e73c6ea8f50750193977f1ef6644ea401337de97e01d686c33849b3ee75deb40ad61acdb65b47bdb38278419ef0deb4f1ec4004244e91fe5e8dee3a66145db402f3bd4f86854bc5ad0ad57676ef26d033b0dae7fe9fc6abfa3f46b4d25fb23ff594073726179a6ff2eb2bca60d178566d577fd93c2b64279e75f5c6eb9909266bcb8c7dd9ec2444fdf4a33a8dc0450ecfe28495e7ac7294c6cfa8ceb3917df929d32beefdad"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bd7df0510b70316e09624e84aee23c7a159846353dfc4716a6a2550c7759ceee791f312068a4b70f3cf53f3b12279e9b00ce230505d3dc4997187b644d7961110620202693c5403e3af9a5cdcabe2bacac9bd534647999927be52bbc0355baaa4e4020a234aa808b034bfa3c52461ed8e81b7b7f758267c6e9d1af102d19809d1f399957914a52f7676eb4a7384e53f3e774f9efd198378e85df4a87fe85ea291afffd78bbde4b2ac0b8dccc0fe3a3a629d0383b4315c0ed38bdf0dae62e6b43321f254615b09b7f489dd80115c8420b4d123cad46e722e11da0efbd446e57613dafb23eaed651e38a7d3faa11d2c6aee97a38ca7527a27e0a9112b427910dbb0203010001": {
            "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {
              "27a27e0a9112b427910dbb0203010001": "a473b1a8b45e63cf027a12b3c71229b480ed760d445a10f61e06245dd6044d9552cbc8c101ba79ed74c3ff0862e9d3fd802f39e3da927ea4c39bdb55e500b418cfd35095c4878ac3c4dd8da8dc7dbad6f2e8696412709db415cabb3abcdb87d2cc55280b432439158735823eb8c0901b84f17a1a425ed57abf501711baf1ea8d3010acc6c65647fdeca289cb7496ad8d0bac1aae31173eb5ffe746568f37385fa917d59ac68fff32daed9d8c87c612282a68951337c1986bdd199fb1d66d976a05f7b6f0f7417eb030a5efec383a79ced7d252da45cece53777238174c7cf51177bc13b6cf116be780c92bb4ef6d37f9f2aa00c1f1a63988536d0c41deeb7cb9",
              "49de524320449413dc72090203010001": "a1df421b9fb8a70cc3b3ce928c641d6dce962c05fd214fe870d092fb14710ef74355b3a9d7a9dbec38cf59567362f22b8294ba703c0977fdcd3013904dd8301a7f3df9d7bb42ec7e57a77e05ffcfa0c87f7cf30ab5ce36d5c17f2ede8e00999c4dd87d3d4bd8d9fb9cb0e4b4d19c52a16c3e9386588ef17a274b072d7ee77246b4e5b2840fa549c2bf72cc3037bf12206070a4211109e61d02326ac9516ea05f5e4e561e8ffcfb0e4f65c3d73c659289505379f3200ebb5fb129847ea811c12d6c889f869fb7589c4e61c2d571b40e0b2d89fd082c9085e75b2f840dfab49e8abd7c80b50aaf52ee991d53a8d0f01e4ef9d1dae5a4c2d6030e730d34347f9242"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "27a27e0a9112b427910dbb0203010001": "934e8c02a2adc6a0aeec4ac6be63fdae0849fdef0375b6e6e4bb395dad60e6f7a522834f9272fe6a4cc04a3bf2a76d0067d8d08df7091dabc44b2f66ca339103c7e90e65d21b8896f1bf414c54411eebd63903dcb6648a397b009b507d4cb6a08fa5ed07c19907a1067db97b48cea70421a77905bd66fa8e7ed63239f7fd0ffb6da9d9369d13ccef01b69a0288576539a234d95f94bc8dea95530b0d70a0428626e72eb05d98aa6b2973161c3bce8fef3a5b6a40116adda47082c93314a645e50d3b2d465b71abd1148e05f2e72adb1eb50fd83946709af3541fcbac77e94db0fa7742f6d1ba7b19d6d96f2b499c1ebf040a970724dd2ed29aa0a3ecba9f826b",
              "223f55731820b91ccd18010203010001": "3a72e561e1b242d7ed285c2a363ff780c9e77a1f801fd6a54571334896686a14be880e2c88aa6e70c3651ba5d1df1ba1135ab1a2bfe1c99f3b9a72e4b3f489fa9429f0cc743846b85e4c6a26821d982c0681bbbb84ce2eb7d2827161bf239bc9936f28b4d803229a61d255709b36f82df8419e1096577225c0ce335e8a216e1776fd4d9e17cd71e5b1db1276e57bd223edc813dad202c71e5cd97c97ee308ec5c7ba204a945a8ebd12433fabd374478722da5f09571b4b87ed680f96a1737c0110c2dcec62099342a6ee4fb36a76553cd5960978f4f89655a49d0bee5c6b75069c1baf5cd8109e4db36b9ca1da03f36856771651e3163c9d5c4ac6918dc941ec"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ca23de6907555319b6e8397479c9d749cc345b1e31fcdda52a0cac94f315b18aabf013e6974c42240783c6c2cee4c4a0b8ea0a35b07d99cebada41e44efd73cb4dd2844166459954ab22a7175fbdf735d7f31b722b33a3dfb9929985fbd1531a037b93bf76a6e2708a6cf1807339615bc9746958e2519fdace9bbf6d76d10cfb7b2f24cef382eb1a0438fdc3ddb8dd551ea5193cb14889a7071d9d5b1bd481d5be611de8be91dc71338c8896b9c979a8f52ba98c298c4c9bbd6491b0bb950a9195382ea6e90e4e517d677ff791b13bec3713126cb4b8162a5aac596e7e414f5c5aa4e0c77fb40a021b8ba6529e388909105c9d4cee49de524320449413dc72090203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bd7df0510b70316e09624e84aee23c7a159846353dfc4716a6a2550c7759ceee791f312068a4b70f3cf53f3b12279e9b00ce230505d3dc4997187b644d7961110620202693c5403e3af9a5cdcabe2bacac9bd534647999927be52bbc0355baaa4e4020a234aa808b034bfa3c52461ed8e81b7b7f758267c6e9d1af102d19809d1f399957914a52f7676eb4a7384e53f3e774f9efd198378e85df4a87fe85ea291afffd78bbde4b2ac0b8dccc0fe3a3a629d0383b4315c0ed38bdf0dae62e6b43321f254615b09b7f489dd80115c8420b4d123cad46e722e11da0efbd446e57613dafb23eaed651e38a7d3faa11d2c6aee97a38ca7527a27e0a9112b427910dbb0203010001": "29d6a640a742971796181fa4f58499dbba71e78ea259c2acffdcad83d75b5c4bf16829562e4330513cdce6889a44b046fd6d3a2855075dd8e83c7bd9d9e4309bc616b6c44dc357e7af39960ed6b8554bf9936f302124d944691c52581e6cfd9c283b20345a8e037ea67d52dbf4a6193dfbf596ef13dfec5f2fa07955f26d4ddd908be977d6bfc94583fb41b5d4c576d9039ebd9ed911b6af3792075bfbf93f201bab404feb267008e3051af406bb231c6e6836642e83608d378d232f77dd8b30ea94e553cbd380b12fb53eb59d5821fce6f74b5c9c2e2673289127b28f0a2df798d124ca0fa39b9f3810e6a9209cde601ead002f7da93d55d2a381915b3a2b8b777acbb07fd028e6b75107580d4a8afdbb22bbba3231d127c61ffe033d24d7ce460fd6e9b82eb5f796b533ace3701ada4efeed3d7e153e0dcdcb38820f6cbe959962af986cc16c76eed7457e9a3597e6c56b85a0f55a225253a6d703f42fd5b10f2d2ff2cb7a2a47a001f33fa25913fb774f1b600ab2e18abcd18555321267df2eefb085296a4660775a8d591b3b2517acf8b70f147b0b9a83bb5565872fd1f69b0ddca8960671c078f239face8b1b520c96369b00ee36b1dec182f3990b5351b5ea42aa635c28ba22b32d975169d02d1405592d2b8c8d6489c696906688970c9f943296450aa949604aee5862b835d6d9a727f48bfa41108eddf917291195fdd973c0da32cbb138d8ae21ad1fbbd23d27ea3ecb6b195aa25aeb6f999732ee104474fd7e70390ce7af86ebc3f710ca128de7d15f00fda4485ac82825f3bbe1bb4c37b99d8ec76bcec2487f99895cbb223e6fa72db1c180c45045deaf58da33642e9365caac4d861f1d20be9534a28ab445fd4cec39b5b1e60294bd9f933df1acf5f40ac07ea547d16d5cf92f7b3867427a0208f66a7d6a8ba569165cccdff737c78f07a262139e28031b46009f19ae852760213a36906642e47ad2dc001a59b82c1c63f21316f1ab2d55ebc5bab1c1b7ce4963ec8293d7db161876c2639020a0a0609e08bb48a4d18688fcb720c36d8bc536e15f1c78f8cc00a4f7f643b42ec1d7e7281b9d78dfe451a96d17eccedc7792f34243d010c20fb2f70d2af8b2512748f74b3d057318a2940256625b34bc631fd44170d815eb76fae658a0b62e599acf0d6d8d821984d33062d029f3de607235f4059a904725aaa104d9d7e03d54e996002d7697db38102f56bf3a70d5ce2134531bc33a88e93b1a9a3c47b8c67fd17af8d3139613cb3b470cb58183cee8c118a075f5a225a55771a4a0f8ab321e1b0b38e42a4ccfbb7765116824185009682bea32940c947839a888b9596844c7c906466159eaecc025edaae2be9787faf868d2c5cbcef904560fda3dd85f24e1818602413de1a7eaeed5eeccb709745faf96a7cd2bb53ec7a29a53d7aae5d9c758ffa3dd3fb2a83bfe3e2d007185066a09891a9f794b132b873e12621345947b96ed23cce82437fcc789a2a83e28699e88ed76eadaa892dce77976f98ac62699823feae6f84d0911f3739168a51da5eff00fa7a5eea35503809834e9f0a3aea6da1a3da30d5aaf03134077b06723a5b454122b97e63a7b78c232b6bae973b879bcdc605e85d9c466527933c1394496bdcfc77fe27fcbe0d31a021a7d4d22191e81c7da9797284b095527464ae20bd85c8f1acb89c7835829b734e9a50d28bc074e0f1dfd4346c850eb0b29f5cc706e1c971872d55b5b3be401db9dbc38abd06259"
          }
        },
        "encryptedSelf": "z1EQ2PkPvvwQZsu5QCpLn5rCvRosDGinjv6jxamhkWY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b3d2b6a3-ae19-490f-b3d5-acfd36dbcbe0": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b42489e5-2576-4a1c-8de3-cdc65e6bcafa",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0cfe8ef00dc7a6314e13a35e8ad3c969",
      "created": 1679920203751,
      "modified": 1679920203751,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "NxPQnLeGLM675xyVsH9xZQ/vboqDP4XvFjR/JE4VPgA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b4efa501-14ad-4ce4-b988-cd05fe261cd4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-d030ba5519a533510ec7040614eb270d",
      "created": 1679924608670,
      "modified": 1679924608670,
      "author": "2b20e061-f5a7-48af-890a-a82ac0000690",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "uejrvf1by-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1f435f649ba99bd0d4b79c66b1a813e7e98223dccb586a900a410643635b1265d9b1f384070290b80f640cacc8aef5958a1ed5c54815567d15e68bff4776a3279572cd9da25e238943d986904a34fa318f52ed08382d1b4db89f638ef0b633df5390e0bde927bfadde49927c751fdfe799b8825fdaa514d90ba7ff4c5864ecc1e7a59e2521e886d1205e92c79e843e377d364ca5bdb1f0a1b72448003276d5fb80bd31ff33bd7d9bf38a2f7c7c67ca3bb6db6b148a411d2dadeb429138efe76c8cc8b6e1ed72afbab002b2aeed5c408f630c094af46f3bed9db7870d814ac806a8d948bf5e8476c5c2a788d0c901504f4281575c7d0ed06ef291b1d083c62590203010001",
        "hcPartyKeys": {
          "b4efa501-14ad-4ce4-b988-cd05fe261cd4": [
            "36fbec92e4cebaec62e7f160a2fb8f8132f6b61c78eaeecee0101d91c8567e201391013627585e04087e6145daebe9bcebc27695ece827a1d19c9174c45e74f857dadee8b965b66017cf489b19615020fb829f786510609c4b310ebc687febfd6631df6535a097cec061c55ed0cda672c5e421ad1b323efdd150340d41f8c72dc26fed098a2b6bb5bc4acd611a4239d98639adae31f7088287f5aafe8cd3858ccb7ea7a0a98ec6109647925706e25ddc174cf0286275edc03478cdd42dd64a69e417d890265a870b08f528965f3183fd54c490415888ac4a5be4268b93e93b20060ba2fd10cf76e39fffe53251dc7d154152c3977cdbc7dbeaf33c6dd8718a95",
            "36fbec92e4cebaec62e7f160a2fb8f8132f6b61c78eaeecee0101d91c8567e201391013627585e04087e6145daebe9bcebc27695ece827a1d19c9174c45e74f857dadee8b965b66017cf489b19615020fb829f786510609c4b310ebc687febfd6631df6535a097cec061c55ed0cda672c5e421ad1b323efdd150340d41f8c72dc26fed098a2b6bb5bc4acd611a4239d98639adae31f7088287f5aafe8cd3858ccb7ea7a0a98ec6109647925706e25ddc174cf0286275edc03478cdd42dd64a69e417d890265a870b08f528965f3183fd54c490415888ac4a5be4268b93e93b20060ba2fd10cf76e39fffe53251dc7d154152c3977cdbc7dbeaf33c6dd8718a95"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "51b0719a79e2c589781c150a6c8dc61eadf7bf1eb645e85c7e219af408eaedb3af04cfbb9e5af22b58463be04e711edd6c06a96aa43f5f2dea1dcdcc94e1999dc82c0c171e4ae94043b00b800fc944f9afe1936d08d9d779db3f58f64337bd779942fe601bd8723f97e980b9810d36264e2bdecbc48db6276ab253783038374900e8f9632d7a3da092aba0492983938db5eb3fa2d84243b1a9fab7aa53db99836744fc74099d6bca2ecebdb05cb5105e8139e218c1511d831ee412e3fa73bc6fcf35b748e2e80536fcd0238445b0810d8ab5e4f9f04087af475a6a71c1c7fc16e1ddb82add34f5dc3f23738399ae36d6a3151d3d6026aa0a1cd34082d0a6ada1",
            "7d67db4ca45ebc0f138afc030442eb0dc8286e6edcdd2cd83f880da21b5b4cfe26a837d35bfff92c113e5e42278b3659abb53f52d7c190076734f3b4f73181d2d7fb2a6a9027735923882cf281fb1d7f84b267e1f28d189623f1dbb6c9ebbc68f8e4ea1721d975df40d46ae2dd12c04f0f43bc69ed29dae2a24315492d6b538fc1972f33242c994dfaf1789b3ec65ed4d4173708ff4b5185f7f62ea9155bd6f7bd23a992331c9f15938817ecbf6a75adafbdb90bf6134fadfe4cea10f2f4f4cfd35895cdd2bc372b48d88eaa4c2b61b8e21c7071e24bad4a6c26b163461f26508ca3017af80ac469e458a8559a66b121b2cfa534790d329d0422b02766fc60ec"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1f435f649ba99bd0d4b79c66b1a813e7e98223dccb586a900a410643635b1265d9b1f384070290b80f640cacc8aef5958a1ed5c54815567d15e68bff4776a3279572cd9da25e238943d986904a34fa318f52ed08382d1b4db89f638ef0b633df5390e0bde927bfadde49927c751fdfe799b8825fdaa514d90ba7ff4c5864ecc1e7a59e2521e886d1205e92c79e843e377d364ca5bdb1f0a1b72448003276d5fb80bd31ff33bd7d9bf38a2f7c7c67ca3bb6db6b148a411d2dadeb429138efe76c8cc8b6e1ed72afbab002b2aeed5c408f630c094af46f3bed9db7870d814ac806a8d948bf5e8476c5c2a788d0c901504f4281575c7d0ed06ef291b1d083c62590203010001": {
            "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {
              "d0ed06ef291b1d083c62590203010001": "36fbec92e4cebaec62e7f160a2fb8f8132f6b61c78eaeecee0101d91c8567e201391013627585e04087e6145daebe9bcebc27695ece827a1d19c9174c45e74f857dadee8b965b66017cf489b19615020fb829f786510609c4b310ebc687febfd6631df6535a097cec061c55ed0cda672c5e421ad1b323efdd150340d41f8c72dc26fed098a2b6bb5bc4acd611a4239d98639adae31f7088287f5aafe8cd3858ccb7ea7a0a98ec6109647925706e25ddc174cf0286275edc03478cdd42dd64a69e417d890265a870b08f528965f3183fd54c490415888ac4a5be4268b93e93b20060ba2fd10cf76e39fffe53251dc7d154152c3977cdbc7dbeaf33c6dd8718a95"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "d0ed06ef291b1d083c62590203010001": "51b0719a79e2c589781c150a6c8dc61eadf7bf1eb645e85c7e219af408eaedb3af04cfbb9e5af22b58463be04e711edd6c06a96aa43f5f2dea1dcdcc94e1999dc82c0c171e4ae94043b00b800fc944f9afe1936d08d9d779db3f58f64337bd779942fe601bd8723f97e980b9810d36264e2bdecbc48db6276ab253783038374900e8f9632d7a3da092aba0492983938db5eb3fa2d84243b1a9fab7aa53db99836744fc74099d6bca2ecebdb05cb5105e8139e218c1511d831ee412e3fa73bc6fcf35b748e2e80536fcd0238445b0810d8ab5e4f9f04087af475a6a71c1c7fc16e1ddb82add34f5dc3f23738399ae36d6a3151d3d6026aa0a1cd34082d0a6ada1",
              "223f55731820b91ccd18010203010001": "7d67db4ca45ebc0f138afc030442eb0dc8286e6edcdd2cd83f880da21b5b4cfe26a837d35bfff92c113e5e42278b3659abb53f52d7c190076734f3b4f73181d2d7fb2a6a9027735923882cf281fb1d7f84b267e1f28d189623f1dbb6c9ebbc68f8e4ea1721d975df40d46ae2dd12c04f0f43bc69ed29dae2a24315492d6b538fc1972f33242c994dfaf1789b3ec65ed4d4173708ff4b5185f7f62ea9155bd6f7bd23a992331c9f15938817ecbf6a75adafbdb90bf6134fadfe4cea10f2f4f4cfd35895cdd2bc372b48d88eaa4c2b61b8e21c7071e24bad4a6c26b163461f26508ca3017af80ac469e458a8559a66b121b2cfa534790d329d0422b02766fc60ec",
              "6c72fec29fdcfdfad48c4f0203010001": "a733b7539420a276dcceb0d9658534697b8814ca5ab8767572152505dd7a119cf12d7d9d39d18af919e74c50f77f2e327ba90173cf472118af22d1fa1fb76c837c5afb43ff346c2c430b8efd6dcd0285bc90aab2099b2263c5bc801c7e74160202367e065cced234bc571ccd6c1a825923da39be8196a9a381bfc69c3b203458c158aa3e2a22731dc3baa63f25d8f3e97525ac4371e33a4a2ccffbdb938578179d6c7e431ad417c7440f36f48ccad09e4cc5d62da917657522c1034a98c79b08d7f7d9bc485550125bf4e9a68844f7723bcd672145a377e301fe3e4efcb457dd56ff271b05d6fa505cc4b567230686cf6cc4e47c1e89f7049fd2a35f914f2db7"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a7c9f5fe8abdab47f5b63a248b800ddbae5127d6dae189a41ac43d31a302f730c19c0da1cad6040e2ae11a6b4c18b6334149725121871b174a1795898dbd2147b2fa8f7b26eb6d2b6711a1c8e4e09bf68d8809b5eba12fee48643a5706255c9bd53ad5b3877ee3f48914d1d161a7c900a830e6d6cc07cbc596f0cb0c29ed2961a510d88651ed2b767007f54273a475fbdc65d771353d5dd6d925d619fecb902b7483920b92577fcd0896fecb2194476ec71c17fa0054c81b7d645de205e8b42618994e1d02431916d0504144265f0f9781c2e1d2c67f3730f8592ff1cacfdc85998bcf277c8487c7d4e7df3597fac581e49c6f36286c72fec29fdcfdfad48c4f0203010001": {
            "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {
              "6c72fec29fdcfdfad48c4f0203010001": "7d65d8f6521178a5698396675919ebc5bf1af2b6a5155aee9a569602c99885802e8564367d8748a9e9388c969493113d9967b5adcd8f25369e06989439a0abf254a7bb63d0d2be13a544c0f35bd0e2fbcb650acfc615ca0998f55520f97f172e95c3e9e1f8656d1569dc506866bad2144d61c7695fc82b828db2f8d00ffef49cc1530c22890905f80af656f3de42569568f205a86064062541aa523172684b95413e366fb2afb6f76403bfc8695e4884d969363fef29f17dba39215cdc6917e16b3e821957a73c22a8d7b7ce601bc2661d1753a5a89f04d9e27cdf5783e7bc388df97f7f71ac6438aa319f41eac3f48ba0589ba9eaa216a054bc3cdb49d25cdc",
              "d0ed06ef291b1d083c62590203010001": "250eda27cff3904bb30f2e1e71e3b74ce50dba3bc74d51d3ebe4017dfe7744c00b87abdd2742987d46d4ab23b5b2a7380457e702ceaa2dee85cc8be6c086aa450df172f2fc78321d41bbde7e0c9a68f031455d74e1643d07427a41dba54cf4c4a4fb08d93a356a0ebb8d8cbe944a5803482e96bf1b15a7ab888b5da772dc8b68ef0d6a89b1218f2559f60624004d44153959f7e2c45765f224ba8bc3844f79ac684077c623cb68d39b04011003387c1f497c1d0a06d233059ba11032d188a9766a55db289c64ef3253376ba6f1257e5666d15430ef83d25eeedc0e27550652195c0c7e22b0a71fbed9435910689a4b89adde12e4c5cac42301b818f2a9ed9a4c"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "6c72fec29fdcfdfad48c4f0203010001": "9e6a3b757842c1da93433447da94897531ac882668d61b0fcb6eb2efacde19abfdd45e3d517c92d5905682bdc4bf40969b9ae5b744150c4a27a7a52bf58dfea90bf86523fa061777c48da7b455d02f796dd794173ad2caf1d13bdcbb1900bff8d5cccce03da31bc8f705f723247ebcc063b87b15069540d0eeb9652e6d1f501df66c0561d34bf78eca8533b8ddfe33c376b728cb023a361cff2b10bb7321960d225e828314030dd01432f00ffb7c7b73e613922b7c801b5482455570a43edb8852736b512a09ec3858ed84366f0b5c0d66a0dddfdd725c89d0ba6d06a7f9b68a3aea2aef9e1bc2a198d713e634fa2124dc222c0c4c312f0c415da2d3a9a33d12",
              "223f55731820b91ccd18010203010001": "c73a459d9e46b5427c5aaacc51a4c3e5f58e3b0427c1c0e201d81ed1884b2dfe3ae0749ef8f0bbc3c8de104757079fd49b7e74dc91a685b23ca91a418c67e131865aa68aefbb21631a589f824a50a3854e8985c1478aadcec0b516cf9dd33fda2b3df33be42c8fcc5bc02072f227bbc9b71b1db434efbf02b7e325be5bd1d71af1010143a11c3d850a822b174065d81807988306b41de8d84447300da9e239315ebbe8f325bd98ae05c1750c8f9dd465dc56b77daa8f7a7f408040c88dc5de81ecdf0b52366afc580e9cb02b6786a45e57577d810304712187240fac18c441e808e5cfeb9995abdfd25122337ed194ad6e7dea611888612c754f34d3fda79648"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c1f435f649ba99bd0d4b79c66b1a813e7e98223dccb586a900a410643635b1265d9b1f384070290b80f640cacc8aef5958a1ed5c54815567d15e68bff4776a3279572cd9da25e238943d986904a34fa318f52ed08382d1b4db89f638ef0b633df5390e0bde927bfadde49927c751fdfe799b8825fdaa514d90ba7ff4c5864ecc1e7a59e2521e886d1205e92c79e843e377d364ca5bdb1f0a1b72448003276d5fb80bd31ff33bd7d9bf38a2f7c7c67ca3bb6db6b148a411d2dadeb429138efe76c8cc8b6e1ed72afbab002b2aeed5c408f630c094af46f3bed9db7870d814ac806a8d948bf5e8476c5c2a788d0c901504f4281575c7d0ed06ef291b1d083c62590203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100a7c9f5fe8abdab47f5b63a248b800ddbae5127d6dae189a41ac43d31a302f730c19c0da1cad6040e2ae11a6b4c18b6334149725121871b174a1795898dbd2147b2fa8f7b26eb6d2b6711a1c8e4e09bf68d8809b5eba12fee48643a5706255c9bd53ad5b3877ee3f48914d1d161a7c900a830e6d6cc07cbc596f0cb0c29ed2961a510d88651ed2b767007f54273a475fbdc65d771353d5dd6d925d619fecb902b7483920b92577fcd0896fecb2194476ec71c17fa0054c81b7d645de205e8b42618994e1d02431916d0504144265f0f9781c2e1d2c67f3730f8592ff1cacfdc85998bcf277c8487c7d4e7df3597fac581e49c6f36286c72fec29fdcfdfad48c4f0203010001": "ee6a43d4498d3d2ede84b48d25d5fbd4d5f075a2cab404ead06d1c2fa2b650a51112b7d2568fba47a694542137c2fec983ef0711ebdd328197c0f53d480aaf3e111e7dd4cec6561f96ef4bb4be9e60331cc763b23ec3568016c9a897b35ad6cf0c87d1e6b845ad6fe23e2097bd24eb20a9e839a854b30c83c8ebb328a4f1623c0d6442c02213b70f77ddd818466f6ba02093484e999c9a2c3bfa37036ca013ea2eb323b6a8c1dc0081e9451c55bfcf0defc36aacf7ff1019aee27d0e3fce1e14e385909998145df5ce136df5e785d03efeb82abb81bff3c0550d3f29e549391a9d839cbaeeaa7d487a9e1e92848778479dbf2e60b055bc99abd9f2da4f0e1c89b8a5e227cf8dbbc7061f3c13c6eaa8e220b2c2d7de8cdcf70133224f13d3a6ec939c2f856e00ae0600246f635cb75abfd49f76efd5283e54132cb4cd348c3dc6f89915cefc2a702c92c337ac259c8a090a1b1389b557155d0689e2eddfabbf866001a87c75459323a30c5b81212c90f6b80182f3298fa7e66d3efc5eedf74dfe9e9f1b5bebb3cd08945d298cd9fe17a656979e7ee50c7a9929431e7489b6ad445bff47e30f675d9abc863c3f91d78a04f757a067567eb750e4824c1fe6e9a91384382806174db5f6da3bc9c051628ea3bf5a95eff6a347a306facf80e213b21b08064b5e5c8018c6fd538da490a3c92a53b5bdba2ead0170028e085c0d801097dcd31509137c1cfaccbb3f44b997be89a9aebe20cb7dd6530261ca2aa33ca4ef8778605c1bbf1925002eb5663801315c739065e039d819ff92e61f8510ff6995bade526d940e7d91180d47611f8f451cc0c14b72b4b2542891885e271d2ecbe44b48930c82008818f29c935f980443e263d98f6316a37f63aca322f3fd71f2de82c39c1b4a08e5bff17f79296f8689f328cedef849b69ecc8a793408541a3ba4675291402f3c65c72a859b217b7bdc8a32e9ad95310f23e3d3ffbbe4f4f2b468e5be108f8d416246aa1b8af6ccac49df91246817f4a61ce08932c267efc29b6957a8d9a484649cb638b03d57f6835934b684175044b4b531184c7a972e813ff1fe6f304519cb851de493210d298d4742800a3836abc8d0eaae6f3864231a7b38a38d44c304a1a857e26bde64cfeaf7275112e3c73f1e76285760943d3233f00100127b2eabd29772e8ae379bdc0ddc8a19dbbe06849d36648c0a879eb20963da247ba177f591c6d8061257b231ff0a3312987b410a0628f0e356a89dc718109faa5f7c63cd5cc62b1a1a798e27a26df5086cc6832776bde318d4b64064f494a29a445ce8bb418caa2141a0acdbf9b3ecfae4eb1c9b212673b140415abf586dd07a41e6e4dc0e52463e246d18a4a7b6e89c84c4524feeebc2c1c132ce58c4514f156ea7f6823ac5a79a508c6c31bd44bffe0454b2af57b88c7b179f8e4f3b1cfab3a471179788c42c00c686dc93a44e8d97dca0e9837a096d3ccb66ce247d80b487095a8eae9bf8f36269c23098a62ad57f8c3bebefd634e8ec245cc103cc5406e3c9071c9f7911961fa4621ab121da9a1009e4b12c686a15ddbe85d3269a1622ccf44a71c59ec0b9c7eb6935eb33bac18c9f63c00b169718c38f6e08d4a9f465adff6aca323e86a33380618d2008caf685df724314e9fde0bde123f7c6fb40e22676d3ee28aaa4717c2b6a4d402a362412cafd2f4565892f90acc8ae8d98260f11379d17baf71a0fdc03398eb4d85419f12dd518bbf05d01d83173fbded5dfa1"
          }
        },
        "encryptedSelf": "JVe5eEo7En6UF8jnBot5pL+ORen0CzosRPbh3z3+g0w=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b4efa501-14ad-4ce4-b988-cd05fe261cd4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b55bc530-f570-45e2-967b-40f6504fb56e",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-86f7b44e043fdf9cd662ffc00ede3295",
      "created": 1679924341861,
      "modified": 1679924341861,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "6e46294f@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "HPFcZ4WBhAcXtoXNmQDrvma51n8qiLdV2nJ1FwimaR8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b6f8f0ee-bd11-4b71-884c-44a91ebcf358",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7fabfcc1704e0c249c2103ba96a41ebd",
      "created": 1679920190619,
      "modified": 1679920190619,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bc5FQCWqxOmzkzrAAtPV+3z6Jki8pxd0IINbKpxJzaUALpbEdHaBt3G3B5LInELv",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b8c634a7-709b-4dcb-a489-b4c3c7e4c79c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0b97a780a52e5770f1ea9a8975f18e7b",
      "created": 1679923743621,
      "modified": 1679923743621,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "7a7827d5@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "1G8tHvYWc6n4OldjKoACGge8IOn9pm1r3OoCiX7sqBc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b9fcf0f2-16e9-4b10-bebd-9cf4aec049c3",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bfdbb593eca38fe19f3dd0da151d0a2e",
      "created": 1679929426891,
      "modified": 1679929426891,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "CvoI5LaxdseCeJmhqNCACZBqvgXKAOmIENCmw5RPB44=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ba23f2ff-d254-4eb4-9c92-b72f4bf7342c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ef2ff32a7d94e89152f2bb94b1329b92",
      "created": 1679926265515,
      "modified": 1679926265515,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iX2zm3QbJkjTIFaUN6mZUFRZClBQcFuq39v7fy0tTWE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ba6f792c-de55-4baf-9a11-18aa00dcbd72",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-a0f112e48ec57c055784d64c2143ba57",
      "created": 1679928185456,
      "modified": 1679928185456,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "8N+ofUc0CMwxclq4Mik5iqCe2BKusnQZmRKBU4C+xvBuQeeBsMValHWStmN6FlnR",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "bd57a5d1-01e7-4a54-ad4f-72c9e8767ac0",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7fe658d50e7de3385344f6a1b1ac9693",
      "created": 1679923747278,
      "modified": 1679923747278,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "dEvJ21Z4hQ4AmO3altx1MDEFFDTs39aByCtS3RgXzkjF4ShMG0lKj0f4fdPoAaPn",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "bdf21f91-d0ff-4e6f-82aa-77400a86b4cb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-133b2fd721d5bae4efb0f5c613dd51db",
      "created": 1679920547187,
      "modified": 1679920547187,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "9zevXEoOHZWFYw+pH2yoM/mcBGttMtzb/FbyiET1xFd8gTIknZu2qo/iYaq2aCj4",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "bf410649-24eb-4d10-abed-7e86f3cfd10f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fc74892216590fe90067ac31054dfab2",
      "created": 1679923795376,
      "modified": 1679923795376,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "srjaPZsmeebErda3umcqhywl0lagod/FW22vdtpoeYYXRyUJvZ5M31XgA0Y++mFV",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "bf58108d-fd4c-4028-a09e-bc9c2a22df92",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ed6fab745c025226d5d877f6cb0bff09",
      "created": 1679926591390,
      "modified": 1679926591390,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "1f27294e@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "hilifsz6bCyWhqN+4hGthynZ/P0lWKDwCU7PpQOhLbE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "bfb52608-d0db-402e-ae9c-2ab240d6620a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-a89c4d5aa9b4af101c8b4a0d9d29f9a5",
      "created": 1679929387444,
      "modified": 1679929387444,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "4a60a9db@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d132a51ece175e896be8a282c8d046c2954daa0ad29da720380dbe82da2d3252e666bc1f105c0c592471031624d1d3f673b33aef4092cd88572c029679c5d47d60b70062b891c92f5fef140ec1c2beaf2b25ac5aa599155c47c199925ac49d6d7a815004d90bd93b0a55cec01cca82bbeb29118c4fc3ed89e6aba8c9026b830076bd2897a786040b711e0f153c7ed1f878944cefb1b737d9f3af111d73ca9e33c69e9553a27cabfc325ac05fdeef926ba113dd07ad0ebb6092d28ef573b17defdfc72c15c9f4d23ee7a2970ca2f9646ce567a916fc4028046f3c0cbe93107c04c920a2c4643a5860fa028b813734281381ec1e18b056afe6788be54a6539614d0203010001",
        "hcPartyKeys": {
          "bfb52608-d0db-402e-ae9c-2ab240d6620a": [
            "4204cb7daeff4b653114f462981fdc41cb3f1aae75dd5b333e1a1453546669507bba9d315bfb688d04c6ba5c4c00455a04764bcb18942d2699cb8103376b661884d6461e5274b876b0dfad0a09470cbc788c6edb6942e076905de3d08e110edf911d3dee5cd50324a801becd099ea4d2987de359106c3b712cf7a09d44db52a4f386267ab3e24e488c83eb6760ad0d30c2e50e05017b5b66136de5b0401e3434b05a17a13ebe7f421c0c2405e2f7ddcd9170dc863b68a06540499e183f7caa4437436e66c064102743402c597aafd587f8f360a943f1e09d8185c1ae50c4dba74b05251f8de92b51046aef17b63a714b3fa0fe00728dda1a7ed0bdccb0a305c9",
            "4204cb7daeff4b653114f462981fdc41cb3f1aae75dd5b333e1a1453546669507bba9d315bfb688d04c6ba5c4c00455a04764bcb18942d2699cb8103376b661884d6461e5274b876b0dfad0a09470cbc788c6edb6942e076905de3d08e110edf911d3dee5cd50324a801becd099ea4d2987de359106c3b712cf7a09d44db52a4f386267ab3e24e488c83eb6760ad0d30c2e50e05017b5b66136de5b0401e3434b05a17a13ebe7f421c0c2405e2f7ddcd9170dc863b68a06540499e183f7caa4437436e66c064102743402c597aafd587f8f360a943f1e09d8185c1ae50c4dba74b05251f8de92b51046aef17b63a714b3fa0fe00728dda1a7ed0bdccb0a305c9"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "7ac08c719a22918f18e8c0848aa5edf20998dc6c2e446aeebe95f9938d7e4799bd41d5764b7e769afa3fc0b13fe2ea139dcb75da32d284f92bce992aeb23ada70fc963b2ade8e35114e3e8ff765ad3135b1bbea335b08fa3b716b1a92d32aab2e3622f35477961647954c37552e783ea462ba69a61ca31837e90837dcfbaa1acca6944fee5dc17af2689a64ca18b48cad08a76328982ee680fb701799355042a94c6d1b30dee388e01c2d8a6917eb3ac8f0ad4c6b39261b4391b819ef160152f2ca2d09121b58858a28a9ea09d3e1de51c0328ae5ad9c11962e666b294ceae87d58e8fd6ceafbab577f706f924aa4e58f02a6934a5ae17d7908bbe9c15b835c8",
            "3472dfd74250243d3fd0700f6746ae1cfaaaa6f86b46a2e550e9ca24fa6f0a1077880c28913de6fdaa296fa900db98212f07641cd2104b35311482d70b0e6c987f94a2164a54b37e758d0714eb6c2ebe5e226e434befe4ca453c9e3dcb079e9520d7c1d95d3ac1a837f56582d097c74f6f6b356fcbf6af0d34ac2945a9bb186d782027440086e25eaaa024bc5c4074ff248e6a7792b264b0f895a8c8414f1bc8642e1e98e0bed73b49eb0689aee4a55c12b21572f76bf8f68498bea039d26c5d74c19685512aaacc57663360dba788625ac8908bf3257cb36e111584857a922ad5965779297a05e0a6e20c5e39ad814d845c73ca3691f629cc7ff677f3855b83"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d132a51ece175e896be8a282c8d046c2954daa0ad29da720380dbe82da2d3252e666bc1f105c0c592471031624d1d3f673b33aef4092cd88572c029679c5d47d60b70062b891c92f5fef140ec1c2beaf2b25ac5aa599155c47c199925ac49d6d7a815004d90bd93b0a55cec01cca82bbeb29118c4fc3ed89e6aba8c9026b830076bd2897a786040b711e0f153c7ed1f878944cefb1b737d9f3af111d73ca9e33c69e9553a27cabfc325ac05fdeef926ba113dd07ad0ebb6092d28ef573b17defdfc72c15c9f4d23ee7a2970ca2f9646ce567a916fc4028046f3c0cbe93107c04c920a2c4643a5860fa028b813734281381ec1e18b056afe6788be54a6539614d0203010001": {
            "bfb52608-d0db-402e-ae9c-2ab240d6620a": {
              "56afe6788be54a6539614d0203010001": "4204cb7daeff4b653114f462981fdc41cb3f1aae75dd5b333e1a1453546669507bba9d315bfb688d04c6ba5c4c00455a04764bcb18942d2699cb8103376b661884d6461e5274b876b0dfad0a09470cbc788c6edb6942e076905de3d08e110edf911d3dee5cd50324a801becd099ea4d2987de359106c3b712cf7a09d44db52a4f386267ab3e24e488c83eb6760ad0d30c2e50e05017b5b66136de5b0401e3434b05a17a13ebe7f421c0c2405e2f7ddcd9170dc863b68a06540499e183f7caa4437436e66c064102743402c597aafd587f8f360a943f1e09d8185c1ae50c4dba74b05251f8de92b51046aef17b63a714b3fa0fe00728dda1a7ed0bdccb0a305c9"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "56afe6788be54a6539614d0203010001": "7ac08c719a22918f18e8c0848aa5edf20998dc6c2e446aeebe95f9938d7e4799bd41d5764b7e769afa3fc0b13fe2ea139dcb75da32d284f92bce992aeb23ada70fc963b2ade8e35114e3e8ff765ad3135b1bbea335b08fa3b716b1a92d32aab2e3622f35477961647954c37552e783ea462ba69a61ca31837e90837dcfbaa1acca6944fee5dc17af2689a64ca18b48cad08a76328982ee680fb701799355042a94c6d1b30dee388e01c2d8a6917eb3ac8f0ad4c6b39261b4391b819ef160152f2ca2d09121b58858a28a9ea09d3e1de51c0328ae5ad9c11962e666b294ceae87d58e8fd6ceafbab577f706f924aa4e58f02a6934a5ae17d7908bbe9c15b835c8",
              "223f55731820b91ccd18010203010001": "3472dfd74250243d3fd0700f6746ae1cfaaaa6f86b46a2e550e9ca24fa6f0a1077880c28913de6fdaa296fa900db98212f07641cd2104b35311482d70b0e6c987f94a2164a54b37e758d0714eb6c2ebe5e226e434befe4ca453c9e3dcb079e9520d7c1d95d3ac1a837f56582d097c74f6f6b356fcbf6af0d34ac2945a9bb186d782027440086e25eaaa024bc5c4074ff248e6a7792b264b0f895a8c8414f1bc8642e1e98e0bed73b49eb0689aee4a55c12b21572f76bf8f68498bea039d26c5d74c19685512aaacc57663360dba788625ac8908bf3257cb36e111584857a922ad5965779297a05e0a6e20c5e39ad814d845c73ca3691f629cc7ff677f3855b83"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "RqF4XsGotRri537GgooHtrlp+fkUevuCbveg+dxpHG0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "bfb52608-d0db-402e-ae9c-2ab240d6620a": {}
        }
      }
    },
    {
      "id": "bfc71250-08f7-4638-8351-a1efa255620d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-82c109496e067261beb8659c52385d88",
      "created": 1679920321885,
      "modified": 1679920321885,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "I6s9yQGJR/ihAzGgM0OC3KldalnKXTPJHPqR05Wi37dSZ8dUhBcsxJO610CGqQoL",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c08ce316-1897-4325-9c56-486e4f677adf",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5ac2ccdc0c1f97b515f95bb1e2ec8cd8",
      "created": 1679929568488,
      "modified": 1679929568488,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+f8ibmiwk@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "SRaN22j/V1z+I1wBJ5GqinNUYzasj4zdz37SHl/mMYM=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c15af6dd-d26a-404f-ac40-07efa5607f89",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-cba6f24e571013ba5c6e43c26ddba060",
      "created": 1679920597613,
      "modified": 1679920597613,
      "author": "39eb165a-1b18-433a-bf1d-a3b6b87ef4a5",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "ky3q1rsa-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dd78486aa0c6298faaceeb9137d26f8d2b002e269c90864e3b3f54a7f406f0f914fb3861c359c3befffb01471f732854392ec172ba94242f7ad4355cdf6e04ac0c21c904a712f20fdf1588e571792411925f271d9a7a971a80cecaf08d26f0ba3212808a7cc4695cac45681c762364d380eb8978017e0d4fe0008a8fe86f1d619798708af171fbe1374248417ffbdd400fd3fed2bc7d832c0367b80d1c131edb4936b7f82935f249787a063def9897c573e44e863eef9a19c380ede701747b8a7879f290b8aae520b5e08cf9dc92b67c4e9d317a260fa1ef1df35442a7a0c1555bf298856b8aa4629dfa020897d321e2f75eff11abfd1c3f798c2807c76aedd70203010001",
        "hcPartyKeys": {
          "c15af6dd-d26a-404f-ac40-07efa5607f89": [
            "7d090e438a16a4a54d3851150f20ca155e7444c65bcef4dc2631d4fe9620b98fb288c2c166b9ea8deb6c89d4c54b1429340d814dece5f2fe173962388b695a6201394dc3b195e78da1aa265d05ad313af007524edf591ca2cba1ea76986e94792e59e06c79f708ebe379f1a14480f78a982a561147ef673905f4144d463656a3766a2006a2733af2ff90fa6adea0c7aa138b0b11008b7f53f3f348df0ed5b4f63d77c8eee9062f0edc8073979e1bd46b2ac342721bccb4a26ae0d24f0c3e51cc54ef760e652a662da982df82876c8d76d2020bd99846a1e78ac855450a7d966a21db75d88241c0f37ddbdd6dd2fa5b8956cd54886e920044530fb834318d3080",
            "7d090e438a16a4a54d3851150f20ca155e7444c65bcef4dc2631d4fe9620b98fb288c2c166b9ea8deb6c89d4c54b1429340d814dece5f2fe173962388b695a6201394dc3b195e78da1aa265d05ad313af007524edf591ca2cba1ea76986e94792e59e06c79f708ebe379f1a14480f78a982a561147ef673905f4144d463656a3766a2006a2733af2ff90fa6adea0c7aa138b0b11008b7f53f3f348df0ed5b4f63d77c8eee9062f0edc8073979e1bd46b2ac342721bccb4a26ae0d24f0c3e51cc54ef760e652a662da982df82876c8d76d2020bd99846a1e78ac855450a7d966a21db75d88241c0f37ddbdd6dd2fa5b8956cd54886e920044530fb834318d3080"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "235d5501907ab8d7ce2d6718c25e113dfe6624a5933d2b1242a089bb5e1d263207f094a4dfdaf978ec996900bc8b2186184afe57deb14392ddf2a366a3337134a81453f528251ff7e7d5a07bea72ff12493c0a765bc3fda14a336832a574495e4e2de9ba2402b4f66d1801f27dc0c695a9857a294c1962f2387ba74ac1c1f67682abaa9e5514e70963fe398625a1567aab2d5e1b4a3ef2be89d9e90568b4d3de12b641b4ffdf4aee4bd1b87cd72bd51c52debb0d7232e8ea21aa70507b4e78be82d2697dc8dedf107e0040352e3be68f47eb11ff5ed309cd75a495421e9421613f18a27dd940672542fd572ee936d228cac8d074b2dfb930754979bbcf6426e3",
            "a44bd05a7c08ded06556cc0fcd9e7604f0b67de266c42abd8fa005c2e600a39f4ce593545745bd7b350faa2305927ef610fd38fd84f2f7013b7388392a2453d359a732b3cb5952467d964be677853c01a6096bfb2dfc89a4602ef8b0fdb240ca284b32c87506d969a33ac1ff78bdfddf0c7f4affac9a769cb9d0e435400d0a7b8093531b0cbc0dcad98c6e34bb70d41bd8cfcc09c05806a9da2d182108c4bcb0919631d41c546cd1e90f46700b968342f9b7d401d0d51b4b72540614db156e200172e1a95f654df90fe72f43cf0e7c0f5a6bef3e290210ea36808049d081685ec77679bbe0a9ab88d2966ed65094789d6c58e774ca9bcdac61b58e71c5cc4038"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dd78486aa0c6298faaceeb9137d26f8d2b002e269c90864e3b3f54a7f406f0f914fb3861c359c3befffb01471f732854392ec172ba94242f7ad4355cdf6e04ac0c21c904a712f20fdf1588e571792411925f271d9a7a971a80cecaf08d26f0ba3212808a7cc4695cac45681c762364d380eb8978017e0d4fe0008a8fe86f1d619798708af171fbe1374248417ffbdd400fd3fed2bc7d832c0367b80d1c131edb4936b7f82935f249787a063def9897c573e44e863eef9a19c380ede701747b8a7879f290b8aae520b5e08cf9dc92b67c4e9d317a260fa1ef1df35442a7a0c1555bf298856b8aa4629dfa020897d321e2f75eff11abfd1c3f798c2807c76aedd70203010001": {
            "c15af6dd-d26a-404f-ac40-07efa5607f89": {
              "fd1c3f798c2807c76aedd70203010001": "7d090e438a16a4a54d3851150f20ca155e7444c65bcef4dc2631d4fe9620b98fb288c2c166b9ea8deb6c89d4c54b1429340d814dece5f2fe173962388b695a6201394dc3b195e78da1aa265d05ad313af007524edf591ca2cba1ea76986e94792e59e06c79f708ebe379f1a14480f78a982a561147ef673905f4144d463656a3766a2006a2733af2ff90fa6adea0c7aa138b0b11008b7f53f3f348df0ed5b4f63d77c8eee9062f0edc8073979e1bd46b2ac342721bccb4a26ae0d24f0c3e51cc54ef760e652a662da982df82876c8d76d2020bd99846a1e78ac855450a7d966a21db75d88241c0f37ddbdd6dd2fa5b8956cd54886e920044530fb834318d3080"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "fd1c3f798c2807c76aedd70203010001": "235d5501907ab8d7ce2d6718c25e113dfe6624a5933d2b1242a089bb5e1d263207f094a4dfdaf978ec996900bc8b2186184afe57deb14392ddf2a366a3337134a81453f528251ff7e7d5a07bea72ff12493c0a765bc3fda14a336832a574495e4e2de9ba2402b4f66d1801f27dc0c695a9857a294c1962f2387ba74ac1c1f67682abaa9e5514e70963fe398625a1567aab2d5e1b4a3ef2be89d9e90568b4d3de12b641b4ffdf4aee4bd1b87cd72bd51c52debb0d7232e8ea21aa70507b4e78be82d2697dc8dedf107e0040352e3be68f47eb11ff5ed309cd75a495421e9421613f18a27dd940672542fd572ee936d228cac8d074b2dfb930754979bbcf6426e3",
              "223f55731820b91ccd18010203010001": "a44bd05a7c08ded06556cc0fcd9e7604f0b67de266c42abd8fa005c2e600a39f4ce593545745bd7b350faa2305927ef610fd38fd84f2f7013b7388392a2453d359a732b3cb5952467d964be677853c01a6096bfb2dfc89a4602ef8b0fdb240ca284b32c87506d969a33ac1ff78bdfddf0c7f4affac9a769cb9d0e435400d0a7b8093531b0cbc0dcad98c6e34bb70d41bd8cfcc09c05806a9da2d182108c4bcb0919631d41c546cd1e90f46700b968342f9b7d401d0d51b4b72540614db156e200172e1a95f654df90fe72f43cf0e7c0f5a6bef3e290210ea36808049d081685ec77679bbe0a9ab88d2966ed65094789d6c58e774ca9bcdac61b58e71c5cc4038",
              "427a8dcf9ec9862868564d0203010001": "784b8a3452ca8b813361de1a9b1958c69725545565e714860671651f80b20843e8907aa7eb59e5f96f607b1c7dd0aadc6b196d0d1cbc127afa8b4022eb037b533b9656dc75259de75d07c563c102682ed6ab0e25cb43e089438a398ec097d339920b7f19d06a8c1b99456f33d94acf015dd75fe6c1f60389489ae28426b357da12dcb602f450b5833b61f713b32ce87e01ec8b39429719fcc85d991adf11d2c83ef0449e1f2e916209946f7b1e3a60e8f2cea5d4a3bb3653c0a13a639e704bfbf14b097360c24c5e6d2e47a24af87c252942fb2e0c26f58b9fd4eba319568ef0a5ad160ed83992cc621579122fd3c06713d9bfa42ad9650e3e04760d9da24371"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b57746448f36c3406b875005b64c867410a26b5d177e2d9db75644cd21871c4181521cf5388167b3e0c7a3da1d0c54b388acf9ff30b1806ed32a9a5ed8298bd01813585f198b1d6e8a1dd642d3889859e86001dca59e3f282d82bba795105239c37b55644d6bc0969023bb41e90c412f54d786f3054831bba373b168c177fad54b92303dd1090bb2c5473145de1cb742c1a35d141eb418b05d03d711ae9158825b03f44a23b031c2dbc30eb96d9fd3b63e5631ecc5e226135a5ff86cb1e91eea8747eb81fa6341d7d7b9dc5367f909fff6e60c4791ffece9feb5d1671c65901d60460c9810a3427d86fb607b5c7549649740cc85e0427a8dcf9ec9862868564d0203010001": {
            "c15af6dd-d26a-404f-ac40-07efa5607f89": {
              "427a8dcf9ec9862868564d0203010001": "30ddcff249cc8372cb1da5262206d665b70beec6737bb268f406224139d9565bc938abc816a2279e1fef8c2b5a51c75f40e2145b55b15f16dbbcabcfd32942d5314ee7509016154fd509bffbd0dde79f387e41f653d7ca5c257248c1c50fa7cb9a78fc612b15f487f0044f71f15736bae0da2a28692920873605195ba86a7d4676afbef06baa848c3e8a0a4d6b9535be43c0bb8af383044d0b93694f43b5d05815bd3bc5deaec95a3e9d95d5281aac2331b8f6dbd98527927c883c7d54c73d465bd761d5b2ba796dfce13b46d4bbd6b2ecb62103b7d5c1f2cf2da9d50914b1719c878084032496589afd98dd55e8bd477c782623327a9307412e1513cc6a3046",
              "fd1c3f798c2807c76aedd70203010001": "38da59d9e74d477559441679b6dd76e3216b8276be11eae1dfa1efdd950675b69fbd2b7678731963d0a4f07d55659bc989167cc679fba66985e46a482b96a4b5a846758b037bb5ee21568013e35ade526fe538d7ce9f27a2c6e343e9d15d7a9ba44fe72bbe8a092c318996698b89e3b6453fb351184e994bcde29629d5332c3b90e83d070d8198826ca788bc6c49ae8fe0078727f5b98604f604dbb8db7918896db846620d264a823efafef66603af4a61eb013258cfd0947617a9ac251773a7006bd0892db15c77875a3173a12eaaf8d41d0f12469a451b4d39d9cb877a89c07438047d5230cd5e6071512e71a38d5d32b5c7a882f11e6e2868a5ebdc6289d5"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "427a8dcf9ec9862868564d0203010001": "5efc9779af86fe7d20f647927a27480c55d6697646eb43a64958e2708ee4b6b84d086b428885ff38c03e18bf4b8954fadaef63f9d386081113c8dd4e0edf44514ea0bd919f5cf924ee8cc8593130f2266b6c5f87774f20846ff9d9ac3dc25b0787128e49829db29d0d5623a6942d79781becf2f613325e9d7c832161106d3b2efc80345828c6423fd8e43c065a19a145d900a110266aff13b449a04b4e39543bbd52210621454779918eb684a1768a33a438755742ab5ac90a72129b27f1d1ce339e26281dfcda5f1b3fe050849275ff7293d5e3bda83aea04a5da15457a1ca1204e53d1573838c2add30d0a8c2ff83f4c2aaf0862cf80e6375470cedbe61b89",
              "223f55731820b91ccd18010203010001": "4da35879c2fdf440ec1d6af1d7a2e304c0e5c457cbe2b2e15052987a9e152d942ea82c1a1b075c23843e5f8a067607b3d21c169f494263c79aae1593e6712b9be8239c1d5386b69a1120577ed60ee24bc040890bc36332092c703453673d96f69b949752c83f07af862f26c1a68c04a04d1819ff6c289a2212c79e3748a37e32ff3dd3bb63f552f8100cdd7b06c9b603209d2e66505932f8f3f96cc969d4b43ee0c45f5d6d9599abef5796bbe1688486affa4b3fdad0aa71bfb19dc24d19d9f17de78a3e1d56a55357dc6a9d0df7b772197ba607025000876717598b9bbe4bc7f4b3b87e5f2c36c4e4d5cba9c92319329f6aed60722c9937e47defc6119b08dc"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100dd78486aa0c6298faaceeb9137d26f8d2b002e269c90864e3b3f54a7f406f0f914fb3861c359c3befffb01471f732854392ec172ba94242f7ad4355cdf6e04ac0c21c904a712f20fdf1588e571792411925f271d9a7a971a80cecaf08d26f0ba3212808a7cc4695cac45681c762364d380eb8978017e0d4fe0008a8fe86f1d619798708af171fbe1374248417ffbdd400fd3fed2bc7d832c0367b80d1c131edb4936b7f82935f249787a063def9897c573e44e863eef9a19c380ede701747b8a7879f290b8aae520b5e08cf9dc92b67c4e9d317a260fa1ef1df35442a7a0c1555bf298856b8aa4629dfa020897d321e2f75eff11abfd1c3f798c2807c76aedd70203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b57746448f36c3406b875005b64c867410a26b5d177e2d9db75644cd21871c4181521cf5388167b3e0c7a3da1d0c54b388acf9ff30b1806ed32a9a5ed8298bd01813585f198b1d6e8a1dd642d3889859e86001dca59e3f282d82bba795105239c37b55644d6bc0969023bb41e90c412f54d786f3054831bba373b168c177fad54b92303dd1090bb2c5473145de1cb742c1a35d141eb418b05d03d711ae9158825b03f44a23b031c2dbc30eb96d9fd3b63e5631ecc5e226135a5ff86cb1e91eea8747eb81fa6341d7d7b9dc5367f909fff6e60c4791ffece9feb5d1671c65901d60460c9810a3427d86fb607b5c7549649740cc85e0427a8dcf9ec9862868564d0203010001": "e64c3a7b723f3cfb8eb5a33f218c0bd09e9a77797d67c8e79a38f447ae8f92411e17d67766bb574a85c6644032813ac24f736bda83f4e9ec2fbfbdaf7feb64685233f31432ef177a670f027ad9b9a27ac9756956acf90aaad591a899f48f97f73c83499f032b173d58b933fd5d2bddc6acedc62a851d54bcf0279ecff923fd7104590085af78265f37b0111bfb34c5c0d8eb2eb7dcb82a3b20cef8eb674717e59c0d66d8ac494ac3340c332fe454cf5fcb3431ca1e96086975349fca5006a5d9b1a3cd786f6c552fd60aedd49350c438b43e17da9a21b266a62027188eeaeb41a65141a1b266f90b0ed8a473dfa951afe291dea9511be30339deefdeb46bbd2892a33fc49290bb1c6cda63dec5b3f7bbf97f24647abf002c4aa2362979554811860e95b779bd3d9822c19ad00f43b94e792a44f4b716e4b1ed2135c700becedae1aef82d075e5e3edd879e1c668cdd6817ef2e63450581a832bafd057446ae0c1d0a6f81c2ef31c68377d0c6237ba3c72cad17ff8e41deba72078e6f2a1fa259c94fa36e33e0f6948f17b3dd74d27dd201fdd32b3e3deb4903d4b9d7b5b069fbfeb56c9c54e7e1a71ee9c48c147b4c9a03feea94641cb4b7589badb708bfba3aef0502af77c61752fe4729543f574a5e5c93019bd40c965d1ec1515bae3fc4777dfa1592dd507ab30273ec4c8c009b14749cff2840c4f235253bb29a9682a49aa97ddbad70f187d02a10b8c4394ba50268809635c6014eab5a856314dc0d4279781f432f03590abd6a5b0058b9c2d1d65afb0f2fd4203556ccc29541c65a42590d1e1f2ed9085897e478fb9135fa43031ba44b1bbe84d443face1b51ee5ba18c05788940d61b55218194131ffb49f2768bdf2b3cfc167ea2fbc6838b29714e76b6b50fc2b683b28fe3934e5abfd4dbb1719f87f07a037c7d4bed78e3a581e81ae8525ee94d1160ce48eedc5738d5e98ce86c75e9166a2425f38fec05c9355732527ad7b5643be4c258df0b150e1311a5551a3466a94810f007a5c8ae6c3847924b1b84968802a5071205b270cf37606fcde3ed634bc862ac5ea5aa9ac92f7b00866a9d0754e2119e4c4defcc7efd23852b6bde2c5b0182aac9a4425e5af06d444d52ff7824228facc951b32060181b1bdfd2758dbd6c22eb68bfb2b6bafd5ad33da55f960915d43948450a18070366b297ee93cd063203f4b3b3929591dd395bd2fa91c536b2ab0e10a058705e52fb93cc093a766726d1a2028127fb838613ad2b753928621a600d6bc6205035b4e5cef6e922966ec29eaa7d3c51db990ab533104afdb5487bd0ad8b9d2f64801abf53bd5fd5a9daf244742cc53b78dd7b288fa7c7a04da2ae590e007d08caef8ec988f8a6abf25fecea310b9a9f845d36ca68e48065b644979ae08bd73f1145f0a07bdc1a69e0030f5b44e75856294197397f215e1194032e6c1cb0e0619edb670ed7ad8f3b0f6ec46cb6e001feee6a01bef4884dbe61579beaa805a4d017afa53eeb982c0dcaecbf92abc49f72fb28bddedf18d5269b9951021b11636469e5676a31030815bc63068d050ed249b60321f1b3b110e83ecfdd762deb9602098d6e78bfaa8a62de2bdc10c23cc9b7adc3e31a40ae0a150eab5a5874ce7b50027fb5b15dbd0ca6db32e977d5fd97ca7ed452bcadb3edf848b013913cacdc02a4295d7dff6ac0ed18c2abd9e94519a349c60d0e4f06d8c6dfee74e2fd957b5a866346dcb2f410e1fec4d46e04cdaafedfc729948a"
          }
        },
        "encryptedSelf": "9q7HWJN+QUkHLAMJDqYoMUn1RW9U9BbPLMwWw/g+Pj8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "c15af6dd-d26a-404f-ac40-07efa5607f89": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "c15af6dd-d26a-404f-ac40-07efa5607f89": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c23253f2-16a4-4b2e-b97d-8b488bda031f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fb4512ddd68a907486f157445c66a17d",
      "created": 1679926460623,
      "modified": 1679926460623,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "1313c651@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "vqBDluVkM5rqLLKjcgB3PlSQEtyV5hxIpE5DHshG17g=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c6d9c5ac-78ea-477a-9f94-6a0938c3931b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-769c1b7680fdde4815215f6847c3396d",
      "created": 1679928213720,
      "modified": 1679928213720,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "CcwXiCINCycFaqS2/K+sbqmIsr5srFl56tLLVm9m73w=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c987fb90-b2ad-4179-9ac1-0d4e5e36fa68",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-94dadb503e37b713ae3ce1a2169b6e9f",
      "created": 1679929440451,
      "modified": 1679929440451,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "7DH6Kmd/usJgrpjwiE6BB3Is+R8//LvygWgUuTXHOg23eKe1TlBaf9OUecFmNAgh",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c9c02fa0-fcfa-4078-ba3b-335ff9686419",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "8-9238c734f59757ab59c671fa1a5a33ba",
      "created": 1679926218307,
      "modified": 1679926218307,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "companyName": "iCure",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "c2122685@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bcd8a69432c84faf44d6dfef3e619a16a95b28bec7074209953f9fd14db963063e91b1da9e9853735aaf01c6f6ce7d6f572dea3ed511b64bd0586223d08100ea5b7e15ca8e17351c54bbe43a99af04913a1cf6525bf37cb8c5baa492b2a0fd997afe550d293f25b869a2d200416d42344775f4dd35f58acd58f3e3523bcd48f453e652cae288845ea07a498d1ca65e2295416e741cb1631ac298a3d5c49995395270c9de393e9bb741fbde0c273f6dafc944265fb7bdeb83e524033ceb52d21e7daed8bb2171f83bb7951309f75cad1a6cb15ec5cea6cec0efbe64ba6128fe3addd749180718c544f42bc2bf8c8f1401284709bca4ab954fbfc6f17edc37dc5f0203010001",
        "hcPartyKeys": {
          "c9c02fa0-fcfa-4078-ba3b-335ff9686419": [
            "7ed685ec6ac346d8f902c4fd6bba23fd6c8f7b38362940632be0ff346422281aeaecdb2e55cc708b9147de43c041291909d3a103a324cd91394cee4530aab35ddcea7b3708b996cb2f90953917df32dcf7b38ce5afbf7a11674360824132c37fb9dcc22cd785a569b5319e5d72a1ffde1a7e64c25f1bad3a9dba9a1becaf0c00b0da51ba0e740836a6262e624c059ffb01f1afdfc1f42049da89e8aa1bbe1a84ec32e1523e8c044d3872ca848f335db6551a0367e73cba9eecb34b52dce909253835ac23083eb5bd9ff9197abb67647c8be9d3d0b2071e475f0b6678c9e338f7dfd14f5cd28a2d1260ead0b6eca9026175cd605ea4fb3941c339908ec2c61751",
            "7ed685ec6ac346d8f902c4fd6bba23fd6c8f7b38362940632be0ff346422281aeaecdb2e55cc708b9147de43c041291909d3a103a324cd91394cee4530aab35ddcea7b3708b996cb2f90953917df32dcf7b38ce5afbf7a11674360824132c37fb9dcc22cd785a569b5319e5d72a1ffde1a7e64c25f1bad3a9dba9a1becaf0c00b0da51ba0e740836a6262e624c059ffb01f1afdfc1f42049da89e8aa1bbe1a84ec32e1523e8c044d3872ca848f335db6551a0367e73cba9eecb34b52dce909253835ac23083eb5bd9ff9197abb67647c8be9d3d0b2071e475f0b6678c9e338f7dfd14f5cd28a2d1260ead0b6eca9026175cd605ea4fb3941c339908ec2c61751"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "034ca31d45e8ec4fe0ecb5d1fc48191bd60791d9d86246a46e7f944d33829c0f8af98a78faf779dd3d1b82072ecb17b54fa3992678b72df33b63e5e78618b1fe299f5c8f437492970c180a4859e7fda41480edfaa3c541fac5de325f68bed456da2359c7625c65e08e5fae40cfbe8fa06441a759cda1f47a47a7d57feb24f670308e2c6b39b797dba257c01a77d848feec406c47e0ab3c01b27beb4e590ecdf368bc40dcc6b69b4b1131f1bf03bff08ebc3f429eff20369b99b14b550950f03e8fa88662e6031371657a25f91cd680db8f521af8a98247049f22552c9db96c668308991c612fba72c89ba0719b7690de2ca911bc2adb4129ff99202aaf079893",
            "782fd783ae0accdfb0a14c710dcffcd0ea24a7b7b4371e3c8ef8b78d2974690caacc79958d2c7bbd637bd26ec69edfcfe4b1beb68190937ec3d00f2f2e4cc24699bc342d29375176b80c3092c86148eebfb70ab2efb977bf4403d49c00ba399059d0d1fba1260a0ca0eec25e64d3c45bc5449856b55f7ab90af5599d031075101e678459acefe1690f4476122a846b209fbc6020e1d8308a5f672bde69afc185ecce44da54153789c22848c83f6cf67bec28c3bddba1c67296fa4b78552dd7f5d32444c94ed27d0d6566bdc8c08d6eba8112646d92cbe5bb69d6fbce45f579fb2e9927e4c42d19b1be26b37516b0dbc65933c3dc4f6fadf035d0626b1cd3db19"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bcd8a69432c84faf44d6dfef3e619a16a95b28bec7074209953f9fd14db963063e91b1da9e9853735aaf01c6f6ce7d6f572dea3ed511b64bd0586223d08100ea5b7e15ca8e17351c54bbe43a99af04913a1cf6525bf37cb8c5baa492b2a0fd997afe550d293f25b869a2d200416d42344775f4dd35f58acd58f3e3523bcd48f453e652cae288845ea07a498d1ca65e2295416e741cb1631ac298a3d5c49995395270c9de393e9bb741fbde0c273f6dafc944265fb7bdeb83e524033ceb52d21e7daed8bb2171f83bb7951309f75cad1a6cb15ec5cea6cec0efbe64ba6128fe3addd749180718c544f42bc2bf8c8f1401284709bca4ab954fbfc6f17edc37dc5f0203010001": {
            "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {
              "ab954fbfc6f17edc37dc5f0203010001": "7ed685ec6ac346d8f902c4fd6bba23fd6c8f7b38362940632be0ff346422281aeaecdb2e55cc708b9147de43c041291909d3a103a324cd91394cee4530aab35ddcea7b3708b996cb2f90953917df32dcf7b38ce5afbf7a11674360824132c37fb9dcc22cd785a569b5319e5d72a1ffde1a7e64c25f1bad3a9dba9a1becaf0c00b0da51ba0e740836a6262e624c059ffb01f1afdfc1f42049da89e8aa1bbe1a84ec32e1523e8c044d3872ca848f335db6551a0367e73cba9eecb34b52dce909253835ac23083eb5bd9ff9197abb67647c8be9d3d0b2071e475f0b6678c9e338f7dfd14f5cd28a2d1260ead0b6eca9026175cd605ea4fb3941c339908ec2c61751"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "ab954fbfc6f17edc37dc5f0203010001": "034ca31d45e8ec4fe0ecb5d1fc48191bd60791d9d86246a46e7f944d33829c0f8af98a78faf779dd3d1b82072ecb17b54fa3992678b72df33b63e5e78618b1fe299f5c8f437492970c180a4859e7fda41480edfaa3c541fac5de325f68bed456da2359c7625c65e08e5fae40cfbe8fa06441a759cda1f47a47a7d57feb24f670308e2c6b39b797dba257c01a77d848feec406c47e0ab3c01b27beb4e590ecdf368bc40dcc6b69b4b1131f1bf03bff08ebc3f429eff20369b99b14b550950f03e8fa88662e6031371657a25f91cd680db8f521af8a98247049f22552c9db96c668308991c612fba72c89ba0719b7690de2ca911bc2adb4129ff99202aaf079893",
              "223f55731820b91ccd18010203010001": "782fd783ae0accdfb0a14c710dcffcd0ea24a7b7b4371e3c8ef8b78d2974690caacc79958d2c7bbd637bd26ec69edfcfe4b1beb68190937ec3d00f2f2e4cc24699bc342d29375176b80c3092c86148eebfb70ab2efb977bf4403d49c00ba399059d0d1fba1260a0ca0eec25e64d3c45bc5449856b55f7ab90af5599d031075101e678459acefe1690f4476122a846b209fbc6020e1d8308a5f672bde69afc185ecce44da54153789c22848c83f6cf67bec28c3bddba1c67296fa4b78552dd7f5d32444c94ed27d0d6566bdc8c08d6eba8112646d92cbe5bb69d6fbce45f579fb2e9927e4c42d19b1be26b37516b0dbc65933c3dc4f6fadf035d0626b1cd3db19"
            }
          }
        },
        "transferKeys": {},
        "encryptedSelf": "j2VhbLkX38u4oaPWJfTJ3KFi/AmauHEE1g2CocEhpPQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "c9c02fa0-fcfa-4078-ba3b-335ff9686419": {}
        }
      }
    },
    {
      "id": "ca3d33c2-2db8-4007-a3b9-c5a4a3725c68",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-845abd739a893e255dbb9acc54643656",
      "created": 1679926583315,
      "modified": 1679926583315,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "MQJm0i3oEuYNYSlLRk+NVCSBH1/QpQogMfceq51jHtE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ca8fbee5-ea23-4a53-b84a-d939e72023a8",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b44b68359aceb986b80fa8eb8c970e80",
      "created": 1679929432707,
      "modified": 1679929432707,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "FYQ0YyJ2oAQlPXprXm8JLBAqgE51IeT5AxmJxECXQAPxGNUZQLqXex5CXm6ruamh",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ca9cff67-cc51-45ab-87e0-38cea4604afb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-484251d1b7b086b1fb5be20e58aee04a",
      "created": 1679926586745,
      "modified": 1679926586745,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bel9gPaPivU1l1PBrR7wuqtiEvAHm/tKGDaJEqh64BkTxpToM+eVWB90AP+LPui9",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ce087539-3f2a-4b9a-bcd4-bcb68012c7cc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-063f44bf7a4087653e1af03a9c946851",
      "created": 1679925890404,
      "modified": 1679925890404,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "us2hzo6dncsX4bV+yic643I3W/BYZAjZI5JRVYmx3uk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d2161e1b-6c9b-4627-9f58-9b1882a20bd6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6bc31e1c14526203c6082d51b7b2de4b",
      "created": 1679926535284,
      "modified": 1679926535284,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "oC4zJeIR5S//pakhD2I9uqlver+KjlrafJECPWwzgOshgXqj4mgionjIqc+Ybgq7",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d5454162-2115-4dd4-8545-d658dbce1494",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cc8804f54beda93f0b3affd2929f13b9",
      "created": 1679923785677,
      "modified": 1679923785677,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "cNmGBOeEHDve7/MoJHOh3SD4RxUS1QB9PntLJEqoxwzQl8IhROwrDQYElpHYFqEq",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d691c3f8-1483-4be4-b66f-2b1645a71b0f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-c56154b16a15f981e90e031190ce3257",
      "created": 1679928156102,
      "modified": 1679928156102,
      "author": "311a0b38-eb54-424c-9d61-b8a190260189",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "e3jmh7k4-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d249a4b55b65f5de132117d745324ec66c8cedf034de2534361005987fc9910e7fc7827230dece4a6482bdb0874fb0f77f057b37d4f074e2c4fc752b1b58d4af5d487b5611e72580c95af04e8f2d58bde1d36cf7fac219f83d8b5b31737a5bf69b5e20725ffd134fedf902b79d9c8dd9ec87826a5e900b7babf9cf8478fa62897eaecd883bb572c16d1abfce36f07b17a6783e9377d4c94ab3048e0333745897e642fe693ac104f58773a69441c4bf444e252376cb31bc7aa695ab513b6919dbdc88eb9179cc5802f46de499ae630408a59e1a0fa5b563a273d31e315f1f361de2435ca96abcd433fed7576d21a198e5ff5a5bd69e64a07995b08cdfaa0c91a30203010001",
        "hcPartyKeys": {
          "d691c3f8-1483-4be4-b66f-2b1645a71b0f": [
            "7abcc64feb68a02785cc8b3536ed3e473dfe2231d46424698881229a52d0c1bb6accd524aaaacc9c5a3bd5a192e5de5695b6b74ca9205f79c182b45c634639bcdf054c6ac738c78be76c5ce5c6e1dbd7aa4f2583d6617a00225be11bb7fc50c72e6fd0a2835c0ff53a2e9f8162832b0e7f1dd819a5ca9722f7f8aef8dce6e1fdbdd465ed84fe1935979abb2814ffa2b0a2389db26a316bf6e2b0b3880091a3b16d6b50a41da9dd17595633f6ca6ff24d8e7c9d30f2d067dea4efe64812ea13caaf927ed3db294b9e2e7086403f417dbdf670ff8d4a4b183bac3f6eddc332cb72c1182aa71253918ad616f8f27be68f64269095278057105d0a55b6f0c97512e2",
            "7abcc64feb68a02785cc8b3536ed3e473dfe2231d46424698881229a52d0c1bb6accd524aaaacc9c5a3bd5a192e5de5695b6b74ca9205f79c182b45c634639bcdf054c6ac738c78be76c5ce5c6e1dbd7aa4f2583d6617a00225be11bb7fc50c72e6fd0a2835c0ff53a2e9f8162832b0e7f1dd819a5ca9722f7f8aef8dce6e1fdbdd465ed84fe1935979abb2814ffa2b0a2389db26a316bf6e2b0b3880091a3b16d6b50a41da9dd17595633f6ca6ff24d8e7c9d30f2d067dea4efe64812ea13caaf927ed3db294b9e2e7086403f417dbdf670ff8d4a4b183bac3f6eddc332cb72c1182aa71253918ad616f8f27be68f64269095278057105d0a55b6f0c97512e2"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "7d8b473579f91e00d7fc2381302a67eb57ffce6624df22a9bf6d9eb9a3af5f16ff6a6bc83b0d5f30eaf9a5c777ec76e008a0347ed92a588693ecf98f7a41e46dccaf65e302be4ea742b3cbe23810479403131a441dea17dfabb3a09aefeff03c36346122480451796e85069170d117fcebd19a60bf7e10219ad1151fca1f41b96a507e9ea575f275f903cff13707912bd346725c90245f39daeb6ea2dd7ba3699f79d46c319480d78bba1acb5a9333ed8a6512a9e131a81ae65539fd73c982d8fa9e02304b4a436f3ad719981a2865028372ff01a3da944ddf702972f6f862754387674ee2359e770f49e031f7c05ec20bf8810f0436ed92e0efc2bf894493e9",
            "19de3dc8ee21fff3a1be973898d920f92bc5f1250c86666d5f3103d8bad337ca23518b256a3bfba2b88ab5b1d814a5ae439451c1992d0dcb45c15d1f2e1db6a947d93d7c3eb40819c5e7b7e20136e219a9911ac6d8f374188f9fb82b95b58b387a0e87f725ac03b5d941fb6ee45bf6795c06efd17664d5a5d8f835908cb81ddbd37ac9b17d3b043ceb5b0637be7a8dd18cb01bdb0977918ba46d60284d008e7ebfeb44905ee5661628ebbcb64ef6b3052f885fbe0cc584762a92a4ca7503a5dec59d8eacd6f12cae5f1114c9b1fc151fca91d03e46f5a359a9e52a9fe648bb3df52016491aba9dbac020d2137db6ff41dfeb54af81ef511b93d08633a6b89f03"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d249a4b55b65f5de132117d745324ec66c8cedf034de2534361005987fc9910e7fc7827230dece4a6482bdb0874fb0f77f057b37d4f074e2c4fc752b1b58d4af5d487b5611e72580c95af04e8f2d58bde1d36cf7fac219f83d8b5b31737a5bf69b5e20725ffd134fedf902b79d9c8dd9ec87826a5e900b7babf9cf8478fa62897eaecd883bb572c16d1abfce36f07b17a6783e9377d4c94ab3048e0333745897e642fe693ac104f58773a69441c4bf444e252376cb31bc7aa695ab513b6919dbdc88eb9179cc5802f46de499ae630408a59e1a0fa5b563a273d31e315f1f361de2435ca96abcd433fed7576d21a198e5ff5a5bd69e64a07995b08cdfaa0c91a30203010001": {
            "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {
              "64a07995b08cdfaa0c91a30203010001": "7abcc64feb68a02785cc8b3536ed3e473dfe2231d46424698881229a52d0c1bb6accd524aaaacc9c5a3bd5a192e5de5695b6b74ca9205f79c182b45c634639bcdf054c6ac738c78be76c5ce5c6e1dbd7aa4f2583d6617a00225be11bb7fc50c72e6fd0a2835c0ff53a2e9f8162832b0e7f1dd819a5ca9722f7f8aef8dce6e1fdbdd465ed84fe1935979abb2814ffa2b0a2389db26a316bf6e2b0b3880091a3b16d6b50a41da9dd17595633f6ca6ff24d8e7c9d30f2d067dea4efe64812ea13caaf927ed3db294b9e2e7086403f417dbdf670ff8d4a4b183bac3f6eddc332cb72c1182aa71253918ad616f8f27be68f64269095278057105d0a55b6f0c97512e2"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "64a07995b08cdfaa0c91a30203010001": "7d8b473579f91e00d7fc2381302a67eb57ffce6624df22a9bf6d9eb9a3af5f16ff6a6bc83b0d5f30eaf9a5c777ec76e008a0347ed92a588693ecf98f7a41e46dccaf65e302be4ea742b3cbe23810479403131a441dea17dfabb3a09aefeff03c36346122480451796e85069170d117fcebd19a60bf7e10219ad1151fca1f41b96a507e9ea575f275f903cff13707912bd346725c90245f39daeb6ea2dd7ba3699f79d46c319480d78bba1acb5a9333ed8a6512a9e131a81ae65539fd73c982d8fa9e02304b4a436f3ad719981a2865028372ff01a3da944ddf702972f6f862754387674ee2359e770f49e031f7c05ec20bf8810f0436ed92e0efc2bf894493e9",
              "223f55731820b91ccd18010203010001": "19de3dc8ee21fff3a1be973898d920f92bc5f1250c86666d5f3103d8bad337ca23518b256a3bfba2b88ab5b1d814a5ae439451c1992d0dcb45c15d1f2e1db6a947d93d7c3eb40819c5e7b7e20136e219a9911ac6d8f374188f9fb82b95b58b387a0e87f725ac03b5d941fb6ee45bf6795c06efd17664d5a5d8f835908cb81ddbd37ac9b17d3b043ceb5b0637be7a8dd18cb01bdb0977918ba46d60284d008e7ebfeb44905ee5661628ebbcb64ef6b3052f885fbe0cc584762a92a4ca7503a5dec59d8eacd6f12cae5f1114c9b1fc151fca91d03e46f5a359a9e52a9fe648bb3df52016491aba9dbac020d2137db6ff41dfeb54af81ef511b93d08633a6b89f03",
              "de4a0f21499548bbdeabf90203010001": "a96c4332010b0117b00d8e54fa31f8856d491faafce6993bfde0f06c0a4cbc704f0c19fbf07b4061784f534baefad42986882c93c2d434d2095125e1c9fe30e9fb0b29af9c9a109ec29160c736da88e65ca62e01cf72c6ba7e93fb6a9f6ed5db4201db69f146149a1b9bde5613c722b199850aea6825564119919cba826870b24265acead41889cbc1535b53dbf7cd85c2c9f799f3cd30e76e9a24d0d004e240f9bb7940699b7dd02bad9ffc7055fd99ae18508f1c4acc1be2b5170076ed848d8e3bc25edbcc3843bbcbbe8a3eabb584e6841cd4529a6253231889ab43fac97611953bd7279f46c2dff76d38ecd3c40c47853cd4f83b9fa6e7cc873c465f832d"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ce96f68068e7d7d1f68efdc47e27e9029a772782692448e9b8ee7ded88014ab7dd014ac1949b72ff0a1675339520ca7a779f946dafb4e407fbfb14526600c4b6e0320091b89afef827ad5c52bc335e54f6581659af582971a5d766fce20e48efa1db573503ec4273871eeda10edd3a26c159ebe32794c2af7d62a0a5b22b78496ad35afd0a7d2a771b6f7987d03d9c6c7ebade5995d564bc67966add45fe26345e857b0168d3b85a6ff897aee1f07521882e1e31dfac3d46786e8253250d89bfebf852c4ae5ea839fe0503ce715fe011064790390020c68ab11a4a60cd7b3a855cbc596b06d066d4a664a4ed591c061a2654cc4108de4a0f21499548bbdeabf90203010001": {
            "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {
              "de4a0f21499548bbdeabf90203010001": "8a0765d2c20c804a599cbbc7ea7cadccae8517be8c29036606491422e2394a06cfe5ee1ce139b5ca3ae7ee1567610feedb327c11cae1eaf7b32bca01306b20b9f060c9bd9a1c72d44d1855bc302fbb166aff93de14d4ca723ed59c42b87e11e7ea2393a8362d616b5ce119646a96ac68098c48fb0af0a93a67cf9c8d5aefa8566971987938783463cc480da81bcd45c2ff280f8b0e95dcde4f0eece764ffa86820708ac2753e5bc6e296615a40dfe5af2bb461e80d2762e74ad6e4cab735162f5b50aa0ecd61abad32685dca31d86d08f4ccade3086a6f9cdf585f0de7549a673110b565a081e79577d59bc8773d968d2576cce085dd067ad234aa48e0d1582d",
              "64a07995b08cdfaa0c91a30203010001": "061b05e99f2b2013a616e416ef7a4c5a6a0d15fbdf787d75e35c0fbd68817c1db7aa216d64d14f3b2c49bdda04dd74e377adce6c1c8974e4508b215eed235b23f8a2b5f4f30be6e63017c9ade844c65db665a976e35c9111bb69229a4abea1f5c4d1866bdf16ff08e0152729869dfef117fb1ff1e1a0ab969b03c2761f7e1a4f51a8606f2b2336c3022f87e74e5011b6d25602f1eba80e606c89b6a2a342fd37dced76832d4a256f436d97bd18cd61f8063fe70a939166881baea8df06f335e4636367f9679ce9aace2e24742a97edbd3a346ff9484434b563e36a401bc569574305db1ef5dee79c991be3a0a81d4bc5e4e68a6b5ad935305ace447ba92189e4"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "de4a0f21499548bbdeabf90203010001": "01f4cf0923d1b2a534aa12875d3281e6d68eb83f2b7f4635360b85ccd78378e2bff2bad18af3b5c90101c00baacce4594567347f6cf18801dbd7edd9ec5d94d181bc6813966d41e6ccfcc0b08c445ad3f692353b2037cf59ff7203a18268b2d1ee3acecc6b4560e0b4f3e99f2697f3e20b97e47e544d76b2cc5a41ce01cea9059c52078f89330f96d9807e8b56a289abfae2fd4b324b27326da746b899c1517f67776f885de49c88e7c5369474f4cd2b692481cf61ee5766de7f9510f9977f1bd96afe8f85c282fab93534a19dae798044ab5f0dc60a9e28f780dbb3588ce1d6c89ebc304a4060fe80606173336bd17c331190815e09c6d5b9e41caf0ec09743",
              "223f55731820b91ccd18010203010001": "07d374e9f14d815d56c2413d3e1abfd78c27cb4ad7b30f450d2f546aeba08424539eb2fe2be0bd4dd20c8665a7c00d7a867e3eea14025fc0984d79c2e5b8174b795e5fdba04936a8336df48cccad523aac5c2d516e4130e22356036d875f5686cb172393fbccfa3afe55241b5b9f968baf62367e4b06ab3ad021f8db8b51fb5a29aa336586989462e1554126926a972ad14bd6b5488afcbad5c3e3216a851274af494fec9805bf4690bf9677f236d156b6c689e81c7e2d07c31cc6e43bf2ca25a8fab3bbdb97eb8a94bfc09bf9cfa3731acb946345ccf5cf5e602cad87fc93ae434a8592e94ab83711cbc294add3383c39854abe44ed98c431eb78a3b104f0d2"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100d249a4b55b65f5de132117d745324ec66c8cedf034de2534361005987fc9910e7fc7827230dece4a6482bdb0874fb0f77f057b37d4f074e2c4fc752b1b58d4af5d487b5611e72580c95af04e8f2d58bde1d36cf7fac219f83d8b5b31737a5bf69b5e20725ffd134fedf902b79d9c8dd9ec87826a5e900b7babf9cf8478fa62897eaecd883bb572c16d1abfce36f07b17a6783e9377d4c94ab3048e0333745897e642fe693ac104f58773a69441c4bf444e252376cb31bc7aa695ab513b6919dbdc88eb9179cc5802f46de499ae630408a59e1a0fa5b563a273d31e315f1f361de2435ca96abcd433fed7576d21a198e5ff5a5bd69e64a07995b08cdfaa0c91a30203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100ce96f68068e7d7d1f68efdc47e27e9029a772782692448e9b8ee7ded88014ab7dd014ac1949b72ff0a1675339520ca7a779f946dafb4e407fbfb14526600c4b6e0320091b89afef827ad5c52bc335e54f6581659af582971a5d766fce20e48efa1db573503ec4273871eeda10edd3a26c159ebe32794c2af7d62a0a5b22b78496ad35afd0a7d2a771b6f7987d03d9c6c7ebade5995d564bc67966add45fe26345e857b0168d3b85a6ff897aee1f07521882e1e31dfac3d46786e8253250d89bfebf852c4ae5ea839fe0503ce715fe011064790390020c68ab11a4a60cd7b3a855cbc596b06d066d4a664a4ed591c061a2654cc4108de4a0f21499548bbdeabf90203010001": "c5ec4676aeb504136f28c5fc2fafc62a6d94c6f5d2bad5fa9961498c9d974a13f357a269d34b2f521c286a41946b1e8b5557d10fa36092ae2148eb6daca37ee365755ea4c50613dbf1c455d353eeb433264d470e3db1fb16b870fbf0519a770e28ce8e3893c4f920694296c8cf03ce7ee5dbabbbaa6a3b7b38ab4903e93f81446f9ccb18f550086578aa6ab09890ed1373dd70a21fb1468cb8e75c0d3ecbe0d560aa7478ee4130962ab50ee74c9991c5eb635e34db3234f052973e09acbad8cdf245c2a634edf0611b623f903fef75b06b6a7ae651f1fab94040b4f556e0191057455c8b30d45cab767e5315ebd747d3abeae76564f294c2d2f404bdc24de4a762f20da16926404730011e1eb2d7c51638e53b7ad94b649e5756f9ea2549ce86d90e53b5e0c88d104b4fb2dc4305deaa8ba72e47890db31d0f32278b1ac845304d392451d5251d817bc3d4babac9471fb0dcd9cad3f1985a3bccb942041b2be68e48bd8a7af1f2cd8863b7e76be17fef763000025c674d8ed008692ff8b0c0e262c0687fd6c56c7a1dd8899ce2ab7f5d5718af04806c97da1f0a242ee4910317780b7ed3e331147dab7e547554dfab58ae4cbd1ae5e2132c7421fce733dc88bfc6b54ce10c513bcb435f8ea51e25c754b7c12d2a69b0745fafc1eec3bbdcefa5a63bdbb452885ebf27070c7b24d2c32cfe3d3da6eb7b3ab52e1e326635a4c0521e602e1554a20d044bdefc4265ca0ddf5ad3f52393b3f7a3ef64a01834379981fbb973559328a2f76e4d7e13bf0539eeea232badc7bea659ef56424c7a827cd921062eda81ee4a7b7ec713f4adbe1a74f7be6972ccc492e69c8183352201bd57b678c00c2f154f27bef6b20ccddbd093b10c505b0998afd710e1b26da798fcfca9f26c9baa0b526615683eef625ea5720337982238b07aae07e4996e3449a716f76ebdb4a5c6c69fa03371d54374abae3e242ad32b8d38dc555a0d5c3284dae990acd1cbae80d15ac78af56df01e160e97fabf8681dcf0b11059a7c9b51cbc51f47fee3f4fa8ca991232ff88179d5d1f20a8ccdbf68b1e6c8268bd2cdcbb5a4723f5e57dc7903e73d6af4299edf0a5687e0e2d57c0902296c0a3ea8872e1d88ea28082cd3977e4ad4e6ca1fcfa11fb88329a2a10b61a5017c268c3478dbe0c552fdb7d420a42c74f276a0438f9c5ebd68a3909a80d7c6020b05b6d29e6f9ddcc4e96835c6c5e6d5f045dbf40f593f2c09c86fa52d6cbaa2beb38415e088483512a7ae4f3dc637f5053ebd9aff1f1fbf709a75f14905cd92c84abd801fa225fba0dc9d20f5c114d2c8ea4d8e730e79d21d21150a6261006096ee8c96f8698a24a69db0e32c036445379be4d7d18048e4d048bf458a0c4ae28fb7079bfda64118c4b3e0f5bc980fe79a5ed609ed2f3f1705f98635ecee22638cd6aed22da3a29ebafe7be11b0889f5ee434808f604e4bfe7ae77f506a1336af42918e482251082db12573e3a3bd4f6017fc923037b609dad91c1a7b90bbaab9e3c299b3d2b07ee757ec2562a72366a7f878344aaad935d58618cd34a33256b3167409c4c159ac45b673d51b3534489e3e45029da34313bb7991bf863b70f0e963b3900d5b650a5266d4a257072640ba07f82099574b83c116433a78a5443a76734c9cd2bdac8ccf49a805e703fa89aa7295dde0b8a7cc0239154a4102f17a81677384425ad9dc31677bdaf62d783083f2d360fd77b28c1770d0940ca26c6d40ae57099daa36dfed"
          }
        },
        "encryptedSelf": "agD6iBWH5kO1LSUsk3XMKnUxts7qN8Z2AU7/cQdBAVQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "d691c3f8-1483-4be4-b66f-2b1645a71b0f": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d6f7595f-1778-4f5d-93e4-44b7aaf18cd2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bfa3dfb41f9d44907e87887a0e327917",
      "created": 1679927930240,
      "modified": 1679927930240,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RixEOwvZhj1Aw6aOmfronI/x7A4JCTnPiAe/DKNL6uY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d8263712-784c-4bd8-877d-6139275a8f6c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-9c5771d394b2b3eeb98b5ee5a1cc3e28",
      "created": 1679923768362,
      "modified": 1679923768362,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "3SQF+SWpMzIME4FQGx3Xe60NNb4ljKpjG2j7Ox3fIkCf9Bs9I9seabmBweP2atq4",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "da5e4f9a-5f52-4534-b258-4478db48c4e5",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4eed45a2576be66d4a55e69e9159e06a",
      "created": 1679928178400,
      "modified": 1679928178400,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "9m0h0UeWgebqkcAIiqX22O+ab8Fi+yhBjtADWT4kOXnJouRmFrdTPWI0WaBE9aD+",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "de81d3e4-ad7a-4766-809f-3882cfd6273f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b53bb92147675981be823ea24cc24117",
      "created": 1679920047886,
      "modified": 1679920047886,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "NqKPPlSBeK0i1eN5q5K/YDY7gpBVAg05vTH66VvCJQGLLxR+Mbdfhe3Jsc1CIK4R",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "df38d933-66a1-4b35-a92f-c0042b71cf17",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-15ef332316a376674169d113a042ffc2",
      "created": 1679929575705,
      "modified": 1679929575705,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "thL/Ln/St8A70DlafPLcL/i/1orxy0Rpx12qeUF0THp8rzEpqAKZaVxD7hoPMmdZ",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "df608181-d19f-468c-b4f7-6259f4c0e60a",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-a3c56660a093c6524ee96896ae057813",
      "created": 1679924395468,
      "modified": 1679924395468,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qpjPrzRgYzuLsRUK9SCPiP4F5bv+thdSuioPVr+Q2D7PFlmPa3CyDIVHVOXK91Ni",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e0fe4e99-1023-4680-b9bc-bf5d89fa716d",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b1cf64d17e38dd6bcdf46fff0095fac2",
      "created": 1679924660363,
      "modified": 1679924660363,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Argan",
      "lastName": "Poquelin",
      "ssin": "1973021014722",
      "dateOfBirth": 19730210,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Argan"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Poquelin",
          "text": "Poquelin Argan",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "argan+g4iv2fvsy@moliere.fr",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "/9Bq7mMM8KwjsRWaYPfMUKoPe278PIfBHe1NN/aVFBI=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e308f10d-d0f8-497b-b732-79fc0a79ad83",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-85c13f99cebcf1244145a5d0e9095696",
      "created": 1679920171932,
      "modified": 1679920171932,
      "author": "97baa9dc-2a0d-49fb-af1d-cb3ca9a87106",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "suayi0cw-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e3b4f18f3ef4dbe615b60f6e531be0529a25229ea8b8648610952d3eeee7cec9eedf8f84d18080d07696f4e38cb245f9befb49c143f89b7f166968b1f8e6b2207a4919df7be76f0fd6324a9a6be9f08c57ca00647fdd342a3cc63e13eb9e32d6ad01ffe7f1f3f275e1f7520cf2142b5e7bcee7ea94d29453751edc1ccd81b02fef0555ab42c91fad9c3e4dc7a1ab8c69949d5575b805e0510917ecccf9e09e0387e3d16b7319d7f3380ef17a95d1cd475f05abff8c3d647716ff7ef49191e963ff3e40e6ee7ad10314ae5bafb599280d89a4e4d0eedbd69f5dc7a1f15c05fb67a8a818038ea086da31c7da787e44dba39d2878bd52e90a3ad550c7d786bf316b0203010001",
        "hcPartyKeys": {
          "e308f10d-d0f8-497b-b732-79fc0a79ad83": [
            "af53ec9322df791f813bf428dcf3e5ee35d53a7496801422f71ee39d7dbb43fc62fe25a5076a2692b6157c38c8459b6e3712a3e34637140c57dc5e1d30aa15363aaaa4d721accd36fe3b91467e70ed43567cecfd6f3987763a44612fee0c9013676eaff38d882cce7fc5666fd45df9b0afdd4bef457720702fb27bc01131c59cf476a130fb2fca9e52fb18f70b11735167a6ad63661847c0de3df60bae34ccd48639dba0bbc9f3432e18cb5169d5d6c904be1070af4c1ed96986618ff8ac9a57fd2b469540e7e5d71f6a968c5c874eba0b1a46d4509423795be8eee214afc5be512b19ce3114596f57eeccda51878ebd2f205f224d6a885c092cfa5302170134",
            "af53ec9322df791f813bf428dcf3e5ee35d53a7496801422f71ee39d7dbb43fc62fe25a5076a2692b6157c38c8459b6e3712a3e34637140c57dc5e1d30aa15363aaaa4d721accd36fe3b91467e70ed43567cecfd6f3987763a44612fee0c9013676eaff38d882cce7fc5666fd45df9b0afdd4bef457720702fb27bc01131c59cf476a130fb2fca9e52fb18f70b11735167a6ad63661847c0de3df60bae34ccd48639dba0bbc9f3432e18cb5169d5d6c904be1070af4c1ed96986618ff8ac9a57fd2b469540e7e5d71f6a968c5c874eba0b1a46d4509423795be8eee214afc5be512b19ce3114596f57eeccda51878ebd2f205f224d6a885c092cfa5302170134"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "3c4d9a7c6c44fb9e7486dd9cb9c8ea37d07765b2b3ddcff4c75aa74159f510ff3641d757430d008e75ad785957cfbd4326524cd7f5ffad1b8984eba7690855c78c31869919aabeacc8fbdd2f7e12cd738bcdb31742d9797cf3ab246029c567b17792ffd8958d0d680ff3024bd0543894c088d7d60afb5bea71c2074788c241fd7da7f7808a0fb27d2ac2a8629c00a5a237108a22d658c2c08a269ad9ab17b54d31930004e7e080430408f4670de5b988470815cb00c315331df246e4459b95aef9830dc640b85fe79a2c6792a5399caecb45f66c36bb2560b889e9a840e028d7b9605137c8be941f1e6b3b0517602b75c40cb468a88e47641318bb7b764a20e4",
            "83c41203ba31054eae32025f8da62ecf70e8d0a416bcb9e459b346537ad65686c148ca2a59643cef54a4cc98fba09fc2b6fbabcef8e555b2eb794fdb55897c4580f47b0223c7da6863d69494f467b1d2b06e6ecd50ba6fd6290bfb944ea5f40fadfbe5139bec020647c610af0a67cd646a803648f6d794b25283c55b0ae03184cb6ae478c53f7a445f0d4e4eb9bab6bdfbe7bf5ade49b06f8e28945863625977d4100e684a3f3b33b3e0f5842762db26fc3ed84954e81f310ce1411b03e4d2ec066872fea13e6cb96c5eba9885cc0986a15f6de0e88661c00ed301b3ae4e0fdb8cddf2f141c75fc793a5a2408c01234fd8cf8348047d0b096165b37f6811e26a"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e3b4f18f3ef4dbe615b60f6e531be0529a25229ea8b8648610952d3eeee7cec9eedf8f84d18080d07696f4e38cb245f9befb49c143f89b7f166968b1f8e6b2207a4919df7be76f0fd6324a9a6be9f08c57ca00647fdd342a3cc63e13eb9e32d6ad01ffe7f1f3f275e1f7520cf2142b5e7bcee7ea94d29453751edc1ccd81b02fef0555ab42c91fad9c3e4dc7a1ab8c69949d5575b805e0510917ecccf9e09e0387e3d16b7319d7f3380ef17a95d1cd475f05abff8c3d647716ff7ef49191e963ff3e40e6ee7ad10314ae5bafb599280d89a4e4d0eedbd69f5dc7a1f15c05fb67a8a818038ea086da31c7da787e44dba39d2878bd52e90a3ad550c7d786bf316b0203010001": {
            "e308f10d-d0f8-497b-b732-79fc0a79ad83": {
              "e90a3ad550c7d786bf316b0203010001": "af53ec9322df791f813bf428dcf3e5ee35d53a7496801422f71ee39d7dbb43fc62fe25a5076a2692b6157c38c8459b6e3712a3e34637140c57dc5e1d30aa15363aaaa4d721accd36fe3b91467e70ed43567cecfd6f3987763a44612fee0c9013676eaff38d882cce7fc5666fd45df9b0afdd4bef457720702fb27bc01131c59cf476a130fb2fca9e52fb18f70b11735167a6ad63661847c0de3df60bae34ccd48639dba0bbc9f3432e18cb5169d5d6c904be1070af4c1ed96986618ff8ac9a57fd2b469540e7e5d71f6a968c5c874eba0b1a46d4509423795be8eee214afc5be512b19ce3114596f57eeccda51878ebd2f205f224d6a885c092cfa5302170134"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "e90a3ad550c7d786bf316b0203010001": "3c4d9a7c6c44fb9e7486dd9cb9c8ea37d07765b2b3ddcff4c75aa74159f510ff3641d757430d008e75ad785957cfbd4326524cd7f5ffad1b8984eba7690855c78c31869919aabeacc8fbdd2f7e12cd738bcdb31742d9797cf3ab246029c567b17792ffd8958d0d680ff3024bd0543894c088d7d60afb5bea71c2074788c241fd7da7f7808a0fb27d2ac2a8629c00a5a237108a22d658c2c08a269ad9ab17b54d31930004e7e080430408f4670de5b988470815cb00c315331df246e4459b95aef9830dc640b85fe79a2c6792a5399caecb45f66c36bb2560b889e9a840e028d7b9605137c8be941f1e6b3b0517602b75c40cb468a88e47641318bb7b764a20e4",
              "223f55731820b91ccd18010203010001": "83c41203ba31054eae32025f8da62ecf70e8d0a416bcb9e459b346537ad65686c148ca2a59643cef54a4cc98fba09fc2b6fbabcef8e555b2eb794fdb55897c4580f47b0223c7da6863d69494f467b1d2b06e6ecd50ba6fd6290bfb944ea5f40fadfbe5139bec020647c610af0a67cd646a803648f6d794b25283c55b0ae03184cb6ae478c53f7a445f0d4e4eb9bab6bdfbe7bf5ade49b06f8e28945863625977d4100e684a3f3b33b3e0f5842762db26fc3ed84954e81f310ce1411b03e4d2ec066872fea13e6cb96c5eba9885cc0986a15f6de0e88661c00ed301b3ae4e0fdb8cddf2f141c75fc793a5a2408c01234fd8cf8348047d0b096165b37f6811e26a",
              "328d75e1a36c4d3b85f90f0203010001": "005922c7e8ff30ddfe4009389b5ac0057e745a252189cd1cc6ed5aa774828ef6c8b48021021bba4a9a3d89f89f5cf4699ea66dbbc9187d82e04aefeccfce057883411b78003b2ea87fdbc47e12f06142b2e8541c9574540b3b0f62fb3c43c4319dc247a5cc8db6248b1ed0598cc1e3e44de324d4a066b9f46f3591a0093ba526eaa28051a89734759d1e7d6fca7a502241036d5b43ebc2b1ba84aaaee73a846697a3a730b531879c7c01a8e4cf77a7c02cf92c487f79a0a6f43651a296774506b4757e680e5f3cd5140ecf77b09623cd24d2203b958f15c5905165246708618d61df2bee061d25efa4b51383f581e6326ef96a48936d16acc3045acc27a96f72"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b8b20272859beff03a3e62a0e46ad697361dbdda3d341d5df89890960a5c90c9fc347d1d00d4acf35c3a4b3e394c51cade568d102f052297c7479f538269c4ae15a995f3176a8afe0958b0aa7afce36a661a248ee98b0c7d0ec6c4887cf5b3b99b2754f2bc95b95283ea64209c837f1f826c91412c4253ad0763c3ee925b96db44a095dc2a1a84ab3200a8e53deb154321255ffe793f5c49071ee933ee1b570751d0c83859b26a6ca9a121a50417973e2b69f3944e2db9d00b785af6120663cf53b3a5f291063e0ba835d3fbabd1ef6e938cc2743a212e3ec3ccb966c605a09462126d60dd2add2eb9418613b9075f058d206a47a5328d75e1a36c4d3b85f90f0203010001": {
            "e308f10d-d0f8-497b-b732-79fc0a79ad83": {
              "328d75e1a36c4d3b85f90f0203010001": "593b16031a6ea009f931e44294dd3612ad9dade1afcb5ee8fe7db65737b858fcbfdff1f98a062120bea6f78231206c3c908906f4f63f3f5fe2430ee4c357e347a61c8f94b586a69b4679bbce328fa6e38d4c0047aefd3feb6fd840b52959175172396e9fb26d388c3dc6d36d2438c880dcefc5144e6f1491989980c499f1dce904f7dd5f68ed1a45c8ae85a05613e5e2f6788a7a728c356e7fefecc5e504c09051275b14d6be29866f9045f26a23932fa4f90a477d87c9cbd767d900edfbd8a6d1c8f4e596e8c0c1a602868d4f4acc0d2ed09ec99aabf1a481fe188e7f1ec691cd1de3dd787782e669ce92a53acdcb8d3109d5f75a1f242160a3a6038499144d",
              "e90a3ad550c7d786bf316b0203010001": "81cb85f458c02af330979881bc2714cd1ab70aefab6e3f44180b00f07b72086c0f3fb9748773475fc32dd6ce3985eeec9456b9d8ce85a1c765138629a163b92c036b47fbe2166c716a00fe9d8b8f0cab7cd5d70817a6700b07a0829a335c808f8cb1fdf0005aee7fe2ac225b2f9a4211f7509a73d80e6426b707b91c80b7efc788762397c5387caaaa6f66694aa9018a7f4a91f63e615bcae9ad98d73b82531a9dab4ddd3cbf3f8fbc86e2e2f5f97a1cd5584238e81abb2990e8a3ac5e19a804e8aa4a4663d4341c3b5e289e40a95ccf4319ed5aa804b1c2f77d130bba2485423e20eba85b03d613411a7f82606669a45a5d791e2ae1e6adf6db4c461c0b37ae"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "328d75e1a36c4d3b85f90f0203010001": "12cbe036ed969e18e68a5ff488e317bec9683008401063c492aba841602fc308a05913c75d6027d8d5b82b62a492f2cc334200ca0036df42525fe6f7de3430cd23321ac32d44854a843b910dd0e971743427d4747f2cf771737ed24e4e29d24a014040fce8ddd8cbe1ffe10e187cff24a921cc167d2ce020d17431bf9a138eb6e08a927c81e72e4a9377c968405a86a17ba15261822aec08cd0da848f341c9f2639ff621182355e3f180ce773842bf60b067da766363b516deb7c228e5abc29472e876b30ea1df7e388ea0e74bdf3cd4779102775df6b1a80e90a263b4a0375023196ba8bb87acb6bf9db07a5f756a4abb823628b48df9bd4ac6863e178ba5d6",
              "223f55731820b91ccd18010203010001": "80736f18f2d81eee8322c82b7faff956ceac0fc30c1ea9d11cdb2f38efde3963afe0ab4b6c48acfc793d745d35a855279289d14e51935a047b788c3be0858450916ae38b3732b21e6aa03a7fcd6cf38eed19e59541ad7ea98f3fe5667e418210ec8390c22d8addff2991dd744fbecf6d41c181a31ecac9c32b5cd497b025161af0bc19b8b59d55fe47a45224496555e14d66de32cdf727c126fea57f5652a49b9e948da6d63c77c797d60a6645adf88507f15e2b284a11550a23e430f0cd5340260fb00de57a8f505fd88761d7adf5db8a61aa79213cd9b624a24c7f3f58cc7a6458571edaa46ca1699597e989c7752f6fd8a5887b50c8065e00e8f6452c20ac"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100e3b4f18f3ef4dbe615b60f6e531be0529a25229ea8b8648610952d3eeee7cec9eedf8f84d18080d07696f4e38cb245f9befb49c143f89b7f166968b1f8e6b2207a4919df7be76f0fd6324a9a6be9f08c57ca00647fdd342a3cc63e13eb9e32d6ad01ffe7f1f3f275e1f7520cf2142b5e7bcee7ea94d29453751edc1ccd81b02fef0555ab42c91fad9c3e4dc7a1ab8c69949d5575b805e0510917ecccf9e09e0387e3d16b7319d7f3380ef17a95d1cd475f05abff8c3d647716ff7ef49191e963ff3e40e6ee7ad10314ae5bafb599280d89a4e4d0eedbd69f5dc7a1f15c05fb67a8a818038ea086da31c7da787e44dba39d2878bd52e90a3ad550c7d786bf316b0203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100b8b20272859beff03a3e62a0e46ad697361dbdda3d341d5df89890960a5c90c9fc347d1d00d4acf35c3a4b3e394c51cade568d102f052297c7479f538269c4ae15a995f3176a8afe0958b0aa7afce36a661a248ee98b0c7d0ec6c4887cf5b3b99b2754f2bc95b95283ea64209c837f1f826c91412c4253ad0763c3ee925b96db44a095dc2a1a84ab3200a8e53deb154321255ffe793f5c49071ee933ee1b570751d0c83859b26a6ca9a121a50417973e2b69f3944e2db9d00b785af6120663cf53b3a5f291063e0ba835d3fbabd1ef6e938cc2743a212e3ec3ccb966c605a09462126d60dd2add2eb9418613b9075f058d206a47a5328d75e1a36c4d3b85f90f0203010001": "43ee03447ef4296bcbfe0255d7d709a8a95069fd285cc70980174f69bddef8ab54b4a54259a62e4708858907e8cdaaf62320f85634b753cccd3d5247e2c6620cd80fa3bab69a2c0b03e097228785b1b9136f098b8b16512bcecb5446f774973161adeb615ebed7779620f516a5ac66ec1de57aac49bb844ce4e6e2f3085f0b7b8bfa7bca6868cac9e5baabda83c4b1008a91c5425d69736475974dee28e96ee47755ce71d3e3e2da9c76da4e6db657dae4c0392fcae85149eb5167eec0f4c8fbfc508b4a2a33341f6174677ae40387c4dfbbfcbeb90fb226ae08a53aeb20b8e5ba6a5578f0c02c2ccd04c97cd9cdd1777bccd4d947691a4c46e4b30227f7843f6718b79cd5e5d814f2736977734b06ec192f8880b9cf34c55e95f6559276d4a505d2da6fafec143b63c73ed1d569ebd2c1c17723ce5b8ea0638ccebde92b5e9f0c82437bf5911cde8757c8451b8d86f1ac92aac32979cf49200df0ecf13553ae2f0c41c58557d2b99ed5ccb6ae5f05c499c9e0b72c55af522effdb7c47be97c97a7a2206bb9bc6ae964fdc348f7673e556957064f61fea70fc57fdcfd543a880b1e5b8e8b95dc23d9536ce1a7ede1b7735132a009ab2de993eca5fe5a3bdd2744c1c007a3c8570674b47273878122ee5024dcfac86ff4279d2b6a19e9433ab36e89a6a0cf5543435972edac6fa93ae552a2ed3aec61a30b23c6c9e33b7b9134343c7fc4607a8982d74ecd83981bcd04df38b9520c4f270c62ed20e0db9cb7cd98dcbffd6c968278b0535ff5a6ec3074dc6a8e2772566d5e1394c7741654cf3eb294824e5aa4a9f3d41ff3c315ab6019e8cc088c0f490fbf52cdaa9d6deaae4c9a609f5296e26f08f1e7692ffae8e32d227e83abb3ea1a316fe6a1340bb22440f3782c71c207929177410827c572aa5230227fd4e1727a427031bb94ebea55aca4a1c87f8dae414fabdea17194b4a320c56fdfeed3dc33662a1f3fda872bd79a32a09f4ba859b4f7eb56657a28664dc6d2c838d7ad0a1b5088e1b4fa17e41741e1577cd3df8710784a51e765d1ad081434f7da79fadd5796a4fd3d9606113a7e89e8ed77f4968108fc1de354babc6c25dba23cc116c797cab8722c58adcb5bd1d1f8b5555b5ed9a7c5d022f5ebeb88945172f3b20d5916b389d9f6a7a959ac24ec6e61d9975b18f8654bde66b0920f6b58403e7f22969f5f201a106a2b3022a28e9c8e6017058c3b3f5f49414b1dd4ca57806a233462f33303009bf4d471aa500c7e468d17396ea89ed79d490912bfbf385ff7bd0416c371b8a01ae26cb3bcd55ccebab42c9d27e52d2ce92b45850c588b762080c41406b16bce63815acb1e16d720ec2224ff2299743b7db4bc3fc0e91868114913b7c789bd160b564b81b622e280b2f68985a492d180f116fe487b5207f09966b022e46cd2dcc41893cea83147bf493ae2f5dd1fd96edcaa0dc361b5aba0fd1a7609253c06a8dbebad7aabf3c5e020c74e6fbf8562df854a0f81a60fab8526f4c18a63ff9dd44dda4f5f7d73538eb216aa3cfb0156011dce2c9082a2ce7fc948b9c2d5228c79d0665bae6827739bfc9ae3208d56c7c57a89d718c5225e1abdb54beac4f7a9a1e1b0dba3684e2c996429aea7ee0eedb09696ce14a8ca5693c98a992f7f65a14fb446886698e9a72e68f5e0f71f5975f550e6dd450f4a99c81da94b2d5f4160e53532f39ae3b0d14bd9b3f55d77888993c6404b4fcf8b8843cc15a2864ed1e385fe10d3cf3eea1"
          }
        },
        "encryptedSelf": "1i/KIKrDr6dVwmRxgfGG9h00Jm0TotK94EE03vjrby8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "e308f10d-d0f8-497b-b732-79fc0a79ad83": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "e308f10d-d0f8-497b-b732-79fc0a79ad83": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "9-38c5ceb1dff472f3e8294cfc52c9af9e",
      "created": 1679926202136,
      "modified": 1679926202136,
      "author": "6028a43d-c3a9-4071-9634-915c2a578269",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Daenerys",
      "lastName": "Targaryen",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Daenerys"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Targaryen",
          "text": "Targaryen Daenerys",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "addressType": "home",
          "telecoms": [
            {
              "telecomType": "mobile"
            },
            {
              "telecomNumber": "0q3rki4mn-dt@got.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "publicKey": "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bb0d8bdeefc4a584ad6317bec80affccbc88ddd774cc66865922fbc2a7b01f5578c53915d2e1dd2d257d8dc48436ae13a0bc385e83ef64225d06acaf68863efb9192ab34adfebc918e4fb7b145181e984bcbe3a8313939b22d10da05f53ba4e577279e2ce10d860ff9b124a36f0ca3913d19b7137e603c282ff5d04871512b7ae4bacef0e73dfa20f1dcec61ed9a8635ab6a4a5b505126d5fbaeaa3525e523c22d84aadca1dd57872ed6df7586b29b9a68bb88b04dd040c56a35edc6886370cdba80736a21978a18a58db820303b41647a056a9e7afca060d7f407cdde1f77983d06cce4c0fb2fd9a9e71a4a15738854447347cfb42c3292b06cc950f42a60330203010001",
        "hcPartyKeys": {
          "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": [
            "0362809cc2292e5f7e20a30dd1c0ebbf0597443a35ab1db89d6c6b0040e477913bdf015764f8f1a26ddc7ba1143d613ef87ff2c2a35aa119b8268ba02ddf59b401fab5c3e30f16773696febb8625b974ffa75e6d011362aabb224cedc1944cb46bf927d521ea18b85108e0f2d375164cc016cbddba4be12cc358512943f1483f28c21ad0fa69e85e4101452a06dab6202fe6a6b2042ae8f4e92d795e20df6f89756f955abc3b4ae1ae4a86092494b729a86ca73bbd3bb06edf688374d8cb1c3b426e151edd703e1ea9b15d0b7966c0a350f458507fd5b74e2b8afe19f11d86de0a5c9aad1da956d4da9a2e78236743ce0aa077dca522c6477f96b0ab0d6a4948",
            "0362809cc2292e5f7e20a30dd1c0ebbf0597443a35ab1db89d6c6b0040e477913bdf015764f8f1a26ddc7ba1143d613ef87ff2c2a35aa119b8268ba02ddf59b401fab5c3e30f16773696febb8625b974ffa75e6d011362aabb224cedc1944cb46bf927d521ea18b85108e0f2d375164cc016cbddba4be12cc358512943f1483f28c21ad0fa69e85e4101452a06dab6202fe6a6b2042ae8f4e92d795e20df6f89756f955abc3b4ae1ae4a86092494b729a86ca73bbd3bb06edf688374d8cb1c3b426e151edd703e1ea9b15d0b7966c0a350f458507fd5b74e2b8afe19f11d86de0a5c9aad1da956d4da9a2e78236743ce0aa077dca522c6477f96b0ab0d6a4948"
          ],
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": [
            "57125496483fdcf9adc3d0d48f417a952cadfe20a996918c09b0e45f1bfd4fe761c9a6c3b378cf5d3ba17426309c4f1e8d48420a5f438baa90793c7e735187e760f6f19148ac4fafdf408a218e703ca1f3415f4a5f3ad3856c8dd212fb557013bc728262114eb9e02c4cffca998c7bbfc4d5786666540c94318cb8f332eb2dd5f0026a89b307e5c69df9cc6dcc619d5cbda72e4c9bac30b3cee5ce90a59285df77e66f537dc0bed1f6bae0180a3cd2c1b82c6d559d192afd8bc67c1ad9663e5ef3c656939d7fcef6c92acf776665e0e5f3cc01a041ce04591e12ccfbd7b46d87a27750f4785e058b0e393ae1e1fe30e63ee2785ec534f950051dccbf783d1e0a",
            "ac52cf0e96b2ca82e88f2004b0c92deb5a97d501a78208243b7911292a6e4960cf5bcc6fe34e8d990c926f63f5f5c8381b776d61c4ad597c66dccb909bcd27233cc16a5ff6b26410d00aaae02f9f379045d34a2ce4d4038cd66268ba107e7fd8c40cacffe6e998373ed1b7f3172056a8215cc42ecb887f1e8412b6931ed4e6e0799518c5459530b44320f420c3e9ac35ff0c2663906161f891adf5adccc7fbe370b77ee85b704df0652f879c81b3a226cc408ceee53a713a375eddec154580d34d6526627e912534309123e3a4d0d580c0d4efea970c79b36006ffa7246ee17e572937edddba778ed5f9cb68e61b28ffd7bd05975f8ec8cda0cb0a67a81cde3d"
          ]
        },
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bb0d8bdeefc4a584ad6317bec80affccbc88ddd774cc66865922fbc2a7b01f5578c53915d2e1dd2d257d8dc48436ae13a0bc385e83ef64225d06acaf68863efb9192ab34adfebc918e4fb7b145181e984bcbe3a8313939b22d10da05f53ba4e577279e2ce10d860ff9b124a36f0ca3913d19b7137e603c282ff5d04871512b7ae4bacef0e73dfa20f1dcec61ed9a8635ab6a4a5b505126d5fbaeaa3525e523c22d84aadca1dd57872ed6df7586b29b9a68bb88b04dd040c56a35edc6886370cdba80736a21978a18a58db820303b41647a056a9e7afca060d7f407cdde1f77983d06cce4c0fb2fd9a9e71a4a15738854447347cfb42c3292b06cc950f42a60330203010001": {
            "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {
              "2c3292b06cc950f42a60330203010001": "0362809cc2292e5f7e20a30dd1c0ebbf0597443a35ab1db89d6c6b0040e477913bdf015764f8f1a26ddc7ba1143d613ef87ff2c2a35aa119b8268ba02ddf59b401fab5c3e30f16773696febb8625b974ffa75e6d011362aabb224cedc1944cb46bf927d521ea18b85108e0f2d375164cc016cbddba4be12cc358512943f1483f28c21ad0fa69e85e4101452a06dab6202fe6a6b2042ae8f4e92d795e20df6f89756f955abc3b4ae1ae4a86092494b729a86ca73bbd3bb06edf688374d8cb1c3b426e151edd703e1ea9b15d0b7966c0a350f458507fd5b74e2b8afe19f11d86de0a5c9aad1da956d4da9a2e78236743ce0aa077dca522c6477f96b0ab0d6a4948"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "2c3292b06cc950f42a60330203010001": "57125496483fdcf9adc3d0d48f417a952cadfe20a996918c09b0e45f1bfd4fe761c9a6c3b378cf5d3ba17426309c4f1e8d48420a5f438baa90793c7e735187e760f6f19148ac4fafdf408a218e703ca1f3415f4a5f3ad3856c8dd212fb557013bc728262114eb9e02c4cffca998c7bbfc4d5786666540c94318cb8f332eb2dd5f0026a89b307e5c69df9cc6dcc619d5cbda72e4c9bac30b3cee5ce90a59285df77e66f537dc0bed1f6bae0180a3cd2c1b82c6d559d192afd8bc67c1ad9663e5ef3c656939d7fcef6c92acf776665e0e5f3cc01a041ce04591e12ccfbd7b46d87a27750f4785e058b0e393ae1e1fe30e63ee2785ec534f950051dccbf783d1e0a",
              "223f55731820b91ccd18010203010001": "ac52cf0e96b2ca82e88f2004b0c92deb5a97d501a78208243b7911292a6e4960cf5bcc6fe34e8d990c926f63f5f5c8381b776d61c4ad597c66dccb909bcd27233cc16a5ff6b26410d00aaae02f9f379045d34a2ce4d4038cd66268ba107e7fd8c40cacffe6e998373ed1b7f3172056a8215cc42ecb887f1e8412b6931ed4e6e0799518c5459530b44320f420c3e9ac35ff0c2663906161f891adf5adccc7fbe370b77ee85b704df0652f879c81b3a226cc408ceee53a713a375eddec154580d34d6526627e912534309123e3a4d0d580c0d4efea970c79b36006ffa7246ee17e572937edddba778ed5f9cb68e61b28ffd7bd05975f8ec8cda0cb0a67a81cde3d",
              "980ce887e0cbc490d2d6930203010001": "38743c2da6623a85d515fe5484922f4d17a6006db79dc45e2003fa6c695a85627dd86e0922b95ed64d661a82d32be5f25bcdb751503b2b51a6479d2767e00e594950924891ae9d2b578f8627c5faca35cda33f09ad621d728c646b420c9175cbbd6c9a8df026b9cd94dcc3af7a05b1995d20f6c1aca97709778216b1bf79f6b28a9bebf3c361c0c513d57e4f9f5e43208cf48d18e01f00bfb7ef48a6486145c68401384cc6f261f6a910859e45345cb80211c95c214921f0e461d41063c27c8e3abae6c23837b0fc88f9bfc26c8364b3d51f1406e9c803ae59fa090b423e2f1fb775fd7ff66d1c7295ebabbeaf97b16e05e0d3c396a805924594169e54d6093a"
            }
          },
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c0a6df018127ddf91b83f27e950f726cce97e7d70bbe751898ae52da9844c9a0d3b96db621389c41fe2344e4dd96a02f1b647937be61eefdf00ab48c8876e258b15606d63b904f0a67e35442f438d568a55471607a76b3933aeb5904233563673252d3791edcb603bb945df4cc0a1e7e4ddbad0d516ac4de631810fcbbb886ad1181b38e0d11a274e743cbffa761bfd7ae229268a7976f26f7eb4e22f9723dbe5d6df3a25f7af9b351243fd1a7e4a1546eca8e392f14f63563436d67558ab6ee3453f101d7e6a9725b9be42d3271486c61d466ff78b2831b262127073f9376656843de17092ed061dc8537104c604c14f6d350b9e9980ce887e0cbc490d2d6930203010001": {
            "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {
              "980ce887e0cbc490d2d6930203010001": "1530959f2bc4b424c77a128b87459f57306ef330b6e8af23a64e69589e5d0935e40a56995651810d47f13546b505879997707b90d679ec4a07f462334735656a234826c8372fa960e25fdce1c7a4d4183f305d61a905d76b312164f1946c148e30be764899fb5655e75e27b4cd7665a72cc143ef68664f33f205b076e0c2bfcf1a5824fb78fc4d98c893365dadc3dbd3e36f37a136d33717c837b6d7f355ab8d07886a09ed78828b18ffc5e83d60a6de04e4185b40ecefa7851f328f627b0e6ddb8f04dbdf1540e313c12a856353ed50b12b1a740c8b1532f6571958075727ec17912ac39e5fa8e8f603c4a92dac2be93ce16de1f5eb2d58c67d00bdd4000549",
              "2c3292b06cc950f42a60330203010001": "34b9762c17769f36b6c79ec4be8fdf8b4d95b9d5ba1230028767fc13ea21efbd14ae397bc14cc3acc13216535f3b0a151c736d48b9a84ffdcb8d39b7d512f27c509ab6a0d4235f56b114f1be08b546b12e2cb8655e7a04afaaa31bef3a029a846ccff0fd969c6df009aab0e5db7569ca11a0d30e4cc13e02525d45be35ce97faa99118197206581a15a871c1447439395c57bc6e58020ce3476fbb20e68bd5e86053a8f2db8899eaca98c271e386c3dec3ac63d612867429d97d911949d425c44cd927ebe96300c75e7286ce6501c6c9e08218a97996129268525148c5ef4e730e8a4339eaf8508bc62d04421d83efd3f1cf0d3f5ba984524fd3b5b41917689a"
            },
            "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {
              "980ce887e0cbc490d2d6930203010001": "35987363c289dfff9c30a8dc8743622e99c3e1ae18be436db6b072172162aafe18b86e5d2fa6cf1b4e1c50adf0e44030cece441b212ba941778dde473873ce5c0dcaf7b888bf672bf4dfe84e378d276bd708ccef60c14cc3012377ff9009223120f2d33e2b8dbec5ec03181008eca47b1f994e2574e82283e595af53ec63fc076efa0e9d327e4f80ddc228fb727008e29d40f1f821238ea41d71036c13b3ab7556fb8ff8fa820e0994d633b5124d5077d6098f2fce5ae0b15119345ca679a7dc5942d0fc03e44f3ce36390c7fb7ff465870ff5792f076d9265fca5d0db5c7addf02199038f66fcc9502e0adafe1616661d8cd48e176945d58163bc9a6a776547",
              "223f55731820b91ccd18010203010001": "3f3619bdc420d98f7ea6127aa93a35423d9855d01d8bf92f261a53c1b66a7c3f43c7fb5f58e930ff649a881d3de826c738bd671a2e5c67d1cbc83fc1b35464b430307cbef498d270cb7beab0bed7fd6a95e0a8620b61daad0017d6aec9c56290939c245628c151c465ef3a1f6fe6ac093d08e289b1e709a58593d828a8bebf75176de8e78e6419ff4fe8824e4c409ef95e2ebb78d5d0fb40537d9e11ba8d7622f7966afa59abaab495f29621cfe9f62c2642332a3c581b73fe6da6b8b2817fc8bc6724ab372d8c62aeeec1e396074a522331b1fde423eea8b02b7f1dbaa5001a7684b73910b2b1d3b48d4767998806e8bbe31acba2703560535aed370b19f2e1"
            }
          }
        },
        "transferKeys": {
          "30820122300d06092a864886f70d01010105000382010f003082010a0282010100bb0d8bdeefc4a584ad6317bec80affccbc88ddd774cc66865922fbc2a7b01f5578c53915d2e1dd2d257d8dc48436ae13a0bc385e83ef64225d06acaf68863efb9192ab34adfebc918e4fb7b145181e984bcbe3a8313939b22d10da05f53ba4e577279e2ce10d860ff9b124a36f0ca3913d19b7137e603c282ff5d04871512b7ae4bacef0e73dfa20f1dcec61ed9a8635ab6a4a5b505126d5fbaeaa3525e523c22d84aadca1dd57872ed6df7586b29b9a68bb88b04dd040c56a35edc6886370cdba80736a21978a18a58db820303b41647a056a9e7afca060d7f407cdde1f77983d06cce4c0fb2fd9a9e71a4a15738854447347cfb42c3292b06cc950f42a60330203010001": {
            "30820122300d06092a864886f70d01010105000382010f003082010a0282010100c0a6df018127ddf91b83f27e950f726cce97e7d70bbe751898ae52da9844c9a0d3b96db621389c41fe2344e4dd96a02f1b647937be61eefdf00ab48c8876e258b15606d63b904f0a67e35442f438d568a55471607a76b3933aeb5904233563673252d3791edcb603bb945df4cc0a1e7e4ddbad0d516ac4de631810fcbbb886ad1181b38e0d11a274e743cbffa761bfd7ae229268a7976f26f7eb4e22f9723dbe5d6df3a25f7af9b351243fd1a7e4a1546eca8e392f14f63563436d67558ab6ee3453f101d7e6a9725b9be42d3271486c61d466ff78b2831b262127073f9376656843de17092ed061dc8537104c604c14f6d350b9e9980ce887e0cbc490d2d6930203010001": "f154c76de94e6ef802ea4d85d8ca73bcc740c8e07de827b7f6062ec8eafdd21bc733f613a12667af72ac533640525c8390061ecf717d83b5074e3dd5da7053fb359fdd8fcc3a58a126d2e09aceb583ba5a5734fea1bd1e2cf9a04232c72339228f271e53488773c10014f2676de07da5f41496b28bde4cbaf232ad07eaef0a93759bc90622e6e3715290f661c548d76caa780d45bffc296406df77b6ab13a0bda340b8b9a677b0bed83b869c4869489d41ebcce46dd9124b83d05cde135f2accfb2cfdbc69e8d9d562f131bdbf06e29337513d7f6ce4fc997af207282465b8353894619495d083b5c976edcf5c133f7db51c73ef8d41961a16b5ce3e8aabcd5386caef3d3e985dd7120152034e6bf619ce0bf54a660b2346bf7415175f2174a5c536c41e137e88179bd2e37af34f3c2a999b7534c1b1ea8c874ef1771dbbb544360aa12c09241539854b2873c7283cddab348528623437b4f10876415f11d11892d25c3c20175165e763b895d08a6d10e830e3d45847ae2a3e6c1aa92427b37c289796c28062bb966d851222f8dc774733d500924d27d506977483181f52cb0eabf60a1eb64327d2e7e94f031641159a3c2d68fcabc8724b3c252273bde896e632f3042c699dc209a4553796bd6731cdbba0a468823054730c7f6a989dad1ca1fcd8972ba7010e9d6e7992c1a03e7574bb4a98ec1aabf982b38f98eb7c922f5c050a2e74a743cceff49384a1eaccdb8fa52925498a45ca83dd55e3ae498158860999a19c16ac33c5d87ab8e7def7db845162ff03b327d17d510aa9eccbdb02efb787bc8b6b295bc2052534b5cde9d342d4693164e384a52ba1bad3b8af159e17ea8f22fa21a4464d392df262441f1bb0a1b18e9c3e70fcedf3e668790481e4bf7d8c82e9fa5cc0d269bbb1f2c763172980184639accc35ad724175c9ff31bd6c0b8e89046c0e958d921055f2ebd0f9afb7cd94872ee6116535b65f33a5aa3069de0bf364f12458d44229cd0ceac38387655d924cab09f3e953a11cf28cc414ecb1f441fadddcba7039aa284747f132bf4e77a3cc539dcf024714e6672865f1974649eed9936b3bd6d04824f2b9ae874d0bfd56bdfeed21213a59b9f23f819e99600f5e32f0bdd1d4185cf60d87d80b1f28f20b1f7ead47f07db6f8deb6a03d73b14e058b9cd68dbad20a94b56ba769287daa1000f120afb9c05d162a3e36a9dda2850d410aff9c98b343bad7c2d958731d4e675d69bc3f6be64ec2a1b6eed77d3f44253e329636074e562251f721419dc5defaf7dd9fbc49fd0a1fda43c295ac9fa64e26acf7d6f603f1a31ac16d07d445054a5a6e33f277378071fbed5897c39d719d162dcffc316c21c11892b34c76d1a76a13d181513e3f5c07768254225ff7a0f83be7a83952806ff8c7281aae541e0930dd04605564614bacfdbe7639bcae5c621ac0acb62dfb9d8c657f407d40adcf13e80f04379d78027eb5235038d504c3020ff5ddd75a8f7a9b73ed67a2cab384dfefd415ced706d63ca22ccb85574af99785a687920959d9699ccd6bbd6257287de729f7875b3a78ad3990f9c9868771c64d81ef6f67ddb8827c152532e10c13721c5bc3d1802925c84335c7cb28611a910f34fabbd71aa13dd6a0411e15015d3165b325a0a8ec01a4950845c785b5b0be64467b677c066b7601a1ddc9b54286f9423298af18ca01c70e265cdde439d30589423f9b3c89672972b03aa97d7b95de142fab68301c2079172541650f"
          }
        },
        "encryptedSelf": "bfWdkLHJx/jV6s7XLy9nCz7MFIB0uabvhb1JvXDkchI=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "e47e6e2f-1e4b-461d-9b92-a3914b4ad7c4": {},
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e52ffa0a-0928-49e0-9e6f-7fac40b35205",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-9299ab144935edf94c108643a683d6e7",
      "created": 1679920613824,
      "modified": 1679920613824,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "cbjW/NZ58oJr1i2NSEvhDHOxvBWHcSCeT7pC3fEhkA2FJ7ymdECvIolyEIwHjx1p",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "e6b3d85f-b534-446c-ba68-329f7670ced3",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-a876b36c3746d69cd68eb02ba07b73c7",
      "created": 1679924665470,
      "modified": 1679924665470,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "EQgGa2nxfSFPLNjeDXhGBG17fVktEZKS1pUTh6d8h1J8/W1HswNyJGb2zt5CouTP",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e70f49f9-a2b8-45fc-8571-0aaff9d9bcfb",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-338769f8a9802c60cba6b6c05eab96f4",
      "created": 1679929418609,
      "modified": 1679929418609,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "E4hkBCA1WOtDTdkB6uwEp4/Ns24ccdvc+HExesmFCVcZVU7SjEP+UtXiPryAYR0P",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "e96aa862-1c15-4d02-9e94-0c0ec0ef03ea",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-658b04775acb28ef5d5abc690ea6bf16",
      "created": 1679928209112,
      "modified": 1679928209112,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "4LWmRNLtr5vUG2iYF0y3SR9lhUtiBq7BAG5MkSo3mi4NXVIMzQmSHL40x1Xj4C5Y",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "ea3e9c75-57e8-4e85-9358-12f4e7d2ca5e",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fe5e60c284692c15249a9b24454eae00",
      "created": 1679928200511,
      "modified": 1679928200511,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "2Oci93mAq14/I0u/uHqGMVS0auxMGrZT1tLpkhNo3HgN13oA+fcyiEXKITOzIJTy",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "eb8c78fd-265c-48be-be1c-73fbaa6b8366",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-9e1c5d6569b1c9dbbb9f75cdae73b476",
      "created": 1679926274204,
      "modified": 1679926274204,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qRgD1novJn3o+W4XQ4HkcQsODOd7g03rTeXjub5QLPE6wEBD2mj7o9/Kc0IUm+9C",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ecd4f07a-bde3-4cf2-94da-53768cfac2da",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cbfbe75f9dab0a738eb99ecc88f768b7",
      "created": 1679923792680,
      "modified": 1679923792680,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qLGo6M6HhzvjvqUjeMNDrk6dVyRUfkWydETfRjDug3TuSeYxHNC1ztJ718pRf7sQ",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ee7b3303-9ff8-437e-babe-d438f718b920",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cad2903865d6f47aa0b29a7db99caa87",
      "created": 1679929563558,
      "modified": 1679929563558,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "AukaLlP0DchDoESavSMe2WcIHnrpXv7QcOiPo5iN2AJIVqpLHGc1s7Y/EntcGngG",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "eeb7506c-728e-49b6-bbe7-9627a6595518",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-3acbe8b265cbdb168ef267e61b1cb2ba",
      "created": 1679920203798,
      "modified": 1679920203798,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "PGzNcKhGmqz6Ta5MrIoKF4P0NPgUuRyzCWF9yJU5A34=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "eee8ee7b-5643-47b5-b14b-21548b3161f4",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-da8313be4f2c9d3e81ee6c91781ce036",
      "created": 1679925845627,
      "modified": 1679925845627,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "uzPymDGxyb8BA6gm0QdhFRCB4dVvxyjH3AT0cahG+vFofcUBRfKbFJNf066LmXDL",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ef2580e2-0593-4c8f-9794-187a35b74939",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-7c88935dc823a93e3db6fbdeea1475b4",
      "created": 1679928142283,
      "modified": 1679928142283,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "YE+bV+MFPrNyEmJ+UozsjS0yXUE4WBMhoeNzYhRK/4MUX9KoR/8773N1fxGdHchU",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {}
        }
      }
    },
    {
      "id": "f38521ed-48ef-4ef4-add7-66f96cec68c6",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-99a6d048638302e869fcf3ddfbf9b2fe",
      "created": 1679924407239,
      "modified": 1679924407239,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "PHH3AmkDAdPePQOFcVWvn/fS+fIPwQM99qkPNdgxMS+Xfbjq85qFRxKfy/TvSEUy",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "f3b3c3d1-af17-4f77-8968-df95759d9496",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c1a0ec43599c122711a46439a91aa7e4",
      "created": 1679926405138,
      "modified": 1679926405138,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Marc",
      "lastName": "Specter",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Marc"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Specter",
          "text": "Specter Marc",
          "use": "official"
        }
      ],
      "addresses": [
        {
          "description": "London",
          "addressType": "home",
          "telecoms": [
            {
              "telecomNumber": "c74fd58a@icure.com",
              "telecomType": "email"
            }
          ]
        }
      ],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ljJsvn2+gWjuuAA6W/Xj2ljcsRj8CGuT9HdP0LY617Q=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "f62c2ef8-a920-4a39-9789-ad7c28b6be30",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d96cc00bdb0b47870c14f84d2508a02b",
      "created": 1679920199400,
      "modified": 1679920199400,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "6MFmgA4s1sp9EyNiqi+6Qqm+35YjCx4JgCGTyh1Sn90QvYmXZCDf+IYgwqFmwpCp",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "f70adbdb-5e38-4253-ad30-355739c01ed3",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-5ee45324d4dd3cb4ee737d6df779570d",
      "created": 1679920313386,
      "modified": 1679920313386,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ATkMfUWdfq9nckbEtqRiJ8TdY5JrZBOgC2NtgTapJkhFNkcrGb93wMIPv4VfK7qt",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "f817d7a6-ce5f-41a4-a79b-479f8e09e3db",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-870dd2582fac7b2240c5dc2747cad72a",
      "created": 1679920250530,
      "modified": 1679920250530,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "oYB8gTADSfKJymUO8Gq8/R6tNqTeXJSeCsBabAVnd069xFLUWoNzDsoSfOOfhnM1",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fa087567-2b8b-45cc-a033-4d268e47ba17",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "3-8aceb255bfae5f18a624d91a5dc25e67",
      "created": 1679924674079,
      "modified": 1679924674079,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "John",
      "lastName": "Snow",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "John"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Snow",
          "text": "Snow John",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "unknown",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "nE40JiEaOnMMrhRB58L3szuP6PDLmLHbbgyX9ZHywrFaHvcxqHFU0ENnxviwvycW",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {},
          "396f6d45-1d92-4bca-888c-086d8415aef9": {},
          "3238dd4f-be09-4375-bb5b-0bf9d737ac94": {}
        }
      }
    },
    {
      "id": "fb83cdac-3b41-4668-bfcd-530a8d0de9b9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e7a421c67e5dc5cef18bd0f6ad3a3ec4",
      "created": 1679928213669,
      "modified": 1679928213669,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DHKm2EgJ2t2UZErPdLYW2RTfgJlaqYdRmMWoi3Nqoe4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fbe12621-15e9-43d5-a601-8c41551061b2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-64c57b1346628168ac2beadd3675c231",
      "created": 1679928213619,
      "modified": 1679928213619,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "xpKQdh1V7n4O7N6eIIZwNhat58ZajmRixBBuEB2Z9yk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fe92c192-e8da-4dd7-b6c0-a270424e11f9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4b48746c1a99ab5e1de26ff3139301e1",
      "created": 1679925890246,
      "modified": 1679925890246,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qAXU9JYJIk1NGaYvp+6M3+lfHTcBeZ2/9YnHvntwHXk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ff069860-b2bc-4ab9-a86a-efb2db595c7f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-b9ceb4ebe42f7a4a8d9de7fa2bbf4f2e",
      "created": 1679927930196,
      "modified": 1679927930196,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Arthur",
      "lastName": "Dent",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Arthur"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Dent",
          "text": "Dent Arthur",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "male",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "QlCznyqGtt0CdiJPZT7H/YbU6yF4eNOoX4lJNrYeUKg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

### Intersection Queries

You can define more complex queries by adding more parameters. The results will be the set of entities which satisfy
all the constraints at the same time.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with implicit intersection filter-->
```typescript
const ageGenderImplicitFilter = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .ofAge(42)
  .byGenderEducationProfession('female')
  .build()

const ageGenderImplicitPatients = await api.patientApi.filterPatients(ageGenderImplicitFilter)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderImplicitFilter.txt -->
<details>
<summary>ageGenderImplicitFilter</summary>

```json
{
  "filters": [
    {
      "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "minDateOfBirth": 19800302,
      "maxDateOfBirth": 19810301,
      "$type": "PatientByHealthcarePartyDateOfBirthBetweenFilter"
    },
    {
      "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "gender": "female",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    }
  ],
  "$type": "IntersectionFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderImplicitPatients.txt -->
<details>
<summary>ageGenderImplicitPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 11,
  "rows": [
    {
      "id": "433c5f0d-7729-40f3-be00-996f89a62c93",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-779d9a5460eac465694f6cb57b471c00",
      "created": 1679926583577,
      "modified": 1679926583577,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "rhbmYnggOOf67/RBN40X0DXdqdMS8BykyhGSiCpVTnc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "65aae741-1ec1-4804-bfd8-9805954dc277",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6cb13d1b28d29914e5aa64b6f0e2bd5e",
      "created": 1679924677206,
      "modified": 1679924677206,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tCAd3jqSfPs/+W/kehJHn3iVat2Sjja651FRTPeaPvQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6e17112f-4e9b-4d1f-aab7-697b24d620bc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c009f19e85e158443b7a9a0c0506a342",
      "created": 1679923819398,
      "modified": 1679923819398,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tWmRIQ542ErVqEtOMyWE8dWEVM63PBB68AwlOwNiDG0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7be9d261-9af7-4c3a-989e-ce7ace579164",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fa3521cb82f1c6b138f3a627787aee32",
      "created": 1679929426949,
      "modified": 1679929426949,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "djXg30lm1/VfQ5rhFg/MYdudmQ4bHqaiHDhxCUKSTsg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "833da281-4969-4f97-b0fd-646791006105",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fcf4dfb83c5af82eb6fd235d5a14c8cb",
      "created": 1679929596429,
      "modified": 1679929596429,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iqx5ZTJwJmNtOiYXt1z3gPvgdxffmfCGG+YT3IcZky8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a329e3ec-60e9-4984-aad9-b611794321e1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d684a0704e30f69ce612ea8da429f3a9",
      "created": 1679924419559,
      "modified": 1679924419559,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "+MoXjWPT05eMDPMojBdHEa7Y4sJJE5m5oEcpgb9qadg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a9d5e13f-cca1-4696-b485-7b7cb1671e24",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-da64079938bbc1e49c9ea13028016034",
      "created": 1679925890323,
      "modified": 1679925890323,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bXGDNQx4vvx3KvSSRqhgBB3AZrAjpvqyRaYl/DbONd4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b42489e5-2576-4a1c-8de3-cdc65e6bcafa",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0cfe8ef00dc7a6314e13a35e8ad3c969",
      "created": 1679920203751,
      "modified": 1679920203751,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "NxPQnLeGLM675xyVsH9xZQ/vboqDP4XvFjR/JE4VPgA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ba23f2ff-d254-4eb4-9c92-b72f4bf7342c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ef2ff32a7d94e89152f2bb94b1329b92",
      "created": 1679926265515,
      "modified": 1679926265515,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iX2zm3QbJkjTIFaUN6mZUFRZClBQcFuq39v7fy0tTWE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d6f7595f-1778-4f5d-93e4-44b7aaf18cd2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bfa3dfb41f9d44907e87887a0e327917",
      "created": 1679927930240,
      "modified": 1679927930240,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RixEOwvZhj1Aw6aOmfronI/x7A4JCTnPiAe/DKNL6uY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fb83cdac-3b41-4668-bfcd-530a8d0de9b9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e7a421c67e5dc5cef18bd0f6ad3a3ec4",
      "created": 1679928213669,
      "modified": 1679928213669,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DHKm2EgJ2t2UZErPdLYW2RTfgJlaqYdRmMWoi3Nqoe4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

In this case, the method will return all the patients that the hcp with id `hcpId` can access, whose age is `42`, and whose gender is `female`.
You can also explicitly intersect simple filters using the `intersection()` method:

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with explicit intersection filter-->
```typescript
const filterByAge = new PatientFilter().forDataOwner(user.healthcarePartyId!).ofAge(42)

const filterByGenderAndAge = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')
  .intersection([filterByAge])
  .build()

const ageGenderExplicitPatients = await api.patientApi.filterPatients(filterByGenderAndAge)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/ageGenderExplicitPatients.txt -->
<details>
<summary>ageGenderExplicitPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 11,
  "rows": [
    {
      "id": "433c5f0d-7729-40f3-be00-996f89a62c93",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-779d9a5460eac465694f6cb57b471c00",
      "created": 1679926583577,
      "modified": 1679926583577,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "rhbmYnggOOf67/RBN40X0DXdqdMS8BykyhGSiCpVTnc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "65aae741-1ec1-4804-bfd8-9805954dc277",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6cb13d1b28d29914e5aa64b6f0e2bd5e",
      "created": 1679924677206,
      "modified": 1679924677206,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tCAd3jqSfPs/+W/kehJHn3iVat2Sjja651FRTPeaPvQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6e17112f-4e9b-4d1f-aab7-697b24d620bc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c009f19e85e158443b7a9a0c0506a342",
      "created": 1679923819398,
      "modified": 1679923819398,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tWmRIQ542ErVqEtOMyWE8dWEVM63PBB68AwlOwNiDG0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7be9d261-9af7-4c3a-989e-ce7ace579164",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fa3521cb82f1c6b138f3a627787aee32",
      "created": 1679929426949,
      "modified": 1679929426949,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "djXg30lm1/VfQ5rhFg/MYdudmQ4bHqaiHDhxCUKSTsg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "833da281-4969-4f97-b0fd-646791006105",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fcf4dfb83c5af82eb6fd235d5a14c8cb",
      "created": 1679929596429,
      "modified": 1679929596429,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iqx5ZTJwJmNtOiYXt1z3gPvgdxffmfCGG+YT3IcZky8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a329e3ec-60e9-4984-aad9-b611794321e1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d684a0704e30f69ce612ea8da429f3a9",
      "created": 1679924419559,
      "modified": 1679924419559,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "+MoXjWPT05eMDPMojBdHEa7Y4sJJE5m5oEcpgb9qadg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a9d5e13f-cca1-4696-b485-7b7cb1671e24",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-da64079938bbc1e49c9ea13028016034",
      "created": 1679925890323,
      "modified": 1679925890323,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bXGDNQx4vvx3KvSSRqhgBB3AZrAjpvqyRaYl/DbONd4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b42489e5-2576-4a1c-8de3-cdc65e6bcafa",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0cfe8ef00dc7a6314e13a35e8ad3c969",
      "created": 1679920203751,
      "modified": 1679920203751,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "NxPQnLeGLM675xyVsH9xZQ/vboqDP4XvFjR/JE4VPgA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ba23f2ff-d254-4eb4-9c92-b72f4bf7342c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ef2ff32a7d94e89152f2bb94b1329b92",
      "created": 1679926265515,
      "modified": 1679926265515,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iX2zm3QbJkjTIFaUN6mZUFRZClBQcFuq39v7fy0tTWE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d6f7595f-1778-4f5d-93e4-44b7aaf18cd2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bfa3dfb41f9d44907e87887a0e327917",
      "created": 1679927930240,
      "modified": 1679927930240,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RixEOwvZhj1Aw6aOmfronI/x7A4JCTnPiAe/DKNL6uY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fb83cdac-3b41-4668-bfcd-530a8d0de9b9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e7a421c67e5dc5cef18bd0f6ad3a3ec4",
      "created": 1679928213669,
      "modified": 1679928213669,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DHKm2EgJ2t2UZErPdLYW2RTfgJlaqYdRmMWoi3Nqoe4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

:::note

The Data Owner Id is a mandatory parameter in filtering patients. Therefore, it must be added to all the filters of the intersection.

:::

### Union Queries

To apply a filter that returns entities which satisfy at least one of multiple criteria, you can use the `union()` function.

<!-- file://code-samples/how-to/use-complex-search-criteria/index.mts snippet:filter patients with union filter-->
```typescript
const filterFemales = new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('female')

const filterFemaleOrIndeterminate = await new PatientFilter()
  .forDataOwner(user.healthcarePartyId!)
  .byGenderEducationProfession('indeterminate')
  .union([filterFemales])
  .build()

const unionFilterPatients = await api.patientApi.filterPatients(filterFemaleOrIndeterminate)
```
<!-- output://code-samples/how-to/use-complex-search-criteria/filterFemaleOrIndeterminate.txt -->
<details>
<summary>filterFemaleOrIndeterminate</summary>

```json
{
  "filters": [
    {
      "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "gender": "female",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    },
    {
      "healthcarePartyId": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "gender": "indeterminate",
      "$type": "PatientByHealthcarePartyGenderEducationProfessionFilter"
    }
  ],
  "$type": "UnionFilter"
}
```
</details>

<!-- output://code-samples/how-to/use-complex-search-criteria/unionFilterPatients.txt -->
<details>
<summary>unionFilterPatients</summary>

```json
{
  "pageSize": 1000,
  "totalSize": 22,
  "rows": [
    {
      "id": "38ab3318-263d-44d0-9fb9-6c17483d920f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-50ac812167df23434f35fe98e4237b17",
      "created": 1679923819453,
      "modified": 1679923819453,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "Wp8/xsSlifg4MzZr15sONGUfWK3MwGVL+SZLsLZZLCc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "3f56fb2c-9713-4a34-86c0-5769e4429826",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0a5db2c5ed3a5f8fd2eb7a1fc66879dd",
      "created": 1679929596477,
      "modified": 1679929596477,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "etGO3WeGfzrRhjdbd5WqGkaxhO5SldwmPztPSoedVJo=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "433c5f0d-7729-40f3-be00-996f89a62c93",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-779d9a5460eac465694f6cb57b471c00",
      "created": 1679926583577,
      "modified": 1679926583577,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "rhbmYnggOOf67/RBN40X0DXdqdMS8BykyhGSiCpVTnc=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6242e684-c1dc-4492-aaaf-0904878f7cee",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-40a200bb6dcbb07c842b7ce696879ecb",
      "created": 1679924677253,
      "modified": 1679924677253,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "0w/paboOMR7HxHha5Mrk+0TvgrGS5TvLpHAf1sU2K+0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "65aae741-1ec1-4804-bfd8-9805954dc277",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-6cb13d1b28d29914e5aa64b6f0e2bd5e",
      "created": 1679924677206,
      "modified": 1679924677206,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tCAd3jqSfPs/+W/kehJHn3iVat2Sjja651FRTPeaPvQ=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "68c77d4e-8691-4cab-b6d0-d5b93f49885f",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d80104a3aa864a5ace53e2fd11cc2158",
      "created": 1679929426993,
      "modified": 1679929426993,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "ocx8Bt4oreEJX1M2TBZF1NnJbhNGNDOwkcmNZKsqw7Q=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6bfae4ab-b5df-4b6c-8268-d9a97282359c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-4e4322a73f114d2e067e8e06692dea72",
      "created": 1679926583841,
      "modified": 1679926583841,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "qdE2Zxav8ZLAtGnMwLFx9FQvB+bMBQTXs7AKrL7nuhs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "6e17112f-4e9b-4d1f-aab7-697b24d620bc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-c009f19e85e158443b7a9a0c0506a342",
      "created": 1679923819398,
      "modified": 1679923819398,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "tWmRIQ542ErVqEtOMyWE8dWEVM63PBB68AwlOwNiDG0=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7902fbf6-0249-46f0-93da-746972ec1785",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-23b430b5738a5ef2fb045d97d19f1678",
      "created": 1679927930297,
      "modified": 1679927930297,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DNrbSjgWraNidVFu55ApZgiITPgCiuACMD/3O0T5IcY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "7be9d261-9af7-4c3a-989e-ce7ace579164",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fa3521cb82f1c6b138f3a627787aee32",
      "created": 1679929426949,
      "modified": 1679929426949,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "djXg30lm1/VfQ5rhFg/MYdudmQ4bHqaiHDhxCUKSTsg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "8133371b-41f3-4f16-b567-36e0a82df720",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-cb5273d31107e411bb81b1eb2a2deaf2",
      "created": 1679926265560,
      "modified": 1679926265560,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "gzQYnYmJgfOErFz5c+52XwP57UdQJYwkVD/ZKIYYIlI=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "833da281-4969-4f97-b0fd-646791006105",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-fcf4dfb83c5af82eb6fd235d5a14c8cb",
      "created": 1679929596429,
      "modified": 1679929596429,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iqx5ZTJwJmNtOiYXt1z3gPvgdxffmfCGG+YT3IcZky8=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "98fc2260-a159-4547-8f0b-ce43400803f2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-1e8e5f406c1bd4bae7d47d1ea56b4838",
      "created": 1679924419615,
      "modified": 1679924419615,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "gmE1Rq0gMaXoIi+D4PuMVeOzX9LCYXAJr8j4OKikNKs=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a329e3ec-60e9-4984-aad9-b611794321e1",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-d684a0704e30f69ce612ea8da429f3a9",
      "created": 1679924419559,
      "modified": 1679924419559,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "+MoXjWPT05eMDPMojBdHEa7Y4sJJE5m5oEcpgb9qadg=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "a9d5e13f-cca1-4696-b485-7b7cb1671e24",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-da64079938bbc1e49c9ea13028016034",
      "created": 1679925890323,
      "modified": 1679925890323,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "bXGDNQx4vvx3KvSSRqhgBB3AZrAjpvqyRaYl/DbONd4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "b42489e5-2576-4a1c-8de3-cdc65e6bcafa",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-0cfe8ef00dc7a6314e13a35e8ad3c969",
      "created": 1679920203751,
      "modified": 1679920203751,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "NxPQnLeGLM675xyVsH9xZQ/vboqDP4XvFjR/JE4VPgA=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ba23f2ff-d254-4eb4-9c92-b72f4bf7342c",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-ef2ff32a7d94e89152f2bb94b1329b92",
      "created": 1679926265515,
      "modified": 1679926265515,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "iX2zm3QbJkjTIFaUN6mZUFRZClBQcFuq39v7fy0tTWE=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "c6d9c5ac-78ea-477a-9f94-6a0938c3931b",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-769c1b7680fdde4815215f6847c3396d",
      "created": 1679928213720,
      "modified": 1679928213720,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "CcwXiCINCycFaqS2/K+sbqmIsr5srFl56tLLVm9m73w=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "ce087539-3f2a-4b9a-bcd4-bcb68012c7cc",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-063f44bf7a4087653e1af03a9c946851",
      "created": 1679925890404,
      "modified": 1679925890404,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "us2hzo6dncsX4bV+yic643I3W/BYZAjZI5JRVYmx3uk=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "d6f7595f-1778-4f5d-93e4-44b7aaf18cd2",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-bfa3dfb41f9d44907e87887a0e327917",
      "created": 1679927930240,
      "modified": 1679927930240,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "RixEOwvZhj1Aw6aOmfronI/x7A4JCTnPiAe/DKNL6uY=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "eeb7506c-728e-49b6-bbe7-9627a6595518",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-3acbe8b265cbdb168ef267e61b1cb2ba",
      "created": 1679920203798,
      "modified": 1679920203798,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Zaphod",
      "lastName": "Beeblebrox",
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Zaphod"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Beeblebrox",
          "text": "Beeblebrox Zaphod",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "indeterminate",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "PGzNcKhGmqz6Ta5MrIoKF4P0NPgUuRyzCWF9yJU5A34=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    },
    {
      "id": "fb83cdac-3b41-4668-bfcd-530a8d0de9b9",
      "languages": [],
      "active": true,
      "parameters": {},
      "rev": "1-e7a421c67e5dc5cef18bd0f6ad3a3ec4",
      "created": 1679928213669,
      "modified": 1679928213669,
      "author": "f7ec463c-44b4-414e-9e7f-f2cc0967cc01",
      "responsible": "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806",
      "firstName": "Trillian",
      "lastName": "Astra",
      "dateOfBirth": 19810101,
      "identifiers": [],
      "labels": {},
      "codes": {},
      "names": [
        {
          "firstNames": [
            "Trillian"
          ],
          "prefix": [],
          "suffix": [],
          "lastName": "Astra",
          "text": "Astra Trillian",
          "use": "official"
        }
      ],
      "addresses": [],
      "gender": "female",
      "birthSex": "unknown",
      "mergedIds": {},
      "deactivationReason": "none",
      "personalStatus": "unknown",
      "partnerships": [],
      "patientHealthCareParties": [],
      "patientProfessions": [],
      "properties": {},
      "systemMetaData": {
        "hcPartyKeys": {},
        "privateKeyShamirPartitions": {},
        "aesExchangeKeys": {},
        "transferKeys": {},
        "encryptedSelf": "DHKm2EgJ2t2UZErPdLYW2RTfgJlaqYdRmMWoi3Nqoe4=",
        "secretForeignKeys": [],
        "cryptedForeignKeys": {},
        "delegations": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        },
        "encryptionKeys": {
          "b16baab3-b6a3-42a0-b4b5-8dc8e00cc806": {}
        }
      }
    }
  ],
  "nextKeyPair": {}
}
```
</details>

In this case, the method will return all the patients that the hcp with id `hcpId` can access and whose gender is `indeterminate` or
whose gender is `female`.

## Base Query Methods

In the following list, you will find all the simple queries for each type of entity filter.

### Coding

* `byIds(byIds: string[])`: all the Codings corresponding to the ids passed as parameter.
* `byRegionLanguageTypeLabel(region?: string, language?: string, type?: string, label?: string)`: all the Codings that have the provided region, language, type, and label
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Data Sample

* `forDataOwner(dataOwnerId: string)`: all the Data Samples that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Data Samples corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Data Samples that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the Data Samples that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Data Samples related to a certain Patient.
* `byHealthElementIds(byHealthElementIds: string[])`: all the Data Samples that have the Healthcare Element specified as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Healthcare Element

* `forDataOwner(dataOwnerId: string)`: all the Healthcare Elements that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Healthcare Elements corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Healthcare Elements that have the identifier passed as parameter.
* `byLabelCodeFilter(tagType?: string, tagCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Elements that matches one of his labels or codes.
* `forPatients(crypto: IccCryptoXApi, patients: Patient[])`: all the Healthcare Elements related to a certain Patient.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Healthcare Professional

* `byIds(byIds: string[])`: all the Healthcare Professionals corresponding to the ids passed as parameter.
* `byLabelCodeFilter(labelType?: string, labelCode?: string, codeType?: string, codeCode?: string)`: all the Healthcare Professionals whose label or code matches the one passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Medical Device

* `byIds(byIds: string[])`: all the Medical Devices corresponding to the ids passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Notification

* `forDataOwner(dataOwnerId: string)`: all the Notifications that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Notifications corresponding to the ids passed as parameter.
* `withType(type: NotificationTypeEnum)`: all the Notifications that are of the type passed as parameter.
* `afterDate(fromDate: number)`: all the Notifications created after the timestamp passed as parameter
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### Patient

* `forDataOwner(dataOwnerId: string)`: all the Patients that the Data Owner passed as parameter can access. **Note:** this field must be specified in all the queries.
* `byIds(byIds: string[])`: all the Patients corresponding to the ids passed as parameter.
* `byIdentifiers(identifiers: Identifier[])`: all the Patients that have the identifier passed as parameter.
* `byGenderEducationProfession(gender: PatientGenderEnum, education?: string, profession?: string)`: all the Patients that matches the gender, the education, or the profession passed as parameters.
* `withSsins(withSsins: string[])`: all the Patients corresponding to the SSIN numbers passed as parameters.
* `ofAge(age: number)`: all the Patients of the age passed as parameter.
* `dateOfBirthBetween(from: number, to: number)` all the Patients whose birthdate is between the ones passed as parameters.
* `containsFuzzy(searchString: string)`:
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.

### User

* `byIds(byIds: string[])`: all the Users corresponding to the ids passed as parameter.
* `byPatientId(patientId: string)`: the User that has the patient id passed as parameter.
* `union(filters: UserFilter[])`: creates a union query with the filters passed as parameter.
* `intersection(filters: UserFilter[])**`: creates an intersection query with the filters passed as parameter.
