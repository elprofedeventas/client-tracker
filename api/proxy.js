export default async function handler(req, res) {
  const base = 'https://script.google.com/macros/s/AKfycbwiuai50-MZsFIfTKcBdX0oGQeU0rUE3Hk6TIbkD6N9mfMtlNqrMA402RUDtV9tSMq5/exec'
  
  const url = `${base}?${new URLSearchParams(req.query)}`
  
  const response = await fetch(url, { redirect: 'follow' })
  const data = await response.json()
  
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json(data)
}