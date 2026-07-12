import express from "express";
import { evaluateModels } from "../controllers/evaluationController.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.route('/evaluate').post(verifyJwt, rateLimiter, evaluateModels);

export default router;
