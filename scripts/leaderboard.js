// Display top 10 users by 
function leaderboard() {
  //Replace leaderboard template
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;
  //Added to clear table before printing new table
  tableTemplate.innerHTML = "";

  db.collection("users").orderBy("points", "desc").limit(10).get().then((users) => {
    users.forEach((doc) => {
      const data = doc.data();
      const row = tableTemplate.insertRow();
      row.insertCell(0).textContent = rank++;
      row.insertCell(1).textContent = data.name;
      row.insertCell(2).textContent = data.points;
    });
  }).catch((error) => {
    console.error("Error fetching leaderboard data: ", error);
  });
}
leaderboard();

// Checks if user's in top 10, or else put them at bottom
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    const userUID = user.uid;

    // All users put into an array for finding current user's ranking
    const totalArray = [];
    db.collection("users").orderBy("points", "desc").get().then((user) => {
      user.forEach(doc => {
        totalArray.push({ uid: doc.id });
      });
    });

    // Get top 10 users from firebase
    db.collection("users").orderBy("points", "desc").limit(10).get().then((top10) => {

      // Array of top 10
      const top10Array = [];
      top10.forEach(doc => {
        let student = { uid: doc.id };
        top10Array.push(student);
      });
      let isUserTop10 = top10Array.some(user => user.uid === userUID);

      db.collection("users").doc(userUID).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // If not top10, place at the bottom of the leaderboard
          if (!isUserTop10) {
            let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
            const row = tableTemplate.insertRow();
            row.insertCell(0).textContent = totalArray.findIndex(user => user.uid === userUID) + 1; // Global rank
            row.insertCell(1).textContent = data.name;
            row.insertCell(2).textContent = data.points;
          }
        } else {
          console.error("No such user document!");
        }
      }).catch((error) => {
        console.error("Error getting document:", error);
      });

    }).catch((error) => {
      console.error("Error fetching top 10 users:", error);
    });

  } else {
    console.error("No user is signed in.");
  }
});

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
checkDarkMode();