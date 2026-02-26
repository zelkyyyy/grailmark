import React, { useState, useEffect } from 'react';

const ShopLink = (props) => {
  const getHostname = (url) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', '');
    } catch (e) {
      return '';
    }
  };

  const hostname = getHostname(props.shop.url);
  const primarySource = `https://unavatar.io/${hostname}?ttl=604800`;
  const backupSource = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  const [imgSrc, setImgSrc] = useState(primarySource);
  const [hasError, setHasError] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.delete) return props.delete(props.shop.id);
    if (props.onDelete) return props.onDelete(props.shop.id);
  };

  const handleError = () => {
    if (!hasError) {
      setImgSrc(backupSource);
      setHasError(true);
    } else {
      setImgSrc('https://via.placeholder.com/128?text=' + hostname[0].toUpperCase());
    }
  };

  return (
    <div className='relative group'>
      <a
        href={props.shop.url}
        target='_blank'
        rel='noopener noreferrer'
        className="flex flex-col gap-3 w-36 lg:w-72 p-4 items-center justify-center border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-xl hover:border-white/30 transition-all shadow-xl shadow-neutral-900/30 cursor-pointer"
      >
        <div className="w-24 h-24 flex group items-center justify-center bg-white rounded-lg aspect-square p-2 overflow-hidden shadow-sm">
          <button
            onClick={handleDelete}
            className='absolute cursor-pointer -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 hover:duration-700 delay-75 bg-red-500/20 border border-red-600/60 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-all'
          >
            ×
          </button>
          <img
            className='w-full h-full object-cover rounded-e-md'
            src={imgSrc}
            alt={props.shop.name}
            loading='lazy'
            decoding='async'
            onError={handleError}
          />
        </div>
        
        <h2 className='text-2xl font-bold text-neutral-300 text-center px-2'>
          {props.shop.name}
        </h2>
        <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded-full">
          <span className="max-w-[200px] truncate">{hostname}</span>
        </div>
      </a>
    </div>
  );
};

export default ShopLink;