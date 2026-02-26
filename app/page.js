
'use client';
import React from "react";
import dynamic from 'next/dynamic';
import ArtisticLanding from "@/components/ArtisticLanding";
import Hero from "@/components/Hero";
import { useState } from "react";

const ShopList = dynamic(() => import("@/components/ShopList"), { 
  loading: () => <div className="w-full h-32" /> 
});

const Products = dynamic(() => import("@/components/Products"), { 
  loading: () => <div className="w-full h-32" /> 
});

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-neutral-900 font-sans">
          <ArtisticLanding />
          <Hero loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <div className="flex md:flex-row flex-col items-start justify-center w-full">
            {loggedIn && <Products />}
            {loggedIn && <ShopList />}
          </div>
        </div>
    );
}