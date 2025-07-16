'use client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import '@/styles/navigationbar.css';
import { faBars, faCartShopping, faRightFromBracket, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cart from './cart';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact Us' },
] as const;

// Animation variants
const mobileMenuVariants = {
  closed: { x: '-100%', opacity: 0 },
  open: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 30 }
  }
};

const cartBadgeVariants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 25 }
  }
};

export default function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, openCart } = useCart();
  const router = useRouter();

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'unset';
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropDown(false);
  };

  const handleMobileProfile = () => {
    router.push('/dashboard');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDropDown(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const renderNavLinks = () => (
    <motion.ul 
      className="nav-links" 
      role="navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {navLinks.map(({ href, label }) => (
        <motion.li 
          key={href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            className={`nav-link ${pathname === href ? 'active' : ''}`}
            href={href}
            onClick={() => setMobileMenuOpen(false)}
            aria-current={pathname === href ? 'page' : undefined}
          >
            {label}
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );

  const renderAuthSection = () => (
    <div className="auth-section">
      {isAuthenticated && user ? (
        <>
          <motion.div 
            className="welcome-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-label={`Welcome back, ${user.username}`}
          >
            Welcome back, {user.username}
          </motion.div>
          <div className="profile-container" ref={dropdownRef}>
            <motion.button
              className="profile-pic"
              onClick={() => setDropDown(!dropDown)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={dropDown}
              aria-haspopup="true"
              aria-label="Profile menu"
            >
              <Image
                src={user.avatar_url}
                alt={`${user.username}'s profile`}
                width={40}
                height={40}
                className={mobileMenuOpen ? 'mobile-pro-pic' : 'desktop-pro-pic'}
                onClick={mobileMenuOpen ? handleMobileProfile : undefined}
              />
            </motion.button>
            <AnimatePresence>
              {dropDown && (
                <motion.ul 
                  className="dropdown-menu"
                  role="menu"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {['My Account', 'Orders', 'Addresses'].map((item) => (
                    <motion.li 
                      key={item} 
                      role="none"
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        className="dropdown-link"
                        href="/account/dashboard"
                        role="menuitem"
                        onClick={() => setDropDown(false)}
                      >
                        {item}
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li 
                    role="none"
                    whileHover={{ x: 5 }}
                    className='button-container'
                  >
                    <button
                      className="dropdown-link"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      Log Out <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>
                  </motion.li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="auth-buttons">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link className="auth-button login" href="/auth/login">
              Log in
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link className="auth-button register" href="/auth/register">
              Register
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <motion.header 
      role="banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="top-tab" 
        role="alert" 
        aria-live="polite"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p>FREE SHIPPING ON ALL ORDERS</p>
      </motion.div>
      
      {/* Mobile Navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <div className="navbar-container">
          <motion.button
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </motion.button>
          
          <Link href="/homepage" className="nav-logo">
            <Image
              src="https://crownhairfibers.com/wp-content/uploads/2019/05/gold-crown.png"
              alt="Crown Logo"
              width={100}
              height={40}
              priority
            />
          </Link>
          
          <motion.button
            className="cart-icon"
            onClick={openCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <FontAwesomeIcon icon={faCartShopping} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span 
                  className="cart-badge"
                  variants={cartBadgeVariants}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  aria-label={`${itemCount} items in cart`}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="mobile-menu"
                role="dialog"
                aria-modal="true"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="menu-contents">
                  <div className="mobile-menu-header">
                    <motion.button
                      className="close-menu"
                      onClick={toggleMobileMenu}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close menu"
                    >
                      <FontAwesomeIcon icon={faX} />
                    </motion.button>
                  </div>
                  {renderNavLinks()}
                </div>
                <div className="align-down">{renderAuthSection()}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <Cart />

      {/* Desktop Navigation */}
      <nav className="desktop-nav" aria-label="Desktop navigation">
        <div className="navbar-container">
          <div className="nav-container navigations">{renderNavLinks()}</div>
          
          <Link href="/homepage" className="nav-logo">
            <img
              src="https://crownhairfibers.com/wp-content/uploads/2019/05/gold-crown.png"
              alt="Crown Logo"
            />
          </Link>
          
          <div className="nav-container">
            {renderAuthSection()}
            <motion.button
              className="cart-icon"
              onClick={openCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    className="cart-badge"
                    variants={cartBadgeVariants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    aria-label={`${itemCount} items in cart`}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}