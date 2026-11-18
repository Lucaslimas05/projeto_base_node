
import RolesDAO from "../dao/RolesDAO"
import UsuarioRolesDAO from "../dao/UsuarioRolesDAO"
import UsuariosDAO from "../dao/UsuariosDAO"
import { ROLES } from "../global/constants"
import { getHashSenha, getToken } from "../utils/autenticacao"
import { findOne, removeSenha } from "../utils/format"
import { validaAlteracao, validaCadastro } from "../validations/usuarios"
import ResponseController from "./ResponseController"
import { registrarErro } from "../utils/logger"

const usuarioDAO = new UsuariosDAO()
const rolesDAO = new RolesDAO()
const usuariosRolesDAO = new UsuarioRolesDAO()
const response = new ResponseController();

const { errorMessage, errorValidacao, resData } = response

const isAdmin = (user) => !!user?.roles?.some(r => r.role_nome === ROLES.ADMIN);

async function getUsuarioFormatado(id) {
    const usuario = findOne(await usuarioDAO.byId(id));
    if (!usuario) {
        return null;
    }
    const roles = await usuariosRolesDAO.byUserId(usuario.id);
    return removeSenha({ ...usuario, roles });
}

class UsuariosController {

    static async cadastrar(req, res){
        try{
            const erroValidacao = validaCadastro(req.body);
            if(erroValidacao){
               return errorValidacao(res, erroValidacao)
            }

            const { email, senha, admin, nome } = req.body
            const criadoPorAdmin = isAdmin(req.user)

            const usuarioEncontrado = findOne(await usuarioDAO.byEmail(email))
            if(usuarioEncontrado){
                return  errorMessage(res,  "Já existe usuário com e-mail cadastrado", 400)
            }

            const senhaHash =  getHashSenha(senha)

            const usuarioCadastrado = await usuarioDAO.cadastrar({email, nome, senha: senhaHash});
            if(!usuarioCadastrado?.insertId){
                return errorMessage(res,  "Não foi possível cadastrar usuario", 400)
            }

            const nomeRole = admin && criadoPorAdmin ? ROLES.ADMIN : ROLES.USUARIO
            const role_id = findOne(await rolesDAO.byNome(nomeRole))?.id;
            const resultUsuarioRoles = await usuariosRolesDAO.cadastrar({role_id, usuario_id: usuarioCadastrado.insertId});

            if(!resultUsuarioRoles?.affectedRows){
                await usuarioDAO.deletar(usuarioCadastrado.insertId);
                return errorMessage(res,  "Não foi possível cadastrar usuario", 400)
            }

            const usuario = await getUsuarioFormatado(usuarioCadastrado.insertId);
            if (!criadoPorAdmin) {
                usuario.accessToken = getToken(usuario.email)
            }

            return resData(res, usuario, 201)
        }catch(e){
            registrarErro(req, e, 'UsuariosController.cadastrar')
            return errorMessage(res, e?.message)
        }
    }

    static async listar(req, res){
        try{
            const usuarios = await usuarioDAO.listar();
            return resData(res, usuarios.map(removeSenha))
        }catch(e){
            registrarErro(req, e, 'UsuariosController.listar')
            return errorMessage(res, e?.message)
        }
    }

    static async deletar(req, res){
        try{
            const {id} = req.params
            const usuarioDeletado = await usuarioDAO.deletar(id);
            if(!usuarioDeletado?.affectedRows){
                return errorMessage(res, "Usuário não encontrado", 404)
            }
           return resData(res, {message: "Usuário deletado com sucesso"})
        }catch(e){
            registrarErro(req, e, 'UsuariosController.deletar')
            return errorMessage(res, e?.message)
        }
    }

    static async atualizar(req, res){
        try{
            const {id} = req.params

            const erroValidacao = validaAlteracao(req.body);
            if(erroValidacao){
                return errorValidacao(res, erroValidacao)
            }

            const { nome, senha, ativo } = req.body

            if (ativo !== undefined && !isAdmin(req.user)) {
                return errorMessage(res, "Apenas administradores podem alterar o status do usuário", 403)
            }

            const dados = {
                nome,
                senha: senha ? getHashSenha(senha) : undefined,
                ativo,
            }

            if (Object.values(dados).every(v => v === undefined)) {
                return errorMessage(res, "Nenhum campo para alterar", 400)
            }

            if (!findOne(await usuarioDAO.byId(id))) {
                return errorMessage(res, "Usuário não encontrado", 404)
            }

            const usuarioAlterado = await usuarioDAO.atualizar({ id, ...dados });
            if(!usuarioAlterado?.affectedRows){
                return errorMessage(res, "Não foi possível alterar usuário")
            }

            const usuario = await getUsuarioFormatado(id);
            return resData(res, usuario)
        }catch(e){
            registrarErro(req, e, 'UsuariosController.atualizar')
            return errorMessage(res, e?.message)
        }
    }

    static async byId(req, res){
        try{
            const {id} = req.params;
            const usuario = await getUsuarioFormatado(id);
            if (!usuario) {
                return errorMessage(res, "Usuário não encontrado", 404)
            }
            return resData(res, usuario)
        }catch(e){
            registrarErro(req, e, 'UsuariosController.byId')
            return errorMessage(res, e?.message)
        }
    }
}

export default UsuariosController
