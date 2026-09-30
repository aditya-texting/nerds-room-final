import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { X } from 'lucide-react';

const Footer = () => {
  const { socialLinks, footerDescription, navigate } = useAppData();
  const [showTerms, setShowTerms] = useState(false);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      if (path.includes('#')) {
        const id = path.split('#')[1];
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <footer className="bg-[#202124] text-white relative rounded-t-[40px] md:rounded-t-[60px] mt-8 md:mt-12">
        <div className="mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 pt-16 md:pt-20 lg:pt-24 pb-6 md:pb-8">
          <div className="flex flex-col gap-12 md:gap-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20">
              {/* Logo & Description */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Nerds Room Logo"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-lg"
                  />
                  <span className="font-black text-2xl tracking-tight text-white">
                    nerds room<span className="text-nerdLime">.</span>
                  </span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed max-w-[250px]">
                  {footerDescription}
                </p>
              </div>

              {/* About */}
              <div className="flex flex-col gap-5">
                <h3 className="text-white text-base font-semibold">About</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="/#home"
                    onClick={(e) => handleNav(e, '/#home')}
                    className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    About Us
                  </a>
                  <a
                    href="/events"
                    onClick={(e) => handleNav(e, '/events')}
                    className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    Events
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-5">
                <h3 className="text-white text-base font-semibold">Resources</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="/#who-we-are"
                    onClick={(e) => handleNav(e, '/#who-we-are')}
                    className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    Who We Are
                  </a>
                  <a
                    href="/#gallery"
                    onClick={(e) => handleNav(e, '/#gallery')}
                    className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    Gallery
                  </a>
                  <a
                    href="/#testimonials"
                    onClick={(e) => handleNav(e, '/#testimonials')}
                    className="text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    Testimonials
                  </a>
                </div>
              </div>

              {/* Follow Us */}
              <div className="flex flex-col gap-5">
                <h3 className="text-white text-base font-semibold">Join the Movement</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-gray-400 group-hover:text-green-500 transition-colors"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.928 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-2.846-.823-.927-.38-1.529-.949-1.618-1.071-.087-.121-.654-.872-.654-1.658 0-.787.408-1.171.554-1.328.163-.17.356-.211.475-.211.119 0 .238.001.335.006.108.005.253-.042.404.321.163.393.555 1.357.604 1.456.048.1.08.216.012.353-.068.136-.102.221-.202.341-.1.121-.212.27-.3.364-.1.107-.205.223-.088.423.117.201.517.853 1.107 1.379.76.677 1.401.887 1.606.985.205.098.326.084.448-.055.122-.139.524-.61.664-.818.14-.208.28-.173.473-.102.194.071 1.229.58 1.44.685.211.105.352.157.404.248.052.091.052.529-.092.934zM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C9.813 20 7.828 19.263 6.307 18.064L3.84 18.783L4.621 16.326C3.308 14.771 2.502 12.684 2.502 10.422C2.502 5.176 6.703 0.941 12 0.941C17.297 0.941 21.498 5.176 21.498 10.422C21.498 15.668 17.297 20 12 20Z"></path>
                    </svg>
                    <span>Join our WhatsApp Channel</span>
                  </a>
                  <a
                    href={socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-gray-400 group-hover:text-[#5865F2] transition-colors"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.516.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041-.001-.09-.041-.106-.653-.248-1.275-.55-1.872-.892a.077.077 0 0 1-.008-.128 10.2 10.2 0 0 1 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                    </svg>
                    <span>Join us on Discord</span>
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-gray-400 group-hover:text-pink-500 transition-colors"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 text-base hover:text-white hover:translate-x-1 transition-all duration-200 group"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="text-gray-400 group-hover:text-blue-400 transition-colors"
                    >
                      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.024-1.627 4.475-1.559.101.015.322.037.466.155.121.1.155.234.166.326.012.066.012.135 0 .199z"></path>
                    </svg>
                    <span>Join us on Telegram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                <div className="text-gray-400 text-base font-medium">© Nerds Room. All rights reserved.</div>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setShowTerms(true)}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Terms & Conditions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showTerms && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowTerms(false)}>
            <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-black mb-6">Terms & Conditions</h3>

              <div className="space-y-4 text-sm text-slate-600 font-medium leading-relaxed">
                <p>
                  Events hosted by external organizers are solely their responsibility. Nerds Room acts only as a platform and is not liable for event execution, disputes, or refunds.
                </p>
                <p>
                  By registering, users consent to relevant data being shared with organizers, partners, or authorities where applicable. Nerds Room is not responsible for third-party data handling.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2.5 bg-nerdBlue text-white rounded-xl font-bold text-sm hover:bg-nerdDark transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}
      </footer>
    </>
  );
};

export default Footer;
