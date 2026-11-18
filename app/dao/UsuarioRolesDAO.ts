import { tables } from "../global/sql";
import { GenericDAO } from "./GenericDAO";

const { tb_usuarios_roles, tb_roles } = tables;

class UsuarioRolesDAO extends GenericDAO {

    cadastrar(usuarioRole: { usuario_id: number; role_id: number }) {
        const { sql, values } = this.buildInsertQuery(tb_usuarios_roles, usuarioRole);
        return this.query(sql, values, true);
    }

    byUserId(id: string | number) {
        return this.query(`
            select
                ur.*,
                r.nome as role_nome
            from ${tb_usuarios_roles} ur
            join ${tb_roles} r
                on r.id = ur.role_id
            where ur.usuario_id = $1`, [id]
        );
    }

    removerRoles(usuario_id: string | number) {
        const { sql, values } = this.buildDeleteQuery(tb_usuarios_roles, { usuario_id });
        return this.query(sql, values, true);
    }
}

export default UsuarioRolesDAO;
