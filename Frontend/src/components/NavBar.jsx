import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaPlusCircle, FaUserCircle } from 'react-icons/fa';  // Importing icons from react-icons

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <img src="your-logo-path.png" alt="Logo" style={styles.logo} />
      </div>
      <div style={styles.right}>
        <Link to="/all-tickets" style={styles.link}>
          <FaTicketAlt style={styles.icon} />
          All Tickets
        </Link>
        <Link to="/raise-ticket" style={styles.link}>
          <FaPlusCircle style={styles.icon} />
          Raise a Ticket
        </Link>
        <Link to="/profile" style={styles.link}>
          <FaUserCircle style={styles.icon} />
          Profile
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px',
    width: 'auto',
  },
  right: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  icon: {
    marginRight: '8px',
  },
};

export default Navbar;
