import React, {
  useState, useEffect, useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const C = {
  navy:'#0d1b3e', blue:'#1a237e', accent:'#2348c0',
  sky:'#4a7ff7',  green:'#2e7d32', gold:'#c9a84c',
  danger:'#c62828', warning:'#e65100', purple:'#6a1b9a',
  card:'#ffffff',  border:'#e2e8f0', dark:'#0f172a',
  gray:'#64748b',  sidebar:'#0f1f4a',
};

const css = {
  page: {display:'flex',minHeight:'100vh',background:'#f8faff',fontFamily:"'DM Sans',sans-serif"},
  sidebar: {width:240,background:C.sidebar,display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:50,boxShadow:'4px 0 24px rgba(0,0,0,0.15)'},
  brand: {padding:'24px 20px',background:'rgba(255,255,255,0.05)',borderBottom:'1px solid rgba(255,255,255,0.06)'},
  logo: {width:40,height:40,background:'linear-gradient(135deg,#c9a84c,#e8c96a)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:18,color:C.navy,fontFamily:'Georgia,serif',marginBottom:10},
  navItem: a => ({display:'flex',alignItems:'center',gap:12,padding:'11px 20px',cursor:'pointer',transition:'all 0.15s',borderLeft:a?'3px solid #c9a84c':'3px solid transparent',background:a?'rgba(201,168,76,0.1)':'transparent',color:a?'#e8c96a':'rgba(255,255,255,0.6)',fontSize:13,fontWeight:a?600:400}),
  main: {marginLeft:240,flex:1,padding:'32px 36px',minHeight:'100vh'},
  topbar: {display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28},
  pageTitle: {fontSize:22,fontWeight:700,color:C.dark,fontFamily:'Georgia,serif'},
  pageSub: {fontSize:13,color:C.gray,marginTop:2},
  card: {background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.05)'},
  statCard: c => ({background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:'20px 24px',borderLeft:`4px solid ${c}`,flex:1,minWidth:140}),
  statNum: c => ({fontSize:32,fontWeight:800,color:c,fontFamily:'Georgia,serif',lineHeight:1}),
  statLabel: {fontSize:12,color:C.gray,marginTop:6,fontWeight:500},
  table: {width:'100%',borderCollapse:'collapse',fontSize:13},
  th: {background:C.blue,color:'white',padding:'10px 14px',textAlign:'left',fontSize:12,fontWeight:600,letterSpacing:0.3},
  td: {padding:'11px 14px',borderBottom:`1px solid ${C.border}`,color:C.dark,verticalAlign:'middle'},
  tdAlt: {padding:'11px 14px',borderBottom:`1px solid ${C.border}`,color:C.dark,verticalAlign:'middle',background:'#f8faff'},
  badge: s => {
    const m = {pending:{bg:'#fff3e0',color:'#e65100'},approved:{bg:'#e8f5e9',color:'#2e7d32'},rejected:{bg:'#ffebee',color:'#c62828'},active:{bg:'#e8f5e9',color:'#2e7d32'},inactive:{bg:'#f5f5f5',color:'#9e9e9e'}};
    const st = m[s]||m.pending;
    return {display:'inline-block',background:st.bg,color:st.color,padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:700,textTransform:'capitalize'};
  },
  btn: (c,outline=false) => ({background:outline?'transparent':c,color:outline?c:'white',border:outline?`1.5px solid ${c}`:'none',borderRadius:8,padding:'8px 18px',fontSize:13,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'opacity 0.15s'}),
  input: {width:'100%',border:`1.5px solid ${C.border}`,borderRadius:8,padding:'10px 12px',fontSize:13,color:C.dark,outline:'none',boxSizing:'border-box',background:'white'},
  label: {display:'block',fontSize:12,fontWeight:600,color:'#475569',marginBottom:6},
  formRow: {marginBottom:14},
  twoCol: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:14},
  modal: {position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:20},
  modalCard: {background:'white',borderRadius:16,padding:32,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.3)'},
  errorBox: {background:'#ffebee',border:'1px solid #ef9a9a',borderRadius:8,color:'#c62828',fontSize:12,padding:'10px 14px',marginBottom:14},
  tabRow: {display:'flex',gap:4,background:'#f1f5f9',borderRadius:10,padding:4,marginBottom:20},
  tab: a => ({flex:1,padding:'8px 12px',borderRadius:8,border:'none',background:a?'white':'transparent',color:a?C.blue:C.gray,fontSize:12,fontWeight:a?700:500,cursor:'pointer',boxShadow:a?'0 1px 4px rgba(0,0,0,0.1)':'none',transition:'all 0.15s'}),
  emptyState: {textAlign:'center',padding:'48px 20px',color:C.gray},
  sectionTitle: {fontSize:16,fontWeight:700,color:C.dark,marginBottom:16},
};

function Modal({ title, onClose, children }) {
  return (
    <div style={css.modal} onClick={onClose}>
      <div style={css.modalCard} onClick={e => e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:700,color:C.dark,fontFamily:'Georgia,serif'}}>{title}</div>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:C.gray}}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div style={css.modal}>
      <div style={{...css.modalCard,maxWidth:360}}>
        <div style={{fontSize:16,fontWeight:700,marginBottom:12,color:C.dark}}>Confirm Action</div>
        <div style={{fontSize:14,color:C.gray,marginBottom:24,lineHeight:1.6}}>{message}</div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button style={css.btn(C.gray,true)} onClick={onCancel}>Cancel</button>
          <button style={css.btn(C.danger)} onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{position:'fixed',bottom:24,right:24,background:type==='error'?C.danger:C.green,color:'white',padding:'12px 20px',borderRadius:10,fontSize:13,fontWeight:600,boxShadow:'0 8px 24px rgba(0,0,0,0.2)',zIndex:999}}>
      {msg}
    </div>
  );
}

