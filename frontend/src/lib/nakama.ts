import { Client, type Session, type Socket, type MatchData, type MatchmakerMatched, type MatchPresenceEvent } from '@heroiclabs/nakama-js';
import { type MoveMessage, OpCode } from '../types';

class NakamaService {
    public client: Client;
    public session: Session | null = null;
    public socket: Socket | null = null;

    public onMatchmakerMatched?: (matched: MatchmakerMatched) => void;
    public onMatchData?: (message: MatchData) => void;
    public onMatchPresence?: (presenceEvent: MatchPresenceEvent) => void;

    public matchId: string | null = null;
    
    constructor() {
        const host = import.meta.env.VITE_NAKAMA_HOST || "127.0.0.1";
        const port = import.meta.env.VITE_NAKAMA_PORT || "7350";
        const useSSL = import.meta.env.VITE_NAKAMA_SSL === "true";
        const serverKey = import.meta.env.VITE_NAKAMA_SERVER_KEY || "defaultkey";

        this.client = new Client(serverKey, host, port, useSSL);
    }

    async authenticate() {
        let deviceId = localStorage.getItem("nakamaDeviceId");
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("nakamaDeviceId", deviceId);
        }
        this.session = await this.client.authenticateDevice(deviceId, true);
        return this.session;
    }

    async connectSocket() {
        if (!this.session) throw new Error("Must authenticate before connecting socket");
        this.socket = this.client.createSocket(this.client.useSSL, false);
        
        this.socket.onmatchdata = (matchstate: MatchData) => {
            if (this.onMatchData) this.onMatchData(matchstate);
        };
        
        this.socket.onmatchmakermatched = (matched: MatchmakerMatched) => {
            if (this.onMatchmakerMatched) this.onMatchmakerMatched(matched);
        };
        
        this.socket.onmatchpresence = (presenceEvent: MatchPresenceEvent) => {
            if (this.onMatchPresence) this.onMatchPresence(presenceEvent);
        };

        await this.socket.connect(this.session, true);
    }

    async findMatch(minCount = 2, maxCount = 2) {
        if (!this.socket) throw new Error("Socket not connected");
        return await this.socket.addMatchmaker("*", minCount, maxCount);
    }

    async joinMatch(matchId: string) {
        if (!this.socket) throw new Error("Socket not connected");
        const match = await this.socket.joinMatch(matchId, "");
        this.matchId = match.match_id;
        return match;
    }

    async sendMove(position: number) {
        if (!this.socket || !this.matchId) return;
        
        const payload: MoveMessage = { position };
        // Match state expects a Uint8Array or string, JSON is fine as string
        await this.socket.sendMatchState(this.matchId, OpCode.MOVE, JSON.stringify(payload));
    }
}

export const nakama = new NakamaService();
