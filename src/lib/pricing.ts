/**
 * Jean Limo LLC - Pricing Configuration
 */

export type Vehicle = "sedan" | "suv" | "sprinter";

export const FLAT_RATES: Record<Vehicle, number[]> = {
  sedan: [110, 120, 130, 155, 165, 180, 195, 205, 220, 235],
  suv: [130, 145, 160, 180, 195, 215, 230, 255, 275, 285],
  sprinter: [250, 300, 375, 450, 500, 575, 650, 725, 800, 875],
};

/** Sprinter price charged only when the trip lands on that mile. */
export const SPRINTER_TIER_ENDS: Record<number, number> = {
  20: 300,
  30: 375,
  40: 450,
  50: 500,
  60: 575,
  70: 650,
  80: 725,
  90: 800,
  100: 875,
};

export const SPRINTER_FIRST_10 = 250;
export const SPRINTER_STEP = 5;

export const PER_MILE_OVER_100: Record<Vehicle, number> = {
  sedan: 3.45,
  suv: 3.8,
  sprinter: 9.5,
};

export const HOURLY_RATES: Record<Vehicle, number> = {
  sedan: 95,
  suv: 125,
  sprinter: 195,
};

export const HOURLY_MIN_HOURS = 2;
export const HOURLY_INCLUDED_MILES_PER_HOUR = 20;
export const HOURLY_OVERAGE_PER_MILE = 2.5;

export function sprinterOneWay(miles: number) {
  const rounded = Math.round(miles * 100) / 100;

  if (rounded <= 10) {
    return {
      price: SPRINTER_FIRST_10,
      breakdown: `${rounded.toFixed(1)} mi · sprinter flat $250 (0–10)`,
    };
  }

  if (rounded <= 100) {
    const milestone = Math.floor(rounded / 10) * 10;
    if (rounded === milestone && SPRINTER_TIER_ENDS[milestone]) {
      return {
        price: SPRINTER_TIER_ENDS[milestone],
        breakdown: `${rounded.toFixed(1)} mi · sprinter tier end $${SPRINTER_TIER_ENDS[milestone]}`,
      };
    }
    const anchor = milestone === rounded ? milestone - 10 : milestone;
    const anchorPrice = anchor <= 10 ? SPRINTER_FIRST_10 : SPRINTER_TIER_ENDS[anchor];
    const extra = rounded - anchor;
    const price = Math.round((anchorPrice + extra * SPRINTER_STEP) * 100) / 100;
    return {
      price,
      breakdown: `${anchor} mi base $${anchorPrice} + ${extra.toFixed(1)} mi × $${SPRINTER_STEP}`,
    };
  }

  const base = SPRINTER_TIER_ENDS[100];
  const extraMiles = rounded - 100;
  const price = Math.round((base + extraMiles * PER_MILE_OVER_100.sprinter) * 100) / 100;
  return {
    price,
    breakdown: `100 mi base $${base} + ${extraMiles.toFixed(1)} extra mi × $${PER_MILE_OVER_100.sprinter}/mi`,
  };
}

export function calculateOneWay(vehicle: Vehicle, miles: number) {
  if (miles <= 0) throw new Error("Invalid distance");

  if (vehicle === "sprinter") return sprinterOneWay(miles);

  if (miles <= 100) {
    const band = Math.min(Math.floor((miles - 0.0001) / 10), 9);
    const price = FLAT_RATES[vehicle][band];
    return {
      price,
      breakdown: `${miles.toFixed(1)} mi · ${vehicle} flat rate (band ${band * 10}–${(band + 1) * 10})`,
    };
  }

  const base = FLAT_RATES[vehicle][9];
  const extraMiles = miles - 100;
  const extraCost = extraMiles * PER_MILE_OVER_100[vehicle];
  const price = Math.round((base + extraCost) * 100) / 100;

  return {
    price,
    breakdown: `100 mi base $${base} + ${extraMiles.toFixed(1)} extra mi × $${PER_MILE_OVER_100[vehicle]}/mi`,
  };
}

export function calculateHourly(vehicle: Vehicle, hours: number) {
  const billableHours = Math.max(hours, HOURLY_MIN_HOURS);
  const price = billableHours * HOURLY_RATES[vehicle];
  const includedMiles = billableHours * HOURLY_INCLUDED_MILES_PER_HOUR;

  return {
    price,
    breakdown: `${billableHours} hr × $${HOURLY_RATES[vehicle]}/hr (${HOURLY_MIN_HOURS}-hr min) · includes ${includedMiles} mi`,
  };
}
