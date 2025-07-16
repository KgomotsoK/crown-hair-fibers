import '@/styles/otherPages.css';
import { motion } from 'framer-motion';

const Policy = () => {
  return (
    <div className="main">
      <div className="page-title">
        <h1>Privacy Policy</h1>
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
            header: 'Introduction',
            content:
              "Little Brand Box respects each individual's right to personal privacy. We will collect and use information through our Web site only in the ways disclosed in this statement. This statement applies solely to information collected at Little Brand Box's Web sites.",
          },
          {
            header: 'Delivery Policy',
            content:
              'Subject to availability and receipt of payment, requests will be processed within 3-5 business days for the economy shipping option and 1-2 business days for the express shipping option and delivery confirmed by way of email with a tracker number from the relevant courier company. Any orders placed after 12:00 pm will only be processed the next day.',
          },
          {
            header: 'Information Collection',
            content:
              'Little Brand Box collects information through our Web site at several points. We collect the following information about primary visitors: Name, Address, Phone Numbers, Email Addresses, Credit Card information.',
          },
          {
            header: 'Information Usage',
            content:
              'The information collected by Little Brand Box will be used for product purchases and marketing purposes. Users who provide information will receive purchased products, services, email announcements or advertisements.',
          },
          {
            header: 'Access to Information',
            content:
              'Little Brand Box maintains the accuracy of our information by updates from our customers and periodic review of data. Users may access their own personal information and contact us about inaccuracies they may find by contacting us at 021-423-6868.',
          },
          {
            header: 'Data Storage and Security',
            content:
              "Little Brand Box protects user information with the following security measures: secure servers, firewalls, SSL encryption and encrypted VPN's.",
          },
        ].map((section, index) => (
          <div key={index} className="content-section">
            <p className="header">{section.header}</p>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Policy;