const inquirer = require("inquirer");
const db = require("./db/connection");
const logo = require("asciiart-logo");
const config = require("./package.json");
var colors = require("colors");

// Import delete functions.
const {
  deleteEmployee,
  deleteRole,
  deleteDepartment,
} = require("./utils/delete");

// Import update function.
const {
    updateEmployeeRole
  } = require("./utils/update");

  // Import view functions.
const {
    viewEmployees,
    viewRoles,
    viewDepartments,
    viewByManager,
    viewByDepartment,
    viewByBudget,
  } = require("./utils/view");

  // Import add functions.
  const {
    addEmployee,
    addRole,
    addDepartment,
  } = require("./utils/add");
  

// Menu prompt that displays all ADD functions to the user
const addMenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: ["Add Employee", "Add Role", "Add Department", "Go back"],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "Add Employee":
          addEmployee();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Go back":
          mainmenu();
          break;
      }
    });
};

// Menu prompt that displays all UPDATE functions to the user
const updateMenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: ["Update an employee's role", "Go back"],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "Update an employee's role":
          updateEmployeeRole();
          break;

        case "Go back":
          mainmenu();
          break;
      }
    });
};

// Menu prompt that displays all VIEW functions to the user
const viewMenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "View Employee by Manager",
        "View Employees by Department",
        "View Budget Total for Each Department",
        "Go back",
      ],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Departments":
          viewDepartments();
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

        case "Go back":
          mainmenu();
          break;
      }
    });
};

// Menu prompt that displays all DELETE functions to the user
const deleteMenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: [
        "Delete an employee from the database",
        "Delete a role from the database",
        "Delete a department from the database",
        "Go back",
      ],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "Delete an employee from the database":
          deleteEmployee();
          break;

        case "Delete a role from the database":
          deleteRole();
          break;

        case "Delete a department from the database":
          deleteDepartment();
          break;

        case "Go back":
          mainmenu();
          break;
      }
    });
};

// Main menu prompt that displays all functions to the user
const mainmenu = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "menu",
      choices: ["VIEW...", "ADD...", "UPDATE...", "DELETE...", "Exit"],
    })
    .then((answer) => {
      // Switch statement to start the function the user has selected
      switch (answer.menu) {
        case "ADD...":
          addMenu();
          break;

        case "UPDATE...":
          updateMenu();
          break;

        case "DELETE...":
          deleteMenu();
          break;

        case "VIEW...":
          viewMenu();
          break;

        case "Exit":
          db.end();
          break;
      }
    });
};


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
            mainmenu();
            break;
  
          case "Yes":
            db.end();
            console.log("See you later!");
            break;
        }
      });
  };


// Call to initialize app
console.log(logo(config).render().brightMagenta);
mainmenu();




exports.isFinished = isFinished;
