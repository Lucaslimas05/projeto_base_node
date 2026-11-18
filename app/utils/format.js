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

export function cleanObject(obj, options = {}) {
    const {
        removeEmptyStrings = true,
        treatStringUndefined = true
    } = options;

    const result = {};

    for (const key in obj) {
        const value = obj[key];

        if (value === undefined) continue;
        if (treatStringUndefined && value === "undefined") continue;
        if (removeEmptyStrings && value === "") continue;

        result[key] = value;
    }

    return result;
}
