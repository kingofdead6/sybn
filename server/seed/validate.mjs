// Validates every seed document against its Mongoose schema without needing a
// live database: required fields, enums, types, slug uniqueness, and the
// course -> category slug resolution that seed/index.js performs at write time.
import mongoose from 'mongoose';
import { Program, Category, Course, TeamMember, Story, Forum, Product, Setting } from '../src/models/index.js';

import programs from './data/programs.js';
import categories from './data/categories.js';
import team from './data/team.js';
import stories from './data/stories.js';
import forums from './data/forums.js';
import products from './data/products.js';
import settings from './data/settings.js';
import courses from './data/courses.js';

let failures = 0;

function check(name, model, docs, transform = (d) => d) {
  const slugs = new Set();
  for (const [i, raw] of docs.entries()) {
    const doc = transform(raw);
    const err = new model(doc).validateSync();
    if (err) {
      failures += 1;
      console.error(`  ✗ ${name}[${i}] ${doc.slug || doc.key || ''}: ${Object.keys(err.errors).join(', ')}`);
      for (const [k, e] of Object.entries(err.errors)) console.error(`      ${k}: ${e.message}`);
    }
    if (doc.slug) {
      if (slugs.has(doc.slug)) {
        failures += 1;
        console.error(`  ✗ ${name}: duplicate slug "${doc.slug}"`);
      }
      slugs.add(doc.slug);
    }
  }
  console.log(`  ${name}: ${docs.length} documents`);
}

console.log('\nValidating seed data against the models:\n');

check('Program', Program, programs);
check('Category', Category, categories);
check('TeamMember', TeamMember, team);
check('Story', Story, stories);
check('Forum', Forum, forums);
check('Product', Product, products);
check('Setting', Setting, settings);

// Courses carry a category *slug*; seed/index.js swaps it for the real id.
// Reproduce that here so an unknown slug fails now rather than mid-seed.
const catIds = new Map(categories.map((c) => [c.slug, new mongoose.Types.ObjectId()]));
for (const c of courses) {
  if (!catIds.has(c.category)) {
    failures += 1;
    console.error(`  ✗ Course "${c.slug}" references unknown category "${c.category}"`);
  }
}
check('Course', Course, courses, ({ category, ...rest }) => ({ ...rest, category: catIds.get(category) }));

// Every category should actually have courses, or its page renders empty.
const perCategory = new Map(categories.map((c) => [c.slug, 0]));
for (const c of courses) perCategory.set(c.category, (perCategory.get(c.category) || 0) + 1);
for (const [slug, n] of perCategory) {
  if (n === 0) {
    failures += 1;
    console.error(`  ✗ Category "${slug}" has no courses — its page would be empty`);
  }
}

// Products reference the store's category keys.
const storeKeys = new Set(
  (settings.find((s) => s.key === 'store.content')?.value.categories || []).map((c) => c.key)
);
for (const p of products) {
  if (!storeKeys.has(p.category)) {
    failures += 1;
    console.error(`  ✗ Product "${p.slug}" has category "${p.category}", not a store.content key`);
  }
}

// Setting keys must be unique and cover what the client asks for.
const keys = settings.map((s) => s.key);
const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupKeys.length) {
  failures += 1;
  console.error(`  ✗ Duplicate setting keys: ${dupKeys.join(', ')}`);
}

console.log(
  failures === 0
    ? '\nAll seed documents valid.\n'
    : `\n${failures} problem(s) found.\n`
);
process.exit(failures === 0 ? 0 : 1);
