"use client";

export function Footer() {
  return (
    <footer className="py-8 bg-[#18181B] border-t border-[#333]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1 text-xl font-serif font-semibold">
            <span className="text-[#F5F2ED]">Zahar</span>
            <span className="text-[#C9673A]">Go</span>
          </a>

          {/* Copyright */}
          <p className="text-sm text-[#666]">
            {new Date().getFullYear()} ZaharGo. Все права защищены.
          </p>

          {/* Social links placeholder */}
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/zaharich777" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#888] hover:text-[#C9673A] transition-colors text-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
