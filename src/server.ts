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

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        //console.log('connected');  // Se puede hacer sin la libreria para el Logging, es solo más estético
        Logging.info('connected to mongoDB');
        StartServer(); // Función para inciar el server solo si se conecta mongoose
    })
    .catch((error) => {
        //console.error(error);
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

/** Only Start Server if Mongoose Connects */
const StartServer = () => {
    /** Log the request */
    router.use((req, res, next) => {
        /** Log the req */
        Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            Logging.info(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use(cors());
    /** Rules of our API */
    // router.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*'); // * Quiere decir que la petición viene de cualquier origen
    //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //     if (req.method == 'OPTIONS') {
    //         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    //         return res.status(200).json({});
    //     }

    //     next();
    // });

    /** Routes */
    router.use('/users', userRoutes);
    router.use('/events', eventRoutes);
    router.use('/categories', categoryRoutes);
    router.use('/chats', chatRoutes);
    router.use('/comments', commentRoutes);
    router.use('/messages', messageRoutes);

    /** Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not found');
        Logging.error(error);

        res.status(404).json({
            message: error.message
        });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
