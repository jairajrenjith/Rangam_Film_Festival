// Vercel serverless function — POST /api/rangam-bot
// Update FAQ_FACTS below as real event/schedule/pass details are confirmed.

const FAQ_FACTS = [
  { q: 'What is Rangam?', a: "Rangam is CET Film Society's annual film festival. This year's edition is themed സാക്ഷിപകർപ്പുകൾ — Whispers of Witness: Cinema as a Historical Memory against Oppression." },
  { q: 'Why should I join?', a: 'Rangam is a shared screening experience for anyone who loves cinema — a chance to watch, discuss, and sit with films together, not just watch them alone.' },
  { q: "What's this year's theme?", a: 'സാക്ഷിപകർപ്പുകൾ — Whispers of Witness. This edition looks at cinema as historical memory, and how film carries witness against oppression.' },
  { q: 'When is it happening?', a: "Dates are being finalized. Check the site's schedule section soon — this answer will update the moment they're confirmed." },
  { q: 'What films are screening?', a: "The lineup isn't confirmed yet. Follow the site for the reveal — screening details will appear on the schedule once ready." },
  { q: 'How do I get a pass?', a: "Passes aren't live yet. They'll open on the site's Edition section once the schedule is confirmed — check back soon." },
  { q: 'What happened in previous editions?', a: 'Rangam has run before as more than just screenings — with films and discussions that stayed with people long after the credits. Footage and highlights from past editions are being added to the archive.' },
  { q: 'Who organizes Rangam?', a: 'Rangam is organized by CET Film Society, College of Engineering Trivandrum.' },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed.' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ reply: 'No question received.' });
  }

  const systemPrompt = `You are Rangam's assistant (CET Film Society's film fest, CET).
Answer ONLY using the facts below. Keep answers short (1-3 sentences), in a calm, archival tone matching the festival's theme of cinema as historical memory.
If something isn't covered by the facts, say you don't have that info yet and point to the site — never guess or invent details.

FACTS:
${FAQ_FACTS.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }] }]
        })
      }
    );
    const data = await r.json();

    if (!r.ok) {
      console.error('Gemini API error:', data);

      return res.status(r.status).json({
        reply: `Gemini API error: ${data.error?.message || 'Unknown error'}`
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!reply) {
      console.error('Unexpected Gemini response:', data);

      return res.status(500).json({
        reply: "Gemini returned no answer."
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('rangam-bot error:', err);
    return res.status(500).json({ reply: "Couldn't reach the archive — try again in a bit." });
  }
}
