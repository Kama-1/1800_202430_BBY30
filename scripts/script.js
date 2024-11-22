// Logs user out
function logout() {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
        console.error("Error Occurred. Unable to sign user out.")
    });
}