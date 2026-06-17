import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client.js';
import PropertyCard from '../components/PropertyCard.jsx';
import { cities, types } from '../utils/format.js';

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  const get = (k) => searchParams.get(k) || '';
  const setParam = (k, v) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set(k, v); else next.delete(k);
    next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(searchParams.entries());
    client.get('/properties', { params })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const goPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container listing-layout">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Search</label>
          <input value={get('q')} onChange={(e) => setParam('q', e.target.value)} placeholder="Location, title…" />
        </div>
        <div className="filter-group">
          <label>Purpose</label>
          <select value={get('purpose')} onChange={(e) => setParam('purpose', e.target.value)}>
            <option value="">Buy or Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        <div className="filter-group">
          <label>City</label>
          <select value={get('city')} onChange={(e) => setParam('city', e.target.value)}>
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Property Type</label>
          <select value={get('type')} onChange={(e) => setParam('type', e.target.value)}>
            <option value="">All Types</option>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Price Range (PKR)</label>
          <div className="price-row">
            <input type="number" placeholder="Min" value={get('minPrice')} onChange={(e) => setParam('minPrice', e.target.value)} />
            <input type="number" placeholder="Max" value={get('maxPrice')} onChange={(e) => setParam('maxPrice', e.target.value)} />
          </div>
        </div>
        <div className="filter-group">
          <label>Min Bedrooms</label>
          <select value={get('bedrooms')} onChange={(e) => setParam('bedrooms', e.target.value)}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
        <button className="btn btn-outline btn-block" onClick={() => setSearchParams({})}>Reset Filters</button>
      </aside>

      <section>
        <div className="toolbar">
          <span className="count">{data.total} propert{data.total === 1 ? 'y' : 'ies'} found</span>
          <select value={get('sort') || 'newest'} onChange={(e) => setParam('sort', e.target.value)} style={{ padding: '9px 10px', borderRadius: 8, border: '1px solid var(--line)' }}>
            <option value="newest">Newest First</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="spinner">Loading properties…</div>
        ) : data.items.length === 0 ? (
          <div className="center-empty">No properties match your filters. Try adjusting them.</div>
        ) : (
          <>
            <div className="grid">
              {data.items.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>
            {data.pages > 1 && (
              <div className="pagination">
                <button disabled={data.page <= 1} onClick={() => goPage(data.page - 1)}>‹ Prev</button>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={p === data.page ? 'active' : ''} onClick={() => goPage(p)}>{p}</button>
                ))}
                <button disabled={data.page >= data.pages} onClick={() => goPage(data.page + 1)}>Next ›</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
