import React, {
  useState, useEffect, useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const C = {
  navy:   '#0d1b3e',
  blue:   '#1a237e',
  sky:    '#4a7ff7',
  green:  '#2e7d32',
  gold:   '#c9a84c',
  danger: '#c62828',
  warn:   '#e65100',
  purple: '#6a1b9a',
  card:   '#ffffff',
  border: '#e2e8f0',
  dark:   '#0f172a',
  gray:   '#64748b',
  sidebar:'#0a1628',
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
    zIndex:50,
    boxShadow:'4px 0 24px rgba(0,0,0,0.2)',
  },
  brand: {
    padding:'24px 20px',
    background:'rgba(255,255,255,0.03)',
    borderBottom:'1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    width:42, height:42,
    background:'linear-gradient(135deg,#c9a84c,#e8c96a)',
    borderRadius:10,
    display:'flex', alignItems:'center',
    justifyContent:'center',
    fontWeight:900, fontSize:20,
    color:C.navy, fontFamily:'Georgia,serif',
    marginBottom:10,
  },
  navItem: active => ({
    display:'flex', alignItems:'center',
    gap:12, padding:'11px 20px',
    cursor:'pointer', transition:'all 0.15s',
    borderLeft: active
      ? '3px solid #c9a84c'
      : '3px solid transparent',
    background: active
      ? 'rgba(201,168,76,0.1)' : 'transparent',
    color: active ? '#e8c96a' : 'rgba(255,255,255,0.55)',
    fontSize:13, fontWeight: active ? 600 : 400,
  }),
  navIcon: active => ({
    background: active
      ? 'rgba(201,168,76,0.2)'
      : 'rgba(255,255,255,0.05)',
    borderRadius:6, width:28, height:28,
    display:'flex', alignItems:'center',
    justifyContent:'center',
    fontSize:11, fontWeight:700,
    color: active ? '#e8c96a' : 'rgba(255,255,255,0.35)',
    flexShrink:0,
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
    background:C.card,
    border:`1px solid ${C.border}`,
    borderRadius:14, padding:24,
    boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
  },
  statCard: color => ({
    background:C.card,
    border:`1px solid ${C.border}`,
    borderRadius:14, padding:'20px 24px',
    borderLeft:`4px solid ${color}`,
    flex:1, minWidth:120,
    boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
  }),
  statNum: color => ({
    fontSize:32, fontWeight:800,
    color, fontFamily:'Georgia,serif', lineHeight:1,
  }),
  statLabel: {
    fontSize:12, color:C.gray,
    marginTop:6, fontWeight:500,
  },
  btn: (color, outline=false, sm=false) => ({
    background: outline ? 'transparent' : color,
    color: outline ? color : 'white',
    border: outline ? `1.5px solid ${color}` : 'none',
    borderRadius:8,
    padding: sm ? '5px 12px' : '8px 18px',
    fontSize: sm ? 12 : 13,
    fontWeight:600, cursor:'pointer',
    whiteSpace:'nowrap', transition:'opacity 0.15s',
  }),
  input: {
    width:'100%',
    border:`1.5px solid ${C.border}`,
    borderRadius:8, padding:'10px 12px',
    fontSize:13, color:C.dark,
    outline:'none', boxSizing:'border-box',
    background:'white',
  },
  label: {
    display:'block', fontSize:12,
    fontWeight:600, color:'#475569', marginBottom:6,
  },
  formRow: { marginBottom:14 },
  twoCol: {
    display:'grid',
    gridTemplateColumns:'1fr 1fr', gap:14,
  },
  table: {
    width:'100%', borderCollapse:'collapse', fontSize:13,
  },
  th: {
    background:C.blue, color:'white',
    padding:'10px 14px', textAlign:'left',
    fontSize:12, fontWeight:600, letterSpacing:0.3,
  },
  td: {
    padding:'11px 14px',
    borderBottom:`1px solid ${C.border}`,
    color:C.dark, verticalAlign:'middle',
  },
  tdAlt: {
    padding:'11px 14px',
    borderBottom:`1px solid ${C.border}`,
    color:C.dark, verticalAlign:'middle',
    background:'#f8faff',
  },
  badge: s => {
    const m = {
      pending:  {bg:'#fff3e0',color:'#e65100'},
      approved: {bg:'#e8f5e9',color:'#2e7d32'},
      rejected: {bg:'#ffebee',color:'#c62828'},
      active:   {bg:'#e8f5e9',color:'#2e7d32'},
      inactive: {bg:'#f5f5f5',color:'#9e9e9e'},
      client:   {bg:'#e3f2fd',color:'#1565c0'},
      manager:  {bg:'#f3e5f5',color:'#6a1b9a'},
    };
    const st = m[s] || m.pending;
    return {
      display:'inline-block',
      background:st.bg, color:st.color,
      padding:'3px 10px', borderRadius:100,
      fontSize:11, fontWeight:700,
      textTransform:'capitalize',
    };
  },
  modal: {
    position:'fixed', inset:0, zIndex:200,
    background:'rgba(0,0,0,0.55)',
    display:'flex', alignItems:'center',
    justifyContent:'center', padding:20,
  },
  modalCard: {
    background:'white', borderRadius:16,
    padding:32, width:'100%', maxWidth:520,
    maxHeight:'90vh', overflowY:'auto',
    boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
  },
  errorBox: {
    background:'#ffebee',
    border:'1px solid #ef9a9a',
    borderRadius:8, color:C.danger,
    fontSize:12, padding:'10px 14px', marginBottom:14,
  },
  tabRow: {
    display:'flex', gap:4,
    background:'#f1f5f9',
    borderRadius:10, padding:4, marginBottom:20,
  },
  tab: active => ({
    flex:1, padding:'8px 12px', borderRadius:8,
    border:'none',
    background: active ? 'white' : 'transparent',
    color: active ? C.blue : C.gray,
    fontSize:12, fontWeight: active ? 700 : 500,
    cursor:'pointer',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)':'none',
    transition:'all 0.15s',
  }),
  searchRow: {
    display:'flex', gap:10, marginBottom:16,
    alignItems:'center', flexWrap:'wrap',
  },
  emptyState: {
    textAlign:'center', padding:'48px 20px', color:C.gray,
  },
};

