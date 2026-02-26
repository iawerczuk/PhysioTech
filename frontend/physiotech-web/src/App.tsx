import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

import About from "./features/about/About";
import HowItWorks from "./features/howItWorks/HowItWorks";
import { HOW_IT_WORKS_STEPS } from "./features/howItWorks/howItWorks.data";

import DeviceCatalog from "./features/devices/DeviceCatalog";

import { Faq } from "./features/faq/Faq";
import { FAQ_ITEMS } from "./features/faq/faq.data";

import Contact from "./features/contact/Contact";

import { useAppShell } from "./app/useAppShell";
import AppPanels from "./app/AppPanels";

export default function App() {
  const shell = useAppShell();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header activePanel={shell.activePanel} onSelectPanel={shell.setActivePanel} />

      <AppPanels shell={shell} />

      <main className="mx-auto max-w-6xl px-6">
        <Hero />
        <About />
        <HowItWorks steps={HOW_IT_WORKS_STEPS} />

        <DeviceCatalog onRequireAuth={shell.requireAuth} onRentClick={shell.addToCart} />

        <Faq items={FAQ_ITEMS} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}