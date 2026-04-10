"use client";

export function Footer() {
  return (
    <footer className="py-8 bg-surface-dark border-t border-surface-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1 text-xl font-serif font-semibold">
            <span className="text-text-dark-primary">Zahar</span>
            <span className="text-primary">Go</span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-text-dark-muted">
            {new Date().getFullYear()} ZaharGo. Все права защищены.
          </p>

          {/* Social links placeholder */}
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/zaharich777" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-dark-secondary hover:text-primary transition-colors text-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
