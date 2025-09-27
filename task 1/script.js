document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const infoCard = document.getElementById('infoCard');

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        infoCard.classList.toggle('dark-mode');
    });
});

// task 2
const upcomingDiv = document.getElementById('upcomingContests');
const pastDiv = document.getElementById('pastContests');

// Helper: convert seconds to h/m/s
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h${m ? ` ${m}m` : ''}`;
}

// Helper: format timestamp to local date
function toLocalTime(ts) {
  const d = new Date(ts * 1000);
  return d.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Helper: countdown
function countdown(startTime, el) {
  function update() {
    const now = Date.now();
    let diff = Math.max(startTime * 1000 - now, 0);
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const m = Math.floor((diff % (1000*60*60)) / (1000*60));
    const s = Math.floor((diff % (1000*60)) / 1000);
    el.textContent = `${d}d ${h}h ${m}m ${s}s`;
    if (diff > 0) setTimeout(update, 1000);
  }
  update();
}

// Browser notification reminder
function setReminder(contest) {
  if (!("Notification" in window)) alert("Browser does not support notifications!");
  else if (Notification.permission === "granted") {
    scheduleNotif();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => {
      if (p === "granted") scheduleNotif();
    });
  }
  function scheduleNotif() {
    const now = Date.now();
    const delta = contest.startTimeSeconds * 1000 - now;
    if (delta < 0) return alert("Contest already started!");
    setTimeout(() => {
      new Notification(`Contest Reminder`, {
        body: `${contest.name} is starting now!`
      });
    }, delta);
    alert("Reminder set!");
  }
}

// Fetch contests
fetch("https://codeforces.com/api/contest.list")
  .then(r => r.json())
  .then(data => {
    if (!data.result) return;
    const upcoming = data.result.filter(c => c.phase === "BEFORE").slice(0, 5);
    const past = data.result.filter(c => c.phase === "FINISHED").slice(0, 5);
    // Upcoming
    upcoming.forEach(contest => {
      const div = document.createElement('div');
      div.className = 'contest';
      const start = toLocalTime(contest.startTimeSeconds);
      const duration = formatDuration(contest.durationSeconds);
      div.innerHTML = `
        <strong>${contest.name}</strong><br>
        Start: ${start}<br>
        Duration: ${duration}<br>
        Countdown: <span class="countdown"></span>
        <button class="reminder">Set Reminder</button>
      `;
      upcomingDiv.appendChild(div);
      countdown(contest.startTimeSeconds, div.querySelector('.countdown'));
      div.querySelector('.reminder').onclick = () => setReminder(contest);
    });
    // Past
    past.forEach(contest => {
      const d = toLocalTime(contest.startTimeSeconds + contest.durationSeconds);
      const div = document.createElement('div');
      div.className = 'past-contest';
      div.textContent = `${contest.name} -> Finished on ${d}`;
      pastDiv.appendChild(div);
    });
  });