// The default certificate design, so certifying works before the admin has
// designed their own. It is only created when no template exists: templates
// are the admin's work and are never overwritten by a reseed.
export default {
  name: 'الشهادة الافتراضية',
  language: 'ar',
  width: 2000,
  height: 1414,
  backgroundColor: '#FFFFFF',
  backgroundImage: '',
  frameColor: '#1E3A5F',
  isDefault: true,
  programs: [],
  courses: [],
  elements: [
    { text: 'شهادة إتمام', x: 50, y: 17, fontSize: 110, color: '#1E3A5F', bold: true, align: 'middle', font: 'Cairo' },
    { text: 'تشهد إدارة برنامج SIYB بأن', x: 50, y: 33, fontSize: 44, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
    { text: '{{name}}', x: 50, y: 45, fontSize: 96, color: '#10151F', bold: true, align: 'middle', font: 'Cairo' },
    { text: 'قد أتمّ بنجاح متطلبات', x: 50, y: 56, fontSize: 44, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
    { text: '{{program}}', x: 50, y: 66, fontSize: 64, color: '#1E2DBE', bold: true, align: 'middle', font: 'Cairo' },
    { text: 'رقم الشهادة: {{number}}', x: 24, y: 86, fontSize: 32, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
    { text: 'التاريخ: {{date}}', x: 76, y: 86, fontSize: 32, color: '#4A5568', bold: false, align: 'middle', font: 'Cairo' },
  ],
};
