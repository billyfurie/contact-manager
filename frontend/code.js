const url = "http://cop4331-group24.com";
const ext = ".php";

var tempID = 0;
var tempFirst = "";
var tempLast = "";
var tempEmail = "";


function login(){
    console.log("Login pressed");
    tempID = 0;
    tempFirst = "";
    tempLast = "";

    let login = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    document.getElementById("loginSubmit").innerHTML = "";

    let tmp={email:login,password:password};

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
        document.getElementById("email").innerHTML = "Logged in as " + tempFirst + " " + tempLast;
    }
}

function register(){
    console.log("Buttonclicked");
    tempID = 0;
    tempFirst = "";
    tempLast = "";

    let email = document.getElementById('newEmail').value;
    let pass = document.getElementById('newPass').value;
    let newFirst = document.getElementById('newFirstName').value;
    let newLast = document.getElementById('newLastName').value;

    if(email == "" || pass == "" || newFirst == "" || newLast == ""){
        document.getElementById('resultRegister').innterHTML = "Empty Fields";
        if(email == ""){
            document.getElementById('newEmail').innerHTML = "Email required to register";
        }
        if(pass == ""){
            document.getElementById('newPass').innerHTML = "Password required to register";
        }
        if(newFirst == ""){
            document.getElementById('newFirst').innerHTML = "First Name required to register";
        }
        if(newLast == ""){
            document.getElementById('newLast').innerHTML = "Last Name required to register";
        }
    }

    else{
        let newObj = {firstName:newFirst, lastName:newLast, email:newEmail, password:newPass};
        let pay = JSON.stringify(newObj);

        let link = url + '/LAMPAPI/RegisterUser' + ext;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", link, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try{
            xhr.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    document.getElementById("resultRegister").innerHTML = "New user registered!";

                    let tempObj = JSON.parse(xhr.repsonseText);

                    tempID = tempObj.id;

                    tempFirst = jsonObject.firstName;
                    tempLast = jsonObject.lastName;

                    saveCookie();

                    window.location.href = "index.html";
                }
            };
            xhr.send(pay);
        }
        catch(err){
            document.getElementById("resultRegister").innerHTML = err.message;
        }
    }

}