import { KeyStorageFacade, StorageFacade } from '@icure/api'
import PromisedSatisfy = Chai.PromisedSatisfy

export class MemoryStorage implements StorageFacade<string> {
  private readonly data = new Map<string, string>()

  async getItem(key: string): Promise<string | undefined> {
    return this.data.get(key)
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key)
  }

  async setItem(key: string, valueToStore: string): Promise<void> {
    this.data.set(key, valueToStore)
  }
}

type KeyPair = { publicKey: JsonWebKey; privateKey: JsonWebKey }

export class MemoryKeyStorage implements KeyStorageFacade {
  private readonly data = new Map<string, KeyPair>()

  async clear(): Promise<void> {
    this.data.clear()
  }

  async deleteKeypair(key: string): Promise<void> {
    this.data.delete(key)
  }

  async getKeypair(
    key: string,
  ): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey } | undefined> {
    return this.data.get(key)
  }

  async getPrivateKey(key: string): Promise<JsonWebKey | undefined> {
    return (await this.getKeypair(key))?.privateKey
  }

  async getPublicKey(key: string): Promise<JsonWebKey | undefined> {
    return (await this.getKeypair(key))?.publicKey
  }

  async storeKeyPair(
    key: string,
    keyPair: { publicKey: JsonWebKey; privateKey: JsonWebKey },
  ): Promise<void> {
    this.data.set(key, keyPair)
  }
}
