// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { useToast } from "@/hooks/use-toast";
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   AlertTriangle, 
//   Package, 
//   BarChart3, 
//   Globe, 
//   Brain,
//   Truck,
//   Users,
//   Target,
//   DollarSign,
//   Activity,
//   Zap,
//   MapPin,
//   Settings,
//   RefreshCw
// } from 'lucide-react';
// import { 
//   LineChart, 
//   Line, 
//   AreaChart, 
//   Area, 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis
// } from 'recharts';

// // Mock data generators
// const generateDemandData = (days = 30) => {
//   return Array.from({ length: days }, (_, i) => ({
//     date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
//     actual: Math.floor(Math.random() * 100) + 50,
//     predicted: Math.floor(Math.random() * 100) + 45,
//     confidence: Math.random() * 30 + 70
//   }));
// };

// const generateProductData = () => [
//   { id: 'P001', name: 'Laptop Pro 15"', demand: 245, predicted: 267, confidence: 89, category: 'Electronics', leadTime: 14 },
//   { id: 'P002', name: 'Wireless Mouse', demand: 189, predicted: 203, confidence: 92, category: 'Accessories', leadTime: 7 },
//   { id: 'P003', name: 'Monitor 27"', demand: 156, predicted: 142, confidence: 85, category: 'Electronics', leadTime: 21 },
//   { id: 'P004', name: 'Keyboard Mechanical', demand: 234, predicted: 251, confidence: 88, category: 'Accessories', leadTime: 10 },
//   { id: 'P005', name: 'Tablet 10"', demand: 167, predicted: 174, confidence: 91, category: 'Electronics', leadTime: 18 }
// ];

// const generateMarketData = () => [
//   { index: 'S&P 500', value: 4567.89, change: 2.34, impact: 'positive' },
//   { index: 'NASDAQ', value: 14234.56, change: -1.23, impact: 'negative' },
//   { index: 'DOW JONES', value: 35678.90, change: 0.89, impact: 'neutral' },
//   { index: 'FTSE 100', value: 7456.78, change: 1.56, impact: 'positive' }
// ];

// const generateSupplierData = () => [
//   { id: 'S001', name: 'TechFlow Industries', reliability: 94, avgLeadTime: 12, variance: 2.3, status: 'excellent' },
//   { id: 'S002', name: 'Global Components Ltd', reliability: 87, avgLeadTime: 18, variance: 4.1, status: 'good' },
//   { id: 'S003', name: 'Swift Electronics', reliability: 91, avgLeadTime: 15, variance: 3.2, status: 'excellent' },
//   { id: 'S004', name: 'Prime Materials Co', reliability: 78, avgLeadTime: 22, variance: 6.8, status: 'warning' }
// ];

// const generateCustomerSegments = () => [
//   { type: 'Retail', demand: 45, growth: 12.5, color: '#22c55e' },
//   { type: 'Wholesale', demand: 30, growth: 8.3, color: '#3b82f6' },
//   { type: 'Online', demand: 25, growth: 23.7, color: '#f59e0b' }
// ];

// const Dashboard = () => {
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [demandData, setDemandData] = useState(generateDemandData());
//   const [productData, setProductData] = useState(generateProductData());
//   const [marketData, setMarketData] = useState(generateMarketData());
//   const [supplierData, setSupplierData] = useState(generateSupplierData());
//   const [customerSegments, setCustomerSegments] = useState(generateCustomerSegments());
//   const [selectedProduct, setSelectedProduct] = useState(productData[0]);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [promotionData, setPromotionData] = useState({
//     startDate: '',
//     endDate: '',
//     discountPercent: '',
//     expectedImpact: 0
//   });

//   // AI Forecasting Engine
//   const runAIForecast = async () => {
//     setIsAnalyzing(true);
//     toast({
//       title: "AI Analysis Started",
//       description: "Running multi-model forecasting analysis...",
//     });

//     // Simulate AI processing
//     setTimeout(() => {
//       setDemandData(generateDemandData());
//       setIsAnalyzing(false);
//       toast({
//         title: "Analysis Complete",
//         description: "Forecasting models updated with latest data",
//       });
//     }, 3000);
//   };

