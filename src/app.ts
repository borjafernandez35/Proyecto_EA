import express, { RequestHandler } from 'express';
import cors from 'cors';
import todoRoutes from './routes/auth';
import eventRoutes from './routes/Event';

// Initializations
const app: express.Application = express();

// Settings
app.set('port', process.env.PORT || 9090);

// Middelwares
app.use(cors());
app.use(express.json() as RequestHandler);
app.use(express.urlencoded({ extended: false })); //no estava

// Routes
app.use('/api', todoRoutes);
app.use('/events', eventRoutes);
export default app;
