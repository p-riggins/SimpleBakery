// API-Post.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const {v4:uuidv4} = require('uuid');

//--------------------------------EMAIL TABLE SECTION-------------------------------------
// Retrieve all emails in the database
router.post('/emails/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Email');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Retrieve an Email by ID
router.post('/emails/by-id', async (req, res) => {
    const { EmailID } = req.body;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('EmailID', sql.VarChar, EmailID)
            .query('SELECT * FROM Email WHERE EmailID = @EmailID');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an additional Email Address for a user
router.post('/emails/create_additional', async (req, res) => {
    let EmailID = uuidv4();
    let Valid = true;

    const { EmailAddress, UserID, Type } = req.body;
    if (!EmailID || !EmailAddress || !UserID || !Type === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('EmailID', sql.VarChar, EmailID)
            .input('EmailAddress', sql.VarChar, EmailAddress)
            .input('UserID', sql.VarChar, UserID)
            .input('Type', sql.VarChar, Type)
            .input('Valid', sql.Bit, Valid)
            .query('INSERT INTO Email (EmailID, EmailAddress, UserID, Type, Valid) VALUES (@EmailID, @EmailAddress, @UserID, @Type, @Valid)');
        res.status(201).json({ message: 'Email created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------EMAILTYPES TABLE SECTION--------------------------------

//--------------------------------EMPLOYEES TABLE SECTION---------------------------------
// Display all Employees
router.post('/employees/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Employees');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------INGREDIENTS TABLE SECTION-------------------------------
// Display all Ingredients
router.post('/ingredients/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Ingredients');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------INVENTORY TABLE SECTION---------------------------------
// Display all items in Inventory
router.post('/inventory/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Inventory');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an Inventory Item
router.post('/inventory/new-item', async (req, res) => {
    const EntryID = uuidv4();

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JS
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const CreateDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    let randomNumbers = '';
    for (let i = 0; i < 6; i++) {
        randomNumbers += Math.floor(Math.random() * 10); // Generates a random number between 0 and 9
    }
    const PONumber = 'PO' + randomNumbers;

    const { Quantity, UserID, Notes, Cost, ExpireDateTime, RecipeID } = req.body;
    try {
      const pool = await sql.connect();
      await pool.request()
        .input('EntryID', sql.VarChar, EntryID)
        .input('Quantity', sql.Int, Quantity)
        .input('UserID', sql.VarChar, UserID)
        .input('Notes', sql.VarChar, Notes)
        .input('Cost', sql.Float, Cost)
        .input('CreateDateTime', sql.DateTime, CreateDateTime)
        .input('ExpireDateTime', sql.DateTime, ExpireDateTime)
        .input('PONumber', sql.VarChar, PONumber)
        .input('RecipeID', sql.VarChar, RecipeID)
        .query('INSERT INTO Inventory (EntryID, Quantity, UserID, Notes, Cost, CreateDateTime, ExpireDateTime, PONumber, RecipeID) VALUES (@EntryID, @Quantity, @UserID, @Notes, @Cost, @CreateDateTime, @ExpireDateTime, @PONumber, @RecipeID)');
      res.status(201).json({ message: 'Inventory item added' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Retrieve an Inventory Item by ID
router.post('/inventory/by-id', async (req, res) => {
    const { EntryID } = req.body;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('EntryID', sql.VarChar, EntryID)
            .query('SELECT * FROM Inventory WHERE EntryID = @EntryID');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------PHONENUMBERS TABLE SECTION------------------------------
// Display all Phone Numbers
router.post('/phone_numbers/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM PhoneNumbers');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------PHONETYPES TABLE SECTION--------------------------------

//--------------------------------RECIPE INGREDIENTS TABLE SECTION------------------------
// Display all Recipe Ingredients
router.post('/recipe_ingredients/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM RecipeIngredients');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------RECIPES TABLE SECTION-----------------------------------
// Display all Recipes
router.post('/recipes/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Recipes');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Display Recipe Images with coresponding Recipes
router.post('/recipes/images/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Recipes INNER JOIN Images ON Recipes.RecipeID = Images.RecipeId INNER JOIN Categories ON Categories.CategoryID = Recipes.CategoryID');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Display an Image for a Recipe based on the RecipeID
router.post('/recipe/images/by-recipeID', async (req, res) => {
    const { RecipeID } = req.body;
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('RecipeID', sql.VarChar, RecipeID)
            .query('SELECT * FROM Recipes INNER JOIN Images ON Recipes.RecipeID = Images.RecipeId WHERE Recipes.RecipeID = @RecipeID');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No recipe images found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------SESSIONS TABLE SECTION----------------------------------

//--------------------------------USERS TABLE SECTION-------------------------------------
// Display all Users
router.post('/users/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Users');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--------------------------------VENDORS TABLE SECTION-----------------------------------
// Display all Vendors
router.post('/vendors/all', async (req, res) => {
    const pool = await sql.connect();
    try {
        const result = await pool.request().query('SELECT * FROM Vendors');
        res.status(200).json(result.recordset);  // Send all rows as a JSON response
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export the router
module.exports = router;