//   // Real-time market data simulation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMarketData(generateMarketData());
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   // Anomaly detection
//   const detectAnomalies = () => {
//     const anomalies = productData.filter(p => Math.abs(p.demand - p.predicted) > 30);
//     if (anomalies.length > 0) {
//       toast({
//         title: "Anomalies Detected",
//         description: `${anomalies.length} products showing unusual demand patterns`,
//         variant: "destructive",
//       });
//     }
//   };

//   const calculatePromotionImpact = () => {
//     if (promotionData.discountPercent) {
//       const impact = Math.floor(parseFloat(promotionData.discountPercent) * 2.5);
//       setPromotionData(prev => ({ ...prev, expectedImpact: impact }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
//               AI Inventory Forecaster
//             </h1>
//             <p className="text-muted-foreground">
//               Advanced multi-product demand forecasting and supply chain optimization
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button 
//               onClick={runAIForecast} 
//               disabled={isAnalyzing}
//               className="bg-primary hover:bg-primary/90"
//             >
//               {isAnalyzing ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Brain className="h-4 w-4 mr-2" />
//                   Run AI Forecast
//                 </>
//               )}
//             </Button>
//             <Button onClick={detectAnomalies} variant="outline">
//               <AlertTriangle className="h-4 w-4 mr-2" />
//               Detect Anomalies
//             </Button>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Products</CardTitle>
//               <Package className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{productData.length}</div>
//               <p className="text-xs text-muted-foreground">
//                 <span className="text-success">+12%</span> from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Avg Forecast Accuracy</CardTitle>
//               <Target className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {Math.round(productData.reduce((acc, p) => acc + p.confidence, 0) / productData.length)}%
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 <span className="text-success">+3.2%</span> accuracy improvement
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
//               <Truck className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{supplierData.length}</div>
//               <p className="text-xs text-muted-foreground">
//                 Avg reliability: {Math.round(supplierData.reduce((acc, s) => acc + s.reliability, 0) / supplierData.length)}%
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">$47.2K</div>
//               <p className="text-xs text-muted-foreground">
//                 <span className="text-success">+8.7%</span> this quarter
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Dashboard Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="products">Multi-Product</TabsTrigger>
//             <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
//             <TabsTrigger value="segments">Customer Segments</TabsTrigger>
//             <TabsTrigger value="promotions">Promotions</TabsTrigger>
//             <TabsTrigger value="network">Supply Network</TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Demand Forecast Chart */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <TrendingUp className="h-5 w-5 mr-2 text-primary" />
//                     AI Demand Forecast
//                   </CardTitle>
//                   <CardDescription>
//                     30-day demand prediction with confidence intervals
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={demandData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis />
//                       <Tooltip />
//                       <Line 
//                         type="monotone" 
//                         dataKey="actual" 
//                         stroke="hsl(var(--primary))" 
//                         strokeWidth={2}
//                         name="Actual Demand"
//                       />
//                       <Line 
//                         type="monotone" 
//                         dataKey="predicted" 
//                         stroke="hsl(var(--info))" 
//                         strokeWidth={2}
//                         strokeDasharray="5 5"
//                         name="AI Prediction"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>

//               {/* Real-time Market Data */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center">
//                     <Globe className="h-5 w-5 mr-2 text-primary" />
//                     Real-time Market Indices
//                   </CardTitle>
//                   <CardDescription>
//                     Global market data affecting demand patterns
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {marketData.map((market, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                         <div>
//                           <p className="font-medium">{market.index}</p>
//                           <p className="text-sm text-muted-foreground">{market.value.toLocaleString()}</p>
//                         </div>
//                         <div className="flex items-center">
//                           {market.impact === 'positive' ? (
//                             <TrendingUp className="h-4 w-4 text-success mr-1" />
//                           ) : market.impact === 'negative' ? (
//                             <TrendingDown className="h-4 w-4 text-destructive mr-1" />
//                           ) : (
//                             <Activity className="h-4 w-4 text-muted-foreground mr-1" />
//                           )}
//                           <span className={`text-sm font-medium ${
//                             market.change > 0 ? 'text-success' : 
//                             market.change < 0 ? 'text-destructive' : 'text-muted-foreground'
//                           }`}>
//                             {market.change > 0 ? '+' : ''}{market.change}%
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Customer Segments Overview */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Users className="h-5 w-5 mr-2 text-primary" />
//                   Customer Segment Analysis
//                 </CardTitle>
//                 <CardDescription>
//                   Demand distribution across customer types
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <ResponsiveContainer width="100%" height={200}>
//                     <PieChart>
//                       <Pie
//                         data={customerSegments}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="demand"
//                         label={({ type, demand }) => `${type}: ${demand}%`}
//                       >
//                         {customerSegments.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div className="space-y-4">
//                     {customerSegments.map((segment, index) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-3 h-3 rounded-full mr-3" 
//                             style={{ backgroundColor: segment.color }}
//                           />
//                           <span className="font-medium">{segment.type}</span>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">{segment.demand}%</p>
//                           <p className="text-xs text-success">+{segment.growth}% growth</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Multi-Product Tab */}
//           <TabsContent value="products" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Package className="h-5 w-5 mr-2 text-primary" />
//                   Multi-Product Forecasting
//                 </CardTitle>
//                 <CardDescription>
//                   Individual forecasting models for each SKU
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="text-left p-2">Product ID</th>
//                         <th className="text-left p-2">Name</th>
//                         <th className="text-left p-2">Category</th>
//                         <th className="text-left p-2">Current Demand</th>
//                         <th className="text-left p-2">AI Prediction</th>
//                         <th className="text-left p-2">Confidence</th>
//                         <th className="text-left p-2">Lead Time</th>
//                         <th className="text-left p-2">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {productData.map((product) => (
//                         <tr key={product.id} className="border-b hover:bg-muted/50">
//                           <td className="p-2 font-mono text-sm">{product.id}</td>
//                           <td className="p-2 font-medium">{product.name}</td>
//                           <td className="p-2">
//                             <Badge variant="outline">{product.category}</Badge>
//                           </td>
//                           <td className="p-2">{product.demand}</td>
//                           <td className="p-2 font-medium">{product.predicted}</td>
//                           <td className="p-2">
//                             <div className="flex items-center space-x-2">
//                               <Progress value={product.confidence} className="w-16" />
//                               <span className="text-sm">{product.confidence}%</span>
//                             </div>
//                           </td>
//                           <td className="p-2">{product.leadTime} days</td>
//                           <td className="p-2">
//                             <Badge 
//                               variant={
//                                 Math.abs(product.demand - product.predicted) < 10 ? 'default' :
//                                 Math.abs(product.demand - product.predicted) < 20 ? 'secondary' : 'destructive'
//                               }
//                             >
//                               {Math.abs(product.demand - product.predicted) < 10 ? 'On Track' :
//                                Math.abs(product.demand - product.predicted) < 20 ? 'Monitor' : 'Alert'}
//                             </Badge>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Suppliers Tab */}
//           <TabsContent value="suppliers" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Truck className="h-5 w-5 mr-2 text-primary" />
//                   Supplier Lead Time Analysis
//                 </CardTitle>
//                 <CardDescription>
//                   Variability analysis for optimized reorder points
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     {supplierData.map((supplier) => (
//                       <div key={supplier.id} className="p-4 border rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <h3 className="font-medium">{supplier.name}</h3>
//                           <Badge 
//                             variant={
//                               supplier.status === 'excellent' ? 'default' :
//                               supplier.status === 'good' ? 'secondary' : 'destructive'
//                             }
//                           >
//                             {supplier.status}
//                           </Badge>
//                         </div>
//                         <div className="grid grid-cols-3 gap-4 text-sm">
//                           <div>
//                             <p className="text-muted-foreground">Reliability</p>
//                             <p className="font-medium">{supplier.reliability}%</p>
//                           </div>
//                           <div>
//                             <p className="text-muted-foreground">Avg Lead Time</p>
//                             <p className="font-medium">{supplier.avgLeadTime} days</p>
//                           </div>
//                           <div>
//                             <p className="text-muted-foreground">Variance</p>
//                             <p className="font-medium">±{supplier.variance} days</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={supplierData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="reliability" fill="hsl(var(--primary))" name="Reliability %" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Customer Segments Tab */}
//           <TabsContent value="segments" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Users className="h-5 w-5 mr-2 text-primary" />
//                   Customer Segment Forecasting
//                 </CardTitle>
//                 <CardDescription>
//                   Targeted demand patterns by customer type
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     {customerSegments.map((segment, index) => (
//                       <Card key={index}>
//                         <CardHeader className="pb-2">
//                           <CardTitle className="text-lg flex items-center">
//                             <div 
//                               className="w-4 h-4 rounded-full mr-3" 
//                               style={{ backgroundColor: segment.color }}
//                             />
//                             {segment.type} Customers
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-sm text-muted-foreground">Demand Share</p>
//                               <p className="text-2xl font-bold">{segment.demand}%</p>
//                             </div>
//                             <div>
//                               <p className="text-sm text-muted-foreground">Growth Rate</p>
//                               <p className="text-2xl font-bold text-success">+{segment.growth}%</p>
//                             </div>
//                           </div>
//                           <div className="mt-4">
//                             <p className="text-sm text-muted-foreground mb-2">Forecast Trend</p>
//                             <Progress value={segment.growth * 3} className="w-full" />
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                   <ResponsiveContainer width="100%" height={400}>
//                     <RadarChart data={customerSegments.map(s => ({ 
//                       ...s, 
//                       satisfaction: Math.floor(Math.random() * 30) + 70,
//                       retention: Math.floor(Math.random() * 20) + 80 
//                     }))}>
//                       <PolarGrid />
//                       <PolarAngleAxis dataKey="type" />
//                       <PolarRadiusAxis />
//                       <Radar
//                         name="Demand"
//                         dataKey="demand"
//                         stroke="hsl(var(--primary))"
//                         fill="hsl(var(--primary))"
//                         fillOpacity={0.3}
//                       />
//                       <Radar
//                         name="Growth"
//                         dataKey="growth"
//                         stroke="hsl(var(--success))"
//                         fill="hsl(var(--success))"
//                         fillOpacity={0.3}
//                       />
//                       <Tooltip />
//                     </RadarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Promotions Tab */}
//           <TabsContent value="promotions" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Zap className="h-5 w-5 mr-2 text-primary" />
//                   Promotional Impact Analysis
//                 </CardTitle>
//                 <CardDescription>
//                   Model and predict the impact of promotions on demand
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="product-select">Select Product</Label>
//                       <Select value={selectedProduct.id} onValueChange={(value) => 
//                         setSelectedProduct(productData.find(p => p.id === value) || productData[0])
//                       }>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {productData.map((product) => (
//                             <SelectItem key={product.id} value={product.id}>
//                               {product.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="start-date">Start Date</Label>
//                         <Input 
//                           id="start-date"
//                           type="date" 
//                           value={promotionData.startDate}
//                           onChange={(e) => setPromotionData(prev => ({ ...prev, startDate: e.target.value }))}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="end-date">End Date</Label>
//                         <Input 
//                           id="end-date"
//                           type="date" 
//                           value={promotionData.endDate}
//                           onChange={(e) => setPromotionData(prev => ({ ...prev, endDate: e.target.value }))}
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="discount">Discount Percentage</Label>
//                       <Input 
//                         id="discount"
//                         type="number" 
//                         placeholder="e.g., 20"
//                         value={promotionData.discountPercent}
//                         onChange={(e) => setPromotionData(prev => ({ ...prev, discountPercent: e.target.value }))}
//                         onBlur={calculatePromotionImpact}
//                       />
//                     </div>

//                     <Button onClick={calculatePromotionImpact} className="w-full">
//                       Calculate Impact
//                     </Button>

//                     {promotionData.expectedImpact > 0 && (
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-lg">Predicted Impact</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-2">
//                             <div className="flex justify-between">
//                               <span>Expected Demand Increase:</span>
//                               <span className="font-bold text-success">+{promotionData.expectedImpact}%</span>
//                             </div>
//                             <div className="flex justify-between">
//                               <span>New Predicted Demand:</span>
//                               <span className="font-bold">
//                                 {Math.round(selectedProduct.predicted * (1 + promotionData.expectedImpact / 100))}
//                               </span>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )}
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Historical Promotion Performance</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <AreaChart data={[
//                         { month: 'Jan', baseline: 100, promo: 125 },
//                         { month: 'Feb', baseline: 105, promo: 135 },
//                         { month: 'Mar', baseline: 98, promo: 120 },
//                         { month: 'Apr', baseline: 110, promo: 145 },
//                         { month: 'May', baseline: 103, promo: 128 },
//                         { month: 'Jun', baseline: 108, promo: 140 }
//                       ]}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Area
//                           type="monotone"
//                           dataKey="baseline"
//                           stackId="1"
//                           stroke="hsl(var(--muted-foreground))"
//                           fill="hsl(var(--muted))"
//                           name="Baseline Demand"
//                         />
//                         <Area
//                           type="monotone"
//                           dataKey="promo"
//                           stackId="2"
//                           stroke="hsl(var(--primary))"
//                           fill="hsl(var(--primary))"
//                           fillOpacity={0.7}
//                           name="During Promotion"
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Supply Network Tab */}
//           <TabsContent value="network" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <MapPin className="h-5 w-5 mr-2 text-primary" />
//                   Supply Chain Network Optimization
//                 </CardTitle>
//                 <CardDescription>
//                   Multi-warehouse inventory allocation and transportation costs
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-medium">Warehouse Locations</h3>
//                     {[
//                       { name: 'East Coast Hub', location: 'New York', capacity: '85%', cost: '$2.3K' },
//                       { name: 'West Coast Hub', location: 'Los Angeles', capacity: '72%', cost: '$1.9K' },
//                       { name: 'Central Hub', location: 'Chicago', capacity: '91%', cost: '$2.1K' },
//                       { name: 'South Hub', location: 'Atlanta', capacity: '67%', cost: '$1.7K' }
//                     ].map((warehouse, index) => (
//                       <div key={index} className="p-4 border rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <h4 className="font-medium">{warehouse.name}</h4>
//                           <span className="text-sm text-muted-foreground">{warehouse.location}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm text-muted-foreground">Capacity</p>
//                             <Progress value={parseInt(warehouse.capacity)} className="w-24" />
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm text-muted-foreground">Weekly Cost</p>
//                             <p className="font-medium">{warehouse.cost}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium mb-4">Transportation Cost Analysis</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                       <BarChart data={[
//                         { route: 'NY-CHI', cost: 450, distance: 790 },
//                         { route: 'LA-ATL', cost: 680, distance: 1950 },
//                         { route: 'CHI-ATL', cost: 380, distance: 720 },
//                         { route: 'NY-LA', cost: 890, distance: 2800 }
//                       ]}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="route" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="cost" fill="hsl(var(--primary))" name="Cost ($)" />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 <div className="mt-6 p-4 bg-muted rounded-lg">
//                   <h3 className="text-lg font-medium mb-2">Optimization Recommendations</h3>
//                   <ul className="space-y-2 text-sm">
//                     <li className="flex items-center">
//                       <div className="w-2 h-2 bg-success rounded-full mr-3" />
//                       Redistribute 15% inventory from Central Hub to South Hub to reduce costs
//                     </li>
//                     <li className="flex items-center">
//                       <div className="w-2 h-2 bg-warning rounded-full mr-3" />
//                       Consider additional warehouse in Pacific Northwest for 12% cost reduction
//                     </li>
//                     <li className="flex items-center">
//                       <div className="w-2 h-2 bg-info rounded-full mr-3" />
//                       Optimize NY-LA route through Chicago for 18% savings
//                     </li>
//                   </ul>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         {/* AI Insights Panel */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Brain className="h-5 w-5 mr-2 text-primary" />
//               AI Insights & Recommendations
//             </CardTitle>
//             <CardDescription>
//               Machine learning-powered insights for supply chain optimization
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="p-4 bg-success/10 rounded-lg border border-success/20">
//                 <div className="flex items-center mb-2">
//                   <TrendingUp className="h-4 w-4 text-success mr-2" />
//                   <span className="font-medium text-success">Opportunity</span>
//                 </div>
//                 <p className="text-sm">Laptop Pro 15" showing 23% higher demand than predicted. Consider increasing order quantity.</p>
//               </div>
//               <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
//                 <div className="flex items-center mb-2">
//                   <AlertTriangle className="h-4 w-4 text-warning mr-2" />
//                   <span className="font-medium text-warning">Warning</span>
//                 </div>
//                 <p className="text-sm">Global Components Ltd showing increased lead time variance. Monitor closely or seek alternative suppliers.</p>
//               </div>
//               <div className="p-4 bg-info/10 rounded-lg border border-info/20">
//                 <div className="flex items-center mb-2">
//                   <Zap className="h-4 w-4 text-info mr-2" />
//                   <span className="font-medium text-info">Optimization</span>
//                 </div>
//                 <p className="text-sm">Implementing suggested inventory reallocation could save $12.3K monthly in transportation costs.</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { Line } from 'react-chartjs-2'; // Import Line chart component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Inline CSS for styling
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ccc',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#f1f1f1',
    marginRight: '5px',
    borderRadius: '5px 5px 0 0',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  cardDescription: {
    color: '#666',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    margin: '5px 0',
  },
  select: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    margin: '5px 0',
  },
  badge: {
    padding: '5px 10px',
    borderRadius: '10px',
    color: '#fff',
    backgroundColor: '#dc3545',
    marginLeft: '10px',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px',
    borderRadius: '5px',
    color: '#fff',
    zIndex: 1000,
  },
  notificationSuccess: {
    backgroundColor: '#28a745',
  },
  notificationError: {
    backgroundColor: '#dc3545',
  },
  chartContainer: {
    height: '300px',
    marginTop: '20px',
  },
};

const ExtendedDashboard = ({ userId, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [idToken, setIdToken] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiSolutionsData, setAiSolutionsData] = useState(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('csv');
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Validate file content (CSV, Excel, JSON)
  const validateFile = async (file) => {
    if (!file) return { valid: false, message: 'No file selected.' };

    const fileType = file.name.split('.').pop().toLowerCase();
    try {
      if (fileType === 'csv') {
        const text = await file.text();
        const headers = text.split('\n')[0].split(',').map(h => h.trim().toLowerCase());
        if (!headers.includes('date') || !headers.includes('sales')) {
          return { valid: false, message: 'CSV file must contain "date" and "sales" columns.' };
        }
        const rows = text.split('\n').slice(1).filter(row => row.trim());
        if (rows.length === 0) {
          return { valid: false, message: 'CSV file is empty or contains only headers.' };
        }
      } else if (fileType === 'xlsx') {
        if (file.size === 0) {
          return { valid: false, message: 'Excel file is empty.' };
        }
        return { valid: true, message: 'Excel file validation will be performed on the server.' };
      } else if (fileType === 'json') {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data) || data.length === 0 || !data[0].hasOwnProperty('date') || !data[0].hasOwnProperty('sales')) {
          return { valid: false, message: 'JSON file must be an array of objects with "date" and "sales" properties.' };
        }
      } else {
        return { valid: false, message: 'Unsupported file type. Please upload a CSV, Excel, or JSON file.' };
      }
      return { valid: true, message: '' };
    } catch (err) {
      return { valid: false, message: `Error reading file: ${err.message}` };
    }
  };

  // Fetch Firebase ID token
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (error) {
          console.error('Error fetching ID token:', error);
          showNotification('Authentication error. Please log in again.', 'error');
        }
      } else {
        showNotification('User not authenticated. Please log in.', 'error');
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch data when userId and idToken are available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: 'http://localhost:5000/get_dashboard_data', setter: setDashboardData },
          { url: 'http://localhost:5000/get_analytics_data', setter: setAnalyticsData },
          { url: 'http://localhost:5000/get_ai_solutions_data', setter: setAiSolutionsData },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${url}?userId=${userId}`, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          setter(data);
        }
      } catch (error) {
        showNotification(`Error fetching data: ${error.message}`, 'error');
      }
    };

    if (userId && idToken) {
      fetchData();
    }
  }, [userId, idToken]);

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file || !userId || !idToken) {
      showNotification('Please select a file and ensure you are logged in', 'error');
      return;
    }

    // Validate file before uploading
    const validation = await validateFile(file);
    if (!validation.valid) {
      showNotification(validation.message, 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const response = await fetch('http://localhost:5000/upload_historical_data', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
        body: formData,
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      showNotification('File uploaded successfully', 'success');
      setFile(null); // Reset file input
      // Refresh data after upload
      const [dashboardResponse, analyticsResponse, aiSolutionsResponse] = await Promise.all([
        fetch(`http://localhost:5000/get_dashboard_data?userId=${userId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        fetch(`http://localhost:5000/get_analytics_data?userId=${userId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        fetch(`http://localhost:5000/get_ai_solutions_data?userId=${userId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
      ]);
      setDashboardData(await dashboardResponse.json());
      setAnalyticsData(await analyticsResponse.json());
      setAiSolutionsData(await aiSolutionsResponse.json());
    } catch (error) {
      showNotification(`Error uploading file: ${error.message}`, 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  // Render demand chart data
  const getChartData = () => {
    if (!analyticsData?.trend_indicators) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
          },
        ],
      };
    }
    return {
      labels: analyticsData.trend_indicators.map(item => item.date),
      datasets: [
        {
          label: 'Sales',
          data: analyticsData.trend_indicators.map(item => item.sales),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
        },
        {
          label: '7-Day MA',
          data: analyticsData.trend_indicators.map(item => item.ma_7),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sales',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Current Demand</h2>
              <p style={styles.cardDescription}>
                Value: {dashboardData?.current_demand?.value || 'N/A'}{' '}
                <span style={dashboardData?.current_demand?.change_percent >= 0 ? { color: '#28a745' } : { color: '#dc3545' }}>
                  {dashboardData?.current_demand?.change_percent >= 0 ? '+' : ''}{dashboardData?.current_demand?.change_percent || '0'}% vs previous day
                </span>
              </p>
              {analyticsData?.trend_indicators && (
                <div style={styles.chartContainer}>
                  <Line data={getChartData()} options={chartOptions} />
                </div>
              )}
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Upload Historical Data</h2>
              <p style={styles.cardDescription}>
                Upload a CSV, Excel (.xlsx), or JSON file containing 'date' and 'sales' columns.{' '}
                <a href="data:text/csv;charset=utf-8,date,sales%0A2025-01-01,100%0A2025-01-02,120%0A2025-01-03,110" download="sample-data.csv" style={{ color: '#007bff', textDecoration: 'underline' }}>
                  Download sample CSV
                </a>
              </p>
              <select
                style={styles.select}
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel</option>
                <option value="json">JSON</option>
              </select>
              <input
                type="file"
                style={styles.input}
                accept=".csv,.xlsx,.json"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                style={{ ...styles.button, ...(file && userId && idToken ? {} : { opacity: 0.5, cursor: 'not-allowed' }) }}
                onClick={handleFileUpload}
                disabled={!file || !userId || !idToken}
              >
                Upload File
              </button>
            </div>
          </div>
        );
      case 'products':
        return (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Product Forecasting</h2>
            <p style={styles.cardDescription}>Multi-product demand forecasting data</p>
            {aiSolutionsData?.real_ai_prediction_example ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Predicted Demand</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>Sample Product</td>
                    <td style={{ padding: '8px' }}>{aiSolutionsData.real_ai_prediction_example.prediction_output?.predicted_demand || 'N/A'}</td>
                    <td style={{ padding: '8px' }}>{aiSolutionsData.real_ai_prediction_example.prediction_output?.confidence_interval || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No product data available.</p>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Analytics</h2>
            <p style={styles.cardDescription}>Model performance metrics</p>
            {analyticsData ? (
              <div>
                <p>MAPE Score: {analyticsData.mape_score || 'N/A'}%</p>
                <p>R2 Score: {analyticsData.r2_score || 'N/A'}</p>
                <p>Prediction Speed: {analyticsData.prediction_speed_seconds || 'N/A'}s</p>
              </div>
            ) : (
              <p>No analytics data available.</p>
            )}
          </div>
        );
      default:
        return <div>Select a tab.</div>;
    }
  };

  return (
    <div style={styles.container}>
      {notification.message && (
        <div
          style={{
            ...styles.notification,
            ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError),
          }}
        >
          {notification.message}
        </div>
      )}
      <div style={styles.tabs}>
        {['overview', 'products', 'analytics'].map((tab) => (
          <div
            key={tab}
            style={activeTab === tab ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
        <button style={styles.button} onClick={onLogout}>
          Logout
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default ExtendedDashboard;