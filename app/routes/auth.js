import express from "express";
import UsuariosController from "../controllers/UsuariosController";
import AuthController from "../controllers/AuthController";

const routes = express.Router();

routes.post("/login",  AuthController.login);
routes.post("/registrar", UsuariosController.cadastrar);


export default routes;