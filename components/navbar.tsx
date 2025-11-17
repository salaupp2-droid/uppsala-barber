'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/#sobre', label: 'Sobre' },
    { href: '/#barberos', label: 'Barberos' },
    { href: '/#servicios', label: 'Servicios' },
    { href: '/#reservar', label: 'Reservar' },
    { href: '/#galeria', label: 'Galería' },
    { href: '/#contacto', label: 'Contacto' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-primary/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
                <Link href="/#inicio" className="flex items-center space-x-2">
        <div className="relative w-12 h-12">
          <Image
            src="/logo-uppsala.png"
            alt="UPPSALA BARBER"
            fill
             className="object-cover rounded-full"
            priority
          />
        </div>
        <span className="text-xl font-bold neon-text">UPPSALA</span>
      </Link>

          {/* NAV DESKTOP */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* MENU MOBILE */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE LIST */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-primary/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
