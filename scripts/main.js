function displayAssignmentsDynamically(collection) {
    let cardTemplate = document.getElementById("assignmentTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    db.collection(collection).get()   //the collection called "hikes"
        .then(allHikes=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHikes.forEach(doc => { //iterate thru each doc
                var title = doc.data().title;        
                var course_tag = doc.data().course_tag;
                var users_completed = doc.data().users_completed;
                var total_users = 30; // TODO make this update to the # of authenticated users - 1 (-1 because the dev account shouldnt count)

                var due_date = doc.data().due_date;
                var date = new Date(due_date * 1000);
                var day = date.getDate();
                var month = date.getMonth(); // TODO this does not get the correct month; the switch statement is correct, but this gets the wrong month
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

displayAssignmentsDynamically("Assignments");  //input param is the name of the collection