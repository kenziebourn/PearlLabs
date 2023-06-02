// App.js

/*
    SETUP
*/
//Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

// Middleware to parse JSON and URL-encoded form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

PORT        = 12186;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector');

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));

/*
    ROUTES
*/

// Homepage
app.get('/', function(req, res)
    {
        res.render('index');
    });

// Customers Page
app.get('/Customers', function(req, res)
    { 
        let query1 = "SELECT * FROM Customers;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('customers', {data: rows});
        })
    });

// Add a Customer
app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query2 = `INSERT INTO Customers (firstName, lastName, streetAddress, city, state, zipcode, phoneNumber, email) 
    VALUES ('${data['input-fname']}', '${data['input-lname']}', '${data['input-streetAddress']}', '${data['input-city']}',
    '${data['input-state']}', '${data['input-zipcode']}',
    '${data['input-phoneNumber']}', '${data['input-email']}')`;
     
    db.pool.query(query2, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Customers and
        // presents it on the screen
        else
        {
            res.redirect('/Customers');
        }
    })
});

// Search a Customer
app.get('/search-customer-html', function(req, res)
{
    // Retrieve value of input-customerID query parameter from request's query string
    const customerID = req.query['input-customerID'];
    
    // If a customer ID is provided, query the database to find the customer
    if (customerID) {
        const query = `SELECT * FROM Customers WHERE customerID = ${customerID}`;
        db.pool.query(query, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.render('customers', { data: rows });
            }
        });
    }
    // If no customer ID is provided, render the customers page without any specific customer data
    else {
        const query = 'SELECT * FROM Customers';
        db.pool.query(query, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.render('customers', { data: rows });
            }
        });
    }
});

