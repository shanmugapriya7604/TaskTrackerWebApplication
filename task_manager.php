<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: welcome.html"); // Redirect to welcome page
    exit;
}

// The rest of your task manager code...
?>
