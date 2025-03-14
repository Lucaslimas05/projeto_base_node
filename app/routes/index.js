import routesUsuarios from './usuarios'
import routesAuth from './auth'
import antentica from '../middlware/autenticacao'

const routes = app => {
    app.use(routesAuth)
    app.use(antentica)
    app.use(routesUsuarios)
}

export default routes;