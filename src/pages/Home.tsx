import React, { useState, useEffect } from 'react';
import { Product } from '../types/index.ts';
import { getProducts } from '../services/apiClient.ts';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  Globe2,
  Cpu,
  Layers,
  Award,
  Factory,
  Check
} from 'lucide-react';

interface HomeProps {
  navigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Customer Feedback Carousel state
  const testimonials = [
    {
      id: 1,
      quote:
        'ApexGarments has revolutionized our European supply chain. Being able to track every stage from fabric cutting to sewing live on the ERP eliminated lead-time surprises completely.',
      author: 'Clara Beaumont',
      role: 'Head of Global Sourcing',
      company: 'Nordic Vogue Group (Stockholm)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      rating: 5
    },
    {
      id: 2,
      quote:
        'The level of fabric yield efficiency and AQL 1.5 precision is unmatched. We imported over 120,000 units of denim last quarter with an unprecedented zero customer rejection rate.',
      author: 'David Van Houten',
      role: 'Director of Apparel Production',
      company: 'Urban Stitch Retail (London)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 5
    },
    {
      id: 3,
      quote:
        'For our high-turnaround fast fashion cycles, having instant manager approval and stage-by-stage QC updates gave us the confidence to commit to tight seasonal launch dates.',
      author: 'Aiko Tanaka',
      role: 'Senior Merchandising Lead',
      company: 'Kanto Apparel Co. (Tokyo)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Lead-Time Calculator state (Extra Section 2)
  const [calcCountry, setCalcCountry] = useState('United States');
  const [calcCategory, setCalcCategory] = useState('Shirt');
  const [calcQuantity, setCalcQuantity] = useState(500);

  useEffect(() => {
    document.title = 'ApexGarments - Garments Order & Production Tracker System';

    // Fetch 6 cards from backend or safe client store
    const fetchHomeProducts = async () => {
      try {
        const data = await getProducts({ showOnHome: true, limit: 6 });
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching home products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Lead time formula: base production + volume scaling + destination transit
  const calculateLeadTime = () => {
    let baseProductionDays = 14;
    if (calcCategory === 'Denim' || calcCategory === 'Jacket') baseProductionDays = 21;
    if (calcCategory === 'Accessories') baseProductionDays = 10;

    const volumeDays = Math.ceil(calcQuantity / 1000) * 3;

    let shippingDays = 18; // Sea freight US
    if (calcCountry === 'United Kingdom' || calcCountry === 'Germany') shippingDays = 14;
    if (calcCountry === 'Japan' || calcCountry === 'Singapore') shippingDays = 9;
    if (calcCountry === 'Australia') shippingDays = 16;

    return {
      productionDays: baseProductionDays + volumeDays,
      shippingDays,
      totalDays: baseProductionDays + volumeDays + shippingDays
    };
  };

  const leadTimes = calculateLeadTime();

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Smart Garment ERP & Sourcing Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Precision Apparel <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500">
                  Order & Production Tracking
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Empower small-to-enterprise garment factories with real-time floor monitoring. Track high-volume buyer orders across automated cutting, modular sewing, finishing lines, and worldwide logistics with zero friction.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/all-products')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/all-products')}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs transition-all cursor-pointer"
                >
                  Book a Product
                </button>

                <a
                  href="#how-it-works"
                  className="px-4 py-3.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                >
                  Explore Workflow ↓
                </a>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Real-Time Floor Tracking</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>AQL 1.5 Quality Assurance</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Transparent Buyer Portals</span>
                </div>
              </div>
            </div>

            {/* Right Media Display */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000"
                    alt="Garments Production Floor Assembly"
                    className="w-full h-[400px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Floating Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Batch #GF-8842 Status
                      </span>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                        Sewing Line B4
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full w-3/4 transition-all" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Completed: 3,450 / 4,600 pcs</span>
                      <span className="font-semibold text-emerald-600">75% On-Schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR PRODUCTS (6 cards from DB with limit) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-2">
              <Layers className="w-4 h-4" />
              <span>Catalog Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Export Garments
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              High-specification production lines ready for global buyer booking. Top 6 featured styles curated directly from factory inventory.
            </p>
          </div>

          <button
            onClick={() => navigate('/all-products')}
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors self-start md:self-auto group cursor-pointer"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="flex flex-col h-full rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide border border-slate-200/50 dark:border-slate-700/50">
                    {product.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2.5 py-1 rounded-md text-xs font-extrabold shadow-md">
                    ${product.price.toFixed(2)} / pc
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>Available: <strong className="text-slate-900 dark:text-slate-200">{(product.availableQuantity || 0).toLocaleString()}</strong> pcs</span>
                      <span>MOQ: <strong className="text-slate-900 dark:text-slate-200">{product.minimumOrderQuantity}</strong> pcs</span>
                    </div>

                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW IT WORKS (Step-by-Step Production Roadmap) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-4 h-4" />
            <span>Standardized Manufacturing Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ApexGarments Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            From technical spec intake to international container loading, follow the transparent 5-stage manufacturing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Order Specification',
              desc: 'Buyer submits tech packs, grading charts, and payment choices via portal.'
            },
            {
              step: '02',
              title: 'CAD & Cutting',
              desc: 'Automated fabric relaxation, digital CAD nesting, and CNC laser spreading.'
            },
            {
              step: '03',
              title: 'Sewing Assembly',
              desc: 'Modular line progression with real-time barcode tracking per bundle.'
            },
            {
              step: '04',
              title: 'AQL 1.5 Finishing',
              desc: 'Steam tunnel pressing, needle detection scans, and 4-point QC audit.'
            },
            {
              step: '05',
              title: 'Global Dispatch',
              desc: 'Carton barcode labeling, palletization, and direct port bill of lading.'
            }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-3xl font-extrabold text-indigo-600/30 dark:text-indigo-400/20 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stage {idx + 1} Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CUSTOMER FEEDBACK (Carousel) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide">
              <span>Verified Buyer Endorsements</span>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg sm:text-2xl font-medium leading-relaxed italic text-slate-100">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].author}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-400/50 shadow-lg"
              />
              <div>
                <h4 className="font-bold text-base text-white">
                  {testimonials[currentTestimonial].author}
                </h4>
                <p className="text-xs text-indigo-200 font-medium">
                  {testimonials[currentTestimonial].role} · {testimonials[currentTestimonial].company}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentTestimonial ? 'w-6 bg-indigo-400' : 'w-2 bg-white/30'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION 1: LIVE FACTORY FLOOR METRICS & COMPLIANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              <Factory className="w-4 h-4" />
              <span>Smart Factory Infrastructure</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real-Time Floor Metrics & Certified Global Standards
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              We operate state-of-the-art production floors in the Dhaka Export Processing Zone. Every operator terminal is connected to the centralized cloud database, assuring complete accountability and ethical compliance.
            </p>

            {/* Certifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['WRAP Gold', 'OEKO-TEX 100', 'ISO 9001:2015', 'Sedex SMETA'].map(cert => (
                <div
                  key={cert}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center space-y-1"
                >
                  <Award className="w-5 h-5 text-indigo-500 mx-auto" />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{cert}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">24,500</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Daily Garment Output (Pcs)</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">&lt; 0.28%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Defect Rate (AQL 1.5)</p>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-2">
              <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">99.2%</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">On-Time Shipment Dispatch</p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 space-y-2">
              <Globe2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">42+</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Global Export Destinations</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXTRA SECTION 2: GLOBAL EXPORT & INTERACTIVE LEAD-TIME CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Form */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                  <Globe2 className="w-4 h-4" />
                  <span>Freight & Production Estimator</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Interactive Sourcing Lead-Time Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select your destination port and order volume to calculate accurate production schedule and freight transit days.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination
                  </label>
                  <select
                    value={calcCountry}
                    onChange={e => setCalcCountry(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="United States">United States (NY / LA Port)</option>
                    <option value="United Kingdom">United Kingdom (Felixstowe)</option>
                    <option value="Germany">Germany (Hamburg Port)</option>
                    <option value="Japan">Japan (Yokohama Port)</option>
                    <option value="Australia">Australia (Sydney Port)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Apparel Category
                  </label>
                  <select
                    value={calcCategory}
                    onChange={e => setCalcCategory(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Shirt">Oxford Cotton Shirt</option>
                    <option value="Denim">Heavy Selvedge Denim</option>
                    <option value="Jacket">Technical Outerwear</option>
                    <option value="Knitwear">Loopback Knitwear</option>
                    <option value="Accessories">Canvas Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Order Quantity (Pcs)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={calcQuantity}
                    onChange={e => setCalcQuantity(Number(e.target.value))}
                    className="w-full text-xs font-medium px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Total Lead-Time</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {leadTimes.totalDays} Days
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Factory Manufacturing & QC:</span>
                  <strong className="font-semibold">{leadTimes.productionDays} Days</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Ocean/Air Freight to {calcCountry}:</span>
                  <strong className="font-semibold">{leadTimes.shippingDays} Days</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Customs & Clearances:</span>
                  <strong className="text-emerald-600 font-semibold">Included in SLA</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('/all-products')}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all text-center block cursor-pointer"
              >
                Proceed to Book Product
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
