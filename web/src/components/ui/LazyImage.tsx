import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  fallback?: React.ReactNode;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder,
  fallback,
  sizes,
  loading = 'lazy',
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [loading]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate WebP and fallback sources
  const getOptimizedSrc = (originalSrc: string) => {
    // Try to detect if it's a relative path and add WebP support
    if (originalSrc.startsWith('/') || originalSrc.startsWith('./')) {
      const pathParts = originalSrc.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      // Return both WebP and original format
      return {
        webp: `${basePath}.webp`,
        original: originalSrc
      };
    }
    
    return {
      webp: originalSrc,
      original: originalSrc
    };
  };

  const sources = getOptimizedSrc(src);

  // Render error state
  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>
      )}

      {/* Loading skeleton */}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 bg-gray-100">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        </div>
      )}

      {/* Actual image with progressive enhancement */}
      {isInView && (
        <picture>
          {/* WebP source for modern browsers */}
          <source 
            srcSet={sources.webp} 
            type="image/webp"
            sizes={sizes}
          />
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={sources.original}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={`
              transition-opacity duration-300 
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${className}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            decoding="async"
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </picture>
      )}
    </div>
  );
}

// Higher-order component for automatic image optimization
export function withImageOptimization<T extends { src: string; alt: string }>(
  Component: React.ComponentType<T>
) {
  return function OptimizedComponent(props: T) {
    return <Component {...props} />;
  };
}

// Utility function to preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Utility function to preload multiple images
export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

export default LazyImage;