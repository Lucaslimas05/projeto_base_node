import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import UsuariosDAO from "../dao/UsuariosDAO"
import { validaLogin } from "../validations/usuarios.js/usuarios";
import ResponseController from "./ResponseController";
import { findOne, removeSenha } from "../utils/format";

const usuarioDAO = new UsuariosDAO();
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
            const token = jwt.sign({ sub: usuario.email, iss: 'peri-crash' }, process.env.API_SECRET, { expiresIn: 60 })
            usuario.accessToken = token

            return resData(res, removeSenha(usuario), 200);

        } catch (e) {
            return errorMessage(res, "Erro ao efetuar login")

        }
    }
}

export default AuthController;