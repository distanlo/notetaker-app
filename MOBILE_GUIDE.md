# Mobile Usage Guide

## Mobile Browser Compatibility

The NoteTaker app is now fully responsive and works great on mobile devices. It has been optimized for:

- **iOS**: Safari, Chrome
- **Android**: Chrome, Firefox, Samsung Internet

## Mobile-Specific Features

### Responsive Design
- All pages adapt to smaller screens
- Navigation menu wraps on mobile
- Touch-friendly buttons and inputs (larger tap targets)
- Optimized font sizes (prevents zoom on iOS)
- Horizontal scrolling prevented

### Creating To-Dos from Text on Mobile

Since right-click (context menu) works differently on mobile, here are the best ways to create to-dos from text:

**Method 1: Long Press (Recommended)**
1. Open or create a note
2. **Long-press** on the text you want to convert to a to-do
3. A context menu will appear
4. Tap "Create Todo from..."

**Method 2: Manual Entry**
1. Save your note first
2. Scroll down to the "To-Do Items" section
3. Look at your note content above
4. Manually create a new to-do with the text you want

**Note:** The app must be saved before you can create to-dos in it.

## Mobile Tips

### Navigation
- The navigation menu will wrap to two lines on smaller screens
- All navigation links remain accessible and touch-friendly

### Notes Page
- Date picker works natively with your phone's date selector
- Note cards stack vertically for easy scrolling
- Edit/Delete buttons are full-width and easy to tap

### Editing Notes
- The rich text editor (Quill) works on mobile with touch gestures
- Toolbar buttons are touch-friendly
- Use your phone's keyboard for typing
- Title and date inputs prevent auto-zoom (16px font size)

### To-Do Management
- Checkboxes are larger on mobile (20px) for easier tapping
- Edit mode shows full-width buttons
- Due date picker uses native mobile date selector
- "In Calendar" checkbox is touch-friendly

### Tags
- Tag selector dropdown works with touch
- Tags display as chips that wrap to multiple lines
- Create new tags inline while editing

### Filters
- All filter checkboxes on the Todos page are larger on mobile
- Filters stack vertically for easy access

## Screen Sizes Optimized

- **Small phones** (< 375px): Basic functionality, vertical layout
- **Standard phones** (375px - 768px): Full responsive design
- **Tablets** (768px+): Desktop-like experience
- **Desktop** (1200px+): Full-width layout

## Known Mobile Limitations

### Rich Text Editor
- The Quill rich text editor works on mobile but the toolbar can be small
- Some formatting options may require precise tapping
- Consider using simple formatting on mobile (bold, lists)

### Context Menu
- Right-click doesn't exist on mobile
- Use **long-press** instead to trigger the context menu
- Some mobile browsers may have different long-press behaviors

### Date Pickers
- Date pickers use your phone's native selector
- Format may vary by device (iOS vs Android)

## Performance on Mobile

The app is optimized for mobile performance:
- Lightweight CSS with no heavy animations
- Efficient React rendering
- Small bundle size
- Works well on 3G/4G connections
- Database operations happen on the server

## Offline Support

**Note:** This app requires an internet connection to work because:
- It connects to your server for all data
- Authentication happens via the server
- There is no offline mode currently

To use the app on mobile:
1. Make sure you have an internet connection
2. Your phone can reach your server (localhost won't work unless you're on the same network)
3. For best results, deploy to a public server (see README.md)

## Accessing Your App on Mobile

### Option 1: Local Network (Development)
If running locally (npm run dev):
1. Find your computer's IP address (e.g., 192.168.1.5)
2. Make sure your phone is on the same WiFi network
3. Open `http://YOUR_IP:3000` in your phone's browser
4. Update `client/src/api.js` baseURL to use your IP instead of localhost

### Option 2: Deploy to Public Server (Recommended)
Deploy your app to a web hosting service:
1. Follow deployment instructions in README.md
2. Access your app from anywhere via your domain
3. Works on any mobile device with internet
4. Can add to home screen for app-like experience

## Add to Home Screen

Make NoteTaker feel like a native app:

**iOS (Safari):**
1. Open your app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "NoteTaker" and tap "Add"

**Android (Chrome):**
1. Open your app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home screen"
4. Name it "NoteTaker" and tap "Add"

Now you have an icon on your home screen!

## Mobile Browser Recommendations

**Best Experience:**
- iOS: Safari (best integration with iOS)
- Android: Chrome (best web standards support)

**Also Works:**
- Firefox Mobile (iOS & Android)
- Samsung Internet (Android)
- Edge Mobile (iOS & Android)

## Troubleshooting Mobile Issues

### Text is Too Small
- This shouldn't happen with the optimizations
- Try zooming in/out and refreshing
- Check that viewport meta tag is present

### Buttons Not Working
- Make sure JavaScript is enabled
- Try clearing browser cache
- Check internet connection

### Context Menu Not Appearing
- Make sure you **long-press** (not just tap)
- Hold for about 1 second on the selected text
- If it still doesn't work, use manual to-do entry method

### Keyboard Covers Input Fields
- This is normal mobile behavior
- The page should scroll automatically
- If not, manually scroll up after keyboard appears

### Can't Connect to Server
- Make sure your server is running
- Check that you're using the correct URL
- Verify your phone has internet access
- If using local IP, make sure phone is on same WiFi network

## Best Practices for Mobile

1. **Save frequently** - Mobile browsers can lose state if you switch apps
2. **Use simple formatting** - Bold and lists work better than complex formatting on mobile
3. **Keep note titles short** - They display better on small screens
4. **One task at a time** - Complete editing before moving to another note
5. **Use tags liberally** - Easier to filter on mobile than searching

## Security on Mobile

- Always use HTTPS when deployed (not HTTP)
- Don't save your password in public browsers
- Log out when using shared devices
- Consider using a password manager for your login

## Data Usage

The app is lightweight:
- Initial load: ~500KB - 1MB
- Per note: A few KB
- Images: Not supported (keeps data usage low)
- Works well on mobile data plans

## Future Mobile Enhancements

Potential improvements for mobile (not yet implemented):
- Offline mode with service workers
- Native app version (React Native)
- Voice input for notes
- Camera for note attachments
- Swipe gestures for navigation
- Push notifications for due dates

---

Enjoy using NoteTaker on your mobile device! For issues or questions, see the main README.md file.
