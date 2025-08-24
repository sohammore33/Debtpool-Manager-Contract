import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, DollarSign, PieChart, BarChart3, Settings, Wallet, RefreshCw, Eye, EyeOff } from 'lucide-react';

const DebtPoolManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [position, setPosition] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    totalCollateral: 0,
    totalDebt: 0,
    liquidationPool: 0,
    systemHealth: 0
  });
  const [formData, setFormData] = useState({
    collateralAmount: '',
    debtAmount: '',
    collateralType: 'STX'
  });
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    if (walletConnected) {
      setPosition({
        collateralAmount: 1500,
        debtAmount: 800,
        collateralType: 'STX',
        collateralRatio: 187.5,
        isActive: true,
        lastUpdate: Date.now() - 86400000
      });
      setGlobalStats({
        totalCollateral: 2500000,
        totalDebt: 1800000,
        liquidationPool: 45000,
        systemHealth: 138.9
      });
    }
  }, [walletConnected]);

  const connectWallet = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      setUserAddress('SP1234...ABC567');
      addNotification('Wallet connected successfully!', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleCreatePosition = async () => {
    if (!formData.collateralAmount || !formData.debtAmount) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const collateralRatio = (parseFloat(formData.collateralAmount) / parseFloat(formData.debtAmount)) * 100;
    if (collateralRatio < 150) {
      addNotification('Collateral ratio must be at least 150%', 'error');
      return;
    }

    setIsLoading(true);
    // Simulate contract interaction
    setTimeout(() => {
      setPosition({
        collateralAmount: parseFloat(formData.collateralAmount),
        debtAmount: parseFloat(formData.debtAmount),
        collateralType: formData.collateralType,
        collateralRatio: collateralRatio,
        isActive: true,
        lastUpdate: Date.now()
      });
      addNotification('Debt position created successfully!', 'success');
      setIsLoading(false);
      setFormData({ collateralAmount: '', debtAmount: '', collateralType: 'STX' });
    }, 2000);
  };

  const getRiskLevel = (ratio) => {
    if (ratio >= 200) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-100' };
    if (ratio >= 150) return { level: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-900/80 border-green-500/50 text-green-100'
                : notification.type === 'error'
                ? 'bg-red-900/80 border-red-500/50 text-red-100'
                : 'bg-blue-900/80 border-blue-500/50 text-blue-100'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">DebtPool Manager</h1>
                    <p className="text-slate-400 text-sm">Multi-collateral debt platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {walletConnected ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-white font-medium">Connected</p>
                      <p className="text-slate-400 text-sm">{userAddress}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                    {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!walletConnected ? (
            <div className="text-center py-20">
              <Shield className="w-20 h-20 text-purple-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to DebtPool Manager</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
                A sophisticated multi-collateral debt position platform with automated liquidation protection 
                and cross-margin capabilities. Connect your wallet to get started.
              </p>
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-lg text-white font-medium text-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Connecting Wallet...' : 'Connect Wallet to Continue'}
              </button>
            </div>
          ) : (
            <>
              {/* Navigation Tabs */}
              <div className="flex space-x-1 mb-8">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'position', label: 'Manage Position', icon: DollarSign },
                  { id: 'analytics', label: 'Analytics', icon: PieChart },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Global Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Total Collateral</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(globalStats.totalCollateral)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Total Debt</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(globalStats.totalDebt)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Liquidation Pool</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(globalStats.liquidationPool)}</p>
                        </div>
                        <Shield className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">System Health</p>
                          <p className="text-2xl font-bold text-white">{globalStats.systemHealth.toFixed(1)}%</p>
                        </div>
                        <PieChart className="w-8 h-8 text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* User Position Card */}
                  {position && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Your Position</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowBalance(!showBalance)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                          >
                            {showBalance ? <Eye className="w-5 h-5 text-slate-400" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                          </button>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevel(position.collateralRatio).bg} ${getRiskLevel(position.collateralRatio).color}`}>
                            {getRiskLevel(position.collateralRatio).level} Risk
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-slate-400 text-sm">Collateral Amount</p>
                          <p className="text-2xl font-bold text-white">
                            {showBalance ? `${formatNumber(position.collateralAmount)} ${position.collateralType}` : '****'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-slate-400 text-sm">Debt Amount</p>
                          <p className="text-2xl font-bold text-white">
                            {showBalance ? formatCurrency(position.debtAmount) : '****'}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-slate-400 text-sm">Collateral Ratio</p>
                          <p className={`text-2xl font-bold ${getRiskLevel(position.collateralRatio).color}`}>
                            {showBalance ? `${position.collateralRatio.toFixed(1)}%` : '****'}
                          </p>
                        </div>
                      </div>

                      {position.collateralRatio < 150 && (
                        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
                          <AlertTriangle className="w-6 h-6 text-red-400" />
                          <div>
                            <p className="text-red-400 font-medium">Liquidation Risk</p>
                            <p className="text-red-300 text-sm">Your position is at risk of liquidation. Consider adding more collateral.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Position Management Tab */}
              {activeTab === 'position' && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Create/Update Debt Position</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                          Collateral Amount
                        </label>
                        <input
                          type="number"
                          value={formData.collateralAmount}
                          onChange={(e) => setFormData({...formData, collateralAmount: e.target.value})}
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Enter collateral amount"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                          Debt Amount
                        </label>
                        <input
                          type="number"
                          value={formData.debtAmount}
                          onChange={(e) => setFormData({...formData, debtAmount: e.target.value})}
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="Enter debt amount"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">
                          Collateral Type
                        </label>
                        <select
                          value={formData.collateralType}
                          onChange={(e) => setFormData({...formData, collateralType: e.target.value})}
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="STX">STX (Stacks)</option>
                          <option value="BTC" disabled>BTC (Coming Soon)</option>
                          <option value="ETH" disabled>ETH (Coming Soon)</option>
                        </select>
                      </div>

                      {formData.collateralAmount && formData.debtAmount && (
                        <div className="p-4 bg-slate-700/30 rounded-lg">
                          <p className="text-slate-300 text-sm">Estimated Collateral Ratio:</p>
                          <p className={`text-xl font-bold ${
                            (parseFloat(formData.collateralAmount) / parseFloat(formData.debtAmount)) * 100 >= 150 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {((parseFloat(formData.collateralAmount) / parseFloat(formData.debtAmount)) * 100 || 0).toFixed(1)}%
                          </p>
                          <p className="text-slate-400 text-xs mt-1">Minimum required: 150%</p>
                        </div>
                      )}
                      
                      <button
                        onClick={handleCreatePosition}
                        disabled={isLoading || !formData.collateralAmount || !formData.debtAmount}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-4 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isLoading && <RefreshCw className="w-5 h-5 animate-spin" />}
                        <span>{isLoading ? 'Processing...' : 'Create/Update Position'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">System Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Positions:</span>
                        <span className="text-white font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Liquidations:</span>
                        <span className="text-white font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Collateral Ratio:</span>
                        <span className="text-white font-medium">178.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Platform Utilization:</span>
                        <span className="text-white font-medium">72.1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Risk Distribution</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-green-400">Low Risk (>200%)</span>
                          <span className="text-white">45%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-[45%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-yellow-400">Medium Risk (150-200%)</span>
                          <span className="text-white">38%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full w-[38%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-red-400">High Risk (<150%)</span>
                          <span className="text-white">17%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full w-[17%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Platform Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">Liquidation Notifications</p>
                          <p className="text-slate-400 text-sm">Get notified when your position is at risk</p>
                        </div>
                        <button className="bg-purple-600 relative inline-flex h-6 w-11 items-center rounded-full">
                          <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">Auto-Rebalancing</p>
                          <p className="text-slate-400 text-sm">Automatically maintain optimal collateral ratio</p>
                        </div>
                        <button className="bg-slate-600 relative inline-flex h-6 w-11 items-center rounded-full">
                          <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                        </button>
                      </div>
                      
                      <div className="border-t border-slate-700/50 pt-6">
                        <h4 className="text-lg font-bold text-white mb-4">Contract Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Contract Address:</span>
                            <span className="text-white font-mono text-sm">SP1K1A...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Network:</span>
                            <span className="text-white">Stacks Testnet</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Version:</span>
                            <span className="text-white">v1.0.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtPoolManager;
