# NoteTaker App

A full-stack note-taking and to-do management application with rich text editing, tagging, and date-based organization.

📱 **Mobile-Friendly!** Fully responsive design works great on phones and tablets. See [MOBILE_GUIDE.md](MOBILE_GUIDE.md) for details.

## Features

- **Notes Management**: Create, edit, and delete notes with rich text formatting
- **To-Do Lists**: Create to-do items from selected text in notes
- **Tagging System**: Central tag management that can be applied to both notes and todos
- **Date Organization**: View notes by date
- **To-Do Management**:
  - Mark items as complete
  - Set due dates
  - Track calendar scheduling with "In Calendar" checkbox
  - Filter by completion status and calendar assignment
- **Authentication**: Single-user login system for privacy
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with Vite, React Router, React Quill (rich text editor)
- **Backend**: Node.js with Express
- **Database**: SQLite3
- **Authentication**: JWT with bcrypt password hashing

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or download the repository**

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Edit `server/.env` and update the JWT secret:
   ```
   JWT_SECRET=your-secure-random-secret-key-here
   PORT=3001
   NODE_ENV=production
   ```

## Running Locally

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:3000

3. **Access the application**

   Open http://localhost:3000 in your browser

### First Time Setup

1. Register a new user account (only one user is supported)
2. Login with your credentials
3. Start creating notes and todos

## Deployment to Web Hosting

### Option 1: Deploy to VPS (DigitalOcean, Linode, etc.)

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Configure server to serve static files**

   Add this to `server/server.js` before the routes:
   ```javascript
   const path = require('path');

   // Serve static files from React app
   app.use(express.static(path.join(__dirname, '../client/dist')));

   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
   });
   ```

3. **Upload to server**
   ```bash
   scp -r notetaker-app user@your-server.com:/var/www/
   ```

4. **Install dependencies on server**
   ```bash
   ssh user@your-server.com
   cd /var/www/notetaker-app/server
   npm install --production
   ```

5. **Set up process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name notetaker
   pm2 startup
   pm2 save
   ```

6. **Configure Nginx as reverse proxy**

   Create `/etc/nginx/sites-available/notetaker`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/notetaker /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up SSL with Let's Encrypt (optional but recommended)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 2: Deploy to Heroku

1. **Install Heroku CLI**

2. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Add a Procfile** in the root directory:
   ```
   web: cd server && node server.js
   ```

4. **Update server.js** to serve static files (same as Option 1, step 2)

5. **Build the frontend locally**
   ```bash
   cd client
   npm run build
   ```

6. **Deploy to Heroku**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

7. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secure-secret-key
   heroku config:set NODE_ENV=production
   ```

### Option 3: Deploy to Railway

1. **Connect your repository** to Railway
2. **Configure build settings**:
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && node server.js`
3. **Set environment variables** in Railway dashboard
4. **Deploy**

## Usage

### Creating Notes

1. Navigate to the **Notes** page
2. Select a date
3. Click **+ New Note**
4. Enter a title and content (supports rich text formatting)
5. Add tags if desired
6. Click **Save**

### Creating To-Do Items

1. Open or create a note
2. Select text in the note that you want to turn into a to-do
3. Right-click the selected text
4. Choose "Create Todo from..."
5. The to-do item is created and appears below the note

### Managing To-Dos

- **Complete**: Check the checkbox next to the to-do
- **Due Date**: Edit the to-do to add a due date
- **In Calendar**: Check "In Calendar" when you've scheduled time for this task
- **Tags**: Assign tags to organize your to-dos
- **View All**: Go to **Todos** page to see all to-dos across all notes

### Filtering To-Dos

On the **Todos** page:
- Toggle "Show Completed" to include/exclude completed items
- Toggle "Only Not in Calendar" to filter for unscheduled tasks

### Using Tags

1. Go to **Tags** page to view all tags
2. Click **+ New Tag** to create a tag
3. Click on a tag to see all notes and todos with that tag
4. Tags can be deleted (removes from all notes and todos)

## Security Notes

- Change the JWT_SECRET in production
- The database file (`notetaker.db`) contains all your data - back it up regularly
- This is designed for single-user use only
- Use HTTPS in production to protect credentials

## Troubleshooting

### Port Already in Use

If port 3001 or 3000 is already in use, change the ports in:
- `server/.env` (PORT variable)
- `client/vite.config.js` (server.port)

### Database Issues

If you need to reset the database:
```bash
cd server
rm notetaker.db
node server.js
```
This will recreate the database with a fresh schema.

### Build Errors

Make sure all dependencies are installed:
```bash
cd server && npm install
cd ../client && npm install
```

## License

MIT
