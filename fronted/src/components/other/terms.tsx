'use client'
import '@/styles/otherPages.css';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="main">
      <div className="page-title">
        <h1>Terms & Conditions</h1>
        <motion.div
                              id="underline"
                              initial={{ width: '100%' }}
                              whileInView={{width: '50%'}}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
      </div>
      <div className="page-contents">
        {[
          {
            header: 'Detailed Description of Goods and/or Services',
            content:
              'Little Brand Box (PTY) Ltd is a business in the e-Commerce industry that offers online retail.',
          },
          {
            header: 'Delivery Policy',
            content:
              'Subject to availability and receipt of payment, requests will be processed within 3-5 business days for the economy shipping option and 1-2 business days for the express shipping option and delivery confirmed by way of email with a tracker number from the relevant courier company. Any orders placed after 12:00 pm will only be processed the next day.',
          },
          {
            header: 'Export Restriction',
            content:
              'Due to certain export restrictions, the offering on this website is available to South African clients and neighbouring countries only.',
          },
          {
            header: 'Return and Refunds Policy',
            content:
              'The provision of goods and services by LITTLE BRAND BOX (PTY) LTD is subject to availability. In cases of unavailability, LITTLE BRAND BOX (PTY) LTD will refund the client in full within 30 days using the same method the original order was paid for. Damaged and returned goods will only be refunded or replaced upon receipt and inspection of the defective items or unwanted items and if within the warranty period.',
          },
          {
            header: 'Customer Privacy Policy',
            content:
              'LITTLE BRAND BOX (PTY) LTD shall take all reasonable steps to protect the personal information of users. For the purpose of this clause, “personal information” shall be defined as detailed in the Promotion of Access to Information Act 2 of 2000 (PAIA). The PAIA may be downloaded from: <a href="http://www.polity.org.za/attachment.php?aa_id=3569">here</a>.',
          },
        ].map((section, index) => (
          <div key={index} className="content-section">
            <p className="header">{section.header}</p>
            <p dangerouslySetInnerHTML={{ __html: section.content }}></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;