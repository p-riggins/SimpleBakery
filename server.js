// Purpose: Main server file for the SimpleBakery application
const express = require('express');
const path = require('path');
const sql = require("mssql");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { get } = require('http');
const cors = require('cors');

// CORS options to allow only POST requests from the client
const corsOptions = {
    origin: 'http://localhost', // Replace with your client’s origin
    methods: 'POST',
    allowedHeaders: 'Content-Type'
};

// Import API routes
const apiDelete = require('./API-Delete');
const apiPost = require('./API-Post');
const apiPut = require('./API-Put');

// Import session functions
const SessionValid = require('./SessionValid');
const SessionCreate = require('./SessionCreate');

// Create an express app
const app = express();

// Use the CORS middleware
app.use(cors(corsOptions));

// Use the JSON middleware
app.use(express.json());


// Serve static files from the 'client/html' directory
app.use(express.static(path.join(__dirname, 'client/html')));
app.use(express.static(path.join(__dirname, 'client/css')));
app.use(express.static(path.join(__dirname, 'client/assets')));
app.use(express.static(path.join(__dirname, 'client/js')));

// Use the routes from the imported API files
app.use('/api/delete', apiDelete);
app.use('/api/post', apiPost);
app.use('/api/put', apiPut);


// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/html', 'index.html'));
});

// Route to serve recipes.html
app.get('/recipes', async (req, res) => {
	res.sendFile(path.join(__dirname, 'client/html', 'recipes.html'));
});

// Route to serve inventory.html
app.get('/inventory', async (req, res) => {
	res.sendFile(path.join(__dirname, 'client/html', 'inventory.html'));
});

// Route to serve orders.html
var config = {
    "user": "admin",
    "password": "Clustered-Crinkly6-Giddy",
    "server": "database-1.ch4cuyk82byb.us-east-1.rds.amazonaws.com",
    "database": "SimpleBakery",
    "options": {
        "encrypt": false
    }
};

// Connect to the database
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection to DB successful");
});

// Route to serve index.html
app.get("/login", (request, response) => {
	response.sendFile(path.join(__dirname, 'client/html/login.html'));
});

// Route to check if the user is already logged in
app.post("/login", async (request, response) => {
	const {Username, Password} = request.body;	// get the username and password from the request body
	const pool = await sql.connect(config);	// connect to the database
	const checkUserQuery = 'SELECT * FROM Users WHERE Username = @Username';	// query to check if the user exists in the database


	try {
		const result = await pool
			// query the database to check if the user exists
			.request()
			.input('Username', sql.NVarChar, Username)
			.query(checkUserQuery);

		// if the user is not found, return a 404 status code
		if (result.recordset.length === 0) {
			response.status(404).send('User not found');
			return;
		}

		// if the user is found, check if the password matches
		const user = result.recordset[0];
		const passwordMatch = await bcrypt.compare(Password, user.Password);

		// if the password does not match, return a 401 status code
		if (!passwordMatch) {
			response.status(401).send('Invalid password');
			return;
		}
		
		// if the password matches, selects UserID from the Users table
        const UserIDResult = await pool.request()
            .input('Username', sql.VarChar, Username)
            .query('SELECT UserID FROM Users WHERE Username = @Username');
		const UserID = UserIDResult.recordset[0].UserID;

		// check if the user has a session
		let SessionIDResult = await pool.request()
			.input('UserID', sql.VarChar, UserID)
			.query('SELECT SessionID FROM Sessions WHERE UserID = @UserID');

		// if the user has a session, check if the session is valid	
		if (SessionIDResult.recordset.length > 0) {
			let SessionID = SessionIDResult.recordset[0].SessionID;
			const sessionValid = await SessionValid.isSessionValid(pool, SessionID);
			// if the session is valid, return the session ID
			if (sessionValid) {
				return response.status(200).json(SessionID);
			}
        } 
		// if the user does not have a session, create a new session
        return SessionCreate.createSession(pool, UserID, response);
        
	// if an error occurs, return a 500 status code
	} catch (err) {
		console.error('Database error:', err);
		console.log('Database error', err);
		response.status(500).send('Database error');
	}
});

// Logout route to delete the session from the DB
app.post("/logout", async (request, response) => {
	const { SessionID } = request.body;	//	get the session ID from the request body
	const pool = await sql.connect(config);	// connect to the database
	// query to delete the session from the Sessions table
	try {
		// delete the session from the Sessions table
		await pool.request()
			.input('SessionID', sql.VarChar, SessionID)
			.query('DELETE FROM Sessions WHERE SessionID = @SessionID');

		response.status(200).send('Logout successful');

	// if an error occurs, return a 500 status code
	} catch (err) {
		console.error('Database error:', err);
		console.log('Database error', err);
		response.status(500).send('Database error');
	}
});

