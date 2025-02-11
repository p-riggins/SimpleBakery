const sql = require("mssql");
    
// Check if the session is valid
async function isSessionValid(pool, SessionID) { 
    try {
        // selects the create date time of the session from database
        const result = await pool.request()
            .input('SessionID', sql.VarChar, SessionID)
            .query('SELECT CreateDateTime FROM Sessions WHERE SessionID = @SessionID');

        // if the session is found
        if (result.recordset.length > 0) {
            // test activation date
            const TimeNow = new Date();
            const storedCreateTime = new Date(result.recordset[0].CreateDateTime);
            const CreateTimePlus12hrs = storedCreateTime.setHours(storedCreateTime.getHours() + 12);

            // if the session is older than 12 hours, delete the session
            if (CreateTimePlus12hrs <= TimeNow) { 
                await pool.request()
                    .input('SessionID', sql.VarChar, SessionID)
                    .query('DELETE FROM Sessions WHERE SessionID = @SessionID');
                return false;
            } 
            else {  // if the session is less than 12 hours old, return true
                return true;
            }
        } 
            // if the session is not found
        else {
            console.log('No session found for user');
            return false;
        } 
    }
    // if an error occurs
    catch (error) {
        console.error('Error checking session validity:', error);
        return false;
    }
}

module.exports = { isSessionValid }; // Export the function so it can be used in other files


