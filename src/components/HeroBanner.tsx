import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Heart, ArrowRight, Shield, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, HeroBannerContent } from '../types';
import { translations } from '../utils/translations';
import { supabase } from '../lib/supabase';

interface HeroBannerProps {
  language: Language;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ language }) => {
  const [slides, setSlides] = useState<HeroBannerContent[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const t = (key: string) => translations[key]?.[language] || key;

  useEffect(() => {
    fetchBannerContent();
  }, [language]);

  useEffect(() => {
    if (isAutoPlaying && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, slides.length]);

  const fetchBannerContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_banner_content')
        .select('*')
        .order('updated_at', { ascending: false }); // Order to ensure consistent slide order

      if (error) throw error;

      if (data) {
        setSlides(data);
      }
    } catch (err) {
      console.error('Error fetching banner content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load banner content');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <p className="text-white text-xl">Loading banner content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-gradient-to-br from-red-600 to-red-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <p className="text-white text-xl">Error: {error}</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden min-h-[50vh] flex items-center justify-center">
        <p className="text-white text-xl">No banner content available.</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  // Determine gradient based on slide index or a property if added to DB
  const gradients = [
    'from-pink-600 via-purple-700 to-indigo-800',
    'from-purple-600 via-pink-700 to-rose-800',
    'from-rose-600 via-pink-700 to-purple-800'
  ];
  const currentGradient = gradients[currentSlide % gradients.length];

  const getLocalizedText = (data: HeroBannerContent, key: 'title' | 'subtitle' | 'description' | 'button_text') => {
    if (language === 'ar') return data[`${key}_ar`];
    if (language === 'tr') return data[`${key}_tr`];
    return data[`${key}_en`];
  };

  return (
    <div className={`relative bg-gradient-to-br ${currentGradient} dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden transition-colors duration-300`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-300 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-white rounded-full animate-bounce delay-500"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        
        {/* Decorative Icons */}
        <div className="absolute top-16 left-16 animate-float">
          <Sparkles size={28} className="text-yellow-300 opacity-80" />
        </div>
        <div className="absolute top-32 right-24 animate-float delay-300">
          <Star size={24} className="text-pink-300 opacity-70" />
        </div>
        <div className="absolute bottom-40 left-24 animate-float delay-700">
          <Heart size={22} className="text-red-300 opacity-80" />
        </div>
        <div className="absolute bottom-24 right-16 animate-float delay-500">
          <Award size={26} className="text-yellow-300 opacity-70" />
        </div>
      </div>

      {/* Slide Navigation */}
      {slides.length > 1 && (
        <>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-xs font-medium shadow-lg">
              <Shield className="mr-2" size={16} />
              Premium Quality Guaranteed
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {getLocalizedText(currentSlideData, 'title')}
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                  {getLocalizedText(currentSlideData, 'subtitle')}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-pink-100 max-w-2xl leading-relaxed">
                {getLocalizedText(currentSlideData, 'description')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center lg:justify-start">
              <button className="group bg-white text-pink-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-3 w-full sm:w-auto">
                <span>{getLocalizedText(currentSlideData, 'button_text')}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center space-x-3 text-pink-100">
                <Truck size={20} />
                <span className="font-medium">{t('freeShipping')}</span>
              </div>
              <div className="flex items-center space-x-3 text-pink-100">
                <Shield size={20} />
                <span className="font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3 text-pink-100">
                <Award size={20} />
                <span className="font-medium">Premium Quality</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            {/* Main Product Image */}
            <div className="relative z-10 group">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src={currentSlideData.image_url}
                  alt={getLocalizedText(currentSlideData, 'title')}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;