const NAV = [
  {id:'dashboard',label:'Dashboard', icon:'D'},
  {id:'hostel',   label:'My Hostel', icon:'H'},
  {id:'rooms',    label:'Rooms',     icon:'R'},
  {id:'bookings', label:'Bookings',  icon:'B'},
  {id:'messages', label:'Messages',  icon:'M'},
  {id:'media',    label:'Media',     icon:'P'},
  {id:'notices',  label:'Notices',   icon:'N'},
];

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [page,          setPage]          = useState('dashboard');
  const [stats,         setStats]         = useState(null);
  const [hostel,        setHostel]        = useState(null);
  const [rooms,         setRooms]         = useState([]);
  const [bookings,      setBookings]      = useState([]);
  const [messages,      setMessages]      = useState([]);
  const [media,         setMedia]         = useState([]);
  const [notices,       setNotices]       = useState([]);
  const [toast,         setToast]         = useState({msg:'',type:''});
  const [confirm,       setConfirm]       = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showReplyModal,setShowReplyModal]= useState(false);
  const [showNoticeModal,setShowNoticeModal]=useState(false);
  const [editingRoom,   setEditingRoom]   = useState(null);
  const [replyTarget,   setReplyTarget]   = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [msgDetail,     setMsgDetail]     = useState(null);
  const [showMsgDetail, setShowMsgDetail] = useState(false);

  const showToast = (msg, type='success') => {
    setToast({msg,type});
    setTimeout(() => setToast({msg:'',type:''}), 3500);
  };

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/manager/stats');
      setStats(data.stats); setHostel(data.hostel);
    } catch {}
  }, []);

  const fetchRooms = useCallback(async () => {
    try { const { data } = await api.get('/manager/rooms'); setRooms(data.rooms); } catch {}
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get(`/manager/bookings?status=${bookingFilter}`);
      setBookings(data.bookings);
    } catch {}
  }, [bookingFilter]);

  const fetchMessages = useCallback(async () => {
    try { const { data } = await api.get('/manager/messages'); setMessages(data.messages); } catch {}
  }, []);

  const fetchMedia = useCallback(async () => {
    try { const { data } = await api.get('/manager/media'); setMedia(data.media); } catch {}
  }, []);

  const fetchNotices = useCallback(async () => {
    try { const { data } = await api.get('/manager/notices'); setNotices(data.notices); } catch {}
  }, []);

  const fetchMsgDetail = async (id) => {
    try {
      const { data } = await api.get(`/manager/messages/${id}`);
      setMsgDetail(data.message);
      setShowMsgDetail(true);
    } catch { showToast('Failed to load message.','error'); }
  };

  useEffect(() => {
    if (page==='dashboard') fetchStats();
    if (page==='hostel')    fetchStats();
    if (page==='rooms')     fetchRooms();
    if (page==='bookings')  fetchBookings();
    if (page==='messages')  fetchMessages();
    if (page==='media')     fetchMedia();
    if (page==='notices')   fetchNotices();
  }, [page]);

  useEffect(() => {
    if (page==='bookings') fetchBookings();
  }, [bookingFilter]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  // ── Sidebar ───────────────────────────────────────
  const Sidebar = () => (
    <div style={css.sidebar}>
      <div style={css.brand}>
        <div style={css.logo}>B</div>
        <div style={{color:'white',fontWeight:700,fontSize:15}}>Bless Dhi</div>
        <div style={{color:'rgba(255,255,255,0.4)',fontSize:11,marginTop:2}}>Manager Portal</div>
        <div style={{marginTop:8,fontSize:12,color:'rgba(255,255,255,0.6)',fontWeight:500}}>{user.fullName}</div>
      </div>
      <div style={{flex:1,overflowY:'auto',paddingTop:8}}>
        {NAV.map(item => (
          <div key={item.id} style={css.navItem(page===item.id)}
            onClick={() => setPage(item.id)}>
            <span style={{background:page===item.id?'rgba(201,168,76,0.2)':'rgba(255,255,255,0.05)',borderRadius:6,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:page===item.id?'#e8c96a':'rgba(255,255,255,0.4)'}}>
              {item.icon}
            </span>
            {item.label}
            {item.id==='messages' && stats?.unreadMessages > 0 && (
              <span style={{marginLeft:'auto',background:C.danger,color:'white',borderRadius:100,fontSize:10,fontWeight:700,padding:'2px 7px'}}>
                {stats.unreadMessages}
              </span>
            )}
            {item.id==='bookings' && stats?.pendingBookings > 0 && (
              <span style={{marginLeft:'auto',background:C.warning,color:'white',borderRadius:100,fontSize:10,fontWeight:700,padding:'2px 7px'}}>
                {stats.pendingBookings}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'12px 0'}}>
        <div style={css.navItem(false)} onClick={handleLogout}>
          <span style={{fontSize:13}}>{'<-'}</span> Logout
        </div>
      </div>
    </div>
  );

  // ── Dashboard Page ────────────────────────────────
  const DashboardPage = () => (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>Welcome back, {user.fullName?.split(' ')[0]}</div>
          <div style={css.pageSub}>Here is your hostel management overview</div>
        </div>
        <button style={css.btn(C.blue)} onClick={() => setPage('hostel')}>Manage Hostel</button>
      </div>

      <div style={{display:'flex',gap:16,marginBottom:28,flexWrap:'wrap'}}>
        {[
          {label:'Pending Bookings',  value:stats?.pendingBookings  ??0, color:C.warning},
          {label:'Approved Bookings', value:stats?.approvedBookings ??0, color:C.green},
          {label:'Unread Messages',   value:stats?.unreadMessages   ??0, color:C.sky},
          {label:'Total Rooms',       value:stats?.totalRooms       ??0, color:C.purple},
        ].map(s => (
          <div key={s.label} style={css.statCard(s.color)}>
            <div style={css.statNum(s.color)}>{s.value}</div>
            <div style={css.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {hostel ? (
        <div style={{...css.card,marginBottom:24,borderLeft:`4px solid ${hostel.is_approved?C.green:C.warning}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:C.dark}}>{hostel.name}</div>
              <div style={{fontSize:13,color:C.gray,marginTop:4}}>{hostel.location}</div>
            </div>
            <span style={css.badge(hostel.is_approved?'approved':'pending')}>
              {hostel.is_approved?'Approved':'Pending Approval'}
            </span>
          </div>
        </div>
      ) : (
        <div style={{...css.card,marginBottom:24,background:'#fff8e1',border:'1px solid #ffe082'}}>
          <div style={{fontSize:14,color:'#e65100',fontWeight:600}}>No hostel registered yet.</div>
          <div style={{fontSize:13,color:'#f57c00',marginTop:4}}>Go to My Hostel to register your property.</div>
        </div>
      )}

      <div style={css.card}>
        <div style={css.sectionTitle}>Recent Bookings</div>
        {stats?.recentBookings?.length > 0 ? (
          <table style={css.table}>
            <thead>
              <tr>{['Client','Room','People','Status','Date'].map(h => <th key={h} style={css.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b,i) => (
                <tr key={b.id}>
                  <td style={i%2?css.tdAlt:css.td}>{b.client_name}</td>
                  <td style={i%2?css.tdAlt:css.td}>{b.room_type}</td>
                  <td style={i%2?css.tdAlt:css.td}>{b.number_of_people}</td>
                  <td style={i%2?css.tdAlt:css.td}><span style={css.badge(b.status)}>{b.status}</span></td>
                  <td style={i%2?css.tdAlt:css.td}>{new Date(b.request_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={css.emptyState}>
            <div style={{fontSize:36,marginBottom:10}}>📋</div>
            <div style={{fontSize:14,fontWeight:500}}>No bookings yet</div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Hostel Page ───────────────────────────────────
  const HostelPage = () => {
    const [form, setForm] = useState({
      name:hostel?.name||'', location:hostel?.location||'',
      address:hostel?.address||'', description:hostel?.description||'',
      contactPhone:hostel?.contact_phone||'',
    });
    const [err, setErr]     = useState('');
    const [saving,setSaving]= useState(false);

    const save = async () => {
      if (!form.name||!form.location||!form.contactPhone) {
        setErr('Name, location and contact are required.'); return;
      }
      setSaving(true); setErr('');
      try {
        const method = hostel ? 'put' : 'post';
        const { data } = await api[method]('/manager/hostel', form);
        setHostel(data.hostel);
        showToast(data.message);
        fetchStats();
      } catch (e) {
        setErr(e.response?.data?.error||'Failed to save.');
      } finally { setSaving(false); }
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>My Hostel</div>
            <div style={css.pageSub}>Manage your hostel details</div>
          </div>
          {hostel && (
            <span style={css.badge(hostel.is_approved?'approved':'pending')}>
              {hostel.is_approved?'Approved':'Pending Approval'}
            </span>
          )}
        </div>
        <div style={css.card}>
          <div style={css.sectionTitle}>{hostel?'Edit Hostel Details':'Register New Hostel'}</div>
          {err && <div style={css.errorBox}>{err}</div>}
          <div style={css.twoCol}>
            <div style={css.formRow}>
              <label style={css.label}>Hostel Name *</label>
              <input style={css.input} value={form.name}
                onChange={e => setForm(p=>({...p,name:e.target.value}))}
                placeholder="e.g. Sunrise Hostel" />
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Location *</label>
              <input style={css.input} value={form.location}
                onChange={e => setForm(p=>({...p,location:e.target.value}))}
                placeholder="e.g. East Legon, Accra" />
            </div>
          </div>
          <div style={css.twoCol}>
            <div style={css.formRow}>
              <label style={css.label}>Address</label>
              <input style={css.input} value={form.address}
                onChange={e => setForm(p=>({...p,address:e.target.value}))}
                placeholder="e.g. 12 Ring Road East" />
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Contact Phone *</label>
              <input style={css.input} value={form.contactPhone}
                onChange={e => setForm(p=>({...p,contactPhone:e.target.value}))}
                placeholder="e.g. +233244123456" />
            </div>
          </div>
          <div style={css.formRow}>
            <label style={css.label}>Description</label>
            <textarea style={{...css.input,minHeight:80,resize:'vertical'}}
              value={form.description}
              onChange={e => setForm(p=>({...p,description:e.target.value}))}
              placeholder="Describe your hostel..." />
          </div>
          <button style={{...css.btn(C.blue),opacity:saving?0.7:1}}
            onClick={save} disabled={saving}>
            {saving?'Saving...':hostel?'Save Changes':'Register Hostel'}
          </button>
        </div>
      </div>
    );
  };

  // ── Rooms Page ────────────────────────────────────
  const RoomsPage = () => {
    const [form, setForm] = useState({
      roomType:editingRoom?.room_type||'2-in-1',
      totalRooms:editingRoom?.total_rooms||5,
      availableRooms:editingRoom?.available_rooms||5,
      pricePerPerson:editingRoom?.price_per_person||800,
      description:editingRoom?.description||'',
    });
    const [err,setErr]     = useState('');
    const [saving,setSaving]=useState(false);

    const saveRoom = async () => {
      if (form.availableRooms > form.totalRooms) {
        setErr('Available cannot exceed total.'); return;
      }
      setSaving(true); setErr('');
      try {
        if (editingRoom) {
          await api.put(`/manager/rooms/${editingRoom.id}`, form);
          showToast('Room updated.');
        } else {
          await api.post('/manager/rooms', form);
          showToast('Room added.');
        }
        setEditingRoom(null); setShowRoomModal(false); fetchRooms();
      } catch (e) {
        setErr(e.response?.data?.error||'Failed.');
      } finally { setSaving(false); }
    };

    const deleteRoom = (id) => {
      setConfirm({
        message:'Delete this room type?',
        onConfirm: async () => {
          setConfirm(null);
          try { await api.delete(`/manager/rooms/${id}`); showToast('Room deleted.'); fetchRooms(); }
          catch { showToast('Failed to delete.','error'); }
        },
        onCancel: () => setConfirm(null),
      });
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Room Management</div>
            <div style={css.pageSub}>Add and manage room types</div>
          </div>
          <button style={css.btn(C.blue)} onClick={() => {setEditingRoom(null);setShowRoomModal(true);}}>
            + Add Room Type
          </button>
        </div>
        <div style={css.card}>
          {rooms.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>{['Room Type','Total','Available','Price (GHC)','Status','Actions'].map(h=><th key={h} style={css.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {rooms.map((r,i) => (
                  <tr key={r.id}>
                    <td style={i%2?css.tdAlt:css.td}><strong>{r.room_type}</strong></td>
                    <td style={i%2?css.tdAlt:css.td}>{r.total_rooms}</td>
                    <td style={i%2?css.tdAlt:css.td}>{r.available_rooms}</td>
                    <td style={i%2?css.tdAlt:css.td}>GHC {Number(r.price_per_person).toFixed(2)}</td>
                    <td style={i%2?css.tdAlt:css.td}><span style={css.badge(r.is_active?'active':'inactive')}>{r.is_active?'Active':'Inactive'}</span></td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{display:'flex',gap:8}}>
                        <button style={css.btn(C.blue,true)} onClick={() => {setEditingRoom(r);setShowRoomModal(true);}}>Edit</button>
                        <button style={css.btn(C.danger,true)} onClick={() => deleteRoom(r.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{fontSize:36,marginBottom:10}}>🛏</div>
              <div style={{fontSize:14,fontWeight:500}}>No rooms added yet</div>
              <div style={{fontSize:12,marginTop:4}}>Click "Add Room Type" to get started</div>
            </div>
          )}
        </div>

        {showRoomModal && (
          <Modal title={editingRoom?'Edit Room':'Add Room Type'}
            onClose={() => {setShowRoomModal(false);setEditingRoom(null);}}>
            {err && <div style={css.errorBox}>{err}</div>}
            <div style={css.formRow}>
              <label style={css.label}>Room Type *</label>
              <select style={css.input} value={form.roomType}
                onChange={e => setForm(p=>({...p,roomType:e.target.value}))}>
                {['2-in-1','3-in-1','4-in-1','Self-contained','Single','Double'].map(t=>(
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div style={css.twoCol}>
              <div style={css.formRow}>
                <label style={css.label}>Total Rooms *</label>
                <input style={css.input} type="number" min={1} value={form.totalRooms}
                  onChange={e => setForm(p=>({...p,totalRooms:+e.target.value}))} />
              </div>
              <div style={css.formRow}>
                <label style={css.label}>Available *</label>
                <input style={css.input} type="number" min={0} value={form.availableRooms}
                  onChange={e => setForm(p=>({...p,availableRooms:+e.target.value}))} />
              </div>
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Price per Person (GHC) *</label>
              <input style={css.input} type="number" min={0} step="0.01" value={form.pricePerPerson}
                onChange={e => setForm(p=>({...p,pricePerPerson:+e.target.value}))} />
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Description</label>
              <textarea style={{...css.input,minHeight:70,resize:'vertical'}}
                value={form.description}
                onChange={e => setForm(p=>({...p,description:e.target.value}))}
                placeholder="Optional..." />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button style={css.btn(C.gray,true)} onClick={() => {setShowRoomModal(false);setEditingRoom(null);}}>Cancel</button>
              <button style={{...css.btn(C.blue),opacity:saving?0.7:1}} onClick={saveRoom} disabled={saving}>
                {saving?'Saving...':editingRoom?'Save Changes':'Add Room'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  // ── Bookings Page ─────────────────────────────────
  const BookingsPage = () => {
    const handleAction = async (id, status) => {
      try {
        await api.patch(`/manager/bookings/${id}`, {status});
        showToast(`Booking ${status}.`);
        fetchBookings(); fetchStats();
      } catch (e) {
        showToast(e.response?.data?.error||'Failed.','error');
      }
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Booking Requests</div>
            <div style={css.pageSub}>Manage client booking requests</div>
          </div>
          <button style={css.btn(C.gray,true)} onClick={fetchBookings}>Refresh</button>
        </div>

        <div style={css.tabRow}>
          {['all','pending','approved','rejected'].map(s => (
            <button key={s} style={css.tab(bookingFilter===s)}
              onClick={() => setBookingFilter(s)}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        <div style={css.card}>
          {bookings.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>{['Client','Contact','Room','People','Status','Date','Actions'].map(h=><th key={h} style={css.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {bookings.map((b,i) => (
                  <tr key={b.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{fontWeight:600}}>{b.client_name}</div>
                      <div style={{fontSize:11,color:C.gray}}>{b.client_email}</div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>{b.client_phone||'—'}</td>
                    <td style={i%2?css.tdAlt:css.td}>{b.room_type}</td>
                    <td style={i%2?css.tdAlt:css.td}>{b.number_of_people}</td>
                    <td style={i%2?css.tdAlt:css.td}><span style={css.badge(b.status)}>{b.status}</span></td>
                    <td style={i%2?css.tdAlt:css.td}>{new Date(b.request_date).toLocaleDateString()}</td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {b.status==='pending' && (
                        <div style={{display:'flex',gap:6}}>
                          <button style={css.btn(C.green)} onClick={() => handleAction(b.id,'approved')}>Approve</button>
                          <button style={css.btn(C.danger)} onClick={() => handleAction(b.id,'rejected')}>Reject</button>
                        </div>
                      )}
                      {b.status!=='pending' && <span style={{color:C.gray,fontSize:12}}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{fontSize:36,marginBottom:10}}>📋</div>
              <div style={{fontSize:14,fontWeight:500}}>No {bookingFilter==='all'?'':bookingFilter} bookings</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Messages Page ─────────────────────────────────
  const MessagesPage = () => {
    const [replyForm, setReplyForm] = useState({subject:'',content:''});
    const [replyErr,  setReplyErr]  = useState('');
    const [replySaving,setReplySaving]=useState(false);

    const markRead = async (id) => {
      try { await api.patch(`/manager/messages/${id}/read`); fetchMessages(); fetchStats(); } catch {}
    };

    const sendReply = async () => {
      if (!replyForm.content) { setReplyErr('Message content is required.'); return; }
      setReplySaving(true); setReplyErr('');
      try {
        await api.post('/manager/messages/reply', {
          receiverId: replyTarget.sender_id,
          subject: replyForm.subject || 'Re: '+replyTarget.subject,
          content: replyForm.content,
          hostelId: hostel?.id,
        });
        showToast('Reply sent.');
        setShowReplyModal(false); setReplyTarget(null); fetchMessages();
      } catch (e) {
        setReplyErr(e.response?.data?.error||'Failed to send.');
      } finally { setReplySaving(false); }
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Messages Inbox</div>
            <div style={css.pageSub}>{messages.filter(m=>!m.is_read).length} unread</div>
          </div>
          <button style={css.btn(C.gray,true)} onClick={fetchMessages}>Refresh</button>
        </div>

        <div style={css.card}>
          {messages.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>{['From','Subject','Status','Date',''].map(h=><th key={h} style={css.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {messages.map((m,i) => (
                  <tr key={m.id}
                    style={{cursor:'pointer',fontWeight:m.is_read?400:700,background:!m.is_read?'#f0f4ff':'transparent'}}
                    onClick={() => fetchMsgDetail(m.id)}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{fontWeight:600}}>{m.sender_name}</div>
                      <div style={{fontSize:11,color:C.gray}}>{m.sender_email}</div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>{m.subject||'(no subject)'}</td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(m.is_read?'approved':'pending')}>
                        {m.is_read?'Read':'Unread'}
                      </span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>{new Date(m.created_at).toLocaleDateString()}</td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={{fontSize:11,color:C.sky,fontWeight:600}}>Click to read →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{fontSize:36,marginBottom:10}}>✉</div>
              <div style={{fontSize:14,fontWeight:500}}>No messages yet</div>
            </div>
          )}
        </div>

        {showMsgDetail && msgDetail && (
          <Modal title="Message from Client"
            onClose={() => { setShowMsgDetail(false); setMsgDetail(null); }}>
            <div style={{background:'#f8faff',border:`1px solid ${C.border}`,borderRadius:10,padding:'16px 18px',marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <div>
                  <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>From</div>
                  <div style={{fontSize:15,fontWeight:700,color:C.dark,marginTop:3}}>{msgDetail.sender_name}</div>
                  <div style={{fontSize:12,color:C.gray}}>
                    {msgDetail.sender_email}
                    {msgDetail.sender_phone && ` · ${msgDetail.sender_phone}`}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>Date</div>
                  <div style={{fontSize:12,color:C.gray,marginTop:3}}>{new Date(msgDetail.created_at).toLocaleString()}</div>
                </div>
              </div>
              <div style={{fontSize:11,color:C.gray,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,marginBottom:4}}>Subject</div>
              <div style={{fontSize:14,fontWeight:600,color:C.dark}}>{msgDetail.subject||'(no subject)'}</div>
            </div>
            <div style={{fontSize:14,color:C.dark,lineHeight:1.8,padding:16,background:'white',border:`1px solid ${C.border}`,borderRadius:10,minHeight:100,whiteSpace:'pre-wrap',marginBottom:16}}>
              {msgDetail.content}
            </div>
            <button style={{...css.btn(C.blue),width:'100%',padding:12}}
              onClick={() => {
                setShowMsgDetail(false);
                setReplyTarget(msgDetail);
                setReplyForm({subject:'Re: '+msgDetail.subject, content:''});
                setShowReplyModal(true);
              }}>
              Reply to {msgDetail.sender_name}
            </button>
          </Modal>
        )}

        {showReplyModal && replyTarget && (
          <Modal title={`Reply to ${replyTarget.sender_name}`}
            onClose={() => { setShowReplyModal(false); setReplyTarget(null); }}>
            {replyErr && <div style={css.errorBox}>{replyErr}</div>}
            <div style={css.formRow}>
              <label style={css.label}>Subject</label>
              <input style={css.input} value={replyForm.subject}
                onChange={e => setReplyForm(p=>({...p,subject:e.target.value}))} />
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Message *</label>
              <textarea style={{...css.input,minHeight:120,resize:'vertical'}}
                value={replyForm.content}
                onChange={e => setReplyForm(p=>({...p,content:e.target.value}))}
                placeholder="Type your reply..." />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button style={css.btn(C.gray,true)} onClick={() => {setShowReplyModal(false);setReplyTarget(null);}}>Cancel</button>
              <button style={{...css.btn(C.blue),opacity:replySaving?0.7:1}} onClick={sendReply} disabled={replySaving}>
                {replySaving?'Sending...':'Send Reply'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  // ── Media Page ────────────────────────────────────
  const MediaPage = () => {
    const [uploading, setUploading] = useState(false);
    const fileRef = React.useRef();

    const handleUpload = async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      setUploading(true);
      const fd = new FormData();
      for (const f of files) fd.append('files', f);
      try {
        const { data } = await api.post('/manager/media', fd,
          {headers:{'Content-Type':'multipart/form-data'}});
        showToast(data.message); fetchMedia();
      } catch (e) {
        showToast(e.response?.data?.error||'Upload failed.','error');
      } finally { setUploading(false); e.target.value=''; }
    };

    const deleteMedia = (id) => {
      setConfirm({
        message:'Delete this media file?',
        onConfirm: async () => {
          setConfirm(null);
          try { await api.delete(`/manager/media/${id}`); showToast('Media deleted.'); fetchMedia(); }
          catch { showToast('Failed to delete.','error'); }
        },
        onCancel: () => setConfirm(null),
      });
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Hostel Media</div>
            <div style={css.pageSub}>Upload photos and videos</div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*"
              style={{display:'none'}} onChange={handleUpload} />
            <button style={{...css.btn(C.blue),opacity:uploading?0.7:1}}
              onClick={() => fileRef.current.click()} disabled={uploading}>
              {uploading?'Uploading...':'Upload Media'}
            </button>
          </div>
        </div>

        <div style={{...css.card,marginBottom:20,border:'2px dashed #cbd5e1',background:'#f8faff',textAlign:'center',padding:32,cursor:'pointer'}}
          onClick={() => fileRef.current.click()}>
          <div style={{fontSize:32,marginBottom:8}}>+</div>
          <div style={{fontSize:14,fontWeight:600,color:C.blue}}>Click to upload photos or videos</div>
          <div style={{fontSize:12,color:C.gray,marginTop:4}}>JPG, PNG, GIF, MP4, AVI, MKV, MOV — max 100MB each</div>
        </div>

        {media.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
            {media.map(m => (
              <div key={m.id} style={{...css.card,padding:0,overflow:'hidden'}}>
                {m.file_type==='image' ? (
                  <img src={`${API_BASE}${m.file_path}`} alt="media"
                    style={{width:'100%',height:150,objectFit:'cover'}}
                    onError={e => {e.target.style.display='none';}} />
                ) : (
                  <div style={{height:150,background:'#1a1a2e',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8}}>
                    <div style={{fontSize:28,color:'white'}}>▶</div>
                    <div style={{fontSize:11,color:'#90a4ae'}}>Video</div>
                  </div>
                )}
                <div style={{padding:'10px 12px'}}>
                  <div style={{fontSize:11,color:C.gray,marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {m.file_path.split('/').pop()}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={css.badge(m.file_type==='image'?'approved':'pending')}>{m.file_type}</span>
                    <button style={{...css.btn(C.danger,true),padding:'4px 10px',fontSize:11}}
                      onClick={() => deleteMedia(m.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={css.emptyState}>
            <div style={{fontSize:36,marginBottom:10}}>📸</div>
            <div style={{fontSize:14,fontWeight:500}}>No media uploaded yet</div>
            <div style={{fontSize:12,marginTop:4}}>Upload photos and videos to showcase your hostel</div>
          </div>
        )}
      </div>
    );
  };

  // ── Notices Page ──────────────────────────────────
  const NoticesPage = () => {
    const [form, setForm]   = useState({title:'',content:''});
    const [err,  setErr]    = useState('');
    const [saving,setSaving]= useState(false);

    const postNotice = async () => {
      if (!form.title||!form.content) { setErr('Title and content are required.'); return; }
      setSaving(true); setErr('');
      try {
        await api.post('/manager/notices', form);
        showToast('Notice posted.');
        setForm({title:'',content:''});
        setShowNoticeModal(false); fetchNotices();
      } catch (e) {
        setErr(e.response?.data?.error||'Failed.');
      } finally { setSaving(false); }
    };

    const deleteNotice = (id) => {
      setConfirm({
        message:'Delete this notice?',
        onConfirm: async () => {
          setConfirm(null);
          try { await api.delete(`/manager/notices/${id}`); showToast('Notice deleted.'); fetchNotices(); }
          catch { showToast('Failed.','error'); }
        },
        onCancel: () => setConfirm(null),
      });
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>Notice Board</div>
            <div style={css.pageSub}>Post announcements to your clients</div>
          </div>
          <button style={css.btn(C.blue)} onClick={() => setShowNoticeModal(true)}>+ Post Notice</button>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {notices.length > 0 ? notices.map(n => (
            <div key={n.id} style={{...css.card,borderLeft:`4px solid ${C.warning}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.dark,marginBottom:6}}>{n.title}</div>
                  <div style={{fontSize:13,color:C.gray,lineHeight:1.6}}>{n.content}</div>
                  <div style={{fontSize:11,color:'#b0bec5',marginTop:8}}>{new Date(n.created_at).toLocaleString()}</div>
                </div>
                <button style={{...css.btn(C.danger,true),marginLeft:16,flexShrink:0}}
                  onClick={() => deleteNotice(n.id)}>Delete</button>
              </div>
            </div>
          )) : (
            <div style={css.emptyState}>
              <div style={{fontSize:36,marginBottom:10}}>📢</div>
              <div style={{fontSize:14,fontWeight:500}}>No notices posted</div>
            </div>
          )}
        </div>

        {showNoticeModal && (
          <Modal title="Post Notice" onClose={() => setShowNoticeModal(false)}>
            {err && <div style={css.errorBox}>{err}</div>}
            <div style={css.formRow}>
              <label style={css.label}>Title *</label>
              <input style={css.input} value={form.title}
                onChange={e => setForm(p=>({...p,title:e.target.value}))}
                placeholder="e.g. Water Outage Notice" />
            </div>
            <div style={css.formRow}>
              <label style={css.label}>Content *</label>
              <textarea style={{...css.input,minHeight:100,resize:'vertical'}}
                value={form.content}
                onChange={e => setForm(p=>({...p,content:e.target.value}))}
                placeholder="Notice details..." />
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button style={css.btn(C.gray,true)} onClick={() => setShowNoticeModal(false)}>Cancel</button>
              <button style={{...css.btn(C.warning),opacity:saving?0.7:1}} onClick={postNotice} disabled={saving}>
                {saving?'Posting...':'Post Notice'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────
  const pages = {
    dashboard: <DashboardPage />,
    hostel:    <HostelPage />,
    rooms:     <RoomsPage />,
    bookings:  <BookingsPage />,
    messages:  <MessagesPage />,
    media:     <MediaPage />,
    notices:   <NoticesPage />,
  };

  return (
    <div style={css.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar />
      <main style={css.main}>{pages[page]}</main>
      <Toast msg={toast.msg} type={toast.type} />
      {confirm && <Confirm {...confirm} />}
    </div>
  );
}