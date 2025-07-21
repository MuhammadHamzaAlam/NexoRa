import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// --- IMPORTANT: Replace with your actual Mapbox Access Token ---
// For production, use an environment variable like process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; 
// Example: 'pk.eyJ1IjoiYm91bmNlYm94IiwiYSI6ImNsc3F2a24xbDBwNnMya3Bjc3BwMTdxNmEifQ.U_k8N60QfK3qA_R0z_6lAA';

const GlobalSupplyChainMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(0); // Centered longitude
  const [lat] = useState(20); // Centered latitude
  const [zoom] = useState(1.5); // Initial zoom level

  // Define some sample routes and points for animation
  // In a real app, this data would come from your backend/AI
  const sampleRoutes = [
    {
      id: 'route-1',
      coords: [
        [-74.0060, 40.7128], // New York
        [-0.1278, 51.5074],  // London
        [103.8198, 1.3521],  // Singapore
      ],
      color: '#00B4D8', // Teal
      speed: 0.005, // How fast the 'data flow' animates
    },
    {
      id: 'route-2',
      coords: [
        [30.5234, 50.4501],  // Kyiv
        [116.4074, 39.9042], // Beijing
        [-118.2437, 34.0522], // Los Angeles
      ],
      color: '#CC5500', // Burnt Orange
      speed: 0.003,
    },
    {
      id: 'route-3',
        coords: [
            [77.2090, 28.6139], // Delhi
            [139.6917, 35.6895], // Tokyo
            [151.2093, -33.8688] // Sydney
        ],
        color: '#778899', // Muted Green
        speed: 0.007,
    }
  ];

  // Define some sample assets (ships, planes) that will move along routes
  const sampleAssets = [
    {
      id: 'asset-ship-1',
      routeId: 'route-1',
      type: 'ship', // Used for icon later
      startOffset: 0, // 0 to 1, where on the route to start
      icon: '/icons/ship-icon.png', // You'll need actual icons
    },
    {
      id: 'asset-plane-1',
      routeId: 'route-2',
      type: 'plane',
      startOffset: 0.3,
      icon: '/icons/plane-icon.png',
    },
    {
        id: 'asset-plane-2',
        routeId: 'route-3',
        type: 'plane',
        startOffset: 0.5,
        icon: '/icons/plane-icon.png',
    },
  ];

  const currentAssetPositions = useRef({}); // To store current asset offsets for animation

  // Function to calculate a point along a line (simplified linear interpolation)
  const getPointOnLine = useCallback((coords, progress) => {
    if (coords.length < 2) return coords[0];

    // Find which segment the progress falls into
    const segmentLength = 1 / (coords.length - 1);
    const segmentIndex = Math.min(Math.floor(progress / segmentLength), coords.length - 2);
    const segmentProgress = (progress % segmentLength) / segmentLength;

    const p1 = coords[segmentIndex];
    const p2 = coords[segmentIndex + 1];

    const lng = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lat = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    return [lng, lat];
  }, []);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // A dark theme works well for this
      center: [lng, lat],
      zoom: zoom,
      pitch: 30, // Add some perspective
      bearing: -10, // Slight rotation
      antialias: true,
    });

    map.current.on('load', () => {
      // Add a source for all routes
      map.current.addSource('supply-routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: sampleRoutes.map(route => ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: route.coords,
            },
            properties: {
              id: route.id,
              color: route.color,
            },
          })),
        },
      });

      // Add a layer for the routes
      map.current.addLayer({
        id: 'routes-layer',
        type: 'line',
        source: 'supply-routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.7,
          'line-dasharray': [0.1, 2], // For the 'flowing' effect
        },
      });

      // Add a source for animated assets
      map.current.addSource('animated-assets', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [], // Will be populated dynamically
        },
      });

      // Add layers for asset icons (you'll need to upload these or use Mapbox defaults)
      // This part requires you to add images to the map style or load them dynamically.
      // For simplicity, let's assume you have 'ship-icon' and 'plane-icon' loaded
      // If you don't have them, the assets won't show, but the map will still work.
      // You can add images like this:
      // map.current.loadImage('/icons/ship-icon.png', (error, image) => { if (!error) map.current.addImage('ship-icon', image); });
      // map.current.loadImage('/icons/plane-icon.png', (error, image) => { if (!error) map.current.addImage('plane-icon', image); });
      // ... or use simple circles as placeholders for now:

      map.current.addLayer({
        id: 'asset-icons-ship',
        type: 'circle', // Using circle as placeholder, ideally 'symbol' with custom image
        source: 'animated-assets',
        filter: ['==', ['get', 'type'], 'ship'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#00B4D8',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      map.current.addLayer({
        id: 'asset-icons-plane',
        type: 'circle', // Using circle as placeholder, ideally 'symbol' with custom image
        source: 'animated-assets',
        filter: ['==', ['get', 'type'], 'plane'],
        paint: {
          'circle-radius': 7,
          'circle-color': '#CC5500',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FFFFFF',
        },
      });

      // Initialize current asset positions
      sampleAssets.forEach(asset => {
        currentAssetPositions.current[asset.id] = asset.startOffset;
      });

      let animationFrameId;
      const animate = () => {
        // Animate route dasharray for 'flowing' effect
        const currentDashOffset = map.current.getPaintProperty('routes-layer', 'line-dasharray-offset');
        map.current.setPaintProperty('routes-layer', 'line-dasharray-offset', (currentDashOffset || 0) - 0.5);

        // Animate asset positions
        const updatedAssetFeatures = sampleAssets.map(asset => {
          const route = sampleRoutes.find(r => r.id === asset.routeId);
          if (!route) return null;

          let currentOffset = currentAssetPositions.current[asset.id] || 0;
          currentOffset = (currentOffset + route.speed) % 1; // Increment and loop
          currentAssetPositions.current[asset.id] = currentOffset;

          const coords = getPointOnLine(route.coords, currentOffset);

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coords,
            },
            properties: {
              id: asset.id,
              type: asset.type,
              // You can add more properties here, e.g., 'status', 'eta'
            },
          };
        }).filter(Boolean); // Remove any null features

        map.current.getSource('animated-assets').setData({
          type: 'FeatureCollection',
          features: updatedAssetFeatures,
        });

        // Loop the animation
        animationFrameId = requestAnimationFrame(animate);
      };

      animate(); // Start the animation loop

      // Clean up animation frame on unmount
      return () => cancelAnimationFrame(animationFrameId);
    });

    // Cleanup map on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lng, lat, zoom, getPointOnLine]); // Re-run if these initial values change

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default GlobalSupplyChainMap;