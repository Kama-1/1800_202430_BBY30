function deleteAssignment(assignment_id) {
    console.log("test");
  // Removes assignment document from assignment collection
  db.collection("assignments")
    .doc(assignment_id)
    .delete()
    .then(() => {
      setTimeout(() => {
        location.reload();
      }, 1000);
    });

  // Removes assignment from users array
  db.collection("users")
    .get()
    .then((user) => {
      user.forEach((doc) => {
        console.log("what");
        let assignmentsArray = doc.data().completedAssignments;
        let assignmentIndex = assignmentsArray.map(i => i.assignment_id).indexOf(assignment_id);
        console.log(assignmentIndex);
        assignmentsArray.splice(assignmentIndex, 1);
        db.collection("users").doc(doc.id).set(
          {
            completedAssignments: assignmentsArray,
          },
          { merge: true }
        );
      });
    });
}
