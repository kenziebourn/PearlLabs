SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

-- Data definition queries 

-- Create Customers table
CREATE OR REPLACE TABLE `Customers` (
  `customerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `streetAddress` varchar(200) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zipcode` int(5) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) NOT NULL, 
   PRIMARY KEY (`customerID`)
);

-- Create Orders table
CREATE OR REPLACE TABLE `Orders` (
    `orderID` int(11) NOT NULL AUTO_INCREMENT,
    `customerID` int(11) NOT NULL,
    `orderDate` datetime,
    `orderPrice` decimal(12,2) NOT NULL,
    PRIMARY KEY (`orderID`),
    FOREIGN KEY (`customerID`) REFERENCES `Customers`(`customerID`)
);

-- Create Products table
CREATE OR REPLACE TABLE `Products` (
    `productID` int(11) NOT NULL AUTO_INCREMENT,
    `productTypeID` int(11),
    `productName` varchar(50) NOT NULL,
    `productDescription` text NOT NULL,
    `productPrice` decimal(12,2) NOT NULL,
    `quantityPerUnit` int(5) NOT NULL,
    PRIMARY KEY (`productID`),
    FOREIGN KEY (`productTypeID`) REFERENCES `ProductTypes`(`productTypeID`)
    ON UPDATE SET NULL
);

-- Create OrderProducts table
CREATE OR REPLACE TABLE `OrderProducts` (
    `orderID` int(11) NOT NULL,
    `productID` int(11) NOT NULL,
    `quantity` int(10) NOT NULL,
    `discount` varchar(20),
    PRIMARY KEY (`orderID`, `productID`),
    FOREIGN KEY (`productID`) REFERENCES `Products`(`productID`),
    FOREIGN KEY (`orderID`) REFERENCES `Orders`(`orderID`) 
    ON DELETE CASCADE
);

-- Create ProductTypes table
CREATE OR REPLACE TABLE `ProductTypes` (
    `productTypeID` int(11) NOT NULL,
    `productType` varchar(50) NOT NULL,
    `productTypeDescription` text NOT NULL,
    PRIMARY KEY (`productTypeID`)
);

-- Sample data insertions

-- Insert data into Customers table
INSERT INTO `Customers`(`firstName`, `lastName`, `streetAddress`, `city`, `state`, `zipcode`, `phoneNumber`, `email`)
VALUES ('Jasmine','Lee','8680 NW 23rd St','Portland','OR', 97210, '971-888-3535', 'jasleetea@gmail.com' ),
('Daniel','Smith','910 Main St','Los Angeles','CA', 90001, '213-678-9011', 'smith.daniel@gmail.com' ),
('Emily','Nguyen','3700 County Rd','Houston','TX', 77001, '281-346-8320', 'em.nguyen@gmail.com' ),
('Michael','Miller','580 Gates St','San Francisco','CA', 94016, '415-628-6500', 'michael.bobashop@gmail.com' ),
('Emma','Clark','1936 N 85th St','Houston','TX', 98101, '206-426-7834', 'clarkstea@gmail.com' );

-- Insert data into Orders table
INSERT INTO `Orders`(`customerID`, `orderDate`, `orderPrice`)
VALUES (3, '2023-01-22', 171),
(1, '2022-02-15', 381.6),
(1, '2023-04-17', 90);

-- Insert data into OrderProducts table
INSERT INTO `OrderProducts`(`orderID`, `productID`, `quantity`, `discount`)
VALUES (1, 1, 6, '10 NET 30'),
(1, 5, 10, NULL),
(2, 3, 4, NULL),
(2, 7, 4, NULL),
(3, 5, 10, '10 NET 30');

-- Insert data into Products table
INSERT INTO `Products` (`productTypeID`, `productName`, `productDescription`, `productPrice`, `quantityPerUnit`)
VALUES (101, 'Wintermelon Syrup', 'Shelf life: 1 year, net weight: 5 lbs', 15, 1),
(101, 'Strawberry Syrup', 'Shelf life: 1 year, net weight: 5 lbs', 15, 1),
(103, '12oz Cups (1000)', 'Floral design, gross weight: 15 lbs', 70.5, 1000),
(103, '24 oz Cups (500)', 'Star design, gross weight: 12 lbs', 40.5, 500), 
(102, 'Black Tea', 'Shelf life: 2 years, net weight: 600 grams', 10, 1),
(102, 'Jasmine Tea', 'Shelf life: 2 years, net weight: 600 grams', 10, 1),
(104, 'Black Straws (1000)', 'For boba (12 mm x 20 cm), material: plastic, gross weight: 7 lbs', 24.9, 1000);

-- Insert data into ProductTypes table
INSERT INTO `ProductTypes`(`productTypeID`, `productType`, `productTypeDescription`)
VALUES (101, 'Syrup', 'Sold by the bottle'),
(102, 'Tea', 'Varieties of loose leaf tea sourced from Taiwan'),
(103, 'Cup', 'Material: polypropylene, sold in cases of 500 or 1000'),
(104, 'Straw', 'Individually plastic-wrapped straws, sold in cases of 500 or 1000');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;