// =========================================================
// Small helper: mirror console.log into the on-page log box
// so behaviour is visible without opening DevTools.
// =========================================================
const logBox = document.getElementById("logOutput");
const originalLog = console.log;
console.log = function (...args) {
  originalLog.apply(console, args);
  if (logBox) {
    logBox.textContent += args.join(" ") + "\n";
    logBox.scrollTop = logBox.scrollHeight;
  }
};

// =========================================================
// Exercise 1: JavaScript Basics & Setup
// =========================================================
console.log("Welcome to the Community Portal");
window.addEventListener("load", () => {
  console.log("Page fully loaded.");
});

// =========================================================
// Exercise 2: Syntax, Data Types, and Operators
// =========================================================
const eventName = "Farmers Market";
const eventDate = "2026-08-01";
let seatsAvailable = 20;

console.log(`Event: ${eventName} on ${eventDate}, seats left: ${seatsAvailable}`);

function registerSeat() {
  if (seatsAvailable > 0) {
    seatsAvailable--; // decrement on registration
  }
  return seatsAvailable;
}

// =========================================================
// Exercise 3: Conditionals, Loops, and Error Handling
// =========================================================
const rawEvents = [
  { name: "Farmers Market", category: "market", date: "2026-08-01", seats: 20, isPast: false },
  { name: "Jazz Night", category: "music", date: "2026-07-01", seats: 5, isPast: true },
  { name: "Charity Fun Run", category: "sports", date: "2026-08-02", seats: 0, isPast: false },
  { name: "Movie Night", category: "music", date: "2026-08-07", seats: 12, isPast: false },
  { name: "Baking Workshop", category: "market", date: "2026-08-10", seats: 8, isPast: false }
];

function getDisplayableEvents(events) {
  const displayable = [];
  events.forEach((evt) => {
    // Only show upcoming events that still have seats
    if (!evt.isPast && evt.seats > 0) {
      displayable.push(evt);
    }
  });
  return displayable;
}

function registerUserSafely(evt) {
  try {
    if (!evt || evt.seats <= 0) {
      throw new Error(`No seats available for ${evt ? evt.name : "unknown event"}`);
    }
    evt.seats -= 1;
    return true;
  } catch (err) {
    console.log("Registration error:", err.message);
    return false;
  }
}

// =========================================================
// Exercise 4: Functions, Scope, Closures, Higher-Order Functions
// =========================================================
function addEvent(list, newEvent) {
  list.push(newEvent);
  return list;
}

function registerUser(evt) {
  return registerUserSafely(evt);
}

function filterEventsByCategory(events, category, callback) {
  const filtered = events.filter((e) => category === "all" || e.category === category);
  if (callback) callback(filtered);
  return filtered;
}

// Closure: tracks total registrations for a given category
function makeCategoryCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}
const countMusicRegistrations = makeCategoryCounter();

// =========================================================
// Exercise 5: Objects and Prototypes
// =========================================================
function Event(name, category, date, seats) {
  this.name = name;
  this.category = category;
  this.date = date;
  this.seats = seats;
}

Event.prototype.checkAvailability = function () {
  return this.seats > 0;
};

const sampleEventObj = new Event("Pottery Class", "workshop", "2026-08-15", 6);
console.log("Sample event available?", sampleEventObj.checkAvailability());
console.log("Event object entries:", JSON.stringify(Object.entries(sampleEventObj)));

// =========================================================
// Exercise 6: Arrays and Methods
// =========================================================
let allEvents = [...rawEvents]; // Exercise 10 spread operator (clone before filtering)
allEvents = addEvent(allEvents, { name: "Pottery Class", category: "workshop", date: "2026-08-15", seats: 6, isPast: false });

const musicEvents = allEvents.filter((e) => e.category === "music");
const eventCards = allEvents.map((e) => `${e.name} (${e.category})`);
console.log("Music events:", musicEvents.map((e) => e.name).join(", "));
console.log("Event cards:", eventCards.join(" | "));

// =========================================================
// Exercise 7: DOM Manipulation
// =========================================================
function renderEvents(events) {
  const container = document.querySelector("#eventList");
  container.innerHTML = "";
  events.forEach((evt) => {
    const card = document.createElement("div");
    card.className = "eventCardEl";
    card.innerHTML = `
      <strong>${evt.name}</strong> - ${evt.category} - ${evt.date} - seats left: ${evt.seats}
      <button data-name="${evt.name}" class="registerBtn">Register</button>
      <button data-name="${evt.name}" class="cancelBtn">Cancel</button>
    `;
    container.appendChild(card);
  });
}

