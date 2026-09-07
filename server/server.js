// Load environment variables before anything else is imported. ES module
// imports are hoisted and evaluated before statements in this file, so a
// plain `dotenv.config()` call here would run *after* modules like the
// Cloudinary config have already read process.env and captured undefined.
import 'dotenv/config';

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
