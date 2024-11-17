function logout() {
    firebase.auth().signOut().then(() => {

        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        console.log("Error Occurred. Unable to sign user out.")
    });
  }