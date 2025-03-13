import dbConnection from "./db";

const QUERY = ", created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP, deleted_at TIMESTAMP"

const run = function(){
    const db = dbConnection()
    db.query("SHOW TABLES LIKE 'usuarios'", (error, result) => {
       if(!error && !result?.length){
           db.query(`create table usuarios (id INT PRIMARY KEY AUTO_INCREMENT, nome VARCHAR(100), email VARCHAR(150), senha VARCHAR(100), token_gmail VARCHAR(255), img VARCHAR(255)${QUERY})`)
       }
    })
}

export default run


