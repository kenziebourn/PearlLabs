 -- Data manipulation queries

--------------------------------
-- Customers --
--------------------------------
-- Get data for all customers
SELECT * FROM Customers;

-- Add a new customer
INSERT INTO Customers (firstName, lastName, streetAddress, city, state, zipcode, phoneNumber, email)
VALUES (:firstNameInput, :lastNameInput, :streetAddressInput, :cityInput, :stateInput, :zipcodeInput, :phoneNumberInput, :emailInput);

--------------------------------
-- Orders --
--------------------------------
-- Get data for all orders
SELECT * FROM Orders;

-- Get data for all order products
SELECT * FROM OrderProducts;

-- Add an order
INSERT INTO Orders (customerID, orderDate, orderPrice)
VALUES (:customerIDInput, :orderDateInput, :orderPriceInput);

-- Add an ordered product
INSERT INTO OrderProducts (orderID, productID, quantity, discount)
VALUES (:orderIDInput, :productIDInput, :quantityInput, :discountInput);

-- Delete an order
DELETE FROM Orders WHERE orderID = :orderIDInput;

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

--------------------------------
-- ProductTypes --
--------------------------------
-- Get data for all product types
SELECT * FROM ProductTypes;

-- Add a new product type
INSERT INTO ProductTypes (productType, productTypeDescription)
VALUES (:productTypeInput, :productTypeDescriptionInput);