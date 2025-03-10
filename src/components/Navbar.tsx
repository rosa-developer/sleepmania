
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be connected to your auth system
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    // This would be connected to your auth system
    setIsLoggedIn(false);
    toast.success("You have been logged out");
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sleep Analysis", path: "/analysis" },
    { name: "Sleep Tracker", path: "/tracker" },
    { name: "Features", path: "#", 
      dropdown: [
        { name: "Sleep Technology", path: "/technology" },
        { name: "Smart Alarm", path: "/smart-alarm" },
        { name: "Sleep Coaching", path: "/coaching" },
        { name: "Health Integration", path: "/health-integration" },
      ] 
    },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container-custom flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
          aria-label="EasySleep Home"
        >
          <span className="text-sleep-800 font-['Playfair_Display'] text-2xl font-bold tracking-tighter group-hover:text-sleep-600 transition-colors">
            easy
            <span className="text-sleep-500 group-hover:text-sleep-400 transition-colors">sleep</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.dropdown ? (
                <>
                  <button
                    className={cn(
                      "text-slate-700 hover:text-sleep-500 transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sleep-500 after:origin-center after:scale-x-0 after:transition-transform hover:after:scale-x-100 flex items-center",
                      location.pathname === link.path && "text-sleep-500 after:scale-x-100"
                    )}
                  >
                    {link.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1 rounded-md bg-white shadow-xs">
                      {link.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-sleep-50 hover:text-sleep-500"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={cn(
                    "text-slate-700 hover:text-sleep-500 transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sleep-500 after:origin-center after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                    location.pathname === link.path && "text-sleep-500 after:scale-x-100"
                  )}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Authentication Controls */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate("/login")}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Log in
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => navigate("/signup")}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Sign up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 shadow-lg overflow-y-auto"
        >
          <nav className="flex flex-col space-y-4 pt-4">
            {navLinks.map((link) => (
              <>
                {link.dropdown ? (
                  <div key={link.name} className="py-2 px-4">
                    <div className="font-medium text-slate-800 mb-2">{link.name}</div>
                    <div className="pl-4 space-y-2 border-l border-slate-100">
                      {link.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className="block py-1 text-slate-700 hover:text-sleep-500"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "text-slate-700 py-2 px-4 rounded-md hover:bg-slate-100 hover:text-sleep-500 transition-colors",
                      location.pathname === link.path && "bg-slate-100 text-sleep-500"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </>
            ))}
            <div className="border-t border-gray-200 my-2 pt-2"></div>
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign up
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              className="justify-start" 
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
