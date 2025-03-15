
import RolesDAO from "../dao/RolesDAO"
import UsuarioRolesDAO from "../dao/UsuarioRolesDAO"
import UsuariosDAO from "../dao/UsuariosDAO"
import { ROLES } from "../global/constants"
import { getHashSenha, getToken } from "../utils/autenticacao"
import { findOne, removeSenha } from "../utils/format"
import { validaCadastro } from "../validations/usuarios.js/usuarios"
import ResponseController from "./ResponseController"

const usuarioDAO = new UsuariosDAO()
const rolesDAO = new RolesDAO()
const usuariosRolesDAO = new UsuarioRolesDAO()
const response = new ResponseController();

const { errorMessage, errorValidacao, resData } = response

class UsuariosController {

    static async cadastrar(req, res){
        try{
            const erroValidacao = validaCadastro(req.body);
            if(erroValidacao){
               return errorValidacao(res, erroValidacao)
            }

            const { email, senha, admin, nome } = req.body

            const usuarioEncontrado = findOne(await usuarioDAO.byEmail(email))
            if(usuarioEncontrado){
                return  errorMessage(res,  "Já existe usuário com e-mail cadastrado", 400)
            }

            const senhaHash =  getHashSenha(senha)
            
            const usuarioCadastrado = await usuarioDAO.cadastrar({email, nome, senha: senhaHash}); 
            if(!usuarioCadastrado?.insertId){
                return errorMessage(res,  "Não foi possível cadastrar usuario", 400)
            }

            let role_id = findOne(await rolesDAO.byNome( admin ?  ROLES.ADMIN : ROLES.USUARIO))?.id;
            const resultUsuarioRoles = await usuariosRolesDAO.cadastrar({role_id, usuario_id: usuarioCadastrado.insertId});

            if(!resultUsuarioRoles?.affectedRows){
                await usuarioDAO.deletar(usuarioCadastrado.insertId);
                return errorMessage(res,  "Não foi possível cadastrar usuario", 400)
            }

            const usuario = findOne(await usuarioDAO.byId(usuarioCadastrado.insertId));
            const roles = await usuariosRolesDAO.byUserId(usuario.id)
            const accessToken = getToken(usuario.email)
            const usuarioAtt = removeSenha({...usuario, accessToken, roles});
            
            return resData(res, usuarioAtt, 201)
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }    

    static async listar(req, res){
        try{
            const usuarios = await usuarioDAO.listar();
            return resData(res, usuarios)
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }    

    static async deletar(req, res){
        try{
            const {id} = req.params
            const usuarioDeletado = await usuarioDAO.deletar(id);
            if(!usuarioDeletado?.affectedRows){
                return errorMessage(res, "Não foi possível deletar usuário")
            }
           return resData(res, {message: "Usuário deletado com sucesso"})
        }catch(e){
            return errorMessage(res, e?.message)
        }
        
        
    }    
    static async atualizar(req, res){
        
    }  
      
    static async byId(req, res){
        try{
            const {id} = req.params;
            const usuario =  findOne(await usuarioDAO.byId(id));
            const roles = await usuariosRolesDAO.byUserId(usuario.id)
            const accessToken = getToken(usuario.email)
            const usuarioAtt = removeSenha({...usuario, accessToken, roles});
            return resData(res, usuarioAtt)
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }  
}

export default UsuariosController