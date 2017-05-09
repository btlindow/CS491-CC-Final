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


if (isset($_POST['cre'])) {
        $u_name = $_POST ['cre'][0];
        $p_word = $_POST ['cre'][1];
        $c_word = $_POST ['cre'][2];
   
   	if($p_word == $c_word) {
		$sql = "INSERT INTO cred (username, password) VALUES (\"" .$u_name . "\", \"" .$p_word . "\");";
		$result = $conn->query($sql);
		header("Location: http://54.226.70.87");
	}
	else {
		echo("Passwords Do Not Match");
	}

}

mysqli_close($conn);

?>
