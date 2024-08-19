import { Router } from "express";
import {
  createPalestrante,
  getPalestrantes,
} from "../controllers/palestrantesController.js";
import { validatePalestrante } from "../helpers/validatePalestrante.js";

export const router = Router();

router.post("/palestrantes", validatePalestrante, createPalestrante);
router.get("/palestrantes", getPalestrantes);
