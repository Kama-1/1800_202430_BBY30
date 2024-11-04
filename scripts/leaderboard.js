function leaderboard() {
  //Replace leaderboard template
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  //Added to clear table before printing new table
  tableTemplate.innerHTML = "";

  db.collection("users").orderBy("points", "desc").get().then((usersOrdered) => {
    usersOrdered.forEach((doc) => {
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
