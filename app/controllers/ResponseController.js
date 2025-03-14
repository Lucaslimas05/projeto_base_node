class ResponseController {
    errorMessage(res, message = "Erro interno", status = 500){
       return res.status(status).json({message})
    }
    errorValidacao(res, validacao, message = "Dados inválidos", status = 400){
       return res.status(status).json({message, validacao})
    }
    resData(res, data, status = 200){
      return res.status(status).json(data);
    }
}

export default ResponseController