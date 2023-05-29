async function register() {
    let msgDOM = document.getElementById("msg");
    msgDOM.textContent = "";
    try {
        let name = document.getElementById("name").value;
        let pass = document.getElementById("password").value;
        let conf = document.getElementById("confirm").value;

        if (pass !== conf) {
            msgDOM.textContent = "Passwords do not match";
            return;
        }

        let res = await requestRegister(name, pass, conf);
        if (res.successful) {
            await login();
            msgDOM.textContent = "Account created. Go to login page";
        } else {
            msgDOM.textContent = "Was not able to register";
        }      
    } catch (err) {
        console.log(err);
        msgDOM.textContent = "An error occurred";   
    }
}