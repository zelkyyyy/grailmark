import React from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import DeleteButton from './DeleteButton';

const ProductCard = ({ product, onDelete }) => {
  const domain = product.domain || new URL(product.url).hostname;

  return (
    <div className='relative group w-32 sm:w-40 lg:w-48 flex flex-col gap-2 p-2.5 border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-xl shadow-lg shadow-black/20 hover:border-white/30 hover:-translate-y-1 transition-all duration-300'>

      <DeleteButton size="sm" onConfirm={() => onDelete(product.id)} />

      <a href={product.url} target="_blank" rel="noreferrer" className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white/5">
        {product.image_url ? (
          <img
            referrerPolicy="no-referrer"
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading='lazy'
            decoding='async'
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-neutral-600">
            <ImageOff size={18} />
            <span className="text-[10px]">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <ExternalLink size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" />
        </div>
      </a>

      <div className="flex flex-col gap-1 px-0.5 pb-0.5">
        <a href={product.url} target="_blank" rel="noreferrer" className="font-medium text-xs text-neutral-200 truncate hover:text-white transition-colors">
          {product.title || 'Untitled product'}
        </a>

        <div className="flex items-center justify-between gap-2">
          <span className="text-emerald-400 font-bold text-xs">
            {product.price ? `${product.price} ${product.currency || ''}` : '—'}
          </span>

          <span className="max-w-[80px] truncate text-[10px] text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded-full">
            {domain.replace('www.', '')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
