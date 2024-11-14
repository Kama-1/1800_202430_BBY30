// Loads all html skeletons
function loadSkeleton() {
    console.log($("#navbar").load('./skeleton/navbar.html'));
    console.log($("#dropdown").load('./skeleton/dropdown.html'));
}
loadSkeleton();
