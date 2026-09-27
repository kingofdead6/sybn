/**
 * Checks answers to an admin-built form against the fields it declares, and
 * returns only those answers, as strings, ready to store.
 *
 * Only declared fields are kept, so a client cannot inflate a record with
 * keys of its own. Throws an error with `status: 400` and a message naming
 * the field when a required answer is missing or a value is not valid for
 * its field's type.
 */
export function cleanFormAnswers(fields = [], answers = {}) {
  const clean = {};
  for (const field of fields) {
    const raw = answers?.[field.name];
    const value = raw === undefined || raw === null || raw === false ? '' : String(raw).trim();
    const label = field.label?.en || field.label?.ar || field.name;
    const invalid = (why) => Object.assign(new Error(`${label}: ${why}`), { status: 400, field: field.name });

    if (!value) {
      if (field.required) throw invalid('this field is required');
      continue;
    }

    switch (field.type) {
      case 'checkbox':
        clean[field.name] = 'true';
        continue;
      case 'select':
      case 'radio':
        if (!field.options.some((o) => o.value === value)) throw invalid('choose one of the options');
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw invalid('enter a valid email address');
        break;
      case 'number':
        if (!Number.isFinite(Number(value))) throw invalid('enter a number');
        break;
      case 'date':
        if (Number.isNaN(Date.parse(value))) throw invalid('enter a valid date');
        break;
      default:
        break;
    }
    clean[field.name] = value.slice(0, 2000);
  }
  return clean;
}
