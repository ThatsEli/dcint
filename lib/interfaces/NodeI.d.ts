/// <reference types="socket.io" />
import { Socket } from "socket.io";
export interface NodeI {
    host: string;
    socket: Socket;
}
