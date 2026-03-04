export default async function handler(req, res) {
  const base = 'https://script.google.com/macros/s/AKfycbwiuai50-MZsFIfTKcBdX0oGQeU0rUE3Hk6TIbkD6N9mfMtlNqrMA402RUDtV9tSMq5/exec'
  
  const url = `${base}?${new URLSearchParams(req.query)}`
  
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    })

    const text = await response.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { success: false, error: 'Respuesta inválida de Apps Script', raw: text }
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

Guarda en GitHub, espera que Vercel redespliege y prueba esta URL directamente en el navegador para ver qué responde Apps Script:
```
https://client-tracker-gray.vercel.app/api/proxy?action=create&nombre=Test&telefono=0999999999
