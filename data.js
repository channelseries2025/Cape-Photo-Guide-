// Mock data for the Cape Town Photo Experience Guide
// In production this would come from a real database / CMS.

const LOCATIONS = [
  { name: "Maiden's Cove", tags: ["proposal","couple","romantic","sunset"], vibe: "Rock pools and an open sea view, quiet enough for a private moment.", minBudget: 1500, sunset: "18:02" },
  { name: "Camps Bay Promenade", tags: ["proposal","couple","romantic","picnic"], vibe: "Twelve Apostles backdrop with palm-lined walkway energy.", minBudget: 2000, sunset: "18:04" },
  { name: "Signal Hill", tags: ["proposal","couple","hidden gem","sunset"], vibe: "360° city and harbour views, fewer crowds than Lion's Head.", minBudget: 1200, sunset: "18:00" },
  { name: "Kirstenbosch Gardens", tags: ["picnic","couple","matric","wedding"], vibe: "Manicured lawns and mountain backdrop, ideal soft daylight.", minBudget: 1000, sunset: "17:55" },
  { name: "Bo-Kaap", tags: ["matric","hidden gem","couple"], vibe: "Colourful streets, strong graphic backdrops for portraits.", minBudget: 800, sunset: "17:58" },
  { name: "Boulders Beach", tags: ["couple","matric","hidden gem"], vibe: "Penguins and white granite boulders, golden morning light works best.", minBudget: 1500, sunset: "18:10" },
  { name: "Oudekraal", tags: ["proposal","hidden gem","romantic"], vibe: "Driftwood beach, far quieter than Camps Bay, dramatic rock formations.", minBudget: 1300, sunset: "18:03" },
  { name: "Constantia Wine Estate", tags: ["wedding","romantic","couple"], vibe: "Vineyard rows and oak avenues, classic wedding-venue feel.", minBudget: 8000, sunset: "17:57" },
];

const PHOTOGRAPHERS = [
  { name: "Simbachips Photography", style: "Documentary & golden hour", price: 1800, tags: ["proposal","couple","romantic"] },
  { name: "Lens & Lighthouse Studio", style: "Editorial portrait", price: 1500, tags: ["matric","couple"] },
  { name: "Cape Frame Collective", style: "Candid lifestyle", price: 2200, tags: ["wedding","couple","proposal"] },
  { name: "Atlantic Light Photo", style: "Minimal, light-led", price: 1200, tags: ["picnic","hidden gem","couple"] },
];

const VIDEOGRAPHERS = [
  { name: "Sundown Films CT", price: 2500, tags: ["proposal","wedding"] },
  { name: "Reel Cape Stories", price: 1800, tags: ["couple","matric"] },
  { name: null, price: 0, tags: ["picnic"] }, // not always needed
];

const RESTAURANTS = [
  { name: "The Pot Luck Club", area: "Woodstock", price: 600, tags: ["romantic","couple","proposal"] },
  { name: "Tintswalo Atlantic", area: "Hout Bay", price: 1200, tags: ["proposal","romantic","wedding"] },
  { name: "La Colombe", area: "Constantia", price: 1500, tags: ["wedding","romantic"] },
  { name: "Knead Bakery", area: "Camps Bay", price: 350, tags: ["picnic","matric","couple"] },
  { name: "Codfather", area: "Camps Bay", price: 700, tags: ["couple","romantic"] },
];

const DECOR = [
  { name: "Picnic setup (rugs, cushions, florals)", price: 800, tags: ["proposal","picnic","couple"] },
  { name: "Balloon arch + signage", price: 650, tags: ["matric","picnic"] },
  { name: "Rose petal trail + candles", price: 950, tags: ["proposal","romantic"] },
  { name: "Full floral arch + drapery", price: 4500, tags: ["wedding"] },
  { name: "Minimal — just the view", price: 0, tags: ["hidden gem","couple"] },
];

// Featured vendor cards shown in the "Featured this month" strip
const FEATURED_LISTINGS = [
  { name: "Simbachips Photography", tag: "Photographer", desc: "Golden hour specialist, 40+ proposals shot around the peninsula.", price: "From R1,800" },
  { name: "Tintswalo Atlantic", tag: "Restaurant", desc: "Cliffside dining in Hout Bay, private proposal tables on request.", price: "From R1,200/pp" },
  { name: "Sundown Films CT", tag: "Videographer", desc: "Same-day edits for proposals and matric groups.", price: "From R2,500" },
  { name: "Bloom & Co. Florists", tag: "Decor", desc: "Petal trails, arches and picnic styling delivered on-site.", price: "From R650" },
  { name: "Cape Cruiser Rentals", tag: "Car rental", desc: "Classic convertibles for wedding-day arrivals.", price: "From R1,500/day" },
];

function occasionFromText(text){
  const t = text.toLowerCase();
  if (/propos/.test(t)) return "proposal";
  if (/matric/.test(t)) return "matric";
  if (/wedding/.test(t)) return "wedding";
  if (/picnic/.test(t)) return "picnic";
  if (/anniversary|romantic|date night|dinner/.test(t)) return "romantic";
  if (/hidden gem/.test(t)) return "hidden gem";
  return "couple";
}

function budgetFromText(text){
  const match = text.replace(/,/g,"").match(/r?\s?(\d{3,6})/i);
  return match ? parseInt(match[1], 10) : null;
}
