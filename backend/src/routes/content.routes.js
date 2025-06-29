import express from "express";
import { addContent, deleteContent, getContent, searchContent } from "../controller/content.controller.js";

const contentRouter = express.Router();

contentRouter.route("/").get(getContent);
contentRouter.route("/").post(addContent);
contentRouter.route("/").delete(deleteContent);
contentRouter.route("/search").get(searchContent);

export default contentRouter;