// Orders Page
app.get('/Orders', function(req, res) {
            // Retrieve all information from Orders Table
            let query1 = "SELECT orderID, customerID, cast(orderDate as varchar(10)) as orderDate, orderPrice FROM Orders;";
            db.pool.query(query1, function(error, ordersRows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
            }
        
            // Retrieve all information from OrderProducts Table
            let query2 = "SELECT * FROM OrderProducts;";
            db.pool.query(query2, function(error, orderProductsRows, fields) {
                if (error) {
                console.log(error);
                res.sendStatus(500);
                return;
                }
        
            // Retrieve current orderIDs from OrderProducts Table
                let selectQuery = "SELECT DISTINCT orderID FROM OrderProducts;";
                db.pool.query(selectQuery, function(selectError, selectResults1) {
                if (selectError) {
                    console.error('Error retrieving orderIDs:', selectError);
                    res.sendStatus(500); // Send HTTP response 500 for internal server error
                    return;
                }
            // Retrieve distinct productIDs from OrderProducts Table
                let selectQuery2 = "SELECT DISTINCT productID FROM OrderProducts;";
                db.pool.query(selectQuery2, function(selectError2, selectResults2) {
                if (selectError2) {
                    console.error('Error retrieving productIDs:', selectError2);
                    res.sendStatus(500); // Send HTTP response 500 for internal server error
                    return;
                }

            // Retrieve current customerIDs from Customers table
                let selectQuery3 = "SELECT DISTINCT customerID FROM Customers;";
                db.pool.query(selectQuery3, function(selectError3, selectResults3) {
                if (selectError3) {
                    console.error('Error retrieving productIDs:', selectError3);
                    res.sendStatus(500); // Send HTTP response 500 for internal server error
                    return;
                }
                const orderIDs = selectResults1.map((row) => row.orderID); // represents the orderID's currently in the database
                const productIDs = selectResults2.map((row) => row.productID); // represents the distinct productIDs currently in the database
                const customerIDs = selectResults3.map((row) => row.customerID); // represents the customerID's currently in the database
                console.log(orderIDs)
                console.log(productIDs)
                console.log(customerIDs)

                res.render('orders', {
                    ordersData: ordersRows,
                    orderProductsData: orderProductsRows,
                    orderIDs: orderIDs,
                    productIDs: productIDs,
                    customerIDs: customerIDs
                        });
                    });
                });
            });
         });
    });
});
// Add an Order
app.post('/add-order-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customerID, orderDate, orderPrice) 
    VALUES (${data['customerID']}, '${data['input-orderDate']}', ${data['input-orderPrice']})`;
    console.log(query1)
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Orders and
        // presents it on the screen
        else
        {
            res.redirect('/Orders');
        }
    })
});

// Search a Order
/**app.get('/search-order-html', function(req, res)
{
    // Retrieve value of input-customerID query parameter from request's query string
    const customerID = req.query['input-customerID'];
    
    // If a customer ID is provided, query the database to find the customer
    if (customerID) {
        const query = `SELECT * FROM Orders WHERE customerID = ${customerID}`;
        db.pool.query(query, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.render('orders', { data: rows });
            }
        });
    }
    // If no customer ID is provided, render the customers page without any specific customer data
    else {
        const query = 'SELECT * FROM Orders';
        db.pool.query(query, function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.render('orders', { data: rows });
            }
        });
    }
});**/

// Delete an Order
app.post('/delete-order-form', function(req, res) {
    const orderID = req.body['input-orderID'];

    // Perform the deletion in the database
    const query = `DELETE FROM Orders WHERE orderID = ${orderID}`;
    db.pool.query(query, function(error, result) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            // Redirect back to the orders page after successful deletion
            res.redirect('/Orders');
        }
    });
});

// Add an Ordered Product
app.post('/add-ordered-product-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO OrderProducts (orderID, productID, quantity, discount)
    VALUES ('${data['input-orderID']}', '${data['input-productID']}', '${data['input-quantity']}', '${data['input-discount']}')`;
     
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Orders and
        // presents it on the screen
        else
        {
            res.redirect('/Orders');
        }
    })
});
// Update an Ordered Product
app.post('/update-orderProduct-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);
  
    // Perform the database update operation
    const query1 = `UPDATE OrderProducts 
    SET quantity = '${data['input-quantity']}', discount = '${data['input-discount']}' 
    WHERE orderID = '${data['orderID']}'AND productID='${data['productID']}';`;
    console.log(query1)
    db.pool.query(query1, function(error, results) {
      if (error) {
        console.error('Error updating orderProduct:', error);
        res.sendStatus(500); // Send HTTP response 500 for internal server error
      } else {
        res.redirect('/Orders'); // Successful update
      }
    });
  });
  
// Products Page
app.get('/Products', function(req, res)
    { 
        let query1 = "SELECT * FROM Products;";

        let query2 = "SELECT * FROM ProductTypes;";

        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){

            // Save the products
            let products = rows;

            // Run the 2nd query 
            db.pool.query(query2, (error, rows, fields) => {

                // Save the product types
                let types = rows;
                return res.render('products', {data: products, types: types});
            })
        })
    });

// Add a Product
app.post('/add-product-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO Products (productTypeID, productName, productDescription, productPrice, quantityPerUnit)
    VALUES ('${data['input-productType']}', '${data['input-productName']}', '${data['input-productDescription']}', '${data['input-productPrice']}', '${data['input-quantityPerUnit']}')`;
     
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Products and
        // presents it on the screen
        else
        {
            res.redirect('/Products');
        }
    })
});


// Product Types Page
app.get('/ProductTypes', function(req, res)
    { 
        let query1 = "SELECT * FROM ProductTypes;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('producttypes', {data: rows});
        })
    });

// Add a Product Type
app.post('/add-product-type-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data);

    // Create the query and run it on the database
    query1 = `INSERT INTO ProductTypes (productType, productTypeDescription)
    VALUES ('${data['input-productType']}', '${data['input-productTypeDescription']}')`;
     
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM ProductTypes and
        // presents it on the screen
        else
        {
            res.redirect('/ProductTypes');
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});