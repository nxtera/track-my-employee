const inquirer = require("inquirer");
require("console.table");
const db = require("../db/connection");
const main = require("../index");

// Add an employee
const addEmployee = () => {
    db.query(`SELECT title, id FROM role`, (err, answer) => {
      if (err) {
        throw err;
      } else {
        const roleChoice = answer.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        db.query(`SELECT * FROM employee WHERE role_id = 1`, (err, answer) => {
          if (err) {
            throw err;
          } else {
            const managerList = answer.map(
              ({ manager_id, last_name, first_name }) => ({
                name: `${first_name}` + ` ${last_name}`,
                value: manager_id,
              })
            );
  
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "first_name",
                  message: "What is the employee's first name?",
                },
                {
                  type: "input",
                  name: "last_name",
                  message: "What is the employee's last name?",
                },
                {
                  type: "list",
                  name: "role_id",
                  message: "What is the employee's role?",
                  choices: roleChoice,
                },
                // Promt to check if the added employee has a manager
                {
                  type: "list",
                  name: "managed",
                  message: "Does the employee have a manager?",
                  choices: ["Yes", "No"],
                },
              ])
              .then((answer) => {
                let first_name = answer.first_name;
                let last_name = answer.last_name;
                let role_id = answer.role_id;
  
                // If no manager selected null will be entered into manager id in database
                if (answer.managed === "No") {
                  db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, null)`,
                    console.log("\n"),
                    console.log(
                      "******************************************************************************************"
                    ),
                    console.log(
                      "Success! " +
                        first_name +
                        last_name +
                        " has been added to the database."
                    ),
                    console.log(
                      "******************************************************************************************\n"
                    )
                  );
                  let options = main.isFinished();
  
                  // If a manager is selected user is prompted with a list of current employees
                } else if (answer.managed === "Yes") {
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager_id",
                        message: "Who is the Manager?",
                        choices: managerList,
                      },
                    ])
                    .then((answer) => {
                      let manager_id = answer.manager_id;
  
                      // New employee and mangers information are entered onto the database
                      db.query(
                        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`,
                        console.log("\n"),
                        console.log(
                          "***********************************************************************************"
                        ),
                        console.log(
                          "Success! " +
                            first_name +
                            last_name +
                            " has been added to the database."
                        ),
                        console.log(
                          "************************************************************************************\n"
                        )
                      );
                      let options = main.isFinished();
                    });
                }
              });
          }
        });
      }
    });
  };
  
  // Add a new role into the database, user is prompted to provide additional information on salary, department, etc
  const addRole = () => {
    db.query(`SELECT department_name, id FROM department`, (err, answer) => {
      if (err) {
        throw err;
      } else {
        let departmentChoice = answer.map(({ id, department_name }) => ({
          name: department_name,
          value: id,
        }));
  
        inquirer
          .prompt([
            {
              type: "input",
              name: "title",
              message: "What is the name of the role?",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary of the role?",
            },
            {
              type: "list",
              name: "department_id",
              message: "What department does the role belong to?",
              choices: departmentChoice,
            },
          ])
          .then((answer) => {
            let newRole = answer.title;
            db.query(
              `INSERT INTO role (title, salary, department_id) VALUES ('${newRole}', ${answer.salary}, ${answer.department_id})`,
              (err, answer) => {
                if (err) {
                  throw err;
                } else {
                  console.log("\n"),
                    console.log(
                      "****************************************************************************"
                    ),
                    console.log("Success! " + newRole + " role added."),
                    console.log(
                      "****************************************************************************\n"
                    );
                    let options = main.isFinished();
                }
              }
            );
          });
      }
    });
  };
  
  // Add a new department
  const addDepartment = () => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "addDepartmentName",
          message: "What is the name of the new department?",
        },
      ])
      .then((answer) => {
        let newDepartment = answer.addDepartmentName;
        db.query(
          `INSERT INTO department (department_name) VALUES ('${newDepartment}')`,
          (err, answer) => {
            if (err) {
              throw err;
            } else {
              console.log("\n"),
                console.log(
                  "****************************************************************************"
                ),
                console.log(
                  "Success! " + newDepartment + " department has been added."
                ),
                console.log(
                  "****************************************************************************\n"
                );
                let options = main.isFinished();
            }
          }
        );
      });
  };
  
  module.exports = {
    addEmployee,
    addRole,
    addDepartment,
  };
  