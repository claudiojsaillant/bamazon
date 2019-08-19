DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Vanilla", 'Baking', 17.95, 534), ("Apple", 'Fruits', 1.25, 278)
, ("Coca cola", 'Sodas', 2.05, 345), ("Banana", 'Fruits', 0.95, 225)
, ("Milk", 'Diary', 2.95, 140), ("M&M", 'Candy', 1.95, 200), 
("Greyhoose", 'Alcohol', 20.95, 373), ("Jaggermeister", 'Alcohol', 19.95, 234)
, ("Orange", 'Fruits', 0.95, 234), ("Ginger ale", 'Sodas', 1.95, 333);

