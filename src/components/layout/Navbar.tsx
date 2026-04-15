"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiInstagram, FiFacebook, FiShoppingBag, FiSearch, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchOverlay from "@/components/ui/SearchOverlay";

const navLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "For Him", href: "/shop/mens" },
  { label: "For Her", href: "/shop/womens" },
  { label: "New Drop", href: "/shop/new" },
  { label: "Collections", href: "/collections" },
  { label: "Our Faith", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openDrawer } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        {/* Announcement bar */}
        <div className="bg-vv-black text-white text-center py-2 px-4">
          <p className="font-heading text-xs tracking-widest2 uppercase">
            Use code{" "}
            <span className="text-vv-orange font-semibold">BLESSED26</span>
            {" "}— 15% off your first order
          </p>
        </div>

        {/* Top row: social | logo | icons */}
        <div className="border-b border-gray-100 px-5 sm:px-10 h-14 flex items-center justify-between">
          {/* Left: social (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://www.instagram.com/visualvibesl.l.c/" target="_blank" rel="noopener noreferrer" className="text-vv-black hover:text-vv-orange transition-colors">
              <FiInstagram size={17} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61587157773896" target="_blank" rel="noopener noreferrer" className="text-vv-black hover:text-vv-orange transition-colors">
              <FiFacebook size={17} />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-vv-black"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 bg-vv-black flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASEPATH || ""}/visual-vibes-logo.png`}
                alt="Visual Vibes"
                style={{ width: "36px", height: "36px", objectFit: "contain" }}
              />
            </div>
            <span className="font-heading font-semibold text-xl sm:text-2xl tracking-widest2 uppercase text-vv-black">
              Visual Vibes
            </span>
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-vv-black hover:text-vv-orange transition-colors"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1 text-vv-black hover:text-vv-orange transition-colors relative"
              aria-label="Account"
            >
              <FiUser size={18} />
              {user && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-vv-orange rounded-full" />
              )}
            </Link>
            <button
              onClick={openDrawer}
              className="text-vv-black hover:text-vv-orange transition-colors relative"
              aria-label="Cart"
            >
              <FiShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-vv-orange rounded-full flex items-center justify-center">
                  <span className="font-heading text-white font-bold" style={{ fontSize: "9px" }}>{count}</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: nav links (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-8 px-10 h-10 border-b border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-heading text-xs tracking-widest uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? "text-vv-orange border-b border-vv-orange pb-px"
                  : "text-vv-black hover:text-vv-orange"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-200 bg-vv-black flex items-center justify-center p-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_BASEPATH || ""}/visual-vibes-logo.png`}
                      alt="Visual Vibes"
                      style={{ width: "32px", height: "32px", objectFit: "contain" }}
                    />
                  </div>
                  <span className="font-heading font-semibold text-lg uppercase tracking-widest2 text-vv-black">
                    Visual Vibes
                  </span>
                </Link>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <FiX size={22} className="text-vv-black" />
                </button>
              </div>

              <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}>
                    <Link href={link.href} onClick={() => setMenuOpen(false)}
                      className="block font-heading text-sm uppercase tracking-widest text-vv-black hover:text-vv-orange transition-colors py-3 border-b border-gray-50">
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + navLinks.length * 0.06, duration: 0.3 }}>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 font-heading text-sm uppercase tracking-widest text-vv-black hover:text-vv-orange transition-colors py-3 border-b border-gray-50">
                    <FiUser size={14} /> {user ? `Hi, ${user.firstName}` : "Account"}
                  </Link>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (navLinks.length + 1) * 0.06, duration: 0.3 }}>
                  <button onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                    className="flex items-center gap-2 font-heading text-sm uppercase tracking-widest text-vv-black hover:text-vv-orange transition-colors py-3 border-b border-gray-50 w-full text-left">
                    <FiSearch size={14} /> Search
                  </button>
                </motion.div>
              </nav>

              <div className="px-6 py-6 border-t border-gray-100">
                <p className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid mb-1">First order discount</p>
                <p className="font-heading font-semibold text-vv-orange text-base tracking-widest">BLESSED26</p>
                <div className="flex gap-4 mt-4">
                  <a href="https://www.instagram.com/visualvibesl.l.c/" target="_blank" rel="noopener noreferrer">
                    <FiInstagram size={20} className="text-vv-black hover:text-vv-orange transition-colors" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61587157773896" target="_blank" rel="noopener noreferrer">
                    <FiFacebook size={20} className="text-vv-black hover:text-vv-orange transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
