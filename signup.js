
let signupButton = document.getElementById("signupButton");

signupButton.addEventListener("click", function() {

    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if(firstName === "") {
        alert("Please enter your first name");
        return;
    }

    if(lastName === "") {
        alert("Please enter your last name");
        return;
    }

    if(email === "") {
        alert("Please enter your email");
        return;
    }

    if(password === "") {
        alert("Please enter your password");
        return;
    }

    if(confirmPassword === "") {
        alert("Please confirm your password");
        return;
    }

    if(password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    localStorage.setItem(
        "smartParkUser",
        JSON.stringify(user)
    );

    alert("Account created successfully!");

    window.location.href = "login.html";
});
