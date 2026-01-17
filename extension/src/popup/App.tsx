import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Mascot } from './Mascot';
import { analyzeText, chatWithTerms, detectDarkPatterns } from '../api';
import { AppStatus, MascotState, AnalysisResult, Persona, ChatMessage, DarkPatternResult } from '../types';
import { marked } from 'marked';

function App() {
  const [activeTab, setActiveTab] = useState<'report' | 'chat' | 'vision'>('report');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Persona
  const [persona, setPersona] = useState<Persona>('standard');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  // Chat
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Vision
  const [visionResult, setVisionResult] = useState<DarkPatternResult | null>(null);

  // Context Text (for chat)
  const [pageText, setPageText] = useState<string>('');

  // Voice
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  const handleListen = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;

    const highRiskClauses = result.notable_clauses.filter(c => c.risk === 'high' || c.risk === 'medium');
    
    const textToRead = `
      Terms and Conditions analysis. 
      Overall Risk Level is ${result.overall_risk}.
      Summary: ${result.summary}.
      ${highRiskClauses.length > 0 ? 'Important warnings to note:' : ''}
      ${highRiskClauses.map(c => `${c.title}: ${c.explanation}`).join('. ')}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleAnalyze = async () => {
    try {
      setStatus('reading');
      setMascotState('reading');
      setError(null);

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id || !tab.url) throw new Error('No active tab');

      // Get Text
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, { action: 'GET_TEXT' });
      } catch (e) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        await new Promise(r => setTimeout(r, 200));
        response = await chrome.tabs.sendMessage(tab.id, { action: 'GET_TEXT' });
      }

      if (!response?.text) throw new Error('No text found');
      setPageText(response.text);

      setStatus('thinking');
      setMascotState('thinking');

      const data = await analyzeText(response.text, tab.url, persona);
      setResult(data);
      setStatus('result');
      
      // Update Mascot
      if (data.overall_risk === 'low') setMascotState('happy');
      else if (data.overall_risk === 'medium') setMascotState('concerned');
      else setMascotState('alert');

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message);
      setMascotState('concerned');
    }
  };

  const handleHighlight = async () => {
    if (!result?.notable_clauses) return;
    const quotes = result.notable_clauses.map(c => c.quote).filter(Boolean);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'HIGHLIGHT_TEXT', quotes });
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Optimistic UI
    const loadingMsg: ChatMessage = { role: 'model', text: '...' };
    setChatHistory(prev => [...prev, loadingMsg]);

    try {
      const res = await chatWithTerms(userMsg.text, pageText || "No context provided yet. Please analyze first.", chatHistory);
      
      setChatHistory(prev => {
        const newHist = [...prev];
        newHist.pop(); // Remove loading
        newHist.push({ role: 'model', text: res.response });
        return newHist;
      });
    } catch (err) {
      setChatHistory(prev => {
        const newHist = [...prev];
        newHist.pop();
        newHist.push({ role: 'model', text: "Error: Could not get response." });
        return newHist;
      });
    }
  };

  const handleVision = async () => {
    try {
      setStatus('analyzing_vision');
      setError(null);
      
      // Capture
      const screenshotUrl = await chrome.tabs.captureVisibleTab(null as any, { format: 'png' });
      
      const res = await detectDarkPatterns(screenshotUrl);
      setVisionResult(res);
      setStatus('result'); // Re-use result status or keep specific
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  const renderPersonaMenu = () => (
    <div className="absolute top-10 right-4 bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-2 w-48 animate-fade-in">
      {(['standard', 'parent', 'content_creator', 'developer', 'privacy_advocate'] as Persona[]).map(p => (
        <button
          key={p}
          onClick={() => { setPersona(p); setShowPersonaMenu(false); setResult(null); setStatus('idle'); }}
          className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 capitalize ${persona === p ? 'font-bold text-blue-600' : 'text-gray-700'}`}
        >
          {p.replace('_', ' ')}
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-[400px] h-[600px] bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <img src="../../logo.png" alt="Otter logo" className='w-auto h-8' />
        </div>
        
        <div className="flex items-center gap-2">
          {result?.trust_score && (
            <div className={`text-xs px-2 py-1 rounded font-bold ${result.trust_score > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              Trust: {result.trust_score}
            </div>
          )}
          <button 
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full capitalize border border-gray-300"
          >
            {persona.replace('_', ' ')} ▼
          </button>
        </div>
        {showPersonaMenu && renderPersonaMenu()}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-20 scrollbar-hide">
        
        {/* VIEW: REPORT */}
        {activeTab === 'report' && (
          <div className="flex flex-col items-center">
            <Mascot state={mascotState} />
            
            {status === 'idle' && (
              <div className="text-center mt-8">
                <p className="text-gray-600 text-md mb-6">Ready to analyze this page for<br/><b>{persona.replace('_', ' ')}</b> risks.</p>
                <button 
                  onClick={handleAnalyze}
                  className="bg-blue-600 h-15 flex item-center justify-center text-[1.2rem] w-full hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
                >
                  Analyze Terms
                </button>
              </div>
            )}

            {(status === 'reading' || status === 'thinking') && (
               <div className="text-center mt-4">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                 <p className="text-gray-500 text-sm">{status === 'reading' ? 'Reading page...' : 'Gemini is analyzing...'}</p>
               </div>
            )}

            {status === 'result' && result && (
              <div className="w-full mt-4 space-y-4 animate-fade-in-up">
                
                {/* Risk Card */}
                <div className={`p-4 rounded-xl border ${
                  result.overall_risk === 'low' ? 'bg-green-50 border-green-200' :
                  result.overall_risk === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold uppercase tracking-wide opacity-80">{result.overall_risk} Risk</h2>
                      {result.from_cache && <span className="text-[10px] text-gray-500">⚡ Cached Result</span>}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleListen} 
                        className={`text-xs px-2 py-1 rounded border transition ${
                          isSpeaking 
                            ? 'bg-red-100 border-red-300 text-red-700 animate-pulse' 
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                        title={isSpeaking ? "Stop Listening" : "Listen to Summary"}
                      >
                        {isSpeaking ? '🛑 Stop' : '🔊 Listen'}
                      </button>
                      <button onClick={handleHighlight} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                        🖊️ Highlight
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-2 text-gray-700 leading-relaxed">{result.summary}</p>
                </div>

                {/* Clauses */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Notable Clauses</h3>
                  {result.notable_clauses.map((clause, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-gray-900">{clause.title}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          clause.risk === 'low' ? 'bg-green-500' :
                          clause.risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                      <p className="text-xs text-gray-600">{clause.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-3 overflow-y-auto mb-4 p-1">
               {chatHistory.length === 0 && (
                 <div className="text-center text-gray-400 mt-10 text-sm">
                   Ask anything about the Terms.<br/>
                   "Can they sell my data?"
                 </div>
               )}
               {chatHistory.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                     msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
                   }`}>
                      {msg.role === 'model' && msg.text === '...' ? (
                        <div className="flex space-x-1"><div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"/></div>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                      )}
                   </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleChat} className="mt-auto flex gap-2">
              <input 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="submit" disabled={!chatInput} className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50">
                ➤
              </button>
            </form>
          </div>
        )}

        {/* VIEW: VISION */}
        {activeTab === 'vision' && (
          <div className="flex flex-col items-center pt-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              👁️
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Dark Pattern Detective</h2>
            <p className="text-center text-gray-600 text-sm mb-8 px-8">
              Analyze the visual layout for deceptive design patterns like hidden buttons or fake urgency.
            </p>
            
            <button 
              onClick={handleVision}
              disabled={status === 'analyzing_vision'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2"
            >
              {status === 'analyzing_vision' ? 'Scanning UI...' : 'Scan Visible Page'}
            </button>

            {visionResult && (
              <div className="mt-8 w-full animate-fade-in-up">
                 <div className={`p-4 rounded-lg border ${visionResult.has_dark_patterns ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                   <h3 className="font-bold mb-2">{visionResult.has_dark_patterns ? '⚠️ Dark Patterns Detected' : '✅ No Obvious Deception'}</h3>
                   <div className="space-y-2">
                     {visionResult.details.map((d, i) => (
                       <div key={i} className="text-sm border-l-2 border-purple-500 pl-2">
                         <span className="font-semibold text-purple-900">{d.pattern_type}:</span> {d.explanation}
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
           <div className="bg-red-100 text-red-700 p-3 rounded mt-4 text-sm text-center">
             {error}
             <button onClick={() => setStatus('idle')} className="block w-full mt-1 font-bold hover:underline">Reset</button>
           </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 flex justify-around p-2 absolute bottom-0 w-full">
        <button 
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition ${activeTab === 'report' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <span className="text-xl">📄</span>
          <span className="text-[10px] font-bold">Report</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition ${activeTab === 'chat' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <span className="text-xl">💬</span>
          <span className="text-[10px] font-bold">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('vision')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition ${activeTab === 'vision' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <span className="text-xl">👁️</span>
          <span className="text-[10px] font-bold">Vision</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
