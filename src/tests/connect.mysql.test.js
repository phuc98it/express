const mysql = require('mysql2')

// create conncetion to pool server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'shopDev'
})

// perform a sample operation
// pool.query('SELECT 1 + 1 AS solution', function(err, result) {
// pool.query('select * from users;', function(err, result) {

//     if(err) throw err

//     console.log(`query result: `, result)

//     // close pool connection
//     pool.end(err => {
//         if(err) throw err
//         console.log(`connection closed: `)
//     })
// })


const batchSize = 10000;
const totalSize = 1_000_000;

console.time("::: TIMER :::")

let currentId = 1
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++;        
    }

    if (!values.length) {
        console.timEnd(':::TIMEND:::')
        pool.end(err => {
            if (err) {
                console.log(`Error occurred while running batch`)
            } else {
                console.log(`Connection Pool closed successfully`)
            }
        })
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function (err, results) {
        if(err) throw err
        console.log(`Inserted ${results.affectedRows} records`);
        await insertBatch()
    })
}

insertBatch().catch(console.error)

