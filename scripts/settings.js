function getName() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userName = user.displayName;
            document.getElementById("changeName").value = userName;
        }
    });
}

function getWebsiteTheme() {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const websiteTheme = doc.data().website_theme;
                document.getElementById("websiteTheme").value = websiteTheme; 
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    });
}

function getShowCoursesOnStartup() {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                document.getElementById("showCoursesOnStartup").checked = doc.data().course_list_startup;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    });
}

function updateName() {
    firebase.auth().onAuthStateChanged(user => {
        let username = document.getElementById("changeName").value;
        if (user) {
            db.collection("users").doc(user.uid).set({
                name: user.displayName,
            }, { merge: true }).then
            user.updateProfile({
                displayName: username
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

function updateShowCoursesOnStartup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const checkbox = document.getElementById("showCoursesOnStartup");
            db.collection("users").doc(user.uid).set({
                course_list_startup: checkbox.checked,
            }, { merge: true })
        }
    });
}

function updateWebsiteTheme() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const theme = document.getElementById("websiteTheme").value;
            db.collection("users").doc(user.uid).set({
                website_theme: theme,
            }, { merge: true })
        }
    });
}
getName();
getWebsiteTheme();
getShowCoursesOnStartup();