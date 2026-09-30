import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../context/AuthContext';
import { z } from 'zod';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  subtitle: z.string().min(1, 'Subtitle is compulsory'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['DRAFT', 'PUBLISH']),
  eventType: z.enum(['PUBLIC', 'PRIVATE']),
  locationType: z.enum(['OFFLINE', 'ONLINE', 'HYBRID']),
  location: z.string().min(1, 'Location is required'),
  locationUrl: z.string().min(1, 'Location URL is required'),
  lumaUrl: z.string().optional(),
  teamType: z.enum(['INDIVIDUAL', 'TEAM', 'BOTH']),
  minTeamSize: z.coerce.number().min(1),
  maxTeamSize: z.coerce.number().min(1),
  isFeatured: z.boolean(),
  timelines: z.array(z.object({ title: z.string(), description: z.string(), startDate: z.string(), endDate: z.string() })).optional(),
  prizes: z.array(z.object({ title: z.string(), description: z.string(), amount: z.string() })).optional(),
  tracks: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  importantLinks: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  partners: z.array(z.object({ name: z.string(), logoUrl: z.string(), websiteUrl: z.string() })).optional(),
});

type Row = Record<string, string>;
const empty = (key: string): Row => key === 'timelines' ? { title: '', description: '', startDate: '', endDate: '' } : key === 'faqs' ? { question: '', answer: '' } : key === 'partners' ? { name: '', logoUrl: '', websiteUrl: '' } : key === 'importantLinks' ? { title: '', url: '' } : { title: '', description: '', amount: '' };
const labels: Record<string, string[]> = { timelines: ['title', 'description', 'startDate', 'endDate'], prizes: ['title', 'description', 'amount'], tracks: ['title', 'description'], faqs: ['question', 'answer'], importantLinks: ['title', 'url'], partners: ['name', 'websiteUrl'] };
const pretty = (value: string) => value.replace(/([A-Z])/g, ' $1').replace(/^./, x => x.toUpperCase());

