// API-Put.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

//--------------------------------EMAIL TABLE SECTION-------------------------------------
// Update an Email via EmailID
router.post('/emails/update', async (req, res) => {
    const { EmailID, EmailAddress, UserID, Type } = req.body;
    let Valid = true;
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('EmailID', sql.VarChar, EmailID)
            .input('EmailAddress', sql.VarChar(255), EmailAddress)
            .input('UserID', sql.VarChar, UserID)
            .input('Type', sql.VarChar(50), Type)
            .input('Valid', sql.Bit, Valid)
            .query('UPDATE Email SET EmailAddress = @EmailAddress, UserID = @UserID, Type = @Type, Valid = @Valid WHERE EmailID = @EmailID');
        res.status(200).json({ message: 'Email updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//--------------------------------EMAILTYPES TABLE SECTION--------------------------------

//--------------------------------EMPLOYEES TABLE SECTION---------------------------------

//--------------------------------INGREDIENTS TABLE SECTION-------------------------------
// Update an Ingredient
router.put('/ingredients/:IngredientID', async (req, res) => {
    const { IngredientID } = req.params;
    const updatedData = req.body;
    try {
      const pool = await sql.connect();
      await pool.request()
        .input('IngredientID', sql.Int, IngredientID)
        .input('Name', sql.VarChar, updatedData.Name)
        .input('Quantity', sql.Float, updatedData.Quantity)
        .input('Cost', sql.Float, updatedData.Cost)
        .query('UPDATE Ingredients SET Name = @Name, Quantity = @Quantity, Cost = @Cost WHERE IngredientID = @IngredientID');
      res.json({ message: 'Ingredient updated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//--------------------------------INVENTORY TABLE SECTION---------------------------------
// Update an Inventory Item
router.put('/inventory/:EntryID', async (req, res) => {
    const { EntryID } = req.params;
    const { Quantity, UserID, Notes, Cost, CreateDateTime, ExpireDateTime, PONumber, RecipeID } = req.body;
    try {
      const pool = await sql.connect();
      await pool.request()
        .input('EntryID', sql.Int, EntryID)
        .input('Quantity', sql.Int, Quantity)
        .input('UserID', sql.Int, UserID)
        .input('Notes', sql.VarChar, Notes)
        .input('Cost', sql.Float, Cost)
        .input('CreateDateTime', sql.DateTime, CreateDateTime)
        .input('ExpireDateTime', sql.DateTime, ExpireDateTime)
        .input('PONumber', sql.VarChar, PONumber)
        .input('RecipeID', sql.Int, RecipeID)
        .query('UPDATE Inventory SET Quantity = @Quantity, UserID = @UserID, Notes = @Notes, Cost = @Cost, CreateDateTime = @CreateDateTime, ExpireDateTime = @ExpireDateTime, PONumber = @PONumber, RecipeID = @RecipeID WHERE EntryID = @EntryID');
      res.json({ message: 'Inventory item updated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//--------------------------------PHONENUMBERS TABLE SECTION------------------------------

//--------------------------------PHONETYPES TABLE SECTION--------------------------------

//--------------------------------RECIPE INGREDIENTS TABLE SECTION------------------------

//--------------------------------RECIPES TABLE SECTION-----------------------------------

//--------------------------------SESSIONS TABLE SECTION----------------------------------

//--------------------------------USERS TABLE SECTION-------------------------------------

//--------------------------------VENDORS TABLE SECTION-----------------------------------


// Export the router
module.exports = router;
