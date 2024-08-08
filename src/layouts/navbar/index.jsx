import { useState } from "react";
import { navItems } from "@/nav-items";
import { Outlet } from "react-router-dom";
import { DesktopNavbar } from "./_components/DesktopNavbar";
import { MobileSheet } from "./_components/MobileSheet";
import { UserMenu } from "./_components/UserMenu";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import { useProStatus } from "@/contexts/ProStatusContext";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { isPro } = useProStatus();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <DesktopNavbar navItems={navItems} />
          <MobileSheet navItems={navItems} isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </motion.header>
      <main className="flex-1 container py-6 bg-background">
        <Outlet />
      </main>
      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-t py-6 md:py-0 bg-muted"
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by the Auto Vision V2 team. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
