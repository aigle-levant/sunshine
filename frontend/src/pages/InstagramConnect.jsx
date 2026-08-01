import { useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeInstagram, saveInstagramAnalysis } from "../services/instagram.js";
import demoUser from "../constants/demoUser.js";
import useTheme from "../hooks/useTheme.jsx";

function InstagramConnect() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [brandContext, setBrandContext] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setSuccessMessage("");

    if (!username.trim()) {
      setError("Please enter an Instagram username");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeInstagram(username);
      setProfile(result.profile);
      setBrandContext(result.brandContext);
    } catch (err) {
      setError(err.message || "Failed to analyze profile");
      setProfile(null);
      setBrandContext(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    setError("");
    setSuccessMessage("");

    if (!profile || !brandContext) {
      setError("No analysis to save");
      return;
    }

    setSaving(true);
    try {
      await saveInstagramAnalysis(demoUser.id, username, profile, brandContext);
      setSuccessMessage("Instagram analysis saved successfully!");

      setTimeout(() => {
        navigate("/dashboard/marketing-strategy", { state: { profile, brandContext } });
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to save analysis");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleAnalyze();
    }
  };

  const textColor = isLight ? "text-[#223843]" : "text-[#EFF1F3]";
  const cardBg = isLight ? "bg-white border-[#223843]/10" : "bg-[#252525] border-white/10";
  const inputBg = isLight ? "bg-[#F5F5F5] border-[#223843]/15" : "bg-[#333] border-white/15";
  const buttonBg = "bg-[#D77A61] hover:bg-[#C96B53]";
  const accentText = "text-[#D77A61]";

  return (
    <div className={`max-w-2xl ${textColor}`}>
      <p className={`mb-8 text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
        Connect your Instagram account to analyze your brand and get strategic insights
      </p>

      {/* Input Section */}
        <div className={`mb-6 rounded-2xl border p-6 ${cardBg}`}>
          <label className="mb-3 block text-sm font-semibold">Instagram Username</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="@nike"
                disabled={loading}
                className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-300 ${inputBg} ${
                  loading ? "opacity-50" : ""
                } ${isLight ? "placeholder-[#223843]/40" : "placeholder-[#EFF1F3]/40"}`}
              />
            </div>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className={`rounded-lg px-6 py-3 font-semibold text-white transition-colors duration-300 ${buttonBg} ${
                loading ? "opacity-50" : ""
              }`}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : "Analyse Account"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex gap-3 ${accentText}`}>
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className={`mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 flex gap-3 text-green-600`}>
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Profile Display */}
        {profile && (
          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <div className="flex gap-6">
              {profile.profilePic && (
                <img
                  src={profile.profilePic}
                  alt={profile.username}
                  className="h-24 w-24 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile.fullName || profile.username}</h2>
                <p className={`text-sm ${isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}`}>
                  @{profile.username}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                      Followers
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      {profile.followers?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                      Posts
                    </p>
                    <p className="mt-1 text-lg font-bold">{profile.postsCount || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                      Category
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {profile.businessCategory || "Personal"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.biography && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                  Bio
                </p>
                <p className={`mt-2 text-sm leading-6 ${isLight ? "text-[#223843]/80" : "text-[#EFF1F3]/80"}`}>
                  {profile.biography}
                </p>
              </div>
            )}

            {/* Latest Captions */}
            {profile.latestPosts && profile.latestPosts.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                  Latest 5 Captions
                </p>
                <div className="mt-3 space-y-3">
                  {profile.latestPosts.slice(0, 5).map((post, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 text-sm leading-6 ${
                        isLight ? "bg-[#223843]/5" : "bg-white/5"
                      }`}
                    >
                      {post.caption || "(No caption)"}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Context Summary */}
            {brandContext && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#D77A61]">
                  Brand Analysis
                </p>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Brand Tone</p>
                    <p className={isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"}>
                      {brandContext.brandTone}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Audience</p>
                    <p className={isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"}>
                      {brandContext.audience}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Content Pillars</p>
                    <p className={isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"}>
                      {brandContext.contentPillars?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Posting Frequency</p>
                    <p className={isLight ? "text-[#223843]/70" : "text-[#EFF1F3]/70"}>
                      {brandContext.postingFrequency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveAnalysis}
              disabled={saving}
              className={`mt-6 w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors duration-300 ${buttonBg} ${
                saving ? "opacity-50" : ""
              }`}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={18} className="animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Brand Analysis"
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!profile && !loading && (
          <div className={`rounded-2xl border border-dashed p-12 text-center ${isLight ? "border-[#223843]/20" : "border-white/20"}`}>
            <p className={isLight ? "text-[#223843]/60" : "text-[#EFF1F3]/60"}>
              Enter an Instagram username to get started with brand analysis
            </p>
          </div>
        )}
    </div>
  );
}

export default InstagramConnect;
