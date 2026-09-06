// Success stories seed data — section 7.11
// No per-row category is given, so all default to 'entrepreneurs' as instructed.

const countryNames = {
  'الجزائر': 'Algeria',
  'تونس': 'Tunisia',
  'اندونيسيا': 'Indonesia',
  'الصحراء الغربية': 'Western Sahara',
  'هايتي': 'Haiti',
  'موريتانيا': 'Mauritania',
};

const rows = [
  { country: 'الجزائر', videoUrl: 'https://www.youtube.com/watch?v=NLWX9ZM-PbM' },
  { country: 'تونس', videoUrl: 'https://www.youtube.com/watch?v=2D86buWdqUA' },
  { country: 'تونس', videoUrl: 'https://www.youtube.com/watch?v=H3Dq1oMUrB4' },
  { country: 'تونس', videoUrl: 'https://www.youtube.com/watch?v=31Obu8gAt6I' },
  { country: 'اندونيسيا', videoUrl: 'https://www.youtube.com/watch?v=sjiqXUtIZV4' },
  { country: 'تونس', videoUrl: 'https://www.youtube.com/watch?v=2a_s5CEnJKw' },
  { country: 'الصحراء الغربية', videoUrl: 'https://www.youtube.com/watch?v=Liou_MUEKJc' },
  { country: 'الصحراء الغربية', videoUrl: 'https://www.youtube.com/watch?v=TW2JiqvOSW4' },
  { country: 'هايتي', videoUrl: 'https://www.youtube.com/watch?v=6FmiiSa1hCY' },
  { country: 'الجزائر', videoUrl: 'https://www.youtube.com/watch?v=Rw3NxmlGTVo' },
  { country: 'موريتانيا', videoUrl: 'https://www.youtube.com/watch?v=OSjKUzXuR2s' },
  { country: 'الصحراء الغربية', videoUrl: 'https://www.youtube.com/watch?v=REpilpF6Xy4' },
];

const stories = rows.map((row, i) => {
  const n = i + 1;
  const en = countryNames[row.country];
  return {
    slug: `story-${String(n).padStart(2, '0')}`,
    country: row.country,
    videoUrl: row.videoUrl,
    category: 'entrepreneurs',
    order: n,
    title: {
      ar: `قصة نجاح رائد أعمال من ${row.country}`,
      en: `Success story of an entrepreneur from ${en}`,
    },
    excerpt: {
      ar: `شاهد كيف حوّل هذا الرائد تدريبه ضمن برنامج SIYB إلى مشروع ناجح في ${row.country} .`,
      en: `See how this entrepreneur turned their SIYB training into a successful business in ${en}.`,
    },
  };
});

export default stories;
