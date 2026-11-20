import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import SkipLink from "../components/common/SkipLink"
import Footer from "../components/landing/Footer"
import LandingNavbar from "../components/landing/LandingNavbar"
import Spinner from "../components/ui/Spinner"

// Full-width public marketing layout: no sidebar, no auth required.
export default function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <LandingNavbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<Spinner page />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
