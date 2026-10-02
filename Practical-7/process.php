<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $mobile = trim($_POST["mobile"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirm = $_POST["confirm"] ?? "";
    $dob = $_POST["dob"] ?? "";
    $gender = $_POST["gender"] ?? "";
    $course = $_POST["course"] ?? "";
    $address = trim($_POST["address"] ?? "");

    $skills = $_POST["skills"] ?? [];

    $skillsText = implode(", ", $skills);

    $errors = [];

    // Validation

    if (empty($name)) {
        $errors[] = "Name is required.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email.";
    }

    if (!preg_match("/^[0-9]{10}$/", $mobile)) {
        $errors[] = "Mobile number must contain 10 digits.";
    }

    if (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters.";
    }

    if ($password !== $confirm) {
        $errors[] = "Passwords do not match.";
    }

    if (empty($dob)) {
        $errors[] = "Date of birth is required.";
    }

    if (empty($gender)) {
        $errors[] = "Gender is required.";
    }

    if (empty($course)) {
        $errors[] = "Course is required.";
    }

    if (!isset($_POST["terms"])) {
        $errors[] = "Please accept Terms & Conditions.";
    }


    // Show errors

    if (!empty($errors)) {

        echo "<h2>Registration Failed</h2>";

        foreach ($errors as $error) {
            echo "<p>" . htmlspecialchars($error) . "</p>";
        }

        echo '<a href="registration.html">Go Back</a>';

        exit;
    }


    // Sanitize

    $name = htmlspecialchars($name);
    $email = htmlspecialchars($email);
    $mobile = htmlspecialchars($mobile);
    $dob = htmlspecialchars($dob);
    $gender = htmlspecialchars($gender);
    $course = htmlspecialchars($course);
    $address = htmlspecialchars($address);
    $skillsText = htmlspecialchars($skillsText);


    // CSV file path

    $file = __DIR__ . DIRECTORY_SEPARATOR . "registrations.csv";


    // Open CSV file

    $handle = fopen($file, "a");


    // Check if file opened

    if ($handle === false) {

        die("ERROR: CSV file could not be created. Check folder permissions.");

    }


    // Add header if file is empty

    if (filesize($file) == 0) {

        fputcsv($handle, [
            "Name",
            "Email",
            "Mobile",
            "Password",
            "Date of Birth",
            "Gender",
            "Course",
            "Skills",
            "Address"
        ]);

    }


    // Add student data

    fputcsv($handle, [
        $name,
        $email,
        $mobile,
        $password,
        $dob,
        $gender,
        $course,
        $skillsText,
        $address
    ]);


    fclose($handle);


    echo "<h2>Registration Successful!</h2>";

    echo "<p>Your registration has been saved successfully.</p>";

    echo '<p>CSV Location: ' . htmlspecialchars($file) . '</p>';

    echo '<a href="registration.html">Register Another Student</a>';

}

else {

    echo "Invalid Request.";

}

?>