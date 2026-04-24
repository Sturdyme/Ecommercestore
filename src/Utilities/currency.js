// src/Utilities/currency.js
// Utility to convert USD to NGN and format prices

const USD_TO_NGN = 1500; // Example rate, update as needed

export function convertToNaira(usd) {
  return usd * USD_TO_NGN;
}

export function formatNaira(amount) {
  return `₦${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function usdToNairaDisplay(usd) {
  const naira = convertToNaira(usd);
  return formatNaira(naira);
}
