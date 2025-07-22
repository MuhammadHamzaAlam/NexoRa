import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { FaUpload, FaChartLine, FaCogs, FaLightbulb, FaCloudSun, FaDollarSign, FaClock, FaBoxOpen, FaChartBar, FaDatabase, FaBrain, FaChartPie } from 'react-icons/fa';
import { LuBrainCircuit } from 'react-icons/lu';
import gsap from 'gsap';

// Firebase Config and other imports remain unchanged
const firebaseConfig = {
  apiKey: "AIzaSyCbF2IHEt43LOlrnls79rynhlcx-OYm1C0",
  authDomain: "demandiq-b387f.firebaseapp.com",
  projectId: "demandiq-b387f",
  storageBucket: "demandiq-b387f.firebasestorage.app",
  messagingSenderId: "263616262367",
  appId: "1:263616262367:web:5a6f9e411adf1fa4c2396a"
};
const app = initializeApp(firebaseConfig, 'default-app-id');
const auth = getAuth(app);
const db = getFirestore(app);

const API_BASE_URL = 'https://muhammadhamza125.pythonanywhere.com';

// ErrorBoundary and other components remain unchanged
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">Something went wrong: {this.state.error.message}</span>
          <p className="mt-2 text-sm">Please check your Firebase configuration or reload the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // Other state variables and useEffect hooks remain unchanged
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiSolutionsData, setAiSolutionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMessage, setTrainingMessage] = useState('');
  const [inventorySettings, setInventorySettings] = useState({
    current_stock: 180,
    lead_time_days: 7,
    demand_variability_std: 20.23,
    order_cost: 50,
    holding_cost_annual_percent: 0.25,
    item_cost: 10,
  });
  const [settingsMessage, setSettingsMessage] = useState('');
  const [userId, setUserId] = useState(null);

  // Quantum Field Background Animation (unchanged)
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'quantum-background';
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.35';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(45, 212, 191, 0.5)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => canvas.remove();
  }, []);

  // Particle Systems (unchanged)
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.width = '5px';
      particle.style.height = '5px';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      document.body.appendChild(particle);
      particles.push(particle);
      gsap.to(particle, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        duration: 5 + Math.random() * 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  // Authentication and other useEffect hooks remain unchanged
  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
          setError('No user authenticated. Please log in.');
        }
      });
      checkBackendHealth();
    } catch (err) {
      setError('Firebase authentication failed to initialize.');
    }
    return () => unsubscribe && unsubscribe();
  }, []);

  // Fetch Data and other functions remain unchanged
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const idToken = await auth.currentUser.getIdToken();
        await Promise.all([
          fetchDashboardData(idToken),
          fetchAnalyticsData(idToken),
          fetchAiSolutionsData(idToken),
          fetchInventorySettings(),
        ]);
        setError(null);
      } catch (err) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const checkBackendHealth = useCallback(async () => {
    try {
      await axios.get(`${API_BASE_URL}/`);
    } catch (err) {
      setError(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure it is running.`);
    }
  }, []);

  const fetchDashboardData = useCallback(async (idToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_dashboard_data`, {
        params: { userId },
        headers: { Authorization: `Bearer ${idToken}` }
      });
      setDashboardData(response.data);
    } catch (err) {
      setError(`Failed to load dashboard data: ${err.response?.data?.error || err.message}.`);
    }
  }, [userId]);

  const fetchAnalyticsData = useCallback(async (idToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_analytics_data`, {
        params: { userId },
        headers: { Authorization: `Bearer ${idToken}` }
      });
      setAnalyticsData(response.data);
    } catch (err) {
      setError(`Failed to load analytics data: ${err.response?.data?.error || err.message}.`);
    }
  }, [userId]);

  const fetchAiSolutionsData = useCallback(async (idToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_ai_solutions_data`, {
        params: { userId },
        headers: { Authorization: `Bearer ${idToken}` }
      });
      setAiSolutionsData(response.data);
    } catch (err) {
      setError(`Failed to load AI solutions data: ${err.response?.data?.error || err.message}.`);
    }
  }, [userId]);

  const fetchInventorySettings = useCallback(async () => {
    if (!userId) return;
    try {
      const docRef = doc(db, 'artifacts', 'default-app-id', 'users', userId, 'inventory_settings', 'current');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInventorySettings(docSnap.data());
      }
    } catch (error) {
      setSettingsMessage(`Failed to fetch inventory settings: ${error.message}`);
    }
  }, [userId]);

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }
    if (!userId) {
      setUploadMessage('User ID not available. Cannot upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('userId', userId);

    setIsUploading(true);
    setUploadMessage('Uploading...');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.post(`${API_BASE_URL}/upload_historical_data`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${idToken}`,
        },
      });
      setUploadMessage(response.data.message);
      fetchDashboardData(idToken);
      fetchAnalyticsData(idToken);
      fetchAiSolutionsData(idToken);
    } catch (err) {
      setUploadMessage(`Upload error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTrainModel = async () => {
    if (!userId) {
      setTrainingMessage('User ID not available. Cannot train model.');
      return;
    }
    setIsTraining(true);
    setTrainingMessage('Training model...');
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await axios.post(`${API_BASE_URL}/train_model`, { userId }, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setTrainingMessage(response.data.message + `. MAPE: ${response.data.results.mape_score.toFixed(2)}%, R2: ${response.data.results.r2_score.toFixed(2)}`);
      fetchDashboardData(idToken);
      fetchAnalyticsData(idToken);
      fetchAiSolutionsData(idToken);
    } catch (err) {
      setTrainingMessage(`Model training error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleSettingsChange = (e) => {
    const { name, value, type } = e.target;
    setInventorySettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveSettings = async () => {
    if (!userId) {
      setSettingsMessage('User ID not available. Cannot save settings.');
      return;
    }
    try {
      const idToken = await auth.currentUser.getIdToken();
      const docRef = doc(db, 'artifacts', 'default-app-id', 'users', userId, 'inventory_settings', 'current');
      await setDoc(docRef, inventorySettings, { merge: true });

      await axios.post(
        `${API_BASE_URL}/save_inventory_settings`,
        { userId, ...inventorySettings },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      setSettingsMessage('Settings saved successfully!');
      fetchDashboardData(idToken);
      fetchAiSolutionsData(idToken);
    } catch (error) {
      setSettingsMessage(`Failed to save settings: ${error.message}`);
    }
  };

  // renderSection remains unchanged
  const renderSection = (sectionName) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="ml-4 text-teal-400">Loading data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <p className="mt-2 text-sm">Please ensure your backend server is running at {API_BASE_URL} and you are authenticated.</p>
        </div>
      );
    }

    switch (sectionName) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 gap-6 relative">
            <div className="grid-animation"></div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Demand */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">Current Demand (Tomorrow)</h3>
                  <p className="text-3xl font-bold text-teal-500 mt-2">{dashboardData?.current_demand?.value || 'N/A'}</p>
                  <p className={`text-sm ${dashboardData?.current_demand?.change_percent >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                    {dashboardData?.current_demand?.change_percent >= 0 ? '+' : ''}{dashboardData?.current_demand?.change_percent || '0'}% vs previous day
                  </p>
                </div>
                <FaChartLine className="text-gold-400 text-4xl" />
              </div>

              {/* Safety Stock */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">Recommended Safety Stock</h3>
                  <p className="text-3xl font-bold text-violet-500 mt-2">{dashboardData?.safety_stock || 'N/A'} units</p>
                  <p className="text-sm text-gray-400">To prevent stockouts</p>
                </div>
                <FaBoxOpen className="text-gold-400 text-4xl" />
              </div>

              {/* Forecast Accuracy */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">Forecast Accuracy (MAPE)</h3>
                  <p className="text-3xl font-bold text-indigo-500 mt-2">{dashboardData?.forecast_accuracy || 'N/A'}%</p>
                  <p className="text-sm text-gray-400">Model performance</p>
                </div>
                <FaCogs className="text-gold-400 text-4xl" />
              </div>

              {/* Additional cards */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">Avg. Lead Time</h3>
                  <p className="text-3xl font-bold text-gold-500 mt-2">{dashboardData?.avg_lead_time_days || 'N/A'} days</p>
                  <p className="text-sm text-gray-400">Supplier delivery average</p>
                </div>
                <FaClock className="text-gold-400 text-4xl" />
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">Demand Variability (Std Dev)</h3>
                  <p className="text-3xl font-bold text-red-500 mt-2">{dashboardData?.demand_variability_std_dev || 'N/A'}</p>
                  <p className="text-sm text-gray-400">Measure of fluctuation</p>
                </div>
                <FaChartLine className="text-gold-400 text-4xl" />
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-1 card-3d holo-scan">
                <div>
                  <h3 className="text-lg font-semibold text-teal-400">AI Insights Summary</h3>
                  <p className="text-xl font-bold text-gray-200 mt-2">{dashboardData?.ai_insights_summary || 'No insights available.'}</p>
                </div>
                <FaLightbulb className="text-gold-400 text-4xl" />
              </div>
            </div>

            {/* AI Demand Forecasting */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md col-span-full card-3d holo-scan">
              <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
                <LuBrainCircuit className="mr-2 text-teal-500 text-2xl" /> AI Demand Forecasting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Input Features</h4>
                  {dashboardData?.ai_demand_forecasting?.input_features ? (
                    <ul className="text-gray-300 space-y-1">
                      <li><span className="font-semibold">Month-Year:</span> {dashboardData.ai_demand_forecasting.input_features.month_year || 'N/A'}</li>
                      <li><span className="font-semibold">Lag-7 Sales:</span> {dashboardData.ai_demand_forecasting.input_features.lag_7 || 'N/A'}</li>
                      <li><span className="font-semibold">Lag-30 Sales:</span> {dashboardData.ai_demand_forecasting.input_features.lag_30 || 'N/A'}</li>
                      <li><span className="font-semibold">Event Flag:</span> {dashboardData.ai_demand_forecasting.input_features.event_flag ? 'Yes' : 'No'}</li>
                      <li><span className="font-semibold">Event Name:</span> {dashboardData.ai_demand_forecasting.input_features.event_name || 'N/A'}</li>
                      <li><span className="font-semibold">Discount %:</span> {dashboardData.ai_demand_forecasting.input_features.discount_percentage || 'N/A'}%</li>
                      <li><span className="font-semibold">Temperature:</span> {dashboardData.ai_demand_forecasting.input_features.temperature || 'N/A'}°C</li>
                      <li><span className="font-semibold">7-Day MA Trend:</span> {dashboardData.ai_demand_forecasting.input_features.ma_7_trend || 'N/A'}</li>
                      <li><span className="font-semibold">Day of Week (Sin):</span> {dashboardData.ai_demand_forecasting.input_features.day_of_week_sin || 'N/A'}</li>
                      <li><span className="font-semibold">Event Pattern:</span> {dashboardData.ai_demand_forecasting.input_features.event_pattern || 'N/A'}</li>
                    </ul>
                  ) : (
                    <p className="text-gray-400">No input features available.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Prediction Output</h4>
                  {dashboardData?.ai_demand_forecasting?.prediction_output ? (
                    <div className="space-y-1">
                      <p><span className="font-semibold text-teal-400">Predicted Demand:</span> {dashboardData.ai_demand_forecasting.prediction_output.predicted_demand || 'N/A'}</p>
                      <p><span className="font-semibold text-teal-400">Baseline Demand:</span> {dashboardData.ai_demand_forecasting.prediction_output.baseline_demand || 'N/A'}</p>
                      <p><span className="font-semibold text-teal-400">Confidence Interval:</span> {dashboardData.ai_demand_forecasting.prediction_output.confidence_interval || 'N/A'}</p>
                      <p><span className="font-semibold text-teal-400">Accuracy Score:</span> {dashboardData.ai_demand_forecasting.prediction_output.accuracy_score || 'N/A'}%</p>
                      <h5 className="font-semibold text-gray-300 mt-4">AI Reasoning:</h5>
                      <p className="text-gray-400 text-sm">{dashboardData.ai_demand_forecasting.prediction_output.ai_reasoning || 'No reasoning available.'}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400">No prediction output available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Graphs: Demand Forecast and Trend Analysis Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demand Forecast with Confidence Intervals */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Demand Forecast with Confidence Intervals</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData?.ai_demand_forecasting?.prediction_output?.forecast_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf" />
                    <XAxis dataKey="date" stroke="#d1d5db" />
                    <YAxis stroke="#d1d5db" />
                    <Tooltip contentStyle={{ background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(45, 212, 191, 0.25)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#818cf8" name="Historical Sales" />
                    <Line type="monotone" dataKey="predicted_demand" stroke="#14b8a6" name="AI Forecast" />
                    <Line type="monotone" dataKey="upper_confidence" stroke="#a78bfa" name="Upper Confidence (95%)" />
                    <Line type="monotone" dataKey="lower_confidence" stroke="#4f46e5" name="Lower Confidence (95%)" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-300">Inventory Status</h4>
                    <p className="text-gray-300">Current Stock: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Current_Stock || 'N/A'}</span></p>
                    <p className="text-gray-300">Reorder Point: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Reorder_Point || 'N/A'}</span></p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-300">Today's Highlights</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>Demand trending <span className="font-bold text-teal-500">{dashboardData?.current_demand?.change_percent || 'N/A'}%</span> above forecast</li>
                      <li>Temperature impact: <span className="font-bold text-teal-500">{dashboardData?.weather_integration?.correlation ? `${(dashboardData.weather_integration.correlation * 100).toFixed(0)}%` : 'N/A'}</span> demand boost</li>
                      <li>Weekend pattern detected <span className="font-bold text-teal-500">{dashboardData?.time_patterns?.weekly_pattern || 'N/A'}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-300">AI Recommendations</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>Restock Alert: Order <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Optimal_Order_Quantity || 'N/A'}</span> units by <span className="font-bold text-teal-500">{new Date().toLocaleDateString('en-US', { weekday: 'long' }) || 'Thursday'}</span></li>
                    <li>Promotion Opportunity: <span className="font-bold text-teal-500">{dashboardData?.promo_manager_impact?.discount_percent || 'N/A'}%</span> discount could boost sales <span className="font-bold text-teal-500">{dashboardData?.promo_manager_impact?.predicted_demand_increase_percent || 'N/A'}%</span></li>
                  </ul>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Trend Analysis</h3>
                <p className="text-xl text-gray-200">
                  Current Trend: <span className="font-bold">{dashboardData?.trend_analysis?.current_trend_description || 'N/A'}</span> (<span className="font-bold text-teal-500">{dashboardData?.trend_analysis?.current_trend_percent || '0'}%</span>)
                </p>
                {analyticsData?.trend_indicators && analyticsData.trend_indicators.length > 0 && (
                  <ResponsiveContainer width="100%" height={300} className="mt-4">
                    <LineChart data={analyticsData.trend_indicators}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2dd4bf" />
                      <XAxis dataKey="date" stroke="#d1d5db" />
                      <YAxis stroke="#d1d5db" />
                      <Tooltip contentStyle={{ background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(45, 212, 191, 0.25)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#818cf8" name="Sales" />
                      <Line type="monotone" dataKey="ma_7" stroke="#14b8a6" name="7-Day MA" />
                      <Line type="monotone" dataKey="ma_30" stroke="#a78bfa" name="30-Day MA" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Weather Integration</h3>
                <p className="text-gray-200">Temperature: <span className="font-bold text-teal-500">{dashboardData?.weather_integration?.temperature || 'N/A'}°C</span></p>
                <p className="text-gray-200">Precipitation: <span className="font-bold text-teal-500">{dashboardData?.weather_integration?.precipitation || 'N/A'} mm</span></p>
                <p className="text-gray-400 text-sm mt-2">Correlation with Sales: Temp: <span className="text-teal-500">{dashboardData?.weather_integration?.correlation || 'N/A'}</span>, Precip: <span className="text-teal-500">{dashboardData?.weather_integration?.precipitation_correlation || 'N/A'}</span></p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Economic Data (GDP)</h3>
                <p className="text-gray-200">Latest Index: <span className="font-bold text-teal-500">{dashboardData?.economic_data?.index_value || 'N/A'}</span></p>
                <p className="text-gray-400 text-sm mt-2">Correlation with Sales: <span className="text-teal-500">{dashboardData?.economic_data?.correlation || 'N/A'}</span></p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Time Patterns</h3>
                <p className="text-gray-200">Weekly: <span className="font-bold text-teal-500">{dashboardData?.time_patterns?.weekly_pattern || 'N/A'}</span></p>
                <p className="text-gray-200">Monthly: <span className="font-bold text-teal-500">{dashboardData?.time_patterns?.monthly_trend || 'N/A'}</span></p>
                <p className="text-gray-200">Quarterly: <span className="font-bold text-teal-500">{dashboardData?.time_patterns?.quarterly_cycle || 'N/A'}</span></p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Promotional Impact</h3>
                <p className="text-gray-200">Last Discount: <span className="font-bold text-teal-500">{dashboardData?.promo_manager_impact?.discount_percent || 'N/A'}%</span></p>
                <p className="text-gray-200">Predicted Demand Increase: <span className="font-bold text-teal-500">{dashboardData?.promo_manager_impact?.predicted_demand_increase_percent || 'N/A'}%</span></p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
                <h3 className="text-lg font-semibold text-teal-400 mb-4">Lead Time Intelligence</h3>
                <p className="text-gray-200">Avg Lead Time: <span className="font-bold text-teal-500">{dashboardData?.lead_time_intel?.avg_lead_time || 'N/A'} days</span></p>
                <p className="text-gray-200">Variability: <span className="font-bold text-teal-500">{dashboardData?.lead_time_intel?.variability_sigma || 'N/A'}</span></p>
              </div>
            </div>

            {/* Inventory Optimization */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md col-span-full card-3d holo-scan">
              <h3 className="text-lg font-semibold text-teal-400 mb-4">Inventory Optimization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-300">Current Situation</h4>
                  <p className="text-gray-300">Current Stock: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Current_Stock || 'N/A'}</span></p>
                  <p className="text-gray-300">Predicted Demand (30 Days): <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Predicted_Demand_30_Days || 'N/A'}</span></p>
                  <p className="text-gray-300">Lead Time: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Lead_Time || 'N/A'} days</span></p>
                  <p className="text-gray-300">Demand Variability (Std Dev): <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Demand_Variability_Std_Dev || 'N/A'}</span></p>
                  <p className="text-gray-300">Order Cost: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Order_Cost || 'N/A'}</span></p>
                  <p className="text-gray-300">Holding Cost: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Holding_Cost || 'N/A'}</span></p>
                  <p className="text-gray-300">Item Cost: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Current_Situation?.Item_Cost || 'N/A'}</span></p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-300">Optimization Results</h4>
                  <p className="text-gray-300">Reorder Now: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Reorder_Now ? 'Yes' : 'No'}</span></p>
                  <p className="text-gray-300">Reorder Point: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Reorder_Point || 'N/A'}</span></p>
                  <p className="text-gray-300">Safety Stock: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Safety_Stock || 'N/A'}</span></p>
                  <p className="text-gray-300">Optimal Order Quantity: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Optimal_Order_Quantity || 'N/A'}</span></p>
                  <p className="text-gray-300">Days Until Stockout: <span className="font-bold text-teal-500">{dashboardData?.inventory_optimization?.Optimization_Results?.Days_Until_Stockout || 'N/A'}</span></p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'data_integration':
        return (
          <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6 card-3d holo-scan relative">
            <div className="grid-animation"></div>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Data Integration & Model Training</h2>
            
            {/* Upload Historical Data */}
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-2">1. Upload Historical Sales Data</h3>
              <p className="text-gray-400 mb-4">Upload a CSV, Excel (.xlsx), or JSON file containing 'date' and 'sales' columns.</p>
              <input 
                type="file" 
                onChange={(e) => setUploadFile(e.target.files[0])} 
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-900 file:text-teal-400 hover:file:bg-teal-800"
              />
              <button 
                onClick={handleUpload} 
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center"
                disabled={isUploading || !uploadFile}
              >
                {isUploading ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaUpload className="mr-2" />
                )}
                {isUploading ? 'Uploading...' : 'Upload Data'}
              </button>
              {uploadMessage && <p className="mt-2 text-sm text-gray-400">{uploadMessage}</p>}
            </div>

            {/* Train Model */}
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-2">2. Train Demand Forecasting Model</h3>
              <p className="text-gray-400 mb-4">After uploading your data, train the AI model to generate insights and predictions.</p>
              <button 
                onClick={handleTrainModel} 
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                disabled={isTraining}
              >
                {isTraining ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <LuBrainCircuit className="mr-2 text-xl" />
                )}
                {isTraining ? 'Training...' : 'Train Model'}
              </button>
              {trainingMessage && <p className="mt-2 text-sm text-gray-400">{trainingMessage}</p>}
            </div>

            {/* Inventory Settings */}
            <div>
              <h3 className="text-xl font-semibold text-teal-400 mb-2">3. Inventory Optimization Settings</h3>
              <p className="text-gray-400 mb-4">Adjust parameters for inventory optimization calculations.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-300">Current Stock:</span>
                  <input type="number" name="current_stock" value={inventorySettings.current_stock} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
                <label className="block">
                  <span className="text-gray-300">Lead Time (Days):</span>
                  <input type="number" name="lead_time_days" value={inventorySettings.lead_time_days} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
                <label className="block">
                  <span className="text-gray-300">Demand Variability (Std Dev):</span>
                  <input type="number" name="demand_variability_std" value={inventorySettings.demand_variability_std} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
                <label className="block">
                  <span className="text-gray-300">Order Cost ($):</span>
                  <input type="number" name="order_cost" value={inventorySettings.order_cost} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
                <label className="block">
                  <span className="text-gray-300">Holding Cost (Annual %):</span>
                  <input type="number" name="holding_cost_annual_percent" value={inventorySettings.holding_cost_annual_percent} onChange={handleSettingsChange} step="0.01" className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
                <label className="block">
                  <span className="text-gray-300">Item Cost ($):</span>
                  <input type="number" name="item_cost" value={inventorySettings.item_cost} onChange={handleSettingsChange} className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-200 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50" />
                </label>
              </div>
              <button 
                onClick={handleSaveSettings} 
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                Save Settings
              </button>
              {settingsMessage && <p className="mt-2 text-sm text-gray-400">{settingsMessage}</p>}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6 card-3d holo-scan relative">
            <div className="grid-animation"></div>
            <h2 className="text-2xl font-bold text-teal-400 mb-4">{analyticsData?.dashboard_title || 'Analytics Dashboard'}</h2>
            
            {/* Model Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
                <h3 className="font-semibold text-teal-400">MAPE Score</h3>
                <p className="text-2xl font-bold text-teal-500">{analyticsData?.mape_score || 'N/A'}%</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
                <h3 className="font-semibold text-indigo-400">R2 Score</h3>
                <p className="text-2xl font-bold text-indigo-500">{analyticsData?.r2_score || 'N/A'}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
                <h3 className="font-semibold text-violet-400">Prediction Speed</h3>
                <p className="text-2xl font-bold text-violet-500">{analyticsData?.prediction_speed_seconds || 'N/A'}s</p>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Feature Importance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.feature_importance?.map(f => ({ name: f[0], importance: f[1] }))}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} stroke="#d1d5db" />
                  <YAxis stroke="#d1d5db" />
                  <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} contentStyle={{ background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(45, 212, 191, 0.25)' }} />
                  <Bar dataKey="importance" fill="#818cf8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Horizon Accuracy */}
            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Forecast Horizon Accuracy</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Range</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.forecast_horizon_accuracy?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.range}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional analytics sections */}
            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Lag Features Insights</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Date</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Current Sales</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Lag 1</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Lag 7</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Lag 30</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.lag_features?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.date}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.current_sales}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.lag_1}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.lag_7}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.lag_30}</td>
                        <td className="py-3 px-6 border-b text-left text-sm text-gray-300">{item.insight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Holiday Impact Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Event</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Date</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Normal Sales</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Event Sales</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Impact (%)</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.holiday_flags?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.Event}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.Date}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.Normal_Sales}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.Event_Sales}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.Impact_Percent}</td>
                        <td className="py-3 px-6 border-b text-left text-sm text-gray-300">{item.Insight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Trend Indicators</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Date</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Sales</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">MA-7</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">MA-30</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">EMA-7</th>
                      <th className="py-3 px-6 border-b text-left font-semibold text-teal-400">Trend Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.trend_indicators?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.date}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.sales}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.ma_7}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.ma_30}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.ema_7}</td>
                        <td className="py-3 px-6 border-b text-left text-gray-300">{item.trend_signal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Seasonality</h3>
              <p className="text-gray-300">Weekly Pattern: <span className="font-bold text-teal-500">{analyticsData?.seasonality?.weekly_pattern || 'N/A'}</span></p>
              <p className="text-gray-300">Monthly Pattern: <span className="font-bold text-teal-500">{analyticsData?.seasonality?.monthly_pattern || 'N/A'}</span></p>
              <p className="text-gray-300">Yearly Pattern: <span className="font-bold text-teal-500">{analyticsData?.seasonality?.yearly_pattern || 'N/A'}</span></p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg card-3d holo-scan">
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Correlations with Sales</h3>
              {analyticsData?.correlations && Object.keys(analyticsData.correlations).length > 0 ? (
                <ul className="text-gray-300">
                  {Object.entries(analyticsData.correlations).map(([key, value]) => (
                    <li key={key}><span className="font-bold text-teal-500">{key}:</span> {value}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No correlation data available.</p>
              )}
            </div>
          </div>
        );
      case 'ai_solutions':
        return (
          <div className="space-y-8 relative">
            <div className="grid-animation"></div>
            {/* Demand Forecasting Purpose */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
              <h2 className="text-2xl font-bold text-teal-400 mb-4">Demand Forecasting</h2>
              <p className="text-gray-300 mb-2"><span className="font-semibold text-teal-400">Problem:</span> {aiSolutionsData?.purpose_demand_forecasting?.problem || 'N/A'}</p>
              <p className="text-gray-300"><span className="font-semibold text-teal-400">Solution:</span> {aiSolutionsData?.purpose_demand_forecasting?.solution || 'N/A'}</p>
            </div>

            {/* Inventory Optimization Purpose */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
              <h2 className="text-2xl font-bold text-teal-400 mb-4">Inventory Optimization</h2>
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Overstocking</h3>
              <p className="text-gray-300 mb-2"><span className="font-semibold text-teal-400">Problem:</span> {aiSolutionsData?.purpose_inventory_optimization?.overstocking_problem || 'N/A'}</p>
              <p className="text-gray-300 mb-4"><span className="font-semibold text-teal-400">Solution:</span> {aiSolutionsData?.purpose_inventory_optimization?.overstocking_solution || 'N/A'}</p>
              
              <h3 className="text-xl font-semibold text-teal-400 mb-2">Stockouts</h3>
              <p className="text-gray-300 mb-2"><span className="font-semibold text-teal-400">Problem:</span> {aiSolutionsData?.purpose_inventory_optimization?.stockouts_problem || 'N/A'}</p>
              <p className="text-gray-300 mb-4"><span className="font-semibold text-teal-400">Solution:</span> {aiSolutionsData?.purpose_inventory_optimization?.stockouts_solution || 'N/A'}</p>

              <h3 className="text-xl font-semibold text-teal-400 mb-2">Manual Rules</h3>
              <p className="text-gray-300 mb-2"><span className="font-semibold text-teal-400">Problem:</span> {aiSolutionsData?.purpose_inventory_optimization?.manual_rules_problem || 'N/A'}</p>
              <p className="text-gray-300"><span className="font-semibold text-teal-400">Solution:</span> {aiSolutionsData?.purpose_inventory_optimization?.manual_rules_solution || 'N/A'}</p>
            </div>

            {/* Real AI Prediction Example */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
              <h2 className="text-2xl font-bold text-teal-400 mb-4">Real AI Prediction Example</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">Input Features:</h3>
                  {aiSolutionsData?.real_ai_prediction_example?.input_features && Object.keys(aiSolutionsData.real_ai_prediction_example.input_features).length > 0 ? (
                    <ul className="list-disc list-inside text-gray-300">
                      {Object.entries(aiSolutionsData.real_ai_prediction_example.input_features).map(([key, value]) => (
                        <li key={key}><span className="font-semibold text-teal-400">{key}:</span> {value}</li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400">No input features data available.</p>}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">Prediction Output:</h3>
                  <p className="text-gray-300"><span className="font-semibold text-teal-400">Predicted Demand:</span> {aiSolutionsData?.real_ai_prediction_example?.prediction_output?.predicted_demand || 'N/A'}</p>
                  <p className="text-gray-300"><span className="font-semibold text-teal-400">Confidence Interval:</span> {aiSolutionsData?.real_ai_prediction_example?.prediction_output?.confidence_interval || 'N/A'}</p>
                  <p className="text-gray-300"><span className="font-semibold text-teal-400">Accuracy Score:</span> {aiSolutionsData?.real_ai_prediction_example?.prediction_output?.accuracy_score || 'N/A'}</p>
                  <h4 className="font-semibold text-teal-400 mt-4">Feature Importance:</h4>
                  {aiSolutionsData?.real_ai_prediction_example?.prediction_output?.feature_importance && aiSolutionsData.real_ai_prediction_example.prediction_output.feature_importance.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-300">
                      {aiSolutionsData.real_ai_prediction_example.prediction_output.feature_importance.map((f, index) => (
                        <li key={index}><span className="font-semibold text-teal-400">{f[0]}:</span> {`${(f[1] * 100).toFixed(1)}%`}</li>
                      ))}
                    </ul>
                  ) : <p className="text-gray-400">No feature importance data available.</p>}
                  <h4 className="font-semibold text-teal-400 mt-4">AI Reasoning:</h4>
                  <p className="text-gray-300">{aiSolutionsData?.real_ai_prediction_example?.prediction_output?.ai_reasoning || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Real Inventory Optimization Example */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md card-3d holo-scan">
              <h2 className="text-2xl font-bold text-teal-400 mb-4">Real Inventory Optimization Example</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">Current Situation:</h3>
                  <p className="text-gray-300">Current Stock: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.current_situation?.current_stock || 'N/A'}</span></p>
                  <p className="text-gray-300">Lead Time: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.current_situation?.lead_time || 'N/A'} days</span></p>
                  <p className="text-gray-300">Demand Variability: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.current_situation?.demand_variability || 'N/A'}</span></p>
                  <p className="text-gray-300">Order Cost: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.current_situation?.order_cost || 'N/A'}</span></p>
                  <p className="text-gray-300">Holding Cost: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.current_situation?.holding_cost || 'N/A'}</span></p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">Optimization Results:</h3>
                  <p className="text-gray-300">Reorder Point: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.optimization_results?.reorder_point || 'N/A'}</span></p>
                  <p className="text-gray-300">Safety Stock: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.optimization_results?.safety_stock || 'N/A'}</span></p>
                  <p className="text-gray-300">Optimal Order Quantity: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.optimization_results?.optimal_order_quantity || 'N/A'}</span></p>
                  <p className="text-gray-300">Cost Savings: <span className="font-bold text-teal-500">{aiSolutionsData?.real_inventory_optimization_example?.optimization_results?.cost_savings || 'N/A'}</span></p>
                  <h4 className="font-semibold text-teal-400 mt-4">AI Reasoning:</h4>
                  <p className="text-gray-300">{aiSolutionsData?.real_inventory_optimization_example?.optimization_results?.ai_reasoning || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-gray-300">Section not found.</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
        <header className="bg-gray-900 shadow-md p-4 sticky top-0 z-10 flex justify-between items-center">
          {/* Home Arrow Button */}
          <Link to="/home" className="group relative inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">Home</span>
            <span className="inline-block w-0 h-0 border-l-[10px] border-t-[6px] border-b-[6px] border-l-transparent border-t-transparent border-b-transparent group-hover:w-[10px] group-hover:h-[10px] border-l-teal-400 transition-all duration-300"></span>
          </Link>

          <nav className="mt-4">
            <ul className="flex justify-center space-x-2 sm:space-x-4 flex-wrap">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`nav-button ${activeTab === 'overview' ? 'nav-button-active' : ''}`}
                >
                  <FaChartBar className="mr-2 text-lg" />
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('data_integration')}
                  className={`nav-button ${activeTab === 'data_integration' ? 'nav-button-active' : ''}`}
                >
                  <FaDatabase className="mr-2 text-lg" />
                  Data Integration
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`nav-button ${activeTab === 'analytics' ? 'nav-button-active' : ''}`}
                >
                  <FaChartPie className="mr-2 text-lg" />
                  Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ai_solutions')}
                  className={`nav-button ${activeTab === 'ai_solutions' ? 'nav-button-active' : ''}`}
                >
                  <FaBrain className="mr-2 text-lg" />
                  AI Solutions
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto p-6">
          {renderSection(activeTab)}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;