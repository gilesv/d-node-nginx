const express = require('express')
const mysql = require('promise-mysql')

const app = express()
const port = 3000;

async function PeopleService(connection) {
    // create People table
    await connection.query(`CREATE TABLE IF NOT EXISTS People (name VARCHAR(20) CHARACTER SET utf8)`);

    return {
        async add(/**string**/ name) {
            await connection.query(`INSERT INTO People SET ?`, { name });
        },

        async list() {
            return await connection.query(`SELECT name FROM People;`)
        }
    }
}


async function main() {
    const connection = await mysql.createConnection({
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'mydb'
    });

    let peopleService = await PeopleService(connection);

    app.get('/', async (req, res) => {
        console.log(req.query);
        await peopleService.add(req.query.name || 'Wesley');
        let people = await peopleService.list();
        let response = `<main><h1>Full Cycle</h1><ul>`;

        people.forEach((p) => {
            response += `<li>${p.name}</li>`
        });

        response += `</ul></main>`;
        res.send(response)
    })

    app.listen(port, ()=> {
        console.log('Rodando na porta ' + port)
    });
}

main();
