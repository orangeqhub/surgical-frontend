"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Text from "@/components/ui/Text";

import {
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useBanners } from "@/hooks/usebanner";

export default function HeroSection() {
  const router = useRouter();
  const { banners, loading } = useBanners();
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Controls whether the slide transform has a CSS transition (disabled during the silent loop-reset)
  const [withTransition, setWithTransition] = useState(true);

  // Touch handlers for mobile swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const trackRef = useRef(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe fallback to static asset if backend returns nothing or is loading
  const bannerList = banners && banners.length > 0
    ? banners
    : [{ image_url: "/surgimage.png", title: "Surgical Equipment", redirect_url: null }];

  const totalSlides = bannerList.length;

  // Append a clone of the first slide at the end so we can loop seamlessly (1->2->3->1...)
  const slidesToRender = totalSlides > 1 ? [...bannerList, bannerList[0]] : bannerList;

  // Continuous forward auto-scroll: 1 -> 2 -> 3 -> (clone of 1) -> silently reset -> 1 ...
  useEffect(() => {
    if (!mounted || loading || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [mounted, loading, totalSlides]);

  // When we land on the cloned slide (index === totalSlides), silently jump back to real slide 0
  useEffect(() => {
    if (totalSlides <= 1) return;

    if (currentSlide === totalSlides) {
      const timeout = setTimeout(() => {
        setWithTransition(false);
        setCurrentSlide(0);
      }, 700); // match transition duration
      return () => clearTimeout(timeout);
    }

    if (!withTransition) {
      // Re-enable transition on the next tick after the silent jump
      const raf = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [currentSlide, totalSlides, withTransition]);

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => {
      if (prev === 0) {
        // Jump to the clone position then let it animate backward smoothly
        setWithTransition(false);
        requestAnimationFrame(() => {
          setWithTransition(true);
          requestAnimationFrame(() => setCurrentSlide(totalSlides - 1));
        });
        return totalSlides; // temporarily sit on the clone
      }
      return prev - 1;
    });
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const handlechange = () => {
    router.push("/products");
  };

  const handleWhatsApp = () => {
    const phone = "919885161899";
    const message = encodeURIComponent(
      "Hi, I'm interested in your surgical & medical products."
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleBannerClick = (banner) => {
    if (banner?.redirect_url) {
      router.push(banner.redirect_url);
    }
  };

  // For the dot indicators, map the "real" active dot (wraps clone -> 0)
  const activeDot = currentSlide % totalSlides;

  return (
    <section className="py-12 lg:py-20 overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-white">
      <Container className="max-w-[1700px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-8 xl:gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 border border-indigo-100/50 transition-all duration-300 hover:bg-indigo-50/80">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-text-primary text-xs sm:text-sm font-semibold tracking-wide uppercase">
                🏥 India's Trusted Medical Store
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-black tracking-tight leading-[1.15] max-w-3xl">
              One stop for{" "}
              <span className="bg-text-primary from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent block sm:inline">
                All your surgical & medical
              </span>{" "}
              Equipments
            </h1>

            <Text className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-paragraph leading-relaxed">
              Over 25 years of excellence supplying surgical & medical
              equipment to hospitals, clinics, and homes across Andhra
              Pradesh.
            </Text>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handlechange}
                className="w-full sm:w-auto bg-text-primary text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
              >
                Shop Now →
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full sm:w-auto border border-accent text-accent px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all duration-200 active:scale-[0.99]"
              >
                <FaWhatsapp size={18} />
                WhatsApp Us
              </button>
            </div>


          </div>

          {/* RIGHT CAROUSEL CARD */}
          <div className="relative group/carousel w-full max-w-[540px] lg:max-w-none mx-auto">
            {/* Ambient background glow behind the active image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-blue-500/5 rounded-[36px] blur-xl scale-105 pointer-events-none" />

            {/* Rounded, edge-to-edge floating layout */}
            <div
              className="relative overflow-hidden h-[300px] sm:h-[400px] xl:h-[420px] bg-transparent rounded-[32px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* SKELETON LOADING STATE */}
              {!mounted || loading ? (
                <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-[32px]" />
              ) : (
                <>
                  {/* Sliding Container Wrapper */}
                  <div
                    ref={trackRef}
                    className={`flex h-full ${
                      withTransition ? "transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" : ""
                    }`}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {slidesToRender.map((banner, index) => {
                      const isFallback = !banner?.image_url;
                      const imageSrc = banner?.image_url || "/surgimage.png";

                      return (
                        <div
                          key={banner?.id ? `${banner.id}-${index}` : index}
                          className="min-w-full h-full relative cursor-pointer overflow-hidden rounded-[32px]"
                          onClick={() => handleBannerClick(banner)}
                        >
                          <Image
                            src={imageSrc}
                             alt={banner?.title || "Surgical Equipment"}
                             fill
                             sizes="(min-width: 1536px) 540px, (min-width: 1024px) 45vw, 100vw"
                             loading={index === 0 || index === totalSlides ? "eager" : "lazy"}
                             unoptimized={isFallback}
                            className="object-contain pointer-events-none select-none rounded-[32px]"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* REAL-TIME NAV CONTROLS */}
                  {totalSlides > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/10 hover:bg-slate-950/20 text-slate-800 items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-10 active:scale-90"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/10 hover:bg-slate-950/20 text-slate-800 items-center justify-center transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-10 active:scale-90"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Pagination Indicator Dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-slate-900/5 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        {bannerList.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setWithTransition(true);
                              setCurrentSlide(index);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              activeDot === index ? "w-5 bg-slate-800" : "w-1.5 bg-slate-400"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Floating Call Button */}
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={handleWhatsApp}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-2 font-semibold hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}