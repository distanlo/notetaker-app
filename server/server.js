const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ============ AUTH ROUTES ============

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: 'Server error' });
        }

        const token = jwt.sign({ userId: this.lastID }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, userId: this.lastID, username });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user.id, username: user.username });
  });
});

// ============ TAGS ROUTES ============

// Get all tags
app.get('/api/tags', authMiddleware, (req, res) => {
  db.all('SELECT * FROM tags ORDER BY name', (err, tags) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(tags);
  });
});

// Create tag
app.post('/api/tags', authMiddleware, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Tag name required' });
  }

  db.run('INSERT INTO tags (name) VALUES (?)', [name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Tag already exists' });
      }
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ id: this.lastID, name });
  });
});

// Delete tag
app.delete('/api/tags/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM tags WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ success: true });
  });
});

// ============ NOTES ROUTES ============

// Get all notes for user
app.get('/api/notes', authMiddleware, (req, res) => {
  const { date } = req.query;

  let query = `
    SELECT n.*, GROUP_CONCAT(t.id || ':' || t.name) as tags
    FROM notes n
    LEFT JOIN note_tags nt ON n.id = nt.note_id
    LEFT JOIN tags t ON nt.tag_id = t.id
    WHERE n.user_id = ?
  `;
  const params = [req.userId];

  if (date) {
    query += ' AND n.date = ?';
    params.push(date);
  }

  query += ' GROUP BY n.id ORDER BY n.date DESC, n.updated_at DESC';

  db.all(query, params, (err, notes) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    const formattedNotes = notes.map(note => ({
      ...note,
      tags: note.tags ? note.tags.split(',').map(t => {
        const [id, name] = t.split(':');
        return { id: parseInt(id), name };
      }) : []
    }));

    res.json(formattedNotes);
  });
});

// Get single note
app.get('/api/notes/:id', authMiddleware, (req, res) => {
  db.get(
    `SELECT n.*, GROUP_CONCAT(t.id || ':' || t.name) as tags
     FROM notes n
     LEFT JOIN note_tags nt ON n.id = nt.note_id
     LEFT JOIN tags t ON nt.tag_id = t.id
     WHERE n.id = ? AND n.user_id = ?
     GROUP BY n.id`,
    [req.params.id, req.userId],
    (err, note) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }

      note.tags = note.tags ? note.tags.split(',').map(t => {
        const [id, name] = t.split(':');
        return { id: parseInt(id), name };
      }) : [];

      res.json(note);
    }
  );
});

// Create note
app.post('/api/notes', authMiddleware, (req, res) => {
  const { title, content, date, tags } = req.body;

  if (!title || !content || !date) {
    return res.status(400).json({ error: 'Title, content, and date required' });
  }

  db.run(
    'INSERT INTO notes (user_id, title, content, date) VALUES (?, ?, ?, ?)',
    [req.userId, title, content, date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const noteId = this.lastID;

      if (tags && tags.length > 0) {
        const stmt = db.prepare('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)');
        tags.forEach(tagId => {
          stmt.run(noteId, tagId);
        });
        stmt.finalize();
      }

      res.json({ id: noteId, title, content, date, tags: [] });
    }
  );
});

// Update note
app.put('/api/notes/:id', authMiddleware, (req, res) => {
  const { title, content, date, tags } = req.body;

  db.run(
    'UPDATE notes SET title = ?, content = ?, date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [title, content, date, req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      // Update tags
      db.run('DELETE FROM note_tags WHERE note_id = ?', [req.params.id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }

        if (tags && tags.length > 0) {
          const stmt = db.prepare('INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)');
          tags.forEach(tagId => {
            stmt.run(req.params.id, tagId);
          });
          stmt.finalize();
        }

        res.json({ success: true });
      });
    }
  );
});

// Delete note
app.delete('/api/notes/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ success: true });
  });
});

// ============ TODOS ROUTES ============

// Get all todos for user
app.get('/api/todos', authMiddleware, (req, res) => {
  const { includeCompleted, notInCalendar } = req.query;

  let query = `
    SELECT t.*, n.title as note_title, GROUP_CONCAT(tg.id || ':' || tg.name) as tags
    FROM todos t
    LEFT JOIN notes n ON t.note_id = n.id
    LEFT JOIN todo_tags tt ON t.id = tt.todo_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.user_id = ?
  `;

  if (includeCompleted === 'false') {
    query += ' AND t.completed = 0';
  }

  if (notInCalendar === 'true') {
    query += ' AND t.in_calendar = 0';
  }

  query += ` GROUP BY t.id
    ORDER BY
      CASE WHEN t.due_date IS NULL THEN 0 ELSE 1 END,
      t.due_date ASC`;

  db.all(query, [req.userId], (err, todos) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }

    const formattedTodos = todos.map(todo => ({
      ...todo,
      completed: Boolean(todo.completed),
      in_calendar: Boolean(todo.in_calendar),
      tags: todo.tags ? todo.tags.split(',').map(t => {
        const [id, name] = t.split(':');
        return { id: parseInt(id), name };
      }) : []
    }));

    res.json(formattedTodos);
  });
});

