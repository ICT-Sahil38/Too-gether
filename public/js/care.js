function validate_names(){
    var names_error = document.getElementById("names_error");
    var names = document.getElementById("names").value;
    if (names.length == 0) {
        names_error.innerHTML = "Name should not be empty!";
        return false;
    }
    else {
        names_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}
function validate_emails() {
    var emails_error = document.getElementById("emails_error");
    var emails = document.getElementById("emails").value;
    if (emails.length == 0) {
        emails_error.innerHTML = "Email Required";

        return false;
    }
    else if (!emails.match(/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)) {
        emails_error.innerHTML = "Email Invalid";
        return false;
    }
    else {
        emails_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function validate_phones(){
    var phones_error = document.getElementById("phones_error");
    var phones = document.getElementById("phones").value;
    if (phones.length < 1 && phones.length > 10) {
        phones_error.innerHTML = "Enter valid phone number";
        return false;
    }
    else if (!phones.match(/^((\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+))|\d{5}([- ]*)\d{6}$/)) {
        phones_error.innerHTML = "Phone number Invalid";
        return false;
    }
    else {
        phones_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}
function validate_messages(){
    var messages_error = document.getElementById("messages_error");
    var messages = document.getElementById("messages").value;
    if (messages.length == 0) {
        messages_error.innerHTML = "Message should not be empty!";
        return false;
    }
    else {
        messages_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}
function validate_submits(event){
    event.preventDefault();
    var submits_error = document.getElementById("submits_error");
    if(!validate_names() || !validate_emails() || !validate_phones() || !validate_messages()){
        submits_error.style.display = "block";
        submits_error.innerHTML = "Fix Error";
        setTimeout(function () { submits_error.style.display = "none"; },3000);
        return false;
    }
    else{
        var audio = new Audio('static/audio/success.mp3');
        data = {
            names : document.getElementById("names").value,
            emails : document.getElementById("emails").value,
            phones : document.getElementById("phones").value,
            messages : document.getElementById("messages").value
        };
        fetch('/care_check',{
            method : "POST",
            headers:{"content-type": "application/json"},
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    audio.play();
                    toastr.success('Submitted Successfully');
                    setTimeout(() => window.location.reload(),2000);
                } else {
                    toastr.error('Failed to submit');
                }
            })
    }
}
