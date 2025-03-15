import { ROLES } from "../global/constants"

export default function checkSelfUser(){
    return async (req, res, next) => {
        try{    
            const isAdmin = req.user.roles.some(r => r.role_nome === ROLES.ADMIN);
            if(isAdmin || req.user.id + "" === req.params.id + ""){
                return next()
            }
            res.status(401).json({ message: "Não autorizado" })
        }catch(e){
            res.status(401).json({ message: "Não autorizado" })
        }
    }
   
}   