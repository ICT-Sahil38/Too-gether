document.getElementById("logout").addEventListener("click",()=>{
    data = {
        email:localStorage.getItem("Email"),
        username:localStorage.getItem("Username"),
        password:localStorage.getItem("Password")
    }
    fetch('/logout',{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(data => {
            if(data.logout_success){
                localStorage.removeItem("Email");
                localStorage.removeItem("Username");
                localStorage.removeItem("Password");
                localStorage.removeItem("nav_active");

                action="/";
                document.getElementById("navbar_from").action = action;
                document.getElementById("navbar_from").submit();
            }
            else {
                console.log("Logout failed!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
})

document.getElementById("home").addEventListener("click",()=>{
    action="/home";
    localStorage.setItem("nav_active","home");
    document.getElementById("navbar_from").action = action;
    document.getElementById("navbar_from").submit();
});

document.getElementById("profile").addEventListener("click",()=>{
    action="/profile";
    localStorage.setItem("nav_active","profile");
    document.getElementById("navbar_from").action = action;
    document.getElementById("navbar_from").submit();
});

document.getElementById("care").addEventListener("click",()=>{
    action="/care";
    localStorage.setItem("nav_active","care");
    document.getElementById("navbar_from").action = action;
    document.getElementById("navbar_from").submit();
});

window.addEventListener("load",()=>{
    let elements = document.getElementsByClassName("active");
    for(var i=0;i<elements.length;i++){
        elements[i].classList.remove("active");
    }
    document.getElementById(localStorage.getItem('nav_active')).classList.add("active");
})