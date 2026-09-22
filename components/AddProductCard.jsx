import React from 'react';
import { Plus } from 'lucide-react';

const AddProductCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-32 sm:w-40 lg:w-48 aspect-[4/3.6] flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-white/[0.02] rounded-xl text-neutral-500 hover:text-neutral-200 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer"
    >
      <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5">
        <Plus size={16} />
      </span>
      <span className="text-xs font-medium">Add product</span>
    </button>
  );
};

export default AddProductCard;
