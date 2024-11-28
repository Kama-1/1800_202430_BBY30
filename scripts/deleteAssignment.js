// Removes assignment from assignments collection
async function deleteAssignment(assignment_id) {
    db.collection("assignments")
      .doc(assignment_id)
      .delete()
      .then(() => {
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  
    // Removes assignment from users array
    await db.collection("users")
      .get()
      .then((user) => {
        user.forEach(async (doc) => {
          let assignmentsArray = await doc.data().completedAssignments;
          let assignmentIndex = await assignmentsArray.map(i => i.assignment_id).indexOf(assignment_id);
          await assignmentsArray.splice(assignmentIndex, 1);
          await db.collection("users").doc(doc.id).set(
            {
              completedAssignments: assignmentsArray,
            },
            { merge: true }
          );
        });
      });
  }
