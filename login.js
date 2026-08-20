const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const studentId =
            document.getElementById("studentId").value;

        const password =
            document.getElementById("password").value;


        if (
            studentId === "BV2026XXX" &&
            password === "12345"
        ) {

            loginMessage.innerText =
                "Login successful!";


            window.location.href =
                "index.html";

        }

        else {

            loginMessage.innerText =
                "Invalid Student ID or Password.";

        }

    }
);