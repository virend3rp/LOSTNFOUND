import React from "react";
import NavBar from "../components/NavBar.jsx";
import { Link } from "react-router-dom"; // For routing between pages

const HomePage = () => {
  return (
    <div style={styles.container}>
      <NavBar />
      <div style={styles.content}>
        <img
          src="your-brand-photo-path.jpg"
          alt="Brand"
          style={styles.brandImage}
        />
        <div style={styles.buttonsContainer}>
          <Link to="/help-others" style={styles.button}>
            Help Others Find their Stuff
          </Link>
          <Link to="/lost-something" style={styles.button}>
            Did you Lose Something?
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#f4f4f9",
    minHeight: "100vh",
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  brandImage: {
    width: "250px",
    height: "auto",
    marginBottom: "30px",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  button: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "16px",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
};

export default HomePage;
