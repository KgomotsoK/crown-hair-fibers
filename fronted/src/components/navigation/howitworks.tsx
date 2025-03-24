import '@/styles/howitworks.css';
import { motion } from 'framer-motion';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      text: '1. Find The Problem Area',
      img: 'https://cuvvahairfibers.com/wp-content/uploads/Monica-1.jpg', // Placeholder image
    },
    {
      text: '2. Apply on the Problem Area',
      img: 'https://cuvvahairfibers.com/wp-content/uploads/Monica-2.jpg', // Placeholder image
    },
    {
      text: '3. Enjoy the Results',
      img: 'https://cuvvahairfibers.com/wp-content/uploads/Monica-3.jpg', // Placeholder image
    },
    {
      text: '4. Enjoy the Results',
      img: 'https://cuvvahairfibers.com/wp-content/uploads/CUVVA-6.jpg', // Placeholder image
    },
  ];


  const benefits = [
    {
      icon: '✅',
      title: 'Easy to Use',
      description: 'Simple application process for quick results.',
    },
    {
      icon: '💧',
      title: 'Natural Look',
      description: 'Blends seamlessly with your natural hair.',
    },
    {
      icon: '⏳',
      title: 'Long-Lasting',
      description: 'Stays in place all day long.',
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="main">
      {/* Header Section */}
      <motion.div
        className="header"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.h1 variants={staggerItem}>Learn to Use It Properly for Best Results</motion.h1>
        <motion.div
          id="underline"
          variants={staggerItem}
          initial={{ width: '100%' }}
          whileInView={{ width: '50%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>

      {/* Steps Section */}
      <motion.div
        className="instruction-container"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        {steps.map((item, index) => (
          <motion.div
            key={index}
            className="list-item"
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p>{item.text}</p>
            <div className="image-container">
              <Image
                src={item.img}
                alt={`Step ${index + 1}`}
                width={400}
                height={300}
                className="step-image"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Before & After Section */}
      <motion.div
        className="before-after-section"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.h2 variants={staggerItem}>Before & After</motion.h2>
        <motion.div
          className="before-after-images"
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <Image
              src="https://cuvvahairfibers.com/wp-content/uploads/Alex-1.jpg" // Placeholder image
              alt="Before"
              width={400}
              height={300}
              className="before-image"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <Image
              src="https://cuvvahairfibers.com/wp-content/uploads/Alex-3.jpg" // Placeholder image
              alt="After"
              width={400}
              height={300}
              className="after-image"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="testimonials-section"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.h2 variants={staggerItem}>About our products.</motion.h2>
        <motion.div
          className="testimonials-container"
          variants={staggerContainer}
        >
          <motion.div
              className="testimonial"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src="https://cuvvahairfibers.com/wp-content/uploads/CUVVA-5.jpg"
                alt="cuvva"
                width={100}
                height={100}
                className="testimonial-image"
              />
          </motion.div>
          <motion.div
              className="testimonial"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src= "https://cuvvahairfibers.com/wp-content/uploads/CUVVA-3-scaled.jpg"
                alt="cuvva"
                width={100}
                height={100}
                className="testimonial-image"
              />
            </motion.div>
            <motion.div
              className="testimonial"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Image
                src="https://cuvvahairfibers.com/wp-content/uploads/CUVVA-2.jpg"
                alt="cuvva"
                width={100}
                height={100}
                className="testimonial-image"
              />
            </motion.div>
        </motion.div>
      </motion.div>

      {/* Benefits Section 
      <motion.div
        className="benefits-section"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.h2 variants={staggerItem}>Why Choose Us?</motion.h2>
        <motion.div
          className="benefits-container"
          variants={staggerContainer}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="benefit-icon">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>*/}

      {/* Call-to-Action Section */}
      <motion.div
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer}
        viewport={{ once: true }}
      >
        <motion.h2 variants={staggerItem}>Ready to Transform Your Hair?</motion.h2>
        <motion.button
          className="howitworks-btn"
          variants={staggerItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try It Yourself
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HowItWorks;