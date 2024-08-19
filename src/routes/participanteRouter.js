import { Router } from "express";
import {
  createParticipante,
  getParticipantes,
} from "../controllers/participantesController.js";
import { validateParticipante } from "../helpers/validateParticipante.js";

export const router = Router();

router.post(
  "/participantes/register",
  validateParticipante,
  createParticipante
);
router.get("/participantes", getParticipantes);
