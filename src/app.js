import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();


app.use(cors({
    origin: process.env.CLIENTS_URL,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/", evaluationRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/api/v1/health", (req, res) => {
    console.log('WORKING.....')
    res.json({ status: "ok", message: "JudgeLM backend server is running." });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!", message: err.message });
});


export default app
