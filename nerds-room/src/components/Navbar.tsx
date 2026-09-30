import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { navigate } = useAppData();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const hash = href.startsWith('#') ? href : href.substring(href.indexOf('#'));
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home with hash — main.tsx pushstate handler will scroll to section
      navigate('/' + hash);
    }
  };

  return (
    <>
      {/* Navbar pill */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-[100] w-full px-4 pt-4 pointer-events-none"
      >
        <div className="relative max-w-[95vw] sm:max-w-fit mx-auto px-4 sm:px-6 md:px-8 h-12 sm:h-14 flex justify-between items-center gap-4 sm:gap-8 md:gap-12 bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-full pointer-events-auto transition-all duration-300">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-3 group z-50 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <img
              src="/logo.png"
              alt="Nerds Room Logo"
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-black text-lg sm:text-2xl tracking-tight text-nerdBlue whitespace-nowrap">
              nerds room<span className="text-nerdLime">.</span>
            </span>
          </a>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 font-medium text-nerdDark text-[15px]">
              <a
                href="/"
                className="hover:text-nerdBlue transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                }}
              >
                Home
              </a>
              <a
                href="/events"
                className="hover:text-nerdBlue transition-colors"
                onClick={(e) => { e.preventDefault(); navigate('/events'); }}
              >
                Events
              </a>
              <a
                href="/chapters"
                className="hover:text-nerdBlue transition-colors"
                onClick={(e) => { e.preventDefault(); navigate('/chapters'); }}
              >
                Chapters
              </a>
              <a
                href="#who-we-are"
                className="hover:text-nerdBlue transition-colors"
                onClick={(e) => handleSmoothScroll(e, '#who-we-are')}
              >
                Who We Are
              </a>
            </div>

            {/* Hamburger */}
            <button
              id="mobile-menu-btn"
              className="lg:hidden text-nerdBlue p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {user ? (
              <button
                onClick={signOut}
                className="hidden sm:flex items-center justify-center bg-nerdBlue text-white font-bold px-6 py-2.5 rounded-lg border border-transparent hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-md hover:shadow-none text-sm tracking-wide"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                className="hidden sm:flex items-center justify-center bg-nerdBlue text-white font-bold px-6 py-2.5 rounded-lg border border-transparent hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-md hover:shadow-none text-sm tracking-wide"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu — rendered OUTSIDE the pointer-events-none nav */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[72px] bg-white border-b-2 border-nerdBlue shadow-xl p-6 lg:hidden z-[200] overflow-y-auto max-h-[80vh]"
        >
          <div className="flex flex-col space-y-4 font-bold text-nerdBlue text-lg">
            <a
              href="/"
              className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
            >
              HOME <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
            </a>
            <a
              href="/events"
              className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
              onClick={(e) => { e.preventDefault(); navigate('/events'); setMobileMenuOpen(false); }}
            >
              EVENTS <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
            </a>
            <a
              href="/chapters"
              className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
              onClick={(e) => { e.preventDefault(); navigate('/chapters'); setMobileMenuOpen(false); }}
            >
              CHAPTERS <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
            </a>
            <a
              href="#who-we-are"
              className="mobile-link p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
              onClick={(e) => handleSmoothScroll(e, '#who-we-are')}
            >
              WHO WE ARE <span className="text-nerdLime opacity-0 group-hover:opacity-100 transition-opacity">-&gt;</span>
            </a>

            {user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); signOut(); }}
                className="bg-nerdBlue text-white text-center py-3 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-colors font-black"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={(e) => { e.preventDefault(); navigate('/login'); setMobileMenuOpen(false); }}
                className="bg-nerdBlue text-white text-center py-3 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-colors font-black"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close menu on outside click */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[150] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
