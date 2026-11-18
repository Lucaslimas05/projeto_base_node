
import express from 'express'
import cors from 'cors'
import routes from '../app/routes';
import bodyParser from 'body-parser'
import { erroHandler } from '../app/middlware/erroHandler';

const app = express();

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req, res)=> res.send("connect"))

routes(app)

app.use(erroHandler)

export default app;
