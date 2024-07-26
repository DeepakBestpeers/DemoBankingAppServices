import { Router } from "express";
import { auth } from "../auth/routes";
import { trx } from "../transaction/routes";

const userRoutes = new Router();
userRoutes.use("/v1", auth);
userRoutes.use("/v1", trx);
export { userRoutes };