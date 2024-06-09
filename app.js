import express from 'express';
import { config } from 'dotenv';
import ErrorMiddleware from './middlewares/Error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

config({ path: './config/config.env' });
const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
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
