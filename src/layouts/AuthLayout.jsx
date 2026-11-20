import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar"
import SkipLink from "../components/common/SkipLink"
import Spinner from "../components/ui/Spinner"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar variant="authenticated" />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-content flex-1 px-4 py-6 focus:outline-none md:px-6 md:py-8 lg:px-8"
      >
        <Suspense fallback={<Spinner page />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
