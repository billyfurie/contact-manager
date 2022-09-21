const url = "http://143.244.169.27";
const ext = ".php";

var tempID = 0;
var tempFirst = "";
var tempLast = "";
var tempEmail = "";

function validEmail(email) 
{
    atpos = email.indexOf("@");
    dotpos = email.lastIndexOf(".");
    finalChar = email.length;

    // Check to see if there is a character after the "."
    if ((finalChar - 1) == dotpos) 
    {
        return false;
    }

    // Check to see if there is a character before and after "@"
    if (atpos < 1 || ( dotpos - atpos < 2 )) 
    {
        return false;
    }

    return true;
}

function login(){
    tempID = 0;
    tempFirst = "";
    tempLast = "";

    let login = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    document.getElementById("loginSubmit").innerHTML = "";

    let loginField = document.getElementById("email");
    let passField = document.getElementById("password");
    loginField.classList.remove("field-invalid");
    passField.classList.remove("field-invalid");

    if (login == "" || pass == "") {
        document.getElementById('loginSubmit').innerHTML = "Please fill in all fields.";
        if (login == "") {
            loginField.classList.add("field-invalid");
        }
        if (pass == "") {
            passField.classList.add("field-invalid");
        }
        return;
    }
    if (validEmail(login) == false) {
        document.getElementById('loginSubmit').innerHTML = "Please enter a valid email.";
        loginField.classList.add("field-invalid");
        return;
    }

    let tmp = {email:login, password:pass};

    let jsonPayload = JSON.stringify(tmp);

    let link = url + "/LAMPAPI/LoginUser" + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                tempID = jsonObject.id;

                if(tempID < 1){
                    document.getElementById("loginSubmit").innerHTML = "Email or Password incorrect";
                    loginField.classList.add("field-invalid");
                    passField.classList.add("field-invalid");
                    return;
                }

                tempFirst = jsonObject.firstName;
                tempLast = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html"; // CHANGE THIS TO A NEW SCREEN
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("loginSubmit").innerHTML = err.message;
        loginField.classList.add("field-invalid");
        passField.classList.add("field-invalid");
    }

}

function saveCookie(){
    let min = 20;
    let date = new Date();
    date.setTime(date.getTime() + (min*60*1000));
    document.cookie = "FirstName=" + tempFirst + ",LastName=" + tempLast + ",userId=" + tempID +";expires=" + date.toGMTString();
}

function readCookie(){
    tempID = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for(var i = 0; i < splits.length; i++){
        let one = splits[i].trim();
        let tokens = one.split("=");
        if(tokens[0] == "FirstName"){
            tempFirst = tokens[1];
        }
        else if(tokens[0] == "LastName"){
            tempLast = tokens[1];
        }
        else if(tokens[0] == "userId"){
            tempID = parseInt(tokens[1].trim());
        }
    }

    if(tempID < 0){
        window.location.href = "index.html";
    }
    else{
        //document.getElementById("email").innerHTML = "Logged in as " + tempFirst + " " + tempLast;
    }
}

function logout() {
    tempID = 0;
    tempFirst = "";
    tempLast = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function register(){
    tempID = 0;
    tempFirst = "";
    tempLast = "";

    let email = document.getElementById('newEmail').value;
    let pass = document.getElementById('newPass').value;
    let newFirst = document.getElementById('newFirstName').value;
    let newLast = document.getElementById('newLastName').value;

    document.getElementById('resultRegister').innerHTML = "";

    let firstNameField = document.getElementById("newFirstName");
    let lastNameField = document.getElementById("newLastName");
    let loginField = document.getElementById("newEmail");
    let passField = document.getElementById("newPass");
    firstNameField.classList.remove("field-invalid");
    lastNameField.classList.remove("field-invalid");
    loginField.classList.remove("field-invalid");
    passField.classList.remove("field-invalid");

    if(email == "" || pass == "" || newFirst == "" || newLast == ""){
        document.getElementById('resultRegister').innerHTML = "Please fill in all fields.";
        if(email == ""){
            loginField.classList.add("field-invalid");
        }
        if(pass == ""){
            passField.classList.add("field-invalid");
        }
        if(newFirst == ""){
            firstNameField.classList.add("field-invalid");
        }
        if(newLast == ""){
            lastNameField.classList.add("field-invalid");  
        }
        return;
    }
    if (validEmail(email) == false) {
        document.getElementById('resultRegister').innerHTML = "Please enter a valid email.";
        loginField.classList.add("field-invalid");
        return;
    }

    let newObj = {firstName:newFirst, lastName:newLast, email:email, password:pass};
    let pay = JSON.stringify(newObj);

    let link = url + '/LAMPAPI/RegisterUser' + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){

                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error == "") {
                    saveCookie();
                    window.location.href = "index.html";
                }
                else {
                    loginField.classList.add("field-invalid");
                    document.getElementById("resultRegister").innerHTML = jsonObject.error;
                }
            }
        };
        xhr.send(pay);
    }
    catch(err){
        console.log(err);
    }
}

