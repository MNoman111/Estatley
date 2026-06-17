// Format PKR price into Pakistani-style Crore / Lakh / Thousand
export const formatPrice = (price) => {
  if (price == null) return '';
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `PKR ${Number.isInteger(cr) ? cr : cr.toFixed(2)} Crore`;
  }
  if (price >= 100000) {
    const lac = price / 100000;
    return `PKR ${Number.isInteger(lac) ? lac : lac.toFixed(2)} Lakh`;
  }
  if (price >= 1000) return `PKR ${(price / 1000).toFixed(0)} Thousand`;
  return `PKR ${price}`;
};

export const formatArea = (area, unit) => `${area} ${unit}`;

export const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];
export const types = ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Plot', 'Shop', 'Office', 'Building'];
