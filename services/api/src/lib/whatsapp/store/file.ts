import { useMultiFileAuthState } from "baileys";
import fs from "fs/promises";

export async function initFileStore(folder: string) {
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    return {
        state,
        saveCreds,
        cleanup: async () => {
            try {
                await fs.rm(folder, { recursive: true, force: true });
            } catch (err) {
                console.error(`Failed to delete auth folder ${folder}:`, err);
            }
        }
    };
}