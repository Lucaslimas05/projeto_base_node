import { GenericDAO } from "./GenericDAO";

class RolesDAO extends GenericDAO {
    byNome(nome: string): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from roles where nome = ?`, [nome]).then(res).catch(rej);
        })
    }
}

export default RolesDAO;