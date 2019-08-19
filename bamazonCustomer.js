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
                choices: ["Buy products", "Exit application"]
            },

        ]).then(function (res) {
            if (res.action === 'Buy products') {
                renderProducts();
            } else {
                console.log("Thanks for shopping with bamazon!")
                connection.end();
            }
        })
}

function renderProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, results) {
        if (err) throw err;
        for (i = 0; i < results.length; i++) {
            console.log('Id: ' + results[i].item_id + ', Product: ' + results[i].product_name + ", Price: " + results[i].price);
            console.log('--------------------------------------------')
        }
        // inquirer
        askCustomer();
    })
}

function askCustomer() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Whats the id of the item you want to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of this item?"
            }
        ]).then(function (res) {
            if (typeof parseInt(res.id) === 'number' && typeof parseInt(res.units) === 'number') {
                itemId = parseInt(res.id);
                unitsBuying = parseInt(res.units);

                if (!isNaN(itemId) && !isNaN(unitsBuying)) {
                    //array to get ?
                    connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE ?",
                        [
                            {
                                item_id: itemId
                            },
                        ],
                        function (err, results) {
                            if (err) throw err;
                            if (Math.round(unitsBuying) < results[0].stock_quantity) {
                                totalNoTax = (results[0].price * unitsBuying);
                                totalTax = totalNoTax + (totalNoTax * 0.04);
                                updateProduct(parseInt(results[0].stock_quantity) - unitsBuying, itemId, totalTax);
                            } else {
                                console.log('Item stock its not sufficient. Stock of this item is: ' + results[0].stock_quantity);
                                askCustomer();
                            }
                        }
                    )
                }
                else {
                    console.log('One or both of your inputs are not correct, make sure your id and quantity are not decimals or words.');
                    askCustomer();
                }
            }
            else {
                console.log("Make sure your input it's a number (ID)");
                askCustomer();
            }
            
        })
}

function updateProduct(quantity, id, total) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            if (err) throw err
            console.log("Your order was succesfully placed");
            console.log("Your total is: $" + total);
            start();
        }
    )
};

