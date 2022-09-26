const inquirer = require('inquirer');
require('console.table');
const db = require('../db/connection');
const { printTable } = require('console-table-printer');
const main = require('../index');


const viewEmployees = () => {
    console.log('Showing all employees...\n');
    db.promise().query(`SELECT employee.id AS ID,
                         employee.first_name AS First_Name,
                         employee.last_name AS Last_Name,
                         role.title AS Role,
                         department.department_name AS Department,
                         role.salary AS Salary,
                         CONCAT (manager.first_name, " ", manager.last_name) AS Manager
                         FROM employee
                         LEFT JOIN role ON employee.role_id = role.id
                         LEFT JOIN department ON role.department_id = department.id
                         LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
        (err, answer) => {
            if (err) {
                throw err
            } else {
                //console.table(answer);
                printTable(answer);
            }
        })
}

const viewRoles = () => {
    db.query(`SELECT role.id AS ID,
                     role.title AS Role,
                     department.department_name AS Department,
                     role.salary AS Salary
                     FROM role
                     INNER JOIN department on role.department_id = department.id;`,
        (err, answer) => {
            if (err) {
                throw err
            } else {
                printTable(answer);
                console.log('...\n');
            }
        })
}

const viewDepartments = () => {
    console.log('Showing all Departments...\n');
    db.query('SELECT * FROM department', (err, answer) => {
        if (err) {
            throw err
        } else {
            printTable(answer);
        }
    })
}

const addEmployee = () => {
    db.query(`SELECT title, id FROM role`, (err, answer) => {
        if (err) {
            throw err
        } else {
            const roleChoice = answer.map(({ id, title }) => ({
                name: title,
                value: id
            }));
            db.query(`SELECT * FROM employee WHERE role_id = 1`, (err, answer) => {
                if (err) {
                    throw err;
                } else {
                    const managerList = answer.map(({ manager_id, first_name }) => ({
                        name: first_name,
                        value: manager_id
                    }));

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'What is the employees first name?'
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'What is the employees last name?'
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: 'What is the employees role?',
                            choices: roleChoice

                        },
                        {
                            type: 'list',
                            name: 'managed',
                            message: 'Does the employee have a manager?',
                            choices: ["Yes", "No"]
                        }

                    ]).then((answer) => {
                        let first_name = answer.first_name;
                        let last_name = answer.last_name;
                        let role_id = answer.role_id;

                        if (answer.managed === "No") {
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, null)`,
                            console.log("********************************************************...\n"),
                            console.log("Success! " + first_name + " has been added to database."),
                            console.log("********************************************************...\n"));

                        } else if (answer.managed === "Yes") {
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager_id',
                                    message: 'Who is the Manager?',
                                    choices: managerList
                                }
                            ]).then((answer) => {
                                let manager_id = answer.manager_id;

                                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`,
                                    //console.log(manager_id)
                                    console.log("********************************************************.../n"),
                                    console.log("Success! " + first_name + " has been added to database."),
                                    console.log("********************************************************.../n"));
                            })

                        }

                    })
                }
            })
        }
    })
}

const addRole = () => {
    db.query(`SELECT department_name, id FROM department`, (err, answer) => {
        if (err) {
            throw err
        } else {
            let departmentChoice = answer.map(({ id, department_name }) => ({
                name: department_name,
                value: id
            }))

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'What department does the role belong to?',
                    choices: departmentChoice
                }
            ]).then(answer => {
                console.log(answer)
                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.department_id})`, (err, answer) => {
                    if (err) {
                        throw err
                    } else {
                        console.log("Success! " + answer.title + " role added.");

                    }

                })
            })
        }
    })
    main.mainmenu();
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartmentName',
            message: 'What is the name of the department?'
        },
    ])
}

const updateEmployee = () => {
    inquirer.prompt([
        {
            type: 'choice',
            name: 'updateEmployeeName',
            message: 'Which employees role do you want to update?',
            choices: []
        },
        {
            type: 'choice',
            name: 'updateEmployeeRole',
            message: 'What role do you want to assign the selected employee?',
            choices: []
        },
    ])
}


module.exports = {
    viewEmployees,
    viewRoles,
    viewDepartments,
    addEmployee,
    addRole,
    addDepartment,
    updateEmployee
}