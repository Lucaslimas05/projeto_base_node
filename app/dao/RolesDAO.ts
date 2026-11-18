import { tables } from "../global/sql";
import { GenericDAO } from "./GenericDAO";

const { tb_roles } = tables;

class RolesDAO extends GenericDAO {
    byNome(nome: string) {
        return this.query(`select * from ${tb_roles} where nome = $1`, [nome]);
    }
}

export default RolesDAO;
