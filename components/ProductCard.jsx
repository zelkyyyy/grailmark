import React from 'react';

const ProductCard = ({ product, onDelete }) => {
  // Wyciągamy domenę do logo, jeśli nie została zapisana w bazie
  const domain = product.domain || new URL(product.url).hostname;
  const logoUrl = `https://unavatar.io/${domain}?ttl=604800`;

  return (
    <div className='relative group w-36 lg:w-72 flex flex-col gap-3 p-3 border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-xl hover:border-white/30 transition-all'>
      
      {/* Przycisk usuwania */}
      <button 
        onClick={() => onDelete(product.id)}
        className='absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 bg-red-500/20 border border-red-600/60 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-all'
      >
        ×
      </button>

      {/* Zdjęcie produktu */}
      <a href={product.url} target="_blank" rel="noreferrer" className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/5">
        {product.image_url ? (
          <img 
            referrerPolicy="no-referrer"
            src={product.image_url} 
            alt={product.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">No Image</div>
        )}
      </a>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <a href={product.url} target="_blank" rel="noreferrer" className="font-medium text-neutral-200 truncate hover:underline">
          {product.title || 'Produkt bez nazwy'}
        </a>
        
        <div className="flex flex-col lg:flex-row gap-1 justify-between items-center mt-1">
          {/* Cena */}
          <span className="text-emerald-400 font-bold">
            {product.price ? `${product.price} ${product.currency || ''}` : '-'}
          </span>

          {/* Małe logo sklepu (źródła) */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded-full">
            {/* <img src={logoUrl} alt="source" className="w-4 h-4 rounded-full" /> */}
            <span className="max-w-[80px] truncate">{domain.replace('www.','')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;