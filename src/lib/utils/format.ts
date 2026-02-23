// Always format numbers with commas regardless of locale
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (value: number): string => {
  return `${value}%`;
};
