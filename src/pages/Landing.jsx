import About from "../components/landing/About"
import FAQ from "../components/landing/FAQ"
import Features from "../components/landing/Features"
import Hero from "../components/landing/Hero"
import HowItWorks from "../components/landing/HowItWorks"
import { usePageTitle } from "../hooks/usePageTitle"

export default function Landing() {
  usePageTitle("AI Resume Optimizer")

  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <FAQ />
    </>
  )
}
