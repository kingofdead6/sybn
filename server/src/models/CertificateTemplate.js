import mongoose from 'mongoose';

/**
 * One line of text on a certificate. Positions are percentages of the page so
 * a template keeps its layout if its size changes; the font size is in pixels
 * at the template's own width.
 *
 * `text` may carry placeholders — {{name}}, {{email}}, {{program}}, {{number}},
 * {{date}}, {{country}} — filled from the certificate request when issued.
 */
const elementSchema = new mongoose.Schema(
  {
    text: { type: String, default: '' },
    x: { type: Number, default: 50, min: 0, max: 100 },
    y: { type: Number, default: 50, min: 0, max: 100 },
    fontSize: { type: Number, default: 48, min: 8, max: 400 },
    color: { type: String, default: '#10151F' },
    bold: { type: Boolean, default: false },
    align: { type: String, enum: ['start', 'middle', 'end'], default: 'middle' },
    font: { type: String, enum: ['Cairo', 'Inter'], default: 'Cairo' },
  },
  { _id: false }
);

/**
 * A certificate design the admin builds in the panel. When a request is
 * certified, the template for its program or course (or the default one) is
 * rendered with the requester's details and emailed as an image.
 */
const certificateTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // The language {{program}} and {{date}} are written in.
    language: { type: String, enum: ['ar', 'en'], default: 'ar' },
    width: { type: Number, default: 2000, min: 400, max: 4000 },
    height: { type: Number, default: 1414, min: 400, max: 4000 },
    backgroundColor: { type: String, default: '#FFFFFF' },
    // An uploaded design (from Canva, Illustrator…) the text is laid over.
    backgroundImage: { type: String, default: '' },
    // An optional drawn frame, for templates without a background design.
    frameColor: { type: String, default: '' },
    elements: { type: [elementSchema], default: () => [] },
    // Which programs and courses this design is for. A request whose subject
    // is in neither list uses the default template.
    programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('CertificateTemplate', certificateTemplateSchema);
