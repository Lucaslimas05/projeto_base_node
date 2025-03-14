import jwt from 'jsonwebtoken';
import { findOne } from '../utils/format';
import UsuariosDAO from '../dao/UsuariosDAO';

export async function antentica(req, res, next) {
    try {
        const token = extractToken(req)
        jwt.verify(token, process.env.API_SECRET);
        const decoded = jwt.decode(token);
        const usuarioDAO = new UsuariosDAO()
        const usuario = findOne(await usuarioDAO.byEmail(decoded.sub));
        if (usuario) {
            req.user = usuario;
        }
        next();
    } catch (e) {
        res.status(401).json({ message: "Não autorizado" })
    }
}

function extractToken(req) {
    //Authorization: Bearer TOKEN
    const authorization = req.header('authorization') || `Bearer ${req.query?.token}`
    if (authorization) {
        const parts = authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1]
        }
    }

    return undefined
}



export default antentica;