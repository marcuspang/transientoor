import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <main className="h-screen">
      <nav className="py-4">
        <header className="flex justify-between px-12">
          <div className="flex items-center">
            <p className="font-bold text-3xl tracking-tighter mr-8">
              Transientoor
            </p>
            <div className="space-x-4">
              <Link to="/" className="[&.active]:font-bold">
                Loan NFTs
              </Link>
              <Link to="/about" className="[&.active]:font-bold">
                About
              </Link>
            </div>
          </div>
          <w3m-button />
        </header>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </main>
  ),
});
