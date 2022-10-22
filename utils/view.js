const inquirer = require("inquirer");
require("console.table");
const db = require("../db/connection");
const main = require("../index");

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
          let options = main.isFinished();
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
          let options = main.isFinished();
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
          let options = main.isFinished();
        }
      }
    );
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
                  )
                  let options = main.isFinished();
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
                  )
                  let options = main.isFinished();                }
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
                  "Select the department to view it's total utilised budget",
                choices: departmentList,
              },
            ])
            .then((answer) => {
              let selectedDepartment = answer.departmentList.department_name;
              db.query(
                  `SELECT employee.id AS ID,
                  department_name AS Department_Name, 
                  SUM(salary) AS Total_Utilised_Budget
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
                        )
                        let options = main.isFinished();                      }
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
            viewByManager,
            viewByDepartment,
            viewByBudget,
          };
          
          