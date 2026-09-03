import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CardCarousel({
  items = [],
  renderItem,
  desktopItems = 4,
  tabletItems = 2,
  mobileItems = 1,
  gap = 20,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(desktopItems);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Responsive visible count calculation
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(mobileItems);
      } else if (width < 1024) {
        setVisibleCount(tabletItems);
      } else {
        setVisibleCount(desktopItems);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [desktopItems, tabletItems, mobileItems]);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Keep index within valid range upon dynamic data change or resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= maxIndex;
  const showControls = items.length > visibleCount;

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="card-carousel-container" style={{ position: 'relative', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        position: 'relative'
      }}>
        {/* Left Arrow Button */}
        {showControls && (
          <button
            type="button"
            onClick={handlePrev}
            disabled={isPrevDisabled}
            aria-label="Previous cards"
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isPrevDisabled ? 'default' : 'pointer',
              visibility: isPrevDisabled ? 'hidden' : 'visible',
              opacity: isPrevDisabled ? 0 : 1,
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Viewport Track */}
        <div
          style={{
            overflow: 'hidden',
            flex: 1,
            width: '100%',
            padding: '8px 2px'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transition: 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateX(calc(-${currentIndex} * ((100% + ${gap}px) / ${visibleCount})))`,
              alignItems: 'stretch'
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id || item.step || item.name || idx}
                style={{
                  flex: `0 0 calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`,
                  maxWidth: `calc((100% - ${(visibleCount - 1) * gap}px) / ${visibleCount})`,
                  boxSizing: 'border-box',
                  display: 'flex'
                }}
              >
                {renderItem(item, idx)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {showControls && (
          <button
            type="button"
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label="Next cards"
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isNextDisabled ? 'default' : 'pointer',
              visibility: isNextDisabled ? 'hidden' : 'visible',
              opacity: isNextDisabled ? 0 : 1,
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
              zIndex: 10
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Slide Dots Indicator */}
      {showControls && maxIndex > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          marginTop: 'var(--space-4)'
        }}>
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: dotIdx === currentIndex ? 22 : 7,
                height: 7,
                borderRadius: 'var(--radius-full)',
                background: dotIdx === currentIndex ? 'var(--color-primary-600)' : 'var(--color-border)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
