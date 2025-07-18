'use client';
import { ProductProvider } from '@/context/ProductContext';
import { faChevronLeft, faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import videoData from '../data/Videos.json';
import '../styles/home.css';
import ProductsContainer from './ProductsContainer';


// Types
interface VideoPlayerProps {
  showProfile?: boolean;
  videoData: {
    src: string;
    loop?: string;
    profilePic: string;
    name: string;
    comment: string;
  }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ showProfile = false, videoData }) => {
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % videoData.length);
    setIsPlaying(false);
  }, [videoData.length]);

  const handleNext = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % videoData.length);
    setIsPlaying(false);
  }, [videoData.length]);

  const handlePrev = useCallback(() => {
    setCurrentVideo((prev) => (prev - 1 + videoData.length) % videoData.length);
    setIsPlaying(false);
  }, [videoData.length]);

  const handlePlayClick = useCallback(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Video playback failed:', error));
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [currentVideo]);

  return (
    <>
      {!showProfile ? (
        <div className="videoWrapper">
          <FontAwesomeIcon className="arrow" icon={faChevronLeft} onClick={handlePrev} />
          <div className="videoContainer">
            <video ref={videoRef} className="video" onEnded={handleVideoEnd} controls>
              <source src={videoData[currentVideo].loop} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <FontAwesomeIcon className="playOverlay" icon={faCirclePlay} onClick={handlePlayClick} />
            )}
          </div>
          <FontAwesomeIcon className="arrow" icon={faChevronRight} onClick={handleNext} />
        </div>
      ) : (
        <div className="videoWrapper">
          <FontAwesomeIcon className="arrow" icon={faChevronLeft} onClick={handlePrev} />
          <div className="videoContainer">
            <video ref={videoRef} className="video" onEnded={handleVideoEnd} controls>
              <source src={videoData[currentVideo].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <FontAwesomeIcon className="playOverlay" icon={faCirclePlay} onClick={handlePlayClick} />
            )}
          </div>
          <FontAwesomeIcon className="arrow" icon={faChevronRight} onClick={handleNext} />
        </div>
      )}

      {showProfile && (
        <div className="userProfile">
          <Image
            src={videoData[currentVideo].profilePic}
            alt={videoData[currentVideo].name}
            className="profileImage"
            width={50}
            height={50}
          />
          <div className="profileDetails">
            <h4 className="userName">{videoData[currentVideo].name}</h4>
            <p className="userComment">{videoData[currentVideo].comment}</p>
          </div>
        </div>
      )}

      <div className="dots">
        {videoData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentVideo ? 'activeDot' : ''}`}
            onClick={() => {
              setCurrentVideo(index);
              setIsPlaying(false);
            }}
          />
        ))}
      </div>
    </>
  );
};


const queryClient = new QueryClient();

const Home: React.FC = () => {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = useCallback(() => {
    setCurrentVideo(prev => (prev + 1) % videoData.length);
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentVideo(prev => (prev + 1) % videoData.length);
    setIsPlaying(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentVideo(prev => (prev - 1 + videoData.length) % videoData.length);
    setIsPlaying(false);
  }, []);

  const handlePlayClick = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Video playback failed:', error));
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [currentVideo]);


  return (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
    <main className='homepage'>
      <section className='header'>
        <div className='header-contents'>
        <div className='header-info'>
        <h1>Discover Richer, Fuller Results with CROWN Hair Fibers</h1>
        <p id='p1'>Effortless Application, Stunning Results</p>
        <button onClick={() => router.push('/shop')}>Shop Now</button>
        <p id='p2'>free shipping | 30 days guaranteed return</p>
        </div>
        <div className='headerPicsContainer'>
          <div className='pics-container'>
          <Image id="header-img" src="/assets/images/props/hairstep2.webp" alt="Hair Step 2" width={350} height={350}/>
          <div className='product-img-container'>
          <Image className='header-product-img' src='/assets/images/props/Cuvva.webp' alt="Cuvva Hair Fibers" width={400} height={400}/>
          </div>
          </div>
          
        </div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='homepage-section'
      >
        <div className='shop-now'>
          <h2>Shop Now</h2>
          <div className='products-list'>
          <ProductsContainer />
          </div>
        </div>
       </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className='homepage-section'
      >
      <div className='section-contents'>
      <h2>Effortless Transformations</h2>
      <div className='video-container'>
      <div className='videoWrapper'>
        <div className='videoContainer'>
          <video
            ref={videoRef}
            className='video'
            onEnded={handleVideoEnd}
            controls
          >
            <source src="https://crownhairfibers.com/wp-content/uploads/2018/06/CROWN-BRAND-STORY_Final.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <FontAwesomeIcon className='playOverlay' icon={faCirclePlay} onClick={handlePlayClick} />
          )}
        </div>

      </div>
      </div>   
        </div>
       </motion.section>

        <section className='homepage-section'>
            <div className='section-contents why-us-contents'>
            <h2>Why Choose CROWN Hair Fibers?</h2>
            <div className='why-us-section'>
              <p>Our fibers are made from high-quality hypoallergenic keratin protein, the same protein found in human hair. Once sprinkled into your hair, these tiny fibers cling like magnets to existing strands, filling in exposed scalp areas, and making hair strands appear thicker.</p>
              <div className='why-us-pics'>
              <div className='why-us-pic'>
              <Image src='https://crownhairfibers.com/wp-content/uploads/2019/06/clock@2x.png' alt="Why 1" width={100} height={100}/>
              Quick and Simple Application.
              </div>
              <div className='why-us-pic'>
              <Image src='https://crownhairfibers.com/wp-content/uploads/2019/06/gender@2x.png' alt="Why 1" width={100} height={100}/>Perfect For All Hair types, genders and ethnicities.
              </div>
              <div className='why-us-pic'>
              <Image src='https://crownhairfibers.com/wp-content/uploads/2019/06/weather-3@2x.png' alt="Why 1" width={100} height={100}/>Durable in all weather conditions.
              </div>
              </div>
              </div>
            
          </div>
          </section>

     <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className='homepage-section testimonials'
      >
        <div className='section-contents'>
          <h2>Hear Directly From Our Happy Clients</h2>
        <VideoPlayer showProfile={true} videoData={videoData} />
        </div>
      </motion.section>

       
    </main>
      </ProductProvider>
    </QueryClientProvider>
  )
}

export default Home