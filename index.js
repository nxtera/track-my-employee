const inquirer = require('inquirer');
const cTable = require('console.table');
const Func = require('./utils/func');
// const viewDepartments = require('./utils/func');
const db = require('./db/connection')


const mainmenu = () => {

    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'menu',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Exit'
        ]

    }).then((answer) => {

        switch (answer.menu) {

            case 'View All Employees':
                Func.viewEmployees()
                    .then(() => mainmenu());
                break;

            case 'Add Employee':
                Func.addEmployee();
                break;

            case 'Update Employee Role':
                Func.updateRole();
                break;

            case 'View All Roles':
                console.log('...\n');
                Func.viewRoles();
                mainmenu();
                break;

            case 'Add Role':
                Func.addRole();
                break;

            case 'View All Departments':
                console.log('...\n');
                Func.viewDepartments();
                //mainmenu ();
                break;

            case 'Add Department':
                Func.addDepartment();
                break;

            case 'Exit':
                db.end();
                break;
        }
    });
}

// Function call to initialize app
mainmenu();

module.exports = { mainmenu };