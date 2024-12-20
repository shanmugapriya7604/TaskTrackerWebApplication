document.getElementById("getStartedBtn").addEventListener("click", () => {
    // Perform an AJAX request to check if the user is logged in
    fetch('check_login.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                window.location.href = "task_manager.php"; // Redirect to task manager
            } else {
                alert("You do not have an account. Please sign up first.");
                window.location.href = "index.html"; // Redirect to sign up page
            }
        });
});
