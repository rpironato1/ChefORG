// Performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  
  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Preload critical resources
  public preloadResource(href: string, as: string, type?: string, crossorigin?: boolean): void {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    // Add to head if not already present
    if (!document.querySelector(`link[href="${href}"]`)) {
      document.head.appendChild(link);
    }
  }

  // Remove unused CSS
  public removeUnusedCSS(): void {
    if (typeof window === 'undefined') return;
    
    // Add media query to defer non-critical CSS
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((stylesheet) => {
      const link = stylesheet as HTMLLinkElement;
      
      // Skip critical stylesheets
      if (link.href.includes('critical') || link.href.includes('inline')) {
        return;
      }
      
      // Add media query to defer non-critical CSS
      if (!link.media || link.media === 'all') {
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
      }
    });
  }

  // Initialize all optimizations
  public initialize(): void {
    if (typeof window === 'undefined') return;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.runOptimizations();
      });
    } else {
      this.runOptimizations();
    }
  }

  private runOptimizations(): void {
    // Remove unused CSS
    this.removeUnusedCSS();
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  PerformanceOptimizer.getInstance().initialize();
}

export default PerformanceOptimizer;