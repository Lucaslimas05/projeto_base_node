

export default function roles(listRoles) {
    return async (req, res, next) => {
        try{
            const objRoles = listRoles.reduce((obj, role) => {
                obj[role] = true;
                return obj
            }, {})
    
            const usuarioPermitido = req.user.roles.some(r => objRoles[r.role_nome]);
            if (!usuarioPermitido) {
                return res.status(401).json({ message: "Não autorizado" })
            }
            next();
        }catch(e){
            return res.status(401).json({ message: "Não autorizado" })
        }
    }
}