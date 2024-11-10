var ui = new firebaseui.auth.AuthUI(firebase.auth());


function initializeUserAssignmentArray() {
  let assignmentArray = new Array;
  db.collection("assignments").get().then(assignment => {
    assignment.forEach(doc => {
      const item = {
        assignment_id: doc.id,
        isCompleted: false,
        isBookmarked: false
      }
      assignmentArray.push(item);
      
    })
  })
  return assignmentArray;
}
const assignmentArray = initializeUserAssignmentArray(); // This only works half of the time because of firebase permission problems

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;
      if (authResult.additionalUserInfo.isNewUser) {
        db.collection("users").doc(user.uid).set({
          //User information to be saved
          completedAssignments: assignmentArray,
          name: user.displayName,
          course_list_startup: false,
          website_theme: "light",
          points: 0,
        }).then(function () {
          window.location.assign("assignments.html");
        }).catch(function (error) {
          console.log("Error adding new user: " + error);
        });
      } else {
        return true;
      }
      return false;
    },
    uiShown: function () {
      document.getElementById('loader').style.display = 'none';
    }
  },
  signInFlow: 'popup',
  signInSuccessUrl: "assignments.html",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],

  // tosUrl: '<your-tos-url>',
  // privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', uiConfig);