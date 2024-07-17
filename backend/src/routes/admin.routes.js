import { Router } from "express";

import { deleteUser, getAllUsers } from "../controllers/admin.controller.js";
import {
  isAdmin,
  isCreator,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.delete("/users/:id", verifyJWT, isAdmin, deleteUser);

router.get("/users", verifyJWT, isCreator, getAllUsers);

export default router;
