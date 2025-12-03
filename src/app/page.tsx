'use client';

import { useEffect, useState, useRef } from 'react';
import { client } from '../sanity/lib/client';
import {
  overview_query,
  corporate_query,
  student_query,
  nature_query,
} from '../sanity/lib/queries';

type OverviewItem = {
  id: string;
  title: string;
  url: string;
  hasVideo: boolean;
  videoUrl?: string;
};

const queries = {
  overview: overview_query,
  corporate: corporate_query,
  student: student_query,
  nature: nature_query,
};

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'corporate' | 'student' | 'nature'>('overview');
  const [overviewItems, setOverviewItems] = useState<OverviewItem[]>([]);
  const [fullscreenItem, setFullscreenItem] = useState<OverviewItem | null>(null);

  const [showGrid, setShowGrid] = useState(false);
  const [heroText, setHeroText] = useState('Rachel Buckland');
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch items whenever selectedTab changes
  useEffect(() => {
    async function fetchItems() {
      setShowGrid(false); // hide grid to restart animation
      imageRefs.current = []; // reset refs

      const query = queries[selectedTab];
      const data = await client.fetch(query);

      if (Array.isArray(data)) {
        const items = data.map((item: any) => ({
          id: item._id,
          title: item.title,
          url: item.imageUrl,
          hasVideo: !!item.hasVideo,
          videoUrl: item.videoUrl || undefined,
        }));
        setOverviewItems(items);

        await Promise.all(
          items.map(
            (item) =>
              new Promise<void>((resolve) => {
                const img = new Image();
                img.src = item.url;
                img.onload = () => resolve();
                img.onerror = () => resolve(); // continue even if an image fails
              })
          )
        );
      }

      // Update hero text based on tab
      setHeroText(selectedTab === 'overview' ? 'Rachel Buckland' : selectedTab.toUpperCase());

      // Wait for hero animation to finish before showing grid
      const heroAnimationDuration = 2200; // duration of hero text animation
      await new Promise((resolve) => setTimeout(resolve, heroAnimationDuration));
      setShowGrid(true);
    }

    fetchItems();
  }, [selectedTab]);

  // Animate images when they enter viewport
  useEffect(() => {
    if (!showGrid) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wipe-down');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.2 }
    );

    imageRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [showGrid, overviewItems]);

  // Repeat items for infinite grid
  const repeatedItems = overviewItems.length
    ? Array.from({ length: 1000 }, (_, i) => ({
      ...overviewItems[i % overviewItems.length],
      displayId: i,
    }))
    : [];

  return (
    <main className="h-screen w-full relative overflow-hidden bg-[#F7F5F1]">

      {/* Hero text */}
      <div
        key={selectedTab} // forces new element for animation
        className="fixed inset-0 flex items-center justify-center h-[90vh] text-center text-[clamp(13vw,8vh,16vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:text-[clamp(13vh,8vw,16vh)] uppercase italia z-[1] pointer-events-none wipe-down-slow"
      >
        {heroText}
      </div>

      {/* Scrollable grid */}
      {showGrid && (
        <div className="fixed inset-0 z-[2] overflow-y-scroll hide-scrollbar">
          <div className="grid grid-cols-2 [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:grid-cols-4 gap-[clamp(6vw,4vh,8vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:gap-[clamp(11vh,7vw,14vh)] px-[clamp(6vw,4vh,8vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:px-[clamp(12vh,7vw,14vh)] py-[clamp(6vw,4vh,8vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:py-[clamp(5vh,3.5vw,7vh)] min-h-[200vh]">
            {repeatedItems.map((item, i) => (
              <div
                key={item.displayId}
                ref={(el) => { imageRefs.current[i] = el; }}
                className="relative cursor-pointer flex flex-col items-start opacity-0"
                onClick={() => setFullscreenItem(item)}
              >
                <div className="relative w-full inline-block">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-auto transition-transform duration-300 hover:scale-105 block"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-90 transition-opacity duration-300">
                    <span className="text-white font-sans font-bold uppercase text-center text-[clamp(1.5vw,1.5vh,3vw) [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:text-[clamp(1.5vh,1.5vw,3vh)] text-balance">{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="fixed bottom-[clamp(2vw,2vh,4vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:bottom-0 left-0 w-full items-end [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:h-[10vh] flex [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:items-center justify-between px-[clamp(5vw,4vh,8vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:px-[clamp(11vh,7vw,14vh)] z-30 pointer-events-none">
        <div className="flex space-y-[clamp(2vw,2vh,4vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:space-y-0 [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:space-x-[clamp(0.5vh,0.75vw,1.5vh)] pointer-events-auto flex-col [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:flex-row">
          {['overview', 'corporate', 'student', 'nature'].map((tab) => (
            <button
              key={tab}
              className={`uppercase px-[clamp(0.5vw,1vh,2vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:px-[clamp(0.2vw,1vh,0.5vw)] py-[clamp(0.5vw,0.6vh,1.2vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:py-[clamp(0.1vw,0.6vh,0.3vw)] text-[clamp(2vw,1.75vh,3.5vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:text-[clamp(0.2vw,1vh,0.5vw)] border border-black font-sans font-bold transition-colors duration-300 cursor-pointer ${selectedTab === tab
                ? 'bg-black text-white'
                : 'bg-[#F7F5F1] text-black hover:bg-black hover:text-white'
                }`}
              onClick={() => setSelectedTab(tab as any)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <a
          href="https://wa.me/27799236301?text=Hi%20Rachel%2C%20I%20would%20like%20to%20book%20your%20services%21"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer h-full [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:h-auto pointer-events-auto uppercase px-[clamp(0.5vw,1vh,2vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:px-[clamp(0.2vw,1vh,0.5vw)] py-[clamp(0.5vw,0.6vh,1.2vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:py-[clamp(0.1vw,0.6vh,0.3vw)] text-[clamp(2vw,1.75vh,3.5vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:text-[clamp(0.2vw,1vh,0.5vw)] bg-[#F7F5F1] text-black border border-black font-sans font-bold hover:bg-black hover:text-white transition-colors duration-300"
        >
          Contact
        </a>


      </div>

      {/* Fullscreen overlay */}
      {fullscreenItem && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            className="absolute top-[0] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:top-[0vw] right-[clamp(2vw,2vh,4vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:right-[clamp(0.75vh,0.75vw,1.5vh)] text-white text-[clamp(9vw,6vh,12vw)] [@media(min-width:1080px)_and_(min-aspect-ratio:1/1)]:text-[clamp(2vh,2vw,4vh)] italia font-bold z-50 cursor-pointer"
            onClick={() => setFullscreenItem(null)}
          >
            ×
          </button>

          {fullscreenItem.hasVideo ? (
            <video src={fullscreenItem?.videoUrl} controls autoPlay className="max-w-full max-h-full object-contain" />
          ) : (
            <img src={fullscreenItem.url} alt={fullscreenItem.title} className="max-w-full max-h-full object-contain" />
          )}
        </div>
      )}
    </main>
  );
}
