import { User } from "../types";

export interface LmsClient {
  fetchAllUsers(): Promise<User[]>;
}
