import User from '../models/User.js';
import Property from '../models/Property.js';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// Curated Unsplash real-estate photo IDs (royalty-free)
const PHOTOS = {
  house1: ['1568605114967-8130f3a36994', '1570129477492-45c003edd2be', '1576941089067-2de3c901e126'],
  house2: ['1583608205776-bfd35f0d9f83', '1564013799919-ab600027ffc6', '1605276374104-dee2a0ed3cd6'],
  flat1: ['1502672260266-1c1ef2d93688', '1493809842364-78817add7ffb', '1556909114-f6e7ad7d3136'],
  flat2: ['1522708323590-d24dbb6b0267', '1567767292278-a4f21aa2d36e', '1484154218962-a197022b5858'],
  villa: ['1613490493576-7fde63acd811', '1613977257363-707ba9348227', '1600596542815-ffad4c1539a9'],
  plot: ['1500382017468-9049fed747ef', '1560518883-ce09059eeffa', '1416331108676-a22ccb276e35'],
  shop: ['1441986300917-64674bd600d8', '1604719312566-8912e9227c6a', '1567958451986-2de427a4a0be'],
  office: ['1497366216548-37526070297c', '1497366811353-6870744d04b2', '1524758631624-e2822e304c36'],
};

const agentsData = [
  { name: 'Imran Khan', email: 'imran@nestaro.pk', phone: '+92 300 1234567', agency: 'Premier Estates', about: 'Specialist in DHA & Bahria Town properties with 12 years of experience.' },
  { name: 'Ayesha Malik', email: 'ayesha@nestaro.pk', phone: '+92 321 7654321', agency: 'CityScape Realty', about: 'Helping families find their dream homes across Lahore and Islamabad.' },
  { name: 'Bilal Ahmed', email: 'bilal@nestaro.pk', phone: '+92 333 9988776', agency: 'Skyline Properties', about: 'Commercial & residential investment advisor in Karachi.' },
];

const userData = { name: 'Ali Hassan', email: 'user@nestaro.pk', phone: '+92 312 0000000', role: 'user' };

