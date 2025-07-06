
import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import PropertyVideo from './PropertyVideo';
import { cn } from '@/lib/utils';

interface MediaLightboxProps {
  media: string[];
  videos: string[];
  startIndex: number;
  onClose: () => void;
  getPropertyTitle: () => string;
}

const MediaLightbox = ({ media, videos, startIndex, onClose, getPropertyTitle }: MediaLightboxProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(startIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      resetZoom(); // Reset zoom on slide change
    };

    api.on('select', onSelect);
    api.scrollTo(startIndex, true); // Go to initial slide without animation

    return () => {
      api.off('select', onSelect);
    };
  }, [api, startIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const goToPrevious = useCallback(() => {
    if (api) {
      api.scrollPrev();
    }
  }, [api]);

  const goToNext = useCallback(() => {
    if (api) {
      api.scrollNext();
    }
  }, [api]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 1.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    const newZoomLevel = Math.max(zoomLevel / 1.5, 1);
    setZoomLevel(newZoomLevel);
    if (newZoomLevel <= 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (zoomLevel > 1) {
      resetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setPanStart({ x: panPosition.x, y: panPosition.y });
    }
  }, [zoomLevel, panPosition.x, panPosition.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 2) {
      // Pinch to zoom
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        setZoomLevel(prev => Math.max(1, Math.min(prev * scale, 4)));
      }
      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      // Pan when zoomed
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      // Calculate new position with bounds
      const newX = panStart.x + deltaX;
      const newY = panStart.y + deltaY;

      // Apply reasonable bounds (allow some movement beyond edges)
      const maxPan = 300 * zoomLevel;
      const boundedX = Math.max(-maxPan, Math.min(maxPan, newX));
      const boundedY = Math.max(-maxPan, Math.min(maxPan, newY));

      setPanPosition({
        x: boundedX,
        y: boundedY
      });
    }
  }, [isDragging, zoomLevel, lastTouchDistance, dragStart.x, dragStart.y, panStart.x, panStart.y]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastTouchDistance(0);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart({ x: panPosition.x, y: panPosition.y });
      e.preventDefault();
      e.stopPropagation();
    }
  }, [zoomLevel, panPosition.x, panPosition.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Calculate new position with bounds
      const newX = panStart.x + deltaX;
      const newY = panStart.y + deltaY;

      // Apply reasonable bounds (allow some movement beyond edges)
      const maxPan = 300 * zoomLevel;
      const boundedX = Math.max(-maxPan, Math.min(maxPan, newX));
      const boundedY = Math.max(-maxPan, Math.min(maxPan, newY));

      setPanPosition({
        x: boundedX,
        y: boundedY
      });
    }
  }, [isDragging, zoomLevel, dragStart.x, dragStart.y, panStart.x, panStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isCurrentMediaVideo) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoomLevel = Math.max(1, Math.min(zoomLevel + delta, 4));
      setZoomLevel(newZoomLevel);

      if (newZoomLevel <= 1) {
        setPanPosition({ x: 0, y: 0 });
      }
    }
  };
  
  const isCurrentMediaVideo = videos.includes(media[current]);
  const isZoomed = zoomLevel > 1;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="bg-black/90 border-none p-0 w-screen h-screen max-w-full max-h-full flex items-center justify-center flex-col outline-none"
        onClick={onClose}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-[100] text-white hover:bg-white/20 hover:text-white pointer-events-auto"
          style={{ position: 'fixed', zIndex: 9999 }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
        >
          <X className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </Button>
        
        {!isCurrentMediaVideo && (
          <div className="absolute top-4 left-4 z-[100] flex gap-2" style={{ position: 'fixed', zIndex: 9999 }}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white bg-black/50 border border-white/20 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleZoomIn();
              }}
              disabled={zoomLevel >= 4}
            >
              <ZoomIn className="h-5 w-5" />
              <span className="sr-only">Zoom In</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white bg-black/50 border border-white/20 pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleZoomOut();
              }}
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="h-5 w-5" />
              <span className="sr-only">Zoom Out</span>
            </Button>

            {isZoomed && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 hover:text-white bg-black/50 border border-white/20 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  resetZoom();
                }}
              >
                <RotateCcw className="h-5 w-5" />
                <span className="sr-only">Reset Zoom</span>
              </Button>
            )}
          </div>
        )}

        <Carousel 
          setApi={setApi} 
          className="w-full h-full" 
          opts={{ startIndex, loop: media.length > 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CarouselContent>
            {media.map((item, index) => (
              <CarouselItem key={index} className="h-screen flex items-center justify-center p-0">
                {videos.includes(item) ? (
                  <div className="w-full max-w-4xl h-full flex items-center justify-center">
                     <PropertyVideo
                        videoUrl={item}
                        title={getPropertyTitle()}
                        isActive={true}
                        onClick={() => {}}
                      />
                  </div>
                ) : (
                  <div
                    ref={containerRef}
                    className={cn(
                      "w-full h-full flex items-center justify-center touch-none select-none",
                      isZoomed ? "overflow-hidden cursor-grab" : "overflow-hidden cursor-zoom-in",
                      isDragging && "cursor-grabbing"
                    )}
                    onDoubleClick={handleDoubleClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    style={{
                      // تحسين الأداء
                      contain: 'layout style paint',
                      isolation: 'isolate',
                      zIndex: 1
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={item}
                      alt={getPropertyTitle()}
                      className={cn(
                        "max-w-full max-h-full object-contain pointer-events-none",
                        // إزالة transition عند السحب لحركة سلسة
                        !isDragging && "transition-transform duration-200"
                      )}
                      style={{
                        transform: `translate3d(${panPosition.x}px, ${panPosition.y}px, 0) scale(${zoomLevel})`,
                        transformOrigin: 'center center',
                        willChange: isDragging ? 'transform' : 'auto',
                        backfaceVisibility: 'hidden',
                        perspective: 1000
                      }}
                      draggable={false}
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          {media.length > 1 && (
            <>
              <CarouselPrevious
                className={cn(
                  "absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 z-[100] text-white transition-all duration-200 pointer-events-auto",
                  isZoomed
                    ? "bg-black/80 hover:bg-black/95 border-2 border-white/50 shadow-lg w-12 h-12"
                    : "bg-white/30 hover:bg-white/50 w-10 h-10"
                )}
                style={{
                  position: 'fixed',
                  zIndex: 9999
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Reset zoom when changing slides
                  if (isZoomed) {
                    resetZoom();
                  }
                  // Navigate to previous slide
                  goToPrevious();
                }}
              />

              <CarouselNext
                className={cn(
                  "absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 z-[100] text-white transition-all duration-200 pointer-events-auto",
                  isZoomed
                    ? "bg-black/80 hover:bg-black/95 border-2 border-white/50 shadow-lg w-12 h-12"
                    : "bg-white/30 hover:bg-white/50 w-10 h-10"
                )}
                style={{
                  position: 'fixed',
                  zIndex: 9999
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Reset zoom when changing slides
                  if (isZoomed) {
                    resetZoom();
                  }
                  // Navigate to next slide
                  goToNext();
                }}
              />
            </>
          )}
        </Carousel>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-4 text-white/80 bg-black/50 px-4 py-2 rounded-full text-sm">
            <span>{current + 1} / {media.length}</span>
            {!isCurrentMediaVideo && isZoomed && (
              <span className="text-xs">
                {Math.round(zoomLevel * 100)}%
              </span>
            )}
          </div>

          {!isCurrentMediaVideo && (
            <div className="text-white/60 bg-black/30 px-3 py-1 rounded-full text-xs text-center">
              <div className="hidden md:block">
                Double-click or scroll to zoom • Drag to pan
              </div>
              <div className="md:hidden">
                Double-tap to zoom • Pinch to zoom • Drag to pan
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLightbox;
