import React from 'react'

const ShopLink = (props) => {
  return (
    <div className='mb-8 break-inside-avoid'>
    <a href={props.shop.url} target='_blank' rel='noopener noreferrer' className="flex items-center justify-center w-auto h-40 p-8 overflow-hidden transition-all border border-transparent hover:border-neutral-200/20 bg-neutral-800/70 duration-500 shadow-xl shadow-neutral-900/30 rounded-xl">
        <img rel='noreferrer' className='w-full h-auto text-white max-w-48 ' src={`logos/${props.shop.logo}`} alt={props.shop.name} loading='lazy'/>
    </a>

    </div>
  )
}

export default ShopLink