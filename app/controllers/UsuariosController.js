
import UsuariosDAO from "../dao/UsuariosDAO"
import { findOne } from "../utils/format"
import { validaCadastro } from "../validations/usuarios.js/usuarios"
import ResponseController from "./ResponseController"
import  bcrypt from "bcrypt"

const usuarioDAO = new UsuariosDAO()
const response = new ResponseController();

const { errorMessage, errorValidacao, resData } = response

class UsuariosController {

    static async cadastrar(req, res){
        try{
            const erroValidacao = validaCadastro(req.body);
            if(erroValidacao){
               return errorValidacao(res, erroValidacao)
            }

            const { senha } = req.body
            const salt = bcrypt.genSaltSync(10);
            const senhaHash =  bcrypt.hashSync(senha, salt);
            
            const result = await usuarioDAO.cadastrar({ ...req.body, senha: senhaHash}); 
            if(!result?.insertId){
                return errorMessage(res,  "Não foi possível cadastrar usuario", 400)
            }

            const usuario = findOne(await usuarioDAO.byId(result.insertId));

            return resData(res, usuario, 201)
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }    

    static async listar(req, res){
        try{
            const usuarios = await usuarioDAO.listar();
            resData(res, usuarios)
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }    

    static async deletar(req, res){
        
    }    
    static async atualizar(req, res){
        
    }  
      
    static async byId(req, res){
        
    }  
}

export default UsuariosController