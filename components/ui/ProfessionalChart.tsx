import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, SeriesMarker, Time, LineStyle, ISeriesApi } from 'lightweight-charts';

export interface ChartSeriesData {
    name: string;
    data: { time: string; value: number }[];
    color: string;
    visible?: boolean;
}

interface ProfessionalChartProps {
    data?: { time: string; value: number }[];
    series?: ChartSeriesData[];
    height?: number;
    theme?: 'light' | 'dark';
    lineColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    isSparkline?: boolean;
    showHighLow?: boolean;
}

export const ProfessionalChart: React.FC<ProfessionalChartProps> = ({ 
    data, 
    series,
    height = 400, 
    theme = 'light',
    lineColor,
    areaTopColor,
    areaBottomColor,
    isSparkline = false,
    showHighLow = false
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    const isDark = theme === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
    const backgroundColor = 'transparent';

    const formatPrice = (price: number) => {
        const val = Math.round(price);
        if (val < 10000) return `${val.toLocaleString()}`;
        const eok = Math.floor(val / 10000);
        const man = val % 10000;
        if (eok > 0) return `${eok}억 ${man > 0 ? man.toLocaleString() : ''}`;
        return `${man.toLocaleString()}`;
    };

    const formatPriceShort = (price: number) => {
        const val = Math.round(price);
        if (val < 10000) return `${val.toLocaleString()}`;
        const eok = Math.floor(val / 10000);
        const man = val % 10000;
        if (man === 0) return `${eok}억`;
        return `${eok}억 ${Math.round(man / 1000) * 1000 > 0 ? (Math.round(man / 1000) * 1000).toLocaleString() : ''}`;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;
        if (chartRef.current) {
            try { chartRef.current.remove(); } catch (e) {}
            chartRef.current = null;
        }

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor: textColor,
                fontFamily: "'Pretendard Variable', sans-serif",
                fontSize: 12,
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            grid: {
                vertLines: { visible: !isSparkline, color: gridColor, style: LineStyle.Solid },
                horzLines: { visible: !isSparkline, color: gridColor, style: LineStyle.Solid },
            },
            rightPriceScale: {
                visible: !isSparkline,
                borderColor: 'transparent',
                scaleMargins: { top: 0.2, bottom: 0.2 },
                borderVisible: false,
                alignLabels: true,
            },
            timeScale: {
                visible: !isSparkline,
                borderColor: 'transparent',
                timeVisible: true,
                borderVisible: false,
                fixLeftEdge: true,
                fixRightEdge: true,
                tickMarkFormatter: (time: number | string) => {
                    if (typeof time === 'string') {
                        const date = new Date(time);
                        return `${date.getFullYear().toString().slice(2)}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    }
                    return '';
                }
            },
            localization: { priceFormatter: formatPrice },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: { visible: !isSparkline, color: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1', style: LineStyle.Dashed, labelVisible: false },
                horzLine: { visible: !isSparkline, color: isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1', style: LineStyle.Dashed, labelVisible: true }
            },
            handleScale: false,
            handleScroll: false,
        });

        chartRef.current = chart;

        if (series && series.length > 0) {
            series.forEach(s => {
                if (!s.visible) return;
                const lineSeries = chart.addLineSeries({
                    color: s.color,
                    lineWidth: 2,
                    crosshairMarkerVisible: true,
                    priceLineVisible: false,
                    title: s.name,
                });
                const sortedData = [...s.data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
                const uniqueData = sortedData.filter((item, index, self) => index === 0 || item.time !== self[index - 1].time);
                if (uniqueData.length > 0) {
                    lineSeries.setData(uniqueData);
                    
                    // Add high/low markers
                    if (!isSparkline && showHighLow && uniqueData.length > 0) {
                        const values = uniqueData.map(d => d.value);
                        const minVal = Math.min(...values);
                        const maxVal = Math.max(...values);

                        const minData = uniqueData.find(d => d.value === minVal);
                        const maxData = uniqueData.find(d => d.value === maxVal);

                        const markers: SeriesMarker<Time>[] = [];
                        if (minData) {
                            markers.push({
                                time: minData.time as Time,
                                position: 'belowBar',
                                color: '#38bdf8',
                                shape: 'arrowUp',
                                text: `최저 ${formatPriceShort(minVal)}`,
                                size: 0,
                            });
                        }
                        if (maxData) {
                            markers.push({
                                time: maxData.time as Time,
                                position: 'aboveBar',
                                color: s.color || '#ef4444',
                                shape: 'arrowDown',
                                text: `최고 ${formatPriceShort(maxVal)}`,
                                size: 0,
                            });
                        }
                        // Sort markers by time (required by lightweight-charts)
                        const sortedMarkers = markers.sort((a, b) => 
                            new Date(a.time as string).getTime() - new Date(b.time as string).getTime()
                        );
                        lineSeries.setMarkers(sortedMarkers);
                    }
                }
            });
        } else if (data && data.length > 0) {
            const mainColor = lineColor || '#3182F6'; 
            const topColor = areaTopColor || 'rgba(49, 130, 246, 0.2)';
            const bottomColor = areaBottomColor || 'rgba(49, 130, 246, 0.0)'; 

            const areaSeries = chart.addAreaSeries({
                topColor: topColor,
                bottomColor: bottomColor,
                lineColor: mainColor,
                lineWidth: 2,
                priceFormat: { type: 'custom', formatter: formatPrice },
                crosshairMarkerVisible: true,
                priceLineVisible: false,
            });

            const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
            const uniqueData = sortedData.filter((item, index, self) => index === 0 || item.time !== self[index - 1].time);

            if (uniqueData.length > 0) {
                areaSeries.setData(uniqueData);
                
                // Add high/low markers for area series
                if (!isSparkline && showHighLow) {
                    const values = uniqueData.map(d => d.value);
                    const minVal = Math.min(...values);
                    const maxVal = Math.max(...values);

                    const minData = uniqueData.find(d => d.value === minVal);
                    const maxData = uniqueData.find(d => d.value === maxVal);

                    const markers: SeriesMarker<Time>[] = [];
                    if (minData) {
                        markers.push({
                            time: minData.time as Time,
                            position: 'belowBar',
                            color: '#38bdf8',
                            shape: 'arrowUp',
                            text: `최저 ${formatPriceShort(minVal)}`,
                            size: 0,
                        });
                    }
                    if (maxData) {
                        markers.push({
                            time: maxData.time as Time,
                            position: 'aboveBar',
                            color: mainColor,
                            shape: 'arrowDown',
                            text: `최고 ${formatPriceShort(maxVal)}`,
                            size: 0,
                        });
                    }
                    areaSeries.setMarkers(markers);
                }
            }
        }

        chart.timeScale().fitContent();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [data, series, height, theme, lineColor, areaTopColor, areaBottomColor, isSparkline, showHighLow]);

    return <div ref={chartContainerRef} className="w-full relative" />;
};
