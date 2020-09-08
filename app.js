const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const selectAll = "SELECT DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') as 'time',voltage,current,estSOC as SOC ,estSOH_R as SOHR, estSOH_C as SOHC FROM sbg";
const port = 5000

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'GZc51504',
    database:'gear'
})

connection.connect(err=>{
    if (err){
        return err;
    }
})

// console.log(connection)

app.use(cors())

app.get('/', (req, res) => {
    res.send('First time download--> /init')
})

app.get('/init', (req, res) => {
    connection.query(selectAll,(err,results)=>{
        if (err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    })
})

app.get('/update',(req,res) => {
    const obj = req.query;
    const updateQuery = "SELECT DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') as 'time',voltage,current,estSOC as SOC, estSOH_R as SOHR ,estSOH_C as SOHC FROM sbg WHERE time > '"+ obj.time + "'"
    // console.log(obj)
    // console.log(updateQuery)
    connection.query(updateQuery,(err,results)=>{
        if (err){
            return res.send(err)
        }
        else{
            return res.json({
                data:results
            })
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
