import { useState, useEffect, useCallback, useMemo } from 'react'

const API_BASE = '/api/proxy'

const EMPTY_FORM = {
  nombre: '', negocio: '', identificacion: '', telefono: '',
  email: '', direccion: '', locales: '', contacto: '',
  telefonoContacto: '', notas: '', siguienteAccionFecha: '', accion: '',
}

const Icon = ({ d, size = 18, stroke = 'currentColor', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  store: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.09 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M2 22h20M6 14h.01M10 14h.01M14 14h.01M6 10h.01M10 10h.01M14 10h.01M6 6h.01M10 6h.01M14 6h.01',
  calendar: 'M3 9h18M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9M8 3v4M16 3v4',
  note: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  id: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zM9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0',
  contact: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  plus: 'M12 5v14M5 12h14',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  chevron: 'M9 18l6-6-6-6',
  alert: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  search: 'M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  dashboard: 'M3 3h7v7H3zM13 3h8v7h-8zM13 13h8v8h-8zM3 13h7v8H3z',
  orders: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h.01M12 16h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01',
  target: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  trending: 'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => '$' + (n || 0).toLocaleString('es-EC', { minimumFractionDigits: 0 })

function getNowGuayaquil() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Guayaquil' }))
}

function getTodayLabel() {
  const d = getNowGuayaquil()
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, icon, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: 'var(--accent)', opacity: 0.7 }}><Icon d={icons[icon]} size={14} /></span>
        {label}{required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{hint}</span>}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', background: 'var(--white)',
  border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
  color: 'var(--ink)', fontSize: '15px',
  transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none',
}

const sectionTitle = {
  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--muted)', marginBottom: '16px', paddingBottom: '8px',
  borderBottom: '1px solid var(--cream)', fontFamily: 'var(--font-display)',
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)', border: `1.5px solid ${type === 'success' ? 'var(--success)' : 'var(--error)'}`, color: type === 'success' ? 'var(--success)' : 'var(--error)', borderRadius: 'var(--radius-lg)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500', maxWidth: '340px', boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.3s ease' }}>
      <Icon d={type === 'success' ? icons.check : icons.x} size={18} />{message}
    </div>
  )
}

