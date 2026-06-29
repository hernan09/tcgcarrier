export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const response = await fetch('https://topdeck.gg/api/v2/tournaments', {
      method: 'POST',
      headers: {
        'Authorization': '4634c213-6bfd-468e-aa61-ad6fbb67d67d',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.text()
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(response.status).send(data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
