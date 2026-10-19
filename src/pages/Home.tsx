import { Hero } from "@/components/hero/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Stack } from "@/components/sections/Stack";
import { AIFocus } from "@/components/sections/AIFocus";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { useDocumentMeta } from "@/lib/useDocumentMeta";
import pageMetadata from "@/data/pageMetadata.json";

export default function Home() {
  useDocumentMeta({
    ...pageMetadata.home,
  });

  return (
    <main id="main">
      <Hero />
      <About />
      <Experience />
      <Stack />
      <WhatIBuild />
      <SelectedWork />
      <Services />
      <AIFocus />
      <GitHubSection />
      <Contact />
    </main>
  );
}
