import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { errorHandler } from './middleware/errorMiddleware';

dotenv.config();

connectDB();

const app = express();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Set io to app to access in controllers
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Real-time
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinUserRoom', (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined room user:${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
