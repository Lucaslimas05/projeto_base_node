import { tables, without_deleted_at } from "../global/sql";
import { GenericDAO } from "./GenericDAO";

const { tb_usuarios } = tables;

class UsuariosDAO extends GenericDAO {

    listar() {
        return this.query(`select * from ${tb_usuarios} where ${without_deleted_at}`);
    }

    byEmail(email: string) {
        return this.query(`select * from ${tb_usuarios} where email = $1 and ${without_deleted_at}`, [email]);
    }

    byId(id: string | number) {
        return this.query(`select * from ${tb_usuarios} where id = $1 and ${without_deleted_at}`, [id]);
    }

    cadastrar(user: Record<string, any>) {
        const { sql, values } = this.buildInsertQuery(tb_usuarios, user);
        return this.query(sql, values, true);
    }

    deletar(id: string | number) {
        return this.query(`update ${tb_usuarios} set deleted_at = NOW() where id = $1 and ${without_deleted_at}`, [id], true);
    }

    atualizar({ id, ...dados }: Record<string, any>) {
        const { sql, values } = this.buildUpdateQuery(tb_usuarios, { ...dados, updated_at: new Date() }, { id });
        return this.query(sql, values, true);
    }

}

export default UsuariosDAO;
