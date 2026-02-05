import { useMemo } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";

import About from "./features/about/About";
import HowItWorks from "./features/howItWorks/HowItWorks";
import DeviceCatalog from "./features/devices/DeviceCatalog";
import { Faq } from "./features/faq/Faq";
import Contact from "./features/contact/Contact";

import { HOW_IT_WORKS_STEPS } from "./features/howItWorks/howItWorks.data";
import { FAQ_ITEMS } from "./features/faq/faq.data";

export default function App() {
  const apiUrl = useMemo(
    () => (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:5231",
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main id="top" className="mx-auto max-w-6xl px-6 py-10">
        <Hero apiUrl={apiUrl} />

        <About />

        <HowItWorks steps={HOW_IT_WORKS_STEPS} />

        <DeviceCatalog />

        <Faq items={FAQ_ITEMS} />

        <Contact />
      </main>
    </div>
  );
}