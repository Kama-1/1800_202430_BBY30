
const is_checked = (assignment_id) => {

    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).collection("completed_assignments").doc(assignment_id).get().then((doc) => {
            const completed_state = doc.data().is_completed;
            console.log(completed_state);
            db.collection("users").doc(user.uid).collection("completed_assignments").doc(assignment_id).set({
                is_completed: !completed_state,
    
            }, {merge: true }).catch((error) => {
                console.log("Error getting document:", error);
            });
        });


    });
    
}