import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

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
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
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

// ─── DatePicker (semana lunes→domingo) ────────────────────────────────────────
function DatePicker({ value, onChange, placeholder = 'dd/mm/aaaa' }) {
  // value y onChange en formato yyyy-MM-dd (igual que input[type=date])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const today = getNowGuayaquil()
  const parsed = value ? (() => { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d) })() : null
  const [viewYear,  setViewYear]  = useState(parsed ? parsed.getFullYear()  : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth()     : today.getMonth())

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const DIAS_CORTOS = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']
  const MESES_NOMBRES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  // Primer día del mes (ajustado: lunes=0)
  const firstDay = new Date(viewYear, viewMonth, 1)
  const startDow = (firstDay.getDay() + 6) % 7 // lunes=0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const select = (d) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
    setOpen(false)
  }

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1) } else setViewMonth(m => m+1) }

  const displayValue = parsed
    ? `${String(parsed.getDate()).padStart(2,'0')}/${String(parsed.getMonth()+1).padStart(2,'0')}/${parsed.getFullYear()}`
    : ''

  const isSelected = (d) => parsed && parsed.getFullYear()===viewYear && parsed.getMonth()===viewMonth && parsed.getDate()===d
  const isToday = (d) => today.getFullYear()===viewYear && today.getMonth()===viewMonth && today.getDate()===d

  return (
    <div ref={ref} style={{ position:'relative', width:'100%' }}>
      <div onClick={() => setOpen(v => !v)}
        style={{ ...inputStyle, padding:'7px 10px', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', userSelect:'none', background: open ? 'var(--brand-light)' : 'var(--white)', borderColor: open ? 'var(--brand)' : 'var(--border)' }}>
        <span style={{ color: displayValue ? 'var(--ink)' : 'var(--muted)' }}>{displayValue || placeholder}</span>
        <Icon d={icons.calendar} size={14} />
      </div>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, zIndex:400, background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-lg)', padding:'12px', minWidth:'260px', animation:'fadeUp 0.15s ease' }}
          onMouseDown={e => e.stopPropagation()}>
          {/* Nav mes */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <button onClick={prevMonth} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 8px', borderRadius:'var(--radius)', color:'var(--muted)', fontSize:'16px', lineHeight:1 }}>‹</button>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:'700', fontSize:'13px' }}>{MESES_NOMBRES[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 8px', borderRadius:'var(--radius)', color:'var(--muted)', fontSize:'16px', lineHeight:1 }}>›</button>
          </div>
          {/* Cabecera días */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'4px' }}>
            {DIAS_CORTOS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'10px', fontWeight:'700', color:'var(--muted)', padding:'2px 0' }}>{d}</div>)}
          </div>
          {/* Celdas */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
            {cells.map((d, i) => d === null
              ? <div key={`e${i}`} />
              : <button key={d} onClick={() => select(d)}
                  style={{ padding:'5px 0', textAlign:'center', border:'none', borderRadius:'var(--radius)', fontSize:'12px', fontWeight: isSelected(d) ? '800' : isToday(d) ? '700' : '400', background: isSelected(d) ? 'var(--brand)' : isToday(d) ? 'var(--brand-light)' : 'transparent', color: isSelected(d) ? 'white' : isToday(d) ? 'var(--brand)' : 'var(--ink)', cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e => { if (!isSelected(d)) e.currentTarget.style.background = 'var(--cream)' }}
                  onMouseLeave={e => { if (!isSelected(d)) e.currentTarget.style.background = isToday(d) ? 'var(--brand-light)' : 'transparent' }}>
                  {d}
                </button>
            )}
          </div>
          {value && (
            <button onClick={() => { onChange(''); setOpen(false) }}
              style={{ marginTop:'8px', width:'100%', padding:'6px', background:'var(--cream)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', fontSize:'11px', fontWeight:'700', color:'var(--muted)', cursor:'pointer' }}>
              Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  )
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

// ─────────────────────────────────────────────────────────────────────────────
// MI DÍA DE HOY
// ─────────────────────────────────────────────────────────────────────────────
function MiDia({ onViewOrder }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [diasExtra, setDiasExtra] = useState(0)
  const [sortField, setSortField] = useState('fecha')
  const [sortDir, setSortDir] = useState('asc')

  const [dashData, setDashData] = useState(null)
  const [speaking, setSpeaking] = useState(false)

  const hablar = (actividadesHoy, actividadesVencidas, diasVencidos, diasExtra, faltante, totalVencido) => {
    if (!window.speechSynthesis) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const totalHoy = actividadesHoy.reduce((s,o) => s + (o.total||0), 0)
    const listaVenc = actividadesVencidas.filter(o => {
      const s = o.siguienteAccionFecha?.toString().trim().split(' ')[0]
      if (!s || !s.includes('/')) return false
      const p = s.split('/')
      if (p.length !== 3) return false
      const f = new Date(p[2], p[1]-1, p[0])
      f.setHours(0,0,0,0)
      const hoy2 = getNowGuayaquil(); hoy2.setHours(0,0,0,0)
      return Math.floor((hoy2 - f) / (1000*60*60*24)) <= diasVencidos + diasExtra
    })
    const numHoy = actividadesHoy.length
    const numVenc = listaVenc.length
    const totalVenc = listaVenc.reduce((s,o) => s + (o.total||0), 0)
    const numAPalabras = (n) => {
      let num = parseFloat(n) || 0
      // Redondear al millar más cercano si >= 1000, a la centena si < 1000
      if (num >= 1000) num = Math.round(num / 1000) * 1000
      else num = Math.round(num / 100) * 100
      num = Math.round(num)
      if (num === 0) return 'cero dólares'
      const unidades = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve',
        'diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve']
      const decenas = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa']
      const centenas = ['','cien','doscientos','trescientos','cuatrocientos','quinientos',
        'seiscientos','setecientos','ochocientos','novecientos']
      const parteEntera = (n) => {
        if (n === 0) return ''
        if (n < 20) return unidades[n]
        if (n < 100) {
          const d = Math.floor(n/10), u = n%10
          return u === 0 ? decenas[d] : `${d===2?'veinti':''}${d===2?unidades[u]:decenas[d]+' y '+unidades[u]}`
        }
        if (n < 1000) {
          const c = Math.floor(n/100), r = n%100
          const sc = c===1&&r===0?'cien':c===1?'ciento':centenas[c]
          return r===0?sc:`${sc} ${parteEntera(r)}`
        }
        if (n < 1000000) {
          const miles = Math.floor(n/1000), r = n%1000
          const smiles = miles===1?'mil':`${parteEntera(miles)} mil`
          return r===0?smiles:`${smiles} ${parteEntera(r)}`
        }
        return n.toString()
      }
      const textoEntero = parteEntera(num) || 'cero'
      return `${textoEntero} dólares`
    }
    const hora = getNowGuayaquil().getHours()
    const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
    const nombre = (actividadesHoy[0] && data?.nombreUsuario) ? `, ${data.nombreUsuario}` : ''
    const parteHoy = numHoy === 0
      ? 'No tienes actividades programadas para hoy.'
      : `Hoy tienes ${numHoy} ${numHoy === 1 ? 'actividad programada' : 'actividades programadas'} por ${numAPalabras(totalHoy)}.`
    const parteVenc = numVenc === 0
      ? 'No tienes órdenes vencidas pendientes.'
      : `Tienes ${numVenc} ${numVenc === 1 ? 'orden vencida' : 'órdenes vencidas'} y estás regalando ${numAPalabras(totalVenc)} a la competencia.`
    const texto = `${saludo}${nombre}. ${parteHoy} ${parteVenc}`
    const utter = new SpeechSynthesisUtterance(texto)
    utter.lang = 'es-EC'
    utter.rate = 0.95
    utter.pitch = 1
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const dataRef = useRef(null)

  useEffect(() => {
    fetch(`${API_BASE}?action=getMiDia`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d.data)
          dataRef.current = d.data
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch(`${API_BASE}?action=dashboard`)
      .then(r => r.json())
      .then(d => { if (d.success) setDashData(d.data) })
      .catch(() => {})
  }, [])

  // Auto-hablar cuando carguen los datos
  useEffect(() => {
    if (!data) return
    const timer = setTimeout(() => {
      hablar(data.actividadesHoy, data.actividadesVencidas, data.diasVencidos, 0, data.faltante, data.totalVencido)
    }, 800)
    return () => clearTimeout(timer)
  }, [data])

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir(field === 'total' ? 'desc' : 'asc') }
  }

  const fmtM = (n) => `$${(parseFloat(n)||0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const parseFechaActividad = (s) => {
    if (!s) return null
    const parte = s.toString().trim().split(' ')[0]
    if (parte.includes('/')) {
      const p = parte.split('/')
      if (p.length === 3) return new Date(p[2], p[1]-1, p[0])
    }
    return null
  }

  const diasDesdeVencimiento = (s) => {
    const f = parseFechaActividad(s)
    if (!f) return 0
    f.setHours(0,0,0,0)
    const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0)
    return Math.max(0, Math.floor((hoy - f) / (1000*60*60*24)))
  }

  const contactosPorAccion = (order) => {
    const na = norm(order.accion || '')
    const contactos = []
    if (na === norm('Visitar')) {
      if (order.clienteTelefono) contactos.push({ type: 'tel', value: order.clienteTelefono })
      if (order.clienteEmail)    contactos.push({ type: 'email', value: order.clienteEmail })
    } else {
      if (order.clienteTelefono) contactos.push({ type: 'tel', value: order.clienteTelefono })
      if (order.clienteEmail)    contactos.push({ type: 'email', value: order.clienteEmail })
    }
    return contactos
  }

  const CardActividad = ({ order, urgencia }) => {
    const col = ESTADO_COLORS[order.estado] || { bg: 'var(--cream)', color: 'var(--muted)', border: 'var(--border)' }
    const dias = diasDesdeVencimiento(order.siguienteAccionFecha)
    const accion = (order.accion || '').trim()
    const na = norm(accion)
    const borderColor = urgencia ? (dias >= 7 ? '#dc2626' : '#d97706') : 'var(--border)'

    // Diff label (Hoy / Hace X días / En X días)
    const fechaAct = parseFechaActividad(order.siguienteAccionFecha)
    let diffLabel = null
    if (fechaAct) {
      const hoyD = getNowGuayaquil(); hoyD.setHours(0,0,0,0)
      const fD = new Date(fechaAct); fD.setHours(0,0,0,0)
      const diff = Math.round((fD - hoyD) / 86400000)
      if (diff < 0)  diffLabel = { label: `Hace ${Math.abs(diff)} día${Math.abs(diff)!==1?'s':''}`, color:'#dc2626', bg:'#fef2f2' }
      else if (diff === 0) diffLabel = { label:'Hoy', color:'#d97706', bg:'#fffbeb' }
      else if (diff === 1) diffLabel = { label:'Mañana', color:'#2563eb', bg:'#eff6ff' }
      else diffLabel = { label:`En ${diff} días`, color:'var(--muted)', bg:'var(--cream)' }
    }

    // Contactos por tipo de acción
    const contactos = []
    if (na === norm('Visitar')) {
      if (order.clienteTelefono)  contactos.push({ type:'tel',   value:order.clienteTelefono })
      if (order.clienteEmail)     contactos.push({ type:'email', value:order.clienteEmail })
      if (order.clienteDireccion) contactos.push({ type:'dir',   value:order.clienteDireccion })
    } else if (na === norm('Llamar')) {
      if (order.clienteTelefono) contactos.push({ type:'tel',   value:order.clienteTelefono })
      if (order.clienteEmail)    contactos.push({ type:'email', value:order.clienteEmail })
    } else {
      if (order.clienteTelefono) contactos.push({ type:'tel',   value:order.clienteTelefono })
      if (order.clienteEmail)    contactos.push({ type:'email', value:order.clienteEmail })
    }

    // Días en estado
    let diasEstadoEl = null
    if (order.fechaCambioEstado) {
      const s = order.fechaCambioEstado.toString().trim()
      let fcs = null
      if (s.includes('/')) { const p = s.split(' ')[0].split('/'); if (p.length === 3) fcs = new Date(p[2], p[1]-1, p[0]) }
      if (fcs) {
        fcs.setHours(0,0,0,0)
        const hoy2 = getNowGuayaquil(); hoy2.setHours(0,0,0,0)
        const d2 = Math.max(0, Math.floor((hoy2 - fcs) / (1000*60*60*24)))
        const col2 = d2 >= 7 ? '#dc2626' : d2 >= 3 ? '#d97706' : 'var(--muted)'
        const lbl2 = d2 === 0 ? `Hoy en ${order.estado.toLowerCase()}` : `${d2} ${d2===1?'día':'días'} en ${order.estado.toLowerCase()}`
        diasEstadoEl = <div style={{ fontSize:'11px', fontWeight:'700', color:col2, marginTop:'5px', display:'flex', alignItems:'center', gap:'4px' }}><Icon d={icons.clock} size={11} />{lbl2}</div>
      }
    }

    return (
      <div onClick={() => onViewOrder(order)}
        style={{ background:'var(--white)', border:`1.5px solid ${borderColor}`, borderRadius:'var(--radius-lg)', padding:'14px 16px', cursor:'pointer', transition:'box-shadow 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
          <div style={{ minWidth:0, flex:1 }}>
            {/* Diff + estado + acción */}
            <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px', flexWrap:'wrap' }}>
              {diffLabel && <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:diffLabel.bg, color:diffLabel.color }}>{diffLabel.label}</span>}
              <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:col.bg, color:col.color, border:`1px solid ${col.border}` }}>{order.estado}</span>
              {urgencia && dias > 0 && <span style={{ fontSize:'11px', fontWeight:'700', color:dias>=7?'#dc2626':'#d97706', background:dias>=7?'#fef2f2':'#fffbeb', padding:'2px 8px', borderRadius:'20px' }}>{dias} {dias===1?'día':'días'} vencida</span>}
            </div>
            {/* Cliente */}
            <div style={{ fontFamily:'var(--font-display)', fontWeight:'700', fontSize:'15px' }}>{order.clienteNombre}</div>
            {order.clienteNegocio && <div style={{ fontSize:'13px', color:'var(--muted)' }}>{order.clienteNegocio}</div>}
            {/* Fecha + hora + acción */}
            {order.siguienteAccionFecha && (
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'6px', flexWrap:'wrap' }}>
                <span style={{ fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', gap:'4px' }}>
                  <Icon d={icons.calendar} size={12} />
                  {formatFecha(order.siguienteAccionFecha)}
                  {order.siguienteAccionFecha?.toString().includes(' ') && (
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px' }}>
                      <Icon d={icons.clock} size={12} />{order.siguienteAccionFecha.toString().split(' ')[1]}
                    </span>
                  )}
                </span>
                {accion && <span style={{ fontSize:'12px', fontWeight:'600', color:'var(--brand)', background:'var(--brand-light)', padding:'1px 7px', borderRadius:'20px' }}>{accion}</span>}
              </div>
            )}
            {/* Contactos */}
            {contactos.length > 0 && (
              <div style={{ marginTop:'7px', display:'flex', flexDirection:'column', gap:'3px' }}>
                {contactos.map((ct, ci) => {
                  if (ct.type==='tel') return (
                    <a key={ci} href={`https://wa.me/593${ct.value.toString().replace(/\D/g,'').replace(/^0/,'')}`}
                      target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'#16a34a', textDecoration:'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                      <Icon d={icons.phone} size={12} />{ct.value}
                    </a>
                  )
                  if (ct.type==='email') return (
                    <a key={ci} href={`mailto:${ct.value}`} onClick={e => e.stopPropagation()}
                      style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'var(--brand)', textDecoration:'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                      <Icon d={icons.mail} size={12} />{ct.value}
                    </a>
                  )
                  if (ct.type==='dir') return (
                    <a key={ci} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ct.value)}`}
                      target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'var(--muted)', textDecoration:'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                      <Icon d={icons.map} size={12} />{ct.value}
                    </a>
                  )
                  return null
                })}
              </div>
            )}
            {/* Días en estado */}
            {diasEstadoEl}
            {/* Nota de seguimiento */}
            {order.notasSeguimiento && (
              <div style={{ fontSize:'12px', color:'var(--ink)', marginTop:'6px', fontStyle:'italic', lineHeight:'1.5', background:'var(--cream)', borderRadius:'6px', padding:'6px 10px', borderLeft:'3px solid var(--brand)' }}>
                "{order.notasSeguimiento}"
              </div>
            )}
          </div>
          {/* Total */}
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'15px', color:'var(--brand)' }}>{fmtM(order.total)}</div>
            <div style={{ fontSize:'10px', color:'var(--muted)', marginTop:'2px' }}>{order.numOrden}</div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
      <div style={{ fontSize: '28px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>
      Cargando tu día...
    </div>
  )

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '80px', color: 'var(--muted)' }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>😕</div>
      No se pudo cargar la información
    </div>
  )

  const { metaMes, valorX, diasLaborables, multiplicador, diasVencidos, diasVencidos2,
          actividadesHoy, actividadesVencidas, totalVencido, enCamino, faltante, nombreUsuario } = data

  const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const mesActual = MESES_ES[new Date().getMonth()]

  return (
    <div style={{ animation: 'fadeUp 0.4s ease', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '26px', letterSpacing: '-0.02em' }}>Mi día de hoy</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon d={icons.calendar} size={13} />{getTodayLabel()}
          </div>
          {data && (
            <button onClick={() => hablar(data.actividadesHoy, data.actividadesVencidas, data.diasVencidos, diasExtra, data.faltante, data.totalVencido)}
              title={speaking ? 'Detener' : 'Escuchar resumen del día'}
              style={{ background: speaking ? 'var(--brand)' : 'var(--white)', border: `1.5px solid ${speaking ? 'var(--brand)' : 'var(--border)'}`, borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{speaking ? '⏹' : '🔊'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Meta y Avance del mes */}
      {dashData && (() => {
        const now2    = getNowGuayaquil()
        const mesLbl2 = MESES_LARGO[now2.getMonth()].charAt(0).toUpperCase() + MESES_LARGO[now2.getMonth()].slice(1)
        const anio2   = now2.getFullYear()
        const meta2    = dashData.meta    || 0
        const vendido2 = dashData.vendido || 0
        const pct2     = meta2 > 0 ? Math.round((vendido2 / meta2) * 100) : 0
        const verde2   = '#16a34a'
        const cv       = dashData.conteos || {}
        return (
          <>
            <div style={{ background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 18px', marginBottom:'10px', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon d={icons.target} size={15} stroke="#6366f1" />
                </div>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Meta {mesLbl2} {anio2}</div>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'18px', color:'#6366f1' }}>{fmtMoney(meta2)}</div>
            </div>
            <div style={{ background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 18px', marginBottom:'16px', boxShadow:'var(--shadow)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <span style={{ fontSize:'12px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Avance del mes</span>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'16px', color: pct2 >= 100 ? verde2 : 'var(--ink)' }}>{pct2}%</span>
              </div>
              <div style={{ background:'var(--cream)', borderRadius:'100px', height:'8px', overflow:'hidden', marginBottom:'6px' }}>
                <div style={{ height:'100%', width:`${Math.min(100,pct2)}%`, background: pct2>=100 ? verde2 : pct2>=60 ? '#2563eb' : 'var(--brand)', borderRadius:'100px', transition:'width 0.8s ease' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'12px', color:'var(--muted)' }}>
                <span style={{ fontWeight:'600', color:verde2 }}>{fmtMoney(vendido2)} vendido</span>
                <span>·</span>
                <span>{cv.Vendido?.clientes||0} {(cv.Vendido?.clientes||0)===1?'cliente':'clientes'}</span>
                <span>·</span>
                <span>{cv.Vendido?.ordenes||0} {(cv.Vendido?.ordenes||0)===1?'orden':'órdenes'}</span>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── SECCIÓN 1: Actividades de hoy ─────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon d={icons.calendar} size={13} />
          Actividades de hoy · {actividadesHoy.length}
        </div>
        {actividadesHoy.length > 0 && (() => {
          const totalHoy = actividadesHoy.reduce((s,o) => s + (o.total||0), 0)
          return (
            <>
              <div style={{ textAlign:'center', marginBottom:'10px', padding:'8px 0' }}>
                <span style={{ fontSize:'13px', fontWeight:'800', color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.12em' }}>⚡ Esto es lo más importante</span>
              </div>
              <div style={{ background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:'var(--radius-lg)', padding:'12px 18px', marginBottom:'10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'12px', fontWeight:'700', color:'#16a34a', textTransform:'uppercase', letterSpacing:'0.06em' }}>Total hoy</span>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'18px', color:'#16a34a' }}>{fmtM(totalHoy)}</span>
              </div>
            </>
          )
        })()}
        {actividadesHoy.length === 0 ? (
          <div style={{ background: 'var(--white)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
            Sin actividades programadas para hoy
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {actividadesHoy.map(o => <CardActividad key={o.numOrden} order={o} urgencia={false} />)}
          </div>
        )}
      </div>

      {/* ── SECCIÓN 2: Dinero que estás dejando en la mesa ─────────────────── */}
      <div>
        <div style={{ textAlign:'center', marginBottom:'10px', padding:'8px 0' }}>
          <span style={{ fontSize:'13px', fontWeight:'800', color:'#dc2626', textTransform:'uppercase', letterSpacing:'0.12em' }}>💸 Dinero que estás perdiendo</span>
        </div>
        {/* Medidor verde/rojo */}
        {(() => {
          const listaVenc = actividadesVencidas.filter(o => {
            const f = parseFechaActividad(o.siguienteAccionFecha)
            if (!f) return false
            f.setHours(0,0,0,0)
            const hoy2 = getNowGuayaquil(); hoy2.setHours(0,0,0,0)
            return Math.floor((hoy2 - f) / (1000*60*60*24)) <= diasVencidos + diasExtra
          })
          const totalV = listaVenc.reduce((s,o) => s + (o.total||0), 0)
          const ok = totalV >= valorX
          const falt = Math.max(0, valorX - totalV)

          const listaSort = [...listaVenc].sort((a, b) => {
            if (sortField === 'fecha') {
              const fa = parseFechaActividad(a.siguienteAccionFecha) || new Date(0)
              const fb = parseFechaActividad(b.siguienteAccionFecha) || new Date(0)
              fa.setHours(0,0,0,0); fb.setHours(0,0,0,0)
              return sortDir === 'asc' ? fa - fb : fb - fa
            }
            return sortDir === 'asc' ? (a.total||0) - (b.total||0) : (b.total||0) - (a.total||0)
          })

          return (
            <>
              <div style={{ background: ok ? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${ok ? '#bbf7d0' : '#fecaca'}`, borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: ok ? '#16a34a' : '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Dinero que estás dejando en la mesa</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', color: ok ? '#16a34a' : '#dc2626' }}>{fmtM(totalV)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: ok ? '#16a34a' : '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Recuperar</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', color: ok ? '#16a34a' : '#dc2626' }}>{fmtM(valorX)}</div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: ok ? '#16a34a' : '#dc2626' }}>
                  {ok ? '✓ Estás en camino — tienes suficiente en juego' : `⚠ Te faltan ${fmtM(falt)} — necesitas prospectar más hoy`}
                </div>
              </div>

              {/* Botones de rango */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[{ extra: 0, label: `Vencidas (últimos ${diasVencidos} días)` }, { extra: diasVencidos2 - diasVencidos, label: `Vencidas (últimos ${diasVencidos2} días)` }].map(({ extra, label }) => {
                  const cnt = actividadesVencidas.filter(o => {
                    const f = parseFechaActividad(o.siguienteAccionFecha)
                    if (!f) return false
                    f.setHours(0,0,0,0)
                    const hoy2 = getNowGuayaquil(); hoy2.setHours(0,0,0,0)
                    return Math.floor((hoy2 - f) / (1000*60*60*24)) <= diasVencidos + extra
                  }).length
                  const activo = diasExtra === extra
                  return (
                    <button key={extra} onClick={() => setDiasExtra(extra)}
                      style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', border:`1.5px solid ${activo?'var(--brand)':'var(--border)'}`, background:activo?'var(--brand-light)':'var(--white)', color:activo?'var(--brand)':'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.15s' }}>
                      {activo && <Icon d={icons.alert} size={12} />}
                      {label} · {cnt}
                    </button>
                  )
                })}
              </div>

              {/* Botones sort */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[['fecha','Fecha'],['total','$']].map(([f,lbl]) => (
                  <button key={f} onClick={() => toggleSort(f)}
                    style={{ padding: '4px 12px', borderRadius: '20px', border: `1.5px solid ${sortField === f ? 'var(--brand)' : 'var(--border)'}`, background: sortField === f ? 'var(--brand-light)' : 'var(--white)', color: sortField === f ? 'var(--brand)' : 'var(--muted)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {lbl} {sortField === f ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                  </button>
                ))}
              </div>

              {/* Lista */}
              {listaSort.length === 0 ? (
                <div style={{ background: 'var(--white)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                  Sin actividades vencidas en los últimos {diasVencidos + diasExtra} días
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {listaSort.map(o => <CardActividad key={o.numOrden} order={o} urgencia={true} />)}
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(new Set())
  const [expandedOrden, setExpandedOrden] = useState(new Set())
  const [sortDash, setSortDash] = useState({})

  const getSortDash = (estado) => sortDash[estado] || { field: 'fecha', dir: 'asc' }
  const toggleSortDash = (e, estado, field) => {
    e.stopPropagation()
    setSortDash(prev => {
      const cur = prev[estado] || { field: 'fecha', dir: 'asc' }
      const dir = cur.field === field ? (cur.dir === 'asc' ? 'desc' : 'asc') : (field === 'total' ? 'desc' : 'asc')
      return { ...prev, [estado]: { field, dir } }
    })
  }

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
                      ) : (() => {
                          const { field, dir } = getSortDash(estado)
                          const parseFecha = (s) => {
                            if (!s) return new Date(0)
                            if (s instanceof Date) return s
                            if (typeof s === 'string' && s.includes('/')) {
                              const p = s.split(' ')[0].split('/')
                              if (p.length === 3) return new Date(p[2], p[1]-1, p[0])
                            }
                            if (typeof s === 'string' && s.includes('T')) return new Date(s)
                            return new Date(0)
                          }
                          const sorted = [...ordenes].sort((a, b) => {
                            if (field === 'fecha') {
                              const fa = parseFecha(a.fecha), fb = parseFecha(b.fecha)
                              return dir === 'asc' ? fa - fb : fb - fa
                            }
                            return dir === 'asc' ? (a.total||0) - (b.total||0) : (b.total||0) - (a.total||0)
                          })
                          return (
                            <>
                              {/* Botones sort */}
                              <div style={{ display: 'flex', gap: '6px', padding: '10px 20px 6px', borderBottom: '1px solid var(--cream)' }}>
                                {[['fecha','Fecha'],['total','$']].map(([f, lbl]) => {
                                  const active = field === f
                                  const arrow = dir === 'asc' ? '↑' : '↓'
                                  return (
                                    <button key={f} onClick={(e) => toggleSortDash(e, estado, f)}
                                      style={{ padding: '3px 10px', borderRadius: '20px', border: `1.5px solid ${active ? color : 'var(--border)'}`, background: active ? bg : 'var(--white)', color: active ? color : 'var(--muted)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
                                      {lbl} {active ? arrow : '↕'}
                                    </button>
                                  )
                                })}
                              </div>
                              {sorted.map((o, i) => {

                          // Días en estado actual (Negociando/Detenido/Perdido)
                          let diasEnEstado = null
                          if (estado !== 'Vendido' && o.fechaCambioEstado) {
                            const fcs = parseFecha(o.fechaCambioEstado)
                            if (fcs) {
                              const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0)
                              fcs.setHours(0,0,0,0)
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
                        })}
                            </>
                          )
                        })()}
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
function ViewClient({ client, onEdit, onBack, onViewOrder }) {
  const fields = [
    { icon: 'id',      label: 'Identificación', val: client.identificacion },
    { icon: 'phone',   label: 'Teléfono',        val: client.telefono },
    { icon: 'mail',    label: 'Email',            val: client.email },
    { icon: 'map',     label: 'Dirección',        val: client.direccion },
    { icon: 'contact', label: 'Contacto',         val: client.contacto },
    { icon: 'phone',   label: 'Tel. Contacto',    val: client.telefonoContacto },
  ]

  const [ordenes, setOrdenes] = useState([])
  const [loadingOrdenes, setLoadingOrdenes] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('Vendido')
  const [sortField, setSortField] = useState('fecha')
  const [sortDir, setSortDir] = useState('desc')

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir(field === 'total' ? 'desc' : 'asc') }
  }

  const totalPorEstado = (e) => ordenes.filter(o => o.estado === e).reduce((s, o) => s + (parseFloat(o.total)||0), 0)

  useEffect(() => {
    fetch(`${API_BASE}?action=getOrdenes`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrdenes(d.data.filter(o => norm(o.clienteNombre) === norm(client.nombre))) })
      .catch(() => {})
      .finally(() => setLoadingOrdenes(false))
  }, [])

  const cntEstado = (e) => ordenes.filter(o => o.estado === e).length

  const parseF = (v) => {
    if (!v) return new Date(0)
    const str = v.toString().trim()
    if (str.includes('/')) { const [dp] = str.split(' '); const [d,m,y] = dp.split('/'); return new Date(y,m-1,d) }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str)
    return new Date(0)
  }

  const ordenesFiltradas = useMemo(() => {
    const list = ordenes.filter(o => o.estado === filtroEstado)
    return [...list].sort((a, b) => {
      if (sortField === 'fecha') {
        const fa = parseF(a.fecha), fb = parseF(b.fecha)
        return sortDir === 'desc' ? fb - fa : fa - fb
      }
      return sortDir === 'desc' ? (parseFloat(b.total)||0) - (parseFloat(a.total)||0) : (parseFloat(a.total)||0) - (parseFloat(b.total)||0)
    })
  }, [ordenes, filtroEstado, sortDir, sortField])

  const totalFiltrado = ordenesFiltradas.reduce((s, o) => s + (parseFloat(o.total)||0), 0)
  const [listaVisible, setListaVisible] = useState(false)

  const handleCuadro = (e) => {
    if (filtroEstado === e) setListaVisible(v => !v)
    else { setFiltroEstado(e); setListaVisible(true) }
  }

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
              ) : label === 'Teléfono' || label === 'Tel. Contacto' ? (
                <a href={`https://wa.me/593${val.toString().replace(/\D/g,'').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  <Icon d={icons.phone} size={13} />{val}
                </a>
              ) : label === 'Email' ? (
                <a href={`mailto:${val}`}
                  style={{ fontSize: '14px', fontWeight: '600', color: 'var(--brand)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                  <Icon d={icons.mail} size={13} />{val}
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
        <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon d={icons.note} size={13} />Notas
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.6', fontStyle: 'italic' }}>"{client.notas}"</div>
        </div>
      )}

      {/* Órdenes del cliente */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '16px' }}>Órdenes</div>
          <div style={{ display: 'flex', gap: '6px', opacity: listaVisible ? 1 : 0.4, pointerEvents: listaVisible ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
            {[['fecha','Fecha'],['total','$']].map(([field, label]) => {
              const active = sortField === field
              const arrow = sortDir === 'asc' ? '↑' : '↓'
              return (
                <button key={field} onClick={() => toggleSort(field)}
                  style={{ padding: '4px 11px', borderRadius: '20px', border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`, background: active ? 'var(--brand-light)' : 'var(--white)', color: active ? 'var(--brand)' : 'var(--muted)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {label} {active ? arrow : '↕'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtros de estado — solo los recuadros con totales */}

        {loadingOrdenes ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)', fontSize: '13px' }}>
            <span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Cargando órdenes...
          </div>
        ) : (
          <>
            {/* Totales por estado */}
            {!loadingOrdenes && ordenes.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '14px' }}>
                {['Vendido','Negociando','Detenido','Perdido'].map(e => {
                  const c = ESTADO_COLORS[e]
                  const activo = filtroEstado === e
                  return (
                    <div key={e} onClick={() => handleCuadro(e)} style={{ background: activo && listaVisible ? c.bg : activo ? c.bg : 'var(--cream)', border: `1.5px solid ${activo ? c.border : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '8px 10px', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: activo ? c.color : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{e}</div>
                        {activo && <span style={{ fontSize: '10px', color: c.color, transition: 'transform 0.2s', display: 'inline-block', transform: listaVisible ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '13px', color: activo ? c.color : 'var(--ink)' }}>{fmtMoney(totalPorEstado(e))}</div>
                      <div style={{ fontSize: '10px', color: activo ? c.color : 'var(--muted)', marginTop: '1px' }}>{cntEstado(e)} {cntEstado(e) === 1 ? 'orden' : 'órdenes'}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {listaVisible && (ordenesFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', background: 'var(--white)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--muted)' }}>
                <div style={{ fontSize: '11px', fontWeight: '600' }}>Sin órdenes en estado {filtroEstado}</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ordenesFiltradas.map((o, i) => {
                    const c = ESTADO_COLORS[o.estado]
                    return (
                      <div key={o.numOrden}
                        onClick={() => onViewOrder(o)}
                        style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', cursor: 'pointer', transition: 'box-shadow 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', animation: `fadeUp 0.2s ${Math.min(i,5)*0.04}s ease both` }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', marginBottom: '2px' }}>{o.numOrden} · {formatFecha(o.fecha)}</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {(o.items||[]).slice(0,2).map((item, j) => (
                              <span key={j} style={{ fontSize: '12px', color: 'var(--ink)', background: 'var(--cream)', padding: '1px 7px', borderRadius: '20px' }}>{item.nombre}</span>
                            ))}
                            {(o.items||[]).length > 2 && <span style={{ fontSize: '12px', color: 'var(--muted)' }}>+{o.items.length - 2} más</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '15px' }}>{fmtMoney(o.total)}</div>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 6px', borderRadius: '20px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{o.estado}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: '10px', padding: '10px 14px', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
                  <span style={{ color: 'var(--muted)' }}>{ordenesFiltradas.length} {ordenesFiltradas.length === 1 ? 'orden' : 'órdenes'}</span>
                  <span>{fmtMoney(totalFiltrado)}</span>
                </div>
              </>
            ))}
          </>
        )}
      </div>
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
  'Negociando': { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Detenido':   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
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
    <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: `fadeUp 0.2s ${Math.min(index,5)*0.04}s ease both`, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
      onClick={() => onView(order)}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>{order.numOrden}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.clienteNombre}</div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '3px' }}>{order.clienteNegocio || '—'} · {formatFecha(order.fecha)}</div>
        {order.clienteTelefono && (
          <a href={`https://wa.me/593${order.clienteTelefono.replace(/\D/g,'').replace(/^0/,'')}`} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: '#16a34a', textDecoration: 'none', marginRight: '10px' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
            <Icon d={icons.phone} size={12} />{order.clienteTelefono}
          </a>
        )}
        {order.clienteEmail && (
          <a href={`mailto:${order.clienteEmail}`}
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: 'var(--brand)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
            <Icon d={icons.mail} size={12} />{order.clienteEmail}
          </a>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
        <EstadoBadge estado={order.estado} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '16px' }}>{fmtMoney(order.total)}</div>
      </div>
    </div>
  )
}

function ViewOrder({ order, onBack, onChangeEstado, showToast, backLabel = 'Volver a órdenes' }) {
  const [estado, setEstado] = useState(order.estado)
  const [saving, setSaving] = useState(false)
  const [notas, setNotas] = useState(order.notas || '')
  const [siguienteAccionFecha, setSiguienteAccionFecha] = useState(order.siguienteAccionFecha || '')
  const [horaAccion, setHoraAccion] = useState(() => {
    // Extraer hora si viene en formato "dd/MM/yyyy HH:mm"
    const v = order.siguienteAccionFecha || ''
    if (v.includes(' ')) return v.split(' ')[1] || ''
    return ''
  })
  const [accion, setAccion] = useState(order.accion || '')
  const [notasSeguimiento, setNotasSeguimiento] = useState(order.notasSeguimiento || '')
  const [acciones, setAcciones] = useState([])
  const [savingDetalle, setSavingDetalle] = useState(false)
  const [editNotas, setEditNotas] = useState(false)
  const [editSeguimiento, setEditSeguimiento] = useState(false)
  const [facturacion, setFacturacion] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}?action=getFacturacion`)
      .then(r => r.json())
      .then(d => { if (d.success) setFacturacion(d.data) })
      .catch(() => {})
    fetch(`${API_BASE}?action=getAcciones`)
      .then(r => r.json())
      .then(d => { if (d.success) setAcciones(d.data) })
      .catch(() => {})
  }, [])

  const [ordenesCliente, setOrdenesCliente] = useState([])
  const [filtroOC, setFiltroOC]     = useState('Vendido')
  const [listaOC, setListaOC]       = useState(false)
  const [sortFieldOC, setSortFieldOC] = useState('fecha')
  const [sortDirOC, setSortDirOC]   = useState('desc')
  useEffect(() => {
    fetch(`${API_BASE}?action=getOrdenes`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrdenesCliente(d.data.filter(o => norm(o.clienteNombre) === norm(order.clienteNombre))) })
      .catch(() => {})
  }, [])

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

  const handleSaveDetalle = async () => {
    setSavingDetalle(true)
    try {
      const soloFecha = siguienteAccionFecha ? siguienteAccionFecha.split(' ')[0] : ''
      const fechaHora = soloFecha ? (horaAccion ? soloFecha + ' ' + horaAccion : soloFecha) : ''
      const params = new URLSearchParams({ action: 'updateOrdenDetalle', rowIndex: order.rowIndex, notas, siguienteAccionFecha: fechaHora, accion, notasSeguimiento })
      const res = await fetch(`${API_BASE}?${params}`)
      const data = await res.json()
      if (data.success) {
        setSiguienteAccionFecha(fechaHora) // sincronizar estado local con lo guardado
        showToast('✓ Guardado')
      } else showToast(data.error || 'Error al guardar', 'error')
    } catch { showToast('Error de conexión', 'error') }
    finally { setSavingDetalle(false) }
  }

  // Convertir fecha almacenada (dd/MM/yyyy) a yyyy-MM-dd para input date
  const fechaParaInput = (v) => {
    if (!v) return ''
    const solo = v.toString().trim().split(' ')[0] // quitar hora si viene "dd/MM/yyyy HH:mm"
    if (/^\d{4}-\d{2}-\d{2}$/.test(solo)) return solo
    if (solo.includes('/')) {
      const p = solo.split('/')
      if (p.length === 3) return `${p[2].padStart(4,'0')}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`
    }
    return ''
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '24px' }}>
        <Icon d={icons.arrowLeft} size={15} /> {backLabel}
      </button>
      {/* Encabezado + estado */}
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
      {/* Productos */}
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

      {/* Enviar para facturar — solo Vendido */}
      {facturacion && estado === 'Vendido' && (() => {
        const lineasProductos = (order.items||[]).map(item =>
          `• ${item.nombre} x${item.cantidad}  ${fmtMoney(item.total)}`
        ).join('\n')

        const mensaje =
`Cliente: ${order.clienteNombre}
Identificación: ${order.clienteIdentificacion || '—'}
Teléfono: ${order.clienteTelefono || '—'}
Dirección: ${order.clienteDireccion || '—'}

--- Orden ${order.numOrden} ---
${lineasProductos}

Subtotal sin IVA:  ${fmtMoney(order.totalSinIva)}
IVA:               ${fmtMoney(order.totalIva)}
Total:             ${fmtMoney(order.total)}`

        const waLink    = `https://wa.me/${facturacion.celular}?text=${encodeURIComponent(mensaje)}`
        const emailLink = `mailto:${facturacion.email}?subject=${encodeURIComponent(`Orden ${order.numOrden} — ${order.clienteNombre}`)}&body=${encodeURIComponent(mensaje)}`

        return (
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon d={icons.mail} size={13} /> Enviar datos de la orden para facturar
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <a href={waLink} target="_blank" rel="noopener noreferrer"
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'11px 16px', background:'#22c55e', color:'white', borderRadius:'var(--radius)', fontSize:'13px', fontWeight:'700', textDecoration:'none', boxShadow:'var(--shadow)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='#16a34a'}
                onMouseLeave={e => e.currentTarget.style.background='#22c55e'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enviar por WhatsApp
              </a>
              <a href={emailLink}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'11px 16px', background:'var(--brand)', color:'white', borderRadius:'var(--radius)', fontSize:'13px', fontWeight:'700', textDecoration:'none', boxShadow:'var(--shadow)', transition:'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--brand-dark)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--brand)'}>
                <Icon d={icons.mail} size={16} />
                Enviar por Email
              </a>
            </div>
          </div>
        )
      })()}

      {/* Notas */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.note} size={13} />Notas de la orden</div>
          <button onClick={() => setEditNotas(v => !v)} style={{ background: 'none', border: `1.5px solid ${editNotas ? 'var(--brand)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '4px 10px', fontSize: '11px', fontWeight: '700', color: editNotas ? 'var(--brand)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
            {editNotas ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editNotas
          ? <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas de la orden..." autoFocus
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
          : notas
            ? <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--muted)', lineHeight: '1.6' }}>"{notas}"</div>
            : <div style={{ fontSize: '13px', color: 'var(--border)' }}>Sin notas</div>
        }
      </div>
      {/* Seguimiento */}
      <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '16px', boxShadow: 'var(--shadow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}><Icon d={icons.calendar} size={13} />Seguimiento</div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {siguienteAccionFecha && !editSeguimiento && (() => {
              // Armar fechas para Google Calendar (formato YYYYMMDDTHHmmss)
              const soloFecha = siguienteAccionFecha.toString().trim().split(' ')[0]
              let dateStr = ''
              if (soloFecha.includes('/')) {
                const [d, m, y] = soloFecha.split('/')
                dateStr = `${y}${m.padStart(2,'0')}${d.padStart(2,'0')}`
              } else if (soloFecha.includes('-')) {
                dateStr = soloFecha.replace(/-/g, '')
              }
              const [hh, mm] = horaAccion ? horaAccion.split(':') : ['09', '00']
              const startDT = `${dateStr}T${hh.padStart(2,'0')}${mm.padStart(2,'0')}00`
              // Evento de 1 hora por defecto
              const endHH = String(parseInt(hh) + 1).padStart(2, '0')
              const endDT = `${dateStr}T${endHH}${mm.padStart(2,'0')}00`
              const titulo = encodeURIComponent(`${accion} — ${order.clienteNombre}`)
              const detalle = encodeURIComponent(`Orden: ${order.numOrden}\nCliente: ${order.clienteNombre}${order.clienteNegocio ? '\nNegocio: ' + order.clienteNegocio : ''}${notasSeguimiento ? '\n\n' + notasSeguimiento : ''}`)
              const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${startDT}/${endDT}&details=${detalle}`
              return (
                <a href={calUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: '#4285f4', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '11px', fontWeight: '700', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1a73e8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#4285f4'}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                  Agendar
                </a>
              )
            })()}
            <button onClick={() => setEditSeguimiento(v => !v)} style={{ background: 'none', border: `1.5px solid ${editSeguimiento ? 'var(--brand)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '4px 10px', fontSize: '11px', fontWeight: '700', color: editSeguimiento ? 'var(--brand)' : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {editSeguimiento ? 'Cancelar' : 'Editar'}
            </button>
          </div>
        </div>
        {editSeguimiento ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Siguiente acción (fecha)</div>
                <input type="date" value={fechaParaInput(siguienteAccionFecha)}
                  onChange={e => {
                    const iso = e.target.value
                    if (!iso) { setSiguienteAccionFecha(''); return }
                    const [y, m, d] = iso.split('-')
                    setSiguienteAccionFecha(`${d}/${m}/${y}`)
                  }}
                  style={{ ...inputStyle, fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Hora</div>
                <input type="time" value={horaAccion} onChange={e => setHoraAccion(e.target.value)} style={{ ...inputStyle, fontSize: '14px' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Acción a realizar</div>
                <select value={accion} onChange={e => setAccion(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', fontSize: '14px' }}>
                  <option value="">— Seleccionar —</option>
                  {acciones.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Notas de seguimiento</div>
              <textarea value={notasSeguimiento} onChange={e => setNotasSeguimiento(e.target.value)} placeholder="Detalles del seguimiento, acuerdos, próximos pasos..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5', fontSize: '14px', width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Siguiente acción (fecha)</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: siguienteAccionFecha ? 'var(--ink)' : 'var(--border)' }}>
                  {siguienteAccionFecha ? formatFecha(siguienteAccionFecha) : '—'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Hora</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: horaAccion ? 'var(--ink)' : 'var(--border)' }}>{horaAccion || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Acción a realizar</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: accion ? 'var(--ink)' : 'var(--border)' }}>{accion || '—'}</div>
              </div>
            </div>
            {notasSeguimiento && (
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Notas de seguimiento</div>
                <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.6', fontStyle: 'italic' }}>"{notasSeguimiento}"</div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Botón guardar — solo visible si hay algo en modo edición */}
      {(editNotas || editSeguimiento) && (
        <button onClick={async () => { await handleSaveDetalle(); setEditNotas(false); setEditSeguimiento(false) }} disabled={savingDetalle}
          style={{ width: '100%', padding: '13px', background: savingDetalle ? 'var(--muted)' : 'var(--brand)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700', cursor: savingDetalle ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
          onMouseEnter={e => { if (!savingDetalle) e.currentTarget.style.background = 'var(--brand-dark)' }}
          onMouseLeave={e => { if (!savingDetalle) e.currentTarget.style.background = 'var(--brand)' }}>
          {savingDetalle ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando...</> : <><Icon d={icons.check} size={16} /> Guardar cambios</>}
        </button>
      )}


      {ordenesCliente.length > 0 && (() => {
        const handleCuadroOC = (e) => {
          if (filtroOC === e) setListaOC(v => !v)
          else { setFiltroOC(e); setListaOC(true) }
        }
        const toggleSortOC = (field) => {
          if (sortFieldOC === field) setSortDirOC(d => d === 'asc' ? 'desc' : 'asc')
          else { setSortFieldOC(field); setSortDirOC(field === 'total' ? 'desc' : 'asc') }
        }
        const parseF = (v) => {
          if (!v) return new Date(0)
          const str = v.toString().trim()
          if (str.includes('/')) { const [dp] = str.split(' '); const [d,m,y] = dp.split('/'); return new Date(y,m-1,d) }
          if (/^\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str)
          return new Date(0)
        }
        const listaFiltrada = [...ordenesCliente.filter(o => o.estado === filtroOC)].sort((a,b) => {
          if (sortFieldOC === 'fecha') { const fa=parseF(a.fecha),fb=parseF(b.fecha); return sortDirOC==='desc'?fb-fa:fa-fb }
          return sortDirOC==='desc'?(parseFloat(b.total)||0)-(parseFloat(a.total)||0):(parseFloat(a.total)||0)-(parseFloat(b.total)||0)
        })
        const totalFiltradoOC = listaFiltrada.reduce((s,o) => s+(parseFloat(o.total)||0), 0)
        const cntOC  = (e) => ordenesCliente.filter(o => o.estado === e).length
        const totalOC = (e) => ordenesCliente.filter(o => o.estado === e).reduce((s,o) => s+(parseFloat(o.total)||0), 0)

        return (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'16px' }}>Órdenes de {order.clienteNombre}</div>
              <div style={{ display:'flex', gap:'6px', opacity: listaOC ? 1 : 0.4, pointerEvents: listaOC ? 'auto' : 'none', transition:'opacity 0.2s' }}>
                {[['fecha','Fecha'],['total','$']].map(([field, label]) => {
                  const active = sortFieldOC === field
                  const arrow = sortDirOC === 'asc' ? '↑' : '↓'
                  return (
                    <button key={field} onClick={() => toggleSortOC(field)}
                      style={{ padding:'4px 11px', borderRadius:'20px', border:`1.5px solid ${active?'var(--brand)':'var(--border)'}`, background:active?'var(--brand-light)':'var(--white)', color:active?'var(--brand)':'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.15s' }}>
                      {label} {active ? arrow : '↕'}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'14px' }}>
              {['Vendido','Negociando','Detenido','Perdido'].map(e => {
                const c = ESTADO_COLORS[e]
                const activo = filtroOC === e
                return (
                  <div key={e} onClick={() => handleCuadroOC(e)}
                    style={{ background: activo ? c.bg : 'var(--cream)', border:`1.5px solid ${activo ? c.border : 'var(--border)'}`, borderRadius:'var(--radius)', padding:'8px 10px', cursor:'pointer', transition:'all 0.15s' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2px' }}>
                      <div style={{ fontSize:'10px', fontWeight:'700', color:activo?c.color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{e}</div>
                      {activo && <span style={{ fontSize:'10px', color:c.color, display:'inline-block', transform: listaOC ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s' }}>▼</span>}
                    </div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'13px', color:activo?c.color:'var(--ink)' }}>{fmtMoney(totalOC(e))}</div>
                    <div style={{ fontSize:'10px', color:activo?c.color:'var(--muted)', marginTop:'1px' }}>{cntOC(e)} {cntOC(e)===1?'orden':'órdenes'}</div>
                  </div>
                )
              })}
            </div>

            {listaOC && (listaFiltrada.length === 0 ? (
              <div style={{ textAlign:'center', padding:'20px', background:'var(--white)', border:'1.5px dashed var(--border)', borderRadius:'var(--radius-lg)', color:'var(--muted)', fontSize:'12px', fontWeight:'600' }}>
                Sin órdenes en estado {filtroOC}
              </div>
            ) : (
              <>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {listaFiltrada.map((o, i) => {
                    const c = ESTADO_COLORS[o.estado]
                    const esActual = o.numOrden === order.numOrden
                    return (
                      <div key={o.numOrden}
                        style={{ background: esActual ? 'var(--brand-light)' : 'var(--white)', border: `1.5px solid ${esActual ? 'var(--brand)' : 'var(--border)'}`, borderRadius: 'var(--radius-lg)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', animation: `fadeUp 0.2s ${Math.min(i,5)*0.04}s ease both`, opacity: esActual ? 0.8 : 1 }}>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontSize:'11px', color:'var(--muted)', fontWeight:'600', marginBottom:'2px', display:'flex', alignItems:'center', gap:'6px' }}>
                            {o.numOrden} · {formatFecha(o.fecha)}
                            {esActual && <span style={{ fontSize:'10px', fontWeight:'700', color:'var(--brand)', background:'var(--brand-light)', padding:'1px 6px', borderRadius:'20px', border:'1px solid var(--brand)' }}>actual</span>}
                          </div>
                          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'4px' }}>
                            {(o.items||[]).slice(0,2).map((item,j) => (
                              <span key={j} style={{ fontSize:'12px', color:'var(--ink)', background:'var(--cream)', padding:'1px 7px', borderRadius:'20px' }}>{item.nombre}</span>
                            ))}
                            {(o.items||[]).length > 2 && <span style={{ fontSize:'12px', color:'var(--muted)' }}>+{o.items.length-2} más</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'15px' }}>{fmtMoney(o.total)}</div>
                          <span style={{ fontSize:'10px', fontWeight:'700', padding:'1px 6px', borderRadius:'20px', background:c.bg, color:c.color, border:`1px solid ${c.border}` }}>{o.estado}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop:'10px', padding:'10px 14px', background:'var(--cream)', borderRadius:'var(--radius)', display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'700' }}>
                  <span style={{ color:'var(--muted)' }}>{listaFiltrada.length} {listaFiltrada.length===1?'orden':'órdenes'}</span>
                  <span>{fmtMoney(totalFiltradoOC)}</span>
                </div>
              </>
            ))}
          </div>
        )
      })()}

    </div>
  )
}
const ACCION_PHONE_EMAIL = ['Mensaje','Solicitar Referidos','Enviar Propuesta','Seguimiento','Resolver Objeción','Cerrar Venta','Post Venta','Venta Cruzada','Venta Ascendente']

function ActividadesView({ onViewOrder }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [sortField, setSortField] = useState('fecha')
  const [sortDir, setSortDir] = useState('asc')
  const [filtroAccion, setFiltroAccion] = useState('')
  const [accionesDisp, setAccionesDisp] = useState([])
  const [accionDropOpen, setAccionDropOpen] = useState(false)
  // 'pendientes' | 'vencidas' | 'sinFecha' | 'historial'
  const [modo, setModo] = useState('pendientes')
  const [historialOpen, setHistorialOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [modoHistorial, setModoHistorial] = useState(false)
  const [dashData, setDashData] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}?action=getOrdenes`)
      .then(r => r.json()).then(d => { if (d.success) setOrders(d.data) }).catch(() => {}).finally(() => setLoading(false))
    fetch(`${API_BASE}?action=getAcciones`)
      .then(r => r.json()).then(d => { if (d.success) setAccionesDisp(d.data) }).catch(() => {})
    fetch(`${API_BASE}?action=dashboard`)
      .then(r => r.json()).then(d => { if (d.success) setDashData(d.data) }).catch(() => {})
  }, [])

  const parseFechaSeg = (v) => {
    if (!v) return null
    const str = v.toString().trim()
    if (str.includes('/')) {
      const [dp, tp] = str.split(' ')
      const [d, m, y] = dp.split('/')
      if (tp) { const [hh, mm] = tp.split(':'); return new Date(y, m-1, d, hh, mm) }
      return new Date(y, m-1, d)
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) return new Date(str)
    return null
  }

  const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0)
  const ayer = new Date(hoy); ayer.setDate(ayer.getDate() - 1); ayer.setHours(23,59,59,999)
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const finMes    = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59)
  const ESTADOS   = ['Negociando', 'Detenido', 'Perdido']
  const mesNombre = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][hoy.getMonth()]

  const conFecha = useMemo(() =>
    orders.filter(o => ESTADOS.includes(o.estado) && o.siguienteAccionFecha)
      .map(o => ({ ...o, _fecha: parseFechaSeg(o.siguienteAccionFecha) }))
      .filter(o => o._fecha !== null)
  , [orders])

  const sinFechaList = useMemo(() =>
    orders.filter(o => ESTADOS.includes(o.estado) && !o.siguienteAccionFecha)
  , [orders])

  // Conteos para badges
  const cntPendientes = useMemo(() => conFecha.filter(o => o._fecha >= hoy && o._fecha <= finMes).length, [conFecha])
  const cntVencidas   = useMemo(() => conFecha.filter(o => o._fecha >= inicioMes && o._fecha <= ayer).length, [conFecha])
  const cntSinFecha   = sinFechaList.length

  const getDiffLabel = (fecha) => {
    const d = new Date(fecha); d.setHours(0,0,0,0)
    const diff = Math.round((d - hoy) / 86400000)
    if (diff < 0)  return { label:`Hace ${Math.abs(diff)} día${Math.abs(diff)!==1?'s':''}`, color:'#dc2626', bg:'#fef2f2' }
    if (diff === 0) return { label:'Hoy',    color:'#d97706', bg:'#fffbeb' }
    if (diff === 1) return { label:'Mañana', color:'#2563eb', bg:'#eff6ff' }
    return { label:`En ${diff} días`, color:'var(--muted)', bg:'var(--cream)' }
  }

  const actividades = useMemo(() => {
    let list = []
    if (modo === 'sinFecha') {
      list = sinFechaList
    } else if (modo === 'pendientes') {
      list = conFecha.filter(o => o._fecha >= hoy && o._fecha <= finMes)
    } else if (modo === 'vencidas') {
      list = conFecha.filter(o => o._fecha >= inicioMes && o._fecha <= ayer)
    } else if (modo === 'historial' && modoHistorial && fechaInicio && fechaFin) {
      const [iy,im,id] = fechaInicio.split('-').map(Number)
      const [fy,fm,fd] = fechaFin.split('-').map(Number)
      const desde = new Date(iy, im-1, id, 0, 0, 0)
      const hasta = new Date(fy, fm-1, fd, 23, 59, 59)
      list = conFecha.filter(o => o._fecha >= desde && o._fecha <= hasta)
    }

    if (filtroAccion) list = list.filter(o => norm(o.accion) === norm(filtroAccion))

    if (busqueda.trim()) {
      const q = norm(busqueda)
      list = list.filter(o => norm(o.clienteNombre).includes(q) || norm(o.clienteNegocio||'').includes(q) || norm(o.numOrden).includes(q) || norm(o.accion||'').includes(q))
    }

    list = [...list].sort((a, b) => {
      if (sortField === 'fecha') {
        const fa = a._fecha || new Date(0), fb = b._fecha || new Date(0)
        return sortDir === 'asc' ? fa - fb : fb - fa
      }
      return sortDir === 'asc' ? (a.total||0) - (b.total||0) : (b.total||0) - (a.total||0)
    })
    return list
  }, [conFecha, sinFechaList, modo, modoHistorial, fechaInicio, fechaFin, filtroAccion, busqueda, sortField, sortDir])

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir(field === 'total' ? 'desc' : 'asc') }
  }

  const aplicarHistorial = () => {
    if (fechaInicio && fechaFin) { setModoHistorial(true); setModo('historial'); setHistorialOpen(false) }
  }
  const limpiarHistorial = () => { setModoHistorial(false); setFechaInicio(''); setFechaFin(''); setHistorialOpen(false); setModo('pendientes') }

  const SortBtn = ({ field, label }) => {
    const active = sortField === field
    const arrow = sortDir === 'asc' ? '↑' : '↓'
    return (
      <button onClick={() => toggleSort(field)}
        style={{ padding:'5px 11px', borderRadius:'20px', border:`1.5px solid ${active?'var(--brand)':'var(--border)'}`, background:active?'var(--brand-light)':'var(--white)', color:active?'var(--brand)':'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.15s' }}>
        {label} {active ? arrow : '↕'}
      </button>
    )
  }

  const ModoBtn = ({ key_, label, count, color }) => {
    const active = modo === key_
    return (
      <button onClick={() => { setModo(key_); if (key_ !== 'historial') setModoHistorial(false) }}
        style={{ padding:'5px 12px', borderRadius:'20px', border:`1.5px solid ${active?(color||'var(--brand)'):'var(--border)'}`, background:active?(color?color+'18':'var(--brand-light)'):'var(--white)', color:active?(color||'var(--brand)'):'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.15s', whiteSpace:'nowrap' }}>
        {count !== undefined ? `${count} ${label}` : label}
      </button>
    )
  }

  if (loading) return (
    <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--muted)' }}>
      <div style={{ fontSize:'28px', marginBottom:'12px', animation:'pulse 1s infinite' }}>⏳</div>Cargando actividades...
    </div>
  )

  return (
    <div style={{ animation:'fadeUp 0.4s ease' }} onClick={() => { if (accionDropOpen) setAccionDropOpen(false); if (historialOpen) setHistorialOpen(false) }}>

      {/* Encabezado */}
      <div style={{ marginBottom:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'28px', letterSpacing:'-0.02em', margin:0 }}>Actividades</h1>
            <div style={{ fontSize:'13px', color:'var(--muted)', fontWeight:'500', marginTop:'4px', display:'flex', alignItems:'center', gap:'6px' }}>
              <Icon d={icons.calendar} size={13} />{getTodayLabel()}
            </div>
          </div>
          {/* Dropdown filtro acción */}
          <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setAccionDropOpen(v => !v); setHistorialOpen(false) }}
              style={{ padding:'7px 13px', borderRadius:'var(--radius)', border:`1.5px solid ${filtroAccion?'var(--brand)':'var(--border)'}`, background:filtroAccion?'var(--brand-light)':'var(--white)', color:filtroAccion?'var(--brand)':'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s' }}>
              {filtroAccion || 'Acciones'} <Icon d={icons.chevron} size={12} />
            </button>
            {accionDropOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, zIndex:200, background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-lg)', minWidth:'190px', overflow:'hidden', animation:'fadeUp 0.15s ease' }}>
                {filtroAccion && (
                  <button onClick={() => { setFiltroAccion(''); setAccionDropOpen(false) }}
                    style={{ width:'100%', padding:'10px 14px', background:'var(--cream)', border:'none', borderBottom:'1px solid var(--border)', color:'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', textAlign:'left' }}>
                    ✕ Limpiar filtro
                  </button>
                )}
                {accionesDisp.map(a => (
                  <button key={a} onClick={() => { setFiltroAccion(a); setAccionDropOpen(false) }}
                    style={{ width:'100%', padding:'10px 14px', background:filtroAccion===a?'var(--brand-light)':'transparent', border:'none', borderBottom:'1px solid var(--cream)', color:filtroAccion===a?'var(--brand)':'var(--ink)', fontSize:'13px', fontWeight:filtroAccion===a?'700':'500', cursor:'pointer', textAlign:'left', transition:'background 0.1s' }}
                    onMouseEnter={e => { if (filtroAccion!==a) e.currentTarget.style.background='var(--cream)' }}
                    onMouseLeave={e => { if (filtroAccion!==a) e.currentTarget.style.background='transparent' }}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Meta y Avance del mes */}
      {dashData && (() => {
        const now2    = getNowGuayaquil()
        const mesLbl2 = MESES_LARGO[now2.getMonth()].charAt(0).toUpperCase() + MESES_LARGO[now2.getMonth()].slice(1)
        const anio2   = now2.getFullYear()
        const meta2    = dashData.meta    || 0
        const vendido2 = dashData.vendido || 0
        const pct2     = meta2 > 0 ? Math.round((vendido2 / meta2) * 100) : 0
        const verde2   = '#16a34a'
        const cv       = dashData.conteos || {}
        return (
          <>
            <div style={{ background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 18px', marginBottom:'10px', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon d={icons.target} size={15} stroke="#6366f1" />
                </div>
                <div style={{ fontSize:'12px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Meta {mesLbl2} {anio2}</div>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'18px', color:'#6366f1' }}>{fmtMoney(meta2)}</div>
            </div>
            <div style={{ background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 18px', marginBottom:'10px', boxShadow:'var(--shadow)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <span style={{ fontSize:'12px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Avance del mes</span>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'16px', color: pct2 >= 100 ? verde2 : 'var(--ink)' }}>{pct2}%</span>
              </div>
              <div style={{ background:'var(--cream)', borderRadius:'100px', height:'8px', overflow:'hidden', marginBottom:'6px' }}>
                <div style={{ height:'100%', width:`${Math.min(100,pct2)}%`, background: pct2>=100 ? verde2 : pct2>=60 ? '#2563eb' : 'var(--brand)', borderRadius:'100px', transition:'width 0.8s ease' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'12px', color:'var(--muted)' }}>
                <span style={{ fontWeight:'600', color:verde2 }}>{fmtMoney(vendido2)} vendido</span>
                <span>·</span>
                <span>{cv.Vendido?.clientes||0} {(cv.Vendido?.clientes||0)===1?'cliente':'clientes'}</span>
                <span>·</span>
                <span>{cv.Vendido?.ordenes||0} {(cv.Vendido?.ordenes||0)===1?'orden':'órdenes'}</span>
              </div>
            </div>
          </>
        )
      })()}

      {/* Botones de modo */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'14px', flexWrap:'wrap', alignItems:'center' }}>
        <ModoBtn key_="pendientes" label="actividades" count={cntPendientes} />
        <ModoBtn key_="vencidas" label={`vencidas en ${mesNombre}`} count={cntVencidas} color="#dc2626" />
        <ModoBtn key_="sinFecha" label="sin fecha" count={cntSinFecha} color="#d97706" />
        {/* Historial */}
        <div style={{ position:'relative' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { setHistorialOpen(v => !v); setAccionDropOpen(false) }}
            style={{ padding:'5px 12px', borderRadius:'20px', border:`1.5px solid ${modo==='historial'?'var(--brand)':'var(--border)'}`, background:modo==='historial'?'var(--brand-light)':'var(--white)', color:modo==='historial'?'var(--brand)':'var(--muted)', fontSize:'12px', fontWeight:'700', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s', whiteSpace:'nowrap' }}>
            <Icon d={icons.clock} size={12} /> {modo==='historial' && modoHistorial ? `${formatFecha(fechaInicio,'').slice(0,6)}–${formatFecha(fechaFin,'').slice(0,6)}` : 'Historial'}
          </button>
          {historialOpen && (
            <div style={{ position:'absolute', left:0, top:'calc(100% + 6px)', zIndex:200, background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px', boxShadow:'var(--shadow-lg)', minWidth:'240px', animation:'fadeUp 0.15s ease' }}>
              <div style={{ fontSize:'11px', fontWeight:'700', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>Rango de fechas</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'10px' }}>
                <div>
                  <label style={{ fontSize:'11px', color:'var(--muted)', fontWeight:'600' }}>Desde</label>
                  <DatePicker value={fechaInicio} onChange={setFechaInicio} placeholder="Desde..." />
                </div>
                <div>
                  <label style={{ fontSize:'11px', color:'var(--muted)', fontWeight:'600' }}>Hasta</label>
                  <DatePicker value={fechaFin} onChange={setFechaFin} placeholder="Hasta..." />
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={limpiarHistorial} style={{ flex:1, padding:'8px', background:'var(--cream)', color:'var(--muted)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', fontSize:'12px', fontWeight:'700', cursor:'pointer' }}>Limpiar</button>
                <button onClick={aplicarHistorial} disabled={!fechaInicio||!fechaFin} style={{ flex:2, padding:'8px', background:!fechaInicio||!fechaFin?'var(--muted)':'var(--brand)', color:'white', border:'none', borderRadius:'var(--radius)', fontSize:'12px', fontWeight:'700', cursor:!fechaInicio||!fechaFin?'not-allowed':'pointer' }}>Aplicar</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {filtroAccion && (
        <div style={{ fontSize:'12px', color:'var(--brand)', fontWeight:'600', marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px' }}>
          Filtro: {filtroAccion}
          <button onClick={() => setFiltroAccion('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:'0 2px', fontSize:'11px', fontWeight:'700' }}>✕</button>
        </div>
      )}

      {/* Búsqueda */}
      <div style={{ position:'relative', marginBottom:'12px' }}>
        <span style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--muted)', pointerEvents:'none' }}><Icon d={icons.search} size={16} /></span>
        <input type="text" placeholder="Buscar por cliente, negocio, # orden o acción..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ ...inputStyle, paddingLeft:'42px', paddingRight:busqueda?'42px':'14px', fontSize:'14px' }} />
        {busqueda && <button onClick={() => setBusqueda('')} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--muted)', display:'flex', padding:'2px' }}><Icon d={icons.x} size={16} /></button>}
      </div>

      {/* Tarjeta de totales */}
      {actividades.length > 0 && (() => {
        const totalMonto = actividades.reduce((s, o) => s + (parseFloat(o.total)||0), 0)
        const modoLabel  = modo === 'pendientes' ? 'Pendientes este mes'
          : modo === 'vencidas' ? `Vencidas en ${mesNombre}`
          : modo === 'sinFecha' ? 'Sin fecha de seguimiento'
          : modoHistorial && fechaInicio && fechaFin ? `${formatFecha(fechaInicio)} — ${formatFecha(fechaFin)}`
          : 'Historial'
        const cardTheme = modo === 'vencidas'
          ? { bg:'#fef2f2', border:'#fecaca',  color:'#dc2626' }
          : modo === 'sinFecha'
          ? { bg:'#fffbeb', border:'#fde68a',  color:'#d97706' }
          : modo === 'historial'
          ? { bg:'var(--brand-light)', border:'var(--brand)', color:'var(--brand)' }
          : { bg:'#f0fdf4', border:'#bbf7d0',  color:'#16a34a' }
        return (
          <div style={{ background:cardTheme.bg, border:`1.5px solid ${cardTheme.border}`, borderRadius:'var(--radius-lg)', padding:'14px 18px', marginBottom:'14px', boxShadow:'var(--shadow)', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
            <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:'10px', fontWeight:'700', color:cardTheme.color, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'2px' }}>{modoLabel}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'20px', color:'var(--ink)' }}>{actividades.length} <span style={{ fontSize:'13px', fontWeight:'600', color:cardTheme.color }}>{actividades.length === 1 ? 'actividad' : 'actividades'}</span></div>
              </div>
              <div style={{ borderLeft:`1.5px solid ${cardTheme.border}`, paddingLeft:'20px' }}>
                <div style={{ fontSize:'10px', fontWeight:'700', color:cardTheme.color, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'2px' }}>Total en órdenes</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'20px', color:'var(--ink)' }}>{fmtMoney(totalMonto)}</div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Controles de orden */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
        <SortBtn field="fecha" label="Fecha" />
        <SortBtn field="total" label="$" />
      </div>

      {/* Lista */}
      {actividades.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--white)', border:'1.5px dashed var(--border)', borderRadius:'var(--radius-lg)', color:'var(--muted)' }}>
          <div style={{ fontSize:'36px', marginBottom:'12px' }}>
            {modo==='sinFecha' ? '📋' : modo==='historial' ? '📚' : modo==='vencidas' ? '✅' : '📭'}
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:'700', marginBottom:'6px' }}>
            {modo==='sinFecha' ? 'Sin órdenes sin fecha' : modo==='historial' ? 'Sin actividades en ese rango' : modo==='vencidas' ? `Sin actividades vencidas en ${mesNombre}` : 'Sin actividades pendientes este mes'}
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {actividades.map((order, i) => {
            const diff = order._fecha ? getDiffLabel(order._fecha) : null
            const c = ESTADO_COLORS[order.estado]
            const accion = (order.accion || '').trim()
            const na = norm(accion)

            const contactos = []
            if (na === norm('Visitar')) {
              if (order.clienteTelefono)  contactos.push({ type:'tel',   value:order.clienteTelefono })
              if (order.clienteEmail)     contactos.push({ type:'email', value:order.clienteEmail })
              if (order.clienteDireccion) contactos.push({ type:'dir',   value:order.clienteDireccion })
            } else if (na === norm('Llamar')) {
              if (order.clienteTelefono) contactos.push({ type:'tel',   value:order.clienteTelefono })
              if (order.clienteEmail)    contactos.push({ type:'email', value:order.clienteEmail })
            } else if ([norm('Enviar Propuesta'),norm('Cerrar Venta'),norm('Mensaje'),norm('Solicitar Referidos'),norm('Seguimiento'),norm('Resolver Objeción'),norm('Post Venta'),norm('Venta Cruzada'),norm('Venta Ascendente')].includes(na)) {
              if (order.clienteTelefono) contactos.push({ type:'tel',   value:order.clienteTelefono })
              if (order.clienteEmail)    contactos.push({ type:'email', value:order.clienteEmail })
            }

            return (
              <div key={order.numOrden}
                onClick={() => onViewOrder(order)}
                style={{ background:'var(--white)', border:'1.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'14px 18px', cursor:'pointer', transition:'box-shadow 0.15s', animation:`fadeUp 0.2s ${Math.min(i,5)*0.04}s ease both` }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px', flexWrap:'wrap' }}>
                      {diff && <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:diff.bg, color:diff.color }}>{diff.label}</span>}
                      <span style={{ fontSize:'11px', fontWeight:'700', padding:'2px 8px', borderRadius:'20px', background:c.bg, color:c.color, border:`1px solid ${c.border}` }}>{order.estado}</span>
                    </div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:'700', fontSize:'15px' }}>{order.clienteNombre}</div>
                    {order.clienteNegocio && <div style={{ fontSize:'13px', color:'var(--muted)' }}>{order.clienteNegocio}</div>}
                    {order.siguienteAccionFecha && (
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'6px', flexWrap:'wrap' }}>
                        <span style={{ fontSize:'12px', color:'var(--muted)', display:'flex', alignItems:'center', gap:'4px' }}>
                          <Icon d={icons.calendar} size={12} />
                          {formatFecha(order.siguienteAccionFecha)}
                          {order.siguienteAccionFecha?.includes(' ') && (
                            <span style={{ display:'inline-flex', alignItems:'center', gap:'3px' }}>
                              <Icon d={icons.clock} size={12} />{order.siguienteAccionFecha.split(' ')[1]}
                            </span>
                          )}
                        </span>
                        {accion && <span style={{ fontSize:'12px', fontWeight:'600', color:'var(--brand)', background:'var(--brand-light)', padding:'1px 7px', borderRadius:'20px' }}>{accion}</span>}
                      </div>
                    )}
                    {modo === 'sinFecha' && (
                      <div style={{ fontSize:'12px', color:'#d97706', fontWeight:'600', marginTop:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                        <Icon d={icons.alert} size={12} /> Sin fecha de seguimiento
                      </div>
                    )}
                    {contactos.length > 0 && (
                      <div style={{ marginTop:'7px', display:'flex', flexDirection:'column', gap:'3px' }}>
                        {contactos.map((ct, ci) => {
                          if (ct.type==='tel') return (
                            <a key={ci} href={`https://wa.me/593${ct.value.replace(/\D/g,'').replace(/^0/,'')}`}
                              target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'#16a34a', textDecoration:'none' }}
                              onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                              onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                              <Icon d={icons.phone} size={12} />{ct.value}
                            </a>
                          )
                          if (ct.type==='email') return (
                            <a key={ci} href={`mailto:${ct.value}`} onClick={e => e.stopPropagation()}
                              style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'var(--brand)', textDecoration:'none' }}
                              onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                              onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                              <Icon d={icons.mail} size={12} />{ct.value}
                            </a>
                          )
                          if (ct.type==='dir') return (
                            <a key={ci} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ct.value)}`}
                              target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'600', color:'var(--muted)', textDecoration:'none' }}
                              onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                              onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                              <Icon d={icons.map} size={12} />{ct.value}
                            </a>
                          )
                          return null
                        })}
                      </div>
                    )}
                    {/* Días en estado — briefing */}
                    {(() => {
                      if (!order.fechaCambioEstado) return null
                      const s = order.fechaCambioEstado.toString().trim()
                      let fcs = null
                      if (s.includes('/')) { const p = s.split(' ')[0].split('/'); if (p.length === 3) fcs = new Date(p[2], p[1]-1, p[0]) }
                      if (!fcs) return null
                      fcs.setHours(0,0,0,0)
                      const hoy = getNowGuayaquil(); hoy.setHours(0,0,0,0)
                      const dias = Math.max(0, Math.floor((hoy - fcs) / (1000*60*60*24)))
                      const color = dias >= 7 ? '#dc2626' : dias >= 3 ? '#d97706' : 'var(--muted)'
                      const label = dias === 0 ? `Hoy en ${order.estado.toLowerCase()}` : `${dias} ${dias === 1 ? 'día' : 'días'} en ${order.estado.toLowerCase()}`
                      return <div style={{ fontSize:'11px', fontWeight:'700', color, marginTop:'5px', display:'flex', alignItems:'center', gap:'4px' }}><Icon d={icons.clock} size={11} />{label}</div>
                    })()}
                    {/* Última nota — briefing completo */}
                    {order.notasSeguimiento && (
                      <div style={{ fontSize:'12px', color:'var(--ink)', marginTop:'6px', fontStyle:'italic', lineHeight:'1.5', background:'var(--cream)', borderRadius:'6px', padding:'6px 10px', borderLeft:'3px solid var(--brand)' }}>
                        "{order.notasSeguimiento}"
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:'800', fontSize:'15px' }}>{fmtMoney(order.total)}</div>
                    <div style={{ fontSize:'11px', color:'var(--muted)', marginTop:'2px' }}>{order.numOrden}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
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
  const [horaAccion, setHoraAccion] = useState('')
  const [accion, setAccion] = useState('')
  const [notasSeguimiento, setNotasSeguimiento] = useState('')
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
      const params = new URLSearchParams({ action: 'createOrden', clienteNombre: clienteSeleccionado.nombre, clienteNegocio: clienteSeleccionado.negocio||'', estado, notas, siguienteAccionFecha: siguienteAccionFecha||'', horaAccion: horaAccion||'', accion: accion||'', notasSeguimiento: notasSeguimiento||'', items: JSON.stringify(lineItems) })
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Siguiente acción (fecha)</div>
              <input type="date" value={siguienteAccionFecha} onChange={e => setSiguienteAccionFecha(e.target.value)} style={{ ...inputStyle, fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Hora</div>
              <input type="time" value={horaAccion} onChange={e => setHoraAccion(e.target.value)} style={{ ...inputStyle, fontSize: '14px' }} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Acción a realizar</div>
              <select value={accion} onChange={e => setAccion(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', fontSize: '14px' }}>
                <option value="">— Seleccionar —</option>
                {acciones.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Notas de seguimiento</div>
            <textarea value={notasSeguimiento} onChange={e => setNotasSeguimiento(e.target.value)} placeholder="Detalles del seguimiento, acuerdos, próximos pasos..." style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5', fontSize: '14px' }} />
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

function OrdersView({ onViewOrder, filtroInicial, onFiltroChange }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstadoLocal] = useState(filtroInicial || 'Negociando')

  const setFiltroEstado = (v) => { setFiltroEstadoLocal(v); onFiltroChange(v) }
  const [meta, setMeta] = useState(0)
  const [historialOpen, setHistorialOpen] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [modoHistorial, setModoHistorial] = useState(false)
  const [searchOrden, setSearchOrden] = useState('')
  const [sortField, setSortField] = useState('fecha')
  const [sortDir, setSortDir] = useState('asc')

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
            const c = e === 'Todos' ? { bg: 'var(--brand)', color: 'white', border: 'var(--brand)' } : ESTADO_COLORS[e]
            return <button key={e} onClick={() => setFiltroEstado(e)} style={{
              padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: '700',
              border: `1.5px solid ${activo ? c.border : 'var(--border)'}`,
              background: activo ? c.bg : 'var(--white)',
              color: activo ? c.color : 'var(--muted)',
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
                  <DatePicker value={fechaInicio} onChange={setFechaInicio} placeholder="Desde..." />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600' }}>Hasta</label>
                  <DatePicker value={fechaFin} onChange={setFechaFin} placeholder="Hasta..." />
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
  const [view, setView] = useState('midia')
  const [ordersKey, setOrdersKey] = useState(0)
  const [ordersFiltro, setOrdersFiltro] = useState('Negociando')
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
  const [orderOrigin, setOrderOrigin] = useState('orders')
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

  const navigate = (v) => { setView(v); setMenuOpen(false); if (v !== 'edit') setEditingClient(null); if (v !== 'view') setViewingClient(null); if (v !== 'viewOrder' && v !== 'newOrder') setViewingOrder(null); if (v === 'orders') { setOrdersKey(k => k + 1); setOrdersFiltro('Negociando') } }
  const handleEdit = (c) => { setEditingClient(c); setViewingClient(null); setView('edit') }
  const handleView = (c) => { setViewingClient(c); setView('view') }
  const handleSaveEdit = (c) => { setClients(p => p.map(x => x.rowIndex === c.rowIndex ? c : x)); showToast(`✓ ${c.nombre} actualizado`); setView('list') }
  const handleViewOrder = (o, origin = 'orders') => { setViewingOrder(o); setOrderOrigin(origin); setView('viewOrder') }
  const handleChangeEstado = (rowIndex, estado) => setOrders(p => p.map(o => o.rowIndex === rowIndex ? { ...o, estado } : o))

  const inp = (f, v) => { setForm(p => ({ ...p, [f]: v })); if (errors[f]) setErrors(e => ({ ...e, [f]: null })) }
  const gs = (f) => ({ ...inputStyle, borderColor: errors[f] ? 'var(--accent)' : focusedField === f ? 'var(--brand)' : 'var(--border)', boxShadow: focusedField === f ? '0 0 0 3px rgba(30,58,95,0.12)' : 'none' })
  const fp = (f, x = {}) => ({ style: gs(f), value: form[f], onChange: e => inp(f, e.target.value), onFocus: () => setFocusedField(f), onBlur: () => setFocusedField(null), ...x })

  const menuItems = [
    { key: 'midia',       icon: icons.calendar,   label: 'Mi día de hoy' },
    { key: 'dashboard',   icon: icons.dashboard,  label: 'Dashboard' },
    { key: 'activities',  icon: icons.activity,   label: 'Actividades' },
    { key: 'form',        icon: icons.plus,        label: 'Nuevo cliente' },
    { key: 'list',        icon: icons.list,        label: 'Clientes' },
    { key: 'newOrder',    icon: icons.plus,        label: 'Nueva orden' },
    { key: 'orders',      icon: icons.orders,      label: 'Órdenes' },
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
              const isActive = view === key || (view === 'edit' && key === 'list') || (view === 'view' && key === 'list') || (view === 'viewOrder' && key === 'orders') || (view === 'viewOrder' && key === 'activities') || (view === 'viewOrder' && key === 'midia')
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
        {view === 'midia' && <MiDia onViewOrder={(o) => handleViewOrder(o, 'midia')} />}

        {view === 'dashboard' && <Dashboard />}

        {/* ── VER CLIENTE ───────────────────────────────────────────────────── */}
        {view === 'view' && viewingClient && (
          <ViewClient client={viewingClient} onEdit={handleEdit} onBack={() => setView('list')} onViewOrder={(o) => handleViewOrder(o, 'view')} />
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

        {/* ── ACTIVIDADES ───────────────────────────────────────────────────── */}
        {view === 'activities' && (
          <ActividadesView onViewOrder={(o) => handleViewOrder(o, 'activities')} />
        )}

        {/* ── ÓRDENES ───────────────────────────────────────────────────────── */}
        {view === 'orders' && (
          <OrdersView key={ordersKey} onViewOrder={(o) => handleViewOrder(o, 'orders')} filtroInicial={ordersFiltro} onFiltroChange={setOrdersFiltro} />
        )}

        {/* ── VER ORDEN ─────────────────────────────────────────────────────── */}
        {view === 'viewOrder' && viewingOrder && (
          <ViewOrder order={viewingOrder} onBack={() => setView(orderOrigin === 'midia' ? 'midia' : orderOrigin)} onChangeEstado={handleChangeEstado} showToast={showToast} backLabel={orderOrigin === 'view' ? 'Volver al cliente' : orderOrigin === 'midia' ? 'Volver a Mi día' : 'Volver a órdenes'} />
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
