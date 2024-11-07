// For global leaderboard; show up first when swapping to leaderboard tab
function leaderboard() {
  //Replace leaderboard template
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  //Added to clear table before printing new table
  tableTemplate.innerHTML = "";

  db.collection("users").orderBy("points", "desc").get().then((users) => {
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

// For the dropdown 
function leaderboardUpdater() {
  //Change leaderboard to sort by course with drop down
  let dropdown = document.getElementById("courseNumber").id;
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  tableTemplate.innerHTML = "";

  db.collection("leaderboard").orderBy("points", "desc").get().then((users) =>
      users.forEach((doc) => {
          var data = doc.data();
          var row = tableTemplate.insertRow();
          row.insertCell(0).textContent = rank++;
          row.insertCell(1).textContent = data.name;
          row.insertCell(2).textContent = data.points;
      })
  )
}

//Reset leaderboard to all
function resetLeaderboard() {
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  tableTemplate.innerHTML = "";

  db.collection("users").orderBy("points", "desc").get().then((users) => {
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


