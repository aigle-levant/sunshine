// src/hooks/useRecorder.js

import { useRef, useState } from "react";

export default function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder) {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        // Stop microphone
        streamRef.current?.getTracks().forEach((track) => track.stop());

        setIsRecording(false);

        resolve(audioBlob);
      };

      recorder.stop();
    });
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
