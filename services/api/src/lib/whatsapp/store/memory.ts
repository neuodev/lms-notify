import {
  AuthenticationCreds,
  initAuthCreds,
  SignalDataSet,
  SignalDataTypeMap,
  SignalKeyStore,
} from "baileys";
import { InitializedStore } from "./types.js";

export class MemoryStore implements SignalKeyStore {
  creds: AuthenticationCreds = initAuthCreds();
  signalData: SignalDataSet = {};

  async get<T extends keyof SignalDataTypeMap>(
    type: T,
    ids: string[],
  ): Promise<{ [id: string]: SignalDataTypeMap[T] }> {
    const result: any = {};
    for (const id of ids) {
      if (this.signalData[type]?.[id]) {
        result[id] = this.signalData[type][id];
      }
    }
    return result;
  }

  async set(data: SignalDataSet): Promise<void> {
    for (const [cat, values] of Object.entries(data)) {
      const category = cat as keyof SignalDataSet;
      if (!this.signalData[category]) this.signalData[category] = {};
      Object.assign(this.signalData[category], values);
    }
  }

  async clear(): Promise<void> {
    this.signalData = {};
    this.creds = initAuthCreds();
  }

  saveCreds(creds: Partial<AuthenticationCreds>) {
    Object.assign(this.creds, creds);
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
    state: {
      get creds() {
        return store.creds;
      },
      keys: store.keys(),
    },
    saveCreds: store.saveCreds.bind(store),
  };
}
