import express from 'express'
import UsuariosController from '../controllers/UsuariosController';

const routes = express.Router();

routes.post("/usuarios", UsuariosController.cadastrar);
routes.get("/usuarios", UsuariosController.listar);
routes.get("/usuarios/:id", UsuariosController.byId);
routes.put("/usuarios/:id", UsuariosController.atualizar);
routes.delete("/usuarios/:id", UsuariosController.deletar);


export default routes