import express from 'express'
import UsuariosController from '../controllers/UsuariosController';
import roles from '../middlware/roles';
import { ROLES } from '../global/constants';
import checkSelfUser from '../middlware/checkSelfUser';

const routes = express.Router();

routes.post("/usuarios", roles([ROLES.ADMIN]), UsuariosController.cadastrar);
routes.get("/usuarios", roles([ROLES.ADMIN]), UsuariosController.listar);
routes.get("/usuarios/:id", checkSelfUser(), UsuariosController.byId);
routes.put("/usuarios/:id",  checkSelfUser(), UsuariosController.atualizar);
routes.delete("/usuarios/:id",  checkSelfUser(), UsuariosController.deletar);


export default routes