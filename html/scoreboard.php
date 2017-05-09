<html><head><title>MySQL Table Viewer</title></head><body>
<?php
$servername = "localhost";
$username = "root";
$password = "admin";
$dbname = "Users";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) 
    die("Connection failed: " . $conn->connect_error);

function displayTable($result) {
	echo "<table border='1'>";
	$i = 0;
	while($row = $result->fetch_assoc())
	{	
    		if ($i == 0) {
      			$i++;
      			echo "<tr>";
      			foreach ($row as $key => $value) {
        			echo "<th>" . $key . "</th>";
     		 	}
      			echo "</tr>";
    		}	
    		echo "<tr>";
    		foreach ($row as $value) {
      		echo "<td>" . $value . "</td>";
    		}
    		echo "</tr>";
	}	
	echo "</table>";
}


$sql = "SELECT * FROM scoreboard ORDER BY zscore DESC";
$result = $conn->query($sql);
displayTable($result);
echo "<p></p><p></p>";
$sql = "SELECT * FROM scoreboard ORDER BY hscore DESC";
$result = $conn->query($sql);
displayTable($result);


mysqli_close($conn);

?>