// allow register page to be displayed
app.get("/register", (request, response) => {
	response.sendFile(path.join(__dirname, 'client/html/register.html'));
});

// sending all register data to the DB for successful registration
app.post("/register", async (request, response) => {
	const pool = await sql.connect(config);	// connect to the database
	const { FirstName, LastName, EmailAddress, Username, Password } = request.body;	// get the user data from the request body

		// check if all required fields are present
	if (!FirstName || !LastName || !EmailAddress || !Username || !Password) {
			response.status(400).send('Missing required fields');
			return;
		}

	try {


		// check if the user already exists
		const checkUniqueUserQuery = 'SELECT * FROM Users WHERE Username = @Username';
		const userResult = await pool.request()
			.input('Username', sql.NVarChar, Username)
			.query(checkUniqueUserQuery);

		// if the user already exists, return a 409 status code
		if (userResult.recordset.length > 0) {
			response.status(409).send('Username already exists');
			return;
		}

		
		// check if the email already exists
		const checkUniqueEmailQuery = 'SELECT * FROM Email WHERE EmailAddress = @EmailAddress';

		// query the database to check if the email already exists
		const emailResult = await pool.request()
			.input('EmailAddress', sql.NVarChar, EmailAddress)
			.query(checkUniqueEmailQuery);

		// if the email already exists, return a 409 status code
		if (emailResult.recordset.length > 0) {
			response.status(409).send('Email already exists');
			return;
		}
		
		// generate a UUID for the user
		const UserID = uuid.v4();

		// hash the password
		const hashedPassword = await bcrypt.hash(Password, 10);

		const transaction = pool.transaction();	// start a new transaction
		await transaction.begin();	// begin the transaction

		// insert the user into the Users table
		const insertUserQuery = 'INSERT INTO Users (UserID, FirstName, LastName, Username, Password) VALUES (@UserID, @FirstName, @LastName, @Username, @Password)';
		await transaction.request()
			.input('UserID', sql.NVarChar, UserID)
			.input('FirstName', sql.NVarChar, FirstName)
			.input('LastName', sql.NVarChar, LastName)
			.input('Username', sql.NVarChar, Username)
			.input('Password', sql.NVarChar, hashedPassword)
			.query(insertUserQuery);

		
		// insert the email into the Email table
		const insertEmailQuery = 'INSERT INTO Email (EmailID, EmailAddress, UserID, Type, Valid) VALUES (@EmailID, @EmailAddress, @UserID, @Type, @Valid)';
		const EmailID = uuid.v4();
		const Type = 'Primary';
		let Valid = 0;

		// Simple Email Regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		// Function to check if email is valid
		function isValidEmail(email) {
    		return emailRegex.test(email);
		}

		// Check if email is valid and ends with .com, .edu, .net, or .gov
		if (isValidEmail(EmailAddress) &&
			(EmailAddress.endsWith('.com') ||
			 EmailAddress.endsWith('.edu') ||
			 EmailAddress.endsWith('.net') ||
			 EmailAddress.endsWith('.gov'))) {
			Valid = 1; 
		} else { // If email is not valid, return a 400 status code
			return response.status(400).send({ message: 'Invalid email' })
		}
		
		// insert the email into the Email table
		await transaction.request()
			.input('EmailID', sql.NVarChar, EmailID)
			.input('EmailAddress', sql.NVarChar, EmailAddress)
			.input('UserID', sql.NVarChar, UserID)
			.input('Type', sql.NVarChar, Type)
			.input('Valid', sql.Bit, Valid)
			.query(insertEmailQuery);
		

		// commit the transaction to the DB
		await transaction.commit();
		response.status(201).send('User created');

	} catch (err) {

		// error handling
		console.error('Database error:', err);
		console.log('Database error', err);
		response.status(500).send('Database error');

	} 
});

// Route to check if the session is still valid
app.get("/session", async (request, response) => {
	const SessionID = request.headers['x-session-id']; // get the session ID from the request headers
	const pool = await sql.connect(config);
	const sessionValid = await SessionValid.isSessionValid(pool, SessionID);

	// check if the session ID is present
	if(!SessionID) {
		return response.status(401).send('Session is invalid'); // if the session ID is not present, return a 401 status code
	}
	// check if the session is valid
	if (sessionValid) {
		response.status(200).send('Session is valid');	// if the session is valid, return a 200 status code
	} else {
		return response.status(401).send('Session is invalid');	// if the session is invalid, return a 401 status code
	}
});

app.listen(80, () => console.log('bruh'));	// listen on port 80
