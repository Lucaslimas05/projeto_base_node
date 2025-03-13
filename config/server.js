
import express from 'express'
import routes from '../app/routes';

const app = express();

routes(app)

app.get("/", (req, res)=> res.send("connect"))

export default app;
