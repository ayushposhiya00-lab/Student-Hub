<?php

require "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $mobile = trim($_POST["mobile"]);
    $course = trim($_POST["course"]);

    if (empty($name) || empty($email) || empty($mobile) || empty($course)) {

        echo "All fields are required.";

    } else {

        try {

            $sql = "INSERT INTO students
                    (name, email, mobile, course)
                    VALUES
                    (:name, :email, :mobile, :course)";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                ":name" => $name,
                ":email" => $email,
                ":mobile" => $mobile,
                ":course" => $course
            ]);

            echo "Student added successfully!";

        } catch (PDOException $e) {

            echo "Error: " . $e->getMessage();

        }
    }
}

?>

<!DOCTYPE html>

<html>

<head>

    <title>Add Student</title>

</head>

<body>

<h2>Add Student</h2>

<form method="POST">

    <label>Name:</label>
    <input type="text" name="name" required>

    <br><br>

    <label>Email:</label>
    <input type="email" name="email" required>

    <br><br>

    <label>Mobile:</label>
    <input type="text" name="mobile" required>

    <br><br>

    <label>Course:</label>
    <input type="text" name="course" required>

    <br><br>

    <button type="submit">
        Add Student
    </button>

</form>

</body>

</html>