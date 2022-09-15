<?php
	$inData = getRequestInfo();
	
	$contactId = $_GET['contactId'];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{	
		$stmt = $conn->prepare("SELECT * from Contacts WHERE ID = ?");
		$stmt->bind_param('i', $contactId);
		$stmt->execute();
		$result = $stmt->get_result();

		if (!($row = $result->fetch_assoc())) 
		{
			returnWithError("Contact ID not found");
		}
		else
		{
			$stmtDel = $conn->prepare("DELETE from Contacts WHERE ID = ?");
			$stmtDel->bind_param('i', $contactId);
			$stmtDel->execute();
			returnWithError("");
		}
		

		$stmt->close();
		$stmtDel->close();
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