function Modal({ title, onClose, children }) {
  return (
    <div style={css.modal} onClick={onClose}>
      <div style={css.modalCard}
        onClick={e => e.stopPropagation()}>
        <div style={{
          display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:20,
        }}>
          <div style={{
            fontSize:18, fontWeight:700, color:C.dark,
            fontFamily:'Georgia,serif',
          }}>
            {title}
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none',
            fontSize:20, cursor:'pointer', color:C.gray,
          }}>
            x
          </button>
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

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div style={css.modal}>
      <div style={{ ...css.modalCard, maxWidth:360 }}>
        <div style={{
          fontSize:16, fontWeight:700,
          marginBottom:12, color:C.dark,
        }}>
          Confirm Action
        </div>
        <div style={{
          fontSize:14, color:C.gray,
          marginBottom:24, lineHeight:1.6,
        }}>
          {message}
        </div>
        <div style={{
          display:'flex', gap:10,
          justifyContent:'flex-end',
        }}>
          <button style={css.btn(C.gray, true)}
            onClick={onCancel}>
            Cancel
          </button>
          <button style={css.btn(C.danger)}
            onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { id:'dashboard', label:'Dashboard',  letter:'D' },
  { id:'users',     label:'Users',      letter:'U' },
  { id:'hostels',   label:'Hostels',    letter:'H' },
  { id:'bookings',  label:'Bookings',   letter:'B' },
  { id:'profile',   label:'My Profile', letter:'P' },
];

