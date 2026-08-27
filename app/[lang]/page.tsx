import { ViewTransition } from "react";
import Header from "../components/Header";
import GrainOverlay from "../components/GrainOverlay";
import Hero from "../components/sections/Hero";
import ClientsMarquee from "../components/sections/ClientsMarquee";
import Problem from "../components/sections/Problem";
import Solution from "../components/sections/Solution";
import Capabilities from "../components/sections/Capabilities";
import Process from "../components/sections/Process";
import Portfolio from "../components/sections/Portfolio";
import Industries from "../components/sections/Industries";
import TechnicalCredibility from "../components/sections/TechnicalCredibility";
import WhyNettyo from "../components/sections/WhyNettyo";
import Faq from "../components/sections/Faq";
import FinalCta from "../components/sections/FinalCta";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <ViewTransition>
        <main className="flex flex-1 flex-col">
          <div className="flex min-h-[100dvh] flex-col">
            <Hero />
            <ClientsMarquee />
          </div>
          <Problem />
          <Solution />
          <Capabilities />
          <Process />
          <Portfolio />
          <Industries />
          <TechnicalCredibility />
          <WhyNettyo />
          <Faq />
          <FinalCta />
        </main>
      </ViewTransition>
      <Footer />
      <GrainOverlay />
    </>
  );
}
