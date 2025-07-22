import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import './index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OurTechnology = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const logoRef = useRef(null); // Ref for logo animation

  // GSAP animations
  useEffect(() => {
    if (navRef.current) {
      gsap.set(navRef.current, { opacity: 0, y: -100, background: 'rgba(17, 24, 39, 0)' });
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top -100',
        onEnter: () => {
          gsap.to(navRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          });
          gsap.to(navRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.2,
          });
        },
      });
      gsap.to(navRef.current, {
        background: 'rgba(17, 24, 39, 0.95)',
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: document.body,
          start: 'top -100',
          toggleActions: 'play none none none',
        },
      });
    }

    // Animate the logo text (no pseudo-element animation)
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: logoRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    gsap.fromTo(
      '.hero-section h1, .hero-section p, .hero-section button',
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.tech-core-section h2, .tech-core-section p, .tech-core-section video',
      { opacity: 0, x: -200 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.tech-core-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.innovations-section .card-3d',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.innovations-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.impact-section h2, .impact-section div',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.impact-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.footer-section a, .footer-section p',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.to('.bgMove', {
      backgroundPosition: '50% 100%',
      duration: 10,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    gsap.utils.toArray('.float, .float-around').forEach((element) => {
      gsap.to(element, {
        y: '-=100',
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 relative overflow-hidden">
      {/* Background effects */}
      <div className="bgMove absolute inset-0 z-0 opacity-20"></div>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="float absolute w-2 h-2 bg-teal-500 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 3 + 3}s`,
          }}
        ></div>
      ))}
      <svg className="absolute inset-0 z-10 opacity-30" width="100%" height="100%">
        <defs>
          <pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="rgba(45, 212, 191, 0.1)" />
            <circle cx="50" cy="50" r="2" fill="rgba(45, 212, 191, 0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grain)" />
      </svg>

      {/* Navbar */}
      <nav
        ref={navRef}
        className="fixed w-full z-50 p-6 flex justify-between items-center border border-teal-400 border-opacity-20 backdrop-blur-xl"
      >
        <span
          ref={logoRef}
          className="logo-text text-4xl font-bold text-white"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
          }}
        >
          NexoRa
        </span>
        <div className="space-x-8 flex items-center">
          <Link
            to="/"
            className="text-teal-400 hover:text-teal-300 relative text-xl transition-colors duration-300 group"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, color: '#2dd4bf', duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, color: '#14b8a6', duration: 0.3 })}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/contact"
            className="text-teal-400 hover:text-teal-300 relative text-xl transition-colors duration-300 group"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, color: '#2dd4bf', duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, color: '#14b8a6', duration: 0.3 })}
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <button
            onClick={handleGetStarted}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 text-xl transition-all duration-300"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            Get Started
          </button>
          <button
            className="bg-transparent text-teal-400 px-8 py-3 rounded-lg border border-teal-400 hover:bg-teal-600 hover:text-white text-xl transition-all duration-300"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
          >
            Learn More
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-center py-48 relative z-20 card-3d holo-scan">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight text-teal-400">
          Integrating AI for Supply Chain Excellence
        </h1>
        <p className="text-3xl md:text-4xl mb-8 max-w-4xl mx-auto text-gray-200" data-gsap="description">
          SupplyChainAI's innovative technology harnesses advanced machine learning to deliver unparalleled supply chain insights, driving efficiency and resilience.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700 text-2xl font-bold"
          onMouseEnter={(e) => gsap.to(e.target, { scale: 1.05, duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.target, { scale: 1, duration: 0.3 })}
        >
          Explore Our Solutions
        </button>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`float-circle absolute bg-teal-500 opacity-20 rounded-full w-${10 + (i % 5) * 10} h-${10 + (i % 5) * 10}`}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          ></div>
        ))}
      </section>

      {/* Technology Core Section */}
      <section className="tech-core-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center text-teal-400">The Core of Our Technology</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-left md:pr-10">
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed" data-gsap="description">
              At the heart of SupplyChainAI lies a sophisticated RandomForest-based machine learning framework that integrates diverse data sources—historical sales, weather, economic indices, and holiday patterns—to deliver precise demand forecasts. Our system dynamically processes real-time data, enabling adaptive inventory strategies and proactive disruption management, ensuring your supply chain remains agile and cost-effective.
            </p>
          </div>
          <div className="md:w-1/2">
            <video 
              src="/images/core-technology.mp4" 
              className="w-full max-w-3xl rounded-lg border border-teal-400" 
              autoPlay 
              loop 
              muted 
              playsInline 
              controls
            ></video>
          </div>
        </div>
      </section>

      {/* Innovations Section */}
      <section className="innovations-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center text-teal-400">Innovative AI Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/supplier_risk.jpg" alt="Supplier Risk Assessment" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Supplier Risk Assessment</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Evaluates supplier reliability using AI-driven analysis of performance metrics, financial stability, and external risk factors, ensuring robust supplier selection.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/anomalies.jpeg" alt="Anomaly Detection" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Anomaly Detection</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Detects and flags unusual patterns in sales or supply chain data, such as unexpected spikes or drops, enabling proactive issue resolution.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/scenario.jpg" alt="Scenario Analysis" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Scenario Analysis</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Simulates multiple supply chain scenarios to evaluate the impact of disruptions or strategic decisions, empowering data-driven planning.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center text-teal-400">Impact of Our Technology</h2>
        <div className="space-y-20">
          {[
            {
              title: 'Proactive Disruption Management',
              desc: 'Our anomaly detection and scenario analysis tools identify potential disruptions early, enabling businesses to mitigate risks and maintain operational continuity, reducing downtime by up to 30%.',
              img: '/images/disruption.jpg',
            },
            {
              title: 'Enhanced Supply Chain Agility',
              desc: 'Dynamic route planning and real-time data integration allow businesses to adapt quickly to market changes, improving responsiveness and customer satisfaction.',
              img: '/images/agility.jpg',
            },
            {
              title: 'Data-Driven Strategic Planning',
              desc: 'Our AI provides deep insights through scenario analysis, helping businesses plan strategically and optimize long-term supply chain performance.',
              img: '/images/strategy.jpg',
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10 text-left">
                <h3 className="text-5xl font-bold text-teal-400 mb-4">{item.title}</h3>
                <p className="text-2xl text-gray-200 mb-4" data-gsap="description">{item.desc}</p>
              </div>
              <img src={item.img} alt={item.title} className="w-full md:w-1/2 max-w-2xl rounded-lg border border-teal-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section bg-gray-900 text-gray-400 py-12 px-6 text-center relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-8xl mx-auto mb-8">
          <div className="mb-6 md:mb-0">
            <span
              ref={logoRef}
              className="logo-text text-3xl font-bold text-white"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
              }}
            >
              NexoRa
            </span>
            <p className="text-lg">© 2025 NexoRa. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <Link to="/" className="text-lg text-teal-400 hover:underline">Home</Link>
            <Link to="/contact" className="text-lg text-teal-400 hover:underline">Contact</Link>
            <a href="#privacy" className="text-lg text-teal-400 hover:underline">Privacy Policy</a>
          </div>
        </div>
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-teal-400 transition-colors duration-300"><i className="fab fa-facebook"></i></a>
          <a href="#" className="hover:text-teal-400 transition-colors duration-300"><i className="fab fa-twitter"></i></a>
          <a href="#" className="hover:text-teal-400 transition-colors duration-300"><i className="fab fa-linkedin"></i></a>
          <a href="#" className="hover:text-teal-400 transition-colors duration-300"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default OurTechnology;