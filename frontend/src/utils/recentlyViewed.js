const KEY = 'zc_recent';
const MAX = 8;

// Only persist the compact fields a PropertyCard needs.
const slim = (p) => ({
  _id: p._id, title: p.title, price: p.price, purpose: p.purpose, type: p.type,
  city: p.city, location: p.location, area: p.area, areaUnit: p.areaUnit,
  bedrooms: p.bedrooms, bathrooms: p.bathrooms, images: [p.images?.[0]].filter(Boolean),
});

export const getRecent = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};

export const addRecent = (property) => {
  if (!property?._id) return;
  const list = getRecent().filter((p) => p._id !== property._id);
  list.unshift(slim(property));
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
};
