function addAssignment() {
    const newTitle = document.getElementById("editTitle").value;
    const newTag = document.getElementById("editCourseTag").value;
    const newDescription = document.getElementById("editDescription").value;
    const newDueDate = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById("editDueDate").value));
    
    db.collection("assignments").doc(newTitle).set({
        title: newTitle,
        course_tag: newTag,
        description: newDescription,
        due_date: newDueDate,
        users_completed: 0,
    }, { merge: true })
    .then(() => {
        setTimeout(() => {
            location.href = 'assignments.html';
        }, 250); 
    })
}
