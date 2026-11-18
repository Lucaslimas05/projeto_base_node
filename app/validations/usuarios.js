import { validaEmail } from "../utils/validacoes";

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

export const validaAlteracao = (usuario) => {
    const {nome, senha, ativo} = usuario
    const validacoes = []
    if(nome !== undefined && !String(nome).trim()){
        validacoes.push("Nome não pode ser vazio");
    }
    if(senha !== undefined && !String(senha).trim()){
        validacoes.push("Senha não pode ser vazia");
    }
    if(ativo !== undefined && typeof ativo !== "boolean"){
        validacoes.push("Ativo deve ser verdadeiro ou falso");
    }

    return validacoes?.length ? validacoes : null
}

export const validaLogin = (usuario) => {
    const {email, senha} = usuario
    const validacoes = []
    if(!email){
        validacoes.push("E-mail obrigatório");
    }
    if(!senha){
        validacoes.push("Senha obrigatório");
    }

    return validacoes?.length ? validacoes : null
}
