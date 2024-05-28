function validate_nickname(){
    var nickname_error = document.getElementById("nickname_error");
    var nickname = document.getElementById("nickname").value;
    if (nickname.length == 0) {
        nickname_error.innerHTML = "Name should not be empty!";
        return false;
    }
    else {
        nickname_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}
function validate_bio(){
    var bio_error = document.getElementById("bio_error");
    var bio = document.getElementById("bio").value;
    if (bio.length == 0) {
        bio_error.innerHTML = "Bio should not be empty!";
        return false;
    }
    else {
        bio_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}
function validate_occupation(){
    var occupation_error = document.getElementById("occupation_error");
    var occupation = document.getElementById("occupation").value;
    if (occupation.length == 0) {
        occupation_error.innerHTML = "Occupation should not be empty!";
        return false;
    }
    else {
        occupation_error.innerHTML = ""; //"Validation Successfull";
        return true;
    }
}

function submit_profile(event){
    event.preventDefault();
    var submit_error = document.getElementById("submit_error");
    if(!validate_nickname() || !validate_bio() || !validate_occupation()){
        submit_error.style.display = "block";
        submit_error.innerHTML = "Fix Error";
        setTimeout(function () { login_SubmitError.style.display = "none"; },3000);
        return false;
    }
    else{
        data = {
            nickname : document.getElementById("nickname").value,
            bio : document.getElementById("bio").value,
            occupation : document.getElementById("occupation").value
        };
        fetch('/editprofile',{
            method : "POST",
            headers:{"content-type": "application/json"},
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    toastr.success('Profile Updated successfully');
                    setTimeout(() => window.location.reload(),2000);
                } else {
                    toastr.error('Failed to update profile');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}