const inquirer = require("inquirer");
require("console.table");
const db = require("../db/connection");
const main = require("../index");

// Delete an Employee
const deleteEmployee = () => {
  db.query(`SELECT * FROM employee`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const EmployeeList = answer.map(({ id, first_name, last_name }) => ({
        name: `${first_name}` + ` ${last_name}`,
        value: { id },
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectedEmployee",
            message: "Select the employee you want to DELETE from the database",
            choices: EmployeeList,
          },
        ])
        .then((answer) => {
          let selectedEmployee = answer.selectedEmployee.id;
          inquirer
            .prompt([
              {
                type: "input",
                name: "confirm",
                message: "Type 'DELETE' to confirm deletion",
              },
            ])
            .then((answer) => {
              if (answer.confirm !== "DELETE") {
                console.log("Employee was NOT deleted...");
                let options = main.isFinished();
              } else {
                db.query(
                  `DELETE FROM employee WHERE id = ${selectedEmployee}`,
                  (err, answer) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log("\n"),
                        console.log(
                          "****************************************************************************"
                        ),
                        console.log("Success! Employee has been deleted."),
                        console.log(
                          "****************************************************************************\n"
                        );
                      let options = main.isFinished();
                    }
                  }
                );
              }
            });
        });
    }
  });
};

// Delete a Role
const deleteRole = () => {
  db.query(`SELECT title, id FROM role`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const roleList = answer.map(({ id, title }) => ({
        name: title,
        value: { id, title },
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectedRole",
            message: "Select the role you want to DELETE from the database",
            choices: roleList,
          },
        ])
        .then((answer) => {
          let selectedRole = answer.selectedRole.id;
          inquirer
            .prompt([
              {
                type: "input",
                name: "confirm",
                message: "Type 'DELETE' to confirm deletion",
              },
            ])
            .then((answer) => {
              if (answer.confirm !== "DELETE") {
                console.log("Role was NOT deleted...");
                let options = main.isFinished();
              } else {
                db.query(
                  `DELETE FROM role WHERE id = ${selectedRole}`,
                  (err, answer) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log("\n"),
                        console.log(
                          "****************************************************************************"
                        ),
                        console.log("Success! Role has been deleted."),
                        console.log(
                          "****************************************************************************\n"
                        );
                      let options = main.isFinished();
                    }
                  }
                );
              }
            });
        });
    }
  });
};

// Delete a Department
const deleteDepartment = () => {
  db.query(`SELECT id, department_name FROM department`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const departmentList = answer.map(({ id, department_name }) => ({
        name: department_name,
        value: { id, department_name },
      }));
      inquirer
        .prompt([
          {
            type: "list",
            name: "selectedDepartment",
            message:
              "Select the department you want to DELETE from the database",
            choices: departmentList,
          },
        ])
        .then((answer) => {
          let selectedDepartment = answer.selectedDepartment.id;
          inquirer
            .prompt([
              {
                type: "input",
                name: "confirm",
                message: "Type 'DELETE' to confirm deletion",
              },
            ])
            .then((answer) => {
              if (answer.confirm !== "DELETE") {
                console.log("Department was NOT deleted..."), isFinished();
              } else {
                db.query(
                  `DELETE FROM department WHERE id = ${selectedDepartment}`,
                  (err, answer) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log("\n"),
                        console.log(
                          "****************************************************************************"
                        ),
                        console.log("Success! Department has been deleted."),
                        console.log(
                          "****************************************************************************\n"
                        );
                      let options = main.isFinished();
                    }
                  }
                );
              }
            });
        });
    }
  });
};

module.exports = {
  deleteEmployee,
  deleteRole,
  deleteDepartment,
};
