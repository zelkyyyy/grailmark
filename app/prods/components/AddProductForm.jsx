import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Twoja instancja supabase

const AddProductForm = ({ onProductAdded }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Tutaj trzymamy dane ze scrapingu

  // Krok 1: Pobierz dane (Scraping)
  const handleFetch = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      // Wyciągamy domenę do zapisu
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
      alert('Nie udało się pobrać danych ze strony');
    } finally {
      setLoading(false);
    }
  };

  // Krok 2: Zapisz do bazy
  const handleSave = async () => {
    if (!preview) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('products')
      .insert([{ ...preview, user_id: user.id }]);

    if (error) {
      alert('Błąd zapisu!');
    } else {
      setUrl('');
      setPreview(null);
      if (onProductAdded) onProductAdded(); // Odśwież listę
    }
  };

  return (
    <div className="">
      
      {/* Input Linku */}
      <div className="flex gap-2 lg:flex-row flex-col justify-center items-center max-w-2xl mx-auto w-full">
        <input
          type="url"
          placeholder="Link do produktu..."
          className="w-full max-w-lg border border-neutral-700 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-neutral-200"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleFetch}
          disabled={loading}
          className="bg-neutral-200 lg:w-auto md:w-full hover:bg-neutral-400 duration-200 text-neutral-900 px-6 py-2 rounded-xl disabled:opacity-50"
        >
          {loading ? 'Szukam...' : 'Pobierz'}
        </button>
      </div>

      {/* Podgląd przed zapisaniem */}
      {preview && (
        <div className="mt-6 flex gap-4 animate-in fade-in slide-in-from-top-2">
          {/* Obrazek */}
          <div className="w-32 h-32 bg-neutral-800 rounded-lg overflow-hidden shrink-0">
             {preview.image_url && <img src={preview.image_url} className="w-full h-full object-cover" />}
          </div>

          {/* Edytowalne pola (jakby skrypt się pomylił) */}
          <div className="flex-1 flex flex-col gap-2">
            <input 
              value={preview.title} 
              onChange={e => setPreview({...preview, title: e.target.value})}
              className="bg-transparent border-b border-neutral-700 text-white font-bold w-full focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
               <input 
                  value={preview.price} 
                  onChange={e => setPreview({...preview, price: e.target.value})}
                  className="bg-transparent border-b border-neutral-700 text-emerald-400 w-24 focus:outline-none"
                  placeholder="Cena"
                />
                <input 
                  value={preview.currency} 
                  onChange={e => setPreview({...preview, currency: e.target.value})}
                  className="bg-transparent border-b border-neutral-700 text-neutral-400 w-16 focus:outline-none"
                />
            </div>
            
            <div className="mt-2 flex gap-2">
              <button onClick={() => setPreview(null)} className="text-sm text-neutral-400 hover:text-white">Anuluj</button>
              <button onClick={handleSave} className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1 rounded">Zapisz produkt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;