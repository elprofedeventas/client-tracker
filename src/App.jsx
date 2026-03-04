import { useState, useEffect, useCallback } from 'react'

// Pega aquí la URL de tu Web App de Apps Script
const API_BASE = '/api/proxy'

const today = () => new Date().toISOString().split('T')[0]

const EMPTY_FORM = {
  nombre: '',
  negocio: '',
  telefono: '',
  email: '',
  direccion: '',
  locales: '',
  fechaVisita: today(),
  notas: '',
  siguienteAccionFecha: '',
  accion: '',
}

// ─── Icons ────────────────────────────────────────────────────────────────────
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
  plus: 'M12 5v14M5 12h14',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  chevron: 'M9 18l6-6-6-6',
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, icon, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ color: 'var(--accent)', opacity: 0.7 }}>
          <Icon d={icons[icon]} size={14} />
        </span>
        {label}
        {required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{hint}</span>}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--white)',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--ink)',
  fontSize: '15px',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  outline: 'none',
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
      background: type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
      border: `1.5px solid ${type === 'success' ? 'var(--success)' : 'var(--error)'}`,
      color: type === 'success' ? 'var(--success)' : 'var(--error)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontWeight: '500', maxWidth: '340px',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeUp 0.3s ease',
    }}>
      <Icon d={type === 'success' ? icons.check : icons.x} size={18} />
      {message}
    </div>
  )
}

