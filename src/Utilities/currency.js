// Converts a USD price to naira (only for old static data priced in dollars)
export const usdToNairaDisplay = (usd) => {
  // ...your existing conversion code, unchanged
};

// Formats a price that is already in naira (use this for API products)
export const formatNaira = (value) =>
  `₦${Number(value).toLocaleString("en-NG")}`;