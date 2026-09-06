import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import Rule from '../components/ui/Rule';
import Pill from '../components/ui/Pill';
import Accordion, { AccordionItem } from '../components/ui/Accordion';
import Modal from '../components/ui/Modal';
import Table, { Tr, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import LangToggle from '../components/ui/LangToggle';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Styleguide() {
  const { i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const isAr = i18n.language === 'ar';

  return (
    <Section>
      <h1 className="font-display text-3xl text-ink mb-2">Styleguide</h1>
      <p className="text-body mb-8">{isAr ? 'دليل مكونات الواجهة' : 'Base UI component reference'}</p>

      <div className="flex gap-3 mb-9">
        <LangToggle />
        <ThemeToggle />
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Buttons</h2>
      <div className="flex flex-wrap gap-3 mb-9">
        <Button variant="primary">{isAr ? 'أساسي' : 'Primary'}</Button>
        <Button variant="secondary">{isAr ? 'ثانوي' : 'Secondary'}</Button>
        <Button variant="ghost">{isAr ? 'شفاف' : 'Ghost'}</Button>
        <Button variant="danger">{isAr ? 'خطر' : 'Danger'}</Button>
        <Button disabled>{isAr ? 'معطل' : 'Disabled'}</Button>
      </div>

      <Rule className="mb-9" />

      <h2 className="font-display text-xl text-ink mb-4">Form controls</h2>
      <div className="grid gap-4 md:grid-cols-2 mb-9 max-w-2xl">
        <Input label={isAr ? 'الإسم الكامل' : 'Full name'} placeholder={isAr ? 'محمد أحمد' : 'John Doe'} />
        <Input label={isAr ? 'بريد إلكتروني' : 'Email'} error={isAr ? 'حقل إلزامي' : 'Required field'} />
        <Select label={isAr ? 'بلد الإقامة' : 'Country'}>
          <option>{isAr ? 'الجزائر' : 'Algeria'}</option>
          <option>{isAr ? 'تونس' : 'Tunisia'}</option>
        </Select>
      </div>

      <Rule className="mb-9" />

      <h2 className="font-display text-xl text-ink mb-4">Cards & Pills</h2>
      <div className="grid gap-4 md:grid-cols-3 mb-9">
        <Card>
          <Pill tone="saffron">{isAr ? 'جديد' : 'New'}</Pill>
          <p className="mt-3 text-ink font-medium">{isAr ? 'عنوان البطاقة' : 'Card title'}</p>
          <p className="text-sm text-sage mt-1">{isAr ? 'نص وصفي قصير' : 'Short descriptive text'}</p>
        </Card>
        <Card>
          <Pill tone="success">{isAr ? 'صالحة' : 'Valid'}</Pill>
        </Card>
        <Card>
          <Pill tone="clay">{isAr ? 'ممتلئ' : 'Full'}</Pill>
        </Card>
      </div>

      <Rule className="mb-9" />

      <h2 className="font-display text-xl text-ink mb-4">Accordion</h2>
      <Accordion>
        <AccordionItem title={isAr ? 'سؤال أول' : 'First question'} defaultOpen>
          {isAr ? 'إجابة تجريبية للسؤال الأول.' : 'A sample answer to the first question.'}
        </AccordionItem>
        <AccordionItem title={isAr ? 'سؤال ثانٍ' : 'Second question'}>
          {isAr ? 'إجابة تجريبية للسؤال الثاني.' : 'A sample answer to the second question.'}
        </AccordionItem>
      </Accordion>

      <Rule className="my-9" />

      <h2 className="font-display text-xl text-ink mb-4">Modal</h2>
      <Button onClick={() => setModalOpen(true)}>{isAr ? 'فتح النافذة' : 'Open modal'}</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={isAr ? 'عنوان النافذة' : 'Modal title'}>
        <p className="text-body">{isAr ? 'محتوى تجريبي داخل النافذة.' : 'Sample content inside the modal.'}</p>
      </Modal>

      <Rule className="my-9" />

      <h2 className="font-display text-xl text-ink mb-4">Table & Pagination</h2>
      <Table columns={[{ key: 'a', label: isAr ? 'الإسم' : 'Name' }, { key: 'b', label: isAr ? 'الحالة' : 'Status' }]}>
        <Tr>
          <Td>{isAr ? 'مثال ١' : 'Example 1'}</Td>
          <Td>
            <Pill tone="success">{isAr ? 'صالحة' : 'Valid'}</Pill>
          </Td>
        </Tr>
        <Tr>
          <Td>{isAr ? 'مثال ٢' : 'Example 2'}</Td>
          <Td>
            <Pill tone="clay">{isAr ? 'ملغاة' : 'Revoked'}</Pill>
          </Td>
        </Tr>
      </Table>
      <Pagination page={page} limit={10} total={45} onPageChange={setPage} />
    </Section>
  );
}
