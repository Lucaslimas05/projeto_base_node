import app from './config/server'
import { run } from './config/estruturaBanco'

if (process.env.RUN_ESTRUTURA_BANCO === 'true') {
    run();
}

app.listen(process.env.PORT ? Number(process.env.PORT) : 8080)
