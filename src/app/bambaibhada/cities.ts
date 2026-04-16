// ============================================================
// KIRAYA — City configs (Bangalore + Gurgaon)
// Mumbai data stays inline in page.tsx to avoid a massive refactor;
// this file adds the two new cities so we can ship pan-India.
// ============================================================

export type CityKey = "mumbai" | "bangalore" | "gurgaon";

export type Zone = "green" | "yellow" | "red";
export type Bhk = 1 | 2 | 3;

export interface Locality {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  r1: number; // 1BHK median rent (thousands/month)
  r2: number; // 2BHK
  r3: number; // 3BHK
  sc: [number, number, number, number, number, number]; // flood, commute, density, traffic, aqi, build
  rz: [string, string, string, string, string, string];
  flags: string[];
  com: Record<string, number>; // office commute times (minutes)
  tip: string;
}

export interface TrainLine {
  id: string;
  name: string;
  color: string;
  stations: [number, number][]; // [lng, lat]
}

export interface Office {
  key: string;
  name: string;
  short: string;
  lng: number;
  lat: number;
}

export interface CityConfig {
  key: CityKey;
  name: string;
  native: string; // Hindi/Kannada name
  center: [number, number];
  defaultZoom: number;
  localities: Locality[];
  trainLines: TrainLine[];
  offices: Office[];
  bounds: [[number, number], [number, number]]; // bbox for fitBounds / validation
}

// ============================================================
// BANGALORE — Namma Metro, IT hubs, garden-city pockets
// ============================================================
const BANGALORE_OFFICES: Office[] = [
  { key: "wf", name: "Whitefield / ITPL", short: "WF", lng: 77.7499, lat: 12.9698 },
  { key: "man", name: "Manyata Tech Park", short: "MAN", lng: 77.6175, lat: 13.0454 },
  { key: "kor", name: "Koramangala", short: "KOR", lng: 77.6272, lat: 12.9352 },
  { key: "ecity", name: "Electronic City", short: "EC", lng: 77.675, lat: 12.8449 },
  { key: "mg", name: "MG Road / UB City", short: "MG", lng: 77.6095, lat: 12.9716 },
  { key: "out", name: "Outer Ring Rd (Marathahalli)", short: "ORR", lng: 77.6989, lat: 12.9569 },
];

const BANGALORE_LINES: TrainLine[] = [
  {
    id: "purple",
    name: "Purple Line",
    color: "#A855F7",
    stations: [
      [77.5247, 12.9784], // Baiyappanahalli
      [77.5356, 12.9777], // Swami Vivekananda
      [77.542, 12.978], // Indiranagar
      [77.5626, 12.9799], // Halasuru
      [77.574, 12.9766], // Trinity
      [77.6097, 12.9757], // MG Road
      [77.593, 12.9764], // Cubbon Park
      [77.5946, 12.9778], // Vidhana Soudha
      [77.5714, 12.9767], // Sir M Visveshwaraya
      [77.5717, 12.9718], // Majestic
      [77.5684, 12.9643], // City Railway Station
      [77.558, 12.9595], // Magadi Road
      [77.5383, 12.957], // Hosahalli
      [77.527, 12.9472], // Vijayanagar
      [77.5072, 12.9432], // Attiguppe
      [77.493, 12.942], // Deepanjali Nagar
      [77.4835, 12.9327], // Mysore Road
    ],
  },
  {
    id: "green",
    name: "Green Line",
    color: "#4ADE80",
    stations: [
      [77.5075, 13.1094], // Nagasandra
      [77.5107, 13.101], // Dasarahalli
      [77.5159, 13.0878], // Jalahalli
      [77.5215, 13.0785], // Peenya Industry
      [77.5259, 13.0679], // Peenya
      [77.5307, 13.0592], // Yeshwantpur
      [77.5426, 13.0379], // Sandal Soap Factory
      [77.5505, 13.026], // Mahalakshmi
      [77.5575, 13.0159], // Rajajinagar
      [77.5617, 13.0068], // Kuvempu Road
      [77.5681, 13.0018], // Srirampura
      [77.5714, 12.9767], // Sampige / Majestic
      [77.5774, 12.9637], // Chickpete
      [77.5838, 12.9548], // KR Market
      [77.577, 12.9419], // National College
      [77.5722, 12.929], // Lalbagh
      [77.564, 12.9178], // South End
      [77.5586, 12.9083], // Jayanagar
      [77.5507, 12.8983], // RV Road
    ],
  },
  {
    id: "namma-pink",
    name: "Pink Line (u/c)",
    color: "#F472B6",
    stations: [
      [77.6272, 12.9352], // Koramangala
      [77.6106, 12.9395], // Jayadeva
      [77.5947, 12.932], // JP Nagar
      [77.6198, 12.9697], // Diary Circle
    ],
  },
];

