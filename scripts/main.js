/*
Displays all assignments in the firebase assignments collection.
Takes a boolean parameter displayBookmarkedAssignments that when true, will only display bookmarked assignments,
if not, only non-bookmarked assignments will be displayed.
This function will also sort by course tag if a url parameter is detected. 
If no url course tag is detected, it will display all assignments.
*/
async function displayAssignmentsDynamically(displayBookmarkedAssignments) {
    // Checks if the user is sorting courses through the dropdown
    let params = new URL(window.location.href);
    let course = params.searchParams.get("sort");

    let cardTemplate = document.getElementById("assignmentTemplate");
    await db.collection("assignments").orderBy("due_date", "asc").get()
        .then(assignment => {
            assignment.forEach(async doc => { //iterate thru each doc
                var course_tag = doc.data().course_tag;
                if (course_tag == course || !course) { // If an assignments course tag == the url parameter
                    var title = doc.data().title;
                    var points = doc.data().points;
                    points = await calculatePoints(points, title);
                    var users_completed = doc.data().users_completed;

                    var due_date = dueDateToText(doc.data().due_date);


                    let newcard = cardTemplate.content.cloneNode(true);

                    newcard.querySelector('.title-here').innerHTML = title;
                    newcard.querySelector('.points-here').innerHTML = "+" + points;
                    newcard.querySelector('.due-date-here').innerHTML = due_date;
                    newcard.querySelector('.course-tag-here').innerHTML = course_tag;
                    newcard.querySelector('.users-completed-here').innerHTML = users_completed + " completed";
                    newcard.querySelector('.checkbox').setAttribute("onchange", "is_checked('" + doc.id + "')");
                    newcard.querySelector('.bookmark').setAttribute("onchange", "is_bookmarked('" + doc.id + "')");
                    if (window.location.pathname.endsWith("assignments.html")) {
                        newcard.querySelector('.checkbox').onclick = () => updateUsersCompleted(doc.id);
                    }
                    newcard.querySelector('.assignment').setAttribute("id", doc.id);
                    newcard.querySelector('.assignment').setAttribute("class", "assignment style-" + course_tag);

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





function dueDateToText(due_date) {
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
    return "Due: " + monthString + day
}

// Updates the firebase if a user bookmarks an assignment
function is_bookmarked(assignment_id) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            let mergeArray = completedAssignments
            mergeArray[assignmentIndex].isBookmarked = !mergeArray[assignmentIndex].isBookmarked;

            db.collection("users").doc(user.uid).set({
                completedAssignments: mergeArray,
            }, { merge: true });
        });
    })
}

// Updates the user's completedAssignments and points when an assignment is check off. Also updates the particular assignment's css.
function is_checked(assignment_id) {

    firebase.auth().onAuthStateChanged(async (user) => {
        const doc = await db.collection("users").doc(user.uid).get();
        // Updates database
        const completedAssignments = doc.data().completedAssignments;
        let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
        let mergeArray = completedAssignments;
        mergeArray[assignmentIndex].isCompleted = !mergeArray[assignmentIndex].isCompleted;
        const htmlTemplate = document.getElementById(assignment_id);

        // Mark assignment
        await db.collection("users").doc(user.uid).set({
            completedAssignments: mergeArray,
        }, { merge: true });

        // Changes the style when the user checks an assignment
        if (mergeArray[assignmentIndex].isCompleted) {
            htmlTemplate.setAttribute("class", "assignment assignment-completed");
        }
        else {
            const course_tag = htmlTemplate.querySelector(".course-tag-here").innerHTML;
            htmlTemplate.setAttribute("class", "assignment style-" + course_tag);
        }

        // Calculates and adds/removes points
        const points = await getPoints(!completedAssignments[assignmentIndex].isCompleted, assignment_id, user.uid);
        await addPoints(points, user.uid, assignment_id);

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
async function calculatePoints(points, assignment_id) {
    const currentDate = new Date();
    let dueDate = null;
    return await db.collection("assignments").doc(assignment_id).get().then((doc) => {
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

// Update assignment count based on if user checked or unchecked box
async function updateUsersCompleted(assignment_id) {
    firebase.auth().onAuthStateChanged((user) => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            if (completedAssignments[assignmentIndex].isCompleted) {
                db.collection("assignments").doc(assignment_id).update({
                    users_completed: firebase.firestore.FieldValue.increment(-1)
                })
            } else {
                db.collection("assignments").doc(assignment_id).update({
                    users_completed: firebase.firestore.FieldValue.increment(1)
                })
            }
        })
    })
}

// On page load checks user's theme and displays css accordingly
function checkDarkMode() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("users").doc(user.uid).get().then((doc) => {
                const theme = doc.data().website_theme
                const websiteTheme = document.getElementById("websiteStyle")
                if (theme === "dark") {
                    websiteTheme.setAttribute('href', 'styles/dark.css');
                }
                if (theme === "light") {
                    websiteTheme.setAttribute('href', 'styles/light.css');
                }
            });
        }
    })
}

async function displayAssignments() {
    await displayAssignmentsDynamically(true); // Displays bookmarked assignments
    await displayAssignmentsDynamically(false); // Displays  non-bookmarked assignments
}

displayAssignments();
checkDarkMode();