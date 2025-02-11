// Used to check if the session is still valid
function sessionCheck(sessionID) { // sessionID is the session ID stored in sessionStorage
    $.ajax({    // AJAX call to the server to check if the session is still valid
        url: "http://localhost/session",   
        method: "GET",  
        headers: {  
            'x-session-id': sessionID   
        },
        success: function(data) {   // If the session is valid, the server will return a 200 status code
            console.log("Recipes retrieved", data);
        },
        error: function() { // If the session is invalid, the server will return a 401 status code and the user will be redirected to the login page
            alert("An error occurred. Please try again later.");
            window.location.href = "http://localhost/login";
        }
    });
}

exports = { sessionCheck }; // Export the function so it can be used in other files