const BANGALORE_LOCALITIES: Locality[] = [
  {
    id: "koramangala-5",
    name: "Koramangala 5th Block",
    area: "South East",
    lat: 12.9352,
    lng: 77.6272,
    r1: 30,
    r2: 50,
    r3: 80,
    sc: [9, 7, 6, 5, 6, 8],
    rz: [
      "High ground, drains fine",
      "Walking distance to Forum + Outer Ring Rd",
      "Hip but dense, Sony signal choke",
      "80ft Rd + Sony signal = peak hour pain",
      "Better than ORR average (~115)",
      "Mostly 2010s apartments, well-built",
    ],
    flags: ["it-adjacent", "hip", "nightlife"],
    com: { wf: 45, man: 35, kor: 2, ecity: 30, mg: 15, out: 25 },
    tip: "Where every Bangalore startup person lives. Rents reflect that.",
  },
  {
    id: "indiranagar",
    name: "Indiranagar",
    area: "East",
    lat: 12.9784,
    lng: 77.6408,
    r1: 32,
    r2: 55,
    r3: 88,
    sc: [8, 8, 6, 5, 6, 7],
    rz: [
      "Generally dry",
      "Metro Purple Line + ORR access",
      "12th Main is dense, inner lanes quieter",
      "100ft Rd pub-crowd 7-11pm",
      "Traffic exhaust along main rd (~120)",
      "Mix of old bungalows + new towers",
    ],
    flags: ["nightlife", "premium", "metro"],
    com: { wf: 40, man: 30, kor: 15, ecity: 45, mg: 12, out: 20 },
    tip: "Pub crawl + rent crawl. Linking Road of the south.",
  },
  {
    id: "hsr",
    name: "HSR Layout",
    area: "South East",
    lat: 12.9116,
    lng: 77.6474,
    r1: 28,
    r2: 48,
    r3: 78,
    sc: [8, 6, 7, 5, 6, 8],
    rz: [
      "Planned, decent drainage",
      "ORR access but no metro yet",
      "Sector-planned, wide roads",
      "27th Main + Silk Board jams",
      "ORR dust but trees help (~120)",
      "Mostly post-2010 construction",
    ],
    flags: ["planned", "it-hub", "young"],
    com: { wf: 40, man: 45, kor: 10, ecity: 20, mg: 25, out: 20 },
    tip: "Every second person is a startup founder. The water is SAFU though.",
  },
  {
    id: "whitefield",
    name: "Whitefield",
    area: "Far East",
    lat: 12.9698,
    lng: 77.7499,
    r1: 22,
    r2: 38,
    r3: 62,
    sc: [7, 5, 7, 4, 5, 8],
    rz: [
      "Mostly dry, Varthur lake overflow risk",
      "Metro Purple Line extension + ORR",
      "Gated townships dominate",
      "ITPL Main Rd + Varthur Rd jammed evenings",
      "Post-2000 industrial area, dust heavy",
      "Township construction boom",
    ],
    flags: ["it-hub", "gated", "family"],
    com: { wf: 5, man: 55, kor: 40, ecity: 60, mg: 50, out: 30 },
    tip: "Where the IT money goes home. Weekend traffic to anywhere else hurts.",
  },
  {
    id: "marathahalli",
    name: "Marathahalli",
    area: "East",
    lat: 12.9569,
    lng: 77.6989,
    r1: 20,
    r2: 35,
    r3: 55,
    sc: [7, 6, 5, 3, 5, 6],
    rz: [
      "Bridge area floods occasionally",
      "ORR central, bus hub",
      "Student/PG heavy, tight lanes",
      "Marathahalli Bridge is the national meme",
      "Heavy traffic exhaust (~135)",
      "Mix of old + 2000s buildings",
    ],
    flags: ["budget", "pg-heavy", "it-adjacent"],
    com: { wf: 15, man: 35, kor: 20, ecity: 35, mg: 25, out: 5 },
    tip: "Cheap, central, and you'll curse the bridge every single day.",
  },
  {
    id: "btm",
    name: "BTM Layout",
    area: "South",
    lat: 12.9166,
    lng: 77.6101,
    r1: 18,
    r2: 30,
    r3: 48,
    sc: [6, 7, 4, 3, 5, 5],
    rz: [
      "Water table high, some waterlogging",
      "Silk Board close, metro Pink u/c",
      "Dense, PG belt",
      "Silk Board is Silk Board",
      "High density exhaust (~130)",
      "Older stock, active redevelopment",
    ],
    flags: ["budget", "pg-heavy", "student"],
    com: { wf: 35, man: 40, kor: 10, ecity: 20, mg: 18, out: 25 },
    tip: "Student budget central. Also 'Silk Board jam' adjacent — know what you're signing up for.",
  },
  {
    id: "jayanagar",
    name: "Jayanagar",
    area: "South",
    lat: 12.9308,
    lng: 77.5838,
    r1: 25,
    r2: 42,
    r3: 68,
    sc: [8, 8, 7, 5, 7, 7],
    rz: [
      "Elevated, rarely floods",
      "Metro Green + RV Road hub",
      "Planned wide roads, parks everywhere",
      "4th Block evenings busy but manageable",
      "Tree cover helps (~100)",
      "Mostly 80s-00s well-maintained",
    ],
    flags: ["family", "planned", "tree-cover", "traditional"],
    com: { wf: 50, man: 40, kor: 20, ecity: 25, mg: 18, out: 35 },
    tip: "Old Bangalore living. Trees, temples, filter coffee. Your Amma would approve.",
  },
  {
    id: "jp-nagar",
    name: "JP Nagar",
    area: "South",
    lat: 12.9064,
    lng: 77.5854,
    r1: 22,
    r2: 38,
    r3: 60,
    sc: [8, 7, 7, 5, 7, 7],
    rz: [
      "Generally dry",
      "Metro Pink u/c, ORR close",
      "Planned phases, wide roads",
      "Bannerghatta Rd jams evenings",
      "Decent tree cover (~105)",
      "90s-2010s apartments",
    ],
    flags: ["family", "planned", "tree-cover"],
    com: { wf: 50, man: 45, kor: 20, ecity: 20, mg: 25, out: 30 },
    tip: "Jayanagar's younger cousin. Cheaper, similar vibe.",
  },
  {
    id: "malleshwaram",
    name: "Malleshwaram",
    area: "North Central",
    lat: 13.0037,
    lng: 77.5703,
    r1: 24,
    r2: 40,
    r3: 65,
    sc: [8, 8, 6, 5, 6, 6],
    rz: [
      "Rarely floods",
      "Metro Green Line walking distance",
      "Traditional Tamil-Brahmin belt, tight",
      "Sampige Rd jams during festivals",
      "Rankin Square area congested (~115)",
      "Mostly 70s-90s ground-plus-2",
    ],
    flags: ["traditional", "heritage", "metro"],
    com: { wf: 45, man: 20, kor: 25, ecity: 40, mg: 12, out: 30 },
    tip: "Where Bangalore's Tamil aunties buy filter coffee and judge the newcomers.",
  },
  {
    id: "basavanagudi",
    name: "Basavanagudi",
    area: "South",
    lat: 12.9416,
    lng: 77.5744,
    r1: 22,
    r2: 38,
    r3: 60,
    sc: [8, 7, 6, 4, 6, 6],
    rz: [
      "Elevated, rarely floods",
      "Metro Green close, core traffic",
      "Dense traditional Kannada belt",
      "Gandhi Bazaar + DVG Rd crawl",
      "Old city density (~115)",
      "Heritage + redev mix",
    ],
    flags: ["traditional", "heritage", "veg-dominant"],
    com: { wf: 50, man: 35, kor: 22, ecity: 25, mg: 15, out: 35 },
    tip: "Vidyarthi Bhavan dosas and 100-year-old houses. The soul of old Bangalore.",
  },
  {
    id: "hebbal",
    name: "Hebbal",
    area: "North",
    lat: 13.0359,
    lng: 77.5971,
    r1: 25,
    r2: 42,
    r3: 68,
    sc: [7, 8, 7, 4, 5, 8],
    rz: [
      "Hebbal Lake adjacent, edge risks",
      "Kempegowda Airport + Manyata + ORR",
      "Gated high-rises dominate",
      "Hebbal flyover + airport road bottleneck",
      "Airport-side dust + construction (~120)",
      "2010s+ glass towers",
    ],
    flags: ["airport-side", "premium", "new"],
    com: { wf: 55, man: 12, kor: 40, ecity: 60, mg: 30, out: 40 },
    tip: "Close to airport, close to Manyata, close to North Indian biryani. Flyover is the tax.",
  },
  {
    id: "electronic-city",
    name: "Electronic City",
    area: "Far South",
    lat: 12.8449,
    lng: 77.675,
    r1: 18,
    r2: 30,
    r3: 50,
    sc: [7, 4, 7, 4, 6, 7],
    rz: [
      "Mostly dry",
      "Namma Metro extension u/c",
      "Gated campuses + planned blocks",
      "Elevated expressway helps but Silk Board feeder chokes",
      "IT park dust + highway (~115)",
      "Mostly 2000s+ construction",
    ],
    flags: ["it-hub", "gated", "family"],
    com: { wf: 60, man: 65, kor: 30, ecity: 5, mg: 40, out: 45 },
    tip: "Infosys and Wipro made this. Live here if you work here. Otherwise don't.",
  },
];

