import init, {
  AnyMediaMessageContent,
  AnyRegularMessageContent,
  ConnectionState,
  DisconnectReason,
  MiscMessageGenerationOptions,
  WAPresence,
} from "baileys";
import {
  initFileStore,
  InitializedStore,
  initMemoryStore,
} from "@/lib/whatsapp/store/index.js";
import { isBoom } from "@hapi/boom";
import { pino } from "pino";
import qr from "qrcode";
import EventEmitter from "events";

function shouldReconnect(error: unknown): boolean {
  return (
    isBoom(error) && error.output.statusCode !== DisconnectReason.loggedOut
  );
}

export class WhatsApp {
  socket: ReturnType<typeof init> | null = null;
  connection: ConnectionState["connection"] = "close";
  store: InitializedStore | null = null;
  qr: string | null = null;
  _listenersAttached = false;
  events: EventEmitter = new EventEmitter();

  async withStore(
    type: "memory" | "file",
    sessionId?: string,
  ): Promise<WhatsApp> {
    if (type === "memory") {
      this.store = initMemoryStore();
      return this;
    }

    const folder = sessionId
      ? `sessions/${sessionId}/__whatsapp__`
      : `__whatsapp__`;
    this.store = await initFileStore(folder);
    return this;
  }

  private setupEventListeners() {
    if (this._listenersAttached) return; // prevent duplicates
    if (!this.socket) throw new Error("Socket not initialized");
    if (!this.store) throw new Error("Store not initialized");

    this.socket.ev.on("connection.update", this.handleSocketUpdates.bind(this));
    this.socket.ev.on("creds.update", this.store.saveCreds);
    this._listenersAttached = true;
  }

  private async handleSocketUpdates(update: any) {
    console.log(
      "[WhatsApp] connection.update:",
      JSON.stringify(update, null, 2),
    );
    console.log(update);
    if (update.connection) this.connection = update.connection || "close";

    if (update.qr) {
      this.qr = update.qr;
      this.events.emit("qr", update.qr);
      console.log(
        await qr.toString(update.qr, { type: "terminal", small: true }),
      );
    }

    this.events.emit("connection.update", update);

    if (
      update.connection === "close" &&
      shouldReconnect(update.lastDisconnect?.error)
    ) {
      return await this.connectAsync();
    }
  }

  private init() {
    if (!this.store)
      throw new Error(
        "No store is currently selected. Use WhatsApp.withStore to configure one.",
      );

    this.socket = init({
      auth: this.store.state,
      printQRInTerminal: false,
      logger: pino({ level: "debug" }),
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      // 👇 mimics a real Windows / Edge browser
      browser: ["Windows", "Edge", "20.0.04"],
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 25000,
      qrTimeout: 40000,
    });
  }

  async connectAsync(): Promise<WhatsApp> {
    if (this.socket) {
      this.socket.ev.removeAllListeners("connection.update");
      this.socket.ev.removeAllListeners("creds.update");
      this._listenersAttached = false;
    }
    this.init();
    this.onCredsUpdate();

    this.setupEventListeners();

    return await new Promise<WhatsApp>((resolve, reject) => {
      if (!this.socket) return reject(new Error("Socket is not initialized"));
      if (!this.store) return reject(new Error("Store is not initialized"));

      return resolve(this);
    });
  }

  private onCredsUpdate() {
    if (!this.socket) throw new Error("Socket is not initialized");

    if (!this.store)
      throw new Error(
        "No store is currently selected. Use WhatsApp.withStore to configure one.",
      );

    this.socket.ev.on("creds.update", this.store.saveCreds);
  }

  async sendMessage(
    id: string,
    content: AnyMediaMessageContent | AnyRegularMessageContent,
    options?: MiscMessageGenerationOptions,
  ) {
    if (!this.socket) throw new Error("Socket is not initialized");
    if (this.connection !== "open")
      throw new Error(`invalid connection state: ${this.connection}`);
    return await this.socket.sendMessage(id, content, options);
  }

  async sendPresence(id: string, presence: WAPresence = "composing") {
    if (!this.socket) throw new Error("Socket is not initialized");
    if (this.connection !== "open")
      throw new Error(`invalid connection state: ${this.connection}`);
    return await this.socket.sendPresenceUpdate(presence, id);
  }

  asWhatsAppId(phone: string) {
    return `2${phone.startsWith("0") ? phone : `0${phone}`}@s.whatsapp.net`;
  }

  public isConnected(): boolean {
    return this.connection === "open";
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      this.socket.ev.removeAllListeners("connection.update");
      this.socket.ev.removeAllListeners("creds.update");
      await this.socket.end(undefined);
      this.connection = "close";
      this._listenersAttached = false;
    }
  }

  async sendContact(
    id: string,
    contact: {
      name: string;
      org?: string;
      waid: string;
      phone: string;
      display: string;
    },
  ) {
    const header = "BEGIN:VCARD\n" + "VERSION:3.0\n";
    const name = `FN:${contact.name}\n`;
    const org = contact.org ? `ORG:${contact.org}\n` : "";
    const tel = `TEL;type=CELL;type=VOICE;waid=${contact.waid}:${contact.phone}\n`;
    const end = "END:VCARD";
    const vcard = header + name + org + tel + end;
    return await this.sendMessage(id, {
      contacts: {
        displayName: contact.display,
        contacts: [{ vcard }],
      },
    });
  }
}
