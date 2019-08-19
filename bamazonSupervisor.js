var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "whatsdown",
    database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                choices: ["View Product Sales by Department", "Create New Department", "Exit application"]
            },

        ]).then(function (res) {
            if (res.action === 'View Product Sales by Department') {
                //funct
                renderProductSales();

            } else if (res.action === 'Create New Department') {
                //funct
                newDepartment();

            } else {
                console.log("Thanks for working with bamazon!");
                connection.end();
            }
        })
}

function renderProductSales() {
    connection.query("SELECT  department_id, departments.department_name, over_head_costs as 'Over head costs', sum(product_sales) as 'Product sales', sum(product_sales) - over_head_costs as 'Profit' FROM departments, products WHERE departments.department_name = products.department_name group by department_id ORDER BY department_id",
        function (err, results) {
            if (err) throw err;
            console.table(results);
            start();
        })
}

function newDepartment() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What's the name of the new department?"
            },
            {
                name: "overhead",
                type: "input",
                message: "What's the over head cost of the department?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (res) {
            var query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: res.name,
                    over_head_costs: res.overhead
                },
                function (err, res) {
                    console.log('Department created successfully.');
                    start();
                }
            );
        })

}