import { GenericDAO } from "./GenericDAO";

class UsuarioRolesDAO extends GenericDAO {
    
    cadastrar(usuarioRole: any): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`insert into usuario_roles set ?`, usuarioRole).then(res).catch(rej);
        })
    }
    byUserId(id: string): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`
                    select 
                        ur.*, 
                        r.nome as role_nome 
                    from usuario_roles ur 
                    join roles r 
                        on r.id = ur.role_id 
                    where ur.usuario_id = ?`, [id]
                ).then(res).catch(rej);
        })
    }
}

export default UsuarioRolesDAO;