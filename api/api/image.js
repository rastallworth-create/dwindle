export default async function handler(req, res) {
  const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
  if (!ACCESS_KEY) {
    return res.status(500).json({ error: 'UNSPLASH_ACCESS_KEY not set' });
  }
  const index = parseInt(req.query.index) || 0;
  const searchTerms = [
    'sunset ocean water','city skyline night','forest path trees',
    'mountain landscape','desert sand dunes','northern lights aurora',
    'waterfall nature','ocean waves sea','autumn forest leaves',
    'cherry blossom spring','snowy mountain peak','canyon landscape',
    'lavender field','tropical beach','glacier iceberg',
    'foggy valley mist','african savanna','lightning storm',
    'underwater coral reef','volcanic eruption lava',
  ];
  const term = searchTerms[index % searchTerms.length];
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(term)}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    if (!response.ok) throw new Error(`Unsplash error ${response.status}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ url: data.urls.regular, credit: data.user.name });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
