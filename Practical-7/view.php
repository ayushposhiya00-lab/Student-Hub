<?php

$file = __DIR__ . "/registrations.csv";

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>StudentHub Records</title>

    <style>

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 30px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background-color: white;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #222;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .message {
            text-align: center;
            font-size: 20px;
        }

    </style>

</head>

<body>

<h1>StudentHub Registered Students</h1>

<?php

if (!file_exists($file)) {

    echo "<p class='message'>No registration records found.</p>";

} else {

    $handle = fopen($file, "r");

    if ($handle !== false) {

        echo "<table>";

        // Read first row as table header
        $headers = fgetcsv($handle);

        if ($headers !== false) {

            echo "<tr>";

            foreach ($headers as $header) {

                echo "<th>" . htmlspecialchars($header) . "</th>";

            }

            echo "</tr>";
        }


        // Read remaining rows
        while (($row = fgetcsv($handle)) !== false) {

            echo "<tr>";

            foreach ($row as $data) {

                echo "<td>" . htmlspecialchars($data) . "</td>";

            }

            echo "</tr>";
        }

        echo "</table>";

        fclose($handle);

    } else {

        echo "<p class='message'>Unable to open CSV file.</p>";

    }
}

?>

</body>

</html>