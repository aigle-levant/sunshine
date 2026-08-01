import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import useTheme from "../hooks/useTheme";
import { signInWithPassword } from "../services/auth";

function Login() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signInWithPassword(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: error.message || "Failed to sign in" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseClass = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium`;
  const inputLightClass = `bg-white border-[#D8B4A0] text-[#223843] placeholder-[#223843]/50 focus:border-[#D77A61] focus:outline-none focus:ring-2 focus:ring-[#D77A61]/20`;
  const inputDarkClass = `bg-[#223843]/50 border-[#D77A61]/30 text-[#EFF1F3] placeholder-[#EFF1F3]/50 focus:border-[#D77A61] focus:outline-none focus:ring-2 focus:ring-[#D77A61]/30`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 py-12 transition-colors duration-500 ${
        isLight ? "bg-[#EFF1F3]" : "bg-[#223843]"
      }`}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link
            to="/"
            className={`inline-block text-3xl font-semibold tracking-tighter mb-8 transition-colors ${
              isLight ? "text-[#223843]" : "text-[#EFF1F3]"
            }`}
          >
            VoiceKart AI
            <span className="text-[#D77A61]">.</span>
          </Link>

          <h1
            className={`text-2xl font-semibold mb-2 ${
              isLight ? "text-[#223843]" : "text-[#EFF1F3]"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${
              isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"
            }`}
          >
            Sign in to your VoiceKart AI account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isLight ? "text-[#223843]" : "text-[#EFF1F3]"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className={`absolute left-4 top-3.5 ${
                  isLight
                    ? "text-[#223843]/50"
                    : "text-[#EFF1F3]/50"
                }`}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`${inputBaseClass} ${
                  isLight ? inputLightClass : inputDarkClass
                } pl-11`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isLight ? "text-[#223843]" : "text-[#EFF1F3]"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className={`absolute left-4 top-3.5 ${
                  isLight
                    ? "text-[#223843]/50"
                    : "text-[#EFF1F3]/50"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`${inputBaseClass} ${
                  isLight ? inputLightClass : inputDarkClass
                } pl-11 pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 transition-colors"
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className={`${
                      isLight
                        ? "text-[#223843]/50 hover:text-[#223843]"
                        : "text-[#EFF1F3]/50 hover:text-[#EFF1F3]"
                    }`}
                  />
                ) : (
                  <Eye
                    size={18}
                    className={`${
                      isLight
                        ? "text-[#223843]/50 hover:text-[#223843]"
                        : "text-[#EFF1F3]/50 hover:text-[#EFF1F3]"
                    }`}
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-500">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#D77A61] text-[#EFF1F3] font-semibold transition-all duration-300 hover:bg-[#C96B53] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div
            className={`h-px ${
              isLight ? "bg-[#223843]/10" : "bg-[#EFF1F3]/10"
            }`}
          />
          <span
            className={`absolute left-1/2 -translate-x-1/2 -top-3 px-3 text-xs font-medium ${
              isLight
                ? "bg-[#EFF1F3] text-[#223843]/70"
                : "bg-[#223843] text-[#EFF1F3]/70"
            }`}
          >
            Don't have an account?
          </span>
        </div>

        {/* Sign Up Link */}
        <Link
          to="/signup"
          className={`block w-full py-3 rounded-lg border-2 text-center font-semibold transition-all duration-300 ${
            isLight
              ? "border-[#223843]/20 text-[#223843] hover:bg-[#223843]/5"
              : "border-[#EFF1F3]/20 text-[#EFF1F3] hover:bg-[#EFF1F3]/5"
          }`}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
