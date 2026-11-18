import { ROLES } from "../app/global/constants";
import { tables } from "../app/global/sql";
import { getHashSenha } from "../app/utils/autenticacao";
import dbConnection from "./dbPG";

const { tb_usuarios, tb_roles, tb_usuarios_roles, tb_logs } = tables;

const QUERY_COLS =
  ", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deleted_at TIMESTAMP";

async function query(sql, params = []) {
  const client = await dbConnection().connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

async function tableExists(tableName) {
  const res = await query(
    `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1 LIMIT 1`,
    [tableName]
  );
  return res.rowCount > 0;
}

async function createTableIfNotExists(name, schema, callback) {
  if (await tableExists(name)) {
    return;
  }
  console.log(`Criando tabela ${name} ...`);
  await query(`CREATE TABLE ${name} (${schema})`);
  console.log(`Tabela ${name} criada`);

  if (callback) {
    await callback();
  }
}

async function addForeignKey(fromTable, fromCol, toTable, toCol) {
  const constraint = `fk_${fromTable}_${fromCol}`;
  try {
    await query(
      `ALTER TABLE ${fromTable} ADD CONSTRAINT ${constraint} FOREIGN KEY (${fromCol}) REFERENCES ${toTable}(${toCol})`
    );
    console.log(`FK criada: ${fromTable}.${fromCol} -> ${toTable}.${toCol}`);
  } catch (err) {
    // 42710 = duplicate_object (constraint já existe)
    if (err.code !== "42710") {
      console.log(`Erro criando FK ${constraint}:`, err.message);
    }
  }
}

async function safeInsert(table, colsPart, valuesArr) {
  // valuesArr: array de arrays com valores. colsPart ex: "(nome)"
  for (const vals of valuesArr) {
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `INSERT INTO ${table} ${colsPart} VALUES (${placeholders})`;
    try {
      await query(sql, vals);
    } catch (err) {
      console.log(`Inserção em ${table} falhou: ${err.code || err.message}`);
    }
  }
}


async function seedAdminTeste() {
  const email = "lucas@teste.com";

  const existe = await query(`SELECT 1 FROM ${tb_usuarios} WHERE email = $1 LIMIT 1`, [email]);
  if (existe.rowCount > 0) {
    return;
  }

  const senhaHash = getHashSenha("123456");
  const res = await query(
    `INSERT INTO ${tb_usuarios} (nome, email, senha) VALUES ($1, $2, $3) RETURNING id`,
    ["lucas", email, senhaHash]
  );
  const usuarioId = res.rows[0].id;

  const role = await query(`SELECT id FROM ${tb_roles} WHERE nome = $1 LIMIT 1`, [ROLES.ADMIN]);
  const roleId = role.rows[0]?.id;

  await query(`INSERT INTO ${tb_usuarios_roles} (usuario_id, role_id) VALUES ($1, $2)`, [
    usuarioId,
    roleId,
  ]);

  console.log(`Usuário admin de teste criado: ${email} / senha: 123456`);
}

export async function run() {
  try {
    console.log("=== Iniciando criação de tabelas (PostgreSQL) ===");

    // 1) roles
    await createTableIfNotExists(
      tb_roles,
      `id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, nome VARCHAR(100)`,
      async () => {
        await safeInsert(tb_roles, `(nome)`, Object.values(ROLES).map((r) => [r]));
      }
    );

    // 2) usuarios
    await createTableIfNotExists(
      tb_usuarios,
      `id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       nome VARCHAR(100),
       email VARCHAR(150),
       senha VARCHAR(100),
       token_gmail VARCHAR(255),
       img VARCHAR(255),
       ativo BOOLEAN DEFAULT TRUE
       ${QUERY_COLS}`
    );

    // 3) usuarios_roles
    await createTableIfNotExists(
      tb_usuarios_roles,
      `usuario_id INTEGER, role_id INTEGER`
    );
    await addForeignKey(tb_usuarios_roles, "usuario_id", tb_usuarios, "id");
    await addForeignKey(tb_usuarios_roles, "role_id", tb_roles, "id");

    // 4) logs
    await createTableIfNotExists(
      tb_logs,
      `id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
       usuario_id INTEGER,
       nivel VARCHAR(10) DEFAULT 'ERROR',
       msg TEXT,
       stack_trace TEXT,
       funcao VARCHAR(200),
       rota VARCHAR(200),
       horario TIMESTAMPTZ DEFAULT NOW()`
    );
    await addForeignKey(tb_logs, "usuario_id", tb_usuarios, "id");

    // 5) usuário admin de teste
    await seedAdminTeste();

    console.log("=== Estrutura criada/confirmada no PostgreSQL ===");
  } catch (err) {
    console.error("Erro ao criar estrutura PostgreSQL:", err);
  }
}
