DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  product_sales DECIMAL(10,2),
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs INT default 0,
  PRIMARY KEY (department_id)
)

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Vanilla", 'Food', 17.95, 534), ("Apple", 'Food', 1.25, 278)
, ("Coca cola", 'Drink', 2.05, 345), ("Banana", 'Food', 0.95, 225)
, ("Milk", 'Drink', 2.95, 140), ("M&M", 'Food', 1.95, 200), 
("Greyhoose", 'Drink', 20.95, 373), ("Jaggermeister", 'Drink', 19.95, 234)
, ("Orange", 'Food', 0.95, 234), ("Ginger ale", 'Drink', 1.95, 333);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Drinks", 5000), ("Food", 8000)