// ============================================================
// GURGAON — DLF phases, Cyber City, Golf Course Road, Sohna
// ============================================================
const GURGAON_OFFICES: Office[] = [
  { key: "cy", name: "Cyber City / DLF", short: "CY", lng: 77.0886, lat: 28.4951 },
  { key: "udyog", name: "Udyog Vihar", short: "UV", lng: 77.0898, lat: 28.5039 },
  { key: "gc", name: "Golf Course Rd", short: "GC", lng: 77.0997, lat: 28.4614 },
  { key: "sector44", name: "Sector 44 IT", short: "S44", lng: 77.0825, lat: 28.4524 },
  { key: "airport", name: "IGI Airport", short: "DEL", lng: 77.0999, lat: 28.5562 },
  { key: "sohna", name: "Sohna Rd corridor", short: "SOH", lng: 77.0446, lat: 28.4148 },
];

const GURGAON_LINES: TrainLine[] = [
  {
    id: "rapid",
    name: "Rapid Metro",
    color: "#60A5FA",
    stations: [
      [77.0886, 28.4951], // DLF Cyber City
      [77.0922, 28.4902], // Belvedere Tower
      [77.0941, 28.4847], // Phase 2 (Moulsari)
      [77.0965, 28.48], // Phase 3
      [77.0976, 28.4757], // IndusInd Bank Sector 53-54
      [77.1005, 28.4711], // Sector 42-43
      [77.1037, 28.4651], // Sector 53-54 extended
      [77.1065, 28.459], // DLF Phase 1
    ],
  },
  {
    id: "yellow-gurgaon",
    name: "Yellow Line (Delhi Metro)",
    color: "#FBBF24",
    stations: [
      [77.1166, 28.4491], // Huda City Centre
      [77.1014, 28.4597], // MG Road
      [77.0987, 28.4822], // Sikanderpur
      [77.0886, 28.4951], // Gurugram / Cyber City adjacent
    ],
  },
];

