import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

export const JWT_ISSUER = process.env.ISS || 'projeto-base-node'

export const getToken = (email) => {
    return jwt.sign(
        { sub: email, iss: JWT_ISSUER },
        process.env.API_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )
}

export const getHashSenha = (senha) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt);
}