export default function AdminEventForm() {
  const eventId = new URLSearchParams(window.location.search).get('id');
  const [form, setForm] = useState<any>({ name: '', subtitle: '', description: '', startDate: '', endDate: '', status: 'DRAFT', eventType: 'PUBLIC', locationType: 'OFFLINE', location: '', locationUrl: '', lumaUrl: '', teamType: 'INDIVIDUAL', minTeamSize: 1, maxTeamSize: 1, isFeatured: false, timelines: [], prizes: [], tracks: [], faqs: [], importantLinks: [], partners: [], categoryIds: [] });
  const [saving, setSaving] = useState(false); 
  const [loading, setLoading] = useState(!!eventId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [imagePreview, setImagePreview] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get('/events/categories').then(({ data }) => setCategories(data || [])).catch(console.error);
  }, []);

  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  const add = (key: string) => set(key, [...form[key], empty(key)]);
  const update = (key: string, index: number, value: Row) => set(key, form[key].map((row: Row, i: number) => i === index ? value : row));
  
  const uploadToBackend = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const response = await api.post('/events/admin/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.url;
  };

  useEffect(() => {
    if (!eventId) return;
    api.get(`/events/${eventId}`).then(({ data }) => {
      if (data) {
        // format dates for datetime-local
        const formatDt = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : '';
        setForm({
          ...data,
          subtitle: data.subtitle || '',
          location: data.location || '',
          locationUrl: data.locationUrl || '',
          lumaUrl: data.lumaUrl || '',
          startDate: formatDt(data.startDate),
          endDate: formatDt(data.endDate),
          timelines: (data.timelines || []).map((t: any) => ({ ...t, startDate: formatDt(t.startDate), endDate: formatDt(t.endDate) })),
          prizes: data.prizes || [],
          tracks: data.tracks || [],
          faqs: data.faqs || [],
          importantLinks: data.importantLinks || [],
          partners: data.partners || [],
          categoryIds: data.categoryIds || [],
        });
        if (data.imageUrl) setImagePreview(data.imageUrl);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [eventId]);

  const submit = async (e: any) => { 
    e.preventDefault(); 
    
    // Zod validation
    const parsed = eventSchema.safeParse(form);
    const formattedErrors: Record<string, string> = {};
    
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        formattedErrors[issue.path.join('.')] = issue.message;
      });
    }

    if (!imageFile && !form.imageUrl) {
      formattedErrors['image'] = 'Event image is required';
    }

    if (Object.keys(formattedErrors).length > 0) {
      setErrors(formattedErrors);
      toast.error('Please fix the validation errors.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setErrors({});
    
    setSaving(true); 
    try { 
      let imageUrl = form.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadToBackend(imageFile);
      } 
      const payload = { ...form, imageUrl };
      if (eventId) {
        await api.put(`/events/admin/${eventId}`, payload);
        toast.success('Event updated successfully'); 
        window.location.href = `/nerdsroom/admin/dashboard/events`;
      } else {
        await api.post('/events/admin', payload);
        toast.success('Event created successfully'); 
        window.location.href = `/nerdsroom/admin/dashboard/events`;
      }
    } catch (err: any) { 
      toast.error(err?.response?.data?.message || 'Could not save event'); 
    } finally { 
      setSaving(false); 
    } 
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading event data...</div>;
  
  const field = (label: string, key: string, required = false, type = 'text') => (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      <span>{label}{required && <span className="text-red-500"> *</span>}</span>
      <input required={required} type={type} value={form[key]} onChange={e => set(key, e.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
      {errors[key] && <p className="text-xs text-red-500 font-normal">{errors[key]}</p>}
    </label>
  );
  
  const select = (label: string, key: string, options: string[]) => (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select value={form[key]} onChange={e => set(key, e.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-blue-600">
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
  
  const collection = (key: string) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{pretty(key)}</h2>
          <p className="mt-1 text-xs text-slate-500">Optional event content</p>
        </div>
        <button type="button" onClick={() => add(key)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Plus size={15} /> Add</button>
      </div>
      {form[key].length === 0 && <p className="py-5 text-sm text-slate-400">No items added yet.</p>}
      {form[key].map((row: Row, index: number) => (
        <div key={index} className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
          {key === 'partners' && (
            <label className="grid gap-1 text-xs font-semibold text-slate-600">
              Partner logo upload
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={async e => { 
                const file = e.target.files?.[0]; 
                if (!file) return; 
                try {
                  const url = await uploadToBackend(file);
                  update(key, index, { ...row, logoUrl: url }); 
                } catch (err) {
                  console.error('Failed to upload logo', err);
                }
              }} className="h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal" />
              {row.logoUrl && <img src={row.logoUrl} alt="Partner logo" className="mt-1 h-12 w-24 rounded object-contain" />}
            </label>
          )}
          {labels[key].map(name => (
            <label key={name} className="grid gap-1 text-xs font-semibold text-slate-600">
              {pretty(name)}
              <input 
                type={name === 'startDate' || name === 'endDate' ? 'datetime-local' : 'text'}
                value={row[name] || ''} 
                onChange={e => update(key, index, { ...row, [name]: e.target.value })} 
                placeholder={pretty(name)} 
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-blue-600" 
              />
            </label>
          ))}
        </div>
      ))}
    </section>
  );
  
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <a href="/nerdsroom/admin/dashboard/events" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
          <ArrowLeft size={17} /> Back to events
        </a>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">Admin workspace</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{eventId ? 'Edit event' : 'Create event'}</h1>
            <p className="mt-2 text-sm text-slate-500">Set up the event details and supporting content.</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-8 grid gap-6 pb-24">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold">Basic information</h2>
              <p className="mt-1 text-xs text-slate-500">Fields marked with <span className="text-red-500">*</span> are required.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {field('Event name', 'name', true)}
              {field('Subtitle', 'subtitle', true)}
              {field('Start date', 'startDate', true, 'datetime-local')}
              {field('End date', 'endDate', true, 'datetime-local')}
              <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                <span>Description <span className="text-red-500">*</span></span>
                <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={6} className="rounded-lg border border-slate-300 px-3 py-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                {errors['description'] && <p className="text-xs text-red-500 font-normal">{errors['description']}</p>}
              </label>
            </div>
          </section>
          
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 border-b border-slate-100 pb-4 text-lg font-bold">Visibility and venue</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {select('Status', 'status', ['DRAFT', 'PUBLISH'])}
              {select('Visibility', 'eventType', ['PUBLIC', 'PRIVATE'])}
              {select('Location type', 'locationType', ['OFFLINE', 'ONLINE', 'HYBRID'])}
              {field('Location', 'location', true)}
              {field('Location URL', 'locationUrl', true)}
              {field('Luma URL', 'lumaUrl')}
              <label className='grid gap-2 text-sm font-semibold text-slate-700 md:col-span-3'>
                <span>Event image {!form.imageUrl && <span className="text-red-500">*</span>}</span>
                <span className='text-xs font-normal text-slate-500'>Upload JPG, PNG or WebP</span>
                <input required={!form.imageUrl} type='file' accept='image/png,image/jpeg,image/webp' onChange={e => { 
                  const file = e.target.files?.[0] || null; 
                  setImageFile(file); 
                  setImagePreview(file ? URL.createObjectURL(file) : ''); 
                  if (file) setErrors(prev => ({ ...prev, image: '' }));
                }} className='h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal' />
                {errors['image'] && <p className="text-xs text-red-500 font-normal">{errors['image']}</p>}
                {imagePreview && <img src={imagePreview} alt='Preview' className='mt-2 h-32 w-auto rounded-lg object-cover border border-slate-200' />}
              </label>
            </div>
          </section>
          
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 border-b border-slate-100 pb-4 text-lg font-bold">Registration settings</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {select('Team type', 'teamType', ['INDIVIDUAL', 'TEAM', 'BOTH'])}
              {form.teamType !== 'INDIVIDUAL' && (
                <>
                  {field('Minimum team size', 'minTeamSize', true, 'number')}
                  {field('Maximum team size', 'maxTeamSize', true, 'number')}
                </>
              )}
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 self-end mb-3">
                <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="h-4 w-4 accent-blue-700" /> 
                Featured event
              </label>
            </div>
          </section>
          
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-5 border-b border-slate-100 pb-4 text-lg font-bold">Categories</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat: any) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        set('categoryIds', [...form.categoryIds, cat.id]);
                      } else {
                        set('categoryIds', form.categoryIds.filter((id: string) => id !== cat.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </section>
          
          {Object.keys(labels).map(key => <div key={key}>{collection(key)}</div>)}
          
          <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
            <a href="/nerdsroom/admin/dashboard/events" className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600">Cancel</a>
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm disabled:opacity-50 transition-all hover:bg-blue-800 focus:ring-4 focus:ring-blue-100">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : (eventId ? 'Update event' : 'Create event')}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}