
// TODO this must reload after every db update, this must wait until updateUserAssignments() is completely done
function displayAssignmentsDynamically(collection) {
    let cardTemplate = document.getElementById("assignmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    db.collection(collection).get()   //the collection called "hikes"
        .then(assignment=> {
            assignment.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;        
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
                            if(item.assignment_id == assignment_id && item.isCompelted) {
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
        const usersRef = db.collection("users").doc(user.uid);
        usersRef.get().then((doc) => {
            const completedAssignments = doc.data().completedAssignments;
            let assignmentIndex = completedAssignments.map(i => i.assignment_id).indexOf(assignment_id);

            let mergeArray = completedAssignments
            mergeArray[assignmentIndex].isCompleted = !mergeArray[assignmentIndex].isCompleted;

            usersRef.set({
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
