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
    const uid = user.uid;
    console.log("User: " + uid);
    
    // All users put into an array for finding current user's ranking
    const totalArray = [];
    db.collection("users").orderBy("points", "desc").get().then((user) => {
      user.forEach(doc => {
        totalArray.push({ uid: doc.id });
      });
    });
    console.log(totalArray.findIndex(user => user.uid === uid));

    // Get top 10 users from firebase
    db.collection("users").orderBy("points", "desc").limit(10).get().then((top10) => {
      
      // Array of top 10
      const top10Array = [];
      top10.forEach(doc => {
        let student = { uid: doc.id };
        top10Array.push(student);
      });
      let isUserTop10 = top10Array.some(user => user.uid === uid);

      db.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log("User Data:", data);

          // If not top10, place at the bottom of the leaderboard
          if (!isUserTop10) {
            let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
            const row = tableTemplate.insertRow();
            row.insertCell(0).textContent = totalArray.findIndex(user => user.uid === uid) + 1; // Global rank
            row.insertCell(1).textContent = data.name;
            row.insertCell(2).textContent = data.points;
          }
        } else {
          console.log("No such user document!");
        }
      }).catch((error) => {
        console.error("Error getting document:", error);
      });

    }).catch((error) => {
      console.error("Error fetching top 10 users:", error);
    });

  } else {
    console.log("No user is signed in.");
  }
});

