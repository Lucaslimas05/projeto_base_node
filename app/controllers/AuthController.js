import bcrypt from "bcrypt"
import UsuariosDAO from "../dao/UsuariosDAO"
import { validaLogin } from "../validations/usuarios.js/usuarios";
import ResponseController from "./ResponseController";
import { findOne, removeSenha } from "../utils/format";
import UsuarioRolesDAO from "../dao/UsuarioRolesDAO";
import { getToken } from "../utils/autenticacao";

const usuarioDAO = new UsuariosDAO();
const usuarioRolesDAO = new UsuarioRolesDAO();
const response = new ResponseController();
const { errorValidacao, errorMessage, resData } = response

class AuthController {
    static async login(req, res) {
        try {
            const validacao = validaLogin(req.body);

            if (validacao) {
                return errorValidacao(res, validacao);
            }
            const { senha, email } = req.body

            const usuario = findOne(await usuarioDAO.byEmail(email))
            if (!usuario) {
                return errorMessage(res, "E-mail ou senha inválidos", 401);
            }

            const success = await bcrypt.compare(senha, usuario.senha);
            if (!success) {
                return errorMessage(res, "E-mail ou senha inválidos", 401);
            }
            const accessToken = getToken(usuario.email);
            const roles = await usuarioRolesDAO.byUserId(usuario.id);
            const usuarioAtt = removeSenha({...usuario, accessToken, roles})

            return resData(res, usuarioAtt, 200);

        } catch (e) {
            return errorMessage(res, "Erro ao efetuar login")

        }
    }
}

export default AuthController;