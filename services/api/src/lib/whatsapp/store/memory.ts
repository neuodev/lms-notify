import {
  AuthenticationCreds,
  initAuthCreds,
  SignalDataSet,
  SignalDataTypeMap,
  SignalKeyStore,
} from "baileys";
import { InitializedStore } from "@/lib/whatsapp/store/types.js";

export class MemoryStore implements SignalKeyStore {
  creds: AuthenticationCreds = initAuthCreds();
  signalData: SignalDataSet = {};

  async get<T extends keyof SignalDataTypeMap>(
    type: T,
    ids: string[],
  ): Promise<{
    [id: string]: SignalDataTypeMap[T];
  }> {
    const output: {
      [id: string]: SignalDataTypeMap[T];
    } = {};

    for (const id of ids) {
      const value = this.signalData[type]?.[id];
      if (value) output[id] = value;
    }

    return output;
  }
  async set(data: SignalDataSet): Promise<void> {
    this.signalData = data;
    console.log({ data });
  }

  async clear(): Promise<void> {
    this.signalData = {};
    this.creds = initAuthCreds();
  }

  saveCreds(creds: Partial<AuthenticationCreds>) {
    const copy = structuredClone(this.creds);
    this.creds = { ...copy, ...creds };
  }

  keys(): SignalKeyStore {
    return {
      get: this.get.bind(this),
      set: this.set.bind(this),
      clear: this.clear.bind(this),
    };
  }

  async cleanup(): Promise<void> {
    await this.clear();
  }
}

export function initMemoryStore(): InitializedStore {
  const store = new MemoryStore();
  return {
    state: { creds: store.creds, keys: store.keys() },
    saveCreds: store.saveCreds.bind(store),
  };
}
