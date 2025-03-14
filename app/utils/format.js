export function findOne(list){
    try{
        return list[0]
    }catch(e){
        return null
    }
}

export function removeSenha(data){
    try{
        delete data.senha;
        return data
    }catch(e){
        return data
    }
}