document.getElementById('reset-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const errorMsg = document.getElementById('error-msg');
    
    if (!email) {
        errorMsg.textContent = "Please enter a valid email.";
        errorMsg.style.display = "block";
        return;
    }

    // Hide error message if email is entered
    errorMsg.style.display = "none";
    
    // Send the request to the server
    fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Reset link sent! Please check your email.');
        } else {
            errorMsg.textContent = data.message || "Something went wrong.";
            errorMsg.style.display = "block";
        }
    })
    .catch(error => {
        errorMsg.textContent = "There was an error. Please try again.";
        errorMsg.style.display = "block";
    });
});
