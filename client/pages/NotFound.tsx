import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, Coffee, AlertTriangle, Sparkles } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
    setMounted(true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.1)_1px,_transparent_0)] bg-[size:30px_30px] opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse delay-2000"></div>
      <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-10 blur-2xl animate-pulse delay-3000"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo Section */}
        {/* <div className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f2aaa14515154ad18f8cfe5439814ab435d6222d?width=793"
              alt="Chhong Cafe & BBQ Logo"
              className="w-full max-w-xs h-auto rounded-2xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce">
              <AlertTriangle className="h-4 w-4 text-white m-1" />
            </div>
          </div>
        </div> */}

        {/* Main Content Card */}
        <div className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12 max-w-2xl w-full text-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* 404 Number with Animation */}
          <div className="relative mb-6">
            <h1 className="text-8xl sm:text-9xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-spin" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Looks like you've wandered off the menu! The page you're looking for doesn't exist.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50/80 rounded-full px-4 py-2 mx-auto w-fit">
              <Coffee className="h-4 w-4" />
              <span>But don't worry, our coffee is still brewing!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <Home className="h-5 w-5" />
                <span>Back to Menu</span>
              </div>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-2xl border-2 border-gray-200/50 hover:border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center gap-3">
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </div>
            </button>
          </div>

          {/* Fun Fact */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200/50">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-purple-600">Fun Fact:</span> 
              While you're here, did you know our BBQ sauce has 12 secret ingredients? 🤫
            </p>
          </div>
        </div>

        {/* Animated Coffee Icons */}
        <div className={`mt-8 flex gap-4 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <Coffee className="h-4 w-4 text-white" />
            </div>
          ))}
        </div>

        {/* Footer Message */}
        <div className={`mt-8 transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm text-gray-500">
            Lost? Try checking our delicious{" "}
            <button
              onClick={() => navigate("/")}
              className="text-purple-600 hover:text-purple-700 font-semibold underline decoration-2 underline-offset-2 hover:decoration-purple-300 transition-colors duration-300"
            >
              menu
            </button>{" "}
            instead!
          </p>
        </div>

        {/* Breadcrumb Info */}
        <div className={`mt-6 text-xs text-gray-400 font-mono bg-gray-100/50 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-1000 delay-1200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Attempted route: <span className="text-red-500 font-semibold">{location.pathname}</span>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-1/4 right-1/4 animate-float">
        <div className="w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-float delay-1000">
        <div className="w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-3/4 right-1/3 animate-float delay-2000">
        <div className="w-5 h-5 bg-blue-400 rounded-full opacity-60"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;