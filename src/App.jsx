import { useState, useEffect, useCallback } from 'react'

const API_BASE = '/api/proxy'

const EMPTY_FORM = {
  nombre: '',
  negocio: '',
  identificacion: '',
  telefono: '',
  email: '',
  direccion: '',
  locales: '',
  contacto: '',
  telefonoContacto: '',
  notas: '',
  siguienteAccionFecha: '',
  accion: '',
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
}

function Field({ label, icon, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: '700',
        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)',
        display: 'flex', alignItems: 'center', gap: '6px'
      }}>
        <span style={{ color: 'var(--accent)', opacity: 0.7 }}><Icon d={icons[icon]} size={14} /></span>
        {label}
        {required && <span style={{ color: 'var(--accent)' }}>*</span>}
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
  fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--muted)',
  marginBottom: '16px', paddingBottom: '8px',
  borderBottom: '1px solid var(--cream)', fontFamily: 'var(--font-display)',
}

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
      borderRadius: 'var(--radius-lg)', padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: '10px',
      fontWeight: '500', maxWidth: '340px', boxShadow: 'var(--shadow-lg)',
      animation: 'fadeUp 0.3s ease',
    }}>
      <Icon d={type === 'success' ? icons.check : icons.x} size={18} />
      {message}
    </div>
  )
}

