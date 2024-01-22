import { Router } from "express";
import pkRoutes from "../handlers/pk";

const router = Router();

pkRoutes(router);
export default router;
