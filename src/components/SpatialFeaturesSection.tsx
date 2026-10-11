import React from 'react';
import { Layers, ShieldCheck, Cpu, Waves, Sparkles, Compass, CheckCircle } from 'lucide-react';

interface SpatialFeaturesSectionProps {
  isBn: boolean;
}

export const SpatialFeaturesSection: React.FC<SpatialFeaturesSectionProps> = ({ isBn }) => {
  const features = [
    {
      icon: <Compass className="w-6 h-6 text-emerald-400" />,
      title: isBn ? "৬৪ জেলার অরিজিনাল ভেক্টর মানচিত্র" : "Authentic 64-District Vector GIS",
      desc: isBn
        ? "বাংলাদেশ সার্ভে অফিশিয়াল জিওকোঅর্ডিনেটসের ওপর ভিত্তি করে নিখুঁত পলিগন ও কেন্দ্রবিন্দু মানচিত্র।"
        : "Pixel-accurate SVG polygon geometry and centroid mapping based on official Survey of Bangladesh spatial boundaries.",
    },
    {
      icon: <Layers className="w-6 h-6 text-sky-400" />,
      title: isBn ? "ক্যাডাস্ট্রাল বাউন্ডারি ও দাগ খতিয়ান" : "Cadastral Boundary & Mutation",
      desc: isBn
        ? "সিএস, এসএ, আরএস এবং বিআরএস রেকর্ডের সাথে ডিজিটাল মিউটেশন ও মালিকানার ধারাবাহিক ইতিহাস।"
        : "Instant correlation with CS, SA, RS, and modern BRS digital cadastre with automated title deed provenance tracking.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-amber-400" />,
      title: isBn ? "এআই চালিত ভূমি মূল্য পূর্বাভাস" : "AI Valuation & GDV Forecasting",
      desc: isBn
        ? "মহাসড়ক, মেট্রোরেল, অর্থনৈতিক অঞ্চল এবং বন্দর অবকাঠামোর ওপর ভিত্তি করে জমি মূল্যের স্বয়ংক্রিয় মূল্যায়ন।"
        : "Predictive econometric modeling forecasting gross development value (GDV) against transit corridors and SEZ expansions.",
    },
    {
      icon: <Waves className="w-6 h-6 text-teal-400" />,
      title: isBn ? "বন্যা, জলবায়ু ও উচ্চতা সিমুলেশন" : "Hydrological & Flood Risk Matrix",
      desc: isBn
        ? "নদী অববাহিকা, জলবায়ু সহনশীলতা ও ডিজিটাল এলিভেশন মডেল (DEM) বিশ্লেষণ করে ঝুঁকিমুক্ত প্লট চিহ্নিতকরণ।"
        : "Digital Elevation Modeling (DEM) cross-referenced with 50-year monsoon flood plains to de-risk real estate development.",
    },
  ];

  return (
    <section id="features" className="w-full py-16 border-t border-slate-800 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            {isBn ? "প্রযুক্তি ও স্থাপত্য" : "Spatial Engine & Architecture"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
            {isBn ? "ল্যান্ডটেক এলএ-১৩৫ এর মূল শক্তিসমূহ" : "Next-Gen PropTech Spatial Stack"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isBn
              ? "বাংলাদেশের ভূমি ব্যবস্থাপনা ও উন্নয়নকে গতিশীল করতে আধুনিক ভৌগোলিক তথ্য ব্যবস্থা (GIS) ও কৃত্রিম বুদ্ধিমত্তা।"
              : "Consolidating fragmented land records into an interactive, high-speed spatial operating system."}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
