// Array of top 10 users by points
const top10Array = [];
db.collection("users").orderBy("points", "desc").limit(10).get().then((user) => {
  user.forEach(doc => {
    let student = { uid: doc.id };
    top10Array.push(student);
  });
  console.log(top10Array.push());
});

// All users put into an array for finding current user's ranking
const totalArray = [];
db.collection("users").orderBy("points", "desc").get().then((user) => {
  user.forEach(doc => {
    let student = { uid: doc.id };
    totalArray.push(student);
  });
});
console.log(totalArray);

// For global leaderboard; shows up first when swapping to leaderboard tab
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
    const useruid = user.uid;
    console.log(top10Array.push());
    console.log(typeof user.uid, user.uid);
    const isUserTop10 = top10Array.some(user => user.uid === user.uid); // Looks through the array of top 10 users to see if current user is inside
    console.log(isUserTop10);

    db.collection("users").doc(useruid).get().then((doc) => {
      if (doc.exists) {
        // If the document exists, get the data
        const data = doc.data();
        console.log("User Data:", data);

        if (!isUserTop10) {
          const tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
          const row = tableTemplate.insertRow();
          row.insertCell(0).textContent = totalArray.findIndex(user => user.uid === useruid) + 1; // add one to account for index 0
          row.insertCell(1).textContent = data.name;
          row.insertCell(2).textContent = data.points;
        }
      } else {
        console.log("No such user document!");
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });

  } else {
    console.log("No user is signed in."); //No user signed in
  }
});

// For the dropdown 
function leaderboardUpdater() {
  //Change leaderboard to sort by course with drop down
  let dropdown = document.getElementById("courseNumber").id;
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  tableTemplate.innerHTML = "";

  db.collection("leaderboard").orderBy("points", "desc").get().then((users) =>
    users.forEach((doc) => {
      let data = doc.data();
      let row = tableTemplate.insertRow();
      row.insertCell(0).textContent = rank++;
      row.insertCell(1).textContent = data.name;
      row.insertCell(2).textContent = data.points;
    })
  );
}

//Reset leaderboard to all
function resetLeaderboard() {
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

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


