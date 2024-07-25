import { useState } from "react";
import { navItems } from "@/nav-items";
import { Outlet } from "react-router-dom";
import { DesktopNavbar } from "./_components/DesktopNavbar";
import { MobileSheet } from "./_components/MobileSheet";
import { UserMenu } from "./_components/UserMenu";

const Layout = ({ user, isPro }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <DesktopNavbar navItems={navItems} />
          <MobileSheet navItems={navItems} isOpen={isOpen} setIsOpen={setIsOpen} />
          <UserMenu user={user} isPro={isPro} />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6 md:py-0 bg-muted">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by the Acme Inc team. The source code is available on GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;