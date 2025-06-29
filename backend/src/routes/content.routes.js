import express from "express";
import { addContent, deleteContent, getContent } from "../controller/content.controller.js";

const contentRouter = express.Router();

contentRouter.route("/").get(getContent);
contentRouter.route("/").post(addContent);
contentRouter.route("/").delete(deleteContent);

export default contentRouter;