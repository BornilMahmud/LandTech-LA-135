import { Compass, Heart, Shield, Globe2 } from 'lucide-react';

interface FooterProps {
  isBn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isBn }) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass size={18} />
            </div>
            <div>
              <span className="font-heading font-black text-white text-base">
                LandTech<span className="text-emerald-400">LA-135</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {isBn ? "বাংলাদেশ ইন্টারেক্টিভ জিআইএস ও ভূমি গোয়েন্দা ব্যবস্থা" : "Bangladesh Geospatial & Cadastral Intelligence Platform"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-500">
              Data extracted from <strong className="text-slate-300">AI_DEV_FEST080</strong>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">64 Districts & 8 Divisions</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} LandTech-LA-135. Licensed under MIT. Built for AI Hackathon & Next-Gen Spatial Exploration.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span>Powered by Authentic Bangladesh Vector Atlas & SVG GeoEngine</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