const buildProperties = (agents) => {
  const [a0, a1, a2] = agents;
  return [
    { title: '10 Marla Modern House in DHA Phase 6', purpose: 'sale', type: 'House', price: 42500000, city: 'Lahore', location: 'DHA Phase 6', address: 'Block C, DHA Phase 6, Lahore', area: 10, areaUnit: 'Marla', bedrooms: 5, bathrooms: 6, featured: true, description: 'A beautifully designed double-storey house featuring a modern facade, spacious lounge, fitted kitchen, and a landscaped lawn. Located in a prime, secure neighbourhood with all amenities nearby.', amenities: ['Parking', 'Backup Generator', 'Lawn', 'Servant Quarters', 'Security'], images: PHOTOS.house1.map(img), agent: a0._id, coordinates: { lat: 31.4697, lng: 74.4111 } },
    { title: '1 Kanal Luxury Villa in Bahria Town', purpose: 'sale', type: 'House', price: 78000000, city: 'Lahore', location: 'Bahria Town', address: 'Sector B, Bahria Town, Lahore', area: 1, areaUnit: 'Kanal', bedrooms: 6, bathrooms: 7, featured: true, description: 'Stunning 1 Kanal villa with imported fittings, a home theatre, swimming pool and a double-height drawing room. Move-in ready with premium interior finishing throughout.', amenities: ['Swimming Pool', 'Home Theatre', 'Parking', 'Backup Generator', 'Lawn', 'Security'], images: PHOTOS.villa.map(img), agent: a1._id, coordinates: { lat: 31.3683, lng: 74.1810 } },
    { title: '2 Bed Apartment for Rent in Gulberg', purpose: 'rent', type: 'Flat', price: 95000, city: 'Lahore', location: 'Gulberg III', address: 'MM Alam Road, Gulberg III, Lahore', area: 1100, areaUnit: 'Sq. Ft.', bedrooms: 2, bathrooms: 2, description: 'Bright and airy 2-bedroom apartment in a well-maintained building, walking distance from cafes and shopping. Includes covered parking and 24/7 security.', amenities: ['Lift', 'Parking', 'Security', 'Backup Generator'], images: PHOTOS.flat1.map(img), agent: a0._id, coordinates: { lat: 31.5204, lng: 74.3587 } },
    { title: '5 Marla House in Johar Town', purpose: 'sale', type: 'House', price: 23500000, city: 'Lahore', location: 'Johar Town', address: 'Block G1, Johar Town, Lahore', area: 5, areaUnit: 'Marla', bedrooms: 3, bathrooms: 4, description: 'Well-built 5 Marla house ideal for a small family. Features a tiled flooring, modern kitchen and a rooftop terrace. Close to Emporium Mall and Expo Centre.', amenities: ['Parking', 'Rooftop Terrace', 'Security'], images: PHOTOS.house2.map(img), agent: a1._id, coordinates: { lat: 31.4625, lng: 74.2728 } },
    { title: '1 Kanal Plot in DHA Phase 8', purpose: 'sale', type: 'Plot', price: 95000000, city: 'Lahore', location: 'DHA Phase 8', address: 'Block R, DHA Phase 8, Lahore', area: 1, areaUnit: 'Kanal', bedrooms: 0, bathrooms: 0, description: 'Prime residential plot on a 60-ft road, possession utility paid. Excellent investment opportunity in a fast-developing sector of DHA.', amenities: ['Corner Plot', 'Possession', 'Park Facing'], images: PHOTOS.plot.map(img), agent: a2._id, coordinates: { lat: 31.4895, lng: 74.4520 } },
    { title: '3 Bed Luxury Apartment in Clifton', purpose: 'sale', type: 'Flat', price: 65000000, city: 'Karachi', location: 'Clifton Block 2', address: 'Clifton Block 2, Karachi', area: 2200, areaUnit: 'Sq. Ft.', bedrooms: 3, bathrooms: 4, featured: true, description: 'Sea-facing luxury apartment with floor-to-ceiling windows, a private elevator lobby and access to a rooftop pool and gym. Premium living in the heart of Clifton.', amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Lift', 'Parking', 'Security'], images: PHOTOS.flat2.map(img), agent: a2._id, coordinates: { lat: 24.8138, lng: 67.0299 } },
    { title: '500 Sq. Yd. Bungalow in DHA Karachi', purpose: 'sale', type: 'House', price: 120000000, city: 'Karachi', location: 'DHA Phase 5', address: 'Khayaban-e-Shahbaz, DHA Phase 5, Karachi', area: 500, areaUnit: 'Sq. Yd.', bedrooms: 5, bathrooms: 6, description: 'Elegant bungalow with a contemporary design, spacious bedrooms with attached baths, drawing and dining halls, and a beautiful front lawn in a peaceful locality.', amenities: ['Lawn', 'Parking', 'Backup Generator', 'Servant Quarters', 'Security'], images: PHOTOS.house1.map(img), agent: a2._id, coordinates: { lat: 24.8008, lng: 67.0599 } },
    { title: '2 Bed Flat for Rent in Bahria Town Karachi', purpose: 'rent', type: 'Flat', price: 60000, city: 'Karachi', location: 'Bahria Town Karachi', address: 'Precinct 19, Bahria Town, Karachi', area: 950, areaUnit: 'Sq. Ft.', bedrooms: 2, bathrooms: 2, description: 'Affordable and modern 2-bed apartment in a gated community offering parks, mosque and shopping facilities. Ideal for small families.', amenities: ['Lift', 'Parking', 'Security', 'Gym'], images: PHOTOS.flat1.map(img), agent: a1._id, coordinates: { lat: 25.0010, lng: 67.3070 } },
    { title: '10 Marla House in Bahria Town Rawalpindi', purpose: 'sale', type: 'House', price: 38000000, city: 'Rawalpindi', location: 'Bahria Town Phase 4', address: 'Phase 4, Bahria Town, Rawalpindi', area: 10, areaUnit: 'Marla', bedrooms: 4, bathrooms: 5, description: 'Brand new 10 Marla house with stylish elevation, spacious rooms, modern kitchen and a car porch. Located in a well-developed phase with parks nearby.', amenities: ['Parking', 'Lawn', 'Backup Generator', 'Security'], images: PHOTOS.house2.map(img), agent: a0._id, coordinates: { lat: 33.5293, lng: 73.0931 } },
    { title: '1 Kanal House in F-7 Islamabad', purpose: 'sale', type: 'House', price: 250000000, city: 'Islamabad', location: 'F-7', address: 'Street 12, F-7, Islamabad', area: 1, areaUnit: 'Kanal', bedrooms: 6, bathrooms: 7, featured: true, description: 'Prestigious 1 Kanal residence in the most sought-after sector of Islamabad. Marble flooring, imported kitchen, basement and lush green lawn against the Margalla Hills.', amenities: ['Lawn', 'Basement', 'Parking', 'Backup Generator', 'Servant Quarters', 'Security'], images: PHOTOS.villa.map(img), agent: a1._id, coordinates: { lat: 33.7180, lng: 73.0560 } },
    { title: '2 Bed Apartment in E-11 Islamabad', purpose: 'rent', type: 'Flat', price: 110000, city: 'Islamabad', location: 'E-11', address: 'Multi Gardens, E-11, Islamabad', area: 1250, areaUnit: 'Sq. Ft.', bedrooms: 2, bathrooms: 2, description: 'Fully furnished 2-bed apartment with a beautiful view, modern interior, and access to a community gym and rooftop. Prime location with easy access to motorway.', amenities: ['Furnished', 'Lift', 'Gym', 'Parking', 'Security'], images: PHOTOS.flat2.map(img), agent: a0._id, coordinates: { lat: 33.7000, lng: 72.9700 } },
    { title: '8 Marla Lower Portion in PWD', purpose: 'rent', type: 'Lower Portion', price: 70000, city: 'Islamabad', location: 'PWD Housing Scheme', address: 'Block C, PWD, Islamabad', area: 8, areaUnit: 'Marla', bedrooms: 3, bathrooms: 3, description: 'Spacious lower portion with separate entrance, three bedrooms, drawing room and a small lawn. Suitable for a family looking for a peaceful neighbourhood.', amenities: ['Separate Entrance', 'Lawn', 'Parking'], images: PHOTOS.house1.map(img), agent: a2._id, coordinates: { lat: 33.5651, lng: 73.1500 } },
    { title: 'Commercial Shop in Emporium Mall', purpose: 'sale', type: 'Shop', price: 18500000, city: 'Lahore', location: 'Johar Town', address: 'Emporium Mall, Johar Town, Lahore', area: 350, areaUnit: 'Sq. Ft.', bedrooms: 0, bathrooms: 1, description: 'Ground floor commercial shop in one of the busiest malls of Lahore. High footfall, ideal for retail or food business. Rental income guaranteed.', amenities: ['Mall Location', 'Central AC', 'Lift', 'Security', 'Parking'], images: PHOTOS.shop.map(img), agent: a0._id, coordinates: { lat: 31.4684, lng: 74.2660 } },
    { title: 'Office Space for Rent in Blue Area', purpose: 'rent', type: 'Office', price: 350000, city: 'Islamabad', location: 'Blue Area', address: 'Jinnah Avenue, Blue Area, Islamabad', area: 2000, areaUnit: 'Sq. Ft.', bedrooms: 0, bathrooms: 2, description: 'Premium grade-A office space on a high floor with panoramic city views, central air conditioning, dedicated parking and 24/7 building management.', amenities: ['Central AC', 'Lift', 'Parking', 'Backup Generator', 'Security'], images: PHOTOS.office.map(img), agent: a1._id, coordinates: { lat: 33.7106, lng: 73.0551 } },
    { title: '5 Marla House in Wapda Town', purpose: 'sale', type: 'House', price: 27500000, city: 'Lahore', location: 'Wapda Town', address: 'Block J2, Wapda Town, Lahore', area: 5, areaUnit: 'Marla', bedrooms: 3, bathrooms: 3, description: 'Neat and clean 5 Marla house with good ventilation, three bedrooms, a lounge and a small backyard. Move-in condition in a family-friendly area.', amenities: ['Parking', 'Backyard', 'Security'], images: PHOTOS.house2.map(img), agent: a1._id, coordinates: { lat: 31.4187, lng: 74.2390 } },
    { title: '4 Kanal Farm House in Bedian Road', purpose: 'sale', type: 'Farm House', price: 145000000, city: 'Lahore', location: 'Bedian Road', address: 'Bedian Road, Lahore', area: 4, areaUnit: 'Kanal', bedrooms: 4, bathrooms: 5, featured: true, description: 'Luxurious farm house spread over 4 Kanal with a swimming pool, fruit orchard, lush lawns and a guest house. Perfect weekend retreat away from the city hustle.', amenities: ['Swimming Pool', 'Orchard', 'Guest House', 'Lawn', 'Parking', 'Security'], images: PHOTOS.villa.map(img), agent: a2._id, coordinates: { lat: 31.4400, lng: 74.4700 } },
    { title: '1 Bed Studio Apartment in Gulberg Greens', purpose: 'rent', type: 'Flat', price: 55000, city: 'Islamabad', location: 'Gulberg Greens', address: 'Gulberg Greens, Islamabad', area: 650, areaUnit: 'Sq. Ft.', bedrooms: 1, bathrooms: 1, description: 'Cozy fully-furnished studio apartment ideal for a bachelor or a couple. Modern fittings, open kitchen and access to building amenities.', amenities: ['Furnished', 'Lift', 'Parking', 'Security'], images: PHOTOS.flat1.map(img), agent: a0._id, coordinates: { lat: 33.6300, lng: 73.1500 } },
    { title: '10 Marla Upper Portion in Model Town', purpose: 'rent', type: 'Upper Portion', price: 120000, city: 'Lahore', location: 'Model Town', address: 'Block H, Model Town, Lahore', area: 10, areaUnit: 'Marla', bedrooms: 3, bathrooms: 3, description: 'Spacious upper portion with independent staircase, three large bedrooms, drawing/dining and a terrace. Located in the serene and central Model Town.', amenities: ['Separate Entrance', 'Terrace', 'Parking', 'Backup Generator'], images: PHOTOS.house1.map(img), agent: a1._id, coordinates: { lat: 31.4850, lng: 74.3260 } },
    { title: '240 Sq. Yd. House in Gulshan-e-Iqbal', purpose: 'sale', type: 'House', price: 48000000, city: 'Karachi', location: 'Gulshan-e-Iqbal', address: 'Block 13D, Gulshan-e-Iqbal, Karachi', area: 240, areaUnit: 'Sq. Yd.', bedrooms: 4, bathrooms: 4, description: 'Well-maintained double-storey house in a prime block of Gulshan. Four bedrooms, two lounges, and a rooftop. Close to schools, hospitals and University Road.', amenities: ['Parking', 'Rooftop', 'Security', 'Backup Generator'], images: PHOTOS.house2.map(img), agent: a2._id, coordinates: { lat: 24.9200, lng: 67.0900 } },
    { title: 'Commercial Building in Saddar', purpose: 'sale', type: 'Building', price: 320000000, city: 'Karachi', location: 'Saddar', address: 'Abdullah Haroon Road, Saddar, Karachi', area: 1000, areaUnit: 'Sq. Yd.', bedrooms: 0, bathrooms: 8, description: 'Fully rented commercial building with ground plus four floors in the busiest commercial hub of Karachi. Excellent returns with long-term corporate tenants.', amenities: ['Lift', 'Central AC', 'Parking', 'Backup Generator', 'Security'], images: PHOTOS.office.map(img), agent: a0._id, coordinates: { lat: 24.8560, lng: 67.0280 } },
  ];
};

// Assumes an active mongoose connection. Clears and repopulates the DB.
export const seedDatabase = async () => {
  await Property.deleteMany({});
  await User.deleteMany({});

  const agents = [];
  for (const a of agentsData) {
    const u = await User.create({
      ...a, password: 'password123', role: 'agent',
      avatar: `https://ui-avatars.com/api/?background=1f7a4d&color=fff&name=${encodeURIComponent(a.name)}`,
    });
    agents.push(u);
  }
  await User.create({
    ...userData, password: 'password123',
    avatar: `https://ui-avatars.com/api/?background=ff7a00&color=fff&name=${encodeURIComponent(userData.name)}`,
  });

  const props = buildProperties(agents);
  await Property.insertMany(props);

  return { properties: props.length, agents: agents.length, users: 1 };
};
