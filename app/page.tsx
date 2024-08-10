"use client";
import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Highlights from "./_components/Highlights";
import Model from "./_components/Model";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
