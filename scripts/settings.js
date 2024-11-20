// Sets the user's name in settings to be their account name in firebase 
function getName() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userName = user.displayName;
      document.getElementById("changeName").value = userName;
    }
  });
}

// Retrieve the user's website theme from firebase, and displays it as the selected setting
function getWebsiteTheme() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
          const websiteTheme = doc.data().website_theme;
          document.getElementById("websiteTheme").value = websiteTheme;
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }

  });
}

// Change the user's name in firebase to the new string they inputted
function updateName() {
  firebase.auth().onAuthStateChanged(user => {
    let username = document.getElementById("changeName").value;
    if (user) {
      db.collection("users").doc(user.uid).set({
        name: username,
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
  alert("Name successfully updated.");
}

// Change the users password to the new password they inputted
function updatePassword() {
  firebase.auth().onAuthStateChanged(user => {
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    if (user && newPassword === confirmPassword) {
      user.updatePassword(newPassword).then(() => {
        alert("Password Successfully Updated")
      }).catch((error) => {
        console.error("Error updating password:", error);
      });
    } else {
      alert("Passwords do not match");
    }
  });
}

// Change the users website theme to the value they selected
function updateWebsiteTheme() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const theme = document.getElementById("websiteTheme").value;
      console.log(theme);
      db.collection("users").doc(user.uid).set({
        website_theme: theme,
      }, { merge: true })
      if (theme === "dark") {
        htmlBody = document.body;
        htmlBody.classList.toggle("dark-mode");
      }
    }
  });
}

// Retrieves firebase settings when page is opened
window.onload = function () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      getName();
      getWebsiteTheme();
    }
  });

}

function checkDarkMode() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      db.collection("users").doc(user.uid).get().then((doc) => {
        const theme = doc.data().website_theme
        if (theme === "dark") {
          htmlBody = document.body;
          htmlBody.classList.toggle("dark-mode");
        }
      });
    }
  })
}
checkDarkMode();