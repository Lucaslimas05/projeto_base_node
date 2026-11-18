import { registrarErro } from "../utils/logger";


export function erroHandler(err, req, res, _next) {
  registrarErro(req, err, "ExpressErrorMiddleware");
  res.status(500).json({ message: err?.message || "Erro interno" });
}
