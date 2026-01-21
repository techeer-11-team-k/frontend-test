import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/views/Dashboard';
import { MapExplorer } from './components/views/MapExplorer';
import { Comparison } from './components/views/Comparison';
import { Statistics } from './components/views/Statistics';
import { HousingDemand } from './components/views/HousingDemand';
import { HousingSupply } from './components/views/HousingSupply';
import { PropertyDetail } from './components/views/PropertyDetail';
import { PortfolioList } from './components/views/PortfolioList';
import { Ranking } from './components/views/Ranking';
import { ViewType } from './types';

type StatsCategory = 'demand' | 'supply' | 'ranking';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [statsCategory, setStatsCategory] = useState<StatsCategory>('demand');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDockVisible, setIsDockVisible] = useState(true);

  // When view changes, reset dock visibility to true
  useEffect(() => {
    setIsDockVisible(true);
  }, [currentView]);

  const handlePropertyClick = (id: string) => {
    setSelectedPropertyId(id);
    window.scrollTo(0, 0);
  };

  const handleBackToDashboard = () => {
    setSelectedPropertyId(null);
  };

  const handleViewAllPortfolio = () => {
      setCurrentView('portfolio');
      window.scrollTo(0, 0);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setSelectedPropertyId(null);
    window.scrollTo(0, 0);
  };

  const handleStatsCategoryChange = (category: StatsCategory) => {
    setStatsCategory(category);
    setCurrentView('stats');
    setSelectedPropertyId(null);
    window.scrollTo(0, 0);
  };

  // Callback for MapExplorer to toggle dock.
  // Can accept a boolean to force state, or toggle if no arg provided.
  const handleMapDockToggle = (forceState?: boolean) => {
    if (typeof forceState === 'boolean') {
        setIsDockVisible(forceState);
    } else {
        setIsDockVisible(prev => !prev);
    }
  };

  const renderView = () => {
    if (selectedPropertyId) {
      return <PropertyDetail propertyId={selectedPropertyId} onBack={handleBackToDashboard} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onPropertyClick={handlePropertyClick} onViewAllPortfolio={handleViewAllPortfolio} />;
      case 'portfolio':
        return <PortfolioList onPropertyClick={handlePropertyClick} onBack={() => handleViewChange('dashboard')} />;
      case 'map':
        return <MapExplorer onPropertyClick={handlePropertyClick} onToggleDock={handleMapDockToggle} />;
      case 'compare':
        return <Comparison />;
      case 'stats':
        if (statsCategory === 'demand') {
          return <HousingDemand />;
        } else if (statsCategory === 'supply') {
          return <HousingSupply />;
        } else {
          return <Statistics />; // 주택 랭킹은 나중에 구현
        }
      default:
        return <Dashboard onPropertyClick={handlePropertyClick} onViewAllPortfolio={handleViewAllPortfolio} />;
    }
  };

  return (
    <Layout 
        currentView={currentView} 
        onChangeView={handleViewChange}
        onStatsCategoryChange={handleStatsCategoryChange}
        isDetailOpen={!!selectedPropertyId || currentView === 'portfolio'}
        isDockVisible={isDockVisible}
    >
      {renderView()}
    </Layout>
  );
}

export default App;