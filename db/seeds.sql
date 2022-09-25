INSERT INTO department(department_name)
VALUES
("HR"),
("Payroll"),
("Executives");


INSERT INTO role (title, salary, department_id)
VALUES
("Advisor", 30000, 1),
("Accounts Officer", 35000, 2),
("Team Leader", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Mike", "Bigly", 1, null),
("Ben", "Mee", 1, 1),
("Helen", "Shipman", 2, 1);

