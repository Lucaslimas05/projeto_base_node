import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

export const getToken = (email) => {
    return jwt.sign({ sub: email, iss: 'peri-crash' }, process.env.API_SECRET)
}

export const getHashSenha = (senha) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt);
}