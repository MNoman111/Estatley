import Property from '../models/Property.js';

// GET /api/properties  (with filters, search, sort, pagination)
export const getProperties = async (req, res) => {
  try {
    const {
      q, city, type, purpose, minPrice, maxPrice, bedrooms,
      sort = 'newest', page = 1, limit = 12, agent, featured,
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (agent) filter.agent = agent;
    if (featured) filter.featured = featured === 'true';
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const lim = Math.min(50, Number(limit));

    const [items, total] = await Promise.all([
      Property.find(filter)
        .sort(sortMap[sort] || sortMap.newest)
        .skip((pageNum - 1) * lim)
        .limit(lim)
        .populate('agent', 'name email phone avatar agency'),
      Property.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'agent',
      'name email phone avatar agency about'
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/properties
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create({ ...req.body, agent: req.user._id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to edit this listing' });

    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.agent.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete this listing' });

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
