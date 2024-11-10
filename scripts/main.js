
// TODO this must reload after every db update, this must wait until updateUserAssignments() is completely done
function displayAssignmentsDynamically(collection) {
    let cardTemplate = document.getElementById("assignmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    db.collection(collection).get()   //the collection called "hikes"
        .then(assignment=> {
            assignment.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;        
                var points = doc.data().points;
                var course_tag = doc.data().course_tag;
                var users_completed = doc.data().users_completed;
                var total_users = 30; // TODO make this update to the # of authenticated users - 1 (-1 because the dev account shouldnt count)

                var due_date = doc.data().due_date; // TODO this does not get the correct date; the switch statement is correct, but this line is not
                var date = due_date.toDate();
                var day = date.getDate();
                var month = date.getMonth() + 1; 
                var monthString;
                switch(month){
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
                newcard.querySelector('.users-completed-here').innerHTML = users_completed + "/" + total_users;
                newcard.querySelector('.checkbox').setAttribute("onchange", "is_checked('" + doc.id +"')");

                var completed_assignment_style = newcard.querySelector('.assignment');
                var saved_checkmark = newcard.querySelector('.checkbox');

                // If the assignment is completed for the authenticated user
                firebase.auth().onAuthStateChanged(user => {
                    let assignment_id = doc.id;
                    let user_id = user.uid;

                    db.collection("users").doc(user_id).get().then(doc => {
                        const completedAssignments = doc.data().completedAssignments
                        for(item of completedAssignments){
                            if(item.assignment_id === assignment_id && item.isCompleted) {
                                completed_assignment_style.setAttribute("class", "assignment assignment-completed")
                                saved_checkmark.setAttribute("checked", "checked");
                            }
                        }
                    })
                });
                
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}
displayAssignmentsDynamically("assignments");


const is_checked = (assignment_id) => {

    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).get().then((doc) => {
            // Updates database
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);
            let mergeArray = completedAssignments
            mergeArray[assignmentIndex].isCompleted = !mergeArray[assignmentIndex].isCompleted;

            //Add points
            let negative = 1;
            if (!completedAssignments[assignmentIndex].isCompleted) {
                negative = -1;
            }
            let assignmentPoints = 0;
            db.collection("assignments").doc(assignment_id).get().then((doc) => {
                //TODO create points formula
                assignmentPoints = negative * doc.data().points;
                db.collection("users").doc(user.uid).set({
                    points: firebase.firestore.FieldValue.increment(assignmentPoints),
                }, { merge: true }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            })
            //Mark assignment
            db.collection("users").doc(user.uid).set({
                completedAssignments: mergeArray,
    
            }, {merge: true }).catch((error) => {
                console.log("Error getting document:", error);
            });
            //TODO find a better solution 
        }).then(() => {
            setTimeout(() => {
                location.reload();
            }, 500); 
        });
    })
}

// Returns the points value of an assignment
function getPoints(isCompleted, assignment_id, user_id) {
    //check
    if (!isCompleted) {
        return db.collection("assignments").doc(assignment_id).get().then((doc) => {
            return doc.data().points;
        });
    } 
    //uncheck
    else {
        return db.collection("users").doc(user_id).get().then((doc) => {
            //TODO returns "points" value within array
        });
    }
}

// Calculates points based on time
function calculatePoints(points, assignment_id) {
    const currentDate = new Date();
    let dueDate = null;
    return db.collection("assignments").doc("Assignment1").get().then((doc) => {
        if (doc.exists) {
            dueDate = doc.data().due_date.toDate();
        }
        const diffInDays = (currentDate - dueDate) / (1000 * 60 * 60 * 24);
        //Points calculation formula
        const multiplier = 1 + (diffInDays / 10);
        return Math.round(points * multiplier);
    });
}

// Adds/removes points to/from user accounts
function addPoints(points, user_id) {
    //Adding points
    db.collection("users").doc(user.uid).set({
        points: firebase.firestore.FieldValue.increment(points),
    }, { merge: true }).catch((error) => {
        console.log("Error getting document:", error);
    });
    //Storing added points in array
    if (points > 0) {
        db.collection("users").doc(user.uid).set({
            //TODO Store points in array
        }, { merge: true }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
}



calculatePoints(100, "asd123").then((result) => {
    console.log(result);  
  });
  


