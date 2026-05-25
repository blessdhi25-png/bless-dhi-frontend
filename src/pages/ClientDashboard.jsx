import React, {
  useState, useEffect, useCallback, useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const C = {
  navy:   '#0d1b3e', blue:   '#1a237e',
  sky:    '#4a7ff7', green:  '#2e7d32',
  gold:   '#c9a84c', danger: '#c62828',
  warn:   '#e65100', purple: '#6a1b9a',
  card:   '#ffffff', border: '#e2e8f0',
  dark:   '#0f172a', gray:   '#64748b',
  sidebar:'#0f1f4a',
};

const css = {
  page: {
    display:'flex', minHeight:'100vh',
    background:'#f8faff',
    fontFamily:"'DM Sans',sans-serif",
  },
  sidebar: {
    width:240, background:C.sidebar,
    display:'flex', flexDirection:'column',
    position:'fixed', top:0, left:0, bottom:0,
    zIndex:50, boxShadow:'4px 0 24px rgba(0,0,0,0.15)',
  },
  brand: {
    padding:'24px 20px',
    background:'rgba(255,255,255,0.04)',
    borderBottom:'1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    width:40, height:40,
    background:'linear-gradient(135deg,#c9a84c,#e8c96a)',
    borderRadius:10, display:'flex',
    alignItems:'center', justifyContent:'center',
    fontWeight:900, fontSize:18,
    color:C.navy, fontFamily:'Georgia,serif',
    marginBottom:10,
  },
  navItem: a => ({
    display:'flex', alignItems:'center',
    gap:12, padding:'11px 20px', cursor:'pointer',
    borderLeft: a ? '3px solid #4a7ff7' : '3px solid transparent',
    background: a ? 'rgba(74,127,247,0.1)' : 'transparent',
    color: a ? '#90b4ff' : 'rgba(255,255,255,0.6)',
    fontSize:13, fontWeight: a ? 600 : 400,
    transition:'all 0.15s',
  }),
  navBadge: bg => ({
    marginLeft:'auto', background:bg,
    color:'white', borderRadius:100,
    fontSize:10, fontWeight:700, padding:'2px 7px',
  }),
  main: {
    marginLeft:240, flex:1,
    padding:'32px 36px', minHeight:'100vh',
  },
  topbar: {
    display:'flex', alignItems:'center',
    justifyContent:'space-between', marginBottom:28,
  },
  pageTitle: {
    fontSize:22, fontWeight:700,
    color:C.dark, fontFamily:'Georgia,serif',
  },
  pageSub: { fontSize:13, color:C.gray, marginTop:2 },
  card: {
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:14, padding:24,
    boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
  },
  statCard: c => ({
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:14, padding:'20px 24px',
    borderLeft:`4px solid ${c}`, flex:1, minWidth:130,
  }),
  statNum: c => ({
    fontSize:32, fontWeight:800,
    color:c, fontFamily:'Georgia,serif', lineHeight:1,
  }),
  statLabel: { fontSize:12, color:C.gray, marginTop:6, fontWeight:500 },
  btn: (c, outline=false) => ({
    background: outline ? 'transparent' : c,
    color: outline ? c : 'white',
    border: outline ? `1.5px solid ${c}` : 'none',
    borderRadius:8, padding:'8px 18px',
    fontSize:13, fontWeight:600, cursor:'pointer',
    whiteSpace:'nowrap', transition:'opacity 0.15s',
  }),
  input: {
    width:'100%', border:`1.5px solid ${C.border}`,
    borderRadius:8, padding:'10px 12px',
    fontSize:13, color:C.dark, outline:'none',
    boxSizing:'border-box', background:'white',
  },
  label: {
    display:'block', fontSize:12,
    fontWeight:600, color:'#475569', marginBottom:6,
  },
  formRow: { marginBottom:14 },
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th: {
    background:C.blue, color:'white',
    padding:'10px 14px', textAlign:'left',
    fontSize:12, fontWeight:600,
  },
  td: {
    padding:'11px 14px', borderBottom:`1px solid ${C.border}`,
    color:C.dark, verticalAlign:'middle',
  },
  tdAlt: {
    padding:'11px 14px', borderBottom:`1px solid ${C.border}`,
    color:C.dark, verticalAlign:'middle', background:'#f8faff',
  },
  badge: s => {
    const m = {
      pending:  {bg:'#fff3e0', color:'#e65100'},
      approved: {bg:'#e8f5e9', color:'#2e7d32'},
      rejected: {bg:'#ffebee', color:'#c62828'},
      paid:     {bg:'#e3f2fd', color:'#1565c0'},
    };
    const st = m[s] || m.pending;
    return {
      display:'inline-block', background:st.bg, color:st.color,
      padding:'3px 10px', borderRadius:100,
      fontSize:11, fontWeight:700, textTransform:'capitalize',
    };
  },
  modal: {
    position:'fixed', inset:0, zIndex:200,
    background:'rgba(0,0,0,0.5)',
    display:'flex', alignItems:'center',
    justifyContent:'center', padding:20,
  },
  modalCard: {
    background:'white', borderRadius:16, padding:32,
    width:'100%', maxWidth:540,
    maxHeight:'90vh', overflowY:'auto',
    boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
  },
  errorBox: {
    background:'#ffebee', border:'1px solid #ef9a9a',
    borderRadius:8, color:C.danger,
    fontSize:12, padding:'10px 14px', marginBottom:14,
  },
  tabRow: {
    display:'flex', gap:4, background:'#f1f5f9',
    borderRadius:10, padding:4, marginBottom:20,
  },
  tab: a => ({
    flex:1, padding:'8px 12px', borderRadius:8, border:'none',
    background: a ? 'white' : 'transparent',
    color: a ? C.blue : C.gray,
    fontSize:12, fontWeight: a ? 700 : 500, cursor:'pointer',
    boxShadow: a ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
    transition:'all 0.15s',
  }),
  emptyState: { textAlign:'center', padding:'48px 20px', color:C.gray },
};

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={css.modal} onClick={onClose}>
      <div style={{...css.modalCard, maxWidth: wide ? 700 : 520}}
        onClick={e => e.stopPropagation()}>
        <div style={{
          display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:20,
        }}>
          <div style={{
            fontSize:18, fontWeight:700,
            color:C.dark, fontFamily:'Georgia,serif',
          }}>
            {title}
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none',
            fontSize:20, cursor:'pointer', color:C.gray,
          }}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, right:24,
      background: type==='error' ? C.danger : C.green,
      color:'white', padding:'12px 20px',
      borderRadius:10, fontSize:13, fontWeight:600,
      boxShadow:'0 8px 24px rgba(0,0,0,0.2)', zIndex:999,
    }}>
      {msg}
    </div>
  );
}

