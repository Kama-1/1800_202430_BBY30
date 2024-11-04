function updateUserAssignments() {
    firebase.auth().onAuthStateChanged(user => {
        let user_id = user.uid;
        db.collection("assignments").get().then(assignment => {
            assignment.forEach(doc => {
                
                let currentAssignment = db.collection("users").doc(user_id).collection("completed_assignments");
                currentAssignment.doc(doc.id).get().then((completedAssignment) => {
                    if(!completedAssignment.exists) {
                        console.log("Set");
                        currentAssignment.get().then(completedAssignment => {
                            db.collection("users").doc(user_id).collection("completed_assignments").doc(doc.id).set({
                                is_completed: false,
                            });
                        })
                    }
                });

            });
        });
    });
}
updateUserAssignments();

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

    
                // Convert Firestore Timestamp to JavaScript Date
                var date = doc.data().due_date.toDate(); // Converts to a Date object

                var day = date.getDate()+1;
                var month = date.getMonth()+1; 
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
                    assignment_id = doc.id;
                    db.collection("users").doc(user.uid).collection("completed_assignments").doc(assignment_id).get().then((completed_assignment) => {
                        const completed_state = completed_assignment.data().is_completed;
                        if(completed_state){
                            completed_assignment_style.setAttribute("class", "assignment assignment-completed")
                            saved_checkmark.setAttribute("checked", "checked");
                        }
                    });
                });
                

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayAssignmentsDynamically("assignments");  //input param is the name of the collection
