import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Program, Category, Course, TeamMember, Story, Forum, Product, Setting, User } from '../src/models/index.js';

import programs from './data/programs.js';
import categories from './data/categories.js';
import team from './data/team.js';
import stories from './data/stories.js';
import forums from './data/forums.js';
import products from './data/products.js';
import settings from './data/settings.js';
import courses from './data/courses.js';

// Only content collections are reseeded here. User-generated / transactional
// collections (User, Certificate, CertificateRequest, Order, ProposalRequest,
// Enquiry, ExamAttempt, ForumRegistration, Media, Exam) are untouched.
const collections = [
  { name: 'Program', model: Program, data: programs },
  { name: 'Category', model: Category, data: categories },
  { name: 'TeamMember', model: TeamMember, data: team },
  { name: 'Story', model: Story, data: stories },
  { name: 'Forum', model: Forum, data: forums },
  { name: 'Product', model: Product, data: products },
  { name: 'Setting', model: Setting, data: settings },
];

async function seed() {
  await connectDB();

  const summary = [];

  for (const { name, model, data } of collections) {
    await model.deleteMany({});
    let insertedCount = 0;
    if (Array.isArray(data) && data.length > 0) {
      const inserted = await model.insertMany(data);
      insertedCount = inserted.length;
    }
    summary.push({ collection: name, count: insertedCount });
  }

  // Courses reference categories by slug in the seed data, so they are written
  // after the loop, once the real category ids exist.
  await Course.deleteMany({});
  const catIds = new Map((await Category.find().select('slug')).map((c) => [c.slug, c._id]));
  const courseDocs = courses.map(({ category, ...rest }) => {
    const id = catIds.get(category);
    if (!id) throw new Error(`Course "${rest.slug}" references unknown category "${category}"`);
    return { ...rest, category: id };
  });
  const insertedCourses = await Course.insertMany(courseDocs);
  summary.push({ collection: 'Course', count: insertedCourses.length });

  console.log('\nSeed summary:');
  for (const row of summary) {
    console.log(`  ${row.collection}: ${row.count}`);
  }
  console.log('');

  await ensureAdminUser();
}

async function ensureAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Skipping admin bootstrap (set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one).');
    return;
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin user ${email} already exists, leaving untouched.`);
    return;
  }
  const user = new User({ name: 'Admin', email: email.toLowerCase(), role: 'admin', locale: 'ar' });
  await user.setPassword(password);
  await user.save();
  console.log(`Created admin user: ${email}`);
}

seed()
  .then(async () => {
    await mongoose.connection.close();
    console.log('Seeding complete. Connection closed.');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Seeding failed:', err);
    try {
      await mongoose.connection.close();
    } catch {
      // ignore close errors during failure path
    }
    process.exit(1);
  });
