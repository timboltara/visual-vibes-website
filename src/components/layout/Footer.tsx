import Link from "next/link";
import { FiInstagram, FiFacebook } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-vv-black text-white border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-5 sm:px-10 py-16">
        {/* Top: logo centered */}
        <div className="text-center mb-14">
          <Link
            href="/"
            className="font-heading font-semibold text-2xl uppercase tracking-widest2 text-white hover:text-vv-teal transition-colors"
          >
            Visual Vibes
          </Link>
          <p className="font-body text-xs text-gray-500 mt-2 uppercase tracking-widest">
            Wear Your Faith Boldly
          </p>
        </div>

        {/* 3-col links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-14">
          <div>
            <p className="font-heading text-xs uppercase tracking-widest2 text-gray-500 mb-5">Shop</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "For Him", href: "/shop" },
                { label: "For Her", href: "/shop" },
                { label: "New Drop", href: "/shop" },
                { label: "All Collections", href: "/shop" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-heading text-xs uppercase tracking-widest2 text-gray-500 mb-5">Info</p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Our Faith", href: "/about" },
                { label: "Prayer Request", href: "/about#prayer" },
                { label: "Contact Us", href: "/about" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-heading text-xs uppercase tracking-widest2 text-gray-500 mb-5">Follow</p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/visualvibesl.l.c/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587157773896"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiFacebook size={20} />
              </a>
            </div>
            <div className="mt-5 border border-white/10 p-4">
              <p className="font-heading text-xs uppercase tracking-widest text-gray-500">First Order Discount</p>
              <p className="font-heading font-semibold text-vv-orange text-lg tracking-widest mt-1">BLESSED26</p>
              <p className="font-body text-xs text-gray-600 mt-1">15% off · Auto-applied at checkout</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-body text-xs text-gray-600">
            © {new Date().getFullYear()} Visual Vibes LLC. All rights reserved.
          </p>
          <p className="font-heading text-xs uppercase tracking-widest text-gray-700">
            Romans 1:16
          </p>
        </div>
      </div>
    </footer>
  );
}