// ─────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate  = useNavigate();
  const user      = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const [page, setPage]       = useState('dashboard');
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [toast, setToast]     = useState({msg:'',type:''});
  const [confirm, setConfirm] = useState(null);
  const [profile, setProfile] = useState(null);

  // Filters
  const [userSearch, setUserSearch]   = useState('');
  const [userRole,   setUserRole]     = useState('all');
  const [hostelTab,  setHostelTab]    = useState('all');
  const [bookingTab, setBookingTab]   = useState('all');

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser,   setEditingUser]   = useState(null);

  const showToast = (msg, type='success') => {
    setToast({msg, type});
    setTimeout(() => setToast({msg:'',type:''}), 3500);
  };

  // ── Fetchers ─────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userSearch) params.set('search', userSearch);
      if (userRole !== 'all') params.set('role', userRole);
      const { data } = await api.get(
        `/admin/users?${params}`
      );
      setUsers(data.users);
    } catch {}
  }, [userSearch, userRole]);

  const fetchHostels = useCallback(async () => {
    try {
      const s = hostelTab !== 'all' ? hostelTab : '';
      const { data } = await api.get(
        `/admin/hostels${s ? `?status=${s}` : ''}`
      );
      setHostels(data.hostels);
    } catch {}
  }, [hostelTab]);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/admin/bookings?status=${bookingTab}`
      );
      setBookings(data.bookings);
    } catch {}
  }, [bookingTab]);

  const fetchProfile = useCallback(async () => {
  try {
    const { data } = await api.get('/admin/profile');
    setProfile(data.admin);
  } catch {}
}, []);

  useEffect(() => {
    if (page === 'dashboard') fetchStats();
    if (page === 'users')     fetchUsers();
    if (page === 'hostels')   fetchHostels();
    if (page === 'bookings')  fetchBookings();
    if (page === 'profile')   fetchProfile();
  }, [page]);

  useEffect(() => {
    if (page === 'users') fetchUsers();
  }, [userSearch, userRole]);

  useEffect(() => {
    if (page === 'hostels') fetchHostels();
  }, [hostelTab]);

  useEffect(() => {
    if (page === 'bookings') fetchBookings();
  }, [bookingTab]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // ─────────────────────────────────────────────────
  //  SIDEBAR
  // ─────────────────────────────────────────────────
  const Sidebar = () => (
    <div style={css.sidebar}>
      <div style={css.brand}>
        <div style={css.logo}>B</div>
        <div style={{
          color:'white', fontWeight:700,
          fontSize:15, letterSpacing:0.3,
        }}>
          Bless Dhi
        </div>
        <div style={{
          color:'rgba(255,255,255,0.35)',
          fontSize:11, marginTop:2,
        }}>
          Admin Panel
        </div>
        <div style={{
          marginTop:10, display:'inline-block',
          background:'rgba(201,168,76,0.15)',
          border:'1px solid rgba(201,168,76,0.3)',
          color:'#e8c96a', fontSize:11,
          fontWeight:700, padding:'3px 10px',
          borderRadius:100, letterSpacing:0.5,
        }}>
          ADMINISTRATOR
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', paddingTop:8 }}>
        {NAV.map(item => (
          <div key={item.id}
            style={css.navItem(page === item.id)}
            onClick={() => setPage(item.id)}>
            <span style={css.navIcon(page === item.id)}>
              {item.letter}
            </span>
            {item.label}
            {item.id === 'hostels' &&
              stats?.pendingHostels > 0 && (
              <span style={{
                marginLeft:'auto',
                background:C.warn, color:'white',
                borderRadius:100, fontSize:10,
                fontWeight:700, padding:'2px 7px',
              }}>
                {stats.pendingHostels}
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{
        borderTop:'1px solid rgba(255,255,255,0.06)',
        padding:'12px 0',
      }}>
        <div style={css.navItem(false)}
          onClick={handleLogout}>
          <span style={css.navIcon(false)}>{'<'}</span>
          Logout
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────
  //  DASHBOARD PAGE
  // ─────────────────────────────────────────────────
  const DashboardPage = () => (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>
            System Dashboard
          </div>
          <div style={css.pageSub}>
            Full platform overview
          </div>
        </div>
        <button style={css.btn(C.gold)}
          onClick={fetchStats}>
          Refresh
        </button>
      </div>

      {/* Main stats */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(5,1fr)',
        gap:14, marginBottom:24,
      }}>
        {[
          { label:'Total Users',
            value:stats?.totalUsers    ?? 0, color:C.blue },
          { label:'Clients',
            value:stats?.totalClients  ?? 0, color:C.sky },
          { label:'Managers',
            value:stats?.totalManagers ?? 0, color:C.purple },
          { label:'Total Hostels',
            value:stats?.totalHostels  ?? 0, color:C.gold },
          { label:'Pending Approval',
            value:stats?.pendingHostels ?? 0, color:C.warn },
        ].map(s => (
          <div key={s.label} style={css.statCard(s.color)}>
            <div style={css.statNum(s.color)}>{s.value}</div>
            <div style={css.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:14, marginBottom:24,
      }}>
        {[
          { label:'Total Bookings',
            value:stats?.totalBookings   ?? 0, color:C.green },
          { label:'Pending Bookings',
            value:stats?.pendingBookings ?? 0, color:C.warn },
          { label:'Total Messages',
            value:stats?.totalMessages   ?? 0, color:C.sky },
        ].map(s => (
          <div key={s.label} style={css.statCard(s.color)}>
            <div style={css.statNum(s.color)}>{s.value}</div>
            <div style={css.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two column: recent users + recent hostels */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'1fr 1fr', gap:20,
      }}>
        {/* Recent users */}
        <div style={css.card}>
          <div style={{
            fontSize:14, fontWeight:700,
            color:C.dark, marginBottom:14,
          }}>
            Recent Users
          </div>
          {stats?.recentUsers?.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>
                  {['Name','Role','Status'].map(h => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ fontWeight:600 }}>
                        {u.full_name}
                      </div>
                      <div style={{
                        fontSize:11, color:C.gray,
                      }}>
                        @{u.username}
                      </div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(u.role)}>
                        {u.role}
                      </span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(
                        u.is_active ? 'active' : 'inactive'
                      )}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>No users yet</div>
          )}
        </div>

        {/* Recent hostels */}
        <div style={css.card}>
          <div style={{
            fontSize:14, fontWeight:700,
            color:C.dark, marginBottom:14,
            display:'flex', justifyContent:'space-between',
          }}>
            <span>Recent Hostels</span>
            {stats?.pendingHostels > 0 && (
              <span style={{
                background:C.warn, color:'white',
                borderRadius:100, fontSize:11,
                fontWeight:700, padding:'2px 10px',
              }}>
                {stats.pendingHostels} pending
              </span>
            )}
          </div>
          {stats?.recentHostels?.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>
                  {['Name','Manager','Status'].map(h => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentHostels.map((h, i) => (
                  <tr key={h.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ fontWeight:600 }}>
                        {h.name}
                      </div>
                      <div style={{
                        fontSize:11, color:C.gray,
                      }}>
                        {h.location}
                      </div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {h.manager_name}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(
                        h.is_approved ? 'approved' : 'pending'
                      )}>
                        {h.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              No hostels yet
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────
  //  USER FORM MODAL
  // ─────────────────────────────────────────────────
  const UserModal = () => {
    const isEdit = !!editingUser;
    const [form, setForm] = useState({
      fullName: editingUser?.full_name || '',
      username: editingUser?.username  || '',
      email:    editingUser?.email     || '',
      phone:    editingUser?.phone     || '',
      password: '',
      role:     editingUser?.role      || 'client',
    });
    const [err, setErr]       = useState('');
    const [saving, setSaving] = useState(false);

    const save = async () => {
      setSaving(true); setErr('');
      try {
        if (isEdit) {
          await api.put(
            `/admin/users/${editingUser.id}`, form
          );
          showToast('User updated.');
        } else {
          await api.post('/admin/users', form);
          showToast('User created.');
        }
        setShowUserModal(false);
        setEditingUser(null);
        fetchUsers();
        fetchStats();
      } catch (e) {
        setErr(e.response?.data?.error || 'Failed.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <Modal
        title={isEdit ? 'Edit User' : 'Add New User'}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}>
        {err && <div style={css.errorBox}>{err}</div>}

        <div style={css.twoCol}>
          <div style={css.formRow}>
            <label style={css.label}>Full Name *</label>
            <input style={css.input}
              value={form.fullName}
              onChange={e => setForm(p => ({
                ...p, fullName: e.target.value
              }))}
              placeholder="John Doe" />
          </div>
          <div style={css.formRow}>
            <label style={css.label}>Username *</label>
            <input style={css.input}
              value={form.username}
              onChange={e => setForm(p => ({
                ...p, username: e.target.value
              }))}
              placeholder="blessdhi" />
          </div>
        </div>

        <div style={css.formRow}>
          <label style={css.label}>Email *</label>
          <input style={css.input} type="email"
            value={form.email}
            onChange={e => setForm(p => ({
              ...p, email: e.target.value
            }))}
            placeholder="blessdhi@email.com" />
        </div>

        <div style={css.twoCol}>
          <div style={css.formRow}>
            <label style={css.label}>Phone *</label>
            <input style={css.input}
              value={form.phone}
              onChange={e => setForm(p => ({
                ...p, phone: e.target.value
              }))}
              placeholder="+233244123456" />
          </div>
          <div style={css.formRow}>
            <label style={css.label}>Role *</label>
            <select style={css.input}
              value={form.role}
              onChange={e => setForm(p => ({
                ...p, role: e.target.value
              }))}>
              <option value="client">Client</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>

        <div style={css.formRow}>
          <label style={css.label}>
            {isEdit
              ? 'New Password (leave blank to keep current)'
              : 'Password *'}
          </label>
          <input style={css.input} type="password"
            value={form.password}
            onChange={e => setForm(p => ({
              ...p, password: e.target.value
            }))}
            placeholder={
              isEdit ? 'Leave blank to keep current' : 'Min 6 chars'
            } />
        </div>

        <div style={{
          display:'flex', gap:10,
          justifyContent:'flex-end',
        }}>
          <button style={css.btn(C.gray, true)}
            onClick={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}>
            Cancel
          </button>
          <button
            style={{
              ...css.btn(C.blue),
              opacity: saving ? 0.7 : 1,
            }}
            onClick={save} disabled={saving}>
            {saving ? 'Saving...'
              : isEdit ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </Modal>
    );
  };

  // ─────────────────────────────────────────────────
  //  USERS PAGE
  // ─────────────────────────────────────────────────
  const UsersPage = () => {
    const toggleUser = async (u) => {
      try {
        const { data } = await api.patch(
          `/admin/users/${u.id}/toggle`
        );
        showToast(data.message);
        fetchUsers();
        fetchStats();
      } catch (e) {
        showToast(
          e.response?.data?.error || 'Failed.', 'error'
        );
      }
    };

    const deleteUser = (u) => {
      setConfirm({
        message: `Delete user "${u.username}"? This cannot be undone.`,
        onConfirm: async () => {
          setConfirm(null);
          try {
            await api.delete(`/admin/users/${u.id}`);
            showToast('User deleted.');
            fetchUsers();
            fetchStats();
          } catch (e) {
            showToast(
              e.response?.data?.error || 'Failed.', 'error'
            );
          }
        },
        onCancel: () => setConfirm(null),
      });
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>User Management</div>
            <div style={css.pageSub}>
              {users.length} user(s) found
            </div>
          </div>
          <button style={css.btn(C.blue)}
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
            }}>
            + Add User
          </button>
        </div>

        {/* Search & filter */}
        <div style={css.searchRow}>
          <input style={{
            ...css.input, maxWidth:320,
          }}
            placeholder="Search name, username, email, phone..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)} />
          <select style={{
            ...css.input, width:140,
          }}
            value={userRole}
            onChange={e => setUserRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="client">Client</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div style={css.card}>
          {users.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>
                  {['Name','Username','Email',
                    'Phone','Role','Status','Actions']
                    .map(h => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ fontWeight:600 }}>
                        {u.full_name}
                      </div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      @{u.username}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {u.email || '—'}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {u.phone || '—'}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(u.role)}>
                        {u.role}
                      </span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(
                        u.is_active ? 'active' : 'inactive'
                      )}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button
                          style={css.btn(C.blue,true,true)}
                          onClick={() => {
                            setEditingUser(u);
                            setShowUserModal(true);
                          }}>
                          Edit
                        </button>
                        <button
                          style={css.btn(
                            u.is_active ? C.warn : C.green,
                            true, true
                          )}
                          onClick={() => toggleUser(u)}>
                          {u.is_active
                            ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          style={css.btn(C.danger,true,true)}
                          onClick={() => deleteUser(u)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{ fontSize:36,marginBottom:10 }}>
                👥
              </div>
              <div style={{ fontSize:14, fontWeight:500 }}>
                No users found
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────
  //  HOSTELS PAGE
  // ─────────────────────────────────────────────────
  const HostelsPage = () => {
    const approveHostel = async (id) => {
      try {
        await api.patch(`/admin/hostels/${id}/approve`);
        showToast('Hostel approved.');
        fetchHostels();
        fetchStats();
      } catch (e) {
        showToast(
          e.response?.data?.error || 'Failed.', 'error'
        );
      }
    };

    const deleteHostel = (h) => {
      setConfirm({
        message: `Remove hostel "${h.name}"? This cannot be undone.`,
        onConfirm: async () => {
          setConfirm(null);
          try {
            await api.delete(`/admin/hostels/${h.id}`);
            showToast('Hostel removed.');
            fetchHostels();
            fetchStats();
          } catch (e) {
            showToast(
              e.response?.data?.error || 'Failed.', 'error'
            );
          }
        },
        onCancel: () => setConfirm(null),
      });
    };

    return (
      <div>
        <div style={css.topbar}>
          <div>
            <div style={css.pageTitle}>
              Hostel Management
            </div>
            <div style={css.pageSub}>
              Approve and manage registered hostels
            </div>
          </div>
          {stats?.pendingHostels > 0 && (
            <div style={{
              background:'#fff3e0',
              border:'1px solid #ffe082',
              borderRadius:8, padding:'8px 16px',
              fontSize:13, color:C.warn, fontWeight:600,
            }}>
              {stats.pendingHostels} awaiting approval
            </div>
          )}
        </div>

        <div style={css.tabRow}>
          {['all','pending','approved'].map(t => (
            <button key={t}
              style={css.tab(hostelTab === t)}
              onClick={() => setHostelTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={css.card}>
          {hostels.length > 0 ? (
            <table style={css.table}>
              <thead>
                <tr>
                  {['Hostel','Location','Manager',
                    'Rooms','Bookings','Status','Actions']
                    .map(h => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hostels.map((h, i) => (
                  <tr key={h.id}>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ fontWeight:600 }}>
                        {h.name}
                      </div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {h.location}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ fontWeight:500 }}>
                        {h.manager_name}
                      </div>
                      <div style={{
                        fontSize:11, color:C.gray,
                      }}>
                        {h.manager_email}
                      </div>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {h.room_count}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      {h.booking_count}
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <span style={css.badge(
                        h.is_approved ? 'approved' : 'pending'
                      )}>
                        {h.is_approved ? 'Approved':'Pending'}
                      </span>
                    </td>
                    <td style={i%2?css.tdAlt:css.td}>
                      <div style={{ display:'flex', gap:6 }}>
                        {!h.is_approved && (
                          <button
                            style={css.btn(C.green,false,true)}
                            onClick={() => approveHostel(h.id)}>
                            Approve
                          </button>
                        )}
                        <button
                          style={css.btn(C.danger,true,true)}
                          onClick={() => deleteHostel(h)}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={css.emptyState}>
              <div style={{ fontSize:36,marginBottom:10 }}>
                🏨
              </div>
              <div style={{ fontSize:14, fontWeight:500 }}>
                No hostels found
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────
  //  BOOKINGS PAGE
  // ─────────────────────────────────────────────────
  const BookingsPage = () => (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>
            All Bookings
          </div>
          <div style={css.pageSub}>
            System-wide booking overview
          </div>
        </div>
        <button style={css.btn(C.gray,true)}
          onClick={fetchBookings}>
          Refresh
        </button>
      </div>

      <div style={css.tabRow}>
        {['all','pending','approved','rejected'].map(t => (
          <button key={t}
            style={css.tab(bookingTab === t)}
            onClick={() => setBookingTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={css.card}>
        {bookings.length > 0 ? (
          <table style={css.table}>
            <thead>
              <tr>
                {['Client','Hostel','Room',
                  'People','Status','Date'].map(h => (
                  <th key={h} style={css.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id}>
                  <td style={i%2?css.tdAlt:css.td}>
                    {b.client_name}
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    <div style={{ fontWeight:600 }}>
                      {b.hostel_name}
                    </div>
                    <div style={{
                      fontSize:11, color:C.gray,
                    }}>
                      {b.hostel_location}
                    </div>
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    {b.room_type}
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    {b.number_of_people}
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    <span style={css.badge(b.status)}>
                      {b.status}
                    </span>
                  </td>
                  <td style={i%2?css.tdAlt:css.td}>
                    {new Date(b.request_date)
                      .toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={css.emptyState}>
            <div style={{ fontSize:36,marginBottom:10 }}>
              📋
            </div>
            <div style={{ fontSize:14, fontWeight:500 }}>
              No bookings found
            </div>
          </div>
        )}
      </div>
    </div>
  );

const ProfilePage = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [err,      setErr]      = useState('');
  const [success,  setSuccess]  = useState('');
  const [saving,   setSaving]   = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [adminData,setAdminData]= useState(null);

  // Fetch profile directly inside component
  useEffect(() => {
    api.get('/admin/profile')
      .then(({ data }) => {
        setAdminData(data.admin);
        setLoading(false);
      })
      .catch(err => {
        console.error('Profile fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    setErr(''); setSuccess('');
    if (!form.currentPassword ||
        !form.newPassword ||
        !form.confirmPassword) {
      setErr('All fields are required.'); return;
    }
    if (form.newPassword.length < 6) {
      setErr('New password must be at least 6 characters.'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setErr('New passwords do not match.'); return;
    }
    setSaving(true);
    try {
      const { data } = await api.put('/admin/profile/password', form);
      setSuccess(data.message);
      setForm({
        currentPassword: '',
        newPassword:     '',
        confirmPassword: '',
      });
      showToast('Password changed successfully!');
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', height: 300,
        fontSize: 14, color: C.gray,
      }}>
        Loading profile...
      </div>
    );
  }

  const displayName = adminData?.full_name || user?.fullName || 'Admin';
  const displayEmail = adminData?.email || '—';
  const displayUsername = adminData?.username || user?.username || 'admin';

  return (
    <div>
      <div style={css.topbar}>
        <div>
          <div style={css.pageTitle}>My Profile</div>
          <div style={css.pageSub}>Manage your admin account</div>
        </div>
      </div>

      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:24,
      }}>
        {/* Account Info */}
        <div style={css.card}>
          <div style={{
            fontSize:15, fontWeight:700, color:C.dark,
            marginBottom:20, paddingBottom:12,
            borderBottom:`1px solid ${C.border}`,
          }}>
            Account Information
          </div>

          <div style={{
            display:'flex', alignItems:'center',
            gap:16, marginBottom:24,
          }}>
            <div style={{
              width:64, height:64,
              background:'linear-gradient(135deg,#c9a84c,#e8c96a)',
              borderRadius:'50%',
              display:'flex', alignItems:'center',
              justifyContent:'center',
              fontFamily:'Georgia,serif',
              fontWeight:900, fontSize:26, color:'#0d1b3e',
            }}>
              {displayName[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{
                fontSize:18, fontWeight:700, color:C.dark,
              }}>
                {displayName}
              </div>
              <div style={{
                fontSize:12, color:C.gray, marginTop:2,
              }}>
                {displayEmail}
              </div>
              <span style={{
                ...css.badge('approved'),
                fontSize:10, marginTop:4, display:'inline-block',
              }}>
                Administrator
              </span>
            </div>
          </div>

          {[
            { label:'Username',     value: displayUsername },
            { label:'Email',        value: displayEmail },
            { label:'Role',         value: 'System Administrator' },
            { label:'Member Since', value: adminData?.created_at
                ? new Date(adminData.created_at).toLocaleDateString()
                : '—' },
          ].map(item => (
            <div key={item.label} style={{
              display:'flex', justifyContent:'space-between',
              alignItems:'center',
              padding:'11px 0',
              borderBottom:`1px solid ${C.border}`,
            }}>
              <span style={{
                fontSize:12, color:C.gray, fontWeight:600,
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize:13, color:C.dark, fontWeight:500,
              }}>
                {item.value}
              </span>
            </div>
          ))}

          <div style={{
            marginTop:20,
            background:'#fff8e1',
            border:'1px solid #ffe082',
            borderRadius:10,
            padding:'12px 16px',
            fontSize:12, color:'#e65100', lineHeight:1.6,
          }}>
            <strong>Security reminder:</strong> If you haven't
            changed the default password <strong>admin123</strong>,
            please do so immediately using the form on the right.
          </div>
        </div>

        {/* Change Password */}
        <div style={css.card}>
          <div style={{
            fontSize:15, fontWeight:700, color:C.dark,
            marginBottom:20, paddingBottom:12,
            borderBottom:`1px solid ${C.border}`,
          }}>
            Change Password
          </div>

          {err && (
            <div style={{
              background:'#ffebee', border:'1px solid #ef9a9a',
              borderRadius:8, color:C.danger,
              fontSize:12, padding:'10px 14px', marginBottom:16,
            }}>
              {err}
            </div>
          )}
          {success && (
            <div style={{
              background:'#e8f5e9', border:'1px solid #a5d6a7',
              borderRadius:8, color:C.green,
              fontSize:12, padding:'10px 14px', marginBottom:16,
            }}>
              {success}
            </div>
          )}

          <div style={css.formRow}>
            <label style={css.label}>Current Password *</label>
            <input style={css.input}
              type={showPw ? 'text' : 'password'}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password" />
          </div>

          <div style={css.formRow}>
            <label style={css.label}>New Password *</label>
            <input style={css.input}
              type={showPw ? 'text' : 'password'}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Minimum 6 characters" />
          </div>

          <div style={css.formRow}>
            <label style={css.label}>Confirm New Password *</label>
            <input style={css.input}
              type={showPw ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password" />
          </div>

          <div style={{
            display:'flex', alignItems:'center',
            gap:8, marginBottom:18,
          }}>
            <input type="checkbox" id="showpw"
              checked={showPw}
              onChange={e => setShowPw(e.target.checked)}
              style={{ cursor:'pointer' }} />
            <label htmlFor="showpw" style={{
              fontSize:12, color:C.gray, cursor:'pointer',
            }}>
              Show passwords
            </label>
          </div>

          {/* Strength indicator */}
          {form.newPassword && (
            <div style={{ marginBottom:16 }}>
              <div style={{
                fontSize:11, color:C.gray,
                marginBottom:6, fontWeight:600,
              }}>
                Password Strength
              </div>
              <div style={{
                height:4, borderRadius:2,
                background:'#f1f5f9', overflow:'hidden',
              }}>
                <div style={{
                  height:'100%', borderRadius:2,
                  transition:'width 0.3s, background 0.3s',
                  width: form.newPassword.length >= 12 ? '100%'
                       : form.newPassword.length >= 8  ? '66%'
                       : form.newPassword.length >= 6  ? '33%'
                       : '10%',
                  background: form.newPassword.length >= 12 ? C.green
                            : form.newPassword.length >= 8  ? C.gold
                            : C.danger,
                }} />
              </div>
              <div style={{
                fontSize:10, marginTop:4, fontWeight:600,
                color: form.newPassword.length >= 12 ? C.green
                     : form.newPassword.length >= 8  ? '#e65100'
                     : C.danger,
              }}>
                {form.newPassword.length >= 12 ? '✓ Strong'
               : form.newPassword.length >= 8  ? '~ Medium'
               : form.newPassword.length >= 6  ? '! Weak'
               : '✕ Too short'}
              </div>
            </div>
          )}

          <button
            style={{
              ...css.btn(C.blue),
              width:'100%', padding:13,
              fontSize:14, opacity: saving ? 0.7 : 1,
            }}
            onClick={submit} disabled={saving}>
            {saving ? 'Changing Password...' : 'Change Password'}
          </button>

          <div style={{
            marginTop:14, fontSize:11, color:C.gray,
            lineHeight:1.6, textAlign:'center',
          }}>
            After changing your password you will stay
            logged in for your current session.
          </div>
        </div>
      </div>
    </div>
  );
};

  // ─────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────
  const pages = {
    dashboard: <DashboardPage />,
    users:     <UsersPage />,
    hostels:   <HostelsPage />,
    bookings:  <BookingsPage />,
    profile:   <ProfilePage />,
  };

  return (
    <div style={css.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet" />
      <Sidebar />
      <main style={css.main}>
        {pages[page]}
      </main>
      {showUserModal && <UserModal />}
      {confirm && <Confirm {...confirm} />}
      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}