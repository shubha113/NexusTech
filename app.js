import express from "express";
import {config} from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config({path:"./config/config.env"});
const app = express();
// Example middleware to enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//using middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());
//importing and using routes
import course from "./routes/courseRoutes.js";
import user from "./routes/userRoutes.js";
import payment from "./routes/paymentRoute.js";
import other from "./routes/otherRoutes.js";
app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);
export default app;
// Importing & Using Routes
app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href="${process.env.FRONTEND_URL}">here</a> to visit frontend.</h1>`
  )
);

app.use(ErrorMiddleware);
