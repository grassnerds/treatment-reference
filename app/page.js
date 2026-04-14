'use client';
import { useState, useMemo, useCallback } from 'react';
import warmRounds from '../data/warm-season.json';
import coolRounds from '../data/cool-season.json';
import coastalRounds from '../data/coastal.json';
import fungicideRounds from '../data/fungicide.json';
import shrubRounds from '../data/shrub-care.json';
import faqs from '../data/faqs.json';
import safety from '../data/safety.json';
import addons from '../data/addons.json';

function RoundCard({ round, isOpen, toggle, highlight }) {
  const typeClass = round.type === 'Liquid' ? 'type-liquid' : 'type-granular';
  return (
    <div className={`round-card${isOpen ? ' open' : ''}${highlight ? ' highlight' : ''}`}>
      <div className="round-header" onClick={toggle}>
        <div className="round-label">
          <span className="round-badge">{round.code}</span>
          <span className="round-name">{round.name}</span>
          {round.program && <span className="round-program">({round.program})</span>}
        </div>
        <div className="round-meta">
          <span className="round-timing">{round.timing}</span>
          <span className={`type-badge ${typeClass}`}>{round.type}</span>
          <span className="chevron">▼</span>
        </div>
      </div>
      {isOpen && (
        <div className="round-body">
          <table className="chem-table">
            <thead><tr><th>Product</th><th>Rate</th></tr></thead>
            <tbody>
              {round.chems.map(([name, rate], i) => (
                <tr key={i}>
                  <td className={name.toLowerCase().includes('spot') ? 'spot' : ''}>{name}</td>
                  <td>{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="talk-box">
            <div className="talk-box-label">💬 What to tell the customer</div>
            <p>{round.talk}</p>
          </div>
          {round.yard && (
            <div className="yard-box">
              <div className="yard-box-label">🌱 What's happening in the yard</div>
              <p>{round.yard}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ChemRef({ title, icon, items }) {
  return (
    <div className="quick-card">
      <h4>{icon} {title}</h4>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937' }}>{item.name}</div>
          <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Used in: {item.where}</div>
          <div style={{ fontSize: 12, color: '#374151', marginTop: 2 }}>{item.what}</div>
        </div>
      ))}
    </div>
  );
}

function FaqItem({ faq, index, isOpen, toggle }) {
  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <div className="faq-question" onClick={toggle}>
        <span className="faq-number">{index + 1}</span>
        <span className="faq-q-text">"{faq.question}"</span>
        <span className="faq-chevron">▼</span>
      </div>
      {isOpen && <div className="faq-answer">{faq.answer}</div>}
    </div>
  );
}

const TABS = [
  { id: 'safety', label: 'Safety & Talk Tracks' },
  { id: 'warm', label: 'Warm Season' },
  { id: 'cool', label: 'Cool Season' },
  { id: 'coastal', label: 'Coastal' },
  { id: 'fungicide', label: 'Fungicide' },
  { id: 'shrub', label: 'Shrub Care' },
  { id: 'addons', label: 'Add-Ons & Services' },
];

const SECTION_INFO = {
  warm: { title: 'Warm Season Program', sub: 'Bermuda & Zoysia · 7 rounds · Jan – Dec', data: warmRounds },
  cool: { title: 'Cool Season Program', sub: 'Fescue · 7 rounds · Jan – Dec', data: coolRounds },
  coastal: { title: 'Coastal Program', sub: 'Centipede & St. Augustine · 6 rounds · Mar – Nov', data: coastalRounds },
  fungicide: { title: 'Fungicide Programs', sub: 'Preventative disease control · Warm season (3 rounds) + Fescue (5 rounds)', data: fungicideRounds },
  shrub: { title: 'Shrub Care Program', sub: '5 rounds · Mar – Nov · Deep root injection + foliar sprays', data: shrubRounds },
};

export default function Home() {
  const [tab, setTab] = useState('safety');
  const [search, setSearch] = useState('');
  const [openCards, setOpenCards] = useState({});
  const [openFaqs, setOpenFaqs] = useState({});

  const toggleCard = useCallback((id) => setOpenCards(p => ({ ...p, [id]: !p[id] })), []);
  const toggleFaq = useCallback((id) => setOpenFaqs(p => ({ ...p, [id]: !p[id] })), []);

  const allRounds = useMemo(() => [
    ...warmRounds.map(r => ({ ...r, section: 'warm' })),
    ...coolRounds.map(r => ({ ...r, section: 'cool' })),
    ...coastalRounds.map(r => ({ ...r, section: 'coastal' })),
    ...fungicideRounds.map(r => ({ ...r, section: 'fungicide' })),
    ...shrubRounds.map(r => ({ ...r, section: 'shrub' })),
  ], []);

  const isSearching = search.trim().length > 0;
  const filteredRounds = useMemo(() => {
    if (!isSearching) return [];
    const q = search.toLowerCase();
    return allRounds.filter(r => {
      const text = [r.code, r.name, r.timing, r.type, r.talk, r.yard || '', r.program || '', ...r.chems.flat()].join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [search, allRounds, isSearching]);

  return (
    <>
      <div className="header">
        <div className="header-left">
          <h1>GRASS <span>NERDS</span></h1>
          <span className="header-badge">2026 Treatment Reference</span>
        </div>
        <div className="search-bar">
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chemicals, rounds, grass types…" />
          {search && <span onClick={() => setSearch('')} style={{ color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 16 }}>✕</span>}
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <div key={t.id} className={`tab${tab === t.id && !isSearching ? ' active' : ''}`} onClick={() => { setTab(t.id); setSearch(''); }}>{t.label}</div>
        ))}
      </div>

      <div className="main">
        {/* SEARCH RESULTS */}
        {isSearching && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{filteredRounds.length} result{filteredRounds.length !== 1 ? 's' : ''} for "<strong>{search}</strong>"</div>
            {filteredRounds.length === 0 && <div className="no-results">No matches found.</div>}
            {filteredRounds.map(r => <RoundCard key={r.code + r.section} round={r} isOpen={openCards[r.code + r.section]} toggle={() => toggleCard(r.code + r.section)} highlight />)}
          </div>
        )}

        {/* SAFETY TAB */}
        {!isSearching && tab === 'safety' && (
          <div>
            <div className="section-title">Product Safety & Customer Talk Tracks</div>
            <div className="section-subtitle">Know this cold. If a customer asks "is this stuff safe?" you should never say "I'm not sure."</div>

            <div className="safety-box">
              <h3>The #1 Rule: Specificity = Trust</h3>
              <p>All of our products are <span className="highlight-text">EPA-registered</span> and go through the same regulatory process as the household cleaners under your kitchen sink. When a customer asks about safety, lead with that — then give them the dry-time guideline (30–60 minutes) and offer to send the specific product list for their lawn.</p>
              <div className="callout-red">
                <p><strong>🚫 Never say:</strong> "I'm not sure what we use" or "Everything is pet safe" without specifics. Customers who ask about safety are informed — vague reassurance makes them trust you <em>less</em>, not more.</p>
              </div>
            </div>

            <div className="section-title" style={{ marginTop: 28 }}>Top 10 Customer FAQs</div>
            <div className="section-subtitle">These are the questions you'll get most often. Know every answer before you pick up the phone.</div>
            <div>
              {faqs.map((faq, i) => <FaqItem key={i} faq={faq} index={i} isOpen={openFaqs[i]} toggle={() => toggleFaq(i)} />)}
            </div>

            <div className="section-title" style={{ marginTop: 28 }}>Product Cheat Sheet — By Category</div>
            <div className="section-subtitle">Every chemical we use, where it shows up, and what it does.</div>
            <div className="card-grid">
              <ChemRef title="Pre-Emergent Herbicides" icon="🛡️" items={safety.preEmergents} />
              <ChemRef title="Post-Emergent Herbicides" icon="⚔️" items={safety.postEmergents} />
              <ChemRef title="Fertilizers & Soil Amendments" icon="🌿" items={safety.fertilizers} />
              <ChemRef title="Fungicides" icon="💊" items={safety.fungicides} />
              <ChemRef title="Insecticides" icon="🐛" items={safety.insecticides} />
              <div className="quick-card">
                <h4>💧 Adjuvants & Surfactants</h4>
                <p><strong>Non-Ionic Surfactant</strong> — helps spray stick to leaf surfaces. Used in nearly every liquid round. This is what might feel sticky on bare feet if walked on too soon.</p>
                <p style={{ marginTop: 8 }}><strong>Activator Plus</strong> — adjuvant paired with fungicide applications to improve absorption.</p>
              </div>
            </div>

            <div className="safety-box" style={{ marginTop: 24 }}>
              <h3>Re-Entry & Safety Talk Track</h3>
              <p style={{ marginBottom: 10 }}>When a customer asks "Is it safe for my kids / pets?" — say this:</p>
              {[
                '"All of our products are EPA-registered for residential use, including around children and pets — the same regulatory standard as the household chemicals under your sink."',
                '"We recommend staying off treated areas until the product dries — usually about 30 minutes to an hour depending on conditions."',
                '"The surfactant we use can feel a little sticky underfoot if you walk on it before it dries, but once dry there\'s no issue."',
                '"We do NOT use glyphosate or Roundup. Our weed control products are selective herbicides — they target weeds specifically and don\'t harm the grass."',
                '"If you\'d like, I can send you a list of the specific products we use on your lawn so you can review them."',
              ].map((line, i) => <div key={i} className="callout-green" style={{ marginBottom: 8 }}>✅ {line}</div>)}
              <div className="callout-red" style={{ marginTop: 14 }}>
                <p><strong>🚫 Do NOT say:</strong> "It's all pet safe / kid safe" as a blanket statement without specifics. Name the product category (selective herbicide, pre-emergent) and the dry-time guideline. Specificity = trust.</p>
              </div>
            </div>
          </div>
        )}

        {/* TREATMENT TABS */}
        {!isSearching && ['warm', 'cool', 'coastal', 'fungicide', 'shrub'].includes(tab) && (
          <div>
            <div className="section-title">{SECTION_INFO[tab].title}</div>
            <div className="section-subtitle">{SECTION_INFO[tab].sub}</div>
            {SECTION_INFO[tab].data.map(r => <RoundCard key={r.code} round={r} isOpen={openCards[r.code]} toggle={() => toggleCard(r.code)} />)}
          </div>
        )}

        {/* ADD-ONS */}
        {!isSearching && tab === 'addons' && (
          <div>
            <div className="section-title">Add-On Services</div>
            <div className="section-subtitle">Additional services beyond the core treatment programs</div>
            <div className="card-grid">
              {addons.map((item, i) => (
                <div key={i} className="quick-card">
                  <h4>{item.icon} {item.title}</h4>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}><strong>When:</strong> {item.when} · <strong>Type:</strong> {item.type}</div>
                  <p style={{ marginBottom: 8 }}>{item.desc}</p>
                  <div className="addon-value">
                    <div className="addon-value-label">Customer value line</div>
                    <p>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
