import { Router } from "express";
import {uploadFile, upload} from "../controllers/index.js";

export const uploadRoutes = Router();

uploadRoutes.post("/upload",upload,uploadFile);

