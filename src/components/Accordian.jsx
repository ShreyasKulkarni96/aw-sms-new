import React, { useState } from 'react';
import '../index.css'; // Import your CSS file for styling

const Accordion = ({ sections }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {sections.map((section, index) => (
        <div className={`accordion-item  ${index === activeIndex ? 'active' : ''}`} key={index}>
          <div className="accordion-header" onClick={() => toggleAccordion(index)}>
            {section.title}
          </div>
          <div className="accordion-content" style={{ display: index === activeIndex ? 'block' : 'none' }}>
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
