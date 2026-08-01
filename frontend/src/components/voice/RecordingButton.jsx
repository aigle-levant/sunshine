// src/components/RecordingButton.jsx

export default function RecordingButton({
  isRecording,
  onStart,
  onStop,
  disabled = false,
}) {
  const handleClick = () => {
    if (disabled) return;

    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-200
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : isRecording
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
        }
      `}
    >
      {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
    </button>
  );
}
