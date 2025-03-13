import { GenericDAO } from "./GenericDAO";
import mysql from "mysql"

class UsuariosDAO extends GenericDAO {
    
    listar(): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from usuarios where deleted_at IS NULL`).then(res).catch(rej);
        })
    }

    byEmail(nome: string): Promise<any>{
        return new Promise((res, rej) => {
            this.query(`select * from usuarios where email = ${mysql.escape(nome)}`).then(res).catch(rej);
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
            const timestamp = new Date();
            this.query(`update usuarios set deleted_at = ${timestamp} where id = ${id}`).then(res).catch(rej);
        })
    }

    atualizar(usuario): Promise<any>{
        return new Promise((res, rej) => {
           // this.query(`update usuarios set nome = ${ mysql.escape(name)} where id = ${id}`).then(res).catch(rej);
        })
    }

}

export default UsuariosDAO;