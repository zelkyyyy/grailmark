'use client';
import React from "react";
import ShopList from "@/components/ShopList";
 import ArtisticLanding from "@/components/ArtisticLanding";
 import Hero from "@/components/Hero";
import { useState } from "react";
import Products from "@/components/Products";
export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    // const [shops, setShops] = useState(false);
    // const [products, setProducts] = useState(false);
      return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-neutral-900 font-sans ">
          <ArtisticLanding />
          <Hero loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <div className="flex md:flex-row flex-col items-start justify-center w-full ">
            {loggedIn && <Products />}

            {loggedIn && <ShopList />}
            {/* <div className="w-[1px] self-stretch bg-gradient-to-b from-white/30 via-white/90 to-white/30 z-10 "></div> */}
          </div>

        
        </div>
      );
}
