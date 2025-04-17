"use client";
import { useState, useEffect, useRef } from "react";
import { Heart, Music, Pause, Edit, X, Send, Sparkles } from "lucide-react";

export const EnhancedLoveAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("I Love You!");
  const [subMessage, setSubMessage] = useState(
    "Every moment with you is magical ✨"
  );
  const [animationSpeed, setAnimationSpeed] = useState(2);
  const [heartCount, setHeartCount] = useState(3);
  const [theme, setTheme] = useState("pink");
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  // Theme color schemes
  const themes = {
    pink: {
      primary: "pink-600",
      secondary: "purple-700",
      gradient: "from-pink-100 to-purple-200",
      button: "bg-pink-500 hover:bg-pink-600",
      accent: "pink-100",
      text: "pink-700",
    },
    red: {
      primary: "red-600",
      secondary: "rose-700",
      gradient: "from-red-50 to-rose-200",
      button: "bg-red-500 hover:bg-red-600",
      accent: "red-100",
      text: "red-700",
    },
    blue: {
      primary: "blue-600",
      secondary: "indigo-700",
      gradient: "from-blue-100 to-indigo-200",
      button: "bg-blue-500 hover:bg-blue-600",
      accent: "blue-100",
      text: "blue-700",
    },
    green: {
      primary: "emerald-600",
      secondary: "teal-700",
      gradient: "from-emerald-100 to-teal-200",
      button: "bg-emerald-500 hover:bg-emerald-600",
      accent: "emerald-100",
      text: "emerald-700",
    },
  };

  const currentTheme = themes[theme];

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      // Set up audio event listeners
      const audio = audioRef.current;

      const handleCanPlayThrough = () => {
        setAudioLoaded(true);
      };

      const handleEnded = () => {
        setIsPlaying(false);
      };

      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      audio.addEventListener("ended", handleEnded);

      // Preload the audio
      audio.load();

      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  // Generate random hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Limit the number of hearts on screen
      if (hearts.length > 30) {
        setHearts((prev) => prev.slice(1));
      }

      // Create multiple hearts based on heartCount
      const newHearts = [];
      for (let i = 0; i < heartCount; i++) {
        newHearts.push({
          id: Date.now() + i,
          size: Math.floor(Math.random() * 40) + 20,
          x: Math.floor(Math.random() * 80) + 10,
          y: 100,
          rotation: Math.floor(Math.random() * 40) - 20,
          color: ["red", "pink", "purple", "rose-500", "fuchsia-400"][
            Math.floor(Math.random() * 5)
          ],
        });
      }

      setHearts((prev) => [...prev, ...newHearts]);
    }, 800);

    return () => clearInterval(interval);
  }, [hearts.length, heartCount]);

  // Generate sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      if (sparkles.length > 20) {
        setSparkles((prev) => prev.slice(1));
      }

      const newSparkle = {
        id: Date.now(),
        size: Math.floor(Math.random() * 15) + 5,
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        opacity: 1,
        duration: Math.random() * 3 + 2,
      };

      setSparkles((prev) => [...prev, newSparkle]);
    }, 300);

    return () => clearInterval(interval);
  }, [sparkles.length]);

  // Animate hearts floating up
  useEffect(() => {
    const animation = setInterval(() => {
      setHearts((prev) =>
        prev.map((heart) => ({
          ...heart,
          y: heart.y - animationSpeed,
        }))
      );

      // Fade out sparkles
      setSparkles((prev) =>
        prev.map((sparkle) => ({
          ...sparkle,
          opacity: sparkle.opacity > 0 ? sparkle.opacity - 0.01 : 0,
        }))
      );
    }, 50);

    return () => clearInterval(animation);
  }, [animationSpeed]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Any responsive adjustments can go here
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Audio control functions with improved error handling
  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Create a user interaction promise
        const playPromise = audioRef.current.play();

        // Handle the promise to avoid interruption errors
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.error("Audio playback failed:", err);
              setIsPlaying(false);
            });
        }
      }
    } catch (error) {
      console.error("Audio toggle error:", error);
      setIsPlaying(false);
    }
  };

  // Interactive functions
  const handleSaveMessage = () => {
    setIsEditing(false);
  };

  const changeTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  // Create a heart burst effect when clicking on the container
  const createHeartBurst = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const burstHearts = [];
    for (let i = 0; i < 10; i++) {
      burstHearts.push({
        id: Date.now() + i * 100,
        size: Math.floor(Math.random() * 30) + 10,
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 20 - 10),
        rotation: Math.floor(Math.random() * 360),
        color: ["red", "pink", "purple", "rose-500", "fuchsia-400"][
          Math.floor(Math.random() * 5)
        ],
      });
    }

    setHearts((prev) => [...prev, ...burstHearts]);
  };

  return (
    <div
      ref={containerRef}
      onClick={createHeartBurst}
      className={`relative flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-br ${currentTheme.gradient}`}
    >
      {/* Sparkles animation */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-yellow-300"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            transition: `opacity ${sparkle.duration}s ease-out`,
          }}
        >
          <Sparkles fill="currentColor" />
        </div>
      ))}

      {/* Floating hearts animation */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className={`absolute text-${heart.color} animate-pulse`}
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            opacity: Math.min(1, (100 - heart.y) / 50),
            transform: `rotate(${heart.rotation}deg)`,
            transition: "transform 0.5s ease",
          }}
        >
          <Heart fill="currentColor" />
        </div>
      ))}

      {/* Love message card */}
      <div
        className={`z-10 flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-lg w-full max-w-md mx-4 transform transition-all hover:scale-105 duration-300`}
      >
        {isEditing ? (
          <div className="w-full space-y-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 text-xl font-bold text-center border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your message"
              maxLength={30}
            />
            <textarea
              value={subMessage}
              onChange={(e) => setSubMessage(e.target.value)}
              className="w-full p-2 text-center border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your sub-message"
              rows={2}
              maxLength={60}
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSaveMessage}
                className={`flex items-center px-4 py-2 text-white rounded ${currentTheme.button}`}
              >
                <Send size={16} className="mr-1" /> Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2
              className={`mb-6 text-3xl font-bold text-${currentTheme.primary}`}
            >
              {message}
            </h2>
            <div className="flex justify-center w-full mb-4 relative hover:animate-bounce">
              <Heart
                className={`text-${currentTheme.primary}`}
                size={64}
                fill="currentColor"
              />
            </div>
            <p className={`mb-6 text-lg text-${currentTheme.secondary}`}>
              {subMessage}
            </p>

            {/* Control buttons */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              <button
                onClick={changeTheme}
                className={`flex items-center px-3 py-2 text-white rounded ${currentTheme.button}`}
              >
                <Sparkles size={16} className="mr-1" /> Change Theme
              </button>
            </div>

            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm text-${currentTheme.text}`}>
                  Animation Speed
                </span>
                <span className={`text-sm text-${currentTheme.text}`}>
                  {animationSpeed}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>

            <div className="w-full mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm text-${currentTheme.text}`}>
                  Heart Intensity
                </span>
                <span className={`text-sm text-${currentTheme.text}`}>
                  {heartCount}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={heartCount}
                onChange={(e) => setHeartCount(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200"
              />
            </div>

            {/* Audio player with better error handling */}
            <div
              className={`flex items-center justify-center w-full p-3 mt-6 rounded-full bg-${currentTheme.accent}`}
            >
              <button
                onClick={togglePlay}
                disabled={!audioLoaded}
                className={`flex items-center justify-center w-10 h-10 text-white rounded-full ${
                  audioLoaded ? currentTheme.button : "bg-gray-400"
                }`}
                title={
                  audioLoaded
                    ? isPlaying
                      ? "Pause music"
                      : "Play music"
                    : "Audio loading..."
                }
              >
                {isPlaying ? <Pause size={20} /> : <Music size={20} />}
              </button>
              <div className={`ml-3 text-${currentTheme.text}`}>
                {!audioLoaded
                  ? "Loading audio..."
                  : isPlaying
                  ? "Now Playing: Love Song"
                  : "Play Love Song"}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Audio element with preload attribute and better error handling */}
      <audio ref={audioRef} preload="auto" loop>
        <source src="https://ia600104.us.archive.org/8/items/arctic-monkeys-i-wanna-be-yours/Arctic%20Monkeys%20-%20I%20Wanna%20Be%20Yours.mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 text-pink-300 animate-bounce">
          <Heart size={40} fill="currentColor" />
        </div>
        <div className="absolute bottom-20 right-10 text-purple-300 animate-bounce delay-300">
          <Heart size={50} fill="currentColor" />
        </div>
        <div className="absolute top-20 right-20 text-red-300 animate-pulse">
          <Heart size={30} fill="currentColor" />
        </div>
        <div className="absolute bottom-10 left-20 text-fuchsia-300 animate-pulse delay-500">
          <Heart size={45} fill="currentColor" />
        </div>
      </div>

      <div className="absolute bottom-4 text-xs text-center text-gray-500">
        Click anywhere to create hearts! 💕
      </div>
    </div>
  );
};
