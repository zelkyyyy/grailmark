import React, { useState } from 'react';
import { Link2, ImageOff, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Twoja instancja supabase

const AddProductForm = ({ onProductAdded, embedded = false }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null); // Scraped data lives here

  // Step 1: fetch preview data (scraping)
  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not fetch data from that link');
        return;
      }

      const domain = new URL(url).hostname.replace('www.', '');

      setPreview({
        url,
        title: data.title || '',
        image_url: data.image || '',
        price: data.price || '',
        currency: data.currency || 'PLN',
        domain
      });
    } catch (err) {
      setError('Could not fetch data from that link');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: save to the database
  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('products')
      .insert([{ ...preview, user_id: user.id }]);

    if (error) {
      setError('Failed to save the product');
      setSaving(false);
    } else {
      setUrl('');
      setPreview(null);
      setSaving(false);
      if (onProductAdded) onProductAdded(); // Refresh the list
    }
  };

  return (
    <div className={embedded ? 'w-full' : 'w-full max-w-2xl mx-auto px-4'}>

      {/* Link input */}
      <form onSubmit={handleFetch} className="flex gap-3 flex-col sm:flex-row justify-center items-center mx-auto w-full">
        <div className="flex flex-1 w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 transition focus-within:border-white/30 focus-within:bg-white/10">
          <Link2 size={16} className="shrink-0 text-neutral-500" />
          <input
            type="url"
            placeholder="Product link…"
            className="w-full min-w-0 bg-transparent py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            autoFocus={embedded}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white hover:bg-neutral-200 duration-300 text-neutral-900 px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Fetching…' : 'Fetch'}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}

      {/* Preview before saving */}
      {preview && (
        <div className="mt-6 flex gap-4 p-4 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md">
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
            {preview.image_url ? (
              <img src={preview.image_url} className="w-full h-full object-cover" alt="" />
            ) : (
              <ImageOff size={20} className="text-neutral-600" />
            )}
          </div>

          {/* Editable fields in case the scraper got something wrong */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <input
              value={preview.title}
              onChange={e => setPreview({ ...preview, title: e.target.value })}
              placeholder="Title"
              className="bg-transparent border-b border-white/10 text-white text-sm font-medium w-full py-1 focus:outline-none focus:border-white/40"
            />
            <div className="flex gap-3">
              <input
                value={preview.price}
                onChange={e => setPreview({ ...preview, price: e.target.value })}
                className="bg-transparent border-b border-white/10 text-emerald-400 text-sm w-20 py-1 focus:outline-none focus:border-white/40"
                placeholder="Price"
              />
              <input
                value={preview.currency}
                onChange={e => setPreview({ ...preview, currency: e.target.value })}
                className="bg-transparent border-b border-white/10 text-neutral-400 text-sm w-16 py-1 focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => { setPreview(null); setError(''); }}
                className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white duration-200 cursor-pointer"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 duration-200 text-white px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Save product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;
