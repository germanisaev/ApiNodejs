const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json);

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port: '3000',
    user: 'aaa.bbbb@gmail.com',
    password: '********',
    database: 'EmployeeDB',
    stringifyObjects: true,
    multipleStatements: true,
    dateStrings: 'DATETIME',
    connectTimeout: 60000
});

mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB connection success.');
    else
        console.log('DB connection failed. \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000, () => console.log('Express server is running at port no: 3000'));

app.get('/employees', (req,res) => {
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
        if(!err)
            console.log(rows);
        else
            console.log(err);
    })
});

app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee WHERE EmpId = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            console.log(rows);
        else
            console.log(err);
    })
});

app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employee WHERE EmpId = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            console.log('Deleted success');
        else
            console.log(err);
    })
});

app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpId, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
        rows.forEach(element => {
            if(element.constructor == Array)
            res.send('Inserted New Employee id : ' + element[0].EmpId);
        });
        else
            console.log(err);
    })
});

app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?;CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpId, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Updated success');
        else
            console.log(err);
    })
});

