import React from 'react';

export interface Property {
  id: string;
  name: string;
  location: string;
  area: number; // m2
  currentPrice: number; // in 10,000 KRW (man-won)
  purchasePrice: number;
  purchaseDate: string;
  changeRate: number; // percentage
  // Investment Metrics
  jeonsePrice?: number; // Current Jeonse Price
  gapPrice?: number;    // Current Price - Jeonse Price
  jeonseRatio?: number; // (Jeonse / Current) * 100
  loan?: number;        // Loan amount
}

export interface ChartDataPoint {
  date: string;
  value: number;
  value2?: number; // Optional for comparison
}

export type ViewType = 'dashboard' | 'map' | 'compare' | 'stats' | 'portfolio';

export interface TabItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<any>;
}

export interface ViewProps {
  onPropertyClick: (id: string) => void;
  onViewAllPortfolio?: () => void;
  onToggleDock?: (visible?: boolean) => void;
}