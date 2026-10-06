import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center justify-center h-screen w-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* center content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-3xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-teal-500 rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-md">
            G
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Welcome to Goal Finder
        </h1>
        <p className="text-lg md:text-xl mt-2 text-teal-200">
          AI-driven academic and career guidance system
        </p>

        {/* Info Card */}
        <div className="bg-white/10 backdrop-blur-lg mt-8 rounded-2xl p-8 w-full shadow-lg">
          <p className="text-white/90 mb-4 text-justify md:text-left">
            Discover your perfect career path with AI-powered recommendations based on
            your academic performance, interests, and aspirations.
          </p>

          <ul className="list-disc list-inside space-y-2 text-white/80 text-left">
            <li>Personalized career guidance for 10th and 12th grade students</li>
            <li>Smart recommendations for streams, colleges, and courses</li>
            <li>Information on government colleges, scholarships, and admissions</li>
            <li>24/7 AI chatbot support for instant guidance</li>
          </ul>

          {/* Get Started button */}
          <button
            onClick={() => navigate("/signup")}
            className="w-full mt-6 bg-teal-500 text-white font-semibold py-3 rounded-xl hover:bg-teal-600 transition-transform transform hover:scale-[1.02]"
          >
            Get Started
          </button>

          {/* Login link */}
          <p className="text-sm text-white/70 mt-4 text-center">
            Already have an account?{" "}
           <button
    type="button"
    onClick={() => navigate("/login")}
    className="text-teal-600 hover:underline ml-1"
    style={{
      background: "none",
      border: "none",
      boxShadow: "none",
      outline: "none",
    }}
  >
    Login here
  </button>
          </p>
        </div>
      </div>
    </div>
  );
}
