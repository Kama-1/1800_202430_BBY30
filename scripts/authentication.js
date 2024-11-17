var ui = new firebaseui.auth.AuthUI(firebase.auth());


async function initializeUserAssignmentArray() {
  let assignmentArray = [];
  
  const assignmentSnapshot = await db.collection("assignments").get();
  assignmentSnapshot.forEach(doc => {
    const item = {
      assignment_id: doc.id,
      isCompleted: false,
      isBookmarked: false,
      points: 0
    };
    assignmentArray.push(item);
  });
  
  return assignmentArray;
}

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;
      if (authResult.additionalUserInfo.isNewUser) {
        initializeUserAssignmentArray().then(assignmentArray => {
          return db.collection("users").doc(user.uid).set({
            completedAssignments: assignmentArray,
            name: user.displayName,
            course_list_startup: false,
            website_theme: "light",
            points: 0
          });
        }).then(function () {
          if (user.uid === "IqWtROQdFQhB9mqCk8OIQAEWwr73") {
            window.location.assign("admin.html");
          } else {
            window.location.assign("assignments.html");
          }
        }).catch(function (error) {
          console.log("Error adding new user: " + error);
        });
        return false;
      }
      if (user.uid === "IqWtROQdFQhB9mqCk8OIQAEWwr73") {
        window.location.assign("admin.html");
        return false;
      }
      return true;
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
