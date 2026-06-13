import { Router } from "express";
import { getConfigurables, getConfigurablesData, patchConfigurables } from "../controllers/configurables.controller";

const router = Router();

router.get("/configurables", getConfigurables);
router.get("/configurables/data", getConfigurablesData);
router.patch("/configurables", patchConfigurables);

export default router;
