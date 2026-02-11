import { AuthenticationCreds, AuthenticationState } from "baileys";

export type InitializedStore = {
  state: AuthenticationState;
  saveCreds: (creds: Partial<AuthenticationCreds>) => void;
  cleanup?: () => Promise<void> | void;
};
