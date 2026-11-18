import LogDAO from "../dao/LogDAO";

const logDAO = new LogDAO();

export function registrarErro(req, error, funcao, nivel = "ERROR") {
  const log = {
    usuario_id: req?.user?.id ?? null,
    nivel,
    msg: error?.message || String(error),
    stack_trace: error?.stack || null,
    funcao,
    rota: req ? `${req.method} ${req.path}` : null,
  };

  logDAO.inserir(log).catch((e) => console.error("Falha ao gravar log", e?.message));
}
