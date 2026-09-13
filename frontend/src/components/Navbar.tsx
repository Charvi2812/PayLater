import payLaterLogo from '../assets/paylater-logo.svg';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-3">
            <img src={payLaterLogo} alt="PayLater" className="h-10 w-12 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">PayLater</span>
               
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
