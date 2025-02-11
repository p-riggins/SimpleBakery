const sql = require("mssql");
const uuid = require('uuid');

// Create a new session
async function createSession(pool, UserID, response) {
    SessionID = uuid.v4();  // Generate a new session ID
    const CreateDateTime = new Date();  // Get the current date and time

    // Insert the new session into the database
    await pool.request()
        .input('SessionID', sql.VarChar, SessionID)
        .input('UserID', sql.VarChar, UserID)
        .input('CreateDateTime', sql.DateTime, CreateDateTime)
        .query('INSERT INTO Sessions (SessionId, UserID, CreateDateTime) VALUES (@SessionID, @UserID, @CreateDateTime)');
    return response.status(200).send(SessionID);    // Return the session ID to the client	
}

module.exports = { createSession }; // Export the function so it can be used in other files