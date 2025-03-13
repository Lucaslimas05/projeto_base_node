import { validaEmail } from "../../utils/validacoes";

export const validaCadastro = (usuario) => {
    const {nome, email, senha} = usuario
    const validacoes = []
    if(!nome){
        validacoes.push("Nome obrigatório");
    }
    if(!email){
        validacoes.push("E-mail obrigatório");
    }
    if(!validaEmail(email)){
        validacoes.push("E-mail inválido")
    }
    if(!senha){
        validacoes.push("Senha obrigatório");
    }

    return validacoes?.length ? validacoes : null  
}