// ─── Highlight ────────────────────────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query || !text) return <>{text}</>
  const idx = text.toString().toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return <>{text.toString().slice(0, idx)}<mark style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '2px', padding: '0 2px' }}>{text.toString().slice(idx, idx + query.length)}</mark>{text.toString().slice(idx + query.length)}</>
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}?action=dashboard`)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const vendido = data?.vendido || 0
  const meta = data?.meta || 0
  const pct = meta > 0 ? Math.min(100, Math.round((vendido / meta) * 100)) : 0

  const statCards = [
    { label: 'Meta', value: fmt(meta), icon: 'target', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Vendido', value: fmt(vendido), icon: 'check', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Negociando', value: fmt(data?.negociando), icon: 'trending', color: '#2563eb', bg: '#eff6ff' },
    { label: 'Detenido', value: fmt(data?.detenido), icon: 'alert', color: '#d97706', bg: '#fffbeb' },
    { label: 'Perdido', value: fmt(data?.perdido), icon: 'x', color: '#dc2626', bg: '#fef2f2' },
  ]

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Fecha */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon d={icons.calendar} size={14} />
          {getTodayLabel()}
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Dashboard
        </h1>
        {data?.mesActual && (
          <div style={{ marginTop: '4px', fontSize: '14px', color: 'var(--muted)' }}>{data.mesActual}</div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>
          Cargando datos...
        </div>
      ) : (
        <>
          {/* Barra de progreso meta */}
          {meta > 0 && (
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avance del mes</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '18px', color: pct >= 100 ? '#16a34a' : 'var(--ink)' }}>{pct}%</span>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '100px', height: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#16a34a' : pct >= 60 ? '#2563eb' : 'var(--accent)', borderRadius: '100px', transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--muted)' }}>
                <span>{fmt(vendido)} vendido</span>
                <span>Meta: {fmt(meta)}</span>
              </div>
            </div>
          )}

          {/* Cards de cifras */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {statCards.map(({ label, value, icon, color, bg }) => (
              <div key={label} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={icons[icon]} size={16} stroke={color} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Pistas y días sin prospectar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={icons.eye} size={14} stroke="#0ea5e9" />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pistas</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '32px', color: '#0ea5e9' }}>
                {data?.pistas ?? 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>clientes sin órdenes</div>
            </div>

            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: (data?.diasSinProspectar || 0) >= 3 ? '#fef2f2' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={icons.clock} size={14} stroke={(data?.diasSinProspectar || 0) >= 3 ? '#dc2626' : '#16a34a'} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sin prospectar</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '32px', color: (data?.diasSinProspectar || 0) >= 3 ? '#dc2626' : '#16a34a' }}>
                {data?.diasSinProspectar ?? 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                {(data?.diasSinProspectar || 0) === 1 ? 'día desde el último cliente' : 'días desde el último cliente'}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── ClientRow ────────────────────────────────────────────────────────────────
function ClientRow({ client, index, onEdit, onView, query }) {
  return (
    <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: `fadeUp 0.2s ${Math.min(index, 5) * 0.04}s ease both`, transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px', flexShrink: 0 }}>
          {client.nombre?.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Highlight text={client.nombre} query={query} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Highlight text={client.negocio || '—'} query={query} /> · {client.telefono}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
        <button onClick={() => onView(client)}
          style={{ background: 'var(--cream)', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '7px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--cream)'}>
          <Icon d={icons.eye} size={13} /> Ver
        </button>
        <button onClick={() => onEdit(client)}
          style={{ background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '7px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
          <Icon d={icons.edit} size={13} /> Editar
        </button>
      </div>
    </div>
  )
}

// ─── ViewClient ───────────────────────────────────────────────────────────────
function ViewClient({ client, onEdit, onBack }) {
  const hasNextAction = client.siguienteAccionFecha || client.accion
  const fields = [
    { icon: 'id', label: 'Identificación', val: client.identificacion },
    { icon: 'phone', label: 'Teléfono', val: client.telefono },
    { icon: 'mail', label: 'Email', val: client.email },
    { icon: 'map', label: 'Dirección', val: client.direccion },
    { icon: 'building', label: 'Locales', val: client.locales },
    { icon: 'contact', label: 'Contacto', val: client.contacto },
    { icon: 'phone', label: 'Tel. Contacto', val: client.telefonoContacto },
  ]

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '24px' }}>
        <Icon d={icons.arrowLeft} size={15} /> Volver a clientes
      </button>

      {/* Header del cliente */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px' }}>
              {client.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.01em', margin: 0 }}>{client.nombre}</h1>
              {client.negocio && <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '2px' }}>{client.negocio}</div>}
            </div>
          </div>
          <button onClick={() => onEdit(client)}
            style={{ background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}>
            <Icon d={icons.edit} size={14} /> Editar
          </button>
        </div>

        {/* Campos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {fields.map(({ icon, label, val }) => val ? (
            <div key={label}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon d={icons[icon]} size={12} />{label}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{val}</div>
            </div>
          ) : null)}
        </div>

        <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--border)' }}>
          Registrado: {client.fechaRegistro}
        </div>
      </div>

      {/* Siguiente acción */}
      {hasNextAction && (
        <div style={{ background: 'var(--accent-light)', border: '1.5px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <Icon d={icons.alert} size={18} stroke="var(--accent)" />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Siguiente acción</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)' }}>
              {client.accion}{client.accion && client.siguienteAccionFecha ? ' — ' : ''}{client.siguienteAccionFecha}
            </div>
          </div>
        </div>
      )}

      {/* Notas */}
      {client.notas && (
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon d={icons.note} size={13} />Notas
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.6', fontStyle: 'italic' }}>"{client.notas}"</div>
        </div>
      )}
    </div>
  )
}

// ─── EditForm ─────────────────────────────────────────────────────────────────
function EditForm({ client, onSave, onCancel }) {
  const [form, setForm] = useState({ nombre: client.nombre || '', negocio: client.negocio || '', identificacion: client.identificacion || '', telefono: client.telefono || '', email: client.email || '', direccion: client.direccion || '', locales: client.locales || '', contacto: client.contacto || '', telefonoContacto: client.telefonoContacto || '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: null })) }
  const gs = (f) => ({ ...inputStyle, borderColor: errors[f] ? 'var(--accent)' : focusedField === f ? 'var(--ink)' : 'var(--border)', boxShadow: focusedField === f ? '0 0 0 3px rgba(13,13,13,0.06)' : 'none' })
  const fp = (f, x = {}) => ({ style: gs(f), value: form[f], onChange: e => inp(f, e.target.value), onFocus: () => setFocusedField(f), onBlur: () => setFocusedField(null), ...x })

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Obligatorio'
    if (!form.telefono.trim()) e.telefono = 'Obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...form, action: 'update', rowIndex: client.rowIndex })
      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const data = await res.json()
      if (data.success) onSave({ ...client, ...form })
      else alert(data.error || 'Error al actualizar')
    } catch { alert('Error de conexión') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '16px' }}>
          <Icon d={icons.arrowLeft} size={15} /> Volver a clientes
        </button>
        <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', marginBottom: '10px' }}>Editando cliente</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{client.nombre}</h1>
      </div>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: 'var(--shadow)' }}>
        <div>
          <div style={sectionTitle}>Datos del cliente</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Nombre completo" icon="user" required><input {...fp('nombre')} placeholder="Ej: María López" />{errors.nombre && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.nombre}</span>}</Field>
            <Field label="Identificación" icon="id" hint="Cédula o RUC"><input {...fp('identificacion')} placeholder="Ej: 0912345678" /></Field>
            <Field label="Teléfono" icon="phone" required><input {...fp('telefono', { type: 'tel' })} placeholder="Ej: 0997002220" />{errors.telefono && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.telefono}</span>}</Field>
            <Field label="Email" icon="mail"><input {...fp('email', { type: 'email' })} placeholder="correo@ejemplo.com" />{errors.email && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.email}</span>}</Field>
          </div>
        </div>
        <div>
          <div style={sectionTitle}>Datos del negocio</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Nombre del negocio" icon="store"><input {...fp('negocio')} placeholder="Ej: Farmacia del Parque" /></Field>
            <Field label="¿Cuántos locales?" icon="building" hint="Sucursales"><input {...fp('locales', { type: 'number', min: '1' })} placeholder="Ej: 3" /></Field>
            <div style={{ gridColumn: '1 / -1' }}><Field label="Dirección" icon="map"><input {...fp('direccion')} placeholder="Calle, número, ciudad" /></Field></div>
          </div>
        </div>
        <div>
          <div style={sectionTitle}>Persona de contacto</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Contacto" icon="contact"><input {...fp('contacto')} placeholder="Nombre del contacto" /></Field>
            <Field label="Teléfono de contacto" icon="phone"><input {...fp('telefonoContacto', { type: 'tel' })} placeholder="Ej: 0987654321" /></Field>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '13px', background: 'var(--cream)', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '13px', background: loading ? 'var(--muted)' : 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--ink)' }}>
            {loading ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Guardar cambios</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [toast, setToast] = useState(null)
  const [focusedField, setFocusedField] = useState(null)
  const [acciones, setAcciones] = useState([])
  const [editingClient, setEditingClient] = useState(null)
  const [viewingClient, setViewingClient] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const showToast = (message, type = 'success') => setToast({ message, type })

  useEffect(() => {
    fetch(`${API_BASE}?action=getAcciones`)
      .then(r => r.json()).then(d => { if (d.success) setAcciones(d.data) }).catch(() => {})
  }, [])

  const fetchClients = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      if (data.success) setClients(data.data)
      else showToast('Error al cargar clientes', 'error')
    } catch { showToast('Error de conexión', 'error') }
    finally { setLoadingList(false) }
  }, [])

  useEffect(() => { if (view === 'list') fetchClients() }, [view, fetchClients])

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients
    const q = searchQuery.toLowerCase()
    return clients.filter(c => c.nombre.toLowerCase().includes(q) || c.negocio.toLowerCase().includes(q) || c.identificacion.toLowerCase().includes(q))
  }, [clients, searchQuery])

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...form, action: 'create' })
      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const data = await res.json()
      if (data.success) { showToast(`✓ ${form.nombre} registrado exitosamente`); setForm(EMPTY_FORM); setErrors({}) }
      else showToast(data.error || 'Error al registrar', 'error')
    } catch { showToast('Error de conexión', 'error') }
    finally { setLoading(false) }
  }

  const navigate = (v) => { setView(v); setMenuOpen(false); if (v !== 'edit') setEditingClient(null); if (v !== 'view') setViewingClient(null) }
  const handleEdit = (c) => { setEditingClient(c); setViewingClient(null); setView('edit') }
  const handleView = (c) => { setViewingClient(c); setView('view') }
  const handleSaveEdit = (c) => { setClients(p => p.map(x => x.rowIndex === c.rowIndex ? c : x)); showToast(`✓ ${c.nombre} actualizado`); setView('list') }

  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: null })) }
  const gs = (f) => ({ ...inputStyle, borderColor: errors[f] ? 'var(--accent)' : focusedField === f ? 'var(--ink)' : 'var(--border)', boxShadow: focusedField === f ? '0 0 0 3px rgba(13,13,13,0.06)' : 'none' })
  const fp = (f, x = {}) => ({ style: gs(f), value: form[f], onChange: e => inp(f, e.target.value), onFocus: () => setFocusedField(f), onBlur: () => setFocusedField(null), ...x })

  const menuItems = [
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'form', icon: icons.plus, label: 'Nuevo' },
    { key: 'list', icon: icons.list, label: 'Clientes' },
    { key: 'orders', icon: icons.orders, label: 'Órdenes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }} onClick={() => menuOpen && setMenuOpen(false)}>

      {/* Header */}
      <header style={{ background: 'var(--ink)', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 200 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '17px', color: 'white', letterSpacing: '-0.01em' }}>
          Orden PPP
        </span>
        <button onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }} style={{ background: menuOpen ? 'rgba(255,255,255,0.15)' : 'transparent', border: 'none', color: 'white', padding: '8px', borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
          <Icon d={icons.menu} size={22} />
        </button>
      </header>

      {/* Dropdown menu */}
      {menuOpen && (
        <div onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: '68px', right: '16px', zIndex: 300, background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', minWidth: '200px', animation: 'fadeUp 0.2s ease' }}>
          {menuItems.map(({ key, icon, label }) => (
            <button key={key} onClick={() => navigate(key)} style={{ width: '100%', padding: '13px 18px', background: (view === key || (view === 'edit' && key === 'list')) ? 'var(--accent-light)' : 'transparent', border: 'none', borderBottom: '1px solid var(--cream)', color: (view === key || (view === 'edit' && key === 'list')) ? 'var(--accent)' : 'var(--ink)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (view !== key) e.currentTarget.style.background = 'var(--cream)' }}
              onMouseLeave={e => { if (view !== key) e.currentTarget.style.background = 'transparent' }}>
              <Icon d={icon} size={17} stroke={(view === key || (view === 'edit' && key === 'list')) ? 'var(--accent)' : 'var(--ink)'} />
              {label}
              {key === 'orders' && <span style={{ marginLeft: 'auto', fontSize: '10px', background: 'var(--cream)', color: 'var(--muted)', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>Próximamente</span>}
            </button>
          ))}
        </div>
      )}

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>

        {/* ── DASHBOARD ─────────────────────────────────────────────────────── */}
        {view === 'dashboard' && <Dashboard />}

        {/* ── VER CLIENTE ───────────────────────────────────────────────────── */}
        {view === 'view' && viewingClient && (
          <ViewClient client={viewingClient} onEdit={handleEdit} onBack={() => setView('list')} />
        )}

        {/* ── EDIT ──────────────────────────────────────────────────────────── */}
        {view === 'edit' && editingClient && <EditForm client={editingClient} onSave={handleSaveEdit} onCancel={() => setView('list')} />}

        {/* ── NUEVO ─────────────────────────────────────────────────────────── */}
        {view === 'form' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', marginBottom: '10px' }}>Nueva visita</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Registrar cliente</h1>
              <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>La fecha y hora se registran automáticamente al guardar.</p>
            </div>
            <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: 'var(--shadow)' }}>
              <div>
                <div style={sectionTitle}>Datos del cliente</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Nombre completo" icon="user" required><input {...fp('nombre')} placeholder="Ej: María López" />{errors.nombre && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.nombre}</span>}</Field>
                  <Field label="Identificación" icon="id" hint="Cédula o RUC"><input {...fp('identificacion')} placeholder="Ej: 0912345678" /></Field>
                  <Field label="Teléfono" icon="phone" required><input {...fp('telefono', { type: 'tel' })} placeholder="Ej: 0997002220" />{errors.telefono && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.telefono}</span>}</Field>
                  <Field label="Email" icon="mail"><input {...fp('email', { type: 'email' })} placeholder="correo@ejemplo.com" />{errors.email && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.email}</span>}</Field>
                </div>
              </div>
              <div>
                <div style={sectionTitle}>Datos del negocio</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Nombre del negocio" icon="store"><input {...fp('negocio')} placeholder="Ej: Farmacia del Parque" /></Field>
                  <Field label="¿Cuántos locales?" icon="building" hint="Sucursales"><input {...fp('locales', { type: 'number', min: '1' })} placeholder="Ej: 3" /></Field>
                  <div style={{ gridColumn: '1 / -1' }}><Field label="Dirección" icon="map"><input {...fp('direccion')} placeholder="Calle, número, ciudad" /></Field></div>
                </div>
              </div>
              <div>
                <div style={sectionTitle}>Persona de contacto</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Contacto" icon="contact"><input {...fp('contacto')} placeholder="Nombre del contacto" /></Field>
                  <Field label="Teléfono de contacto" icon="phone"><input {...fp('telefonoContacto', { type: 'tel' })} placeholder="Ej: 0987654321" /></Field>
                </div>
              </div>
              <div>
                <div style={sectionTitle}>Notas y seguimiento</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Notas / Comentarios" icon="note"><textarea {...fp('notas')} style={{ ...gs('notas'), resize: 'vertical', minHeight: '90px', lineHeight: '1.5' }} placeholder="Interés del cliente, próximos pasos, observaciones..." /></Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Field label="Siguiente acción (fecha)" icon="calendar"><input {...fp('siguienteAccionFecha', { type: 'date' })} /></Field>
                    <Field label="Acción a realizar" icon="alert">
                      <select style={{ ...gs('accion'), cursor: 'pointer' }} value={form.accion} onChange={e => inp('accion', e.target.value)} onFocus={() => setFocusedField('accion')} onBlur={() => setFocusedField(null)}>
                        <option value="">— Seleccionar —</option>
                        {acciones.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'var(--muted)' : 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginTop: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--ink)' }}>
                {loading ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Registrar cliente</>}
              </button>
            </div>
          </div>
        )}

        {/* ── CLIENTES ──────────────────────────────────────────────────────── */}
        {view === 'list' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em' }}>Clientes</h1>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{searchQuery ? `${filteredClients.length} de ${clients.length} clientes` : `${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'} en total`}</p>
              </div>
              <button onClick={fetchClients} disabled={loadingList} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 14px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <span style={{ animation: loadingList ? 'pulse 1s infinite' : 'none' }}><Icon d={icons.refresh} size={15} /></span> Actualizar
              </button>
            </div>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}><Icon d={icons.search} size={16} /></span>
              <input type="text" placeholder="Buscar por nombre, negocio o identificación..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...inputStyle, paddingLeft: '42px', paddingRight: searchQuery ? '42px' : '14px', fontSize: '14px' }} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: '2px' }}><Icon d={icons.x} size={16} /></button>}
            </div>
            {loadingList ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}><div style={{ fontSize: '24px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>Cargando clientes...</div>
            ) : !searchQuery.trim() ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>Escribe para buscar</div>
                <div style={{ fontSize: '14px' }}>Busca por nombre, negocio o identificación</div>
              </div>
            ) : filteredClients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--muted)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>😕</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>Sin resultados para "{searchQuery}"</div>
                <div style={{ fontSize: '14px' }}>Intenta con otro término</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredClients.map((c, i) => <ClientRow key={c.rowIndex} client={c} index={i} onEdit={handleEdit} onView={handleView} query={searchQuery} />)}
              </div>
            )}
          </div>
        )}

        {/* ── ÓRDENES (próximamente) ─────────────────────────────────────────── */}
        {view === 'orders' && (
          <div style={{ animation: 'fadeUp 0.4s ease', textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '24px', marginBottom: '8px' }}>Órdenes</h1>
            <p style={{ color: 'var(--muted)', fontSize: '15px' }}>Esta sección está en desarrollo.<br />Próximamente podrás gestionar tus órdenes aquí.</p>
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
