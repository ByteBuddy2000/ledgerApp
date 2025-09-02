"use client";
import Link from "next/link";
import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/#about" },
  { label: "Contact us", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10
      ${open ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black" : "bg-black/60 backdrop-blur-md md:bg-black/60 md:backdrop-blur-md"}
    `}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        {/* Logo */}
        <Link href="/" className="bg-gray-600 rounded p-2 flex items-center gap-2">
          <Image src="/logo.svg" className="hidden" alt="Logo" width={32} height={32} />
          <span className="text-sm text-red-500 font-bold tracking-tight">Authorized<span className="text-blue-500">QFSVault</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-blue-400 transition duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold shadow hover:from-blue-500 hover:to-indigo-600 transition"
          >
            <UserPlus size={16} className="inline mr-1" />
            Register
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl border border-white/20 hover:border-blue-500 text-sm font-semibold transition"
          >
            <LogIn size={16} className="inline mr-1" />
            Login
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden z-50 flex flex-col justify-between h-6 w-7"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`h-1 w-full bg-white rounded transition-all ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`h-1 w-full bg-white rounded transition-all ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-1 w-full bg-white rounded transition-all ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-40 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        } bg-gradient-to-br from-gray-950 via-gray-900 to-black`}
      >
        <div className="flex flex-col h-full px-6 py-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={() => setOpen(false)} className="text-2xl text-white">
              &times;
            </button>
          </div>

          <ul className="flex flex-col gap-5 text-sm font-medium">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-1 hover:text-blue-400 transition"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-2 rounded-xl text-center hover:from-blue-500 hover:to-indigo-600"
              onClick={() => setOpen(false)}
            >
              <UserPlus size={16} className="inline mr-1" />
              Register
            </Link>
            <Link
              href="/login"
              className="w-full border border-white/20 text-white font-semibold py-2 rounded-xl text-center hover:border-blue-500"
              onClick={() => setOpen(false)}
            >
              <LogIn size={16} className="inline mr-1" />
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
}
