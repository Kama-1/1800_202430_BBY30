//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //global
    }
})

// const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
// myModal.show();

function showAssignmentModal(assignment_id){
    console.log(currentUser.id)
    console.log(assignment_id)
}