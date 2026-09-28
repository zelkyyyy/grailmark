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
    <div className='relative group shrink-0'>
      <a
        href={props.shop.url}
        target='_blank'
        rel='noopener noreferrer'
        className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 border border-white/10 bg-neutral-900/40 backdrop-blur-md rounded-full hover:border-white/30 hover:bg-neutral-900/60 transition-all duration-300 shadow-md shadow-black/20 cursor-pointer"
      >
        <div className="w-7 h-7 shrink-0 flex items-center justify-center bg-white rounded-full overflow-hidden">
          {failed ? (
            <Store size={13} className="text-neutral-400" />
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

        <span className="text-sm font-medium text-neutral-200 whitespace-nowrap max-w-[140px] truncate">
          {props.shop.name}
        </span>
      </a>

      <DeleteButton onConfirm={handleDelete} size="sm" className="absolute -top-1.5 -right-1.5" />
    </div>
  );
};

export default ShopLink;
