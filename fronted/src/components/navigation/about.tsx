import '@/styles/about.css';
import { motion } from 'framer-motion';
import Link from 'next/link';

const About = () => {
  return (
    <main className="container">
      <div className="content-container">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/about">About</Link>
      </div>
        <div className="page-title">
          <h1>About us</h1>
          <motion.div
                              className="underline"
                              initial={{ width: '100%' }}
                              whileInView={{width: '50%'}}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
        </div>

        <div className="content-wrapper">
          {/* Text Section */}
          <div className="text-content">
        <div className='text-section'>
          <h2>Our Mission</h2>
          <div className='description'><p>
          To offer the quickest and most flawless solutions to thinning hair and balding, so men and women can concentrate on living vivaciously, rather than on the emotional distresses of hair loss.
        </p></div>
        </div>
        <div className='text-section'>
          <h2>What do we do?</h2>
        <div className='description'><p>
        Provide you with an instant hair loss solution, using a combination of science and natural ingredients.
        </p></div>
        
        </div>
        <div className='text-section'>
          <h2>Why we do it?</h2>
          <div className='description'><p>
          So that our products can offer you an instant and reassuring aesthetic boost whenever you need it.
        </p></div>
        </div>
       
      </div>
      <p className='footer-text'>All these in one sprinkle.</p>
        </div>
      </div>
    </main>
  );
};

export default About;