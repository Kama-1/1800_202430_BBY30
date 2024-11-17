function logout() {
    firebase.auth().signOut().then(() => {
        console.log("logging out user");
    }).catch((error) => {
        console.log("Error Occurred. Unable to sign user out.")
    });
  }