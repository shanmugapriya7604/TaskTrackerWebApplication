<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once 'database.php';  // Ensure you have the correct database connection

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];

    // Here, you should verify the username and email with your database
    // Assuming user validation is successful
    $_SESSION['loggedin'] = true; // Set session variable
    // Insert the data into 'users1' table in 'db4' database
    $sql = "INSERT INTO users1 (username, email) VALUES ('$username', '$email')";
    
    if (mysqli_query($conn, $sql)) {
        echo "New user created successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    mysqli_close($conn);
} else {
    echo "Invalid request method";
}
?>
