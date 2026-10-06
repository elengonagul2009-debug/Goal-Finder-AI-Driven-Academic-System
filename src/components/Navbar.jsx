import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a1a2f] text-white flex items-center justify-between px-8 py-4 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center gap-2 text-xl md:text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="bg-teal-500 rounded-lg px-2 py-1 text-white">G</div>
        <span>Goal Finder</span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden sm:flex items-center gap-8 text-sm font-medium">
        <button
          onClick={() => navigate("/")}
          className="hover:text-teal-400 transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => navigate("/about")}
          className="hover:text-teal-400 transition-colors"
        >
          About
        </button>
        <button
          onClick={() => navigate("/contact")}
          className="hover:text-teal-400 transition-colors"
        >
          Contact
        </button>

        <div className="flex items-center gap-2">
          <span className="text-yellow-400">🌙</span>
          <select className="bg-transparent outline-none cursor-pointer text-white">
            <option>English</option>
            <option>Tamil</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="hover:text-teal-400 transition-colors"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="bg-black/60 px-4 py-2 rounded-md hover:bg-black/80 transition-colors"
        >
          Sign Up
        </button>
      </nav>
    </header>
  );
}
