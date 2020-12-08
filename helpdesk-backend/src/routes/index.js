import express from "express";
import { conversationRoutes } from "./conversation";
import { authRoutes } from "./user";

function getRoutes() {
  const router = express.Router();

  router.use("/auth", authRoutes());
  router.use("/conversation", conversationRoutes());

  return router;
}

export { getRoutes };
