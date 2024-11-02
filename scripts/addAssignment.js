function addAssignment() {
    const newTitle = document.getElementById("editTitle").value;
    const newTag = document.getElementById("editCourseTag").value;
    const newDescription = document.getElementById("editDescription").value;

    db.collection("Assignments").doc(newTitle).set({
        title: newTitle,
        course_tag: newTag,
        description: newDescription,
        dueDate: null,
        users_completed: 0,
    }, { merge: true })
}

