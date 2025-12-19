import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/api';

const socket: Socket = io(API_URL);

export default socket;
