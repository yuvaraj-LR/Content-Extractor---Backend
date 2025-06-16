import express from "express";
import { addContent, getContent } from "../controller/content.controller.js";

const contentRouter = express.Router();

contentRouter.route("/").get(getContent);
contentRouter.route("/").post(addContent);

export default contentRouter;