const GURGAON_LOCALITIES: Locality[] = [
  {
    id: "dlf-phase-1",
    name: "DLF Phase 1",
    area: "Central",
    lat: 28.459,
    lng: 77.1065,
    r1: 35,
    r2: 55,
    r3: 85,
    sc: [7, 7, 8, 5, 3, 7],
    rz: [
      "Mostly dry, some subway dips",
      "Rapid Metro + MG Road adjacent",
      "Low-rise bungalows + pockets of highrise",
      "MG Road crawls evenings",
      "Delhi NCR AQI winter disaster (~180 avg, 300+ winter)",
      "90s-2000s + newer redev",
    ],
    flags: ["premium", "family", "established"],
    com: { cy: 8, udyog: 15, gc: 6, sector44: 15, airport: 25, sohna: 18 },
    tip: "Old-money Gurgaon. Leafy, expensive, and the AQI will age you 5 years per winter.",
  },
  {
    id: "dlf-phase-3",
    name: "DLF Phase 3",
    area: "North",
    lat: 28.4847,
    lng: 77.0941,
    r1: 32,
    r2: 52,
    r3: 82,
    sc: [7, 8, 8, 5, 3, 8],
    rz: [
      "Mostly dry",
      "Rapid Metro Phase 3 stop",
      "Gated colonies, wide roads",
      "Cyber Hub spillover evenings",
      "AQI bad (~175, 300+ winter)",
      "2000s construction, well-maintained",
    ],
    flags: ["premium", "corporate", "metro"],
    com: { cy: 5, udyog: 8, gc: 12, sector44: 22, airport: 22, sohna: 25 },
    tip: "Closest residential to Cyber Hub. You pay for that 5-minute commute.",
  },
  {
    id: "sushant-lok-1",
    name: "Sushant Lok 1",
    area: "Central",
    lat: 28.4685,
    lng: 77.089,
    r1: 28,
    r2: 45,
    r3: 72,
    sc: [7, 8, 7, 5, 3, 7],
    rz: [
      "Dry",
      "MG Road metro + Galleria hub",
      "Mix of bungalows + apartments",
      "Sohna Rd + MG signal chokes",
      "NCR winter haze (~180)",
      "Mid-90s + newer towers",
    ],
    flags: ["family", "metro", "markets"],
    com: { cy: 15, udyog: 18, gc: 8, sector44: 15, airport: 28, sohna: 18 },
    tip: "Galleria Market is the social center. Rent buys you walking distance to it.",
  },
  {
    id: "sector-43",
    name: "Sector 43",
    area: "South Central",
    lat: 28.4614,
    lng: 77.0997,
    r1: 28,
    r2: 45,
    r3: 72,
    sc: [7, 8, 7, 4, 3, 7],
    rz: [
      "Dry",
      "Rapid Metro + Golf Course Rd",
      "High-rise apartments dominate",
      "Golf Course Rd jams 6-10pm",
      "NCR haze + traffic (~185)",
      "Mostly 2000s+ towers",
    ],
    flags: ["premium", "metro", "highrise"],
    com: { cy: 18, udyog: 22, gc: 5, sector44: 8, airport: 30, sohna: 20 },
    tip: "The Golf Course Rd premium. Nice towers, brutal road.",
  },
  {
    id: "sector-54",
    name: "Sector 54",
    area: "South Central",
    lat: 28.4524,
    lng: 77.0988,
    r1: 30,
    r2: 48,
    r3: 78,
    sc: [7, 8, 8, 4, 3, 8],
    rz: [
      "Dry",
      "Rapid Metro + Sector 53-54 station",
      "High-rise towers with amenities",
      "Golf Course Rd + Sikanderpur access chokes",
      "NCR winter AQI (~185)",
      "2010s+ premium towers",
    ],
    flags: ["premium", "metro", "young-professional"],
    com: { cy: 20, udyog: 25, gc: 3, sector44: 5, airport: 32, sohna: 15 },
    tip: "Tower life with a view. The Uber ride to Cyber Hub is your daily ritual.",
  },
  {
    id: "golf-course-ext",
    name: "Golf Course Extension Rd",
    area: "South",
    lat: 28.4148,
    lng: 77.0726,
    r1: 25,
    r2: 42,
    r3: 68,
    sc: [7, 6, 8, 4, 3, 9],
    rz: [
      "New development, decent drainage",
      "No metro yet, long cab rides",
      "Gated townships, wide roads",
      "Golf Course Ext is one-way-in",
      "NCR haze + construction dust (~190)",
      "2015+ new construction",
    ],
    flags: ["new", "gated", "premium"],
    com: { cy: 30, udyog: 35, gc: 18, sector44: 25, airport: 45, sohna: 8 },
    tip: "Newest premium Gurgaon. Your towers are shinier, your commute is longer.",
  },
  {
    id: "sohna-road",
    name: "Sohna Road",
    area: "South",
    lat: 28.4148,
    lng: 77.0446,
    r1: 22,
    r2: 38,
    r3: 62,
    sc: [6, 5, 8, 3, 3, 8],
    rz: [
      "Some flooding risk near new sectors",
      "No metro, only cabs and buses",
      "Gated townships, some still under construction",
      "Sohna Rd + Badshahpur jam evenings",
      "Construction dust + NCR (~200)",
      "Mostly 2010s+ new construction",
    ],
    flags: ["new", "gated", "budget-premium"],
    com: { cy: 35, udyog: 38, gc: 25, sector44: 30, airport: 50, sohna: 3 },
    tip: "Where the new Gurgaon money lives. Traffic is the entry fee.",
  },
  {
    id: "palam-vihar",
    name: "Palam Vihar",
    area: "North West",
    lat: 28.503,
    lng: 77.0287,
    r1: 22,
    r2: 38,
    r3: 60,
    sc: [7, 7, 7, 5, 3, 7],
    rz: [
      "Generally dry",
      "Dwarka Expressway + airport close",
      "Mix of plots + apartments",
      "Old Gurgaon Rd + Dwarka Exp jams",
      "Airport side industrial dust (~185)",
      "90s-2010s mixed stock",
    ],
    flags: ["family", "airport-side", "established"],
    com: { cy: 20, udyog: 18, gc: 30, sector44: 35, airport: 12, sohna: 40 },
    tip: "Old-school Gurgaon family belt. Cheaper than DLF, same AQI.",
  },
  {
    id: "sector-14",
    name: "Sector 14",
    area: "North",
    lat: 28.4706,
    lng: 77.0432,
    r1: 20,
    r2: 33,
    r3: 55,
    sc: [6, 7, 5, 3, 3, 5],
    rz: [
      "Low-lying, some waterlogging",
      "Railway Rd + bus hub",
      "Old Gurgaon chaos, tight lanes",
      "Railway Rd + market areas jammed",
      "Core chaos + NCR haze (~190)",
      "Old stock, slow redevelopment",
    ],
    flags: ["old-gurgaon", "budget", "central"],
    com: { cy: 20, udyog: 15, gc: 22, sector44: 28, airport: 22, sohna: 25 },
    tip: "The original Gurgaon. Before it got all DLF-ed. Cheaper, messier, more alive.",
  },
  {
    id: "sector-56",
    name: "Sector 56",
    area: "South",
    lat: 28.4355,
    lng: 77.0998,
    r1: 23,
    r2: 38,
    r3: 60,
    sc: [7, 7, 7, 4, 3, 8],
    rz: [
      "Dry",
      "Near Rapid Metro ext + Golf Course Rd",
      "Gated highrises",
      "Golf Course Rd bottleneck",
      "NCR haze (~185)",
      "Mostly 2010s towers",
    ],
    flags: ["family", "gated", "metro-close"],
    com: { cy: 22, udyog: 25, gc: 8, sector44: 15, airport: 35, sohna: 15 },
    tip: "Quieter tower life, walkable to Rapid Metro. Good value vs Sector 43.",
  },
];

