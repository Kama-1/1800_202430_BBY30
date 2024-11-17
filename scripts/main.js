
function displayAssignmentsDynamically(displayBookmarkedAssignments) {
    // Checks if the user is sorting courses through the dropdown
    let params = new URL(window.location.href);
    let course = params.searchParams.get("sort");

    let cardTemplate = document.getElementById("assignmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    db.collection("assignments").get()
        .then(assignment => {
            assignment.forEach(doc => { //iterate thru each doc
                var course_tag = doc.data().course_tag;
                if (course_tag == course || !course) {
                    var title = doc.data().title;
                    var points = doc.data().points;
                    var users_completed = doc.data().users_completed;
                    var total_users = 30; // TODO make this update to the # of authenticated users - 1 (-1 because the dev account shouldnt count)

                    var due_date = doc.data().due_date; // TODO this does not get the correct date; the switch statement is correct, but this line is not
                    var date = due_date.toDate();
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var monthString;
                    switch (month) {
                        case 1:
                            monthString = "Jan. ";
                            break;
                        case 2:
                            monthString = "Feb. ";
                            break;
                        case 3:
                            monthString = "Mar. ";
                            break;
                        case 4:
                            monthString = "Apr. ";
                            break;
                        case 5:
                            monthString = "May. ";
                            break;
                        case 6:
                            monthString = "Jun. ";
                            break;
                        case 7:
                            monthString = "Jul. ";
                            break;
                        case 8:
                            monthString = "Aug. ";
                            break;
                        case 9:
                            monthString = "Sep. ";
                            break;
                        case 10:
                            monthString = "Oct. ";
                            break;
                        case 11:
                            monthString = "Nov. ";
                            break;
                        case 12:
                            monthString = "Dec. ";
                            break;
                        default:
                            monthString = "null ";
                    }
                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    //update title and text and image
                    newcard.querySelector('.title-here').innerHTML = title;
                    newcard.querySelector('.points-here').innerHTML = "+" + points;
                    newcard.querySelector('.due-date-here').innerHTML = "Due: " + monthString + day;
                    newcard.querySelector('.course-tag-here').innerHTML = course_tag;
                    newcard.querySelector('.users-completed-here').innerHTML = users_completed + " completed"; //+ "/" + total_users; 
                    newcard.querySelector('.checkbox').setAttribute("onchange", "is_checked('" + doc.id + "')");
                    newcard.querySelector('.bookmark').setAttribute("onchange", "is_bookmarked('" + doc.id + "')");

                    var completed_assignment_style = newcard.querySelector('.assignment');
                    var saved_checkmark = newcard.querySelector('.checkbox');
                    var saved_bookmark = newcard.querySelector('.bookmark');

                    // If the assignment is completed or is bookmarked for the authenticated user
                    firebase.auth().onAuthStateChanged(user => {
                        if (user) {
                            const assignment_id = doc.id;
                            const user_id = user.uid;

                            db.collection("users").doc(user_id).get().then(doc => {
                                const completedAssignments = doc.data().completedAssignments;
                                for (item of completedAssignments) {
                                    if (item.assignment_id === assignment_id && item.isCompleted) {
                                        completed_assignment_style.setAttribute("class", "assignment assignment-completed")
                                        saved_checkmark.setAttribute("checked", "checked");
                                    }
                                    if (displayBookmarkedAssignments) { // Only display completed assignments
                                        if (item.assignment_id === assignment_id && item.isBookmarked) {
                                            saved_bookmark.setAttribute("checked", "checked");
                                            document.getElementById("assignments-go-here").appendChild(newcard);
                                        }
                                    } else { // Only display incompleted assignments
                                        if (item.assignment_id === assignment_id && !item.isBookmarked) {
                                            document.getElementById("assignments-go-here").appendChild(newcard);
                                        }
                                    }

                                }
                            })
                        }

                    });
                }
            })
        })
}

displayAssignmentsDynamically(true); // Displays bookmarked assignments
displayAssignmentsDynamically(false); // Displays  non-bookmarked assignments

const is_bookmarked = (assignment_id) => {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            let mergeArray = completedAssignments
            mergeArray[assignmentIndex].isBookmarked = !mergeArray[assignmentIndex].isBookmarked;

            db.collection("users").doc(user.uid).set({
                completedAssignments: mergeArray,
            }, { merge: true });
            //Adjust if needed
        }).then(() => {
            setTimeout(() => {
                location.reload();
            }, 500);
        });
    })
}

const is_checked = (assignment_id) => {

    firebase.auth().onAuthStateChanged(async (user) => {
        const doc = await db.collection("users").doc(user.uid).get();
        // Updates database
        const completedAssignments = doc.data().completedAssignments;
        let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
        let mergeArray = completedAssignments;
        mergeArray[assignmentIndex].isCompleted = !mergeArray[assignmentIndex].isCompleted;

        // Calculates and adds/removes points
        const points = await getPoints(!completedAssignments[assignmentIndex].isCompleted, assignment_id, user.uid);
        await addPoints(points, user.uid, assignment_id);

        // Mark assignment
        await db.collection("users").doc(user.uid).set({
            completedAssignments: mergeArray,
        }, { merge: true });
        location.reload();
    });
};


// Returns the points value of an assignment
function getPoints(isCompleted, assignment_id, user_id) {
    //check
    if (!isCompleted) {
        return db.collection("assignments").doc(assignment_id).get().then((doc) => {
            const points = doc.data().points;
            return calculatePoints(points, assignment_id);
        });
    }
    //uncheck
    else {
        return db.collection("users").doc(user_id).get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            let tempArray = completedAssignments;
            return -1 * tempArray[assignmentIndex].points;
        });
    }
}

// Calculates points based on time
function calculatePoints(points, assignment_id) {
    const currentDate = new Date();
    let dueDate = null;
    return db.collection("assignments").doc(assignment_id).get().then((doc) => {
        if (doc.exists) {
            dueDate = doc.data().due_date.toDate();
        }
        const diffInDays = (dueDate - currentDate) / (1000 * 60 * 60 * 24);
        //Points calculation formula
        const multiplier = 1 + (diffInDays / 10);
        return Math.round(points * multiplier);
    });
}

// Adds/removes points to/from user accounts
function addPoints(assignmentPoints, user_id, assignment_id) {
    // Adding points
    db.collection("users").doc(user_id).set({
        points: firebase.firestore.FieldValue.increment(assignmentPoints),
    }, { merge: true }).catch((error) => {
        console.log("Error getting document:", error);
    });

    // Stores added points in array
    if (assignmentPoints > 0) {
        db.collection("users").doc(user_id).get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            completedAssignments[assignmentIndex].points = assignmentPoints;
            return db.collection("users").doc(user_id).update({
                completedAssignments: completedAssignments
            }).catch((error) => {
                console.error("Error getting document:", error);
            });
        });
    }
}