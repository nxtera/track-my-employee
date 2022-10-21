const inquirer = require("inquirer");
const db = require("./db/connection");
const logo = require("asciiart-logo");
const config = require("./package.json");
var colors = require("colors");

// Import functions from the func file.
const {
  viewEmployees,
  viewRoles,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,
  viewDepartments,
  viewByManager,
  viewByDepartment,
  viewByBudget,
} = require("./utils/func");

// Main menu prompt that displays all functions to the user
const mainmenu = () => {
  console.log("i like cake and pies".underline.red); // outputs red underlined text
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: [
        "View All Employee\'s",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "View Employee by Manager",
        "View Employees by Department",
        "View Budget Total for Each Department",
        "Exit",
      ],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "View All Employee\'s":
          viewEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "View All Roles":
          console.log("...\n");
          viewRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          console.log("...\n");
          viewDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "View Employee by Manager":
          viewByManager();
          break;

        case "View Employees by Department":
          viewByDepartment();
          break;

        case "View Budget Total for Each Department":
            viewByBudget();
          break;

        case "Exit":
          db.end();
          break;
      }
    });
};

// Call to initialize app
console.log(logo(config).render().brightMagenta);
mainmenu();

exports.mainmenu = mainmenu;
