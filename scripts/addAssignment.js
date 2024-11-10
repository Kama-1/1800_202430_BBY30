function addAssignmentToUserArray(assignment_id) {
    const assignmentToAdd = {
        assignment_id: assignment_id,
        isCompleted: false,
        isBookmarked: false
    }

    db.collection("users").get().then(user => {
        user.forEach(doc => {
            let assignmentsArray = doc.data().completedAssignments;
            assignmentsArray.push(assignmentToAdd);
            db.collection("users").doc(doc.id).set({
                completedAssignments: assignmentsArray,
            }, {merge: true})
        })
    })
}


function addAssignment() {
    const newTitle = document.getElementById("editTitle").value;
    const newTag = document.getElementById("editCourseTag").value;
    const newPoints = document.getElementById("editPoints").value;
    const newDescription = document.getElementById("editDescription").value;
    const newDueDate = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById("editDueDate").value));
    console.log(newPoints);
    db.collection("assignments").doc(newTitle).set({
        title: newTitle,
        course_tag: newTag,
        points: newPoints,
        description: newDescription,
        due_date: newDueDate,
        users_completed: 0,
    }, { merge: true })
    .then(() => {
        addAssignmentToUserArray(newTitle)
        setTimeout(() => {
            location.href = 'assignments.html';
        }, 250); 
    })
}

