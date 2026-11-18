import dbConnection from "../../config/dbPG";
import { cleanObject } from "../utils/format";

export type WriteResult = {
    affectedRows: number;
    insertId: number | null;
    rows: any[];
    raw: any;
};


function montaEstruturaRetorno(result: any): WriteResult {
    const row = result.rows?.[0];
    return {
        affectedRows: result.rowCount ?? 0,
        insertId: row?.id ?? null,
        rows: result.rows || [],
        raw: result,
    };
}

export class GenericDAO {
    protected async query(sql: string, params?: any[]): Promise<any[]>;
    protected async query(sql: string, params: any[], write: true): Promise<WriteResult>;
    protected async query(sql: string, params: any[] = [], write = false): Promise<any> {
        const client = await dbConnection().connect();
        try {
            const result = await client.query(sql, params);
            return write ? montaEstruturaRetorno(result) : result.rows;
        } finally {
            client.release();
        }
    }

    protected buildInsertQuery(table: string, data: Record<string, any>) {
        const cleanData = cleanObject(data);
        const columns = Object.keys(cleanData);
        const values = Object.values(cleanData);
        const params = columns.map((_, i) => `$${i + 1}`);

        const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${params.join(", ")}) RETURNING *`;
        return { sql, values };
    }

    protected buildUpdateQuery(table: string, data: Record<string, any>, where: Record<string, any>) {
        const cleanData = cleanObject(data);
        const setColumns = Object.keys(cleanData);
        const whereColumns = Object.keys(where);

        const setParams = setColumns.map((col, i) => `${col} = $${i + 1}`);
        const whereParams = whereColumns.map((col, i) => `${col} = $${setColumns.length + i + 1}`);

        const sql = `UPDATE ${table} SET ${setParams.join(", ")} WHERE ${whereParams.join(" AND ")} RETURNING *`;
        return { sql, values: [...Object.values(cleanData), ...Object.values(where)] };
    }

    protected buildDeleteQuery(table: string, where: Record<string, any>) {
        const whereParams = Object.keys(where).map((col, i) => `${col} = $${i + 1}`);
        const sql = `DELETE FROM ${table} WHERE ${whereParams.join(" AND ")} RETURNING *`;
        return { sql, values: Object.values(where) };
    }

    async getFunctions() {
        const client = await dbConnection().connect();

        const beginTransaction = () => client.query("BEGIN");
        const query = async (sql: string, params: any[] = [], write = false) => {
            const res = await client.query(sql, params);
            return write ? montaEstruturaRetorno(res) : res.rows;
        };
        const commit = () => client.query("COMMIT");
        const rollback = () => client.query("ROLLBACK");
        const end = () => client.release();

        return { beginTransaction, query, commit, rollback, end };
    }
}
