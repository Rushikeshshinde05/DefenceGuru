// Function to load HTML components
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error("Error loading " + file, error));
}

// Load Header and Footer
document.addEventListener("DOMContentLoaded", function () {
    loadComponent("header", "../Pages/header.html");
    loadComponent("footer", "../Pages/footer.html");
});
