document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const infoCard = document.getElementById('infoCard');

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        infoCard.classList.toggle('dark-mode');
    });
});