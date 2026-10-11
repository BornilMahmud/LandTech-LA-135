import { TourismDestination } from '../types';

export const BANGLADESH_DESTINATIONS: TourismDestination[] = [
  {
    id: 'dest-cxb',
    nameEn: "Cox's Bazar",
    nameBn: 'কক্সবাজার',
    district: "Cox's Bazar",
    division: 'Chittagong',
    lat: 21.4272,
    lng: 92.0058,
    taglineEn: "World's Longest Natural Unbroken Sea Beach (120 km)",
    taglineBn: 'বিশ্বের দীর্ঘতম অবিচ্ছিন্ন বালুকাময় প্রাকৃতিক সমুদ্র সৈকত (১২০ কিমি)',
    overviewEn: "Stretching along the Bay of Bengal, Cox's Bazar is Bangladesh's flagship coastal paradise. It features scenic cliffs along Marine Drive, rolling golden surf, Himchari waterfalls, and coral reefs near Saint Martin's Island.",
    overviewBn: "বঙ্গোপসাগরের তীরবর্তী কক্সবাজার বাংলাদেশের প্রধান পর্যটন নগরী। ৮০ কিলোমিটার দীর্ঘ দৃষ্টিনন্দন মেরিন ড্রাইভ, হিমছড়ি ঝরনা, ইনানী পাথুরে সৈকত এবং সেন্টমার্টিন প্রবাল দ্বীপের প্রবেশদ্বার।",
    attractions: [
      {
        nameEn: 'Kolatoli & Laboni Beach Promenade',
        nameBn: 'কলাতলী ও লাবণী বিচ পয়েন্ট',
        type: 'Beach & Sunset',
        descriptionEn: 'The cultural center of the beach, famous for sunset views, beach cycling, and fresh seafood street markets.',
        descriptionBn: 'সূর্যাস্ত দর্শন, বিচ সাইক্লিং ও সামুদ্রিক খাবারের জন্য সবচেয়ে জনপ্রিয় সৈকত পয়েন্ট।'
      },
      {
        nameEn: 'Inani Coral Stone Beach',
        nameBn: 'ইনানী পাথুরে সৈকত',
        type: 'Geological Beach',
        descriptionEn: 'Quiet beach with sharp natural coral rocks and turquoise waters, located 32km south on Marine Drive.',
        descriptionBn: 'মেরিন ড্রাইভের ৩২ কিমি দক্ষিণে শান্ত প্রাকৃতিক প্রবাল পাথর ও নীল পানির অপরূপ সৈকত।'
      },
      {
        nameEn: 'Himchari National Park & Broken Hills',
        nameBn: 'হিমছড়ি জাতীয় উদ্যান ও পাহাড়ি ঝরনা',
        type: 'Eco-Park & Hills',
        descriptionEn: 'Lush evergreen hills meeting the sea, home to scenic canopy staircases, seasonal cascades, and birdwatching.',
        descriptionBn: 'পাহাড় ও সমুদ্রের মিলনস্থল, সিঁড়ি বেয়ে চূড়ায় উঠলে পুরো বঙ্গোপসাগরের দিগন্ত দেখা যায়।'
      },
      {
        nameEn: 'Ramu Buddhist Monasteries',
        nameBn: 'রামু বৌদ্ধ মন্দির ও জাদিপাড়া',
        type: 'Heritage & Culture',
        descriptionEn: 'Historic village featuring 100-foot reclining bronze Buddha statues and wood-carved pagodas.',
        descriptionBn: 'ঐতিহাসিক কাঠের কারুকাজখচিত প্যাগোডা ও ১০০ ফুট দীর্ঘ সিংহশয্যা বুদ্ধ মূর্তি।'
      }
    ],
    practicalInfo: {
      bestSeasonEn: 'November to March (Dry, mild breeze, calm waters)',
      bestSeasonBn: 'নভেম্বর থেকে মার্চ (শুষ্ক ও মনোরম আবহাওয়া, শান্ত সমুদ্র)',
      suggestedDurationEn: 'Suggested: 3 Days / 2 Nights',
      suggestedDurationBn: 'পরামর্শ: ৩ দিন / ২ রাত',
      howToReachEn: 'Direct flights from Dhaka (DAC to CXB, ~55 mins), direct Cox\'s Bazar Express trains, or AC highway buses (8-10 hrs).',
      howToReachBn: 'ঢাকা থেকে সরাসরি বিমান (৫৫ মিনিট), কক্সবাজার এক্সপ্রেস ট্রেন অথবা এসি বাস (৮-১০ ঘণ্টা)।',
      guidanceNoticeEn: 'Travelers are advised to observe lifeguard flag warnings during monsoon swells and book beach resorts in advance for winter peaks.',
      guidanceNoticeBn: 'বর্ষায় জোয়ারের সময় লাইফগার্ডের সংকেত মেনে চলুন এবং শীতকালীন মৌসুমে হোটেল আগে বুক করুন।'
    },
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    dataSources: ['Bangladesh Tourism Board', 'Forest Department', 'Civil Aviation Authority'],
    limitationsNoticeEn: 'Seasonal sea condition guidance is indicative; always verify coast guard tidal alerts.',
    limitationsNoticeBn: 'আবহাওয়া তথ্য নির্দেশনামূলক; ভ্রমণের পূর্বে স্থানীয় কোস্টগার্ড সতর্কবার্তা যাচাই করুন।'
  },
  {
    id: 'dest-syl',
    nameEn: 'Sylhet & Sreemangal',
    nameBn: 'সিলেট ও শ্রীমঙ্গল',
    district: 'Moulvibazar / Sylhet',
    division: 'Sylhet',
    lat: 24.3065,
    lng: 91.7315,
    taglineEn: 'The Tea Capital & Freshwater Swamp Forest',
    taglineBn: 'চায়ের রাজধানী ও মিঠাপানির সোয়াম্প ফরেস্ট',
    overviewEn: "Endless emerald tea estates, crystal mountain streams, sacred Sufi shrines, and the mystical Ratargul freshwater swamp forest make Sylhet division an idyllic haven for ecotourism and heritage lovers.",
    overviewBn: "সবুজ চা বাগান, পাহাড়ের স্বচ্ছ নদী, সুফি দরগাহ এবং রহস্যময় রাতারগুল সোয়াম্প ফরেস্টের সমাহার। প্রকৃতির সান্নিধ্য ও আধ্যাত্মিক ঐতিহ্যের তীর্থস্থান।",
    attractions: [
      {
        nameEn: 'Lawachara National Park & Rainforest',
        nameBn: 'লাউয়াছড়া জাতীয় উদ্যান',
        type: 'Tropical Rainforest',
        descriptionEn: 'Biodiverse sanctuary home to the endangered Western Hoolock Gibbons, giant barking deer, and century-old mahogany trees.',
        descriptionBn: 'বিলুপ্তপ্রায় উলুক গিবন ও বিরল প্রজাতির বন্যপ্রাণীর প্রাকৃতিক আবাসস্থল।'
      },
      {
        nameEn: 'Ratargul Freshwater Swamp Forest',
        nameBn: 'রাতারগুল সোয়াম্প ফরেস্ট',
        type: 'Freshwater Wetland',
        descriptionEn: 'One of the few freshwater swamp forests in South Asia, navigable by traditional wooden country boats under submerged trees.',
        descriptionBn: 'দক্ষিণ এশিয়ার অন্যতম মিঠাপানির জলমগ্ন বন, যেখানে নৌকায় বনের ভেতর ঘোরার রোমাঞ্চ পাওয়া যায়।'
      },
      {
        nameEn: 'Jaflong & Zero Point Stone Valley',
        nameBn: 'জাফলং ও জিরো পয়েন্ট',
        type: 'River & Mountain Border',
        descriptionEn: 'Piyain River flowing beneath the Meghalaya mountains, known for stone collection and Khasia indigenous settlements.',
        descriptionBn: 'মেঘালয় পাহাড়ের পাদদেশে পিয়াইন নদীর স্বচ্ছ পানি ও খাসিয়া পল্লী।'
      },
      {
        nameEn: 'Baikka Beel Wetland Bird Sanctuary',
        nameBn: 'বাইক্কা বিল পরিযায়ী পাখি অভয়ারণ্য',
        type: 'Wetland & Birding',
        descriptionEn: 'Protected marshland hosting hundreds of thousands of migratory waterfowl each winter.',
        descriptionBn: 'শীতকালে লক্ষাধিক পরিযায়ী পাখির কলকাকলিতে মুখরিত জীববৈচিত্র্যপূর্ণ জলাভূমি।'
      }
    ],
    practicalInfo: {
      bestSeasonEn: 'September to March for birding and hiking; July-August for lush green monsoon tea flush',
      bestSeasonBn: 'সেপ্টেম্বর থেকে মার্চ মনোরম আবহাওয়া; জুলাই-আগস্টে বর্ষায় চা বাগানের সতেজ রূপ',
      suggestedDurationEn: 'Suggested: 3 Days / 2 Nights',
      suggestedDurationBn: 'পরামর্শ: ৩ দিন / ২ রাত',
      howToReachEn: 'Direct Parabat/Upaban Express trains from Dhaka, Osmani International Airport flights (ZYL), or Dhaka-Sylhet highway.',
      howToReachBn: 'ঢাকা থেকে পারাবত/উপবন ট্রেন, সরাসরি ফ্লাইট অথবা ঢাকা-সিলেট মহাসড়ক হয়ে এসি বাস।'
    ,
      guidanceNoticeEn: 'Maintain absolute silence in Lawachara and Ratargul to avoid stressing wildlife; carry mosquito repellent.',
      guidanceNoticeBn: 'লাউয়াছড়া ও রাতারগুলে বন্যপ্রাণীর শান্তি বজায় রাখতে উচ্চশব্দ পরিহার করুন।'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    dataSources: ['Bangladesh Forest Department', 'Sylhet District Administration', 'Tourism Police'],
    limitationsNoticeEn: 'Swamp forest boat operations subject to water levels in dry winter months.',
    limitationsNoticeBn: 'শীতের শেষে শুকনা মৌসুমে রাতারগুলে পানির গভীরতা অনুযায়ী নৌকা চলাচল পরিবর্তিত হয়।'
  },
  {
    id: 'dest-ban',
    nameEn: 'Bandarban',
    nameBn: 'বান্দরবান',
    district: 'Bandarban',
    division: 'Chittagong',
    lat: 22.1953,
    lng: 92.2184,
    taglineEn: 'The Land of Cloud Ridges & Towering Peaks',
    taglineBn: 'মেঘের রাজ্য ও সর্বোচ্চ পাহাড়ি চূড়ার দেশ',
    overviewEn: "Towering high into the clouds, Bandarban represents the highest mountain peaks in Bangladesh (Tahjindong, Keokradong). Filled with cascading waterfalls (Nafakhum, Amiakhum), crystal Boga Lake, and vibrant indigenous culture.",
    overviewBn: "বাংলাদেশের সর্বোচ্চ পর্বতমালা (কেওক্রাডং, তাজিংডং), মেঘে ঢাকা নীলগিরি চূড়া, নাফাকুম ঝরনা ও বগা লেকের স্বর্গীয় সৌন্দর্য ও পাহাড়ি জাতিগোষ্ঠীর সংস্কৃতি।",
    attractions: [
      {
        nameEn: 'Nilgiri Hill Resort & Cloud Peak',
        nameBn: 'নীলগিরি হিল চূড়া ও মেঘের দেশ',
        type: 'High Elevation Viewpoint',
        descriptionEn: 'Perched 2,400 feet above sea level, offering 360-degree views where morning clouds drift through the cottages.',
        descriptionBn: 'সমুদ্রপৃষ্ঠ থেকে প্রায় ২৪০০ ফুট উঁচুতে মেঘের উপর দাঁড়িয়ে থাকার অনুভূতি।'
      },
      {
        nameEn: 'Boga Lake (Mystic Volcano Lake)',
        nameBn: 'বগা লেক',
        type: 'Crater Lake',
        descriptionEn: 'High mountain freshwater lake enveloped in folklore, surrounded by Bawm tribal hamlets.',
        descriptionBn: 'উঁচু পাহাড়ে অবস্থিত গভীর প্রাকৃতিক হ্রদ ও বম পাহাড়িদের ঐতিহ্যবাহী জনপদ।'
      },
      {
        nameEn: 'Golden Temple (Buddha Dhatu Jadi)',
        nameBn: 'বুদ্ধ ধাতু জাদি (স্বর্ণ মন্দির)',
        type: 'Spiritual Pagoda',
        descriptionEn: 'The largest Theravada Buddhist temple in Bangladesh, crowning a high hilltop overlooking Bandarban town.',
        descriptionBn: 'পাহাড়ের চূড়ায় অবস্থিত বাংলাদেশের বৃহত্তম থেরবাদী বৌদ্ধ মন্দির।'
      },
      {
        nameEn: 'Nafakhum & Remakri Falls Trek',
        nameBn: 'নাফাকুম জলপ্রপাত ও রেমাক্রি',
        type: 'Waterfall Trekking',
        descriptionEn: 'Spectacular river cascade on Sangu river tributaries, reached by river engine boat and jungle trek.',
        descriptionBn: 'সাঙ্গু নদী ধরে ইঞ্জিনের নৌকায় গিয়ে রেমাক্রি ও নাফাকুম জলপ্রপাতের রোমাঞ্চকর ট্রেইল।'
      }
    ],
    practicalInfo: {
      bestSeasonEn: 'October to February for clear blue skies and trekking; August to October for full waterfall torrents',
      bestSeasonBn: 'অক্টোবর থেকে ফেব্রুয়ারি ট্রেকিংয়ের জন্য শ্রেষ্ঠ; আগস্ট-অক্টোবরে ঝরনার পূর্ণ রূপ',
      suggestedDurationEn: 'Suggested: 3 to 4 Days',
      suggestedDurationBn: 'পরামর্শ: ৩ থেকে ৪ দিন',
      howToReachEn: 'AC bus to Chittagong, then local transport to Bandarban town; Chander Gari (4WD jeeps) required for hilly regions.',
      howToReachBn: 'চট্টগ্রাম হয়ে বাসে বান্দরবান শহর, এরপর পাহাড়ি রুটে স্থানীয় চান্দের গাড়ি (ফোর-হুইল ড্রাইভ)।',
      guidanceNoticeEn: 'Foreign travelers require district administration clearance. Certified local tribal guides are mandatory for deep treks.',
      guidanceNoticeBn: 'দূরবর্তী পাহাড়ি এলাকায় গাইড সাথে রাখা আবশ্যক এবং নিরাপত্তা চেকপোস্টে নিবন্ধন করুন।'
    },
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    dataSources: ['Bandarban District Administration', 'Hill District Council', 'Tour Operators Association'],
    limitationsNoticeEn: 'Remote trail accessibility varies by weather conditions and local security guidelines.',
    limitationsNoticeBn: 'আবহাওয়া ও স্থানীয় প্রশাসনের নির্দেশনার ওপর নির্ভর করে নির্দিষ্ট রুটে প্রবেশাধিকার নিয়ন্ত্রিত হতে পারে।'
  },
  {
    id: 'dest-sjk',
    nameEn: 'Sajek Valley',
    nameBn: 'সাজেক ভ্যালি',
    district: 'Rangamati',
    division: 'Chittagong',
    lat: 23.3820,
    lng: 92.2938,
    taglineEn: 'The Queen of Hills & Sea of White Clouds',
    taglineBn: 'পাহাড়ের রানী ও মেঘের মহাসমুদ্র',
    overviewEn: "Located in the northern reaches of the Chittagong Hill Tracts bordering Mizoram, Sajek Valley features high ridges with wooden cottages nestled directly inside floating morning mist.",
    overviewBn: "রাঙ্গামাটির বাঘাইছড়িতে অবস্থিত সাজেক ভ্যালি বাংলাদেশের অন্যতম জনপ্রিয় মেঘ উপত্যকা। কংলাক পাহাড় থেকে দেখা যায় মেঘের উথালপাতাল ঢেউ।",
    attractions: [
      {
        nameEn: 'Konglak Para (Highest Peak in Sajek)',
        nameBn: 'কংলাক পাড়া (সাজেকের সর্বোচ্চ চূড়া)',
        type: 'Hilltop Village',
        descriptionEn: 'The traditional Lushei indigenous village perched on the apex summit of the valley ridge.',
        descriptionBn: 'লুসাই জাতিগোষ্ঠীর মনোরম গ্রাম এবং সাজেকের সবচেয়ে উঁচুতে অবস্থিত ভিউপয়েন্ট।'
      },
      {
        nameEn: 'Ruilui Para Cultural Street',
        nameBn: 'রুইলুই পাড়া',
        type: 'Village & Viewpoints',
        descriptionEn: 'The vibrant heart of Sajek with boutique wooden eco-cottages, hillside coffee shops, and sunset viewpoints.',
        descriptionBn: 'সাজেকের প্রধান কেন্দ্র যেখানে আকর্ষণীয় কাঠের কটেজ ও পাহাড়ি খাবারের দোকান রয়েছে।'
      },
      {
        nameEn: 'Helipad Sunset Point',
        nameBn: 'হ্যালিপ্যাড সূর্যাস্ত পয়েন্ট',
        type: 'Panoramic Sunset',
        descriptionEn: 'Unobstructed 360-degree perspective over the misty valleys during twilight.',
        descriptionBn: 'গোধূলিবেলায় মেঘ ও পাহাড়ের ওপর সূর্যাস্তের অসাধারণ দৃশ্য।'
      }
    ],
    practicalInfo: {
      bestSeasonEn: 'September to February (Magnificent cloud seas and chilly stargazing nights)',
      bestSeasonBn: 'সেপ্টেম্বর থেকে ফেব্রুয়ারি (সকালে ঘন মেঘের সমুদ্র ও রাতে তারার মেলা)',
      suggestedDurationEn: 'Suggested: 2 Days / 1 Night',
      suggestedDurationBn: 'পরামর্শ: ২ দিন / ১ রাত',
      howToReachEn: 'Khagrachhari by highway bus, then official security convoy by Chander Gari (jeep) departing Dighinala twice daily.',
      howToReachBn: 'খাগড়াছড়ি হয়ে দীঘিনালা থেকে প্রতিদিন সকাল ও দুপুরে সেনা এসকর্টে চান্দের গাড়িতে যাত্রা।',
      guidanceNoticeEn: 'Travelers must arrive before convoy departure times at Dighinala (typically 10:00 AM and 2:00 PM).',
      guidanceNoticeBn: 'দীঘিনালা থেকে নিরাপত্তা কনভয়ের নির্দিষ্ট সময়ে (সকাল ১০টা ও দুপুর ২টা) পৌঁছাতে হবে।'
    },
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    dataSources: ['Sajek Resort Owners Association', 'Bangladesh Army Escort Guidance', 'Chittagong Hill Tracts Board'],
    limitationsNoticeEn: 'Convey timings are strictly enforced; pre-booking accommodation is essential.',
    limitationsNoticeBn: 'কনভয়ের সময় কঠোরভাবে অনুসৃত হয়; পূর্ব বুকিং ছাড়া যাত্রা না করার পরামর্শ দেওয়া হচ্ছে।'
  },
  {
    id: 'dest-sun',
    nameEn: 'Sundarbans & Bagerhat',
    nameBn: 'সুন্দরবন ও বাগেরহাট',
    district: 'Khulna / Bagerhat',
    division: 'Khulna',
    lat: 21.9497,
    lng: 89.1833,
    taglineEn: "World's Largest Mangrove Forest & UNESCO World Heritage",
    taglineBn: 'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন ও ইউনেস্কো বিশ্ব ঐতিহ্য',
    overviewEn: "Spanning across southern Bangladesh, the Sundarbans is a UNESCO World Heritage site and the legendary home of the Royal Bengal Tiger, spotted deer, estuarine crocodiles, and labyrinthine tidal waterways.",
    overviewBn: "বঙ্গোপসাগরের মুখে অবস্থিত ইউনেস্কো ঘোষিত পৃথিবীর বৃহত্তম ম্যানগ্রোভ বনভূমি। রয়েল বেঙ্গল টাইগার, চিত্রা হরিণ, লোনাপানির কুমির ও ৬০০ বছরের প্রাচীন ষাট গম্বুজ মসজিদের দেশ।",
    attractions: [
      {
        nameEn: 'Kotka Wildlife Sanctuary & Tiger Point',
        nameBn: 'কটকা অভয়ারণ্য ও টাইগার পয়েন্ট',
        type: 'Wild Sanctuary & Watchtower',
        descriptionEn: 'Observation tower overlooking sprawling grasslands frequented by deer herds and majestic royal tigers.',
        descriptionBn: 'চিত্রা হরিণের দল ও বাঘের চলাচলের পথ দেখার জন্য বনের বিখ্যাত পর্যবেক্ষণ টাওয়ার।'
      },
      {
        nameEn: 'Karamjal Eco-Park & Crocodile Breeding Center',
        nameBn: 'করমজল ইকো-ট্যুরিজম কেন্দ্র',
        type: 'Eco Conservation',
        descriptionEn: 'Entry gateway featuring wooden elevated trails through the dense mangrove canopy and estuarine reptile nursery.',
        descriptionBn: 'কাঠের ট্রেইল বেয়ে ম্যানগ্রোভ অরণ্য দর্শন ও বিলুপ্তপ্রায় প্রজাতির কুমির প্রজনন কেন্দ্র।'
      },
      {
        nameEn: 'Historic Sixty Dome Mosque (Bagerhat)',
        nameBn: 'ঐতিহাসিক ষাট গম্বুজ মসজিদ',
        type: 'UNESCO Medieval Architecture',
        descriptionEn: '15th-century terracotta architectural masterpiece founded by Saint Khan Jahan Ali, featuring 77 curved domes and 60 stone pillars.',
        descriptionBn: '১৫ শতকে হযরত খান জাহান আলী (রহ.) নির্মিত ঐতিহাসিক পোড়ামাটির মসজিদ ও প্রত্নতত্ত্ব।'
      }
    ],
    practicalInfo: {
      bestSeasonEn: 'November to February (Calm river currents, pleasant breeze, active wildlife)',
      bestSeasonBn: 'নভেম্বর থেকে ফেব্রুয়ারি (শান্ত নদী, আরামদায়ক আবহাওয়া ও বন্যপ্রাণী দর্শনের সেরা সময়)',
      suggestedDurationEn: 'Suggested: 3 Days / 2 Nights Liveaboard Cruise',
      suggestedDurationBn: 'পরামর্শ: ৩ দিন / ২ রাত (জাহাজে ভ্রমণ)',
      howToReachEn: 'Train or bus to Khulna / Mongla Port, then embarkation onto authorized tourism vessels.',
      howToReachBn: 'ঢাকা থেকে খুলনা বা মোংলা বন্দর, সেখান থেকে অনুমোদিত পর্যটন জাহাজে বা ক্রুজে বোর্ডিং।',
      guidanceNoticeEn: 'All forest entries require armed forest guards provided by the Forest Department. Do not litter single-use plastics.',
      guidanceNoticeBn: 'বনে প্রবেশের সময় বন বিভাগের সশস্ত্র গার্ডের উপস্থিতি আবশ্যক। প্লাস্টিক বর্জ্য ফেলা কঠোরভাবে নিষিদ্ধ।'
    },
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    dataSources: ['Bangladesh Forest Department Sundarbans Division', 'UNESCO World Heritage Center'],
    limitationsNoticeEn: 'Tidal variations affect boat disembarkation timings at jungle creeks.',
    limitationsNoticeBn: 'জোয়ার-ভাটার ওপর নির্ভর করে বিভিন্ন খালে নৌকা প্রবেশের সময় নির্ধারিত হয়।'
  }
];