// ─── Client row ───────────────────────────────────────────────────────────────
function ClientRow({ client, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'var(--white)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      animation: `fadeUp 0.3s ${index * 0.05}s ease both`,
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: '800',
            fontSize: '14px', flexShrink: 0,
          }}>
            {client.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px' }}>
              {client.nombre}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {client.negocio || '—'} · {client.telefono}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{client.fechaVisita}</span>
          <span style={{
            transform: open ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 0.2s', color: 'var(--muted)'
          }}>
            <Icon d={icons.chevron} size={16} />
          </span>
        </div>
      </div>

      {open && (
        <div style={{
          padding: '0 18px 16px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px', borderTop: '1px solid var(--cream)',
          paddingTop: '14px', animation: 'fadeUp 0.2s ease',
        }}>
          {[
            { icon: 'mail', label: 'Email', val: client.email },
            { icon: 'map', label: 'Dirección', val: client.direccion },
            { icon: 'building', label: 'Locales', val: client.locales },
            { icon: 'calendar', label: 'Fecha Visita', val: client.fechaVisita },
          ].map(({ icon, label, val }) => val ? (
            <div key={label}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon d={icons[icon]} size={12} />{label}
              </div>
              <div style={{ fontSize: '14px' }}>{val}</div>
            </div>
          ) : null)}
          {client.notas && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Icon d={icons.note} size={12} />Notas
              </div>
              <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--muted)', background: 'var(--cream)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>
                "{client.notas}"
              </div>
            </div>
          )}
          <div style={{ gridColumn: '1 / -1', fontSize: '11px', color: 'var(--border)', textAlign: 'right' }}>
            Registrado: {client.fechaRegistro}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('form')
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [toast, setToast] = useState(null)
  const [focusedField, setFocusedField] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const fetchClients = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      if (data.success) setClients(data.data)
      else showToast('Error al cargar clientes', 'error')
    } catch {
      showToast('No se puede conectar al servidor', 'error')
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    if (view === 'list') fetchClients()
  }, [view, fetchClients])

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
  if (!validate()) return
  setLoading(true)
  try {
    const params = new URLSearchParams({ ...form, action: 'create' })
    await fetch(`${API_BASE}?${params.toString()}`, {
      method: 'GET',
      mode: 'no-cors',
    })
    showToast(`✓ ${form.nombre} registrado exitosamente`)
    setForm(EMPTY_FORM)
    setErrors({})
  } catch {
    showToast('Error al conectar con Apps Script', 'error')
  } finally {
    setLoading(false)
  }
}

  const inp = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: errors[field] ? 'var(--accent)' : focusedField === field ? 'var(--ink)' : 'var(--border)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(13,13,13,0.06)' : 'none',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--ink)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={icons.user} size={15} stroke="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: '800',
            fontSize: '16px', color: 'white', letterSpacing: '-0.01em'
          }}>
            ClientTracker
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '4px' }}>
          {[
            { key: 'form', icon: icons.plus, label: 'Nuevo' },
            { key: 'list', icon: icons.list, label: 'Clientes' },
          ].map(({ key, icon, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              background: view === key ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none',
              color: view === key ? 'white' : 'rgba(255,255,255,0.5)',
              padding: '6px 14px',
              borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontWeight: '600', fontSize: '13px',
              transition: 'all 0.15s',
              cursor: 'pointer',
            }}>
              <Icon d={icon} size={15} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>

        {/* FORM VIEW */}
        {view === 'form' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-block',
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                fontSize: '11px', fontWeight: '700',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '20px', marginBottom: '10px'
              }}>
                Nueva visita
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: '800',
                fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em',
              }}>
                Registrar cliente
              </h1>
              <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>
                Completa los datos del prospecto que visitaste hoy.
              </p>
            </div>

            <div style={{
              background: 'var(--white)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              display: 'flex', flexDirection: 'column', gap: '20px',
              boxShadow: 'var(--shadow)',
            }}>

              {/* Datos de contacto */}
              <div>
                <div style={{
                  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--muted)',
                  marginBottom: '16px', paddingBottom: '8px',
                  borderBottom: '1px solid var(--cream)',
                  fontFamily: 'var(--font-display)',
                }}>
                  Datos de contacto
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Nombre completo" icon="user" required>
                    <input style={getInputStyle('nombre')} value={form.nombre}
                      onChange={e => inp('nombre', e.target.value)}
                      onFocus={() => setFocusedField('nombre')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ej: María López" />
                    {errors.nombre && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.nombre}</span>}
                  </Field>

                  <Field label="Nombre del negocio" icon="store">
                    <input style={getInputStyle('negocio')} value={form.negocio}
                      onChange={e => inp('negocio', e.target.value)}
                      onFocus={() => setFocusedField('negocio')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ej: Farmacia del Parque" />
                  </Field>

                  <Field label="Teléfono" icon="phone" required>
                    <input style={getInputStyle('telefono')} value={form.telefono}
                      onChange={e => inp('telefono', e.target.value)}
                      onFocus={() => setFocusedField('telefono')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="+52 55 1234 5678" type="tel" />
                    {errors.telefono && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.telefono}</span>}
                  </Field>

                  <Field label="Email" icon="mail">
                    <input style={getInputStyle('email')} value={form.email}
                      onChange={e => inp('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="correo@ejemplo.com" type="email" />
                    {errors.email && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.email}</span>}
                  </Field>
                </div>
              </div>

              {/* Info del negocio */}
              <div>
                <div style={{
                  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--muted)',
                  marginBottom: '16px', paddingBottom: '8px',
                  borderBottom: '1px solid var(--cream)',
                  fontFamily: 'var(--font-display)',
                }}>
                  Info del negocio
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <Field label="Dirección" icon="map">
                    <input style={getInputStyle('direccion')} value={form.direccion}
                      onChange={e => inp('direccion', e.target.value)}
                      onFocus={() => setFocusedField('direccion')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Calle, colonia, ciudad" />
                  </Field>

                  <Field label="¿Cuántos locales?" icon="building" hint="Número de sucursales">
                    <input style={getInputStyle('locales')} value={form.locales}
                      onChange={e => inp('locales', e.target.value)}
                      onFocus={() => setFocusedField('locales')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ej: 3" type="number" min="1" />
                  </Field>
                </div>
              </div>

              {/* Detalles de la visita */}
              <div>
                <div style={{
                  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--muted)',
                  marginBottom: '16px', paddingBottom: '8px',
                  borderBottom: '1px solid var(--cream)',
                  fontFamily: 'var(--font-display)',
                }}>
                  Detalles de la visita
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Fecha de visita" icon="calendar">
                    <input style={getInputStyle('fechaVisita')} value={form.fechaVisita}
                      onChange={e => inp('fechaVisita', e.target.value)}
                      onFocus={() => setFocusedField('fechaVisita')}
                      onBlur={() => setFocusedField(null)}
                      type="date" />
                  </Field>

                  <Field label="Notas / Comentarios" icon="note">
                    <textarea style={{
                      ...getInputStyle('notas'),
                      resize: 'vertical', minHeight: '90px', lineHeight: '1.5'
                    }} value={form.notas}
                      onChange={e => inp('notas', e.target.value)}
                      onFocus={() => setFocusedField('notas')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Interés del cliente, próximos pasos, observaciones..." />
                  </Field>

                  <Field label="Siguiente Acción" icon="calendar">
                    <input style={getInputStyle('siguienteAccionFecha')} value={form.siguienteAccionFecha}
                      onChange={e => inp('siguienteAccionFecha', e.target.value)}
                      onFocus={() => setFocusedField('siguienteAccionFecha')}
                      onBlur={() => setFocusedField(null)}
                      type="date" />
                  </Field>

                  <Field label="Acción" icon="note">
                    <input style={getInputStyle('accion')} value={form.accion}
                      onChange={e => inp('accion', e.target.value)}
                      onFocus={() => setFocusedField('accion')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ej: Llamar, Enviar propuesta, Visitar..." />
                  </Field>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading ? 'var(--muted)' : 'var(--ink)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  fontWeight: '700',
                  letterSpacing: '0.04em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s, transform 0.1s',
                  marginTop: '4px',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.background = 'var(--accent)' }}
                onMouseLeave={e => { if (!loading) e.target.style.background = 'var(--ink)' }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: 'pulse 1s infinite' }}>⏳</span>
                    Guardando en Google Sheets...
                  </>
                ) : (
                  <>
                    <Icon d={icons.check} size={16} />
                    Registrar cliente
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontWeight: '800',
                  fontSize: '28px', letterSpacing: '-0.02em',
                }}>
                  Clientes registrados
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>
                  {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'} en total
                </p>
              </div>
              <button onClick={fetchClients} disabled={loadingList} style={{
                background: 'var(--white)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '8px 14px',
                color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', fontWeight: '600',
                transition: 'all 0.15s',
              }}>
                <span style={{ display: 'inline-block', animation: loadingList ? 'pulse 1s infinite' : 'none' }}>
                  <Icon d={icons.refresh} size={15} />
                </span>
                Actualizar
              </button>
            </div>

            {loadingList ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px', animation: 'pulse 1s infinite' }}>⏳</div>
                Cargando clientes...
              </div>
            ) : clients.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px',
                background: 'var(--white)', border: '1.5px dashed var(--border)',
                borderRadius: 'var(--radius-lg)', color: 'var(--muted)',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>
                  Sin registros aún
                </div>
                <div style={{ fontSize: '14px' }}>
                  Registra tu primer cliente con el botón "Nuevo"
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {clients.map((c, i) => <ClientRow key={i} client={c} index={i} />)}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
