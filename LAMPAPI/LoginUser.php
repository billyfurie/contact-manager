
<?php

$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
if( $conn->connect_error )
{
	returnWithError( $conn->connect_error );
}
else
{
	$stmtEmail = $conn->prepare("SELECT * FROM Users WHERE Login=?");
	$stmtEmail->bind_param("s", $inData["email"]);
	$stmtEmail->execute();
	$resultEmail = $stmtEmail->get_result();

	$stmtAuth = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password =?");
	$stmtAuth->bind_param("ss", $inData["email"], $inData["password"]);
	$stmtAuth->execute();
	$resultAuth = $stmtAuth->get_result();

	if (!($row = $resultEmail->fetch_assoc()))
	{
		returnWithError("No user found with that email.");
	}
	else if (!($row = $resultAuth->fetch_assoc()))
	{
		returnWithError("Incorrect password entered for the user.");
	}
	else 
	{
		returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
	}

	$stmtEmail->close();
	$stmtAuth->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError( $err )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson( $retValue );
}

?>
