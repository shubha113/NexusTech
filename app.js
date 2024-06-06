import express from 'express';
import { config } from 'dotenv';
import ErrorMiddleware from './middlewares/Error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

config({ path: './config/config.env' });
const app = express();

// Print environment variables for debugging
console.log('CERTIFICATES_DIR:', process.env.CERTIFICATES_DIR);
console.log('CERTIFICATES_TEMPLATE_PATH:', process.env.CERTIFICATES_TEMPLATE_PATH);
console.log('CERTIFICATES_URL_BASE:', process.env.CERTIFICATES_URL_BASE);

// CORS configuration
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] }));

// Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const certificatesDir = path.resolve(__dirname, process.env.CERTIFICATES_DIR);
console.log('Resolved certificatesDir:', certificatesDir); // Debugging

app.use(process.env.CERTIFICATES_URL_BASE, express.static(certificatesDir));

// Importing and using routes
import course from './routes/courseRoutes.js';
import tutorial from './routes/tutorialRoutes.js';
import question from './routes/questionRoutes.js';
import user from './routes/userRoutes.js';
import payment from './routes/paymentRoute.js';
import other from './routes/otherRoutes.js';
app.use('/api/v1', course);
app.use('/api/v1', tutorial);
app.use('/api/v1', question);
app.use('/api/v1', user);
app.use('/api/v1', payment);
app.use('/api/v1', other);

export default app;

app.get('/', (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href="${process.env.FRONTEND_URL}">here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);
