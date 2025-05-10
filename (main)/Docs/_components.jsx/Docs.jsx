

export function Documentation() {
    return (
     
      <div className="documentation-page">
        <div className="docs-container">
          <div className="docs-sidebar">
            <div className="docs-nav">
              <h3>Contents</h3>
              <ul>
                <li>
                  <a href="#getting-started">Getting Started</a>
                </li>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#voice-assistant">Voice Assistant</a>
                </li>
                <li>
                  <a href="#chat-interface">Chat Interface</a>
                </li>
                <li>
                  <a href="#privacy">Privacy & Security</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="docs-content">
            <h1>BlueBox Documentation</h1>
            <p className="docs-intro">
              Welcome to the BlueBox documentation. This guide will help you understand how to use our AI-powered
              business intelligence system effectively.
            </p>
  
            <section id="getting-started">
              <h2>Getting Started</h2>
              <div className="docs-card">
                <h3>What is BlueBox?</h3>
                <p>
                  BlueBox is an AI-powered business intelligence system designed to provide immediate business guidance and
                  support. Our platform combines advanced artificial intelligence with business expertise to deliver
                  personalized business solutions accessible to everyone, anytime, anywhere.
                </p>
              </div>
  
              <div className="docs-card">
                <h3>How to Start a Conversation</h3>
                <ol>
                  <li>
                    Click on the <strong>"Voice Assistant"</strong> button on the Dashboard
                  </li>
                  <li>Enter your name</li>
                  <li>Enter your language</li>
                  <li>Once connected, you can start describing your business concerns</li>
                </ol>
              </div>
            </section>
  
            <section id="features">
              <h2>Features</h2>
              <div className="docs-card">
                <h3>24/7 Availability</h3>
                <p>
                  BlueBox is available round the clock to address your business concerns whenever they arise. No
                  appointments or waiting times are needed.
                </p>
              </div>
  
              <div className="docs-card">
                <h3>Business Knowledge Base</h3>
                <p>
                  Our AI is trained on extensive business databases to provide accurate business information and guidance. It
                  can help with business assessment, general business queries, business information, and preventive
                  business tips.
                </p>
              </div>
  
              <div className="docs-card">
                <h3>Human Escalation</h3>
                <p>
                  For complex cases that require human expertise, BlueBox can seamlessly connect you with a business
                  professional. The system is designed to recognize when a case needs human intervention.
                </p>
              </div>
            </section>
  
            <section id="voice-assistant">
              <h2>Voice Assistant</h2>
              <div className="docs-card">
                <h3>Using Voice Commands</h3>
                <p>
                  BlueBox supports voice interaction, allowing you to speak directly to the assistant. This hands-free
                  approach is convenient for many situations.
                </p>
                <ul>
                  <li>
                    <strong>Start speaking</strong> after the connection is established
                  </li>
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Pause briefly between sentences to allow the AI to process your input</li>
                  <li>
                    Use the <strong>Mute</strong> button when you want to temporarily disable your microphone
                  </li>
                </ul>
              </div>
  
              <div className="docs-card">
                <h3>Voice Controls</h3>
                <p>Available controls during a voice session:</p>
                <ul>
                  <li>
                    <strong>Mute/Unmute:</strong> Toggle your microphone on/off
                  </li>
                  <li>
                    <strong>End Call:</strong> Terminate the current session
                  </li>
                </ul>
              </div>
            </section>
  
            <section id="chat-interface">
              <h2>Chat Interface</h2>
              <div className="docs-card">
                <h3>Text-based Communication</h3>
                <p>
                  If you prefer typing or are in a situation where speaking isn't convenient, you can use the text-based
                  chat interface. Simply type your messages in the input field and press Enter or click the send button.
                </p>
              </div>
  
              <div className="docs-card">
                <h3>Conversation History</h3>
                <p>
                  Your conversation history is displayed in the chat window, allowing you to review previous exchanges.
                  This helps maintain context throughout your interaction with the assistant.
                </p>
              </div>
            </section>
  
            <section id="privacy">
              <h2>Privacy & Security</h2>
              <div className="docs-card">
                <h3>Data Protection</h3>
                <p>
                  BlueBox takes your privacy seriously. All conversations are encrypted and securely stored. Your
                  personal business information is protected according to business data protection standards.
                </p>
                <ul>
                  <li>End-to-end encryption for all communications</li>
                  <li>Secure data storage with limited access</li>
                  <li>Option to delete your conversation history</li>
                  <li>No sharing of personal data with third parties without consent</li>
                </ul>
              </div>
            </section>
  
            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <div className="docs-card faq-section">
                <div className="faq-item">
                  <h3>Is BlueBox a replacement for a business advisor?</h3>
                  <p>
                    No, BlueBox is designed to provide initial guidance and information but is not a substitute for
                    professional business advice. For serious business concerns, always consult with a qualified business
                    advisor.
                  </p>
                </div>
  
                <div className="faq-item">
                  <h3>How accurate is the information provided?</h3>
                  <p>
                    BlueBox is trained on verified business information and continuously updated. However, it should be
                    used as a supplementary resource rather than the sole source of business advice.
                  </p>
                </div>
  
                <div className="faq-item">
                  <h3>Can I use BlueBox in an emergency?</h3>
                  <p>
                    No, BlueBox is not designed for emergency situations. In case of a business emergency, please contact
                    your local business services immediately.
                  </p>
                </div>
  
                <div className="faq-item">
                  <h3>Is there a limit to how often I can use the service?</h3>
                  <p>
                    No, you can use BlueBox as often as needed. The service is designed to be available 24/7 without
                    usage restrictions.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
  
  export default Documentation;


