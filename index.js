const inquirer = require('inquirer');
const cTable = require('console.table');
const Func = require('./utils/func');
// const viewDepartments = require('./utils/func');
//const db = require('./db/connection')


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
                    'Add Department'
                ]
                }).then((answer) => {
            switch (answer.menu) {
                case 'View All Employees':
                    Func.viewEmployees();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    viewDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Exit':
                    Connection.end();
                    break;
            }
        });
    }

// Function call to initialize app
mainmenu();

module.exports = { mainmenu }