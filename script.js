const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1L-CT_YkWqO3UXhFxRcniab0QBfTTQlo3RRzeQd8x6Rk/gviz/tq?tqx=out:json";

async function loadFacts() {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Google returns weird JSON wrapped in JS — we extract it
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows;

    // Convert rows into a usable object
    const facts = {};
    rows.forEach((row) => {
      const date = row.c[0]?.v;
      const title = row.c[1]?.v;
      const year = row.c[2]?.v;
      const content = row.c[3]?.v;

      if (date) {
        facts[date] = { title, year, content };
      }
    });

    displayFact(facts);
  } catch (error) {
    console.error("Error loading Google Sheet:", error);
    document.getElementById("tdic-title").textContent =
      "Unable to load today's entry.";
  }
}

function displayFact(facts) {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const key = `${mm}-${dd}`;

  const fact = facts[key];

  const titleEl = document.getElementById("tdic-title");
  const dateEl = document.getElementById("tdic-date");
  const contentEl = document.getElementById("tdic-content");

  if (fact) {
    titleEl.textContent = fact.title;
    dateEl.textContent = `${mm}/${dd}${fact.year ? " • " + fact.year : ""}`;
    contentEl.textContent = fact.content;
  } else {
    titleEl.textContent = "On this day in corruption history,";
    dateEl.textContent = `${mm}/${dd}`;
    contentEl.textContent =
      "Corruption takes a holiday!";
  }
  console.log(facts);
}

loadFacts();
