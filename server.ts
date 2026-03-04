import express from 'express';
import { createServer as createViteServer } from 'vite';
import db from './db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/cards', (req, res) => {
    const cards = db.prepare('SELECT * FROM cards ORDER BY card_number ASC').all();
    res.json(cards);
  });

  app.get('/api/cards/:id', (req, res) => {
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);
    if (card) res.json(card);
    else res.status(404).json({ error: 'Card not found' });
  });

  app.post('/api/cards', (req, res) => {
    const {
      card_number, name, group_name, element, legend, general_meaning,
      work, finance, love, health, merit, visual_key, deep_meaning, occult, image_url
    } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO cards (
          card_number, name, group_name, element, legend, general_meaning,
          work, finance, love, health, merit, visual_key, deep_meaning, occult, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(
        card_number, name, group_name, element, legend, general_meaning,
        work, finance, love, health, merit, visual_key, deep_meaning, occult, image_url
      );
      res.json({ id: info.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/cards/:id', (req, res) => {
    const {
      card_number, name, group_name, element, legend, general_meaning,
      work, finance, love, health, merit, visual_key, deep_meaning, occult, image_url
    } = req.body;
    
    try {
      const stmt = db.prepare(`
        UPDATE cards SET
          card_number = ?, name = ?, group_name = ?, element = ?, legend = ?, general_meaning = ?,
          work = ?, finance = ?, love = ?, health = ?, merit = ?, visual_key = ?, deep_meaning = ?, occult = ?, image_url = ?
        WHERE id = ?
      `);
      stmt.run(
        card_number, name, group_name, element, legend, general_meaning,
        work, finance, love, health, merit, visual_key, deep_meaning, occult, image_url,
        req.params.id
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/cards/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
