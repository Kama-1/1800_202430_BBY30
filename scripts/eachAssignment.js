


function displayAssignmentInfo() {

    const docRef = doc(db, "Assignments");

    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( docRef );

    db.collection( "Assignments" )
        .doc( docRef )
        .get()
        .then( doc => {
            thisAssignment = doc.data();
            title = thisAssignment.Title;
            course_tag = thisAssignment.Course_tag;
            due_date = thisAssignment.due_date;
            
            document.getElementById( "title-here" ).innerHTML = title;
            document.getElementById("due-date-here").innerHTML = due_date;
            document.getElementById("course-tag-here").innerHTML = course_tag;
        } );
}
displayAssignmentInfo();