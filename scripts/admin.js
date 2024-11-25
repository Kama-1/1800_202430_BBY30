// Adds newly created assignments to the user's assignment array in firebase
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
      }, { merge: true })
    })
  }).then(() => {
    document.getElementById("add-assignment-confirmation").innerHTML = "Adding assignment for all users...";
    setTimeout(() => {
      location.href = 'admin.html';
    }, 2000);
  })

}

// Creates a firebase new assignment with the given values
async function addAssignment() {

  let usersCompleted = 0;
  try {
    const doc = await db.collection("assignments").doc(document.getElementById("editTitle").value).get()
    usersCompleted = doc.data().users_completed;
  } catch (error) {
    console.error("Document not found", error);
  }

  const newTitle = document.getElementById("editTitle").value;
  const newTag = document.getElementById("editCourseTag").value;
  const newPoints = document.getElementById("editPoints").value;
  const newDescription = document.getElementById("editDescription").value;
  const newDueDate = firebase.firestore.Timestamp.fromDate(new Date(document.getElementById("editDueDate").value));
  await db.collection("assignments").doc(newTitle).set({
    title: newTitle,
    course_tag: newTag,
    points: newPoints,
    description: newDescription,
    due_date: newDueDate,
    users_completed: usersCompleted,
  }, { merge: true })
    .then(() => {
      addAssignmentToUserArray(newTitle);
    })
}

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

// Fills page with current assignment info when user updates assignment
async function fillUpdateInfo(assignment_id) {
  await db.collection("assignments").doc(assignment_id).get().then((doc) => {
    localStorage.setItem("editTitle", doc.data().title);
    localStorage.setItem("editCourseTag", doc.data().course_tag);
    localStorage.setItem("editPoints", doc.data().points);
    localStorage.setItem("editDescription", doc.data().description);
    localStorage.setItem("editDueDate", doc.data().due_date.toDate().toISOString().split("T")[0]);
    location.href = 'addAssignment.html';
  }).catch((error) => {
    console.error("Document not found", error);
  });
}

// Fills addAssignment.html with old assignment details when editting
function fillPage() {
  if (editTitle) document.getElementById("editTitle").value = localStorage.getItem("editTitle");
  if (editCourseTag) document.getElementById("editCourseTag").value = localStorage.getItem("editCourseTag");
  if (editPoints) document.getElementById("editPoints").value = localStorage.getItem("editPoints");
  if (editDescription) document.getElementById("editDescription").value = localStorage.getItem("editDescription");
  if (editDueDate) document.getElementById("editDueDate").value = localStorage.getItem("editDueDate");

  if (localStorage.getItem("editTitle") !== null) document.getElementById("editTitle").disabled = true;

  localStorage.removeItem("editTitle");
  localStorage.removeItem("editCourseTag");
  localStorage.removeItem("editPoints");
  localStorage.removeItem("editDescription");
  localStorage.removeItem("editDueDate");
}
