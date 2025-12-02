import React, { useState, useEffect } from 'react'

const ShopLink = (props) => {
  const hostname = new URL(props.shop.url).hostname;
  // Domyślnie ustawiamy fallback na Clearbit, dopóki Brandfetch nie odpowie
  const [logoUrl, setLogoUrl] = useState(`https://logo.clearbit.com/${hostname}`);

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (props.delete) return props.delete(props.shop.id)
    if (props.onDelete) return props.onDelete(props.shop.id)
  }

 

  return (
    <div className='relative '>
     {props.deleteOn && <button 
        onClick={handleDelete} 
        className='absolute z-20 font-bold cursor-pointer -right-2 -top-2 bg-red-700/30 text-red-600 border border-red-500/30  rounded-full w-6 h-6 items-center align-center justify-center flex'
      >
        x
      </button> }

      <a 
        href={props.shop.url} 
        target='_blank' 
        rel='noopener noreferrer' 
        className="flex flex-col gap-2 p-4 items-center justify-center lg:w-auto w-77 h-48 transition-all border border-white/10 hover:border-white/30 hover:bg-neutral-200/40 duration-300 cursor-pointer bg-neutral-200/20 backdrop-blur-[2px] shadow-xl shadow-neutral-900/30 rounded-xl"
      >
        {/* Usunąłem rounded-full i aspect-square, bo prawdziwe logo (np. napis) 
            będzie brzydko wyglądać wciśnięte w kółko. Dodałem object-contain. */}
        <img 
          rel='noreferrer noopener' 
          className='w-32 h-32 object-cover rounded-full text-white max-w-48' 
          src={logoUrl} 
          alt={props.shop.name} 
          loading='lazy'
        />
        <h2 className='text-xl font-bold text-neutral-300'>{props.shop.name}</h2>
      </a>
    </div>
  )
}

export default ShopLink