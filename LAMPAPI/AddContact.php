<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		// check that the user we are trying to add a contact to exists
		$stmtUser = $conn->prepare("SELECT * from Users WHERE ID = ?");
		$stmtUser->bind_param('i', $userId);
		$stmtUser->execute();
		$result = $stmtUser->get_result();

		if (!($row = $result->fetch_assoc())) 
		{
			returnWithError("User ID not found");
		} 
		else 
		{
			$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Email, PhoneNumber, UserId) VALUES(?,?,?,?,?)");
			$stmt->bind_param("ssssi", $firstName, $lastName, $email, $phoneNumber, $userId);
			$stmt->execute();
			returnWithError("");
		}

		$stmt->close();
		$stmtUser->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: *');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>