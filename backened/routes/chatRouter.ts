import { Router } from "express";
import { protect } from "../middleware/authmiddleware";
import { addUser, allChats, createGroup, one_on_one, removeUser, renameGroup } from "../controllers/chatController";
import Chat from "../model/Chatmodel";

const Chatrouter=Router();

Chatrouter.route("/").get(protect, one_on_one);
Chatrouter.route("/").get(protect,allChats);
Chatrouter.route("/chat").post(protect,createGroup)
Chatrouter.route("/groupAdd").put(protect,addUser)
Chatrouter.route("/rename").put(protect,renameGroup)
Chatrouter.route("/remove").put(protect,removeUser)

export default Chatrouter;