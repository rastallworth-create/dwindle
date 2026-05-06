// api/choices.js
// Uses Claude's vision to analyze the photo and generate 4 fitting answer choices
// 1 correct answer + 3 deceptive but plausible wrong answers

export default async function handler(req, res) {
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'url',
                  url: url,
                },
              },
              {
                type: 'text',
                text: `You are generating choices for a photo guessing game. Look at this photo and respond with ONLY a JSON object, no other text.

The JSON must have:
- "label": the correct short description (4-6 words, e.g. "A sunset over calm water")
- "choices": array of exactly 4 strings — the correct label plus 3 wrong answers that are deceptively similar (same mood, color palette, or setting so players can't guess from color alone)

Rules for wrong answers:
- Same general color palette as the correct answer
- Similar mood/atmosphere
- Plausible but clearly different if you see enough of the image
- No wild guesses like "A desert" when the photo is clearly ocean

Example response format:
{"label":"The northern lights","choices":["The northern lights","A bioluminescent bay at night","Neon lights reflected in rain","A lightning storm over the ocean"]}

Respond with ONLY the JSON, nothing else.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();

    // Parse the JSON response — strip markdown backticks if present
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);

    // Shuffle choices so correct answer isn't always first
    const shuffled = parsed.choices.sort(() => Math.random() - 0.5);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({
      label: parsed.label,
      choices: shuffled,
    });
  } catch (err) {
    console.error('Choices API error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
