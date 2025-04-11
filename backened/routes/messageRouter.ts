import { Router } from "express";
import { protect } from "../middleware/authmiddleware";
import { allmessages, NewMessage } from "../controllers/messageController";

const Messagerouter=Router();

Messagerouter.route("/:chatId").get(protect,allmessages);
Messagerouter.route("/").get(protect,NewMessage);

export default Messagerouter