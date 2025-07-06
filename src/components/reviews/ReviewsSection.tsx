import { MessageSquare, Star, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteReviews } from "@/hooks/useSiteReviews";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";

const ReviewsSection = () => {
  const { currentLanguage } = useLanguage();
  const { reviews, loading } = useSiteReviews();
  const [api, setApi] = useState<any>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  // جلب ألوان تدرج الموقع من :root
  const gradientFrom =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-from-color') ||
    '#2e90fa';
  const gradientTo =
    getComputedStyle(document.documentElement).getPropertyValue('--brand-gradient-to-color') ||
    '#a855f7';

  // Palette for stats area (especially for dark mode)
  const statNumberColor = "text-gray-900 dark:text-white";
  const statSubtleColor = "text-gray-600 dark:text-gray-400";
  const statDimmedColor = "text-gray-400 dark:text-gray-400";
  const statCardBg =
    "bg-white/90 dark:bg-[#232639]/80";
  const statCardBorder =
    "border border-white/50 dark:border-[#3d4164]/60";

  // Carousel: تعديل إعدادات التشغيل التلقائي لتجربة أفضل
  const [autoplayPlugin] = useState(() => Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  }));

  const onSelect = useCallback(() => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSlidesInView(api.slidesInView(true));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    api.on("scroll", onSelect); // تحديث الحركة أثناء السحب

    return () => {
      api?.off("select", onSelect);
      api?.off("reInit", onSelect);
      api?.off("scroll", onSelect);
    };
  }, [api, onSelect]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const getTitle = () => {
    return currentLanguage === 'ar' ? 'آراء عملائنا' : 
           currentLanguage === 'tr' ? 'Müşteri Görüşleri' : 
           'Customer Reviews';
  };

  const getDescription = () => {
    return currentLanguage === 'ar' ? 'اكتشف ما يقوله عملاؤنا عن خدماتنا وشاركنا تجربتك' : 
           currentLanguage === 'tr' ? 'Müşterilerimizin hizmetlerimiz hakkında söylediklerini keşfedin ve deneyiminizi paylaşın' : 
           'Discover what our customers say about our services and share your experience';
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <section
        className="py-20 px-4 w-full"
        style={{
          background: "#fff",
          ...(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? { background: "#181926" }
            : {}),
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 md:py-20 px-2 md:px-4 w-full relative overflow-hidden bg-white dark:bg-[#181926] transition-colors duration-500"
      style={{}}
    >
      {/* أبقي عناصر التدرجات البصرية ولكن خلفية القسم الرئيسية أصبحت بيضاء */}
      {/* Animated Background Elements with Site Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Light background blobs */}
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse dark:hidden"
          style={{
            background: `radial-gradient(circle at 60% 40%, ${gradientFrom}22 70%, ${gradientTo}00 100%)`
          }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl animate-pulse dark:hidden"
          style={{
            background: `radial-gradient(circle at 60% 60%, ${gradientTo}22 70%, ${gradientFrom}00 100%)`,
            animationDelay: '2s'
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-3xl animate-pulse dark:hidden"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${gradientFrom}11 60%, ${gradientTo}10 100%)`,
            animationDelay: '4s'
          }}
        ></div>
        {/* Dark blobs overlay */}
        <div
          className="absolute inset-0 hidden dark:block rounded-3xl pointer-events-none"
          style={{
            background: "linear-gradient(120deg,#232433 60%,#2c2d3e 100%)",
            opacity: 0.85,
            filter: 'blur(48px)',
            zIndex: 1,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              {/* الدائرة خلف الأيقونة نفس تدرج الموقع */}
              <div
                className="absolute inset-0 rounded-full blur-lg opacity-30 animate-pulse"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                }}
              ></div>
              <MessageSquare
                className="relative w-6 md:w-8 h-6 md:h-8 text-[inherit] animate-bounce"
                style={{
                  color: gradientFrom,
                  animationDuration: "3s"
                }}
              />
              <Star
                className="w-3 md:w-4 h-3 md:h-4 absolute -top-1 -right-1 animate-pulse"
                style={{
                  color: "#facc15"
                }}
              />
            </div>
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent animate-scale-in"
              style={{
                background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              {getTitle()}
            </h2>
          </div>
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {getDescription()}
          </p>

          {/* Enhanced Stats */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-8 animate-fade-in flex-wrap" style={{ animationDelay: '0.4s' }}>
              <div
                className={`group relative overflow-hidden rounded-full px-4 md:px-8 py-3 md:py-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 cursor-pointer ${statCardBg} ${statCardBorder}`}
                style={{
                  border: `1.5px solid ${gradientFrom}`,
                  background: `linear-gradient(90deg, ${gradientFrom}09 0%, ${gradientTo}09 100%)`
                }}
              >
                <div className="absolute inset-0"
                  style={{
                    background: `linear-gradient(120deg, ${gradientFrom}22 0%, ${gradientTo}22 100%)`,
                    transform: 'skewX(-12deg)'
                  }}
                ></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <Star
                    className="w-4 md:w-6 h-4 md:h-6"
                    style={{
                      color: "#facc15"
                    }}
                  />
                  <span className={`font-bold text-lg md:text-2xl ${statNumberColor}`}>{getAverageRating()}</span>
                  <span className={`text-xs md:text-base font-medium ${statSubtleColor}`}>
                    {currentLanguage === 'ar' ? 'من 5' :
                     currentLanguage === 'tr' ? '/ 5' :
                     'out of 5'}
                  </span>
                </div>
              </div>
              
              <div
                className={`group relative overflow-hidden rounded-full px-4 md:px-8 py-3 md:py-4 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 cursor-pointer ${statCardBg} ${statCardBorder}`}
                style={{
                  border: `1.5px solid ${gradientTo}`,
                  background: `linear-gradient(90deg, ${gradientFrom}09 0%, ${gradientTo}09 100%)`
                }}
              >
                <div className="absolute inset-0"
                  style={{
                    background: `linear-gradient(120deg, ${gradientFrom}22 0%, ${gradientTo}22 100%)`,
                    transform: 'skewX(-12deg)'
                  }}
                ></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <Users
                    className="w-4 md:w-6 h-4 md:h-6"
                    style={{
                      color: gradientFrom,
                      animationDelay: '1s'
                    }}
                  />
                  <span className={`font-bold text-lg md:text-2xl ${statNumberColor}`}>{reviews.length}</span>
                  <span className={`text-xs md:text-base font-medium ${statSubtleColor}`}>
                    {currentLanguage === 'ar' ? 'تقييم' :
                     currentLanguage === 'tr' ? 'değerlendirme' :
                     'reviews'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="mb-12 md:mb-16 animate-fade-in px-2" style={{ animationDelay: '0.6s' }}>
          <ReviewForm />
        </div>

        {/* Reviews Carousel */}
        {reviews.length === 0 ? (
          <div className="text-center py-20 animate-fade-in px-4" style={{ animationDelay: '0.8s' }}>
            <div className="max-w-md mx-auto">
              <div className="relative w-20 md:w-24 h-20 md:h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                <div className="relative w-20 md:w-24 h-24 md:h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
                  <MessageSquare className="w-10 md:w-12 h-10 md:h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                {currentLanguage === 'ar' ? 'لا توجد تقييمات بعد' : 
                 currentLanguage === 'tr' ? 'Henüz değerlendirme yok' : 
                 'No reviews yet'}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {currentLanguage === 'ar' ? 'كن أول من يشارك تجربته معنا' : 
                 currentLanguage === 'tr' ? 'Bizimle deneyiminizi paylaşan ilk kişi olun' : 
                 'Be the first to share your experience with us'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative animate-fade-in px-2 md:px-8" style={{ animationDelay: '1s' }}>
            <Carousel
              setApi={setApi}
              plugins={[autoplayPlugin]}
              opts={{
                align: "start",
                loop: true,
                slidesToScroll: 1,
              }}
              className="w-full"
              onMouseEnter={() => autoplayPlugin.stop()}
              onMouseLeave={() => autoplayPlugin.play()}
            >
              <CarouselContent className="-ml-1 md:-ml-4">
                {reviews.map((review, index) => {
                  const isInView = slidesInView.includes(index);
                  return (
                    <CarouselItem
                      key={review.id}
                      className="
                        pl-1 md:pl-4
                        basis-[90%] xs:basis-[80%]
                        sm:basis-1/2
                        lg:basis-1/3
                        xl:basis-1/4
                      "
                    >
                      <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                          opacity: isInView ? 1 : 0,
                          transform: isInView ? 'scale(1)' : 'scale(0.9)',
                        }}
                      >
                        <ReviewCard review={review} index={index} />
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* أزرار التنقل تظل موجودة */}
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-14 h-14 text-white transition-all duration-500 hover:scale-110 hover:brightness-110 shadow-2xl hover:shadow-3xl group rounded-full items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                }}
              >
                <ChevronLeft className="w-6 h-6 group-hover:animate-pulse transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-14 h-14 text-white transition-all duration-500 hover:scale-110 hover:brightness-110 shadow-2xl hover:shadow-3xl group rounded-full items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
                }}
              >
                <ChevronRight className="w-6 h-6 group-hover:animate-pulse transition-transform group-hover:translate-x-0.5" />
              </button>
            </Carousel>
            {/* حذف مؤشرات النقاط الخاصة بالصفحات والعداد */}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
