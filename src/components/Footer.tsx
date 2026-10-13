import React from 'react';
import { ShieldCheck, Scale, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  isBn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isBn }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-xs text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={18} />
              </div>
              <span className="font-heading font-black text-slate-900 dark:text-white text-base tracking-tight">
                LandWise<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'বাংলাদেশের জমি ক্রেতা, পরিবার ও প্রবাসীদের জন্য কৃত্রিম বুদ্ধিমত্তা চালিত ভূমি দলিল ও স্বত্বলিপি অডিট সহকারী। বায়না করার পূর্বে দলিল, আরএস খতিয়ান, ই-নামজারি ও দাখিলার অসঙ্গতি শনাক্ত করুন।'
                : 'An AI-assisted, client-side pre-purchase due-diligence platform helping prospective land buyers cross-examine deeds, khatians, mutations, and environmental hazards before paying.'}
            </p>

            <div className="text-[11px] text-slate-600 dark:text-slate-300">
              {isBn ? '৬৪ জেলা • ৮ প্রশাসনিক বিভাগ • শতভাগ অফলাইন ডিটারমিনিস্টিক ইঞ্জিন' : '64 Districts • 8 Administrative Divisions • Client-Side Deterministic Engine'}
            </div>
          </div>

          {/* Official Government Data Sources (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {isBn ? 'সরকারি তথ্যসূত্র ও সেবা সংযোগ' : 'Grounded Government Portals'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li>
                <a
                  href="https://bhumipedia.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <span>Bhumipedia (আইন ও বিধিমালা)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://map.settlement.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <span>DLRS Map Portal (মৌজা ম্যাপ সংগ্রহ)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://map.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <span>Smart Bhumi Naksha (জাতীয় ভূমি জোনিং)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://eporcha.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <span>ePorcha (ডিজিটাল রেকর্ড রুম)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://mutation.land.gov.bd/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-500 transition-colors flex items-center gap-1"
                >
                  <span>e-Mutation (ই-নামজারি সেবা)</span>
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>

          {/* Ethical AI & Legal Safeguards (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
              <Scale size={13} className="text-amber-500" />
              <span>{isBn ? 'দায়মুক্তি ও সততা' : 'Legal Integrity'}</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'ল্যান্ডওয়াইজ এআই কোনো আনুষ্ঠানিক স্বত্ব প্রত্যয়নপত্র নয়। কোনো লেনদেনের পূর্বে অবশ্যই সাব-রেজিস্ট্রি অফিস তল্লাশি ও বিজ্ঞ আইনজীবীর সহায়তা নিন।'
                : 'LandWise AI does not issue certified title warranties or legal opinions. Always retain a qualified Advocate before executing contracts.'}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-300">
          <p>
            © {new Date().getFullYear()} LandWise AI. Built for Bangladesh Land Due-Diligence & Citizen Protection.
          </p>
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Client-Side Privacy Preserving • Zero Data Stored on Remote Servers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
