import routesUsuarios from './usuarios'
import bodyParser from 'body-parser'

const routes = app => {
    app.use(bodyParser.json())
    //app.use(express.json())
    app.use(routesUsuarios)
}

export default routes;