import { CardinalSdk } from "@icure/cardinal-sdk"

let cachedSdk: CardinalSdk | undefined

/**
 * Returns an initialized CardinalSdk instance, cached for reuse across tests.
 * Reads credentials from environment variables.
 *
 * Required env vars:
 *   CARDINAL_URL       — e.g. "https://api.icure.cloud"
 *   CARDINAL_USERNAME  — login username
 *   CARDINAL_PASSWORD  — login password
 */
export async function getTestSdk(): Promise<CardinalSdk> {
  if (cachedSdk) return cachedSdk

  const url = process.env.CARDINAL_URL
  const username = process.env.CARDINAL_USERNAME
  const password = process.env.CARDINAL_PASSWORD

  if (!url || !username || !password) {
    throw new Error(
      'Missing required environment variables: CARDINAL_URL, CARDINAL_USERNAME, CARDINAL_PASSWORD'
    )
  }

  // TODO: Replace with actual CardinalSdk.initialize() call.
  // The exact initialization API depends on the SDK version.
  // Example:
  //   cachedSdk = await CardinalSdk.initialize(url, username, password)
  //   return cachedSdk
  throw new Error('SDK initialization not yet implemented — update helpers/sdk-fixture.ts')
}