function goToRegisterPage() {
   window.location.href = "register.html";
}

function goToLoginPage() {
    window.location.href = "index.html";
}

function addContact(){
    let newFirst = document.getElementById("newFirst").value;
    let newLast = document.getElementById("newLast").value;
    let newEmail = document.getElementById("newEmail").value;
    let newPhone = document.getElementById("newPhone").value;


    let newFirstField = document.getElementById("newFirst");
    let newLastField = document.getElementById("newLast");
    let newEmailField = document.getElementById("newEmail");
    let newPhoneField = document.getElementById("newPhone");
    document.getElementById("addContactSubmit").innerHTML = "";
    newFirstField.classList.remove("field-invalid");
    newLastField.classList.remove("field-invalid");
    newEmailField.classList.remove("field-invalid");
    newPhoneField.classList.remove("field-invalid");

    if(newFirst == "" || newLast == "" || newEmail == "" || newPhone == ""){
        document.getElementById("addContactSubmit").innerHTML = "Please fill in all fields.";
        if(newEmail == ""){
            newEmailField.classList.add("field-invalid");
        }
        if(newPhone == ""){
            newPhoneField.classList.add("field-invalid");
        }
        if(newFirst == ""){
            newFirstField.classList.add("field-invalid");
        }
        if(newLast == ""){
            newLastField.classList.add("field-invalid");  
        }
        return;
    }
    if (validEmail(newEmail) == false) {
        document.getElementById('addContactSubmit').innerHTML = "Please enter a valid email.";
        newEmailField.classList.add("field-invalid");
        return;
    }
    
    let newObj = {firstName:newFirst, lastName:newLast, email:newEmail, phoneNumber:newPhone, userId:tempID}
    let pay = JSON.stringify(newObj);

    let link = url + "/LAMPAPI/AddContact" + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("addContactForm").reset();

                var myModal = document.getElementById('addContactModal');
                var modal = bootstrap.Modal.getInstance(myModal);
                modal.hide();
                
                searchContact();
            }
        };
        xhr.send(pay);
    }
    catch(err) { 
        document.getElementById("addContactSubmit").innerHTML = err.message;
    }
}

