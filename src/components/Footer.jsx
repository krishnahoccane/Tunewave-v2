const Footer = () => {
  return (
    <footer
      style={{
        padding: "1rem",
        background: "#282c34",
        color: "white",
        textAlign: "center",
        position: "fixed", 
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <p>© {new Date().getFullYear()} Tunewave prvt lim.</p>
    </footer>
  );
};

export default Footer;
