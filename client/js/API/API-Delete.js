// API-Delete.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

//--------------------------------EMAIL TABLE SECTION-------------------------------------
// Delete an Email by EmailID
router.post('/emails/delete', async (req, res) => {
  const { EmailID } = req.body;
  try {
      const pool = await sql.connect();
      await pool.request()
          .input('EmailID', sql.VarChar, EmailID)
          .query('DELETE FROM Email WHERE EmailID = @EmailID');
      res.status(200).json({ message: 'Email deleted' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//--------------------------------EMAILTYPES TABLE SECTION--------------------------------

//--------------------------------EMPLOYEES TABLE SECTION---------------------------------

//--------------------------------INGREDIENTS TABLE SECTION-------------------------------
// Delete an Ingredient
router.delete('/ingredients/:IngredientID', async (req, res) => {
  const { IngredientID } = req.params;
  try {
    const pool = await sql.connect();
    await pool.request().input('IngredientID', sql.Int, IngredientID).query('DELETE FROM Ingredients WHERE IngredientID = @IngredientID');
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//--------------------------------INVENTORY TABLE SECTION---------------------------------
// Delete an Inventory Item
router.delete('/inventory/:EntryID', async (req, res) => {
  const { EntryID } = req.params;
  try {
    const pool = await sql.connect();
    await pool.request().input('EntryID', sql.Int, EntryID).query('DELETE FROM Inventory WHERE EntryID = @EntryID');
    res.json({ message: 'Inventory item deleted' });
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
// Delete a Vendor
router.delete('/vendors/:IngredientID', async (req, res) => {
  const { IngredientID } = req.params;
  try {
    const pool = await sql.connect();
    await pool.request().input('IngredientID', sql.Int, IngredientID).query('DELETE FROM Vendors WHERE IngredientID = @IngredientID');
    res.status(200).send('Vendor deleted successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the router
module.exports = router;
