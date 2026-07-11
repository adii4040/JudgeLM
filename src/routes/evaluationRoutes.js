import express from "express";
import { evaluateModels } from "../controllers/evaluationController.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/evaluate').post(verifyJwt, evaluateModels);

export default router;
