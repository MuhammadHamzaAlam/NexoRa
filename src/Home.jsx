import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import './index.css';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Configure Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Home = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [heroEmail, setHeroEmail] = useState('');
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [mapCenter] = useState([20, 0]);
  const [mapZoom] = useState(1.5);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const logoRef = useRef(null); // Added ref for logo animation

  // Sample routes for map visualization
  const sampleRoutes = useRef([
    {
      id: 'route-1',
      coords: [
        [40.7128, -74.0060], // New York
        [51.5074, -0.1278],   // London
        [1.3521, 103.8198],   // Singapore
      ],
      color: '#14b8a6',
      speed: 0.005,
    },
    {
      id: 'route-2',
      coords: [
        [50.4501, 30.5234],   // Kyiv
        [39.9042, 116.4074],  // Beijing
        [34.0522, -118.2437], // Los Angeles
      ],
      color: '#a78bfa',
      speed: 0.003,
    },
    {
      id: 'route-3',
      coords: [
        [28.6139, 77.2090],   // Delhi
        [35.6895, 139.6917],  // Tokyo
        [-33.8688, 151.2093], // Sydney
      ],
      color: '#2dd4bf',
      speed: 0.007,
    },
  ]);

  // Sample assets for map markers
  const sampleAssets = useRef([
    {
      id: 'asset-ship-1',
      routeId: 'route-1',
      type: 'ship',
      startOffset: 0,
      iconUrl: 'https://placehold.co/30x30/14b8a6/FFFFFF?text=S',
    },
    {
      id: 'asset-plane-1',
      routeId: 'route-2',
      type: 'plane',
      startOffset: 0.3,
      iconUrl: 'https://placehold.co/30x30/a78bfa/FFFFFF?text=P',
    },
    {
      id: 'asset-plane-2',
      routeId: 'route-3',
      type: 'plane',
      startOffset: 0.5,
      iconUrl: 'https://placehold.co/30x30/2dd4bf/FFFFFF?text=P',
    },
  ]);

  const currentAssetOffsets = useRef({});

  const createCustomIcon = useCallback((iconUrl) => {
    return L.icon({
      iconUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }, []);

  const getPointOnLine = useCallback((coords, progress) => {
    if (!coords || coords.length < 2) return [0, 0];
    const segmentLength = 1 / (coords.length - 1);
    const segmentIndex = Math.min(Math.floor(progress / segmentLength), coords.length - 2);
    const segmentProgress = (progress % segmentLength) / segmentLength;
    const p1 = coords[segmentIndex];
    const p2 = coords[segmentIndex + 1];
    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
    return [lat, lng];
  }, []);

  // Canvas animation for AI visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let nodes = [];
    let connections = [];
    let productFlowParticles = [];
    let predictionLines = [];

    const NUM_NODES = 30;
    const NODE_RADIUS = 6;
    const PARTICLE_COUNT = 300;
    const PARTICLE_SPEED_BASE = 1.5;
    const PARTICLE_SPEED_OPTIMIZED = 3.5;
    const OPTIMIZATION_INTERVAL = 6000;
    const PREDICTION_LINE_DURATION = 1500;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initializeNetwork();
    };

    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = NODE_RADIUS;
        this.color = '#14b8a6';
        this.connections = [];
        this.glowOpacity = 0;
        this.glowDirection = 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(20, 184, 166, ${this.glowOpacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.glowOpacity += this.glowDirection * 0.01;
        if (this.glowOpacity > 1 || this.glowOpacity < 0) {
          this.glowDirection *= -1;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < this.radius || this.x > canvas.width - this.radius) this.vx *= -1;
        if (this.y < this.radius || this.y > canvas.height - this.radius) this.vy *= -1;
      }
    }

    class ProductFlowParticle {
      constructor(startNode, endNode) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.x = startNode.x;
        this.y = startNode.y;
        this.progress = 0;
        this.speed = PARTICLE_SPEED_BASE;
        this.color = '#FFFFFF';
        this.size = 2;
        this.shape = Math.random() > 0.5 ? 'square' : 'triangle';
        this.opacity = 1;
        this.history = [];
        this.trailLength = 10;
      }

      update() {
        const dx = this.endNode.x - this.startNode.x;
        const dy = this.endNode.y - this.startNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.progress += this.speed / (distance || 1);
        this.history.push({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.history.length > this.trailLength) {
          this.history.shift();
        }
        if (this.progress >= 1) {
          const nextNodeIndex = Math.floor(Math.random() * this.endNode.connections.length);
          const nextNode = nodes[this.endNode.connections[nextNodeIndex]] || nodes[Math.floor(Math.random() * nodes.length)];
          this.startNode = this.endNode;
          this.endNode = nextNode;
          this.x = this.startNode.x;
          this.y = this.startNode.y;
          this.progress = 0;
          this.speed = PARTICLE_SPEED_BASE;
          this.history = [];
        } else {
          this.x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
          this.y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        }
      }

      draw() {
        for (let i = 0; i < this.history.length; i++) {
          const trailPoint = this.history[i];
          const trailOpacity = (i / this.trailLength) * this.opacity * 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          if (this.shape === 'square') {
            ctx.fillRect(trailPoint.x - this.size / 2, trailPoint.y - this.size / 2, this.size, this.size);
          } else {
            ctx.beginPath();
            ctx.moveTo(trailPoint.x, trailPoint.y - this.size / 2);
            ctx.lineTo(trailPoint.x + this.size / 2, trailPoint.y + this.size / 2);
            ctx.lineTo(trailPoint.x - this.size / 2, trailPoint.y + this.size / 2);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        if (this.shape === 'square') {
          ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size / 2);
          ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
          ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    class PredictionLine {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.opacity = 1;
        this.timer = 0;
        this.duration = PREDICTION_LINE_DURATION;
      }

      update(deltaTime) {
        this.timer += deltaTime;
        this.opacity = 1 - (this.timer / this.duration);
        return this.opacity <= 0;
      }

      draw() {
        ctx.strokeStyle = `rgba(167, 139, 250, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);
        ctx.lineTo(this.node2.x, this.node2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    const initializeNetwork = () => {
      nodes = [];
      connections = [];
      productFlowParticles = [];
      predictionLines = [];

      for (let i = 0; i < NUM_NODES; i++) {
        nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
      }

      for (let i = 0; i < NUM_NODES; i++) {
        const node1 = nodes[i];
        const distances = [];
        for (let j = 0; j < NUM_NODES; j++) {
          if (i === j) continue;
          const node2 = nodes[j];
          const dist = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
          distances.push({ index: j, dist });
        }
        distances.sort((a, b) => a.dist - b.dist);
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let k = 0; k < numConnections && k < distances.length; k++) {
          const targetNodeIndex = distances[k].index;
          if (!node1.connections.includes(targetNodeIndex)) {
            node1.connections.push(targetNodeIndex);
            if (!nodes[targetNodeIndex].connections.includes(i)) {
              nodes[targetNodeIndex].connections.push(i);
            }
            connections.push([i, targetNodeIndex]);
          }
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = startNode.connections.length > 0
          ? nodes[startNode.connections[Math.floor(Math.random() * startNode.connections.length)]]
          : nodes[Math.floor(Math.random() * nodes.length)];
        productFlowParticles.push(new ProductFlowParticle(startNode, endNode));
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const triggerOptimization = () => {
      predictionLines = [];
      const numOptimizedRoutes = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numOptimizedRoutes; i++) {
        const randomConnectionIndex = Math.floor(Math.random() * connections.length);
        const [node1Index, node2Index] = connections[randomConnectionIndex] || [];
        const node1 = nodes[node1Index];
        const node2 = nodes[node2Index];
        if (node1 && node2) {
          productFlowParticles.forEach((p) => {
            if ((p.startNode === node1 && p.endNode === node2) || (p.startNode === node2 && p.endNode === node1)) {
              p.speed = PARTICLE_SPEED_OPTIMIZED;
              gsap.to(p, { opacity: 1, duration: 0.5 });
            }
          });
          predictionLines.push(new PredictionLine(node1, node2));
          gsap.to(node1, {
            color: '#00FF00',
            duration: 0.3,
            onComplete: () => {
              gsap.to(node1, { color: '#14b8a6', duration: 1 });
            },
          });
          gsap.to(node2, {
            color: '#00FF00',
            duration: 0.3,
            onComplete: () => {
              gsap.to(node2, { color: '#14b8a6', duration: 1 });
            },
          });
        }
      }
    };

    let lastTime = 0;
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.1)';
      ctx.lineWidth = 1;
      connections.forEach((conn) => {
        const node1 = nodes[conn[0]];
        const node2 = nodes[conn[1]];
        if (node1 && node2) {
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.stroke();
        }
      });
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });
      productFlowParticles.forEach((p) => {
        p.update();
        p.draw();
      });
      predictionLines = predictionLines.filter((line) => !line.update(deltaTime));
      predictionLines.forEach((line) => line.draw());
      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const optimizationInterval = setInterval(triggerOptimization, OPTIMIZATION_INTERVAL);
    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      clearInterval(optimizationInterval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Fetch images for sections
  useEffect(() => {
    console.log('Home mounted, fetching images...');
    const fetchImages = async () => {
      try {
        const response = await fetch('https://nexora-main-a064225.kuberns.cloud/api/images');
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data);
        console.log('Images fetched:', data);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([
          { section: 'mission', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' },
          { section: 'map', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80' },
          { section: 'case', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80' },
          { section: 'predictive', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80' },
          { section: 'visibility', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80' },
          { section: 'enhancement', url: '/images/enhacement1.jpg' },
          { section: 'inventory', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80' },
          { section: 'decision', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80' },
          { section: 'cost', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80' },
          { section: 'transparency', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80' },
          { section: 'manufacturing', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80' },
          { section: 'ecommerce', url: '/images/e commerce.jpg' },
        ]);
      }
    };
    fetchImages();
  }, []);

  // Animate map markers
  useEffect(() => {
    sampleAssets.current.forEach((asset) => {
      currentAssetOffsets.current[asset.id] = asset.startOffset;
    });

    let animationFrameId;
    const animateMarkers = () => {
      sampleAssets.current.forEach((asset) => {
        const route = sampleRoutes.current.find((r) => r.id === asset.routeId);
        if (!route) return;
        let currentOffset = currentAssetOffsets.current[asset.id];
        currentOffset = (currentOffset + route.speed) % 1;
        currentAssetOffsets.current[asset.id] = currentOffset;
        const newCoords = getPointOnLine(route.coords, currentOffset);
        if (markerRefs.current[asset.id]) {
          markerRefs.current[asset.id].setLatLng(newCoords);
        }
      });
      animationFrameId = requestAnimationFrame(animateMarkers);
    };

    if (mapRef.current) {
      animationFrameId = requestAnimationFrame(animateMarkers);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [getPointOnLine]);

  // GSAP animations for navbar, logo, and sections
  useEffect(() => {
    // Navbar scroll-based animation
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

    // Logo animation (same as OurTechnology)
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

    // Floating animation for hero section circles
    gsap.utils.toArray('.float-circle').forEach((circle, index) => {
      gsap.to(circle, {
        y: -50,
        duration: 3 + index * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 0.2,
      });
    });

    // Section animations
    gsap.fromTo(
      '.hero-section h1, .hero-section p, .hero-section form',
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
      '.mission-section h2, .mission-section p, .mission-section img',
      { opacity: 0, x: -200 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.mission-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.features-section .card-3d',
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '#unlock-power-description',
      { opacity: 0, x: -200, rotation: -10, scale: 0.8 },
      {
        opacity: 1,
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '#unlock-power-description',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          gsap.to('#unlock-power-description', {
            scale: 1.05,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
          });
        },
      }
    );
    gsap.fromTo(
      '.case-studies-section h2, .case-studies-section p, .case-studies-section div',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.3,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.case-studies-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
    gsap.fromTo(
      '.contact-section h2, .contact-section p, .contact-section form, .contact-section img',
      { opacity: 0, x: 200 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-section',
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

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleHeroChange = (e) => setHeroEmail(e.target.value);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://nexora-main-a064225.kuberns.cloud/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) alert('Message sent successfully!');
      else throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message.');
    }
    setFormData({ name: '', email: '', message: '' });
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    navigate('/signup');
    setHeroEmail('');
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const getImageUrl = (section) => {
    const defaultImages = {
      mission: 'E:\\DEMANDIQ FRONTEND\\demand_forecasting\\mission.jpg',
      map: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
      case: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      predictive: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
      visibility: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
      logistics: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80',
      inventory: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
      decision: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
      cost: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
      transparency: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80',
      manufacturing: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      ecommerce: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    };
    return images.find((img) => img.section === section)?.url || defaultImages[section] || 'https://via.placeholder.com/800x600';
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

      {/* Navbar with updated logo */}
      <nav
        ref={navRef}
        className="fixed w-full z-50 p-6 flex justify-between items-center border border-teal-400 border-opacity-20 backdrop-blur-xl"
      >
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
        <div className="space-x-8 flex items-center">
          <Link
            to="/Technology"
            className="text-teal-400 hover:text-teal-300 relative text-xl transition-colors duration-300 group"
            onMouseEnter={(e) => gsap.to(e.target, { scale: 1.1, color: '#2dd4bf', duration: 0.3 })}
            onMouseLeave={(e) => gsap.to(e.target, { scale: 1, color: '#14b8a6', duration: 0.3 })}
          >
            Our Technology
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
          Unlock Your Supply <span>Chain's True Potential</span>
        </h1>
        <p className="text-3xl md:text-4xl mb-4 max-w-4xl mx-auto text-gray-200" data-gsap="description">
          SupplyChainAI leverages cutting-edge AI to provide predictive insights, optimize logistics, and minimize disruptions. Empowering businesses to achieve unprecedented efficiency and cost savings.
        </p>
        <form onSubmit={handleHeroSubmit} className="flex justify-center mt-4">
          <input
            type="email"
            value={heroEmail}
            onChange={handleHeroChange}
            placeholder="Enter your email"
            className="p-6 border rounded-l-lg w-[600px] text-3xl font-bold bg-gray-800 text-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
          />
          <button type="submit" className="bg-teal-600 text-white p-6 rounded-r-lg hover:bg-teal-700 text-2xl font-bold">
            Sign Up
          </button>
        </form>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`float-circle absolute bg-teal-500 opacity-20 rounded-full w-${10 + (i % 5) * 10} h-${10 + (i % 5) * 10}`}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          ></div>
        ))}
      </section>

      {/* Neural Network Section */}
      <section className="neural-network-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 text-center card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-teal-400">AI-Driven Global Logistics Intelligence</h2>
        <p className="text-2xl md:text-3xl mb-12 text-gray-200 max-w-4xl mx-auto" data-gsap="description">
          Witness your AI optimizing the global supply chain in real-time.
        </p>
        <div className="w-full h-[500px] relative z-20">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%', backgroundColor: '#111827' }}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />
            {sampleRoutes.current.map((route) => (
              <Polyline
                key={route.id}
                positions={route.coords}
                color={route.color}
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
                className="polyline-flow"
              />
            ))}
            {sampleAssets.current.map((asset) => (
              <Marker
                key={asset.id}
                position={getPointOnLine(sampleRoutes.current.find((r) => r.id === asset.routeId)?.coords || [], asset.startOffset)}
                icon={createCustomIcon(asset.iconUrl)}
                ref={(el) => (markerRefs.current[asset.id] = el)}
              />
            ))}
          </MapContainer>
        </div>
      </section>

      {/* AI Predictive Shield Section */}
      <section className="ai-predictive-shield-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 text-gray-200 text-center rounded-lg shadow-xl overflow-hidden card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-teal-400">AI-Powered Supply Chain Optimization</h2>
        <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto text-gray-400">
          Our AI continuously analyzes and optimizes logistics, predicting demand and ensuring efficient product flow.
        </p>
        <div className="relative w-full h-[300px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-teal-400 border-opacity-30">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-12 text-center text-teal-400">Our Mission</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-left md:pr-10">
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed" data-gsap="description">
              At SupplyChainAI, our journey began with a vision to harness the power of artificial intelligence 
              to transform the landscape of supply chain management , delivering innovative solutions that optimize operations, reduce costs, 
              and enhance resilience. Our mission is to empower organizations with cutting-edge technology, enabling them 
              to navigate complex supply chain challenges with confidence and efficiency. to push the boundaries of what’s possible in this dynamic industry.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src="/images/mission1.jpg" alt="Mission" className="w-full max-w-3xl rounded-lg border border-teal-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/predictive analytics.jpg" alt="Predictive Analytics" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Predictive Analytics Engine</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Forecast demand accurately and mitigate risks with our advanced predictive analytics, ensuring optimal inventory levels and reduced stockouts.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/dashboard.jpg" alt="Real-Time Visibility" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Real-Time Visibility Dashboard</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Gain end-to-end visibility into your supply chain with our real-time dashboard, enabling swift issue resolution.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/logistics.jpg" alt="Smart Logistics" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Smart Logistics Optimization</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Optimize transportation routes and logistics operations with our smart solutions, reducing costs and improving delivery times significantly.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/inventory.jpg" alt="Automated Inventory" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Automated Inventory Management</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Automate your inventory management processes with AI-driven insights, minimizing waste and maximizing efficiency.
            </p>
            <button className="mt-8 bg-teal-600 text-white px-8 py-4 rounded hover:bg-teal-700 text-lg">Learn More</button>
          </div>
        </div>
      </section>

      {/* Unlock Power Section */}
      <section className="py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <div className="flex flex-col md:flex-row items-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 md:mb-0 text-center md:text-left md:w-1/2 text-teal-400">
            Unlock the Power of AI for Supply Chain Excellence
          </h2>
          <p id="unlock-power-description" className="mb-8 md:mb-0 text-2xl md:text-3xl text-gray-200 text-left md:w-1/2 md:pl-10" data-gsap="description">
            Discover how SupplyChainAI can transform your supply chain, providing unparalleled insights and optimization. Our AI-driven solutions are designed to enhance efficiency, reduce costs, and improve overall performance. Embrace the future of supply chain management with our innovative technology and expertise.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/decision.jpg" alt="Enhanced Decision Making" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Enhanced Decision Making</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Leverage AI insights for smarter, data-driven decisions across your supply chain.
            </p>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/cost.jpg" alt="Reduced Operational Cost" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Reduced Operational Cost</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Optimize processes to cut costs and improve profitability with AI efficiency.
            </p>
          </div>
          <div className="text-center p-10 bg-gray-800 border border-teal-400 border-opacity-20 rounded-lg shadow-lg backdrop-blur-md hover:bg-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300 card-3d holo-scan">
            <img src="/images/transparency.jpeg" alt="Increased Transparency" className="mx-auto mb-8 w-full max-w-2xl h-80 object-cover rounded" />
            <h3 className="text-3xl font-bold text-teal-400">Increased Transparency</h3>
            <p className="mt-6 text-lg text-gray-200 text-left" data-gsap="description">
              Gain full visibility into your supply chain operations with real-time tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="case-studies-section py-24 px-6 max-w-8xl mx-auto relative z-20 bg-gray-900 card-3d holo-scan">
        <h2 className="text-6xl md:text-7xl font-bold mb-10 text-center text-teal-400">Real-World Supply Chain Successes</h2>
        <p className="mb-10 text-2xl md:text-3xl text-gray-200 text-center" data-gsap="description">
          Explore how SupplyChainAI has transformed supply chains for leading companies with innovative AI solutions.
        </p>
        <div className="space-y-20">
          {[
            {
              title: 'Global Retail Supply Chain Optimization',
              desc: 'Implemented an AI-driven solution for a major retail chain to optimize inventory management and logistics can result in 20% reduction in delivery times.',
              img: 'case',
            },
            {
              title: 'Manufacturing Logistics Enhancement',
              desc: 'Developed a predictive analytics system for a manufacturing firm to forecast supply chain disruptions and proactively address potential delays.',
              img: '/images/enhancement1.jpg',
            },
            {
              title: 'E-commerce Supply Chain Streamlining',
              desc: 'Deployed an AI solution for an e-commerce platform to optimize delivery routes and inventory distribution, boosting efficiency by 15%.',
              img: '/images/e commerce.jpg',
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10 text-left">
                <h3 className="text-5xl font-bold text-teal-400 mb-4">{item.title}</h3>
                <p className="text-2xl text-gray-200 mb-4" data-gsap="description">{item.desc}</p>
                <a href="#" className="text-teal-400 hover:underline text-xl" data-gsap="description">{item.link}</a>
              </div>
              <img src={getImageUrl(item.img)} alt={item.title} className="w-full md:w-1/2 max-w-2xl rounded-lg border border-teal-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-24 px-6 max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-20 bg-gray-900 card-3d holo-scan">
        <div className="md:w-1/2">
          <h2 className="text-6xl font-bold mb-8 text-teal-400">Get in Touch</h2>
          <p className="mb-8 text-2xl text-gray-200 text-left" data-gsap="description">
            Fill out the form below or find us on the map to connect.
          </p>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label className="block text-teal-400 text-lg" data-gsap="description">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full p-4 border rounded-lg bg-gray-800 text-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 text-lg"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-teal-400 text-lg" data-gsap="description">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full p-4 border rounded-lg bg-gray-800 text-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 text-lg"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-teal-400 text-lg" data-gsap="description">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                className="w-full p-4 border rounded-lg bg-gray-800 text-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-400 h-32 text-lg"
                placeholder="Type your message"
              ></textarea>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span className="text-lg text-gray-200" data-gsap="description">I accept the Terms</span>
              </label>
            </div>
            <button type="submit" className="bg-teal-600 text-white px-8 py-4 rounded-lg hover:bg-teal-700 text-lg">Submit</button>
          </form>
        </div>
        <div className="mt-12 md:mt-0 md:w-1/2 md:pl-12">
          <img src="/images/GIT.jpg" alt="Map" className="w-full max-w-2xl rounded-lg border border-teal-400" />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section bg-gray-900 text-gray-400 py-12 px-6 text-center relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-8xl mx-auto mb-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-3xl font-bold" data-text="SupplyChainAI">NexoRa</h3>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <Link to="/about" className="text-lg text-teal-400 hover:underline">About Us</Link>
            <Link to="/tech" className="text-lg text-teal-400 hover:underline">Our Technology</Link>
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

export default Home;