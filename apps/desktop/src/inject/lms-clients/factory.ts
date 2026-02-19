import { LmsClient } from "./types";
import { LernoviaClient } from "./lernovia-client";

export function createLmsClient(lmsType: string): LmsClient {
  switch (lmsType) {
    case "LERNOVIA":
      return new LernoviaClient();
    // case 'CLASSERA': return new ClasseraClient();
    // case 'TEAMS': return new TeamsClient();
    // case 'COLIGO': return new ColigoClient();
    default:
      throw new Error(`Unsupported LMS type: ${lmsType}`);
  }
}
