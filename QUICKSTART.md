# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install Node.js
If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/) (v16 or higher)

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

### 4. Access the App

Open your browser and go to: **http://localhost:3000**

### 5. Create Your Account

1. Click **Register**
2. Choose a username and password
3. Click **Register** button
4. You're logged in automatically

## Using the App

### Create Your First Note

1. Click **+ New Note** button
2. Enter a title (e.g., "My First Note")
3. Type some content in the editor
4. Click **Save**

### Create a To-Do from Text

1. Open a note you just created
2. Select some text in the note
3. Right-click the selected text
4. Choose "Create Todo from..."
5. The to-do appears below the note

### Add Tags

1. When editing a note, click **+ Add Tag**
2. Select existing tags or create a new one
3. Tags help organize your notes and todos

### View All To-Dos

1. Click **Todos** in the navigation
2. See all your to-dos from all notes
3. Use filters to:
   - Hide/show completed items
   - Show only items not in calendar

### Filter by Date

1. On the **Notes** page, use the date picker
2. See only notes from that specific date

### Explore Tags

1. Click **Tags** in navigation
2. Click on any tag to see all notes and todos with that tag

## Important Features

- **Due Dates**: Edit a to-do and add a due date
- **In Calendar**: Check this box when you've scheduled time for a to-do
- **Completion**: Check the checkbox to mark a to-do complete
- **Rich Text**: Use the toolbar to format your notes (bold, italic, lists, etc.)

## Tips

- To-dos are sorted with items having no due date first, then by earliest due date
- You must save a note before you can create to-dos in it
- Tags are shared across all notes and to-dos
- Use the date selector to organize notes by day

## Need Help?

See the full **README.md** for:
- Deployment instructions
- Troubleshooting
- Security notes
- Advanced configuration

Enjoy using NoteTaker!
