const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// const db = mysql.createConnection(
//     {
//       host: 'localhost',
//       user: 'root',
//       password: 'ninja',
//       database: 'employee_db'
//     },
//     console.log(`Connected to the employee_db database.`)
//   );


const viewEmployees = () => {
    db.query('SELECT * FROM employee', (err, answer) => {
        if(err){
            throw err
        } else {
            console.table(answer)
            mainmenu();
        }
    })
}

const viewRoles = () => {
    db.query('SELECT * FROM role', (err, result) => {
        console.table(result);
    })
}

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, result) => {
        console.table(result);
    })
}

module.exports = {
    viewEmployees,
    viewRoles,
    viewDepartments,
}
