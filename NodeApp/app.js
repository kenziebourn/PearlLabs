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

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});