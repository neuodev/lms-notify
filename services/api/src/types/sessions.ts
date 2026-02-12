import { WhatsApp } from "@/lib/whatsapp/index.js";
import { InitializedStore } from "@/lib/whatsapp/store/types.js";

export type Session = {
    id: string;
    waInstance: WhatsApp;
    store: InitializedStore;
    createdAt: number;
    lastActivity: number;
    status: 'initializing' | 'qr_pending' | 'authenticated' | 'disconnected' | 'error';
    metadata?: {
        userAgent?: string;
        ip?: string;
        deviceInfo?: any;
    };
}

export type SessionManagerConfig = {
    /**
     * default 24 hrs
     */
    sessionTimeout: number;
    /**
     * default 5 mins
     */
    cleanupInterval: number;
    maxSessions: number;
    qrTimeout: number;
}