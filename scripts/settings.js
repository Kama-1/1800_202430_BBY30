function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userName = user.displayName;
            document.getElementById("changeName").value = userName;
        }
            
    });
}

function updateName() {
    firebase.auth().onAuthStateChanged(user => {
        let username = document.getElementById("changeName").value;
        if (user) {
            user.updateProfile({
                displayName: username 
            }).then(() => {
                console.log("Username updated successfully");
            }).catch((error) => {
                console.error("Error updating username:", error);
            });
        } else {
            console.log("No user is signed in.");
        }
    });
}

function updatePassword() {
    firebase.auth().onAuthStateChanged(user => {
        let newPassword = document.getElementById("newPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;
        if (user && newPassword === confirmPassword) {
            user.updatePassword(newPassword).then(() => {
                console.log("Password updated successfully");
            }).catch((error) => {
                console.error("Error updating password:", error);
            });
        } else {
            if (!user) {
                alert("Passwords do not match");
            } else {
                console.log("Passwords do not match.");
            }
        }
    });
}

getNameFromAuth();