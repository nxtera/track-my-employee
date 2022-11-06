const inquirer = require("inquirer");
require("console.table");
const db = require("../db/connection");
const main = require("../index");

// Update employees role
const updateEmployeeRole = () => {
  //Call up list of current employees
  db.query(`SELECT * FROM employee`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const EmployeeList = answer.map(({ id, first_name, last_name }) => ({
        name: `${first_name}` + ` ${last_name}`,
        value: { id, first_name, last_name },
      }));
      // Call up list of current roles
      db.query(`SELECT title, id FROM role`, (err, answer) => {
        if (err) {
          throw err;
        } else {
          const roleChoice = answer.map(({ id, title }) => ({
            name: title,
            value: { id, title },
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "updatedEmployee",
                message: "Which employee's role do you want to update?",
                choices: EmployeeList,
              },
            ])
            .then((answer) => {
              let updatedEmployee = answer.updatedEmployee.id;
              let updatedEmployeeFname = answer.updatedEmployee.first_name;
              let updatedEmployeeLname = answer.updatedEmployee.last_name;

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "updatedRole",
                    message:
                      "What role do you want to assign to the selected employee?",
                    choices: roleChoice,
                  },
                ])
                .then((answer) => {
                  let updatedRole = answer.updatedRole.id;
                  let updatedRoleTitle = answer.updatedRole.title;

                  db.query(
                    `UPDATE employee SET role_id = ${updatedRole} WHERE id = ${updatedEmployee}`,
                    (err, answer) => {
                      if (err) {
                        throw err;
                      } else {
                        console.log("\n"),
                          console.log(
                            "******************************************************************************************************"
                          ),
                          console.log(
                            "Success! " +
                              updatedEmployeeFname +
                              " " +
                              updatedEmployeeLname +
                              "'s role has been updated to " +
                              updatedRoleTitle +
                              "."
                          ),
                          console.log(
                            "********************************************************************************************************\n"
                          );
                        let options = main.isFinished();
                      }
                    }
                  );
                });
            });
        }
      });
    }
  });
};

// Update employee's manager
const updateEmployeeManager = () => {
  //Call up list of current employees
  db.query(`SELECT * FROM employee`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const employeeList = answer.map(({ id, first_name, last_name }) => ({
        name: `${first_name}` + ` ${last_name}`,
        value: { id, first_name, last_name },
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "updatedEmployee",
            message: "Which employee do you want to update?",
            choices: employeeList,
          },
        ])
        .then((answer) => {
          let updatedEmployee = answer.updatedEmployee.id;
          let updatedEmployeeFname = answer.updatedEmployee.first_name;
          let updatedEmployeeLname = answer.updatedEmployee.last_name;

          inquirer
            .prompt([
              {
                type: "list",
                name: "updatedManager",
                message: `Who is ${updatedEmployeeFname} ${updatedEmployeeLname}'s new manager?`,
                choices: employeeList,
              },
            ])
            .then((answer) => {
              let updatedManager = answer.updatedManager.id;
              let updatedManagerFname = answer.updatedManager.first_name;
              let updatedManagerLname = answer.updatedManager.last_name;

              db.query(
                `UPDATE employee SET manager_id = ${updatedManager} WHERE id = ${updatedEmployee}`,
                (err, answer) => {
                  if (err) {
                    throw err;
                  } else {
                    console.log("\n"),
                      console.log(
                        "*******************************************************************************************"
                      ),
                      console.log(
                        "Success! " +
                          updatedEmployeeFname +
                          " " +
                          updatedEmployeeLname +
                          " is now managed by " +
                          updatedManagerFname +
                          " " +
                          updatedManagerLname +
                          "!"
                      ),
                      console.log(
                        "*******************************************************************************************\n"
                      );
                    let options = main.isFinished();
                  }
                }
              );
            });
        });
    }
  });
};

module.exports = {
  updateEmployeeRole,
  updateEmployeeManager,
};
