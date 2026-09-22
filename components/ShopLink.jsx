import React, { useState } from 'react';
import { Store } from 'lucide-react';
import DeleteButton from './DeleteButton';

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
  const [failed, setFailed] = useState(false);

  const handleDelete = () => {
    if (props.delete) return props.delete(props.shop.id);
    if (props.onDelete) return props.onDelete(props.shop.id);
  };

  const handleError = () => {
    if (!hasError) {
      setImgSrc(backupSource);
      setHasError(true);
    } else {
      setFailed(true);
    }
  };

  return (
    <div className='relative group'>
      <a
        href={props.shop.url}
        target='_blank'
        rel='noopener noreferrer'
        className="flex flex-col gap-3 w-40 lg:w-72 p-5 items-center justify-center border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-2xl hover:border-white/30 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20 cursor-pointer"
      >
        <DeleteButton onConfirm={handleDelete} />

        <div className="w-20 h-20 flex items-center justify-center bg-white rounded-xl aspect-square p-2.5 overflow-hidden shadow-sm">
          {failed ? (
            <Store size={28} className="text-neutral-400" />
          ) : (
            <img
              className='w-full h-full object-contain'
              src={imgSrc}
              alt={props.shop.name}
              loading='lazy'
              decoding='async'
              onError={handleError}
            />
          )}
        </div>

        <h2 className='text-lg font-bold text-neutral-200 text-center px-2 truncate w-full'>
          {props.shop.name}
        </h2>
        <span className="max-w-[200px] truncate text-xs text-neutral-400 bg-white/5 px-2 py-1 rounded-full">
          {hostname}
        </span>
      </a>
    </div>
  );
};

export default ShopLink;
