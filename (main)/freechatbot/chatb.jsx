"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Brain, Square, Paperclip, Camera, X, ChevronDown } from "lucide-react";
import Aurora from "@/components/ui/Aurora";
import IndiaGradient from "@/components/ui/IndiaGradient";
import { BlurFade } from "@/components/magicui/blur-fade";
import GradientText from "@/components/ui/GradientText";
import { UserButton } from '@stackframe/stack';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import './chat.css';

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
  const typingTimeoutsRef = useRef([]);

  // Simulate user subscription status (set to false to disable features)
  const isProUser = false;

  // Placeholders for the input
  const placeholders = [
    "How to improve my business sales?",
    "What are the best marketing strategies?",
    "Analyze my business data",
    "How to optimize my supply chain?",
    "Suggest ways to increase customer retention",
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

  // Handle user scrolling to disable auto-scroll when scrolled up
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
    if (!isProUser) {
      alert("Please upgrade to Pro to attach images.");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setAttachedImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const captureFromCamera = async () => {
    if (!isProUser) {
      alert("Please upgrade to Pro to use the camera feature.");
      return;
    }
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

  // Function to type out text token by token
  const typeMessage = (messageId, additionalText, delayPerToken, isThinkingContent, onComplete) => {
    setChatHistory((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              isTyping: true,
              isThinking: false,
              isThinkingContent,
              text: isThinkingContent ? "" : msg.text,
              isExpanded: isThinkingContent ? false : msg.isExpanded,
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

  // Toggle thinking box expansion
  const toggleThinkingBox = (messageId) => {
    setChatHistory((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isExpanded: !msg.isExpanded } : msg
      )
    );
  };

  // Stop typing functionality
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

    if (isThinking && !isProUser) {
      alert("Please upgrade to Pro to use the thinking feature.");
      return;
    }

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
          prompt: message || "Analyze this image for business insights.",
        }
      : {
          conversation_id: conversationId,
          model: selectedModel,
          message: message,
        };

    const userMessageId = Date.now();
    let thinkingId;

    setLoading(true);
    const newHistory = [
      ...chatHistory,
      { id: userMessageId, sender: "user", text: message, image: attachedImage || null },
    ];

    if (isThinking && !attachedImage) {
      thinkingId = userMessageId + 1;
      newHistory.push({ id: thinkingId, sender: "ai", text: "Thinking... ", isThinking: true });
    }

    setChatHistory(newHistory);
    setMessage("");
    setAttachedImage(null);

    try {
      const response = await fetch(
        attachedImage ? "http://localhost:5000/analyze-image" : "http://localhost:5000/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Error with API request");

      const data = await response.json();
      const thinkingContent = data.thinking || "";
      const answer = data.answer;

      setLoading(false);

      if (isThinking && thinkingContent && !attachedImage) {
        setIsTyping(true);
        typeMessage(thinkingId, thinkingContent, 10, true, () => {
          const answerId = Date.now() + 2;
          setChatHistory((prev) => [
            ...prev,
            { id: answerId, sender: "ai", text: "", isTyping: true, isThinkingContent: false },
          ]);
          typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
        });
      } else if (isThinking && !attachedImage) {
        setChatHistory((prev) => prev.filter((msg) => msg.id !== thinkingId));
        const answerId = Date.now() + 2;
        setChatHistory((prev) => [
          ...prev,
          { id: answerId, sender: "ai", text: "", isTyping: true, isThinkingContent: false },
        ]);
        setIsTyping(true);
        typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
      } else {
        const answerId = Date.now() + 2;
        setChatHistory((prev) => [
          ...prev,
          { id: answerId, sender: "ai", text: "", isTyping: true, isThinkingContent: false },
        ]);
        setIsTyping(true);
        typeMessage(answerId, answer, 100, false, () => setIsTyping(false));
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      if (isThinking && !attachedImage) {
        setChatHistory((prev) => prev.filter((msg) => msg.id !== thinkingId));
      }
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
    <div className="chatbot-container bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="aurora-container">
        <Aurora
          colorStops={["#6A0DAD", "#FFFFFF", "#4A90E2"]}
          amplitude={0.8}
          blend={0.3}
          speed={0.5}
        />
      </div>

      <header className="chatbot-header bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="header-title">
          <BlurFade delay={0.3} inView>
            <GradientText>ArogyaMitra Base1o</GradientText>
          </BlurFade>
        </div>
        <div className="header-subtitle">
          <UserButton />
        </div>
      </header>

      {cameraActive && (
        <div style={{ textAlign: "center", margin: "1rem" }}>
          <video
            ref={videoRef}
            style={{ maxWidth: "100%", borderRadius: "0.5rem" }}
            autoPlay
            playsInline
          />
          <div style={{ marginTop: "0.5rem" }}>
            <button onClick={takeSnapshot} className="send-button">
              Click
            </button>
          </div>
        </div>
      )}

      <div className="chat-area bg-gradient-to-r from-purple-50 to-blue-50" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="welcome-container">
            <BlurFade delay={0.3} inView>
              <div className="welcome-icon animate-pulse">
                <img src="/Arogyalogo.png" alt="Welcome" />
              </div>
            </BlurFade>
            <BlurFade delay={0.3} inView>
              <GradientText>
                <h2 className="text-2xl">Welcome to ArogyaMitra</h2>
              </GradientText>
              <p className="welcome-message">I'm here to assist with your health-related questions.</p>
              <p className="welcome-message">
                Click <Brain size={18} className="inline-block text-gray-500" /> for deeper analysis.
              </p>
            </BlurFade>
          </div>
        ) : (
          <div className="messages-container">
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.isThinking ? (
                    <div>
                      <span>Thinking</span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  ) : msg.isThinkingContent ? (
                    <div className={`thinking-box ${msg.isExpanded ? "expanded" : "collapsed"}`}>
                      <button
                        className="toggle-arrow"
                        onClick={() => toggleThinkingBox(msg.id)}
                        title={msg.isExpanded ? "Collapse" : "Expand"}
                      >
                        <ChevronDown
                          size={18}
                          style={{
                            transform: msg.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            color: "#6A0DAD",
                          }}
                        />
                      </button>
                      <div className={`text-container ${msg.isTyping ? "typing" : ""}`}>
                        <span className="lightning-text">{msg.text}</span>
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
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={attachedImage}
              alt="Preview"
              style={{
                maxHeight: "120px",
                borderRadius: "0.5rem",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            />
            <button
              onClick={() => setAttachedImage(null)}
              title="Remove image"
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="input-container bg-gradient-to-r from-purple-50 to-blue-50 flex items-center gap-2 p-4">
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
          title={isProUser ? "Attach image" : "Upgrade to Pro to attach images"}
          disabled={!isProUser}
        >
          <Paperclip size={18} />
        </button>
        <button
          type="button"
          onClick={captureFromCamera}
          className="camera-button"
          title={isProUser ? "Capture from camera" : "Upgrade to Pro to use camera"}
          disabled={!isProUser}
        >
          <Camera size={18} />
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
          <Send size={18} />
        </button>
        <button
          type="button"
          onClick={() => sendMessage("qwen-qwq-32b", true)}
          className="think-button"
          disabled={loading || isTyping || (!message.trim() && !attachedImage) || !isProUser}
          title={isProUser ? "Think deeply about this question" : "Upgrade to Pro to use thinking feature"}
        >
          <Brain size={18} />
        </button>
        {isTyping && (
          <button
            type="button"
            className="stop-button"
            onClick={stopTyping}
            title="Stop AI response"
          >
            <Square size={18} />
          </button>
        )}
      </div>

      {/* <footer className="chatbot-footer text-center text-gray-500 mb-2">
        BlueBox AI - Your AI Business Companion
      </footer> */}
    </div>
  );
};

export default Chatbot;