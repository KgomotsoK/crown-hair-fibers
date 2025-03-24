'use client';
import faqdata from '@/data/FAQ.json';
import '@/styles/otherPages.css';
import { faCircleCheck, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData: FAQItem[] = faqdata.faqItems;

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="main">
      <motion.div 
                className="page-title"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Frequently asked questions</h1>
                <motion.div
                              id="underline"
                              initial={{ width: '100%' }}
                              whileInView={{width: '50%'}}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
              </motion.div>
      <div className="page-contents">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`faqItem ${openItem === index ? 'open' : ''}`}
          >
            <button
              className="faqQuestion"
              onClick={() => toggleItem(index)}
              aria-expanded={openItem === index}
            >
              {openItem === index ? (
                <FontAwesomeIcon icon={faCircleCheck} className='icon'/>
              ) : (
                <FontAwesomeIcon icon={faCircleQuestion} className='icon'/>
              )}
              {item.question}
            </button>
            {openItem === index && <div className="faqAnswer">- {item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;