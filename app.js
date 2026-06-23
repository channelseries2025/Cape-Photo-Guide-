// ===== Recommendation engine (rule-based "AI") =====
const FREE_LIMIT = 3;
const usageKey = "ghct_usage_month";
const usageCountKey = "ghct_usage_count";

function getUsage(){
  const month = new Date().toISOString().slice(0,7);
  const storedMonth = localStorage.getItem(usageKey);
  if (storedMonth !== month){
    localStorage.setItem(usageKey, month);
    localStorage.setItem(usageCountKey, "0");
  }
  return parseInt(localStorage.getItem(usageCountKey) || "0", 10);
}
function incrementUsage(){
  const n = getUsage() + 1;
  localStorage.setItem(usageCountKey, String(n));
  return n;
}

function pick(arr, occasion, budgetShare){
  const matches = arr.filter(i => i.tags && i.tags.includes(occasion));
  const pool = matches.length ? matches : arr;
  // prefer items at or under the per-category share, fall back to cheapest
  const affordable = pool.filter(i => (i.price ?? i.minBudget ?? 0) <= budgetShare);
  const list = affordable.length ? affordable : pool.slice().sort((a,b) => (a.price ?? a.minBudget ?? 0) - (b.price ?? b.minBudget ?? 0));
  return list[Math.floor(Math.random() * list.length)];
}

function buildRecommendation(text){
  const occasion = occasionFromText(text);
  const budget = budgetFromText(text) || 3000;

  const location = pick(LOCATIONS, occasion, budget * 0.4);
  const photographer = pick(PHOTOGRAPHERS, occasion, budget * 0.45);
  const videographer = pick(VIDEOGRAPHERS, occasion, budget * 0.5);
  const restaurant = pick(RESTAURANTS, occasion, budget * 0.3);
  const decor = pick(DECOR, occasion, budget * 0.25);

  const total = (photographer?.price || 0) + (videographer?.price || 0) + (restaurant?.price || 0) + (decor?.price || 0);

  return {
    occasion,
    budget,
    location,
    photographer,
    videographer,
    restaurant,
    decor,
    total: Math.min(total, budget) || total,
    overBudget: total > budget,
  };
}

function formatRand(n){
  return "R" + Math.round(n).toLocaleString("en-ZA");
}

function renderRecommendation(rec){
  document.getElementById("r-occasion").textContent = rec.occasion.charAt(0).toUpperCase() + rec.occasion.slice(1);
  document.getElementById("r-location").textContent = rec.location.name;
  document.getElementById("r-time").textContent = "🌅 " + (rec.location.sunset ? to12h(rec.location.sunset) : "Check forecast");
  document.getElementById("r-photo").textContent = rec.photographer.name;
  document.getElementById("r-video").textContent = rec.videographer?.name || "Not needed for this budget";
  document.getElementById("r-food").textContent = rec.restaurant ? `${rec.restaurant.name} (${rec.restaurant.area})` : "—";
  document.getElementById("r-decor").textContent = rec.decor.name;
  document.getElementById("r-cost").textContent = formatRand(rec.total);

  const results = document.getElementById("results");
  results.classList.add("show");
  results.scrollIntoView({ behavior: "smooth", block: "start" });

  const note = document.getElementById("paywall-note");
  const used = getUsage();
  const left = Math.max(FREE_LIMIT - used, 0);
  if (left > 0){
    note.textContent = `${left} free recommendation${left === 1 ? "" : "s"} left this month.`;
  } else {
    note.textContent = "You've used your 3 free recommendations this month — upgrade to Premium for unlimited planning (R49–R99/mo).";
  }
}

function to12h(t){
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

// ===== UI wiring =====
const promptInput = document.getElementById("prompt-input");
const planBtn = document.getElementById("plan-btn");
const parsedBudgetEl = document.getElementById("parsed-budget");
const planCounterEl = document.getElementById("plan-counter");

function updateParsedBudget(){
  const b = budgetFromText(promptInput.value || "");
  parsedBudgetEl.textContent = b ? `Budget: ${formatRand(b)}` : "Budget: not set yet";
}
promptInput.addEventListener("input", updateParsedBudget);

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.fill;
    updateParsedBudget();
    promptInput.focus();
  });
});

function refreshCounterLabel(){
  const used = getUsage();
  const left = Math.max(FREE_LIMIT - used, 0);
  planCounterEl.textContent = left > 0
    ? `${left} free recommendation${left === 1 ? "" : "s"} left this month — Premium gets unlimited.`
    : "Free recommendations used up — Premium (R49–R99/mo) unlocks unlimited planning.";
}
refreshCounterLabel();

planBtn.addEventListener("click", () => {
  const text = promptInput.value.trim();
  if (!text){
    promptInput.focus();
    promptInput.placeholder = "Try: I have R5000 and want a surprise proposal";
    return;
  }
  const used = getUsage();
  if (used >= FREE_LIMIT){
    openModal("Upgrade to keep planning", "You've used your 3 free recommendations this month. Premium (R49–R99/mo) gives unlimited AI planning, saved shortlists and side-by-side comparisons.");
    return;
  }
  const rec = buildRecommendation(text);
  renderRecommendation(rec);
  incrementUsage();
  refreshCounterLabel();
});

document.getElementById("another-btn").addEventListener("click", () => {
  document.getElementById("plan").scrollIntoView({ behavior: "smooth" });
  promptInput.focus();
});

document.getElementById("book-btn").addEventListener("click", () => {
  openModal("Request to book", "This is a demo flow — in the live app this opens a booking request with your chosen photographer and venue, and notifies them directly.");
});

function openModal(title, body){
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").textContent = body;
  document.getElementById("modal-backdrop").classList.add("show");
}
document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("modal-backdrop").classList.remove("show");
});
document.getElementById("modal-backdrop").addEventListener("click", (e) => {
  if (e.target.id === "modal-backdrop") e.target.classList.remove("show");
});

// ===== Featured listings render =====
const listingRow = document.getElementById("listing-row");
FEATURED_LISTINGS.forEach(item => {
  const card = document.createElement("div");
  card.className = "lcard";
  card.innerHTML = `
    <div class="lc-img">${item.tag.toUpperCase()}</div>
    <div class="lc-body">
      <span class="tag">${item.tag}</span>
      <h5>${item.name}</h5>
      <p>${item.desc}</p>
      <div class="price">${item.price}</div>
    </div>`;
  listingRow.appendChild(card);
});

// ===== PWA: service worker registration =====
if ("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW registration failed", err));
  });
}