// Get todos for specific note
app.get('/api/notes/:noteId/todos', authMiddleware, (req, res) => {
  db.all(
    `SELECT t.*, GROUP_CONCAT(tg.id || ':' || tg.name) as tags
     FROM todos t
     LEFT JOIN todo_tags tt ON t.id = tt.todo_id
     LEFT JOIN tags tg ON tt.tag_id = tg.id
     WHERE t.note_id = ? AND t.user_id = ?
     GROUP BY t.id
     ORDER BY t.created_at`,
    [req.params.noteId, req.userId],
    (err, todos) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const formattedTodos = todos.map(todo => ({
        ...todo,
        completed: Boolean(todo.completed),
        in_calendar: Boolean(todo.in_calendar),
        tags: todo.tags ? todo.tags.split(',').map(t => {
          const [id, name] = t.split(':');
          return { id: parseInt(id), name };
        }) : []
      }));

      res.json(formattedTodos);
    }
  );
});

// Create todo
app.post('/api/todos', authMiddleware, (req, res) => {
  const { note_id, text, due_date, tags } = req.body;

  if (!note_id || !text) {
    return res.status(400).json({ error: 'Note ID and text required' });
  }

  db.run(
    'INSERT INTO todos (note_id, user_id, text, due_date) VALUES (?, ?, ?, ?)',
    [note_id, req.userId, text, due_date || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      const todoId = this.lastID;

      if (tags && tags.length > 0) {
        const stmt = db.prepare('INSERT INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
        tags.forEach(tagId => {
          stmt.run(todoId, tagId);
        });
        stmt.finalize();
      }

      res.json({ id: todoId, note_id, text, completed: false, in_calendar: false, due_date, tags: [] });
    }
  );
});

// Update todo
app.put('/api/todos/:id', authMiddleware, (req, res) => {
  const { text, completed, in_calendar, due_date, tags } = req.body;

  db.run(
    'UPDATE todos SET text = ?, completed = ?, in_calendar = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [text, completed ? 1 : 0, in_calendar ? 1 : 0, due_date || null, req.params.id, req.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      // Update tags
      db.run('DELETE FROM todo_tags WHERE todo_id = ?', [req.params.id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }

        if (tags && tags.length > 0) {
          const stmt = db.prepare('INSERT INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
          tags.forEach(tagId => {
            stmt.run(req.params.id, tagId);
          });
          stmt.finalize();
        }

        res.json({ success: true });
      });
    }
  );
});

// Delete todo
app.delete('/api/todos/:id', authMiddleware, (req, res) => {
  db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ success: true });
  });
});

// ============ TAG FILTERING ROUTES ============

// Get notes and todos by tag
app.get('/api/tags/:tagId/items', authMiddleware, (req, res) => {
  const { tagId } = req.params;

  // Get notes with this tag
  db.all(
    `SELECT n.*, 'note' as type, GROUP_CONCAT(t.id || ':' || t.name) as tags
     FROM notes n
     INNER JOIN note_tags nt ON n.id = nt.note_id
     LEFT JOIN note_tags nt2 ON n.id = nt2.note_id
     LEFT JOIN tags t ON nt2.tag_id = t.id
     WHERE nt.tag_id = ? AND n.user_id = ?
     GROUP BY n.id
     ORDER BY n.date DESC`,
    [tagId, req.userId],
    (err, notes) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      // Get todos with this tag
      db.all(
        `SELECT td.*, 'todo' as type, n.title as note_title, GROUP_CONCAT(t.id || ':' || t.name) as tags
         FROM todos td
         INNER JOIN todo_tags tt ON td.id = tt.todo_id
         LEFT JOIN notes n ON td.note_id = n.id
         LEFT JOIN todo_tags tt2 ON td.id = tt2.todo_id
         LEFT JOIN tags t ON tt2.tag_id = t.id
         WHERE tt.tag_id = ? AND td.user_id = ?
         GROUP BY td.id
         ORDER BY
           CASE WHEN td.due_date IS NULL THEN 0 ELSE 1 END,
           td.due_date ASC`,
        [tagId, req.userId],
        (err, todos) => {
          if (err) {
            return res.status(500).json({ error: 'Server error' });
          }

          const formattedNotes = notes.map(note => ({
            ...note,
            tags: note.tags ? note.tags.split(',').map(t => {
              const [id, name] = t.split(':');
              return { id: parseInt(id), name };
            }) : []
          }));

          const formattedTodos = todos.map(todo => ({
            ...todo,
            completed: Boolean(todo.completed),
            in_calendar: Boolean(todo.in_calendar),
            tags: todo.tags ? todo.tags.split(',').map(t => {
              const [id, name] = t.split(':');
              return { id: parseInt(id), name };
            }) : []
          }));

          res.json({ notes: formattedNotes, todos: formattedTodos });
        }
      );
    }
  );
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const clientPath = path.join(__dirname, '../client/dist');

  console.log('Serving static files from:', clientPath);
  app.use(express.static(clientPath));

  // Handle React routing - catch all non-API routes
  app.get(/^\/(?!api).*/, (req, res) => {
    const indexPath = path.join(clientPath, 'index.html');
    console.log('Serving index.html for route:', req.path);
    res.sendFile(indexPath);
  });
}

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});
