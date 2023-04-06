---
slug: node-js-quick-start
description: Start your Node JS App
---

# Start your Node JS App

## Prerequisites and Installation

iCure can easily be used in the browser or with Node.

Node version 16 or higher is fully supported as it includes a webcrypto module compatible with the implementation of our cryptography layer.

We recommend using yarn for package management but npm works fine as well.

The main dependency for using iCure is `@icure/medical-device-sdk`, two extra dependencies are required for node : `isomorphic-fetch` and `node-localstorage`.

```bash
mkdir healthcare-project
cd healthcare-project
yarn init -y
yarn add @icure/medical-device-sdk

#if you are using node two other dependencies are needed
yarn add isomorphic-fetch node-localstorage
```

## Installing the backend or using iCure cloud

iCure can be installed locally or in the cloud.

The cloud version is available on [https://api.icure.cloud](https://api.icure.cloud) and can be configured using [our cockpit](https://cockpit.icure.cloud).

If you want to install the iCure API locally instead of using the cloud version, you can either use docker (recommended) or install it manually.

### Using iCure Cloud

Head to [https://cockpit.icure.cloud](https://cockpit.icure.cloud) and create an account.
Create an app and create a new administrator in the app.

Note down the credentials of your administrator. You will need them later.

### Using docker

Make sure you have docker installed and running on your machine.

Then, run the following command:

```bash
mkdir icure-api
cd icure-api
curl -O https://raw.githubusercontent.com/icure/icure-kraken-oss/main/docker/docker-compose.yaml
docker compose up -d
```

The current version of iCure is called the Kraken. The docker compose file will start the Kraken and a [CouchDB](https://couchdb.apache.org) instance.
Kraken connects to the couchdb database to store its data.

:::tip
The docker compose file exposes the Kraken on port 16043. It also exposes the CouchDB instance on port 5984.
:::

To connect to the Kraken, you will need credentials. If no user has ever been created in the database, an entry similar to the one below will appear in the docker logs:

`2022-09-30 07:39:06.700  WARN 7 --- [           main] ication$$EnhancerBySpringCGLIB$$71ea0610 : Default admin user created with password d2217dd39238`

The password is going to be used later. Please note them down.

### Manual installation

You can also install the Kraken manually without relying on docker. This involves installing and configuring a local or remote instance of CouchDB and then installing and starting the Kraken jar.

## Using the SDK

Now that we have credentials for a local or remote instance of the Kraken, we can use the SDK to connect to it.

You can either define the environment variables `ICURE_USER_NAME` and `ICURE_USER_PASSWORD` or directly modify the code below and replace the credentials loaded from the environment by the ones you noted down earlier.

If you use the cloud version, this is the credentials you got from the cockpit. If you use the local installation, the credentials are `admin` and the `password`you got from the logs.

<!-- file://code-samples/quick-start/index.mts snippet:instantiate the api-->
```typescript
import 'isomorphic-fetch'
import { medTechApi } from '@icure/medical-device-sdk'
import { webcrypto } from 'crypto'
import * as process from 'process'
import { output } from '../utils/index.mjs'

export const host = process.env.ICURE_URL ?? 'https://api.icure.cloud/rest/v1'
export const username = process.env.ICURE_USER_NAME
export const password = process.env.ICURE_USER_PASSWORD


const api = await medTechApi()
  .withICureBaseUrl(host)
  .withUserName(username)
  .withPassword(password)
  .withCrypto(webcrypto as any)
  .build()
```

Once logged in, you can check the user details.

<!-- file://code-samples/quick-start/index.mts snippet:get the currently logged user-->
```typescript
const user = await api.userApi.getLoggedUser()
console.log(JSON.stringify(user))
```

Congratulations, you are now ready to use the SDK to interact with the iCure API.
You can now head to the [Tutorial](../tutorial/index.md) to learn how to use the SDK to create a simple application.
