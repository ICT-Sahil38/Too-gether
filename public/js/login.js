document.getElementById("signup_btn").addEventListener("click", () => {
    action = "/register";
    document.getElementById("loginForm").action = action;
    document.getElementById("loginForm").submit();
});

function validate_Email() {
    var emailError = document.getElementById("loginEmailError");
    var email = document.getElementById("loginEmail").value;
    if (email.length == 0) {
        emailError.innerHTML = "Email Required";

        return false;
    }
    else if (!email.match(/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)) {
        // /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/
        // /^[a-z0-9_]+@[a-z_]+?\.[a-z]{2,3}$/
        emailError.innerHTML = "Email Invalid";
        return false;
    }
    else {
        emailError.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function validate_Password() {
    var passwordError = document.getElementById("loginPasswordError");
    var pass = document.getElementById("loginPassword").value;
    if (pass.length == 0) {
        passwordError.innerHTML = "Password required";
        return false;
    }
    else if (pass.length < 8) {
        passwordError.style.color = "red";
        passwordError.innerHTML = "Password must be at least 8 characters";
        return false;
    }
    else if (!pass.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/)) {
        passwordError.style.color = "red";
        passwordError.innerHTML = "Password requirements: 1 capital, 1 special, 1 number, 8-32 characters";
        return false;
    }
    else {
        // passwordError.style.color="green";
        passwordError.innerHTML = "";//"Validation Successfull";
        return true;
    }
}

function validate_Login_Form(){
    // event.preventDefault();
    var login_SubmitError = document.getElementById("Login_Submit_Error");
    if(!validate_Email() || !validate_Password()){
        login_SubmitError.style.display = "block";
        login_SubmitError.innerHTML = "Fix Error";
        setTimeout(function () { login_SubmitError.style.display = "none"; },3000);
        return false;
    }
    else{
        var for_return = false;
        data = {
            msg : "This is login message",
            email : document.getElementById("loginEmail").value,
            password : document.getElementById("loginPassword").value
        };
        fetch("/login_check",{
            method : "POST",
            headers:{"content-type": "application/json"},
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                // console.log(data.message);
                // console.log(data.success,true);
                if(data.success){
                    // console.log("Response", response)
                    localStorage.setItem('Username', `${data.username}`);
                    localStorage.setItem('Email', `${data.email}`);
                    localStorage.setItem('Password', `${data.password}`);
                    
                    action = "/home";
                    localStorage.setItem('nav_active', "home");
                    document.getElementById("empty").action = action;
                    document.getElementById("empty").submit();
                    for_return = true;
                }
                else {
                    login_SubmitError.style.display = "block";
                    login_SubmitError.innerHTML = "Email or Password Invalid!";
                    setTimeout(function () { login_SubmitError.style.display = "none" }, 3000);
                }
            })
            .catch(error => {
                console.error(error);
            });
        // console.log(data);
        console.log("Login Successful");
        return for_return;
    }
}