/**
 * Jean Limo LLC - Pricing Configuration
 */

export type Vehicle = "sedan" | "suv" | "sprinter";
export type RateCity = "houston" | "new-york";

export const FLAT_RATES: Record<Vehicle, number[]> = {
  sedan: [110, 120, 130, 155, 165, 180, 195, 205, 220, 235],
  suv: [130, 145, 160, 180, 195, 215, 230, 255, 275, 285],
  sprinter: [250, 300, 375, 450, 500, 575, 650, 725, 800, 875],
};

export const NY_FLAT_RATES: Record<Vehicle, number[]> = {
  sedan: [135, 175, 215, 255, 295, 335, 375, 415, 455, 495],
  suv: [170, 220, 270, 320, 370, 420, 470, 520, 570, 620],
  sprinter: [260, 320, 380, 440, 500, 560, 620, 680, 740, 800],
};

export const NY_PER_MILE_OVER_100: Record<Vehicle, number> = {
  sedan: 6.5,
  suv: 7.5,
  sprinter: 9.5,
};

export const NY_HOURLY_RATES: Record<Vehicle, number> = {
  sedan: 125,
  suv: 155,
  sprinter: 225,
};

export const NY_HOURLY_MIN: Record<Vehicle, number> = {
  sedan: 3,
  suv: 3,
  sprinter: 3,
};

export const SPRINTER_TIER_ENDS: Record<number, number> = {
  20: 300, 30: 375, 40: 450, 50: 500, 60: 575, 70: 650, 80: 725, 90: 800, 100: 875,
};
export const SPRINTER_FIRST_10 = 250;
export const SPRINTER_STEP = 5;
export const PER_MILE_OVER_100: Record<Vehicle, number> = { sedan: 3.45, suv: 3.8, sprinter: 9.5 };
export const HOURLY_RATES: Record<Vehicle, number> = { sedan: 95, suv: 125, sprinter: 195 };
export const HOURLY_MIN_HOURS = 2;
export const HOURLY_INCLUDED_MILES_PER_HOUR = 20;
export const HOURLY_OVERAGE_PER_MILE = 2.5;

export function rateCityFromAddress(address: string): RateCity {
  const s = String(address || "").toLowerCase();
  if (/\b(new york|new jersey|nyc|manhattan|brooklyn|queens|bronx|staten island|newark|jersey city|hoboken|jfk|lga|ewr)\b/.test(s) || /,\s*ny\b|,\s*nj\b/.test(s)) return "new-york";
  return "houston";
}
export function cityLabel(city: RateCity) { return city === "new-york" ? "New York / New Jersey" : "Houston"; }

export function sprinterOneWay(miles: number) {
  const rounded = Math.round(miles * 100) / 100;
  if (rounded <= 10) return { price: SPRINTER_FIRST_10, breakdown: `${rounded.toFixed(1)} mi · sprinter flat $250` };
  if (rounded <= 100) {
    const milestone = Math.floor(rounded / 10) * 10;
    if (rounded === milestone && SPRINTER_TIER_ENDS[milestone]) return { price: SPRINTER_TIER_ENDS[milestone], breakdown: `${rounded.toFixed(1)} mi · sprinter tier end` };
    const anchor = milestone === rounded ? milestone - 10 : milestone;
    const anchorPrice = anchor <= 10 ? SPRINTER_FIRST_10 : SPRINTER_TIER_ENDS[anchor];
    const extra = rounded - anchor;
    const price = Math.round((anchorPrice + extra * SPRINTER_STEP) * 100) / 100;
    return { price, breakdown: `${anchor} mi base $${anchorPrice} + ${extra.toFixed(1)} mi × $${SPRINTER_STEP}` };
  }
  const base = SPRINTER_TIER_ENDS[100];
  const extraMiles = rounded - 100;
  return { price: Math.round((base + extraMiles * PER_MILE_OVER_100.sprinter) * 100) / 100, breakdown: `100 mi base $${base} + extra` };
}

export function calculateOneWay(vehicle: Vehicle, miles: number, city: RateCity = "houston") {
  if (miles <= 0) throw new Error("Invalid distance");
  if (city === "new-york") return calculateNewYork(vehicle, miles);
  if (vehicle === "sprinter") return sprinterOneWay(miles);
  if (miles <= 100) {
    const band = Math.min(Math.floor((miles - 0.0001) / 10), 9);
    return { price: FLAT_RATES[vehicle][band], breakdown: `${miles.toFixed(1)} mi · ${vehicle} flat` };
  }
  const base = FLAT_RATES[vehicle][9];
  const extraMiles = miles - 100;
  return { price: Math.round((base + extraMiles * PER_MILE_OVER_100[vehicle]) * 100) / 100, breakdown: `100 mi base $${base} + extra` };
}

export function calculateNewYork(vehicle: Vehicle, miles: number) {
  const rounded = Math.round(miles * 100) / 100;
  if (rounded <= 100) {
    const band = Math.min(Math.floor((rounded - 0.0001) / 10), 9);
    return { price: NY_FLAT_RATES[vehicle][band], breakdown: `${rounded.toFixed(1)} mi · NY ${vehicle} flat` };
  }
  const base = NY_FLAT_RATES[vehicle][9];
  const extraMiles = rounded - 100;
  return { price: Math.round((base + extraMiles * NY_PER_MILE_OVER_100[vehicle]) * 100) / 100, breakdown: `100 mi base $${base} + ${extraMiles.toFixed(1)} × $${NY_PER_MILE_OVER_100[vehicle]}` };
}

export function calculateHourly(vehicle: Vehicle, hours: number, city: RateCity = "houston") {
  if (city === "new-york") {
    const minHours = NY_HOURLY_MIN[vehicle];
    const billableHours = Math.max(hours, minHours);
    return { price: billableHours * NY_HOURLY_RATES[vehicle], breakdown: `${billableHours} hr × $${NY_HOURLY_RATES[vehicle]}/hr (${minHours}-hr min)` };
  }
  const billableHours = Math.max(hours, HOURLY_MIN_HOURS);
  return { price: billableHours * HOURLY_RATES[vehicle], breakdown: `${billableHours} hr × $${HOURLY_RATES[vehicle]}/hr` };
}
