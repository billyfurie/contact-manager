<?php
	$inData = getRequestInfo();
	
	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// check that the contact we are trying to update exists
		$stmtCheck = $conn->prepare("SELECT * from Users WHERE ID = ?");
		$stmtCheck->bind_param('i', $userId);
		$stmtCheck->execute();
		$result = $stmtCheck->get_result();

		if (!($row = $result->fetch_assoc())) 
		{
			returnWithError("User ID not found");
		} 
		else 
		{
			$stmt = $conn->prepare("UPDATE Users 
			SET FirstName = ?, LastName = ?, Login = ?, Password = ?
			WHERE ID = ?");
			$stmt->bind_param('ssssi', $firstName, $lastName, $email, $password, $userId);
			$stmt->execute();
		}

		$stmtCheck->close();
		$stmt->close();
		$conn->close();
		returnWithError("");
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