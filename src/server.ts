import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import userRoutes from './routes/User';
import eventRoutes from './routes/Event';
import categoryRoutes from './routes/Category';
import chatRoutes from './routes/Chat';
import commentRoutes from './routes/Comment';
import messageRoutes from './routes/Message';
import cors from 'cors';
import authRoutes from './routes/auth';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to MongoDB');
        startServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect to MongoDB');
        Logging.error(error);
    });

export const startServer = () => {
    app.use((req, res, next) => {
        Logging.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    app.use('/users', userRoutes);
    app.use('/events', eventRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/chats', chatRoutes);
    app.use('/comments', commentRoutes);
    app.use('/messages', messageRoutes);
    app.use('/auth', authRoutes);

    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    app.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);
        res.status(404).json({ message: error.message });
    });

    io.on('connection', (socket) => {
        console.log('Connected successfully', socket.id);

        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected', socket.id);
        });

        socket.on('message', (msg) => {
            Logging.info(`Message: ${msg}`);
            io.to(msg.room).emit('message-receive', msg);
        });
    });

    server.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
