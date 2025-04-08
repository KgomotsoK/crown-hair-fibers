'use client';
import { ProductProvider } from '@/context/ProductContext';
import { faChevronLeft, faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import videoData from '../data/Videos.json';
import '../styles/home.css';
import ProductsList from './ProductsContainer';


// Types
interface VideoData {
  src: string;
  profilePic: string;
  name: string;
  comment: string;
}


interface VideoPlayerProps {
  showProfile?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ showProfile = false }) => {
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
    <>
      <div className='videoWrapper'>
        <FontAwesomeIcon className='arrow' icon={faChevronLeft} onClick={handlePrev} />

        <div className='videoContainer'>
          <video
            ref={videoRef}
            className='video'
            onEnded={handleVideoEnd}
            controls
          >
            <source src={videoData[currentVideo].src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {!isPlaying && (
            <FontAwesomeIcon className='playOverlay' icon={faCirclePlay} onClick={handlePlayClick} />
          )}
        </div>

        <FontAwesomeIcon className='arrow' icon={faChevronRight} onClick={handleNext} />
      </div>

      {showProfile && (
        <div className='userProfile'>
          <img
            src={videoData[currentVideo].profilePic}
            alt={videoData[currentVideo].name}
            className='profileImage'
          />
          <div className='profileDetails'>
            <h4 className='userName'>{videoData[currentVideo].name}</h4>
            <p className='userComment'>{videoData[currentVideo].comment}</p>
          </div>
        </div>
      )}

      <div className='dots'>
        {videoData.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentVideo ? 'activeDot' : ""}`}
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
          <Image id="header-img" src="/assets/images/props/hairstep2.png" alt="Hair Step 2" width={350} height={350}/>
          <div className='product-img-container'>
          <Image className='header-product-img' src='/assets/images/props/Cuvva.png' alt="Cuvva Hair Fibers" width={400} height={400}/>
          </div>
          </div>
          
        </div>
        </div>
       
        
        
      </section>
      <section className='homepage-section'>
        <div className='shop-now'>
          <h2>Shop Now</h2>
          <div className='products-list'>
          <ProductsList/>
          </div>
        </div>
      </section>
      
      <section className='homepage-section'>
      <div className='section-contents'>
      <h2>Effortless transformations</h2>
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
        </section>

        <section className='homepage-section'>
            <div className='section-contents'>
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

      <section className='homepage-section'>
      <div className='section-contents'>
      <h2>Hear directly from our happy clients</h2>
      <div className='video-container'>
      <VideoPlayer showProfile={true} />
      </div>
          
          </div>
        </section>

       
    </main>
      </ProductProvider>
    </QueryClientProvider>
  )
}

export default Home