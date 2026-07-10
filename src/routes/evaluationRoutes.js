import express from "express";
import { evaluateModels } from "../controllers/evaluationController.js";

const router = express.Router();

router.post("/evaluate", evaluateModels);

export default router;
