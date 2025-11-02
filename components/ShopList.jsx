import React from 'react'
import ShopLink from './ShopLink'
import { getProducts } from '@/lib/data'


const ShopList = async () => {
  let products = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    // W przypadku błędu, zwracamy pustą listę lub komunikat
    return <div className="p-8 text-red-500">Błąd ładowania danych: Sprawdź konsolę serwera i czy serwer MongoDB działa.</div>;
  }
  return (
    <div className='backdrop-blur-sm flex lg:flex-row flex-wrap md:flex-col items-center justify-center gap-8'>
      {products.map((product) => (
          <ShopLink key={product._id}  shop={product} />
      ))}
    </div>
  )
}

export default ShopList