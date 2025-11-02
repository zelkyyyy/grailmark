import Image from "next/image";
import React from "react";
import ShopList from "@/components/ShopList";
 import ArtisticLanding from "@/components/ArtisticLanding";
 import Hero from "@/components/Hero";
export default function Home() {
  return (
    <div className="flex  flex-col min-h-screen items-center justify-center bg-neural-900 font-sans">

      <ArtisticLanding />
      <Hero />
      <ShopList />
    </div>
  );
}