const NAV = [
  { id:'dashboard', label:'Dashboard' },
  { id:'hostels',   label:'Find Hostels' },
  { id:'bookings',  label:'My Bookings' },
  { id:'messages',  label:'Messages' },
];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [page, setPage]             = useState('dashboard');
  const [stats, setStats]           = useState(null);
  const [hostels, setHostels]       = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [messages, setMessages]     = useState([]);
  const [search, setSearch]         = useState('');
  const [bookingFilter, setBFilter] = useState('all');
  const [toast, setToast]           = useState({msg:'',type:''});
  const [payLoading, setPayLoading] = useState(null);

  // Modals
  const [hostelDetail,    setHostelDetail]    = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookModal,   setShowBookModal]   = useState(null);
  const [showMsgModal,    setShowMsgModal]    = useState(null);
  const [msgDetailData,   setMsgDetailData]   = useState(null);
  const [showMsgDetail,   setShowMsgDetail]   = useState(false);

  const showToast = (msg, type='success') => {
    setToast({msg, type});
    setTimeout(() => setToast({msg:'',type:''}), 3500);
  };

  // ── Fetchers ──────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/client/stats');
      setStats(data.stats);
    } catch {}
  }, []);

  const fetchHostels = useCallback(async (q='') => {
    try {
      const { data } = await api.get(
        `/client/hostels${q ? `?search=${q}` : ''}`
      );
      setHostels(data.hostels);
    } catch {}
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/client/bookings?status=${bookingFilter}`
      );
      setBookings(data.bookings);
    } catch {}
  }, [bookingFilter]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.get('/client/messages');
      setMessages(data.messages);
    } catch {}
  }, []);

  const fetchHostelDetail = async (id) => {
    try {
      const { data } = await api.get(`/client/hostels/${id}`);
      setHostelDetail(data);
      setShowDetailModal(true);
    } catch {
      showToast('Failed to load hostel details.', 'error');
    }
  };

  const fetchMessageDetail = async (id) => {
    try {
      const { data } = await api.get(`/client/messages/${id}`);
      setMsgDetailData(data.message);
      setShowMsgDetail(true);
    } catch {
      showToast('Failed to load message.', 'error');
    }
  };

  const initiatePay = async (bookingId) => {
    setPayLoading(bookingId);
    try {
      const { data } = await api.post('/payment/initialize', {
        bookingId, provider: 'paystack',
      });
      window.location.href = data.authorizationUrl;
    } catch (e) {
      showToast(
        e.response?.data?.error || 'Payment failed to start.',
        'error'
      );
      setPayLoading(null);
    }
  };

  useEffect(() => {
    if (page === 'dashboard') fetchStats();
    if (page === 'hostels')   fetchHostels();
    if (page === 'bookings')  fetchBookings();
    if (page === 'messages')  fetchMessages();
  }, [page]);

  useEffect(() => {
    if (page === 'bookings') fetchBookings();
  }, [bookingFilter]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ── Sidebar ───────────────────────────────────────
  const Sidebar = () => (
    <div style={css.sidebar}>
      <div style={css.brand}>
        <div style={css.logo}>B</div>
        <div style={{color:'white',fontWeight:700,fontSize:15}}>
          Bless Dhi
        </div>
        <div style={{color:'rgba(255,255,255,0.4)',fontSize:11,marginTop:2}}>
          Client Portal
        </div>
        <div style={{marginTop:8,fontSize:12,color:'rgba(255,255,255,0.6)',fontWeight:500}}>
          {user.fullName}
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',paddingTop:8}}>
        {NAV.map(item => (
          <div key={item.id}
            style={css.navItem(page === item.id)}
            onClick={() => setPage(item.id)}>
            <span style={{
              background: page===item.id
                ? 'rgba(74,127,247,0.2)'
                : 'rgba(255,255,255,0.05)',
              borderRadius:6, width:28, height:28,
              display:'flex', alignItems:'center',
              justifyContent:'center',
              fontSize:11, fontWeight:700,
              color: page===item.id
                ? '#90b4ff' : 'rgba(255,255,255,0.4)',
            }}>
              {item.label[0]}
            </span>
            {item.label}
            {item.id==='messages' && stats?.unread > 0 && (
              <span style={css.navBadge(C.danger)}>
                {stats.unread}
              </span>
            )}
            {item.id==='bookings' && stats?.pending > 0 && (
              <span style={css.navBadge(C.warn)}>
                {stats.pending}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'12px 0'}}>
        <div style={css.navItem(false)} onClick={handleLogout}>
          <span style={{fontSize:13}}>{'<-'}</span>
          Logout
        </div>
      </div>
    </div>
  );

  // ── Dashboard Page ────────────────────────────────
  const DashboardPage = () => (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>
            Welcome back, {user.fullName?.split(' ')[0]}
          </div>
          <div style={css.pageSub}>Here is your activity summary</div>
        </div>
        <button style={css.btn(C.blue)}
          onClick={() => setPage('hostels')}>
          Find Hostels
        </button>
      </div>

      <div style={{display:'flex',gap:16,marginBottom:28,flexWrap:'wrap'}}>
        {[
          {label:'Pending Bookings',  value:stats?.pending  ??0, color:C.warn},
          {label:'Approved Bookings', value:stats?.approved ??0, color:C.green},
          {label:'Available Hostels', value:stats?.hostels  ??0, color:C.sky},
          {label:'Unread Messages',   value:stats?.unread   ??0, color:C.purple},
        ].map(s => (
          <div key={s.label} style={css.statCard(s.color)}>
            <div style={css.statNum(s.color)}>{s.value}</div>
            <div style={css.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{...css.card, marginBottom:24}}>
        <div style={{fontSize:14,fontWeight:700,color:C.dark,marginBottom:14}}>
          Quick Actions
        </div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {[
            {label:'Browse Hostels', page:'hostels', color:C.blue},
            {label:'My Bookings',   page:'bookings', color:C.green},
            {label:'Messages',      page:'messages', color:C.purple},
          ].map(a => (
            <button key={a.page}
              style={{...css.btn(a.color), padding:'12px 24px'}}
              onClick={() => setPage(a.page)}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div style={css.card}>
        <div style={{fontSize:14,fontWeight:700,color:C.dark,marginBottom:16}}>
          Recent Bookings
        </div>
        {stats?.recentBookings?.length > 0 ? (
          <table style={css.table}>
            <thead>
              <tr>
                {['Hostel','Room','People','Status','Date'].map(h => (
                  <th key={h} style={css.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b,i) => (
                <tr key={b.id}>
                  <td style={i%2?css.tdAlt:css.td}><strong>{b.hostel_name}</strong></td>
                  <td style={i%2?css.tdAlt:css.td}>{b.room_type}</td>
                  <td style={i%2?css.tdAlt:css.td}>{b.number_of_people}</td>
                  <td style={i%2?css.tdAlt:css.td}>
                    <span style={css.badge(b.status)}>{b.status}</span>
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    {new Date(b.request_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={css.emptyState}>
            <div style={{fontSize:36,marginBottom:10}}>📋</div>
            <div style={{fontSize:14,fontWeight:500}}>No bookings yet</div>
            <div style={{fontSize:12,marginTop:4}}>Browse hostels and send a booking request</div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Hostels Page ──────────────────────────────────
  const HostelsPage = () => {
    const [localSearch, setLocalSearch] = useState(search);
    const timer = useRef(null);

    const handleSearch = val => {
      setLocalSearch(val);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setSearch(val);
        fetchHostels(val);
      }, 400);
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Find Hostels</div>
            <div style={css.pageSub}>Browse {hostels.length} approved hostels</div>
          </div>
          <button style={css.btn(C.gray,true)}
            onClick={() => fetchHostels(search)}>
            Refresh
          </button>
        </div>

        <div style={{...css.card, marginBottom:20, padding:16}}>
          <input style={css.input}
            placeholder="Search by name, location or description..."
            value={localSearch}
            onChange={e => handleSearch(e.target.value)} />
        </div>

        {hostels.length > 0 ? (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',
            gap:20,
          }}>
            {hostels.map(h => (
              <div key={h.id} style={{
                ...css.card, cursor:'pointer',
                transition:'transform 0.2s,box-shadow 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)';
                }}>
                <div style={{
                  height:8, borderRadius:'8px 8px 0 0',
                  background:'linear-gradient(90deg,#1a237e,#4a7ff7)',
                  margin:'-24px -24px 16px',
                }} />
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div>
                    <div style={{fontSize:16,fontWeight:700,color:C.dark}}>{h.name}</div>
                    <div style={{fontSize:12,color:C.gray,marginTop:3}}>{h.location}</div>
                  </div>
                  <span style={{background:'#e8f5e9',color:C.green,borderRadius:6,fontSize:12,fontWeight:700,padding:'4px 10px'}}>
                    GHC {Number(h.min_price).toFixed(0)}+
                  </span>
                </div>
                {h.description && (
                  <div style={{
                    fontSize:12, color:C.gray, lineHeight:1.6,
                    marginBottom:14, overflow:'hidden',
                    display:'-webkit-box', WebkitLineClamp:2,
                    WebkitBoxOrient:'vertical',
                  }}>
                    {h.description}
                  </div>
                )}
                <div style={{display:'flex',gap:16,fontSize:12,color:C.gray,marginBottom:16}}>
                  <span>{h.room_types} room type(s)</span>
                  <span>{h.total_available} spaces avail.</span>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{...css.btn(C.blue), flex:1}}
                    onClick={() => fetchHostelDetail(h.id)}>
                    View Details
                  </button>
                  <button style={{...css.btn(C.green), flex:1}}
                    onClick={() => setShowBookModal(h)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={css.emptyState}>
            <div style={{fontSize:40,marginBottom:10}}>🏨</div>
            <div style={{fontSize:14,fontWeight:500}}>No hostels found</div>
            <div style={{fontSize:12,marginTop:4}}>Try a different search term</div>
          </div>
        )}
      </div>
    );
  };

  // ── Hostel Detail Modal ───────────────────────────
  const HostelDetailModal = () => {
    if (!hostelDetail) return null;
    const { hostel, rooms, media, notices } = hostelDetail;
    const [activeTab, setActiveTab] = useState('rooms');

    return (
      <Modal
        title={hostel.name}
        onClose={() => { setShowDetailModal(false); setHostelDetail(null); }}
        wide>
        <div style={{fontSize:13,color:C.gray,marginBottom:16}}>
          {hostel.location}
          {hostel.description && <span> — {hostel.description}</span>}
        </div>

        <div style={css.tabRow}>
          {['rooms','media','notices'].map(t => (
            <button key={t} style={css.tab(activeTab===t)}
              onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'rooms' && (
          <div>
            {rooms.length > 0 ? rooms.map(r => (
              <div key={r.id} style={{
                ...css.card, marginBottom:12,
                borderLeft:`4px solid ${C.sky}`,
              }}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:C.dark}}>{r.room_type}</div>
                    {r.description && (
                      <div style={{fontSize:12,color:C.gray,marginTop:3}}>{r.description}</div>
                    )}
                    <div style={{fontSize:12,color:C.gray,marginTop:4}}>
                      {r.available_rooms} of {r.total_rooms} available
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:18,fontWeight:800,color:C.green}}>
                      GHC {Number(r.price_per_person).toFixed(2)}
                    </div>
                    <div style={{fontSize:11,color:C.gray}}>per person</div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={css.emptyState}>No rooms listed yet</div>
            )}
            <button style={{...css.btn(C.green),width:'100%',marginTop:8,padding:14,fontSize:14}}
              onClick={() => { setShowDetailModal(false); setShowBookModal(hostel); }}>
              Book This Hostel
            </button>
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            {media.length > 0 ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                {media.map(m => (
                  <div key={m.id} style={{borderRadius:8,overflow:'hidden',background:'#1a1a2e'}}>
                    {m.file_type === 'image' ? (
                      <img
                        src={`${API_BASE}${m.file_path}`}
                        alt="media"
                        style={{width:'100%',height:120,objectFit:'cover'}}
                        onError={e => { e.target.parentNode.style.display='none'; }}
                      />
                    ) : (
                      <div style={{height:120,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'white',gap:6}}>
                        <div style={{fontSize:28}}>▶</div>
                        <div style={{fontSize:10,color:'#90a4ae'}}>Video</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={css.emptyState}>No media uploaded yet</div>
            )}
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            {notices.length > 0 ? notices.map(n => (
              <div key={n.id} style={{...css.card,marginBottom:12,borderLeft:`4px solid ${C.warn}`}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:6}}>{n.title}</div>
                <div style={{fontSize:13,color:C.gray,lineHeight:1.6}}>{n.content}</div>
                <div style={{fontSize:11,color:'#b0bec5',marginTop:8}}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            )) : (
              <div style={css.emptyState}>No notices</div>
            )}
          </div>
        )}

        <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`}}>
          <button style={{...css.btn(C.warn),width:'100%',padding:12}}
            onClick={() => { setShowDetailModal(false); setShowMsgModal(hostel); }}>
            Message Manager
          </button>
        </div>
      </Modal>
    );
  };

  // ── Booking Modal ─────────────────────────────────
  const BookingModal = () => {
    const h = showBookModal;
    if (!h) return null;

    const [form, setForm]   = useState({roomType:'', numberOfPeople:1});
    const [rooms, setRooms] = useState([]);
    const [err, setErr]     = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      api.get(`/client/hostels/${h.id}`)
        .then(({ data }) => setRooms(data.rooms))
        .catch(() => {});
    }, []);

    const submit = async () => {
      if (!form.roomType) { setErr('Please select a room type.'); return; }
      setSaving(true); setErr('');
      try {
        const { data } = await api.post('/client/bookings', {
          hostelId: h.id,
          roomType: form.roomType,
          numberOfPeople: form.numberOfPeople,
        });
        showToast(data.message);
        setShowBookModal(null);
        fetchBookings(); fetchStats();
      } catch (e) {
        setErr(e.response?.data?.error || 'Booking failed.');
      } finally { setSaving(false); }
    };

    return (
      <Modal title={`Book — ${h.name}`} onClose={() => setShowBookModal(null)}>
        {err && <div style={css.errorBox}>{err}</div>}
        <div style={css.formRow}>
          <label style={css.label}>Room Type *</label>
          <select style={css.input} value={form.roomType}
            onChange={e => setForm(p => ({...p, roomType:e.target.value}))}>
            <option value="">Select room type</option>
            {rooms.map(r => (
              <option key={r.id} value={r.room_type}>
                {r.room_type} — GHC {Number(r.price_per_person).toFixed(2)}/person ({r.available_rooms} available)
              </option>
            ))}
          </select>
        </div>
        <div style={css.formRow}>
          <label style={css.label}>Number of People *</label>
          <input style={css.input} type="number" min={1} max={8}
            value={form.numberOfPeople}
            onChange={e => setForm(p => ({...p, numberOfPeople:+e.target.value}))} />
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button style={css.btn(C.gray,true)} onClick={() => setShowBookModal(null)}>Cancel</button>
          <button style={{...css.btn(C.green), opacity:saving?0.7:1}}
            onClick={submit} disabled={saving}>
            {saving ? 'Sending...' : 'Send Booking Request'}
          </button>
        </div>
      </Modal>
    );
  };

  // ── Message Modal ─────────────────────────────────
  const MessageModal = () => {
    const h = showMsgModal;
    if (!h) return null;

    const [form, setForm]   = useState({subject:'', content:''});
    const [err, setErr]     = useState('');
    const [saving, setSaving] = useState(false);

    const submit = async () => {
      if (!form.content) { setErr('Message content is required.'); return; }
      setSaving(true); setErr('');
      try {
        const { data } = await api.post('/client/messages', {
          hostelId: h.id, subject: form.subject, content: form.content,
        });
        showToast(data.message);
        setShowMsgModal(null);
      } catch (e) {
        setErr(e.response?.data?.error || 'Failed to send.');
      } finally { setSaving(false); }
    };

    return (
      <Modal title={`Message Manager — ${h.name}`} onClose={() => setShowMsgModal(null)}>
        {err && <div style={css.errorBox}>{err}</div>}
        <div style={css.formRow}>
          <label style={css.label}>Subject</label>
          <input style={css.input} value={form.subject}
            onChange={e => setForm(p => ({...p, subject:e.target.value}))}
            placeholder="e.g. Room availability enquiry" />
        </div>
        <div style={css.formRow}>
          <label style={css.label}>Message *</label>
          <textarea style={{...css.input, minHeight:120, resize:'vertical'}}
            value={form.content}
            onChange={e => setForm(p => ({...p, content:e.target.value}))}
            placeholder="Type your message here..." />
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button style={css.btn(C.gray,true)} onClick={() => setShowMsgModal(null)}>Cancel</button>
          <button style={{...css.btn(C.blue), opacity:saving?0.7:1}}
            onClick={submit} disabled={saving}>
            {saving ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </Modal>
    );
  };

  // ── Message Detail Modal ──────────────────────────
  const MessageDetailModal = () => {
    if (!msgDetailData) return null;
    const m = msgDetailData;
    return (
      <Modal title="Message"
        onClose={() => { setShowMsgDetail(false); setMsgDetailData(null); }}>
        <div style={{
          background:'#f8faff', border:`1px solid ${C.border}`,
          borderRadius:10, padding:'16px 18px', marginBottom:16,
        }}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
            <div>
              <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>From</div>
              <div style={{fontSize:14,fontWeight:700,color:C.dark,marginTop:2}}>{m.sender_name}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>Date</div>
              <div style={{fontSize:12,color:C.gray,marginTop:2}}>
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>Subject</div>
          <div style={{fontSize:14,fontWeight:600,color:C.dark}}>{m.subject || '(no subject)'}</div>
        </div>
        <div style={{
          fontSize:14, color:C.dark, lineHeight:1.8,
          padding:16, background:'white',
          border:`1px solid ${C.border}`, borderRadius:10,
          minHeight:100, whiteSpace:'pre-wrap',
        }}>
          {m.content}
        </div>
      </Modal>
    );
  };

  // ── Bookings Page ─────────────────────────────────
  const BookingsPage = () => {
    const cancel = async (id) => {
      try {
        await api.delete(`/client/bookings/${id}`);
        showToast('Booking cancelled.');
        fetchBookings(); fetchStats();
      } catch (e) {
        showToast(e.response?.data?.error || 'Cannot cancel.', 'error');
      }
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>My Bookings</div>
            <div style={css.pageSub}>Track all your hostel booking requests</div>
          </div>
          <button style={css.btn(C.gray,true)} onClick={fetchBookings}>Refresh</button>
        </div>

        <div style={css.tabRow}>
          {['all','pending','approved','rejected','paid'].map(s => (
            <button key={s} style={css.tab(bookingFilter===s)}
              onClick={() => setBFilter(s)}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        <div style={css.card}>
          {bookings.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>
                  {['Hostel','Room','People','Status','Date','Action'].map(h => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b,i) => (
                  <tr key={b.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <strong>{b.hostel_name}</strong>
                      <div style={{fontSize:11,color:C.gray}}>{b.hostel_location}</div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>{b.room_type}</td>
                    <td style={i%2?css.tdAlt:css.td}>{b.number_of_people}</td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(b.status)}>{b.status}</span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {new Date(b.request_date).toLocaleDateString()}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {b.status === 'pending' && (
                        <button
                          style={{...css.btn(C.danger,true),padding:'5px 12px',fontSize:12}}
                          onClick={() => cancel(b.id)}>
                          Cancel
                        </button>
                      )}
                      {b.status === 'approved' && (
                        <button
                          style={{...css.btn(C.green),padding:'5px 14px',fontSize:12,opacity:payLoading===b.id?0.7:1}}
                          onClick={() => initiatePay(b.id)}
                          disabled={payLoading===b.id}>
                          {payLoading===b.id ? 'Loading...' : 'Pay Now'}
                        </button>
                      )}
                      {b.status === 'paid' && (
                        <span style={css.badge('paid')}>Paid</span>
                      )}
                      {b.status === 'rejected' && (
                        <span style={{color:C.gray,fontSize:12}}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{fontSize:40,marginBottom:10}}>📋</div>
              <div style={{fontSize:14,fontWeight:500}}>
                No {bookingFilter==='all'?'':bookingFilter} bookings found
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Messages Page ─────────────────────────────────
  const MessagesPage = () => (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>Messages</div>
          <div style={css.pageSub}>Replies from hostel managers</div>
        </div>
        <button style={css.btn(C.gray,true)} onClick={fetchMessages}>Refresh</button>
      </div>

      <div style={css.card}>
        {messages.length > 0 ? (
          <table style={css.table}>
            <thead>
              <tr>
                {['From','Subject','Status','Date',''].map(h => (
                  <th key={h} style={css.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((m,i) => (
                <tr key={m.id}
                  style={{
                    fontWeight: m.is_read ? 400 : 700,
                    background: !m.is_read ? '#f0f4ff' : 'transparent',
                    cursor:'pointer',
                  }}
                  onClick={() => fetchMessageDetail(m.id)}>
                  <td style={i%2?css.tdAlt:css.td}>{m.sender_name}</td>
                  <td style={i%2?css.tdAlt:css.td}>{m.subject || '(no subject)'}</td>
                  <td style={i%2?css.tdAlt:css.td}>
                    <span style={css.badge(m.is_read?'approved':'pending')}>
                      {m.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    <span style={{fontSize:11,color:C.sky,fontWeight:600}}>
                      Click to read →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={css.emptyState}>
            <div style={{fontSize:40,marginBottom:10}}>✉</div>
            <div style={{fontSize:14,fontWeight:500}}>No messages yet</div>
            <div style={{fontSize:12,marginTop:4}}>
              Message a hostel manager from the Find Hostels page
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────
  const pages = {
    dashboard: <DashboardPage />,
    hostels:   <HostelsPage />,
    bookings:  <BookingsPage />,
    messages:  <MessagesPage />,
  };

  return (
    <div style={css.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar />
      <main style={css.main}>{pages[page]}</main>
      {showDetailModal && <HostelDetailModal />}
      {showBookModal   && <BookingModal />}
      {showMsgModal    && <MessageModal />}
      {showMsgDetail   && <MessageDetailModal />}
      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}