import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse } from '../services/auraChat';
import { getApiStatus, saveApiKey, removeApiKey } from '../services/aiService';
import './AuraChat.css';

const AuraChat = ({ context }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "👋 Bonjour ! Je suis AURA, votre assistant intelligent alimenté par IA. Je peux répondre à **n'importe quelle question** sur vos investissements, la sécurité, la blockchain et plus encore !\n\n💡 Posez-moi une question libre ou cliquez sur une suggestion ci-dessous.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiStatus, setApiStatus] = useState({ groq: false, openai: false, active: false });
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Vérifier le statut de l'API au chargement
    setApiStatus(getApiStatus());
    
    // Scroll vers le bas quand un nouveau message arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedQuestions = [
    "Pourquoi cet actif est-il risqué ?",
    "Comment est calculé mon score AURA ?",
    "Quelles sont vos recommandations ?",
    "Mon portefeuille est-il sécurisé ?",
    "Explique-moi la différence entre Bitcoin et Ethereum",
    "Quels sont les meilleurs investissements pour 2025 ?",
    "Comment me protéger du phishing ?",
    "C'est quoi une blockchain exactement ?"
  ];

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Ajouter à l'historique de conversation
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    try {
      // Appeler le service de chat (avec API ou local)
      const response = await generateChatResponse(message, context, updatedHistory);
      
      const botMessage = {
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
        data: response.data,
        suggestedQuestions: response.suggestedQuestions,
        useAI: response.useAI,
        provider: response.provider,
        needsApiKey: response.needsApiKey
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Mettre à jour l'historique si réponse de l'API
      if (response.useAI) {
        setConversationHistory([
          ...updatedHistory,
          { role: 'assistant', content: response.response }
        ]);
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Erreur:', error);
      
      const errorMessage = {
        type: 'bot',
        content: "⚠️ Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleSaveApiKey = (provider, key) => {
    saveApiKey(provider, key);
    setApiStatus(getApiStatus());
    
    const confirmMessage = {
      type: 'bot',
      content: `✅ Clé API ${provider.toUpperCase()} configurée avec succès !\n\nJe suis maintenant connecté à l'IA. Vous pouvez me poser n'importe quelle question !`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmMessage]);
    setShowApiSettings(false);
  };

  const handleRemoveApiKey = (provider) => {
    removeApiKey(provider);
    setApiStatus(getApiStatus());
    
    const confirmMessage = {
      type: 'bot',
      content: `🗑️ Clé API ${provider.toUpperCase()} supprimée. Je fonctionne maintenant en mode local.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Convertir le markdown simple en HTML
    let formatted = content;
    
    // Titres
    formatted = formatted.replace(/### (.*?)$/gm, '<h4>$1</h4>');
    formatted = formatted.replace(/## (.*?)$/gm, '<h3>$1</h3>');
    
    // Gras
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Listes
    formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Sauts de ligne
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = '<p>' + formatted + '</p>';
    
    return formatted;
  };

  return (
    <div className="aura-chat">
      <div className="chat-header">
        <div className="chat-avatar">🤖</div>
        <div className="chat-info">
          <h3>AURA Assistant</h3>
          <span className="chat-status">
            {apiStatus.active ? '✅ IA Activée' : '⚠️ Mode Local'}
          </span>
        </div>
        <button 
          className="api-settings-btn"
          onClick={() => setShowApiSettings(!showApiSettings)}
          title="Paramètres API"
        >
          ⚙️
        </button>
      </div>

      {showApiSettings && (
        <ApiSettingsPanel 
          apiStatus={apiStatus}
          onSaveKey={handleSaveApiKey}
          onRemoveKey={handleRemoveApiKey}
          onClose={() => setShowApiSettings(false)}
        />
      )}

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === 'bot' && <div className="message-avatar">🤖</div>}
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              
              {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                <div className="suggested-questions">
                  <p className="suggested-label">Questions suggérées :</p>
                  {message.suggestedQuestions.map((question, qIndex) => (
                    <button
                      key={qIndex}
                      className="suggested-question"
                      onClick={() => handleSendMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.type === 'user' && <div className="message-avatar user">👤</div>}
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="typing-text">
                {apiStatus.active ? 'L\'IA réfléchit...' : 'Analyse en cours...'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            className="quick-question"
            onClick={() => handleSendMessage(question)}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez votre question à AURA..."
          rows="2"
        />
        <button 
          className="send-button"
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

/**
 * Panneau de configuration des APIs
 */
const ApiSettingsPanel = ({ apiStatus, onSaveKey, onRemoveKey, onClose }) => {
  const [groqKey, setGroqKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [huggingfaceKey, setHuggingfaceKey] = useState('');

  return (
    <div className="api-settings-panel">
      <div className="settings-header">
        <h3>⚙️ Configuration API</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="settings-content">
        <p className="settings-intro">
          Configurez une clé API pour débloquer les capacités complètes d'IA
        </p>

        {/* Groq */}
        <div className="api-config-section">
          <div className="api-header">
            <h4>⚡ Groq (Recommandé)</h4>
            {apiStatus.groq && <span className="status-badge active">✅ Actif</span>}
          </div>
          <p className="api-description">Gratuit, ultra-rapide (LLama 3.1)</p>
          <a 
            href="https://console.groq.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            📝 Obtenir une clé sur console.groq.com
          </a>
          
          {!apiStatus.groq ? (
            <div className="api-input-group">
              <input
                type="password"
                placeholder="Collez votre clé API Groq ici"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className="api-input"
              />
              <button
                onClick={() => {
                  if (groqKey.trim()) {
                    onSaveKey('groq', groqKey.trim());
                    setGroqKey('');
                  }
                }}
                className="save-btn"
                disabled={!groqKey.trim()}
              >
                💾 Sauvegarder
              </button>
            </div>
          ) : (
            <button onClick={() => onRemoveKey('groq')} className="remove-btn">
              🗑️ Supprimer la clé
            </button>
          )}
        </div>

        {/* OpenAI */}
        <div className="api-config-section">
          <div className="api-header">
            <h4>🤖 OpenAI (GPT)</h4>
            {apiStatus.openai && <span className="status-badge active">✅ Actif</span>}
          </div>
          <p className="api-description">Le plus performant (nécessite des crédits)</p>
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            📝 Obtenir une clé sur platform.openai.com
          </a>
          
          {!apiStatus.openai ? (
            <div className="api-input-group">
              <input
                type="password"
                placeholder="Collez votre clé API OpenAI ici"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="api-input"
              />
              <button
                onClick={() => {
                  if (openaiKey.trim()) {
                    onSaveKey('openai', openaiKey.trim());
                    setOpenaiKey('');
                  }
                }}
                className="save-btn"
                disabled={!openaiKey.trim()}
              >
                💾 Sauvegarder
              </button>
            </div>
          ) : (
            <button onClick={() => onRemoveKey('openai')} className="remove-btn">
              🗑️ Supprimer la clé
            </button>
          )}
        </div>

        {/* Hugging Face */}
        <div className="api-config-section">
          <div className="api-header">
            <h4>🎯 Hugging Face</h4>
            {apiStatus.huggingface && <span className="status-badge active">✅ Actif</span>}
          </div>
          <p className="api-description">Gratuit mais plus lent (Mistral 7B)</p>
          <a 
            href="https://huggingface.co/settings/tokens" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            📝 Obtenir un token sur huggingface.co
          </a>
          
          {!apiStatus.huggingface ? (
            <div className="api-input-group">
              <input
                type="password"
                placeholder="Collez votre token Hugging Face ici"
                value={huggingfaceKey}
                onChange={(e) => setHuggingfaceKey(e.target.value)}
                className="api-input"
              />
              <button
                onClick={() => {
                  if (huggingfaceKey.trim()) {
                    onSaveKey('huggingface', huggingfaceKey.trim());
                    setHuggingfaceKey('');
                  }
                }}
                className="save-btn"
                disabled={!huggingfaceKey.trim()}
              >
                💾 Sauvegarder
              </button>
            </div>
          ) : (
            <button onClick={() => onRemoveKey('huggingface')} className="remove-btn">
              🗑️ Supprimer la clé
            </button>
          )}
        </div>

        <div className="settings-note">
          <p>🔒 <strong>Sécurité :</strong> Vos clés sont stockées localement dans votre navigateur.</p>
          <p>💡 <strong>Astuce :</strong> Groq est gratuit et ultra-rapide, idéal pour commencer !</p>
        </div>
      </div>
    </div>
  );
};

export default AuraChat;
