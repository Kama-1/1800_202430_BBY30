function addAssignment() {
    const newTitle = document.getElementById("editTitle").value;
    const newTag = document.getElementById("editCourseTag").value;
    const newDescription = document.getElementById("editDescription").value;
    const tempDueDate1 = document.getElementById("editDueDate").value;
    const tempDueDate2 = new Date(tempDueDate1);
    const newDueDate = firebase.firestore.Timestamp.fromDate(tempDueDate2);
    
    db.collection("Assignments").doc(newTitle).set({
        title: newTitle,
        course_tag: newTag,
        description: newDescription,
        dueDate: newDueDate,
        users_completed: 0,
    }, { merge: true })
}

