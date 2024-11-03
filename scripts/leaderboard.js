function leaderboard() {
  //Replace leaderboard template
  let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
  let rank = 1;

  db.collection("users").orderBy("points", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
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
