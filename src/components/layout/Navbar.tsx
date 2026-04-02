"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiInstagram, FiFacebook, FiShoppingBag, FiSearch, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "For Him", href: "/shop" },
  { label: "For Her", href: "/shop" },
  { label: "New Drop", href: "/shop" },
  { label: "Collections", href: "/shop" },
  { label: "Our Faith", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
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
            <a href="https://www.instagram.com/visualvibesl.l.c/" target="_blank" rel="noopener noreferrer" className="text-vv-black hover:text-vv-teal transition-colors">
              <FiInstagram size={17} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61587157773896" target="_blank" rel="noopener noreferrer" className="text-vv-black hover:text-vv-teal transition-colors">
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
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-heading font-semibold text-xl sm:text-2xl tracking-widest2 uppercase text-vv-black hover:text-vv-teal transition-colors"
          >
            Visual Vibes
          </Link>

          {/* Right: icons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex text-vv-black hover:text-vv-teal transition-colors" aria-label="Search">
              <FiSearch size={18} />
            </button>
            <button className="hidden sm:flex text-vv-black hover:text-vv-teal transition-colors" aria-label="Account">
              <FiUser size={18} />
            </button>
            <button
              onClick={openDrawer}
              className="text-vv-black hover:text-vv-teal transition-colors relative"
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
                  ? "text-vv-teal border-b border-vv-teal pb-px"
                  : "text-vv-black hover:text-vv-teal"
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
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="font-heading font-semibold text-lg uppercase tracking-widest2 text-vv-black"
                >
                  Visual Vibes
                </Link>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <FiX size={22} className="text-vv-black" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-heading text-sm uppercase tracking-widest text-vv-black hover:text-vv-teal transition-colors py-3 border-b border-gray-50"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-6 py-6 border-t border-gray-100">
                <p className="font-heading text-xs uppercase tracking-widest text-vv-gray-mid mb-1">First order discount</p>
                <p className="font-heading font-semibold text-vv-orange text-base tracking-widest">BLESSED26</p>
                <div className="flex gap-4 mt-4">
                  <a href="https://www.instagram.com/visualvibesl.l.c/" target="_blank" rel="noopener noreferrer">
                    <FiInstagram size={20} className="text-vv-black hover:text-vv-teal transition-colors" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61587157773896" target="_blank" rel="noopener noreferrer">
                    <FiFacebook size={20} className="text-vv-black hover:text-vv-teal transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