function searchContact() {
    let searchContact = document.getElementById("searchVal").value;
    let contactList = "";
    document.getElementById("searchTableBody").innerHTML = contactList;

    document.getElementById("no-contacts-found").innerHTML = "";

    let tempObj = {search:searchContact, userId:tempID};
    let pay = JSON.stringify(tempObj);

    let link = url + "/LAMPAPI/SearchContacts" + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", link, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                // clear the table before the search
                document.getElementById("searchTableBody").innerHTML = "";
                let jsonObj = JSON.parse(xhr.responseText);

                // if (jsonObj.error == "No Records Found") {
                //     console.log("No contacts found");
                //     document.getElementById("no-contacts-found").innerHTML = 
                //         `<div class="no-contacts-found">
                //             <i class="fa-solid fa-circle-exclamation fa-3x"></i>
                //             <h4 class="no-contacts-found-text">No contacts were found! Create a new contact or try modifying your search.</h4>
                //         </div>`;
                // }

       
                for(let i = 0; i < jsonObj.results.length; i++){
                    contactList += '<tr>';
                    contactList += "<td>" + jsonObj.results[i].firstName + "</td>";
                    contactList += "<td>" + jsonObj.results[i].lastName + "</td>";
                    contactList += "<td>" + jsonObj.results[i].email + "</td>";
                    contactList += "<td>" + jsonObj.results[i].phoneNumber + "</td>";

                    contactList += '<td class="button-col">';
                    
                    let contactInfo = jsonObj.results[i].contactId + ", '" + jsonObj.results[i].firstName + "', '" + jsonObj.results[i].lastName +  "', '" + jsonObj.results[i].email +  "', '" + jsonObj.results[i].phoneNumber + "'";
                    contactList += '<button type="button" class="btn btn-success contactActionButton" data-toggle="modal" data-target="#editContactModal" onClick="populateEditModal(' + contactInfo + ')"><i class="fa-solid fa-pencil"></i></button>';
                    contactList += '<button type="button" class="btn btn-danger contactActionButton" onClick=deleteContact(' + jsonObj.results[i].contactId + ')><i class="fa-solid fa-trash-can"></i></button>';

                    contactList += "</td>";
                    contactList += "</tr>";
                }
                document.getElementById("searchTableBody").innerHTML = contactList;
            }

        };
        xhr.send(pay);
    }
    catch(err){

    }
}

function deleteContact(contactId) {
    console.log("deleted");

    let link = url + "/LAMPAPI/RemoveContact" + ext + "?contactId=" + contactId;

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", link, true);
    xhr.setRequestHeader("Content-type", "applicaton/json; charset=UTF-8");

    try {
        
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200){
                console.log("contact" + contactId);
                searchContact();
            }
        };
        
        xhr.send();
    }
    catch(err){
        console.log("error");
    }
}

function updateContact(id) {
    console.log("plaease");
    let newFirst = document.getElementById("editFirst").value;
    let newLast = document.getElementById("editLast").value;
    let newEmail = document.getElementById("editEmail").value;
    let newPhone = document.getElementById("editPhone").value;


    let newFirstField = document.getElementById("editFirst");
    let newLastField = document.getElementById("editLast");
    let newEmailField = document.getElementById("editEmail");
    let newPhoneField = document.getElementById("editPhone");
    document.getElementById("editContactSubmit").innerHTML = "";
    newFirstField.classList.remove("field-invalid");
    newLastField.classList.remove("field-invalid");
    newEmailField.classList.remove("field-invalid");
    newPhoneField.classList.remove("field-invalid");

    if(newFirst == "" || newLast == "" || newEmail == "" || newPhone == ""){
        document.getElementById("editContactSubmit").innerHTML = "Please fill in all fields.";
        if(newEmail == ""){
            newEmailField.classList.add("field-invalid");
        }
        if(newPhone == ""){
            newPhoneField.classList.add("field-invalid");
        }
        if(newFirst == ""){
            newFirstField.classList.add("field-invalid");
        }
        if(newLast == ""){
            newLastField.classList.add("field-invalid");  
        }
        return;
    }
    if (validEmail(newEmail) == false) {
        document.getElementById('editContactSubmit').innerHTML = "Please enter a valid email.";
        newEmailField.classList.add("field-invalid");
        return;
    }


    let tempObj = {contactId:id, firstName:newFirst, lastName:newLast, email:newEmail, phoneNumber:newPhone};
    let pay = JSON.stringify(tempObj);

    let link = url + "/LAMPAPI/UpdateContact" + ext;

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", link, true);
    xhr.setRequestHeader("Content-type", "applicaton/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                searchContact();
            }
        };
        xhr.send(pay);
    }
    catch(err){
        console.log("broken");
    }
}

function populateEditModal(contactId, firstName, lastName, email, phoneNumber) {

    document.getElementById("editFirst").value = firstName;
    document.getElementById("editLast").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phoneNumber;
    //document.getElementById("editContactButton").onmousedown = updateContact(contactId);
    document.getElementById("editContactButton").outerHTML = '<button type="button" id="editContactButton" class="btn btn-primary" onClick="updateContact(' + contactId + ')"><i class="fa-solid fa-pencil"></i></button>'
}