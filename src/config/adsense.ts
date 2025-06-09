// Google AdSense Configuration for freegameportal.shop
// Uncomment and configure when AdSense is approved

export const adsenseConfig = {
  // Replace with your actual AdSense Publisher ID
  publisherId: 'ca-pub-xxxxxxxxxxxxxxxxx',
  
  // Ad unit configurations
  adUnits: {
    // Header banner (728x90 or 320x50 for mobile)
    topBanner: {
      slotId: '1234567890',
      size: {
        desktop: '728x90',
        mobile: '320x50'
      },
      style: 'display:inline-block;width:728px;height:90px'
    },
    
    // Content banner (728x90)
    contentBanner: {
      slotId: '1234567891',
      size: '728x90',
      style: 'display:inline-block;width:728px;height:90px'
    },
    
    // Right sidebar rectangle (300x250)
    sidebarRectangle: {
      slotId: '1234567892',
      size: '300x250',
      style: 'display:inline-block;width:300px;height:250px'
    },
    
    // Right sidebar skyscraper (300x600)
    sidebarSkyscraper: {
      slotId: '1234567893',
      size: '300x600',
      style: 'display:inline-block;width:300px;height:600px'
    },
    
    // Bottom banner (728x90)
    bottomBanner: {
      slotId: '1234567894',
      size: '728x90',
      style: 'display:inline-block;width:728px;height:90px'
    }
  },
  
  // Site configuration
  site: {
    domain: 'freegameportal.shop',
    name: 'Free Game Portal',
    description: 'Play thousands of free online games'
  },
  
  // AdSense policies compliance
  policies: {
    // Ensure ads are clearly marked as advertisements
    requireAdLabel: true,
    
    // Maintain content-to-ad ratio (AdSense requires substantial content)
    minContentRatio: 0.7,
    
    // Responsive ad behavior
    responsive: true,
    
    // Family-safe content (suitable for all audiences)
    familySafe: true
  }
};

// Helper function to generate AdSense script tags
export const generateAdSenseScript = (publisherId: string) => `
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}"
     crossorigin="anonymous"></script>
`;

// Helper function to initialize ads
export const initializeAd = (adUnitId: string, slotId: string, size: string) => {
  return `
    <ins class="adsbygoogle"
         style="display:inline-block;width:${size.split('x')[0]}px;height:${size.split('x')[1]}px"
         data-ad-client="${adUnitId}"
         data-ad-slot="${slotId}"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
  `;
};

// Type definitions for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default adsenseConfig; 