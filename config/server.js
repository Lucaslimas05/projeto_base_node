
import express from 'express'
import routes from '../app/routes';
import bodyParser from 'body-parser'

const app = express();

app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

routes(app)

app.get("/", (req, res)=> res.send("connect"))

export default app;