// ============================================================
// REGISTRY
// ============================================================
export const CITIES_DATA: Record<Exclude<CityKey, "mumbai">, Omit<CityConfig, "key">> = {
  bangalore: {
    name: "Bangalore",
    native: "ಬೆಂಗಳೂರು",
    center: [77.5946, 12.9716],
    defaultZoom: 11,
    localities: BANGALORE_LOCALITIES,
    trainLines: BANGALORE_LINES,
    offices: BANGALORE_OFFICES,
    bounds: [
      [77.45, 12.82],
      [77.79, 13.15],
    ],
  },
  gurgaon: {
    name: "Gurgaon",
    native: "गुरुग्राम",
    center: [77.0266, 28.4595],
    defaultZoom: 11.5,
    localities: GURGAON_LOCALITIES,
    trainLines: GURGAON_LINES,
    offices: GURGAON_OFFICES,
    bounds: [
      [76.93, 28.32],
      [77.2, 28.6],
    ],
  },
};

// Mumbai config metadata (data stays in page.tsx to avoid massive refactor)
export const MUMBAI_META = {
  name: "Mumbai",
  native: "मुंबई",
  center: [72.87, 19.07] as [number, number],
  defaultZoom: 10.4,
  bounds: [
    [72.75, 18.85],
    [73.08, 19.3],
  ] as [[number, number], [number, number]],
};
