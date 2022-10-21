const inquirer = require("inquirer");
require("console.table");
const db = require("../db/connection");
// alternative table viewer
// const { printTable } = require('console-table-printer');
const main = require("../index");

// Function to check if the user wants to exit or perform more functions
const isFinished = () => {
  inquirer
    .prompt({
      type: "list",
      message: "Are you finished?",
      name: "finished",
      choices: ["Yes", "No"],
    })
    .then((answer) => {
      switch (answer.finished) {
        case "No":
          let result = main.mainmenu();
          break;

        case "Yes":
          db.end();
          console.log("See you later!");
          break;
      }
    });
};

// View all employees
const viewEmployees = () => {
  db.query(
    `SELECT employee.id AS ID,
                         employee.first_name AS First_Name,
                         employee.last_name AS Last_Name,
                         role.title AS Role,
                         department.department_name AS Department,
                         role.salary AS Salary,
                         CONCAT (manager.first_name, " ", manager.last_name) AS Manager
                         FROM employee
                         LEFT JOIN role ON employee.role_id = role.id
                         LEFT JOIN department ON role.department_id = department.id
                         LEFT JOIN employee manager ON employee.manager_id = manager.id
                         ORDER BY role.title`,
    (err, answer) => {
      if (err) {
        throw err;
      } else {
        console.log("\n");
        console.log(
          "*********************************************************************************************************\n"
        );
        console.log("SHOWING ALL EMPLOYEES...\n");
        console.table(answer);
        console.log(
          "**********************************************************************************************************\n"
        );
        isFinished();
      }
    }
  );
};

// View all roles
const viewRoles = () => {
  db.query(
    `SELECT role.id AS ID,
                     role.title AS Role,
                     department.department_name AS Department,
                     role.salary AS Salary
                     FROM role
                     INNER JOIN department on role.department_id = department.id;`,
    (err, answer) => {
      if (err) {
        throw err;
      } else {
        console.log("\n");
        console.log(
          "*********************************************************************************************************\n"
        );
        console.log("SHOWING ALL ROLES...\n");
        console.table(answer);
        console.log(
          "**********************************************************************************************************\n"
        );
        isFinished();
      }
    }
  );
};
// View all departments
const viewDepartments = () => {
  db.query(
    `SELECT id AS ID, 
             department_name AS Department
             FROM department;`,
    (err, answer) => {
      if (err) {
        throw err;
      } else {
        console.log("\n");
        console.log(
          "*********************************************************************************************************\n"
        );
        console.log("SHOWING ALL DEPARTMENTS...\n");
        console.table(answer);
        console.log(
          "**********************************************************************************************************\n"
        );
        isFinished();
      }
    }
  );
};

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
                isFinished();

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
                    isFinished();
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
                isFinished();
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
            isFinished();
          }
        }
      );
    });
};

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
                            "******************************************************************************************************************************"
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
                            "*******************************************************************************************************************************\n"
                          );
                        isFinished();
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

// View Employee by Manager
const viewByManager = () => {
  //Call up list of current employees
  db.query(`SELECT * FROM employee`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const EmployeeList = answer.map(({ id, first_name, last_name }) => ({
        name: `${first_name}` + ` ${last_name}`,
        value: { id, first_name, last_name },
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "selectedEmployee",
            message: "Select the employee to see a list of who they manage",
            choices: EmployeeList,
          },
        ])
        .then((answer) => {
          let selectedEmployee = answer.selectedEmployee.id;

          db.query(
            `SELECT employee.id AS ID,
            employee.first_name AS First_Name,
            employee.last_name AS Last_Name 
            FROM employee WHERE manager_id = ${selectedEmployee}`,
            (err, answer) => {
              if (err) {
                throw err;
              } else {
                console.log(
                  "******************************************************************************************************************************"
                ),
                  console.table(answer);
                console.log(
                  "******************************************************************************************************************************"
                ),
                  isFinished();
              }
            }
          );
        });
    }
  });
};

// View Employee by Department
const viewByDepartment = () => {
  // Call up list of current employees
  db.query(`SELECT * FROM department`, (err, answer) => {
    if (err) {
      throw err;
    } else {
      const departmentList = answer.map(({ id, department_name }) => ({
        name: department_name,
        value: { department_name },
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentList",
            message:
              "Select the department to see a list of the empoloyee\'s that work there",
            choices: departmentList,
          },
        ])
        .then((answer) => {
          let selectedDepartment = answer.departmentList.department_name;

          db.query(
            `SELECT employee.id AS ID,
                         employee.first_name AS First_Name,
                         employee.last_name AS Last_Name,
                         department_name AS Department_Name
                         FROM employee, department WHERE department_name = "${selectedDepartment}"`,

            (err, answer) => {
              if (err) {
                throw err;
              } else {
                console.log(
                  "******************************************************************************************************************************"
                ),
                  console.table(answer);
                console.log(
                  "******************************************************************************************************************************"
                ),
                  isFinished();
              }
            }
          );
        });
    }
  });
};

// View Total Utilized Budget of a Department

const viewByBudget = () => {

    db.query(`SELECT department_name, id FROM department`, (err, answer) => {
        if (err) {
          throw err;
        } else {
          let departmentList = answer.map(({ id, department_name }) => ({
            name: department_name,
            value: { department_name },
          }));
    
          inquirer
          .prompt([
            {
              type: "list",
              name: "departmentList",
              message:
                "Select the department to see a list of the empoloyee\'s that work there",
              choices: departmentList,
            },
          ])
          .then((answer) => {
            let selectedDepartment = answer.departmentList.department_name;
            db.query(
                `SELECT employee.id AS ID,
                employee.first_name AS First_Name,
                employee.last_name AS Last_Name,
                department_name AS Department_Name,
                salary AS Salary, SUM(salary)
                FROM employee
                LEFT JOIN role ON role.id = employee.role_id
                LEFT JOIN department ON department.id = role.department_id 
                WHERE department_name = "${selectedDepartment}"`,

                (err, answer) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log(
                        "******************************************************************************************************************************"
                      ),
                        console.table(answer);
                      console.log(
                        "******************************************************************************************************************************"
                      ),
                        isFinished();
                    }
                  }
                );
              });
          }
        });
      };

module.exports = {
  viewEmployees,
  viewRoles,
  viewDepartments,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,
  viewByManager,
  viewByDepartment,
  viewByBudget
};

