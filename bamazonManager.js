var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "whatsdown",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    //show menu
    menu();
});

function menu() {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product", "Exit"]
            },
        ]).then(function (res) {
            switch (res.action) {
                case 'View Products for Sale':
                    renderProducts('render')
                    break;
                case 'View Low Inventory':
                    lowInventory()
                    break;
                case 'Add Inventory':
                    renderProducts('update')
                    break;
                case 'Add New Product':
                    addProduct()
                    break;
                case 'Exit':
                    console.log('Thanks for working with bamazon!')
                    connection.end();
            }
        })
}

function renderProducts(action) {
    console.log('hey');
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        for (i = 0; i < results.length; i++) {
            console.log('Id: ' + results[i].item_id + ', Product: ' + results[i].product_name + ", Price: " + results[i].price + ', Stock: ' + results[i].stock_quantity);
            console.log('-----------------------------------------------------------');
        }
        if (action === 'update') {
            console.log('hello');
            updateProduct();
        } else if (action === 'render') {
            menu();
        }
    })
}

function lowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 6", function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log('There are no products with low inventory.');
        }
        else {
            for (i = 0; i < results.length; i++) {
                console.log('Id: ' + results[i].item_id + ', Product: ' + results[i].product_name + ", Price: " + results[i].price + ', Stock: ' + results[i].stock_quantity);
                console.log('-----------------------------------------------------------');
            }
        }
        menu();
    })
}


function updateProduct() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Whats the id of the item you want to update?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of this item are going to be added?"
            }
        ]).then(function (res) {
            connection.query("SELECT * FROM products WHERE ?",
                {
                    item_id: res.id
                }, function (err, results) {
                    if (results.length === 0) {
                        console.log('There are no products with this ID');
                        menu();
                    }
                    else {
                        finalStock = results[0].stock_quantity + parseInt(res.units);
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: finalStock
                                },
                                {
                                    item_id: res.id
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log('Item updated succesfully.');
                                menu();
                            }
                        );
                    }
                })
        })
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What's the name of the new item?"
            },
            {
                name: "department",
                type: "input",
                message: "Which department the item is going to be?"
            },
            {
                name: "price",
                type: "input",
                message: "What's the price of the item?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "What quantity of this item the store is going to have?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (res) {
            //name,dep,price,stock
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: res.name,
                    department_name: res.department,
                    price: res.price,
                    stock_quantity: res.quantity
                },
                function (err, res) {
                    console.log('Item added successfully.');
                    menu();
                }
            );
        })
}
