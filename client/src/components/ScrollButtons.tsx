import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './ScrollButtons.css';

const ScrollButtons: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="scroll-buttons">
      <button className="scroll-btn scroll-to-top" onClick={scrollToTop} title="回到顶部">
        <ChevronUp size={20} />
      </button>
      <button className="scroll-btn scroll-to-bottom" onClick={scrollToBottom} title="到底部">
        <ChevronDown size={20} />
      </button>
    </div>
  );
};

export default ScrollButtons;
