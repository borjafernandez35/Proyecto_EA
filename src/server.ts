import express, { RequestHandler } from 'express';
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
import authRoutes from './routes/auth'; // Importa las rutas de autenticación

// Inicializaciones
const app: express.Application = express();

/** Conéctate a Mongo e inicia el servidor */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Connected to MongoDB');
        startServer(); // Función para iniciar el servidor solo si se conecta mongoose
    })
    .catch((error) => {
        Logging.error('Unable to connect to MongoDB');
        Logging.error(error);
    });

/** Inicia el servidor si se conecta Mongoose */
export const startServer = () => {
    // Registra la solicitud
    app.use((req, res, next) => {
        Logging.info(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(cors());

    /** Rutas */
    app.use('/users', userRoutes);
    app.use('/events', eventRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/chats', chatRoutes);
    app.use('/comments', commentRoutes);
    app.use('/messages', messageRoutes);
    app.use('/auth', authRoutes); // Usa las rutas de autenticación

    /** Healthcheck */
    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Manejo de errores */
    app.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    http.createServer(app).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
