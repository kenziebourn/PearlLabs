 -- Data manipulation queries

--------------------------------
-- Customers --
--------------------------------
-- Get data for all customers
SELECT * FROM Customers;

-- Search for specific customer 
SELECT * FROM Customers where customerID = :customerIDInput

-- Add a new customer
INSERT INTO Customers (firstName, lastName, streetAddress, city, state, zipcode, phoneNumber, email)
VALUES (:firstNameInput, :lastNameInput, :streetAddressInput, :cityInput, :stateInput, :zipcodeInput, :phoneNumberInput, :emailInput);

--------------------------------
-- Orders --
--------------------------------
-- Get data for all orders
SELECT Orders.orderID, Orders.customerID, CONCAT(Customers.firstName, ' ', Customers.lastName) AS customerName, Orders.orderDate, Orders.orderPrice FROM Orders
INNER JOIN Customers
ON Orders.customerID = Customers.customerID;

-- Get data for all ordered products
SELECT OrderProducts.orderID, OrderProducts.productID, Products.productName AS productName, OrderProducts.quantity, OrderProducts.discount FROM OrderProducts
INNER JOIN Products
ON OrderProducts.productID = Products.productID;

-- Search an Order
SELECT SELECT * FROM Orders where customerID = :customerIDInput

-- Add an order
INSERT INTO Orders (customerID, orderDate, orderPrice)
VALUES (:customerIDInput, :orderDateInput, :orderPriceInput);

-- Add an ordered product
INSERT INTO OrderProducts (orderID, productID, quantity, discount)
VALUES (:orderIDInput, :productIDInput, :quantityInput, :discountInput);

-- Delete an order
DELETE FROM Orders WHERE orderID = :orderIDInput;

-- Populate dropdown with all order IDs for update an ordered product
SELECT orderID FROM Orders;

-- Update an ordered product
UPDATE OrderProducts
SET productID = :productIDInput, quantity = :quantityInput, discount = :discountInput
WHERE orderID = :orderID_from_dropdown;

--------------------------------
-- Products --
--------------------------------
-- Get data for all products
SELECT * FROM Products;

-- Add a new product
INSERT INTO Products (productTypeID, productName, productDescription, productPrice, quantityPerUnit)
VALUES (:productTypeIDInput, :productNameInput, :productDescriptionInput, :productPriceInput, :quantityPerUnitInput);

-- Populate dropdown with all product names for update a product
SELECT productID, productName FROM Products;

-- Populate dropdown with all product type IDs for update a product
SELECT productTypeID FROM ProductTypes;

-- Update a product
UPDATE Products
SET productTypeID = :productTypeID_from_dropdown, productDescription = :productDescriptionInput,
    productPrice = :productPriceInput, quantityPerUnit = :quantityPerUnitInput
WHERE productID = :productID_from_dropdown;

--------------------------------
-- ProductTypes --
--------------------------------
-- Get data for all product types
SELECT * FROM ProductTypes;

-- Add a new product type
INSERT INTO ProductTypes (productType, productTypeDescription)
VALUES (:productTypeInput, :productTypeDescriptionInput);