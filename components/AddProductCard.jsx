import React from 'react';
import { Plus } from 'lucide-react';

const AddProductCard = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-40 sm:w-48 lg:w-56 aspect-[4/3.6] flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 bg-white/[0.02] rounded-xl text-neutral-500 hover:text-neutral-200 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer"
    >
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
        <Plus size={18} />
      </span>
      <span className="text-sm font-medium">Add product</span>
    </button>
  );
};

export default AddProductCard;
