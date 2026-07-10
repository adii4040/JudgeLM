import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import evaluationRoutes from "./routes/evaluationRoutes.js";

const app = express();


app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));

app.use(express.json());
app.use("/api/v1/", evaluationRoutes);
app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "JudgeLM backend server is running." });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!", message: err.message });
});


export default app
