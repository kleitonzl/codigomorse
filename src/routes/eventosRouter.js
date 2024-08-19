import { Router } from "express";
import {
  createEvento,
  getEventos,
  getAgendaEventos,
  createEnrollmentParticipante,
  getEventoMaisPopular,
  getMeusEventos,
  getPalestranteMaisAtivo,
  updateEvento,
  cancelEventos
} from "../controllers/eventosController.js";
import { validateEvento } from "../helpers/validateEvento.js";

export const router = Router();

router.post("/criar", validateEvento, createEvento);
router.get("/eventos-all", getEventos);
router.get("/agenda", getAgendaEventos);
router.post("/inscrever", createEnrollmentParticipante);
router.get("/mais-popular", getEventoMaisPopular);
router.get("/meus-eventos",  getMeusEventos);
router.get("/palestrante-mais-ativo", getPalestranteMaisAtivo);
router.put("/editar/:id", updateEvento)
router.delete("/cancelar/:id", cancelEventos)
