import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import loggerMiddleware from './middleware/logger.middleware.js';
import contentRouter from './src/routes/content.routes.js';

const app = express();
app.use(express.json());

// Added logger middleware to check logs.
app.use(loggerMiddleware);

// Content router.
app.use("/api/content", contentRouter);

// Default route.
app.get("/", (req, res) => {
    res.status(200).send(`Welcome to the server ${process.env.PORT}`)
});

// Middleware to handle invalid routes
app.use((req, res) => {
    res.status(404).send("Invalid API Path.")
});

export default app;