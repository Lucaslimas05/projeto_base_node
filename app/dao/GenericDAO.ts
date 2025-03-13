// import { Connection } from "mysql";
import dbConnection from "../../config/db";

export class GenericDAO {
    protected query(sql: string, body?: any){
        return new Promise((res, rej) => {
            try {
                const db = dbConnection();
                db.connect((error) => {
                    if (error) { rej(error) }

                    const response = (err: any, results: any) => {
                        db.end() 
                        if (err) {  rej(err) }
                        res(results)
                    }
                    if(body){
                        db.query(sql, body, response)
                    }else{
                        db.query(sql, response);
                    }
                });
            } catch (error) {
                console.error('MYSQL', error)
            }
        })
    }
}

