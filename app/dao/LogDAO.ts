import { tables } from "../global/sql";
import { GenericDAO } from "./GenericDAO";

const { tb_logs } = tables;

export type Log = {
    usuario_id?: number | null;
    nivel?: "ERROR" | "WARN";
    msg: string;
    stack_trace?: string | null;
    funcao?: string;
    rota?: string | null;
};

class LogDAO extends GenericDAO {
    inserir({ usuario_id, nivel, msg, stack_trace, funcao, rota }: Log) {
        return this.query(
            `INSERT INTO ${tb_logs} (usuario_id, nivel, msg, stack_trace, funcao, rota) VALUES ($1, $2, $3, $4, $5, $6)`,
            [usuario_id ?? null, nivel ?? "ERROR", msg, stack_trace ?? null, funcao ?? null, rota ?? null],
            true
        );
    }
}

export default LogDAO;
