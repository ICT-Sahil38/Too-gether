document.getElementById("signin_btn").addEventListener("click", () => {
    action = "/";
    document.getElementById("SigninForm").action = action;
    document.getElementById("SigninForm").submit();
});

function validate_username(){
    var nameError = document.getElementById("nameError");
    var name = document.getElementById("get_username").value;
    if(name.length == 0){
        nameError.innerHTML = "Username Required!!";
        return false;
    }
    else{
        nameError.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function validate_Email() {
    var emailError = document.getElementById("emailError");
    var email = document.getElementById("get_email").value;
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
    var passwordError = document.getElementById("passError");
    var pass = document.getElementById("get_password").value;
    if (pass.length == 0) {
        passwordError.innerHTML = "Password required";
        return false;
    }
    else if (pass.length < 8) {
        passwordError.innerHTML = "Password must be at least 8 characters";
    }
    else if (!pass.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/)) {
        passwordError.innerHTML = "Password requirements: 1 capital, 1 special, 1 number, 8-32 characters";
        return false;
    }
    else {
        // passwordError.style.color="green";
        passwordError.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function con_password() {
    var conpassError = document.getElementById("conpassError");
    var con_pass = document.getElementById("get_confirmPassword").value;
    var pass = document.getElementById("get_password").value;
    if (con_pass.length == 0) {
        conpassError.innerHTML = "Password required";
        return false;
    }
    else if (pass != con_pass) {
        conpassError.innerHTML = "Password doesn't match";
    }
    else {
        // conpassError.style.color="green";
        conpassError.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function validate_Form(event){
    event.preventDefault();
    var submitError = document.getElementById("submitError");
    if(validate_username() && validate_Email() && validate_Password() && con_password()){
        let for_return = false;
        data={
            msg:"This is from Register Page!!",
            username:document.getElementById("get_username").value,
            email:document.getElementById("get_email").value,
            password:document.getElementById("get_password").value
        }
        console.log("This is Data ",data);
        fetch('/registration_check',{
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body : JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                console.log("This is message from data ", data.message);
                console.log("This is success status from data ",data.success,true);
                if(data.success){
                    localStorage.setItem('Username',`${data.username}`);
                    localStorage.setItem('Email',`${data.email}`);
                    localStorage.setItem('Password',`${data.password}`);

                    action = '/home';
                    localStorage.setItem('nav_active', "home");
                    document.getElementById("empty1").action = action;
                    document.getElementById("empty1").submit();
                    console.log("Submitted Successfully jenbgfuilb3fnzefuvssbgsiufebvg4");
                    for_return = true;
                }
                else {
                    submitError.style.display = "block";
                    submitError.innerHTML = "Email or Password Invalid!";
                    setTimeout(function () { submitError.style.display = "none" }, 3000);
                    // alert("Yes I'm Here at this point!!!");
                }
            })
            .catch(error=>{
                console.log("Catch Error: ",error);
            });
    }
    else{
        submitError.style.display = "block"
        submitError.innerHTML = "Fix Error"
        setTimeout(function () { submitError.style.display = "none" }, 3000)
        return false;
    }
}