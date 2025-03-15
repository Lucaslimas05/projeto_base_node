import { ROLES } from "../app/global/constants";
import dbConnection from "./db";

const QUERY = ", created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, deleted_at TIMESTAMP"

const run = function () {
    const db = dbConnection()
    db.query("SHOW TABLES LIKE 'usuarios'", (error, result) => {
        if (!error && !result?.length) {
            db.query(`create table usuarios (id INT PRIMARY KEY AUTO_INCREMENT, nome VARCHAR(100), email VARCHAR(150), senha VARCHAR(100), token_gmail VARCHAR(255), img VARCHAR(255), ativo BOOLEAN DEFAULT 1${QUERY})`, error => {
                if (error) {
                    console.log('error table usuarios', error)
                }
            })
        }
    })
    db.query("SHOW TABLES LIKE 'roles'", (error, result) => {
        if (!error && !result?.length) {
            db.query(`create table roles (id INT PRIMARY KEY AUTO_INCREMENT, nome VARCHAR(100))`, error => {
                if(error){
                    console.log('error table roles', error)
                }else{
                    Object.keys(ROLES).forEach(role_id => {
                        db.query(`insert into roles (nome) values ("${ROLES[role_id]}")`);
                    })
                }
            })
        }
    })
  
    db.query("SHOW TABLES LIKE 'usuario_roles'", (error, result) => {
        if (!error && !result?.length) {
            db.query(`create table usuario_roles (usuario_id INT, role_id INT)`, error => {
                if(error){
                    console.log('error table usuario_roles', error)
                }
            })
        }
    })
}

export default run


