import { useState, useEffect, useCallback, useMemo } from 'react'

const API_BASE = '/api/proxy'

const EMPTY_FORM = {
  nombre: '', negocio: '', identificacion: '', telefono: '',
  email: '', direccion: '', contacto: '',
  telefonoContacto: '', notas: '',
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
  package: 'M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
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
const norm = (s) => (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const MESES_LARGO = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function formatFecha(raw, prefix = '') {
  if (!raw) return ''
  let d = null

  // ISO: 2026-03-20T05:00:00.000Z
  if (typeof raw === 'string' && raw.includes('T')) {
    d = new Date(raw)
  }
  // dd/MM/yyyy o dd/MM/yyyy HH:mm
  else if (typeof raw === 'string' && raw.includes('/')) {
    const parts = raw.split(' ')[0].split('/')
    if (parts.length === 3) d = new Date(parts[2], parts[1] - 1, parts[0])
  }
  // yyyy-MM-dd
  else if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, day] = raw.split('-')
    d = new Date(y, m - 1, day)
  }
  // Date object
  else if (raw instanceof Date) {
    d = raw
  }

  if (!d || isNaN(d)) return raw // si no se pudo parsear, devolver tal cual

  const dia = DIAS[d.getDay()]
  const num = d.getDate()
  const mes = MESES_LARGO[d.getMonth()]
  const anio = d.getFullYear()
  return `${prefix}${dia} ${num} de ${mes} ${anio}`
}

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
  const idx = norm(text.toString()).indexOf(norm(query))
  if (idx === -1) return <>{text}</>
  return <>{text.toString().slice(0, idx)}<mark style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: '2px', padding: '0 2px' }}>{text.toString().slice(idx, idx + query.length)}</mark>{text.toString().slice(idx + query.length)}</>
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(new Set())
  const [expandedOrden, setExpandedOrden] = useState(new Set())

  useEffect(() => {
    setLoading(true); setError(false)
    fetch(`${API_BASE}?action=dashboard`)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); else setError(true) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const now = getNowGuayaquil()
  const mesLabel = MESES_LARGO[now.getMonth()].charAt(0).toUpperCase() + MESES_LARGO[now.getMonth()].slice(1)
  const anio = now.getFullYear()

  const vendido    = data?.vendido    || 0
  const negociando = data?.negociando || 0
  const detenido   = data?.detenido   || 0
  const perdido    = data?.perdido    || 0
  const meta       = data?.meta       || 0
  const pct        = meta > 0 ? Math.round((vendido / meta) * 100) : 0
  const pistas     = data?.pistas     ?? 0
  const c          = data?.conteos || {}

  const verde = '#16a34a'
  const rojo  = '#dc2626'

  const toggle = (key) => setExpanded(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s })

  const statCards = [
    { label: 'Vendido',    value: fmt(vendido),    color: verde, bg: '#f0fdf4', icon: 'check',    estado: 'Vendido' },
    { label: 'Negociando', value: fmt(negociando), color: verde, bg: '#f0fdf4', icon: 'trending', estado: 'Negociando' },
    { label: 'Detenido',   value: fmt(detenido),   color: rojo,  bg: '#fef2f2', icon: 'alert',    estado: 'Detenido' },
    { label: 'Perdido',    value: fmt(perdido),    color: rojo,  bg: '#fef2f2', icon: 'x',        estado: 'Perdido' },
  ]

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Título */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Dashboard {mesLabel} {anio}
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon d={icons.calendar} size={13} />{getTodayLabel()}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>Cargando datos...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
          No se pudo cargar el dashboard. Verifica que el Apps Script esté desplegado.
        </div>
      ) : (
        <>
          {/* Meta */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '10px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={icons.target} size={17} stroke="#6366f1" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Meta {mesLabel} {anio}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color: '#6366f1' }}>{fmt(meta)}</div>
          </div>

          {/* Avance del mes */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '10px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avance del mes</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '18px', color: pct >= 100 ? verde : 'var(--ink)' }}>{pct}%</span>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: '100px', height: '10px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ height: '100%', width: `${Math.min(100, pct)}%`, background: pct >= 100 ? verde : pct >= 60 ? '#2563eb' : 'var(--brand)', borderRadius: '100px', transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--muted)' }}>
              <span style={{ fontWeight: '600', color: verde }}>{fmt(vendido)} vendido</span>
              <span>·</span>
              <span>{(c.Vendido?.clientes || 0)} {(c.Vendido?.clientes || 0) === 1 ? 'cliente' : 'clientes'}</span>
              <span>·</span>
              <span>{(c.Vendido?.ordenes || 0)} {(c.Vendido?.ordenes || 0) === 1 ? 'orden' : 'órdenes'}</span>
            </div>
          </div>

          {/* Tarjetas de estado expandibles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            {statCards.map(({ label, value, color, bg, icon, estado }) => {
              const isOpen = expanded.has(estado)
              const ordenes = data?.ordenesMes?.[estado] || []
              const cnt = c[estado] || { clientes: 0, ordenes: 0 }
              return (
                <div key={label} style={{ background: 'var(--white)', border: `1.5px solid ${isOpen ? color : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  {/* Header */}
                  <div onClick={() => toggle(estado)} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon d={icons[icon]} size={17} stroke={color} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color }}>{value}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '500' }}>{cnt.clientes} {cnt.clientes === 1 ? 'cliente' : 'clientes'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '500' }}>{cnt.ordenes} {cnt.ordenes === 1 ? 'orden' : 'órdenes'}</div>
                      </div>
                      <div style={{ color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <Icon d="M6 9l6 6 6-9" size={16} />
                      </div>
                    </div>
                  </div>
                  {/* Lista expandida */}
                  {isOpen && (
                    <div style={{ borderTop: `1px solid var(--border)`, background: 'var(--paper)' }}>
                      {ordenes.length === 0 ? (
                        <div style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>Sin órdenes en {label.toLowerCase()} este mes</div>
                      ) : (
                        ordenes.map((o, i) => {
                          const parseFecha = (s) => {
                            if (!s) return null
                            if (s instanceof Date) return s
                            if (typeof s === 'string' && s.includes('/')) {
                              const p = s.split(' ')[0].split('/')
                              if (p.length === 3) return new Date(p[2], p[1]-1, p[0])
                            }
                            if (typeof s === 'string' && s.includes('T')) return new Date(s)
                            return null
                          }

                          // Días en estado actual (Negociando/Detenido/Perdido)
                          let diasEnEstado = null
                          if (estado !== 'Vendido' && o.fechaCambioEstado) {
                            const fcs = parseFecha(o.fechaCambioEstado)
                            if (fcs) {
                              const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0)
                              diasEnEstado = Math.max(0, Math.floor((hoy - fcs) / (1000*60*60*24)))
                            }
                          }

                          // Días para cerrar venta (Vendido)
                          let diasParaVender = null
                          if (estado === 'Vendido') {
                            const fCreacion = parseFecha(o.fecha)
                            const fVendido  = parseFecha(o.fechaCambioEstado)
                            if (fCreacion && fVendido) {
                              fCreacion.setHours(0,0,0,0); fVendido.setHours(0,0,0,0)
                              diasParaVender = Math.max(0, Math.floor((fVendido - fCreacion) / (1000*60*60*24)))
                            }
                          }

                          const ordenKey = `${estado}-${o.numOrden}`
                          const detalleOpen = expandedOrden.has(ordenKey)
                          return (
                            <div key={i} style={{ borderBottom: i < ordenes.length-1 ? `1px solid var(--border)` : 'none', background: 'var(--white)' }}>
                              <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.cliente}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>{o.negocio}</div>
                                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                                    {o.numOrden && (
                                      <span onClick={(e) => { e.stopPropagation(); setExpandedOrden(prev => { const s = new Set(prev); s.has(ordenKey) ? s.delete(ordenKey) : s.add(ordenKey); return s }) }}
                                        style={{ color: 'var(--brand)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                                        {o.numOrden} {detalleOpen ? '▲' : '▼'}
                                      </span>
                                    )}
                                  </div>
                                  {diasParaVender !== null && (
                                    <div style={{ fontSize: '11px', color: verde, fontWeight: '600', marginTop: '2px' }}>
                                      Lo vendí en {diasParaVender === 0 ? 'el mismo día' : `${diasParaVender} ${diasParaVender === 1 ? 'día' : 'días'}`}
                                    </div>
                                  )}
                                  {diasEnEstado !== null && (
                                    <div style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px', color: diasEnEstado >= 7 ? '#dc2626' : '#d97706' }}>
                                      {diasEnEstado === 0 ? `Hoy en ${estado.toLowerCase()}` : `${diasEnEstado} ${diasEnEstado === 1 ? 'día' : 'días'} ${estado.toLowerCase()}.`}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
                                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px', color }}>{fmtMoney(o.total)}</div>
                                  {o.telefono && (
                                    <a href={`https://wa.me/593${o.telefono.toString().replace(/\D/g,'').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
                                      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#25d366', fontWeight: '700', textDecoration: 'none' }}>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                      {o.telefono}
                                    </a>
                                  )}
                                  {o.email && (
                                    <a href={`mailto:${o.email}`}
                                      style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--brand)', fontWeight: '600', textDecoration: 'none' }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                      {o.email}
                                    </a>
                                  )}
                                </div>
                              </div>
                              {/* Detalle inline de la orden */}
                              {detalleOpen && (
                                <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '10px 20px' }}>
                                  {(!o.items || o.items.length === 0) ? (
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '8px' }}>Sin detalle disponible</div>
                                  ) : (
                                    <>
                                      {o.items.map((item, ii) => (
                                        <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: ii < o.items.length-1 ? '1px solid var(--border)' : 'none' }}>
                                          <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink)' }}>{item.nombre}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                              {item.cantidad} × {fmtMoney(item.precioUnitario)}
                                              {item.descuento > 0 && ` · ${item.descuento > 1 ? item.descuento : item.descuento * 100}% desc`}
                                              {` · IVA ${item.iva > 1 ? item.iva : item.iva * 100}%`}
                                            </div>
                                          </div>
                                          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--brand)', fontFamily: 'var(--font-display)', flexShrink: 0, marginLeft: '10px' }}>{fmtMoney(item.total)}</div>
                                        </div>
                                      ))}
                                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '800', color, fontFamily: 'var(--font-display)' }}>Total: {fmtMoney(o.total)}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Días sin prospectar */}
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '10px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={icons.clock} size={17} stroke={rojo} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: rojo, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Días sin prospectar</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color: rojo }}>{data?.diasSinProspectar ?? 0}</div>
          </div>

          {/* Pistas — expandible */}
          {(() => {
            const isOpen = expanded.has('Pistas')
            const pistasList = data?.pistasList || []
            return (
              <div style={{ background: 'var(--white)', border: `1.5px solid ${isOpen ? '#0ea5e9' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <div onClick={() => toggle('Pistas')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon d={icons.eye} size={17} stroke="#0ea5e9" />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pistas</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color: '#0ea5e9' }}>{pistas} {pistas === 1 ? 'cliente' : 'clientes'}</div>
                    <div style={{ color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <Icon d="M6 9l6 6 6-9" size={16} />
                    </div>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ borderTop: '1px solid #e0f2fe' }}>
                    {pistasList.length === 0 ? (
                      <div style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>Todos los clientes tienen órdenes este mes 🎉</div>
                    ) : (
                      pistasList.map((p, i) => {
                        let diasEnPista = null
                        if (p.fechaRegistro) {
                          const parseFR = (s) => {
                            if (!s) return null
                            if (s instanceof Date) return s
                            if (s.includes('T')) return new Date(s)
                            if (s.includes('/')) { const pts = s.split(' ')[0].split('/'); if (pts.length === 3) return new Date(pts[2], pts[1]-1, pts[0]) }
                            return null
                          }
                          const fr = parseFR(p.fechaRegistro)
                          if (fr) { const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0); fr.setHours(0,0,0,0); diasEnPista = Math.max(0, Math.floor((hoy - fr) / (1000*60*60*24))) }
                        }
                        return (
                        <div key={i} style={{ padding: '10px 20px', borderBottom: i < pistasList.length-1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ink)' }}>{p.nombre}</div>
                            {p.negocio && <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.negocio}</div>}
                            {diasEnPista !== null && (
                              <div style={{ fontSize: '11px', fontWeight: '600', marginTop: '2px', color: diasEnPista >= 14 ? '#dc2626' : '#d97706' }}>
                                {diasEnPista === 0 ? 'Registrado hoy' : `${diasEnPista} ${diasEnPista === 1 ? 'día' : 'días'} en pista.`}
                              </div>
                            )}
                          </div>
                          {(p.telefono || p.email) && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
                              {p.telefono && (
                                <a
                                  href={`https://wa.me/593${p.telefono.toString().replace(/\D/g,'').replace(/^0/,'')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#25d366', fontWeight: '700', textDecoration: 'none' }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                  {p.telefono}
                                </a>
                              )}
                              {p.email && (
                                <a
                                  href={`mailto:${p.email}`}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--brand)', fontWeight: '600', textDecoration: 'none' }}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                  </svg>
                                  {p.email}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })()}
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
          style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '7px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-dark)'}>
          <Icon d={icons.edit} size={13} /> Editar
        </button>
      </div>
    </div>
  )
}

// ─── ViewClient ───────────────────────────────────────────────────────────────
function ViewClient({ client, onEdit, onBack }) {
  const fields = [
    { icon: 'id', label: 'Identificación', val: client.identificacion },
    { icon: 'phone', label: 'Teléfono', val: client.telefono },
    { icon: 'mail', label: 'Email', val: client.email },
    { icon: 'map', label: 'Dirección', val: client.direccion },
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
            style={{ background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-dark)'}>
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
              {label === 'Dirección' ? (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '14px', fontWeight: '500', color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  {val} <Icon d={icons.map} size={13} />
                </a>
              ) : (
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{val}</div>
              )}
            </div>
          ) : null)}
        </div>

        <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--border)' }}>
          {formatFecha(client.fechaRegistro, 'Registrado ')}
        </div>
      </div>

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
  const [form, setForm] = useState({ nombre: client.nombre || '', negocio: client.negocio || '', identificacion: client.identificacion || '', telefono: client.telefono || '', email: client.email || '', direccion: client.direccion || '', contacto: client.contacto || '', telefonoContacto: client.telefonoContacto || '', notas: client.notas || '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: null })) }
  const gs = (f) => ({ ...inputStyle, borderColor: errors[f] ? 'var(--accent)' : focusedField === f ? 'var(--brand)' : 'var(--border)', boxShadow: focusedField === f ? '0 0 0 3px rgba(30,58,95,0.12)' : 'none' })
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
          <div style={sectionTitle}>Notas / Comentarios</div>
          <Field label="Notas / Comentarios" icon="note">
            <textarea {...fp('notas')} placeholder="Observaciones del cliente..." style={{ ...gs('notas'), resize: 'vertical', minHeight: '80px', lineHeight: '1.5', fontSize: '14px' }} />
          </Field>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '13px', background: 'var(--cream)', color: 'var(--ink)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: '13px', background: loading ? 'var(--muted)' : 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-dark)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-dark)' }}>
            {loading ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Guardar cambios</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Formato moneda ───────────────────────────────────────────────────────────
const fmtMoney = (n) => '$' + (parseFloat(n)||0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ─── Badge de estado ──────────────────────────────────────────────────────────
const ESTADO_COLORS = {
  'Negociando': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Detenido':   { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  'Perdido':    { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Vendido':    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

function EstadoBadge({ estado }) {
  const c = ESTADO_COLORS[estado] || { bg: 'var(--cream)', color: 'var(--muted)', border: 'var(--border)' }
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.04em' }}>
      {estado}
    </span>
  )
}

function OrderRow({ order, index, onView }) {
  return (
    <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: `fadeUp 0.2s ${Math.min(index,5)*0.04}s ease both` }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>{order.numOrden}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.clienteNombre}</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '3px' }}>{order.clienteNegocio || '—'} · {formatFecha(order.fecha)}</div>
        {order.clienteTelefono && (
          <a href={`https://wa.me/593${order.clienteTelefono.replace(/\D/g,'').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: '#16a34a', textDecoration: 'none', marginRight: '10px' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
            <Icon d={icons.phone} size={12} />{order.clienteTelefono}
          </a>
        )}
        {order.clienteEmail && (
          <a href={`mailto:${order.clienteEmail}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--brand)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
            <Icon d={icons.mail} size={12} />{order.clienteEmail}
          </a>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
        <EstadoBadge estado={order.estado} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '16px' }}>{fmtMoney(order.total)}</div>
        <button onClick={() => onView(order)} style={{ padding: '5px 12px', background: 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}>
          Ver
        </button>
      </div>
    </div>
  )
}

function ViewOrder({ order, onBack, onChangeEstado }) {
  const [estado, setEstado] = useState(order.estado)
  const [saving, setSaving] = useState(false)

  const handleEstado = async (nuevoEstado) => {
    setSaving(true)
    try {
      const params = new URLSearchParams({ action: 'updateOrdenEstado', rowIndex: order.rowIndex, estado: nuevoEstado })
      const res = await fetch(`${API_BASE}?${params}`)
      const data = await res.json()
      if (data.success) { setEstado(nuevoEstado); onChangeEstado(order.rowIndex, nuevoEstado) }
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '24px' }}>
        <Icon d={icons.arrowLeft} size={15} /> Volver a órdenes
      </button>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '600', marginBottom: '4px' }}>{order.numOrden}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px' }}>{order.clienteNombre}</div>
            {order.clienteNegocio && <div style={{ fontSize: '14px', color: 'var(--muted)' }}>{order.clienteNegocio}</div>}
            {order.clienteTelefono && (
              <a href={`https://wa.me/593${order.clienteTelefono.replace(/\D/g,'').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '13px', fontWeight: '600', color: '#16a34a', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                <Icon d={icons.phone} size={13} />{order.clienteTelefono}
              </a>
            )}
            {order.clienteEmail && (
              <a href={`mailto:${order.clienteEmail}`}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--brand)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                <Icon d={icons.mail} size={13} />{order.clienteEmail}
              </a>
            )}
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>{formatFecha(order.fecha)}</div>
          </div>
          <EstadoBadge estado={estado} />
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Cambiar estado</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Negociando','Detenido','Perdido','Vendido'].map(e => {
              const c = ESTADO_COLORS[e]; const activo = estado === e
              return <button key={e} onClick={() => !activo && handleEstado(e)} disabled={saving} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${activo ? c.color : 'var(--border)'}`, background: activo ? c.bg : 'var(--white)', color: activo ? c.color : 'var(--muted)', fontSize: '12px', fontWeight: '700', cursor: activo ? 'default' : 'pointer', transition: 'all 0.15s' }}>{e}</button>
            })}
          </div>
        </div>
      </div>
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Productos</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(order.items||[]).map((item, i) => (
            <div key={i} style={{ padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.nombre}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  {item.cantidad} × {fmtMoney(item.precioUnitario)}{item.descuento > 0 && ` · Desc. ${item.descuento}%`}{item.iva > 0 && ` · IVA ${item.iva}%`}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>{fmtMoney(item.total)}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}><span>Subtotal sin IVA</span><span>{fmtMoney(order.totalSinIva)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}><span>IVA</span><span>{fmtMoney(order.totalIva)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontFamily: 'var(--font-display)', fontWeight: '800' }}><span>Total</span><span>{fmtMoney(order.total)}</span></div>
        </div>
      </div>
      {/* Notas */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.note} size={13} />Notas de la orden</div>
        {order.notas
          ? <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--muted)' }}>"{order.notas}"</div>
          : <div style={{ fontSize: '13px', color: 'var(--border)' }}>Sin notas</div>}
      </div>
      {/* Seguimiento */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow)' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.calendar} size={13} />Seguimiento</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Siguiente acción (fecha)</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: order.siguienteAccionFecha ? 'var(--ink)' : 'var(--border)' }}>
              {order.siguienteAccionFecha ? formatFecha(order.siguienteAccionFecha) : '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Acción a realizar</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: order.accion ? 'var(--ink)' : 'var(--border)' }}>
              {order.accion || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewOrder({ onBack, onSaved, showToast }) {
  const [clienteSearch, setClienteSearch] = useState('')
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [productos, setProductos] = useState([])
  const [items, setItems] = useState([])
  const [estado, setEstado] = useState('Negociando')
  const [notas, setNotas] = useState('')
  const [siguienteAccionFecha, setSiguienteAccionFecha] = useState('')
  const [accion, setAccion] = useState('')
  const [acciones, setAcciones] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}?action=getProductos`).then(r => r.json()).then(d => { if (d.success) setProductos(d.data) }).catch(() => {})
    fetch(`${API_BASE}?action=getAcciones`).then(r => r.json()).then(d => { if (d.success) setAcciones(d.data) }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!clienteSearch.trim()) { setClientes([]); return }
    setLoadingClientes(true)
    fetch(API_BASE).then(r => r.json()).then(d => {
      if (d.success) {
        const q = norm(clienteSearch)
        setClientes(d.data.filter(c => norm(c.nombre).includes(q) || norm(c.negocio||'').includes(q)))
      }
    }).catch(() => {}).finally(() => setLoadingClientes(false))
  }, [clienteSearch])

  const addItem = (producto) => {
    setItems(prev => {
      const exists = prev.find(i => i.producto.rowIndex === producto.rowIndex)
      if (exists) return prev.map(i => i.producto.rowIndex === producto.rowIndex ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { producto, cantidad: 1, descuento: 0 }]
    })
  }
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))
  const updateItem = (idx, field, value) => setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: parseFloat(value)||0 } : item))

  const calcTotals = () => {
    let sinIva = 0, ivaTotal = 0
    items.forEach(({ producto, cantidad, descuento }) => { const sub = cantidad * producto.precio * (1 - descuento/100); sinIva += sub; ivaTotal += sub * (producto.iva/100) })
    return { sinIva, ivaTotal, total: sinIva + ivaTotal }
  }

  const handleSave = async () => {
    if (!clienteSeleccionado) { showToast('Selecciona un cliente', 'error'); return }
    if (items.length === 0) { showToast('Agrega al menos un producto', 'error'); return }
    setSaving(true)
    try {
      const lineItems = items.map(({ producto, cantidad, descuento }) => ({ codigo: producto.codigo, nombre: producto.nombre, cantidad, precioUnitario: producto.precio, iva: producto.iva, descuento }))
      const params = new URLSearchParams({ action: 'createOrden', clienteNombre: clienteSeleccionado.nombre, clienteNegocio: clienteSeleccionado.negocio||'', estado, notas, siguienteAccionFecha: siguienteAccionFecha||'', accion: accion||'', items: JSON.stringify(lineItems) })
      const res = await fetch(`${API_BASE}?${params}`)
      const data = await res.json()
      if (data.success) { showToast(`✓ Orden ${data.numOrden} creada`); onSaved() }
      else showToast(data.error || 'Error al crear orden', 'error')
    } catch { showToast('Error de conexión', 'error') }
    finally { setSaving(false) }
  }

  const { sinIva, ivaTotal, total } = calcTotals()

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '24px' }}><Icon d={icons.arrowLeft} size={15} /> Cancelar</button>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px', marginBottom: '10px' }}>Nueva orden</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>Crear orden</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Cliente */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.user} size={13} />Cliente</div>
          {clienteSeleccionado ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-light)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
              <div><div style={{ fontWeight: '700', fontSize: '15px' }}>{clienteSeleccionado.nombre}</div><div style={{ fontSize: '13px', color: 'var(--muted)' }}>{clienteSeleccionado.negocio||'—'}</div></div>
              <button onClick={() => setClienteSeleccionado(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}><Icon d={icons.x} size={16} /></button>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}><Icon d={icons.search} size={15} /></span>
                <input type="text" placeholder="Buscar cliente..." value={clienteSearch} onChange={e => setClienteSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '38px', fontSize: '14px' }} />
              </div>
              {loadingClientes && <div style={{ fontSize: '13px', color: 'var(--muted)', padding: '8px 0' }}>Buscando...</div>}
              {clientes.length > 0 && (
                <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  {clientes.slice(0,5).map((c, i) => (
                    <div key={c.rowIndex} onClick={() => { setClienteSeleccionado(c); setClienteSearch('') }}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < Math.min(clientes.length,5)-1 ? '1px solid var(--cream)' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{c.nombre}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{c.negocio||'—'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Productos */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.package} size={13} />Productos</div>

          {/* Catálogo primero */}
          {productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)', fontSize: '13px' }}>No hay productos en el catálogo.<br />Agrégalos en la pestaña "Productos" del Sheet.</div>
          ) : (
            <div style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: items.length > 0 ? '14px' : '0' }}>
              {productos.map((p, i) => (
                <div key={p.rowIndex} onClick={() => addItem(p)}
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: i < productos.length-1 ? '1px solid var(--cream)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div><div style={{ fontWeight: '600', fontSize: '14px' }}>{p.nombre}</div><div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.categoria && `${p.categoria} · `}IVA {p.iva}% · {fmtMoney(p.precio)}</div></div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}><Icon d={icons.plus} size={14} /></div>
                </div>
              ))}
            </div>
          )}

          {/* Items elegidos abajo */}
          {items.length > 0 && (
            <>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Seleccionados</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div><div style={{ fontWeight: '700', fontSize: '14px' }}>{item.producto.nombre}</div><div style={{ fontSize: '12px', color: 'var(--muted)' }}>{fmtMoney(item.producto.precio)} · IVA {item.producto.iva}%</div></div>
                      <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}><Icon d={icons.x} size={15} /></button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cantidad</label>
                        <input type="number" min="1" value={item.cantidad} onChange={e => updateItem(idx, 'cantidad', e.target.value)} style={{ ...inputStyle, padding: '7px 10px', fontSize: '14px', marginTop: '4px' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Descuento %</label>
                        <input type="number" min="0" max="100" value={item.descuento} onChange={e => updateItem(idx, 'descuento', e.target.value)} style={{ ...inputStyle, padding: '7px 10px', fontSize: '14px', marginTop: '4px' }} />
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px', marginTop: '6px' }}>
                      {fmtMoney((item.cantidad * item.producto.precio * (1 - item.descuento/100)) * (1 + item.producto.iva/100))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Estado y notas */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>Estado y notas</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {['Negociando','Vendido'].map(e => {
              const c = ESTADO_COLORS[e]; const activo = estado === e
              return <button key={e} onClick={() => setEstado(e)} style={{ padding: '7px 16px', borderRadius: '20px', border: `1.5px solid ${activo ? c.color : 'var(--border)'}`, background: activo ? c.bg : 'var(--white)', color: activo ? c.color : 'var(--muted)', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>{e}</button>
            })}
          </div>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas de la orden..." style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5', fontSize: '14px' }} />
        </div>
        {/* Siguiente acción */}
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.calendar} size={13} />Seguimiento</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Siguiente acción (fecha)</div>
              <input type="date" value={siguienteAccionFecha} onChange={e => setSiguienteAccionFecha(e.target.value)} style={{ ...inputStyle, fontSize: '14px' }} />
              {siguienteAccionFecha && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{formatFecha(siguienteAccionFecha)}</div>}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Acción a realizar</div>
              <select value={accion} onChange={e => setAccion(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', fontSize: '14px' }}>
                <option value="">— Seleccionar —</option>
                {acciones.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
        </div>
        {/* Resumen */}
        {items.length > 0 && (
          <div style={{ background: 'var(--brand)', borderRadius: 'var(--radius-lg)', padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.7 }}><span>Subtotal sin IVA</span><span>{fmtMoney(sinIva)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.7 }}><span>IVA</span><span>{fmtMoney(ivaTotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: '800', marginTop: '4px' }}><span>Total</span><span>{fmtMoney(total)}</span></div>
            </div>
            <button onClick={handleSave} disabled={saving || !clienteSeleccionado} style={{ width: '100%', padding: '13px', background: saving || !clienteSeleccionado ? 'rgba(255,255,255,0.2)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: saving || !clienteSeleccionado ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
              {saving ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Ingresar orden</>}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function OrdersView({ onViewOrder }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('Negociando')
  const [meta, setMeta] = useState(0)
  const [historialOpen, setHistorialOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [modoHistorial, setModoHistorial] = useState(false)
  const [searchOrden, setSearchOrden] = useState('')
  const [sortField, setSortField] = useState('total')   // 'total' | 'fecha'
  const [sortDir, setSortDir] = useState('desc')         // 'asc' | 'desc'

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortField(field); setSortDir('desc') }
  }

  // Mes actual en Guayaquil
  const now = getNowGuayaquil()
  const mesNombre = MESES_LARGO[now.getMonth()]
  const anioActual = now.getFullYear()
  const mesActualLabel = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)

  useEffect(() => {
    fetch(`${API_BASE}?action=getOrdenes`).then(r => r.json()).then(d => { if (d.success) setOrders(d.data) }).catch(() => {}).finally(() => setLoading(false))
    fetch(`${API_BASE}?action=dashboard`).then(r => r.json()).then(d => { if (d.success) setMeta(d.data.meta || 0) }).catch(() => {})
  }, [])

  // Parsear fecha de orden a Date
  const parseFechaOrden = (raw) => {
    if (!raw) return null
    if (raw instanceof Date) return raw
    if (typeof raw === 'string' && raw.includes('/')) {
      const parts = raw.split(' ')[0].split('/')
      if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0])
    }
    if (typeof raw === 'string' && raw.includes('T')) return new Date(raw)
    return null
  }

  // Filtrar por mes actual o rango historial
  const ordenesMes = useMemo(() => {
    return orders.filter(o => {
      const f = parseFechaOrden(o.fecha)
      if (!f) return false
      if (modoHistorial && fechaInicio && fechaFin) {
        const [iy, im, id] = fechaInicio.split('-').map(Number)
        const [fy, fm, fd] = fechaFin.split('-').map(Number)
        const ini = new Date(iy, im-1, id, 0, 0, 0, 0)
        const fin = new Date(fy, fm-1, fd, 23, 59, 59, 999)
        return f >= ini && f <= fin
      }
      return f.getMonth() === now.getMonth() && f.getFullYear() === anioActual
    })
  }, [orders, modoHistorial, fechaInicio, fechaFin])

  const filtradas = useMemo(() => {
    let list = filtroEstado === 'Todos' ? ordenesMes : ordenesMes.filter(o => o.estado === filtroEstado)
    if (searchOrden.trim()) {
      const q = norm(searchOrden)
      list = list.filter(o => norm(o.clienteNombre).includes(q) || norm(o.clienteNegocio).includes(q) || norm(o.numOrden).includes(q))
    }
    list = [...list].sort((a, b) => {
      if (sortField === 'total') {
        const diff = (parseFloat(a.total)||0) - (parseFloat(b.total)||0)
        return sortDir === 'desc' ? -diff : diff
      } else {
        const fa = parseFechaOrden(a.fecha), fb = parseFechaOrden(b.fecha)
        const diff = (fa||0) - (fb||0)
        return sortDir === 'desc' ? -diff : diff
      }
    })
    return list
  }, [ordenesMes, filtroEstado, searchOrden, sortField, sortDir])

  // Totales del filtro activo
  const totalMonto = filtradas.reduce((s, o) => s + (parseFloat(o.total) || 0), 0)
  const totalCantidad = filtradas.length
  const totalClientes = new Set(filtradas.map(o => o.clienteNombre)).size

  const aplicarHistorial = () => {
    if (fechaInicio && fechaFin) { setModoHistorial(true); setHistorialOpen(false) }
  }
  const limpiarHistorial = () => { setModoHistorial(false); setFechaInicio(''); setFechaFin(''); setHistorialOpen(false) }

  const periodoLabel = modoHistorial && fechaInicio && fechaFin
    ? `${formatFecha(fechaInicio)} — ${formatFecha(fechaFin)}`
    : `${mesActualLabel} ${anioActual}`

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Título */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em' }}>
          Órdenes de {mesActualLabel}
        </h1>
        {modoHistorial && (
          <div style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon d={icons.calendar} size={13} /> Historial: {periodoLabel}
            <button onClick={limpiarHistorial} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '0 2px', fontSize: '12px', fontWeight: '700' }}>✕ Volver al mes</button>
          </div>
        )}
      </div>

      {/* Meta card */}
      {meta > 0 && (
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: '16px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={icons.target} size={15} stroke="#6366f1" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Meta {mesActualLabel}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '18px', color: '#6366f1' }}>{fmtMoney(meta)}</span>
        </div>
      )}

      {/* Botones de estado + Historial */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Vendido','Negociando','Detenido','Perdido','Todos'].map(e => {
            const activo = filtroEstado === e
            const verde = ESTADO_COLORS['Vendido']
            const rojo  = ESTADO_COLORS['Perdido']
            const colorActivo = e === 'Todos' ? { bg: 'var(--brand)', color: 'white', border: 'var(--brand)' }
              : (e === 'Vendido' || e === 'Negociando') ? { bg: verde.bg, color: verde.color, border: verde.color }
              : { bg: rojo.bg, color: rojo.color, border: rojo.color }
            return <button key={e} onClick={() => setFiltroEstado(e)} style={{
              padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: '700',
              border: `1.5px solid ${activo ? colorActivo.border : 'var(--border)'}`,
              background: activo ? colorActivo.bg : 'var(--white)',
              color: activo ? colorActivo.color : 'var(--muted)',
            }}>{e}</button>
          })}
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button onClick={() => setHistorialOpen(!historialOpen)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${modoHistorial ? 'var(--brand)' : 'var(--border)'}`, background: modoHistorial ? 'var(--brand-light)' : 'var(--white)', color: modoHistorial ? 'var(--brand)' : 'var(--muted)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            <Icon d={icons.calendar} size={13} /> Historial
          </button>
          {historialOpen && (
            <div style={{ position: 'absolute', right: 0, top: '36px', zIndex: 100, background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-lg)', minWidth: '240px', animation: 'fadeUp 0.15s ease' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Rango de fechas</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600' }}>Desde</label>
                  <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} style={{ ...inputStyle, padding: '7px 10px', fontSize: '13px', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600' }}>Hasta</label>
                  <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} style={{ ...inputStyle, padding: '7px 10px', fontSize: '13px', marginTop: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={limpiarHistorial} style={{ flex: 1, padding: '8px', background: 'var(--cream)', color: 'var(--muted)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Limpiar</button>
                <button onClick={aplicarHistorial} disabled={!fechaInicio || !fechaFin} style={{ flex: 2, padding: '8px', background: !fechaInicio || !fechaFin ? 'var(--muted)' : 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '12px', fontWeight: '700', cursor: !fechaInicio || !fechaFin ? 'not-allowed' : 'pointer' }}>Aplicar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total del filtro activo */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: '12px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '600' }}>
          {filtroEstado === 'Todos' ? 'Todas las órdenes' : filtroEstado} · {totalClientes} {totalClientes === 1 ? 'cliente' : 'clientes'} · {totalCantidad} {totalCantidad === 1 ? 'orden' : 'órdenes'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', color: filtroEstado !== 'Todos' && ESTADO_COLORS[filtroEstado] ? ESTADO_COLORS[filtroEstado].color : 'var(--brand)' }}>
          {fmtMoney(totalMonto)}
        </div>
      </div>

      {/* Búsqueda + ordenamiento */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}><Icon d={icons.search} size={15} /></span>
          <input type="text" placeholder="Buscar por cliente, negocio o # orden..." value={searchOrden} onChange={e => setSearchOrden(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '38px', paddingRight: searchOrden ? '36px' : '12px', fontSize: '13px' }} />
          {searchOrden && <button onClick={() => setSearchOrden('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: '2px' }}><Icon d={icons.x} size={14} /></button>}
        </div>
        {[{ field: 'total', labelAsc: '$ ↑', labelDesc: '$ ↓' }, { field: 'fecha', labelAsc: 'Fecha ↑', labelDesc: 'Fecha ↓' }].map(({ field, labelAsc, labelDesc }) => {
          const activo = sortField === field
          return (
            <button key={field} onClick={() => toggleSort(field)} style={{ padding: '7px 12px', borderRadius: '20px', border: `1.5px solid ${activo ? 'var(--brand)' : 'var(--border)'}`, background: activo ? 'var(--brand-light)' : 'var(--white)', color: activo ? 'var(--brand)' : 'var(--muted)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              {activo ? (sortDir === 'desc' ? labelDesc : labelAsc) : labelDesc}
            </button>
          )
        })}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}><div style={{ fontSize: '24px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>Cargando órdenes...</div>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--white)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--muted)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>Sin órdenes{filtroEstado !== 'Todos' ? ` en "${filtroEstado}"` : ''}</div>
          <div style={{ fontSize: '14px' }}>Crea una nueva orden desde el menú</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtradas.map((o, i) => <OrderRow key={o.numOrden} order={o} index={i} onView={onViewOrder} />)}
        </div>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard')
  const [ordersKey, setOrdersKey] = useState(0)
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
  const [viewingOrder, setViewingOrder] = useState(null)
  const [orders, setOrders] = useState([])
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
    const q = norm(searchQuery)
    return clients.filter(c => norm(c.nombre).includes(q) || norm(c.negocio).includes(q) || norm(c.identificacion).includes(q))
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

  const navigate = (v) => { setView(v); setMenuOpen(false); if (v !== 'edit') setEditingClient(null); if (v !== 'view') setViewingClient(null); if (v !== 'viewOrder' && v !== 'newOrder') setViewingOrder(null); if (v === 'orders') setOrdersKey(k => k + 1) }
  const handleEdit = (c) => { setEditingClient(c); setViewingClient(null); setView('edit') }
  const handleView = (c) => { setViewingClient(c); setView('view') }
  const handleSaveEdit = (c) => { setClients(p => p.map(x => x.rowIndex === c.rowIndex ? c : x)); showToast(`✓ ${c.nombre} actualizado`); setView('list') }
  const handleViewOrder = (o) => { setViewingOrder(o); setView('viewOrder') }
  const handleChangeEstado = (rowIndex, estado) => setOrders(p => p.map(o => o.rowIndex === rowIndex ? { ...o, estado } : o))

  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: null })) }
  const gs = (f) => ({ ...inputStyle, borderColor: errors[f] ? 'var(--accent)' : focusedField === f ? 'var(--brand)' : 'var(--border)', boxShadow: focusedField === f ? '0 0 0 3px rgba(30,58,95,0.12)' : 'none' })
  const fp = (f, x = {}) => ({ style: gs(f), value: form[f], onChange: e => inp(f, e.target.value), onFocus: () => setFocusedField(f), onBlur: () => setFocusedField(null), ...x })

  const menuItems = [
    { key: 'dashboard', icon: icons.dashboard, label: 'Dashboard' },
    { key: 'form',      icon: icons.plus,      label: 'Nuevo cliente' },
    { key: 'list',      icon: icons.list,       label: 'Clientes' },
    { key: 'newOrder',  icon: icons.plus,       label: 'Nueva orden' },
    { key: 'orders',    icon: icons.orders,     label: 'Órdenes' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }} onClick={() => menuOpen && setMenuOpen(false)}>

      {/* Header */}
      <header style={{ background: 'var(--brand)', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'sticky', top: 0, zIndex: 200 }}>
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
          {menuItems.map(({ key, icon, label }) => {
              const isActive = view === key || (view === 'edit' && key === 'list') || (view === 'view' && key === 'list') || (view === 'viewOrder' && key === 'orders')
              return (
                <button key={key} onClick={() => navigate(key)} style={{ width: '100%', padding: '13px 18px', background: isActive ? 'var(--accent-light)' : 'transparent', border: 'none', borderBottom: '1px solid var(--cream)', color: isActive ? 'var(--accent)' : 'var(--ink)', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--cream)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                  <Icon d={icon} size={17} stroke={isActive ? 'var(--accent)' : 'var(--ink)'} />
                  {label}
                </button>
              )
            })}
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
                <div style={sectionTitle}>Notas / Comentarios</div>
                <Field label="Notas / Comentarios" icon="note"><textarea {...fp('notas')} style={{ ...gs('notas'), resize: 'vertical', minHeight: '90px', lineHeight: '1.5' }} placeholder="Interés del cliente, próximos pasos, observaciones..." /></Field>
              </div>
              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'var(--muted)' : 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginTop: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-dark)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--brand-dark)' }}>
                {loading ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Registrar cliente</>}
              </button>
            </div>
          </div>
        )}

        {/* ── CLIENTES ──────────────────────────────────────────────────────── */}
        {view === 'list' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em' }}>Clientes</h1>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{searchQuery ? `${filteredClients.length} de ${clients.length} clientes` : `${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'} en total`}</p>
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

        {/* ── ÓRDENES ───────────────────────────────────────────────────────── */}
        {view === 'orders' && (
          <OrdersView key={ordersKey} onViewOrder={handleViewOrder} />
        )}

        {/* ── VER ORDEN ─────────────────────────────────────────────────────── */}
        {view === 'viewOrder' && viewingOrder && (
          <ViewOrder order={viewingOrder} onBack={() => setView('orders')} onChangeEstado={handleChangeEstado} />
        )}

        {/* ── NUEVA ORDEN ───────────────────────────────────────────────────── */}
        {view === 'newOrder' && (
          <NewOrder onBack={() => setView('orders')} onSaved={() => setView('orders')} showToast={showToast} />
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
