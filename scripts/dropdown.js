function leaderboardUpdater() {
    //Change leaderboard to sort by course with drop down
    let dropdown = document.getElementById("courseNumber").id;
    let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
    let rank = 1;

    tableTemplate.innerHTML = "";

    db.collection("leaderboard").orderBy("points", "desc").get().then((usersOrdered) =>
        usersOrdered.forEach((doc) => {
            var data = doc.data();
            var row = tableTemplate.insertRow();
            row.insertCell(0).textContent = rank++;
            row.insertCell(1).textContent = data.name;
            row.insertCell(2).textContent = data.points;
        })
    )
}

function resetLeaderboard() {
    let tableTemplate = document.getElementById("leaderboard-goes-here").getElementsByTagName('tbody')[0];
    let rank = 1;

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

