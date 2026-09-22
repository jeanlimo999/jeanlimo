/**
 * Jean Limo LLC - Pricing Configuration
 */

export type Vehicle = "sedan" | "suv" | "sprinter";

export const FLAT_RATES: Record<Vehicle, number[]> = {
  sedan: [110, 120, 130, 155, 165, 180, 195, 205, 220, 235],
  suv: [130, 145, 160, 180, 195, 215, 230, 255, 275, 285],
  sprinter: [300, 340, 380, 420, 460, 500, 540, 580, 620, 660],
};

export const PER_MILE_OVER_100: Record<Vehicle, number> = {
  sedan: 2.5,
  suv: 3.2,
  sprinter: 7.5,
};

export const HOURLY_RATES: Record<Vehicle, number> = {
  sedan: 95,
  suv: 125,
  sprinter: 195,
};

export const HOURLY_MIN_HOURS = 2;
export const HOURLY_INCLUDED_MILES_PER_HOUR = 20;
export const HOURLY_OVERAGE_PER_MILE = 2.5;

export function calculateOneWay(vehicle: Vehicle, miles: number) {
  if (miles <= 0) throw new Error("Invalid distance");

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
    breakdown: `100 mi base $${base} + ${extraMiles.toFixed(1)} mi × $${PER_MILE_OVER_100[vehicle]}/mi`,
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
