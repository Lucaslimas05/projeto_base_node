import { without_deleted_at } from "../global/sql";
import { getTimestamp } from "../utils/date";
import { GenericDAO } from "./GenericDAO";

class UsuariosDAO extends GenericDAO {
    
    listar(): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from usuarios where ${without_deleted_at}`).then(res).catch(rej);
        })
    }

    byEmail(email: string): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from usuarios where email = ? and ${without_deleted_at}`, [email]).then(res).catch(rej);
        })
    }

    byId(id: string): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from usuarios where id = ${id}`).then(res).catch(rej);
        })
    }

    cadastrar(user: any): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`insert into usuarios set ?`, user).then(res).catch(rej);
        })
    }

    deletar(id: string): Promise<any>{
        return new Promise((res, rej) => {
            const timestamp = getTimestamp();
            this.query(`update usuarios set deleted_at = "${timestamp}" where id = ?`, [id]).then(res).catch(rej);
        })
    }

    atualizar(usuario): Promise<any>{
        return new Promise((res, rej) => {
           // this.query(`update usuarios set nome = ${ mysql.escape(name)} where id = ${id}`).then(res).catch(rej);
        })
    }

}

export default UsuariosDAO;