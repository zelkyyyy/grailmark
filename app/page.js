'use client';
import Image from "next/image";
import React from "react";
import ShopList from "@/components/ShopList";
 import ArtisticLanding from "@/components/ArtisticLanding";
 import Hero from "@/components/Hero";
import Login from "@/components/Login";
import { useState } from "react";

export default function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
      return (
        <div className="flex  flex-col min-h-screen items-center justify-center bg-neutral-900 font-sans">
          <ArtisticLanding />
          <Hero loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          {loggedIn && <ShopList />}
        </div>
      );
}
