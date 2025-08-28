import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  isLowEndDevice: boolean;
  memoryInfo?: {
    usedJSMemorySize: number;
    totalJSMemorySize: number;
    jsMemoryLimit: number;
  };
  connectionInfo?: {
    effectiveType: string;
    rtt: number;
    downlink: number;
  };
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    pixelRatio: number;
    screenSize: string;
  };
}

export const useMobilePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    // Detect device capabilities
    const detectDeviceCapabilities = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isTablet = /iPad|Android.*Tablet|Surface/i.test(navigator.userAgent);

      // Check for low-end device indicators
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      const memoryGB = (navigator as any).deviceMemory || 2;
      const pixelRatio = window.devicePixelRatio || 1;

      const isLowEndDevice =
        hardwareConcurrency <= 2 || memoryGB <= 2 || (isMobile && pixelRatio <= 1);

      // Get memory info if available
      const memoryInfo = (performance as any).memory
        ? {
            usedJSMemorySize: (performance as any).memory.usedJSMemorySize,
            totalJSMemorySize: (performance as any).memory.totalJSMemorySize,
            jsMemoryLimit: (performance as any).memory.jsMemoryLimit,
          }
        : undefined;

      // Get connection info if available
      const connection = (navigator as any).connection;
      const connectionInfo = connection
        ? {
            effectiveType: connection.effectiveType,
            rtt: connection.rtt,
            downlink: connection.downlink,
          }
        : undefined;

      setMetrics({
        isLowEndDevice,
        memoryInfo,
        connectionInfo,
        deviceInfo: {
          isMobile,
          isTablet,
          pixelRatio,
          screenSize: `${window.screen.width}x${window.screen.height}`,
        },
      });
    };

    // FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    detectDeviceCapabilities();
    measureFPS();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Performance optimization recommendations
  const getOptimizationRecommendations = () => {
    if (!metrics) return [];

    const recommendations = [];

    if (metrics.isLowEndDevice) {
      recommendations.push('Enable performance mode for low-end device');
    }

    if (
      metrics.connectionInfo?.effectiveType === 'slow-2g' ||
      metrics.connectionInfo?.effectiveType === '2g'
    ) {
      recommendations.push('Reduce image quality for slow connection');
    }

    if (
      metrics.memoryInfo &&
      metrics.memoryInfo.usedJSMemorySize > metrics.memoryInfo.jsMemoryLimit * 0.8
    ) {
      recommendations.push('High memory usage detected - consider clearing cache');
    }

    if (fps < 30) {
      recommendations.push('Low FPS detected - reduce animations');
    }

    return recommendations;
  };

  return {
    metrics,
    fps,
    recommendations: getOptimizationRecommendations(),
    isReady: metrics !== null,
  };
};
