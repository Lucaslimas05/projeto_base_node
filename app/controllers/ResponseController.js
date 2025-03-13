class ResponseController {
     errorMessage(res, msgError, status = 500){
       return res.status(status).json({message: msgError || "Erro interno" })
    }
     errorValidacao(res, validacao, status = 400){
       return res.status(status).json({message: "Dados inválidos", validacao})
    }
}

export default ResponseController