function ClientRow({ client, index, onEdit }) {
  const [open, setOpen] = useState(false)
  const hasNextAction = client.siguienteAccionFecha || client.accion

  return (
    <div style={{
      background: 'var(--white)', border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      animation: `fadeUp 0.3s ${index * 0.05}s ease both`, transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div onClick={() => setOpen(!open)} style={{
        padding: '14px 18px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '14px', flexShrink: 0,
          }}>
            {client.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '15px' }}>{client.nombre}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{client.negocio || '—'} · {client.telefono}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasNextAction && (
            <div style={{
              background: 'var(--accent-light)', color: 'var(--accent)',
              fontSize: '11px', fontWeight: '700', padding: '3px 8px',
              borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <Icon d={icons.alert} size={11} />
              {client.siguienteAccionFecha}
            </div>
          )}
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{client.fechaRegistro}</span>
          <span style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--muted)' }}>
            <Icon d={icons.chevron} size={16} />
          </span>
        </div>
      </div>

      {open && (
        <div style={{
          padding: '14px 18px 16px', borderTop: '1px solid var(--cream)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            {[
              { icon: 'id', label: 'Identificación', val: client.identificacion },
              { icon: 'mail', label: 'Email', val: client.email },
              { icon: 'map', label: 'Dirección', val: client.direccion },
              { icon: 'building', label: 'Locales', val: client.locales },
              { icon: 'contact', label: 'Contacto', val: client.contacto },
              { icon: 'phone', label: 'Tel. Contacto', val: client.telefonoContacto },
            ].map(({ icon, label, val }) => val ? (
              <div key={label}>
                <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon d={icons[icon]} size={12} />{label}
                </div>
                <div style={{ fontSize: '14px' }}>{val}</div>
              </div>
            ) : null)}

            {hasNextAction && (
              <div style={{
                gridColumn: '1 / -1', background: 'var(--accent-light)',
                borderRadius: 'var(--radius)', padding: '10px 14px',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}>
                <Icon d={icons.alert} size={16} stroke="var(--accent)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Siguiente acción
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: '500' }}>
                    {client.accion}{client.accion && client.siguienteAccionFecha ? ' — ' : ''}{client.siguienteAccionFecha}
                  </div>
                </div>
              </div>
            )}

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
          </div>

          {/* Footer con fecha y botón editar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--border)' }}>
              Registrado: {client.fechaRegistro}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onEdit(client) }}
              style={{
                background: 'var(--ink)', color: 'white', border: 'none',
                borderRadius: 'var(--radius)', padding: '7px 14px',
                fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
            >
              <Icon d={icons.edit} size={13} />
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Edit Form ────────────────────────────────────────────────────────────────
function EditForm({ client, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre: client.nombre || '',
    negocio: client.negocio || '',
    identificacion: client.identificacion || '',
    telefono: client.telefono || '',
    email: client.email || '',
    direccion: client.direccion || '',
    locales: client.locales || '',
    contacto: client.contacto || '',
    telefonoContacto: client.telefonoContacto || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const inp = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: errors[field] ? 'var(--accent)' : focusedField === field ? 'var(--ink)' : 'var(--border)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(13,13,13,0.06)' : 'none',
  })

  const fieldProps = (field, extra = {}) => ({
    style: getInputStyle(field),
    value: form[field],
    onChange: e => inp(field, e.target.value),
    onFocus: () => setFocusedField(field),
    onBlur: () => setFocusedField(null),
    ...extra,
  })

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.telefono.trim()) e.telefono = 'El teléfono es obligatorio'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...form, action: 'update', rowIndex: client.rowIndex })
      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        onSave({ ...client, ...form })
      } else {
        alert(data.error || 'Error al actualizar')
      }
    } catch {
      alert('Error al conectar con Apps Script')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: '600', padding: '0', marginBottom: '16px',
        }}>
          <Icon d={icons.arrowLeft} size={15} /> Volver a clientes
        </button>
        <div style={{
          display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
          fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: '20px', marginBottom: '10px'
        }}>
          Editando cliente
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {client.nombre}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>
          Modifica los datos y guarda los cambios.
        </p>
      </div>

      <div style={{
        background: 'var(--white)', border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px',
        display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: 'var(--shadow)',
      }}>
        {/* Datos del cliente */}
        <div>
          <div style={sectionTitle}>Datos del cliente</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Nombre completo" icon="user" required>
              <input {...fieldProps('nombre')} placeholder="Ej: María López" />
              {errors.nombre && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.nombre}</span>}
            </Field>
            <Field label="Identificación" icon="id" hint="Cédula o RUC">
              <input {...fieldProps('identificacion')} placeholder="Ej: 0912345678" />
            </Field>
            <Field label="Teléfono" icon="phone" required>
              <input {...fieldProps('telefono', { type: 'tel' })} placeholder="Ej: 0997002220" />
              {errors.telefono && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.telefono}</span>}
            </Field>
            <Field label="Email" icon="mail">
              <input {...fieldProps('email', { type: 'email' })} placeholder="correo@ejemplo.com" />
              {errors.email && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.email}</span>}
            </Field>
          </div>
        </div>

        {/* Datos del negocio */}
        <div>
          <div style={sectionTitle}>Datos del negocio</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Nombre del negocio" icon="store">
              <input {...fieldProps('negocio')} placeholder="Ej: Farmacia del Parque" />
            </Field>
            <Field label="¿Cuántos locales?" icon="building" hint="Sucursales">
              <input {...fieldProps('locales', { type: 'number', min: '1' })} placeholder="Ej: 3" />
            </Field>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Dirección" icon="map">
                <input {...fieldProps('direccion')} placeholder="Calle, número, ciudad" />
              </Field>
            </div>
          </div>
        </div>

        {/* Persona de contacto */}
        <div>
          <div style={sectionTitle}>Persona de contacto</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Field label="Contacto" icon="contact">
              <input {...fieldProps('contacto')} placeholder="Nombre del contacto" />
            </Field>
            <Field label="Teléfono de contacto" icon="phone">
              <input {...fieldProps('telefonoContacto', { type: 'tel' })} placeholder="Ej: 0987654321" />
            </Field>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '13px', background: 'var(--cream)',
            color: 'var(--ink)', border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius)', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', transition: 'background 0.15s',
          }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading} style={{
            flex: 2, padding: '13px',
            background: loading ? 'var(--muted)' : 'var(--ink)',
            color: 'white', border: 'none', borderRadius: 'var(--radius)',
            fontSize: '14px', fontWeight: '700', letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s', cursor: loading ? 'not-allowed' : 'pointer',
          }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--ink)' }}
          >
            {loading
              ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando cambios...</>
              : <><Icon d={icons.check} size={16} /> Guardar cambios</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('form') // 'form' | 'list' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [toast, setToast] = useState(null)
  const [focusedField, setFocusedField] = useState(null)
  const [acciones, setAcciones] = useState([])
  const [editingClient, setEditingClient] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  useEffect(() => {
    fetch(`${API_BASE}?action=getAcciones`)
      .then(r => r.json())
      .then(data => { if (data.success) setAcciones(data.data) })
      .catch(() => {})
  }, [])

  const fetchClients = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      if (data.success) setClients(data.data)
      else showToast('Error al cargar clientes', 'error')
    } catch {
      showToast('Error al conectar con Apps Script', 'error')
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
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...form, action: 'create' })
      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        showToast(`✓ ${form.nombre} registrado exitosamente`)
        setForm(EMPTY_FORM)
        setErrors({})
      } else {
        showToast(data.error || 'Error al registrar', 'error')
      }
    } catch {
      showToast('Error al conectar con Apps Script', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setView('edit')
  }

  const handleSaveEdit = (updatedClient) => {
    setClients(prev => prev.map(c => c.rowIndex === updatedClient.rowIndex ? updatedClient : c))
    showToast(`✓ ${updatedClient.nombre} actualizado exitosamente`)
    setView('list')
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

  const fieldProps = (field, extra = {}) => ({
    style: getInputStyle(field),
    value: form[field],
    onChange: e => inp(field, e.target.value),
    onFocus: () => setFocusedField(field),
    onBlur: () => setFocusedField(null),
    ...extra,
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--ink)', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={icons.user} size={15} stroke="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '16px', color: 'white', letterSpacing: '-0.01em' }}>
            ClientTracker
          </span>
        </div>
        <nav style={{ display: 'flex', gap: '4px' }}>
          {[
            { key: 'form', icon: icons.plus, label: 'Nuevo' },
            { key: 'list', icon: icons.list, label: 'Clientes' },
          ].map(({ key, icon, label }) => (
            <button key={key} onClick={() => setView(key)} style={{
              background: (view === key || (view === 'edit' && key === 'list')) ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none', color: (view === key || (view === 'edit' && key === 'list')) ? 'white' : 'rgba(255,255,255,0.5)',
              padding: '6px 14px', borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', gap: '6px',
              fontWeight: '600', fontSize: '13px', transition: 'all 0.15s', cursor: 'pointer',
            }}>
              <Icon d={icon} size={15} />{label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>

        {/* ── EDIT VIEW ─────────────────────────────────────────────────────── */}
        {view === 'edit' && editingClient && (
          <EditForm
            client={editingClient}
            onSave={handleSaveEdit}
            onCancel={() => setView('list')}
          />
        )}

        {/* ── FORM VIEW ─────────────────────────────────────────────────────── */}
        {view === 'form' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)',
                fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '20px', marginBottom: '10px'
              }}>
                Nueva visita
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Registrar cliente
              </h1>
              <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '14px' }}>
                La fecha y hora se registran automáticamente al guardar.
              </p>
            </div>

            <div style={{
              background: 'var(--white)', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px',
              display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: 'var(--shadow)',
            }}>
              <div>
                <div style={sectionTitle}>Datos del cliente</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Nombre completo" icon="user" required>
                    <input {...fieldProps('nombre')} placeholder="Ej: María López" />
                    {errors.nombre && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.nombre}</span>}
                  </Field>
                  <Field label="Identificación" icon="id" hint="Cédula o RUC">
                    <input {...fieldProps('identificacion')} placeholder="Ej: 0912345678" />
                  </Field>
                  <Field label="Teléfono" icon="phone" required>
                    <input {...fieldProps('telefono', { type: 'tel' })} placeholder="Ej: 0997002220" />
                    {errors.telefono && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.telefono}</span>}
                  </Field>
                  <Field label="Email" icon="mail">
                    <input {...fieldProps('email', { type: 'email' })} placeholder="correo@ejemplo.com" />
                    {errors.email && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>{errors.email}</span>}
                  </Field>
                </div>
              </div>

              <div>
                <div style={sectionTitle}>Datos del negocio</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Nombre del negocio" icon="store">
                    <input {...fieldProps('negocio')} placeholder="Ej: Farmacia del Parque" />
                  </Field>
                  <Field label="¿Cuántos locales?" icon="building" hint="Sucursales">
                    <input {...fieldProps('locales', { type: 'number', min: '1' })} placeholder="Ej: 3" />
                  </Field>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Dirección" icon="map">
                      <input {...fieldProps('direccion')} placeholder="Calle, número, ciudad" />
                    </Field>
                  </div>
                </div>
              </div>

              <div>
                <div style={sectionTitle}>Persona de contacto</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Field label="Contacto" icon="contact">
                    <input {...fieldProps('contacto')} placeholder="Nombre del contacto" />
                  </Field>
                  <Field label="Teléfono de contacto" icon="phone">
                    <input {...fieldProps('telefonoContacto', { type: 'tel' })} placeholder="Ej: 0987654321" />
                  </Field>
                </div>
              </div>

              <div>
                <div style={sectionTitle}>Notas y seguimiento</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Field label="Notas / Comentarios" icon="note">
                    <textarea {...fieldProps('notas')} style={{ ...getInputStyle('notas'), resize: 'vertical', minHeight: '90px', lineHeight: '1.5' }}
                      placeholder="Interés del cliente, próximos pasos, observaciones..." />
                  </Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Field label="Siguiente acción (fecha)" icon="calendar">
                      <input {...fieldProps('siguienteAccionFecha', { type: 'date' })} />
                    </Field>
                    <Field label="Acción a realizar" icon="alert">
                      <select
                        style={{ ...getInputStyle('accion'), cursor: 'pointer' }}
                        value={form.accion}
                        onChange={e => inp('accion', e.target.value)}
                        onFocus={() => setFocusedField('accion')}
                        onBlur={() => setFocusedField(null)}
                      >
                        <option value="">— Seleccionar —</option>
                        {acciones.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={loading} style={{
                width: '100%', padding: '13px',
                background: loading ? 'var(--muted)' : 'var(--ink)',
                color: 'white', border: 'none', borderRadius: 'var(--radius)',
                fontSize: '14px', fontWeight: '700', letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.2s', marginTop: '4px', cursor: loading ? 'not-allowed' : 'pointer',
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--ink)' }}
              >
                {loading
                  ? <><span style={{ animation: 'pulse 1s infinite' }}>⏳</span> Guardando en Google Sheets...</>
                  : <><Icon d={icons.check} size={16} /> Registrar cliente</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── LIST VIEW ─────────────────────────────────────────────────────── */}
        {view === 'list' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '28px', letterSpacing: '-0.02em' }}>
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
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}>
                <span style={{ animation: loadingList ? 'pulse 1s infinite' : 'none' }}>
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
                textAlign: 'center', padding: '60px', background: 'var(--white)',
                border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--muted)',
              }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '6px' }}>Sin registros aún</div>
                <div style={{ fontSize: '14px' }}>Registra tu primer cliente con el botón "Nuevo"</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {clients.map((c, i) => (
                  <ClientRow key={i} client={c} index={i} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