// =========================================================
// Exercise 8: Event Handling
// =========================================================
document.querySelector("#eventList").addEventListener("click", (event) => {
  const target = event.target;
  const name = target.getAttribute("data-name");
  const evt = allEvents.find((e) => e.name === name);
  if (!evt) return;

  if (target.classList.contains("registerBtn")) {
    if (registerUser(evt)) {
      if (evt.category === "music") countMusicRegistrations();
      console.log(`Registered for ${evt.name}. Seats left: ${evt.seats}`);
      renderEvents(getDisplayableEvents(allEvents));
    } else {
      console.log(`Could not register for ${evt.name} (sold out).`);
    }
  }

  if (target.classList.contains("cancelBtn")) {
    evt.seats += 1;
    console.log(`Cancelled registration for ${evt.name}. Seats left: ${evt.seats}`);
    renderEvents(getDisplayableEvents(allEvents));
  }
});

document.querySelector("#categoryFilter").addEventListener("change", (event) => {
  const category = event.target.value;
  filterEventsByCategory(getDisplayableEvents(allEvents), category, renderEvents);
});

document.querySelector("#searchBox").addEventListener("keydown", () => {
  // Quick search by name as the user types
  setTimeout(() => {
    const query = document.querySelector("#searchBox").value.toLowerCase();
    const results = getDisplayableEvents(allEvents).filter((e) =>
      e.name.toLowerCase().includes(query)
    );
    renderEvents(results);
  }, 0);
});

// Initial render
renderEvents(getDisplayableEvents(allEvents));

// =========================================================
// Exercise 9: Async JS, Promises, Async/Await
// =========================================================
function fetchMockEventsPromise() {
  // Simulates a network call to a mock JSON endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Book Fair", category: "market" },
        { name: "Open Mic Night", category: "music" }
      ]);
    }, 800);
  });
}

async function loadEventsAsync() {
  const spinner = document.getElementById("spinner");
  const list = document.getElementById("fetchedEventsList");
  spinner.style.display = "inline";
  list.innerHTML = "";

  try {
    const data = await fetchMockEventsPromise();
    data.forEach((evt) => {
      const li = document.createElement("li");
      li.textContent = `${evt.name} (${evt.category})`;
      list.appendChild(li);
    });
    console.log("Fetched events loaded successfully.");
  } catch (err) {
    console.log("Failed to load events:", err.message);
  } finally {
    spinner.style.display = "none";
  }
}

// Also demonstrate the .then()/.catch() style requested in the exercise
function loadEventsThenStyle() {
  fetchMockEventsPromise()
    .then((data) => console.log("(.then style) Loaded", data.length, "events"))
    .catch((err) => console.log("(.catch style) Error:", err.message));
}

document.getElementById("loadEventsBtn").addEventListener("click", () => {
  loadEventsAsync();
  loadEventsThenStyle();
});

// =========================================================
// Exercise 10: Modern JavaScript Features
// =========================================================
function formatEvent({ name, category, date = "TBA" } = {}) {
  // default parameter + destructuring
  return `${name} [${category}] - ${date}`;
}
console.log(formatEvent({ name: "Trivia Night", category: "social" }));

// =========================================================
// Exercise 11: Working with Forms
// =========================================================
document.getElementById("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const name = form.elements["regName"].value.trim();
  const email = form.elements["regEmail"].value.trim();
  const selectedEvent = form.elements["regEvent"].value;
  const errorsDiv = document.getElementById("formErrors");

  errorsDiv.textContent = "";

  if (!name) {
    errorsDiv.textContent = "Name is required.";
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errorsDiv.textContent = "Please enter a valid email address.";
    return;
  }

  document.getElementById("submitStatus").textContent =
    `Thanks ${name}, you're registered for ${selectedEvent}!`;

  // Hand off to Exercise 12's simulated AJAX submission
  submitRegistration({ name, email, event: selectedEvent });
});

// =========================================================
// Exercise 12: AJAX & Fetch API
// =========================================================
function submitRegistration(payload) {
  console.log("Submitting registration payload:", JSON.stringify(payload));

  // Simulated POST to a mock API endpoint with an artificial delay
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (!response.ok) throw new Error("Server responded with an error");
      return response.json();
    })
    .then(() => {
      setTimeout(() => {
        console.log("Registration submitted successfully (simulated delay).");
      }, 500);
    })
    .catch((err) => {
      console.log("Registration submission failed:", err.message);
    });
}

// =========================================================
// Exercise 13: Debugging and Testing
// =========================================================
// To debug registration issues:
//   1. Open Chrome DevTools > Console to see the logs produced above.
//   2. Open the Network tab, filter by "Fetch/XHR", and inspect the
//      request payload sent to jsonplaceholder in submitRegistration().
//   3. Set a breakpoint on the first line of submitRegistration() in the
//      Sources tab and step through to confirm the payload is well-formed.
console.log("Debugging hooks ready: see comments above submitRegistration().");
