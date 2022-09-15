<?php
	$inData = getRequestInfo();
	
	$contactId = $inData["contactId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phoneNumber = $inData["phoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// check that the contact we are trying to update exists
		$stmtCheck = $conn->prepare("SELECT * from Contacts WHERE ID = ?");
		$stmtCheck->bind_param('i', $contactId);
		$stmtCheck->execute();
		$result = $stmtCheck->get_result();

		if (!($row = $result->fetch_assoc())) 
		{
			returnWithError("Contact ID not found");
		} else {
			$stmt = $conn->prepare("UPDATE Contacts 
			SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ?
			WHERE ID = ?");
			$stmt->bind_param('ssssi', $firstName, $lastName, $email, $phoneNumber, $contactId);
			$stmt->execute();
			returnWithError("");
		}

		$stmtCheck->close();
		$stmt->close();
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