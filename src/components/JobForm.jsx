import { useState } from 'react';

export default function JobForm({ onAdd }) {
  const [form, setForm] = useState({
    company: '',
    title: '',
    link: '',
    status: 'Applied',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { company, title, link, status, date } = form;
    onAdd(company, title, link, status, date);
    setForm({ company: '', title: '', link: '', status: 'Applied', date: new Date().toISOString().slice(0, 10) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
      <input name="company" value={form.company} onChange={handleChange} placeholder="Company" required className="border p-2 w-full" />
      <input name="title" value={form.title} onChange={handleChange} placeholder="Job Title" required className="border p-2 w-full" />
      <input name="link" value={form.link} onChange={handleChange} placeholder="Job Link" className="border p-2 w-full" />
      <select name="status" value={form.status} onChange={handleChange} className="bg-black text-white">
        <option>Applied</option>
        <option>Interviewing</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}