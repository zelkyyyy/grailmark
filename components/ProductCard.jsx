import React from 'react';
import { ImageOff, ExternalLink } from 'lucide-react';
import DeleteButton from './DeleteButton';

const ProductCard = ({ product, onDelete }) => {
  const domain = product.domain || new URL(product.url).hostname;

  return (
    <div className='relative group w-40 lg:w-72 flex flex-col gap-3 p-3 border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-2xl shadow-lg shadow-black/20 hover:border-white/30 hover:-translate-y-1 transition-all duration-300'>

      <DeleteButton onConfirm={() => onDelete(product.id)} />

      <a href={product.url} target="_blank" rel="noreferrer" className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/5">
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
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-neutral-600">
            <ImageOff size={22} />
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <ExternalLink size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow" />
        </div>
      </a>

      <div className="flex flex-col gap-1.5 px-0.5 pb-0.5">
        <a href={product.url} target="_blank" rel="noreferrer" className="font-medium text-sm text-neutral-200 truncate hover:text-white transition-colors">
          {product.title || 'Untitled product'}
        </a>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-emerald-400 font-bold text-sm">
            {product.price ? `${product.price} ${product.currency || ''}` : '—'}
          </span>

          <span className="max-w-[100px] truncate text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded-full">
            {domain.replace('www.', '')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
