import { Router } from "express";
import {
  getFeedbackUsers,
  CreatefeedbackUsers,
} from "../controllers/feedbackController.js";
import { validateFeedback } from "../helpers/validateFeedback.js";

export const router = Router();

router.get("/feedback", getFeedbackUsers);
router.post("/feedback", validateFeedback, CreatefeedbackUsers);
