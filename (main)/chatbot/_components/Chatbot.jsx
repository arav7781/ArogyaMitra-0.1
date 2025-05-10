"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Send, Brain, Square, Paperclip, Camera, X, ChevronDown } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { UserButton } from '@stackframe/stack';
import '../chat.css';
import GradientText from "@/components/ui/GradientText";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const chatContainerRef = useRef(null);
  const videoRef = useRef(null);
  const threeContainerRef = useRef(null);
  const typingTimeoutsRef = useRef([]);

  // Three.js setup
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeContainerRef.current.appendChild(renderer.domElement);

    // Particle system with color variation
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 6000;
    const posArray = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 200;
      posArray[i + 1] = (Math.random() - 0.5) * 200;
      posArray[i + 2] = (Math.random() - 0.5) * 200;

      // Randomize between cyan, magenta, and white
      const color = Math.random();
      if (color < 0.33) {
        colors[i] = 0; colors[i + 1] = 1; colors[i + 2] = 1; // Cyan
      } else if (color < 0.66) {
        colors[i] = 1; colors[i + 1] = 0; colors[i + 2] = 1; // Magenta
      } else {
        colors[i] = 1; colors[i + 1] = 1; colors[i + 2] = 1; // White
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 50;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Placeholders for the input
  const placeholders = [
    "How can I improve my sleep quality?",
    "What are the symptoms of vitamin D deficiency?",
    "Analyze my recent blood test results",
    "Best exercises for lower back pain relief",
    "How to manage stress and anxiety naturally?",
    "Skin rash identification and treatment options",
    "Recovery timeline for a sprained ankle",
    "Early signs of diabetes to watch for",
    "Home remedies for seasonal allergies",
    "Difference between COVID and flu symptoms",
    "Proper wound care for minor cuts",
    "When to seek help for persistent headaches",
    "Nutrition tips for heart health",
    "Identifying different types of skin moles",
    "Exercises to prevent carpal tunnel syndrome",
    "Managing chronic pain without medication",
    "Signs of concussion after a head injury",
    "Natural ways to lower blood pressure",
    "Understanding my cholesterol numbers",
    "First aid for common sports injuries"
  ];

  // Auto-scrolling effect
  useEffect(() => {
    if (!isUserScrolled && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Set conversation ID
  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  // Handle user scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsUserScrolled(!isBottom);
    };

    const container = chatContainerRef.current;
    if (container) container.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAttachedImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const captureFromCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/jpeg");
    setAttachedImage(dataURL);
    const stream = videoRef.current.srcObject;
    stream?.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  const typeMessage = (messageId, additionalText, delayPerToken, isNeonContent, onComplete) => {
    setChatHistory((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isTyping: true,
              isNeon: false,
              isNeonContent,
              text: isNeonContent ? "" : msg.text,
              isExpanded: isNeonContent ? false : msg.isExpanded,
            }
          : msg
      )
    );

    const tokens = additionalText.split(" ");
    let index = 0;

    const typeNextToken = () => {
      if (index < tokens.length) {
        const token = tokens[index];
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, text: msg.text + token + " " } : msg
          )
        );
        index++;
        const timeoutId = setTimeout(typeNextToken, delayPerToken);
        typingTimeoutsRef.current.push(timeoutId);
      } else {
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isTyping: false } : msg
          )
        );
        if (onComplete) onComplete();
        typingTimeoutsRef.current = [];
      }
    };

    typeNextToken();
  };

  const toggleNeonStream = (messageId) => {
    setChatHistory((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  const stopTyping = () => {
    typingTimeoutsRef.current.forEach(clearTimeout);
    typingTimeoutsRef.current = [];
    setChatHistory((prev) =>
      prev.map((msg) => (msg.isTyping ? { ...msg, isTyping: false } : msg))
    );
    setIsTyping(false);
  };

  const sendMessage = async (baseModel, isThinking) => {
    if (!message.trim() && !attachedImage) return;

    let selectedModel = attachedImage
      ? "meta-llama/llama-4-scout-17b-16e-instruct"
      : isThinking
      ? "qwen-qwq-32b"
      : baseModel;
    let payload = attachedImage
      ? {
          conversation_id: conversationId,
          model: selectedModel,
          image: attachedImage,
          prompt: message || "Analyze this image and provide relevant insights based on the context of the user's request."
        }
      : {
          conversation_id: conversationId,
          model: selectedModel,
          message: message,
        };

    const userMessageId = Date.now();
    let neonId;

    setLoading(true);
    const newHistory = [
      ...chatHistory,
      { id: userMessageId, sender: "user", text: message, image: attachedImage || null },
    ];

    if (isThinking && !attachedImage) {
      neonId = userMessageId + 1;
      newHistory.push({ id: neonId, sender: "ai", text: "Processing in Engaging Neurons... ", isNeon: true });
    }

    setChatHistory(newHistory);
    setMessage("");
    setAttachedImage(null);

    try {
      console.log("Sending payload:", payload); // Debug log
      const response = await fetch(
        attachedImage ? "http://localhost:5000/analyze-image" : "http://localhost:5000/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API response:", data); // Debug log
      const neonContent = data.thinking || "";
      const answer = data.answer || "No response received from the vision model.";

      setLoading(false);

      if (isThinking && neonContent && !attachedImage) {
        setIsTyping(true);
        typeMessage(neonId, neonContent, 10, true, () => {
          const answerId = Date.now() + 2;
          setChatHistory((prev) => [
            ...prev,
            { id: answerId, sender: "ai", text: "", isTyping: true, isNeonContent: false },
          ]);
          typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
        });
      } else if (isThinking && !attachedImage) {
        setChatHistory((prev) => prev.filter((msg) => msg.id !== neonId));
        const answerId = Date.now() + 2;
        setChatHistory((prev) => [
          ...prev,
          { id: answerId, sender: "ai", text: "", isTyping: true, isNeonContent: false },
        ]);
        setIsTyping(true);
        typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
      } else {
        const answerId = Date.now() + 2;
        setChatHistory((prev) => [
          ...prev,
          { id: answerId, sender: "ai", text: "", isTyping: true, isNeonContent: false },
        ]);
        setIsTyping(true);
        typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      if (isThinking && !attachedImage) {
        setChatHistory((prev) => prev.filter((msg) => msg.id !== neonId));
      }
      const errorId = Date.now() + 3;
      setChatHistory((prev) => [
        ...prev,
        { id: errorId, sender: "ai", text: `Error processing request: ${error.message}`, isTyping: false },
      ]);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage("gemma2-9b-it", false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage("gemma2-9b-it", false);
    }
  };

  return (
    <div className="chatbot-container">
      <div id="three-canvas" ref={threeContainerRef}></div>
      <header className="chatbot-header">
        <div className="header-title">
          <BlurFade delay={0.3} inView>
            <h1><GradientText>ArogyaBot 1o</GradientText></h1>
          </BlurFade>
        </div>
        <div className="header-subtitle">
          <UserButton />
        </div>
      </header>

      {cameraActive && (
        <div className="camera-preview-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
          />
          <div className="camera-controls">
            <button onClick={takeSnapshot}>Click</button>
          </div>
        </div>
      )}

      <div className="chat-area" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="welcome-container">
            <BlurFade delay={0.3} inView>
              <div className="welcome-icon">
                <img src="/f2881fdf-d2ac-41a3-8c0a-7e9c30219a74.png" alt="Welcome" />
              </div>
            </BlurFade>
            <BlurFade delay={0.3} inView>
              <h2 className="welcome-title"><GradientText>Welcome to ArogyaMitra</GradientText></h2>
              <p className="welcome-message">Your AI healthcare companion for the future.</p>
              <p className="welcome-message">
                Click <Brain size={18} className="inline-block" /> for advanced analysis.
              </p>
            </BlurFade>
          </div>
        ) : (
          <div className="messages-container">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.isNeon ? (
                    <div>
                      <span>Reasoning</span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  ) : msg.isNeonContent ? (
                    <div className={`neon-stream-container ${msg.isExpanded ? "expanded" : "collapsed"} ${msg.isTyping ? "typing" : ""}`}>
                      <button
                        className="toggle-arrow"
                        onClick={() => toggleNeonStream(msg.id)}
                        title={msg.isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronDown
                          size={18}
                          style={{
                            transform: msg.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        />
                      </button>
                      <div className="text-container">
                        <span className="neon-text">{msg.text}</span>
                        {msg.isTyping && (
                          <>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}
                </div>
                {msg.sender === "user" && msg.image && (
                  <img src={msg.image} alt="Attached image" className="attached-image" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {attachedImage && (
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={attachedImage}
              alt="Preview"
              style={{
                maxHeight: "150px",
                borderRadius: "0.75rem",
                boxShadow: "0 0 8px rgba(0,255,255,0.3)",
              }}
            />
            <button
              onClick={() => setAttachedImage(null)}
              title="Remove image"
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "linear-gradient(45deg, #ff4d4d, #cc0000)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                boxShadow: "0 0 8px rgba(255,77,77,0.5)",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="input-container flex items-center gap-2 p-4">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => document.getElementById("image-upload").click()}
          className="attach-button"
          title="Attach image"
        >
          <Paperclip size={20} />
        </button>
        <button
          type="button"
          onClick={captureFromCamera}
          className="attach-button"
          title="Capture from camera"
        >
          <Camera size={20} />
        </button>
        <div className="flex-grow">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
            value={message}
            disabled={loading || isTyping}
          />
        </div>
        <button
          type="button"
          onClick={() => sendMessage("gemma2-9b-it", false)}
          className="send-button"
          disabled={loading || isTyping || (!message.trim() && !attachedImage)}
        >
          <Send size={20} />
        </button>
        <button
          type="button"
          onClick={() => sendMessage("qwen-qwq-32b", true)}
          className="think-button"
          disabled={loading || isTyping || (!message.trim() && !attachedImage)}
          title="Think deeply about this question"
        >
          <Brain size={20} />
        </button>
        {isTyping && (
          <button
            type="button"
            className="stop-button"
            onClick={stopTyping}
            title="Stop AI response"
          >
            <Square size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;