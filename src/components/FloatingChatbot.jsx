import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to SustainableTracking! Need help reporting an issue or checking your city's Green Score?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock API Call Delay simulating an AI endpoint
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I'm sorry, I couldn't process that.";
      const lower = userMsg.text.toLowerCase();
      
      if (lower.includes('project') || lower.includes('pending') || lower.includes('completed') || lower.includes('ongoing') || lower.includes('progress')) {
        try {
          const stored = localStorage.getItem('smart_city_projects');
          let data = stored ? JSON.parse(stored) : [];
          
          // Fallback data if local storage is empty for demo purposes
          if (!data || data.length === 0) {
            data = [
              { id: 1, status: 'Completed', progress_percentage: 100 },
              { id: 2, status: 'Ongoing', progress_percentage: 65 },
              { id: 3, status: 'Ongoing', progress_percentage: 42 },
              { id: 4, status: 'Pending', progress_percentage: 0 },
              { id: 5, status: 'Completed', progress_percentage: 100 },
              { id: 6, status: 'Pending', progress_percentage: 0 }
            ];
          }
          
          if (data && data.length > 0) {
            const completed = data.filter(p => p.status === 'Completed').length;
            const ongoing = data.filter(p => p.status === 'Ongoing').length;
            const pending = data.filter(p => p.status === 'Pending').length;
            const progressAvg = Math.round(data.reduce((sum, p) => sum + (Number(p.progress_percentage) || 0), 0) / data.length);
            
            if (lower.includes('progress')) {
              replyText = `The overall average completion progress across all ${data.length} tracked projects is currently at ${progressAvg}%.`;
            } else if (lower.includes('ongoing') && !lower.includes('completed') && !lower.includes('pending')) {
               replyText = `There are exactly ${ongoing} ongoing infrastructure projects presently active in the database.`;
            } else if (lower.includes('completed') && !lower.includes('ongoing') && !lower.includes('pending')) {
               replyText = `We have successfully finished ${completed} projects so far!`;
            } else if (lower.includes('pending') && !lower.includes('ongoing') && !lower.includes('completed')) {
               replyText = `There are currently ${pending} projects pending approval or kickoff.`;
            } else {
               replyText = `We currently have ${data.length} infrastructure projects tracked across the platform! Here is the live database breakdown:\n• Ongoing: ${ongoing}\n• Completed: ${completed}\n• Pending: ${pending}\n• Average Progress: ${progressAvg}%`;
            }
          } else {
            replyText = "We currently track numerous sustainability projects across the nation, but no live data was found. Please check the Projects Dashboard for live data!";
          }
        } catch (e) {
          replyText = "There are multiple Ongoing, Pending, and Completed projects happening right now! Check the Projects dashboard for more details.";
        }
      } else if (lower.includes('pm2.5') || lower.includes('air') || lower.includes('pollution')) {
        replyText = "The air quality varies significantly by region. Please navigate to our Live Map or Dashboard for real-time PM2.5 metrics in your specific city.";
      } else if (lower.includes('garbage') || lower.includes('waste')) {
        replyText = "You can easily report waste or garbage issues directly through our 'Report Issue' page. Be sure to securely attach a photo and your location!";
      } else if (lower.includes('score') || lower.includes('green')) {
        replyText = "The Green Score is calculated dynamically based on real-time air quality, waste management progress, and carbon footprint. Check the national leaderboard on the Dashboard!";
      } else {
        replyText = "Thank you for reaching out! I'm still learning the ropes, but you can explore the Dashboard, Active Map, and Infrastructure Projects using the top navigation menu.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'bot' }]);
    }, 1500);
  };

  return (
    <>
      <style>{`
        @keyframes floatIdle {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes botMessageSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        @keyframes customPulse {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(1); }
        }
      `}</style>
      
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
        {/* Floating Chat Window */}
        <div 
          className={`mb-4 w-[300px] sm:w-[320px] origin-bottom-right transition-all duration-500 will-change-transform ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-auto ${
            isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-12'
          }`}
          style={{ 'pointerEvents': isOpen ? 'auto' : 'none' }}
        >
          <div className="h-[420px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_12px_45px_rgba(46,125,50,0.25)] rounded-2xl overflow-hidden flex flex-col relative">
            
            {/* Header */}
            <div className="bg-[#2E7D32] p-3 flex items-center justify-between shadow-md relative z-10 border-b border-green-800/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-full flex items-center justify-center relative">
                  <Sparkles className="w-4 h-4 text-[#FFC107]" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#2E7D32] rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-extrabold tracking-wide">EcoBot AI</h3>
                  <p className="text-green-200 text-[10px] font-semibold tracking-wider">Online & Ready</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/80 to-gray-100/80 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'botMessageSlide 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm text-[13px] font-medium leading-relaxed tracking-tight whitespace-pre-wrap ${
                      msg.sender === 'user' 
                        ? 'bg-[#A5D6A7] text-green-950 rounded-tr-sm border border-green-300' 
                        : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start" style={{ animation: 'botMessageSlide 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}>
                  <div className="bg-white border border-gray-100 py-3 px-4 rounded-xl rounded-tl-sm shadow-sm flex space-x-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#FFC107] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative z-10 rounded-b-2xl">
              <form onSubmit={handleSend} className="relative flex items-center group">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask EcoBot..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A5D6A7] focus:bg-white transition-all text-[13px] font-medium placeholder-gray-400 group-hover:border-green-300"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1 w-8 h-8 bg-[#FFC107] hover:bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center shadow-md transition-all ease-out active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:bg-[#2E7D32] group-focus-within:text-white"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Floating Orb Toggle Button */}
        <div className="relative pointer-events-auto mt-2">
           <button 
             onClick={() => setIsOpen(!isOpen)}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
             className={`relative flex items-center justify-center w-[56px] h-[56px] bg-gradient-to-tr from-[#2E7D32] to-[#43a047] rounded-full shadow-[0_10px_35px_rgba(46,125,50,0.5)] border border-green-500/50 transition-all duration-500 z-50 focus:outline-none overflow-visible group`}
             style={{
               animation: !isOpen && !isHovered ? 'floatIdle 3s ease-in-out infinite' : 'none',
               transform: isOpen ? 'scale(0) rotate(-90deg)' : (isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'),
               opacity: isOpen ? 0 : 1
             }}
           >
             {/* Glow Ring behind the button */}
             <div className="absolute inset-0 bg-[#A5D6A7] rounded-full blur-[10px] opacity-40 z-0" style={{ animation: 'customPulse 4s infinite' }}></div>
             
             {/* Notification Badge */}
             {!isOpen && (
               <div className="absolute top-[2px] right-[2px] w-3 h-3 bg-red-500 border-2 border-white rounded-full z-20 shadow-sm animate-pulse"></div>
             )}

             <MessageSquare className="w-6 h-6 text-white relative z-10 transition-transform duration-300 group-hover:-rotate-12" />
           </button>
        </div>
      </div>
    </>
  );
}
