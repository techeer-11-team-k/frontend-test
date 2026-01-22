import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/views/Dashboard';
import { MapExplorer } from './components/views/MapExplorer';
import { Comparison } from './components/views/Comparison';
import { HousingDemand } from './components/views/HousingDemand';
import { HousingSupply } from './components/views/HousingSupply';
import { PropertyDetail } from './components/views/PropertyDetail';
import { Ranking } from './components/views/Ranking';
import { ViewType } from './types';

type StatsCategory = 'demand' | 'supply' | 'ranking';

// 주택 수요 페이지
const HousingDemandPage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/apt/${id}`);
  };

  return (
    <Layout 
      currentView="stats" 
      onChangeView={() => {}}
      onStatsCategoryChange={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <HousingDemand />
    </Layout>
  );
};

// 주택 공급 페이지
const HousingSupplyPage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/apt/${id}`);
  };

  return (
    <Layout 
      currentView="stats" 
      onChangeView={() => {}}
      onStatsCategoryChange={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <HousingSupply />
    </Layout>
  );
};

// 주택 랭킹 페이지
const RankingPage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/apt/${id}`);
  };

  return (
    <Layout 
      currentView="stats" 
      onChangeView={() => {}}
      onStatsCategoryChange={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <Ranking onPropertyClick={handlePropertyClick} />
    </Layout>
  );
};

// 아파트 상세 페이지 컴포넌트
const AptDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDockVisible, setIsDockVisible] = useState(true);

  const handleBack = () => {
    navigate('/');
  };

  if (!id) {
    return null;
  }

  return (
    <Layout 
      currentView="dashboard" 
      onChangeView={() => {}}
      isDetailOpen={true}
      isDockVisible={isDockVisible}
    >
      <PropertyDetail propertyId={id} onBack={handleBack} />
    </Layout>
  );
};

// 홈 페이지
const HomePage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/apt/${id}`);
  };

  const handleViewAllPortfolio = () => {
    // 포트폴리오 기능은 유지하되 라우팅은 하지 않음
  };

  return (
    <Layout 
      currentView="dashboard" 
      onChangeView={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <Dashboard onPropertyClick={handlePropertyClick} onViewAllPortfolio={handleViewAllPortfolio} />
    </Layout>
  );
};

// 지도 페이지
const MapPage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/apt/${id}`);
  };

  const handleMapDockToggle = (forceState?: boolean) => {
    if (typeof forceState === 'boolean') {
      setIsDockVisible(forceState);
    } else {
      setIsDockVisible(prev => !prev);
    }
  };

  return (
    <Layout 
      currentView="map" 
      onChangeView={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <MapExplorer onPropertyClick={handlePropertyClick} onToggleDock={handleMapDockToggle} />
    </Layout>
  );
};

// 비교 페이지
const ComparePage = () => {
  const [isDockVisible, setIsDockVisible] = useState(true);

  return (
    <Layout 
      currentView="compare" 
      onChangeView={() => {}}
      isDetailOpen={false}
      isDockVisible={isDockVisible}
    >
      <Comparison />
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/stats/demand" element={<HousingDemandPage />} />
        <Route path="/stats/supply" element={<HousingSupplyPage />} />
        <Route path="/stats/ranking" element={<RankingPage />} />
        <Route path="/stats" element={<HousingDemandPage />} />
        <Route path="/apt/:id" element={<AptDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;