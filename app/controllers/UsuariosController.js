
import UsuariosDAO from "../dao/UsuariosDAO"
import { validaCadastro } from "../validations/usuarios.js/usuarios"
import ResponseController from "./ResponseController"
import  bcrypt from "bcrypt"

const usuarioDAO = new UsuariosDAO()
const response = new ResponseController();

const { errorMessage, errorValidacao } = response

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

            const usuario = await usuarioDAO.byId(result.insertId);
            return res.status(201).json(usuario[0]);
        }catch(e){
            return errorMessage(res, e?.message)
        }
    }    

    static async listar(req, res){
        try{
            const usuarios = await usuarioDAO.listar();
            res.status(200).json(usuarios);
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