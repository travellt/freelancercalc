import { type TaxRegion } from './tax';

// HMRC Approved Mileage Allowance Payment (AMAP) rates 2025/26
export const MILEAGE_RATES = {
  car: { first10k: 0.45, above10k: 0.25 },
  motorcycle: { flat: 0.24 },
  bicycle: { flat: 0.20 },
} as const;

// Passenger supplement: 5p/mile per passenger (for cars)
export const PASSENGER_RATE = 0.05;

export type VehicleType = 'car' | 'motorcycle' | 'bicycle';

export interface MileageInput {
  vehicleType: VehicleType;
  annualBusinessMiles: number;
  passengers: number; // average number of business passengers
  fuelCostPerLitre: number;
  mpg: number; // miles per gallon (for actual cost comparison)
  annualInsurance: number;
  annualMaintenance: number;
  annualRoadTax: number;
  region: TaxRegion;
}

export interface MileageResult {
  // HMRC simplified method
  hmrcClaimFirst10k: number;
  hmrcClaimAbove10k: number;
  hmrcPassengerClaim: number;
  totalHmrcClaim: number;

  // Actual cost method
  fuelCost: number;
  insuranceProportion: number;
  maintenanceProportion: number;
  roadTaxProportion: number;
  totalActualCost: number;

  // Comparison
  simplifiedBetter: boolean;
  difference: number;

  // Tax savings
  taxSaving20: number; // basic rate
  taxSaving40: number; // higher rate
  niSaving: number; // Class 4 NI saving

  // Per mile breakdown
  hmrcPerMile: number;
  actualPerMile: number;

  // Monthly breakdown
  monthlyMiles: number;
  monthlyClaim: number;
}

// Assume 10,000 personal miles for proportion calculation
const ASSUMED_PERSONAL_MILES = 10_000;

export function calculateMileage(input: MileageInput): MileageResult {
  const miles = input.annualBusinessMiles;

  // HMRC simplified method
  let hmrcFirst10k = 0;
  let hmrcAbove10k = 0;
  let hmrcPassenger = 0;

  if (input.vehicleType === 'car') {
    hmrcFirst10k = Math.min(miles, 10_000) * MILEAGE_RATES.car.first10k;
    hmrcAbove10k = Math.max(0, miles - 10_000) * MILEAGE_RATES.car.above10k;
    hmrcPassenger = miles * input.passengers * PASSENGER_RATE;
  } else if (input.vehicleType === 'motorcycle') {
    hmrcFirst10k = miles * MILEAGE_RATES.motorcycle.flat;
  } else {
    hmrcFirst10k = miles * MILEAGE_RATES.bicycle.flat;
  }

  const totalHmrc = hmrcFirst10k + hmrcAbove10k + hmrcPassenger;

  // Actual cost method (only meaningful for cars)
  const litresPerGallon = 4.546;
  const milesPerLitre = input.mpg / litresPerGallon;
  const totalMiles = miles + ASSUMED_PERSONAL_MILES;
  const businessProportion = totalMiles > 0 ? miles / totalMiles : 0;

  const totalFuelCost = totalMiles > 0 ? (totalMiles / milesPerLitre) * input.fuelCostPerLitre : 0;
  const fuelBusiness = totalFuelCost * businessProportion;
  const insuranceBusiness = input.annualInsurance * businessProportion;
  const maintenanceBusiness = input.annualMaintenance * businessProportion;
  const roadTaxBusiness = input.annualRoadTax * businessProportion;

  const totalActual = fuelBusiness + insuranceBusiness + maintenanceBusiness + roadTaxBusiness;

  const simplifiedBetter = totalHmrc >= totalActual;
  const difference = Math.round(Math.abs(totalHmrc - totalActual));

  // Tax savings (on whichever method is higher)
  const bestClaim = Math.max(totalHmrc, totalActual);
  const taxSaving20 = Math.round(bestClaim * 0.20);
  const taxSaving40 = Math.round(bestClaim * 0.40);
  const niSaving = Math.round(bestClaim * 0.06); // Class 4 main rate

  return {
    hmrcClaimFirst10k: Math.round(hmrcFirst10k * 100) / 100,
    hmrcClaimAbove10k: Math.round(hmrcAbove10k * 100) / 100,
    hmrcPassengerClaim: Math.round(hmrcPassenger * 100) / 100,
    totalHmrcClaim: Math.round(totalHmrc * 100) / 100,

    fuelCost: Math.round(fuelBusiness),
    insuranceProportion: Math.round(insuranceBusiness),
    maintenanceProportion: Math.round(maintenanceBusiness),
    roadTaxProportion: Math.round(roadTaxBusiness),
    totalActualCost: Math.round(totalActual),

    simplifiedBetter,
    difference,

    taxSaving20,
    taxSaving40,
    niSaving,

    hmrcPerMile: miles > 0 ? Math.round((totalHmrc / miles) * 100) / 100 : 0,
    actualPerMile: miles > 0 ? Math.round((totalActual / miles) * 100) / 100 : 0,

    monthlyMiles: Math.round(miles / 12),
    monthlyClaim: Math.round(Math.max(totalHmrc, totalActual) / 12),
  };
}
