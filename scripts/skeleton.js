//Loads the navbar
function loadSkeleton() {
    console.log($("#navbar").load('./skeleton/navbar.html'));
    console.log($(".assignment").load('./skeleton/assignment.html'));
    console.log($("#dropdown").load('./skeleton/dropdown.html'));
}
loadSkeleton();
