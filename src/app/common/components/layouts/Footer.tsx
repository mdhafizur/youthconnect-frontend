const Footer: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <footer className={`bg-gray-900 text-white p-4 text-center ${className}`}>
      <p>&copy; 2024 YouthConnect. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
