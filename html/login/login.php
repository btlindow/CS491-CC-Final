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


if (isset($_POST['cred'])) {
        $u_name = $_POST ['cred'][0];
        $p_word = $_POST ['cred'][1];
    
        $sql = "SELECT password FROM cred WHERE username = '" . $u_name . "'";
	$result = $conn->query($sql);
	$row = $result->fetch_assoc();
	
	$dbpass = $row['password'];

	if($p_word == $dbpass) {
                //Barrett's instance:
		//header("Location: http://54.213.136.136:3000/?username=" . $u_name);
                //Local instance:
		header("Location: http://54.226.70.87:3000/?username=" . $u_name);
	}
	else {
		echo("Incorrect Username / Password");
	}
}

mysqli_close($conn);

?>
