//Global variable pointing to the current user's Firestore document
var currentUser;   

//Function that calls everything needed for the main page  
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid); //global
    }
})

// Populates the modal with assignment information, and then displays it to the user
function showAssignmentModal(assignment_id){
    let modal = document.getElementById("assignment-modal")
    db.collection("assignments").doc(assignment_id).get().then(async doc => {
        const due_date = dueDateToText(doc.data().due_date);
        const base_points = doc.data().points;
        const time_points = await calculatePoints(base_points, doc.data().title) - base_points;

        modal.querySelector(".modal-title").innerHTML = doc.data().title;
        modal.querySelector(".modal-description").innerHTML = doc.data().description;
        modal.querySelector(".due-date-here").innerHTML = due_date;
        modal.querySelector(".users-completed-here").innerHTML = doc.data().users_completed + " completed";
        modal.querySelector(".points-here").innerHTML = "+" + base_points + ", +" + time_points + " time bonus"
    })
    const myModal = new bootstrap.Modal(document.getElementById('assignment-modal'));
    myModal.show();
}