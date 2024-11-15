function deleteAssignment(assignment_id) {
    console.log("test");
  // Removes assignment document from assignment collection
  db.collection("assignments")
    .doc(assignment_id)
    .delete()
    .then(() => {
      setTimeout(() => {
        location.reload();
      }, 500);
    });

  // Removes assignment from users array
//   db.collection("users")
//     .get()
//     .then((user) => {
//       user.forEach((doc) => {
//         let assignmentsArray = doc.data().completedAssignments;
//         assignmentsArray.splice(assignment_id);
//         db.collection("users").doc(doc.id).set(
//           {
//             completedAssignments: assignmentsArray,
//           },
//           { merge: true }
//         );
//       });
//     });
}
