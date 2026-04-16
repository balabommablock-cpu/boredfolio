"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getSupabase, BB_TABLE, dbToDrop, dropToDb, DbDrop } from "./supabase";
import { CITIES_DATA, MUMBAI_META, CityKey } from "./cities";

// ============================================================
// CITY REGISTRY — keyed metadata only; Mumbai's full locality data
// stays inline in this file to avoid a massive refactor.
// ============================================================
const CITY_REGISTRY: Record<
  CityKey,
  {
    name: string;
    native: string;
    center: [number, number];
    zoom: number;
    bounds: [[number, number], [number, number]];
    critical: { label: string; line: string };
  }
> = {
  mumbai: {
    name: "Mumbai",
    native: "मुंबई",
    center: MUMBAI_META.center,
    zoom: MUMBAI_META.defaultZoom,
    bounds: MUMBAI_META.bounds,
    critical: {
      label: "DISCRIMINATION ENGINE",
      line: "Will they let you live here? Bachelor bans, veg-only, cosmo-society filter — honest.",
    },
  },
  bangalore: {
    name: "Bangalore",
    native: "ಬೆಂಗಳೂರು",
    center: CITIES_DATA.bangalore.center,
    zoom: CITIES_DATA.bangalore.defaultZoom,
    bounds: CITIES_DATA.bangalore.bounds,
    critical: {
      label: "WATER CRISIS",
      line: "Is there water? 6,900 borewells dried up. 10-month deposits. Cauvery vs tanker roulette.",
    },
  },
  gurgaon: {
    name: "Gurgaon",
    native: "गुरुग्राम",
    center: CITIES_DATA.gurgaon.center,
    zoom: CITIES_DATA.gurgaon.defaultZoom,
    bounds: CITIES_DATA.gurgaon.bounds,
    critical: {
      label: "INFRASTRUCTURE FRAUD",
      line: "Will the city actually work? 51-hour power cuts. Waterlogging on Golf Course Rd. Tanker mafia.",
    },
  },
};

const CITY_ORDER: CityKey[] = ["mumbai", "bangalore", "gurgaon"];

// ============================================================
// DARK PREMIUM TOKENS — standalone identity
// ============================================================
const T = {
  bg: "#0B0F14",
  bg2: "#0F1419",
  surface: "rgba(255,255,255,0.04)",
  surfaceHi: "rgba(255,255,255,0.08)",
  surfaceHover: "rgba(255,255,255,0.12)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(255,255,255,0.18)",
  text: "#E8EDF2",
  textDim: "rgba(232,237,242,0.65)",
  textFaint: "rgba(232,237,242,0.38)",
  accent: "#D4A843",
  accentDim: "rgba(212,168,67,0.18)",
  accentGlow: "rgba(212,168,67,0.35)",
  green: "#4ADE80",
  greenDim: "rgba(74,222,128,0.18)",
  yellow: "#FBBF24",
  yellowDim: "rgba(251,191,36,0.18)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.18)",
  blue: "#60A5FA",
  blueDim: "rgba(96,165,250,0.2)",
};

const Sf = "'Playfair Display', serif";
const Bf = "'DM Sans', sans-serif";
const Mf = "'JetBrains Mono', monospace";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";

// ============================================================
// TYPES
// ============================================================
type Zone = "green" | "yellow" | "red";
type Bhk = 1 | 2 | 3;
type BhkFilter = 0 | 1 | 2 | 3;
type OfficeKey = "bkc" | "lp" | "nm" | "se" | "pw" | "ar" | "gr";

interface Locality {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  r1: number;
  r2: number;
  r3: number;
  sc: [number, number, number, number, number, number];
  rz: [string, string, string, string, string, string];
  flags: string[];
  com: Record<string, number>;
  tip: string;
}

interface Pin {
  id: string;
  locId: string;
  locName: string;
  lat: number;
  lng: number;
  bhk: Bhk;
  rent: number;
  furnished: boolean;
  notes?: string;
  source: "seed" | "user" | "real";
  ts?: number;
  zone: Zone;
  // Metadata carried through when the pin comes from a real Reddit scrape
  // (see scripts/ingest-rentals.mjs). All optional — seed/user pins leave
  // these blank.
  title?: string;
  message?: string;
  handle?: string;
  subreddit?: string;
  author?: string;
  sourceUrl?: string;
  createdAt?: number;
  role?: string;
}

// User-dropped pins — either a LISTING (owner has a place)
// or a REQUEST (renter needs one).
// The product is intentionally a free-text message, like posting in a
// WhatsApp group. We parse BHK / amount / handle out of the message for
// filters and pin labels, but the source of truth is the message itself.
type DropKind = "listing" | "request";
interface UserDrop {
  id: string;
  kind: DropKind;
  lat: number;
  lng: number;
  message: string;
  // Auto-parsed from message
  bhk?: 0 | 1 | 2 | 3;
  amount?: number; // ₹ thousands/month
  radiusKm?: number;
  instagram?: string;
  telegram?: string;
  twitter?: string;
  ts: number;
}

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Weather {
  temperature: number;
  weathercode: number;
  isRaining: boolean;
  summary: string;
}

// ============================================================
// MUMBAI TRAIN & METRO LINES — simplified from known station coords
// Used to animate live-looking trains moving along them
// ============================================================
interface TrainLine {
  id: string;
  name: string;
  color: string;
  stations: [number, number][]; // [lng, lat]
}

const TRAIN_LINES: TrainLine[] = [
  {
    id: "western",
    name: "Western Line",
    color: "#60A5FA",
    stations: [
      [72.827, 18.9321], // Churchgate
      [72.8241, 18.9435], // Marine Lines
      [72.8194, 18.9513], // Charni Rd
      [72.8158, 18.9636], // Grant Rd
      [72.8198, 18.9692], // Mumbai Central
      [72.8229, 18.9826], // Mahalaxmi
      [72.8386, 18.9966], // Lower Parel
      [72.8447, 19.0174], // Dadar
      [72.8437, 19.028], // Matunga Rd
      [72.8402, 19.0411], // Mahim
      [72.8403, 19.0544], // Bandra
      [72.8393, 19.0704], // Khar Rd
      [72.8406, 19.0816], // Santacruz
      [72.8464, 19.099], // Vile Parle
      [72.8479, 19.119], // Andheri
      [72.8494, 19.1354], // Jogeshwari
      [72.8493, 19.1628], // Goregaon
      [72.8481, 19.1864], // Malad
      [72.8515, 19.2035], // Kandivali
      [72.8575, 19.2289], // Borivali
      [72.8616, 19.2517], // Dahisar
    ],
  },
  {
    id: "central",
    name: "Central Line",
    color: "#F87171",
    stations: [
      [72.8355, 18.94], // CSMT
      [72.8378, 18.9493], // Masjid
      [72.8383, 18.9549], // Sandhurst
      [72.833, 18.9761], // Byculla
      [72.8299, 18.9869], // Chinchpokli
      [72.8322, 18.9936], // Currey Rd
      [72.8392, 19.0001], // Parel
      [72.8443, 19.0182], // Dadar
      [72.8498, 19.0272], // Matunga
      [72.8628, 19.0389], // Sion
      [72.8793, 19.065], // Kurla
      [72.8962, 19.0803], // Vidyavihar
      [72.9087, 19.0867], // Ghatkopar
      [72.9181, 19.107], // Vikhroli
      [72.9323, 19.1262], // Kanjurmarg
      [72.9406, 19.1421], // Bhandup
      [72.9458, 19.1553], // Nahur
      [72.9565, 19.1729], // Mulund
      [72.9754, 19.1876], // Thane
    ],
  },
  {
    id: "harbour",
    name: "Harbour Line",
    color: "#4ADE80",
    stations: [
      [72.8355, 18.94], // CSMT
      [72.8378, 18.9493], // Masjid
      [72.8434, 18.9615], // Dockyard
      [72.8458, 18.9716], // Reay Rd
      [72.8476, 18.979], // Cotton Green
      [72.8567, 18.9886], // Sewri
      [72.8648, 19.0178], // Wadala
      [72.8816, 19.0497], // Chunabhatti
      [72.888, 19.0652], // Kurla
      [72.8997, 19.0621], // Chembur
      [72.9126, 19.055], // Govandi
      [72.93, 19.0485], // Mankhurd
      [72.9986, 19.077], // Vashi
      [72.9979, 19.0629], // Sanpada
      [73.0193, 19.0331], // Nerul
      [73.0369, 19.0207], // Belapur
      [73.1175, 18.9894], // Panvel
    ],
  },
  {
    id: "metro1",
    name: "Metro 1",
    color: "#A855F7",
    stations: [
      [72.8213, 19.1311], // Versova
      [72.833, 19.129], // D N Nagar
      [72.8386, 19.1292], // Azad Nagar
      [72.8466, 19.119], // Andheri
      [72.8563, 19.1158], // Western Express
      [72.8608, 19.1117], // Chakala
      [72.8685, 19.1075], // Airport Rd
      [72.8795, 19.1086], // Marol Naka
      [72.8877, 19.1037], // Saki Naka
      [72.8892, 19.0928], // Asalpha
      [72.9017, 19.091], // Jagruti Nagar
      [72.9087, 19.0867], // Ghatkopar
    ],
  },
];

interface TrainState {
  id: string;
  lineId: string;
  t: number;
  speed: number;
  direction: 1 | -1;
  color: string;
}

// Interpolate [lng, lat] position along line given t in [0, 1]
function interpolateOnLine(coords: [number, number][], t: number): [number, number] {
  if (coords.length < 2) return coords[0] || [0, 0];
  const n = coords.length - 1;
  const clamped = Math.max(0, Math.min(1, t));
  const pos = clamped * n;
  const idx = Math.min(n - 1, Math.floor(pos));
  const frac = pos - idx;
  const [x1, y1] = coords[idx];
  const [x2, y2] = coords[idx + 1];
  return [x1 + (x2 - x1) * frac, y1 + (y2 - y1) * frac];
}

function spawnTrains(lines: TrainLine[]): TrainState[] {
  const trains: TrainState[] = [];
  lines.forEach((line) => {
    // 2-3 trains per line, alternating directions
    const count = line.stations.length < 8 ? 2 : 3;
    for (let i = 0; i < count; i++) {
      trains.push({
        id: `${line.id}-${i}`,
        lineId: line.id,
        t: i / count,
        speed: 0.016 + (i % 2) * 0.004,
        direction: i % 2 === 0 ? 1 : -1,
        color: line.color,
      });
    }
  });
  return trains;
}

function trainLinesToGeoJSON(lines: TrainLine[]) {
  return {
    type: "FeatureCollection" as const,
    features: lines.map((line) => ({
      type: "Feature" as const,
      geometry: { type: "LineString" as const, coordinates: line.stations },
      properties: { id: line.id, name: line.name, color: line.color },
    })),
  };
}

// ============================================================
// OFFICES
// ============================================================
const OFFICES: { key: OfficeKey; name: string; short: string; lng: number; lat: number }[] = [
  { key: "bkc", name: "BKC", short: "BKC", lng: 72.8697, lat: 19.0669 },
  { key: "lp", name: "Lower Parel", short: "LP", lng: 72.83, lat: 19.0006 },
  { key: "nm", name: "Nariman Point", short: "NM", lng: 72.8238, lat: 18.925 },
  { key: "se", name: "SEEPZ Andheri E", short: "SE", lng: 72.8725, lat: 19.1369 },
  { key: "pw", name: "Powai Hiranandani", short: "PW", lng: 72.9073, lat: 19.1197 },
  { key: "ar", name: "Airoli", short: "AR", lng: 72.9989, lat: 19.1468 },
  { key: "gr", name: "Goregaon IBC", short: "GR", lng: 72.8553, lat: 19.165 },
];

// ============================================================
// AXES
// ============================================================
const AXES: { i: number; label: string; short: string; hint: string }[] = [
  { i: 0, label: "Flood Risk", short: "FL", hint: "Higher = drier. Monsoon waterlogging." },
  { i: 1, label: "Commute", short: "CM", hint: "Higher = better. Local + road access." },
  { i: 2, label: "Density", short: "DN", hint: "Higher = breathing room." },
  { i: 3, label: "Traffic", short: "TR", hint: "Higher = quieter." },
  { i: 4, label: "Air Quality", short: "AQ", hint: "Higher = cleaner." },
  { i: 5, label: "Buildings", short: "BL", hint: "Higher = safer." },
];

// ============================================================
// MUMBAI LOCALITIES — 25 manually scored
// ============================================================
const LOCALITIES: Locality[] = [
  {
    id: "marine-drive", name: "Marine Drive", area: "South", lat: 18.943, lng: 72.8238,
    r1: 65, r2: 110, r3: 180, sc: [9, 9, 8, 6, 6, 4],
    rz: ["Elevated promenade — never waterlogged", "Churchgate 5 min walk, Nariman Pt 10 min", "Low-density, wide roads, Art Deco", "Marine Drive flows; internal lanes crawl", "Sea breeze helps; SoBo smog hurts (~140)", "Heritage cessed buildings, redev frozen"],
    flags: ["sea", "premium", "heritage"],
    com: { bkc: 35, lp: 15, nm: 8, se: 60, pw: 70, ar: 85, gr: 55 },
    tip: "You're paying for the view and the Art Deco. Plumbing is from 1947.",
  },
  {
    id: "colaba", name: "Colaba", area: "South", lat: 18.9067, lng: 72.8147,
    r1: 55, r2: 95, r3: 160, sc: [8, 9, 7, 5, 6, 4],
    rz: ["High ground, minor flooding near Sassoon Dock", "Causeway bus hub, Churchgate 10 min", "Old bungalows + narrow Causeway lanes", "Causeway is a pedestrian + taxi pileup", "Sea air offset by cruise terminal diesel", "Pre-war stock, many cessed"],
    flags: ["sea", "heritage", "nightlife"],
    com: { bkc: 40, lp: 20, nm: 5, se: 65, pw: 75, ar: 90, gr: 60 },
    tip: "Living museum. Your plumber needs an archaeology degree.",
  },
  {
    id: "lower-parel", name: "Lower Parel", area: "South", lat: 19.0006, lng: 72.83,
    r1: 55, r2: 95, r3: 160, sc: [6, 10, 4, 3, 5, 9],
    rz: ["Worli Naka & Elphinstone dip in peak monsoon", "Every line meets here", "Mill-land towers stacked tight", "Senapati Bapat Marg chokes 6-10pm", "Construction dust + BKC spillover (~160)", "Mostly post-2010 glass towers"],
    flags: ["office-hub", "new-construction"],
    com: { bkc: 25, lp: 5, nm: 18, se: 45, pw: 50, ar: 70, gr: 35 },
    tip: "Commuter heaven, weekend hell.",
  },
  {
    id: "worli", name: "Worli", area: "South", lat: 19.0176, lng: 72.8161,
    r1: 75, r2: 130, r3: 220, sc: [8, 9, 7, 5, 7, 8],
    rz: ["Sea Link side stays dry; Worli Naka pockets don't", "Sea Link to BKC in 8 min off-peak", "Tower heavy but with actual setbacks", "Annie Besant Road jams 7-10pm", "Best-in-SoBo air, Sea Link breeze (~120)", "Mostly post-2005 towers"],
    flags: ["sea", "premium"],
    com: { bkc: 22, lp: 10, nm: 20, se: 50, pw: 55, ar: 75, gr: 40 },
    tip: "Sea Link adjacent. Rent reflects the two-minute head start to BKC.",
  },
  {
    id: "mahalaxmi", name: "Mahalaxmi", area: "South", lat: 18.9819, lng: 72.8201,
    r1: 70, r2: 115, r3: 190, sc: [7, 10, 8, 5, 6, 7],
    rz: ["Racecourse side clear; Dhobi Ghat edge dips", "Western Line + Mono + BKC 18 min", "Hippodrome open space pulls density down", "Tulsi Pipe Road jams during races", "Racecourse air + Haji Ali exhaust", "Old premium + new glass towers"],
    flags: ["sea", "premium", "open-space"],
    com: { bkc: 20, lp: 8, nm: 15, se: 48, pw: 52, ar: 72, gr: 38 },
    tip: "Open-space premium. One of SoBo's last breathing spots.",
  },
  {
    id: "dadar-west", name: "Dadar West", area: "South", lat: 19.0176, lng: 72.8447,
    r1: 45, r2: 75, r3: 120, sc: [6, 10, 3, 3, 5, 5],
    rz: ["Hindu Colony okay; Kabutar Khana lanes dip", "Central + Western interchange", "Among the densest in Asia", "Ranade Road + Flower Market = chokehold", "Train-adjacent dust, non-stop (~150)", "Pre-war + redev towers"],
    flags: ["central", "heritage"],
    com: { bkc: 20, lp: 15, nm: 25, se: 40, pw: 45, ar: 60, gr: 30 },
    tip: "Everything is 5 minutes away. So are 4 million other people.",
  },
  {
    id: "matunga", name: "Matunga", area: "South", lat: 19.027, lng: 72.857,
    r1: 40, r2: 70, r3: 110, sc: [6, 10, 6, 4, 5, 6],
    rz: ["Five Gardens stays dry; King's Circle side doesn't", "Central Line + walk to Dadar", "Tree-lined South Indian belt", "Khodadad Circle jams, rest calm", "Better than Dadar (~140)", "1920s-40s buildings, mid-redev"],
    flags: ["veg-dominant", "heritage", "tree-cover"],
    com: { bkc: 18, lp: 18, nm: 30, se: 38, pw: 42, ar: 55, gr: 30 },
    tip: "Filter coffee and concrete bungalows. Quiet sister of Dadar.",
  },
  {
    id: "sion", name: "Sion", area: "Central", lat: 19.0407, lng: 72.8623,
    r1: 35, r2: 60, r3: 90, sc: [1, 9, 4, 3, 4, 5],
    rz: ["Sion Circle is the iconic July flood headline", "Central + Harbour lines, BKC east door", "Dharavi next door, no buffer", "Sion-Panvel + LBS Marg jammed all day", "Heavy diesel traffic (~170)", "Mix of redev + 50-yr colonies"],
    flags: ["flood-prone", "slum-adjacent"],
    com: { bkc: 15, lp: 25, nm: 40, se: 35, pw: 35, ar: 50, gr: 35 },
    tip: "Close to BKC, close to Dharavi, closer to the flood line.",
  },
  {
    id: "kurla", name: "Kurla", area: "Central", lat: 19.0726, lng: 72.8845,
    r1: 28, r2: 48, r3: 72, sc: [2, 9, 2, 2, 4, 4],
    rz: ["Mithi River overflows — 2005, 2017, 2021, repeat", "Central + Harbour hub, LTT terminus", "Densest central suburb pocket", "LBS Marg + SCLR jam 7am-midnight", "Kamani industrial dust (~180)", "Old chawls + redev towers"],
    flags: ["flood-prone", "slum-adjacent"],
    com: { bkc: 10, lp: 30, nm: 45, se: 25, pw: 25, ar: 40, gr: 35 },
    tip: "10 min from BKC. And from waist-deep water.",
  },
  {
    id: "bkc", name: "BKC", area: "Central", lat: 19.0669, lng: 72.8697,
    r1: 95, r2: 165, r3: 260, sc: [5, 10, 9, 4, 5, 10],
    rz: ["Low-lying, parts dip", "Feeder buses + taxi, between stations", "Commercial; residential is spacious", "Exit-ramp chaos 9am + 7pm", "BKC glass-box microclimate (~155)", "All post-2008 glass & steel"],
    flags: ["office-hub", "premium", "new-construction"],
    com: { bkc: 5, lp: 20, nm: 35, se: 25, pw: 30, ar: 45, gr: 25 },
    tip: "You're basically renting a conference room with a kitchen.",
  },
  {
    id: "bandra-west", name: "Bandra West", area: "Western", lat: 19.0596, lng: 72.8295,
    r1: 55, r2: 95, r3: 165, sc: [7, 9, 6, 5, 6, 7],
    rz: ["Bandstand dry; Bazaar Road & Hill Rd dip", "Western + BKC 10 min + Sea Link", "Pali Hill has space; Hill Road doesn't", "Linking + Hill Road permanently jammed", "Coastal breeze offsets exhaust (~130)", "Old Parsi bungalows + new towers"],
    flags: ["sea", "premium", "nightlife"],
    com: { bkc: 12, lp: 25, nm: 40, se: 30, pw: 35, ar: 50, gr: 22 },
    tip: "Rent pays for the pincode, not the square footage.",
  },
  {
    id: "khar-west", name: "Khar West", area: "Western", lat: 19.07, lng: 72.834,
    r1: 52, r2: 90, r3: 150, sc: [7, 9, 6, 5, 6, 7],
    rz: ["Dry; 10th Rd & back lanes dip", "Khar Road stn + Bandra 2 min", "Residential, wider roads than Bandra", "Linking Rd spillover, SV Rd jams", "Slightly cleaner than Bandra (~125)", "Mix of 80s + glass redev"],
    flags: ["premium"],
    com: { bkc: 15, lp: 28, nm: 42, se: 28, pw: 38, ar: 52, gr: 20 },
    tip: "Bandra's cheaper sibling. Still costs a kidney.",
  },
  {
    id: "santacruz-west", name: "Santacruz West", area: "Western", lat: 19.081, lng: 72.839,
    r1: 48, r2: 82, r3: 135, sc: [7, 9, 7, 5, 6, 7],
    rz: ["Mostly dry, Milan Subway is the exception", "Western Line + domestic airport 10 min", "Quieter than Khar, Parsi colonies", "SV Road chokes during school hours", "Decent for western suburbs (~130)", "Older stock, slow redev"],
    flags: ["airport-adjacent"],
    com: { bkc: 18, lp: 30, nm: 45, se: 22, pw: 35, ar: 50, gr: 18 },
    tip: "Domestic airport next door. Your ola drivers will love you.",
  },
  {
    id: "andheri-west", name: "Andheri West", area: "Western", lat: 19.1369, lng: 72.8269,
    r1: 42, r2: 70, r3: 110, sc: [3, 10, 3, 3, 4, 6],
    rz: ["Andheri subway flooding is a yearly ritual", "Western + Metro 1 hub + airport", "Dense, especially near Lokhandwala", "Veera Desai + JP Rd = gridlock", "Airport flight path + traffic (~165)", "80s + Lokhandwala redev"],
    flags: ["flood-prone", "airport-adjacent", "metro"],
    com: { bkc: 25, lp: 35, nm: 55, se: 15, pw: 25, ar: 40, gr: 10 },
    tip: "Metro, malls, and a subway that swims every July.",
  },
  {
    id: "andheri-east", name: "Andheri East", area: "Western", lat: 19.119, lng: 72.8472,
    r1: 38, r2: 65, r3: 95, sc: [4, 9, 3, 3, 3, 6],
    rz: ["Chakala dips; Marol & Saki Naka hit hard", "SEEPZ + Metro 1 + Intl Airport", "MIDC + chawl belt density", "WEH + Saki Naka junction = national joke", "Airport fumes + MIDC industrial", "Chawls, MHADA + scattered towers"],
    flags: ["flood-prone", "airport-adjacent", "metro"],
    com: { bkc: 20, lp: 40, nm: 60, se: 10, pw: 20, ar: 35, gr: 15 },
    tip: "Airport noise is free. Everything else will cost you.",
  },
  {
    id: "goregaon-west", name: "Goregaon West", area: "Western", lat: 19.1646, lng: 72.8493,
    r1: 35, r2: 60, r3: 90, sc: [5, 8, 5, 5, 5, 6],
    rz: ["Mostly holds up; Aarey border soft", "Western Line + IBC walkable", "Aarey brings real green", "Link Rd + SV Rd jam, manageable rest", "Aarey helps, WEH hurts (~135)", "80s + IBC-era towers"],
    flags: ["metro", "green-adjacent"],
    com: { bkc: 30, lp: 40, nm: 60, se: 20, pw: 30, ar: 45, gr: 5 },
    tip: "Work at IBC? This is it. Everyone else pays for the commute.",
  },
  {
    id: "malad-west", name: "Malad West", area: "Western", lat: 19.1868, lng: 72.8484,
    r1: 32, r2: 55, r3: 80, sc: [4, 8, 5, 5, 5, 7],
    rz: ["Malad subway & Evershine pockets flood", "Western Line + Inorbit area", "Mindspace + Inorbit raised density", "SV + Link Rd jammed evenings", "Mindspace shade helps, WEH doesn't", "2000s towers dominate"],
    flags: ["it-hub", "malls"],
    com: { bkc: 40, lp: 50, nm: 70, se: 30, pw: 40, ar: 55, gr: 15 },
    tip: "Mindspace salary, Western Line suffering. Classic trade.",
  },
  {
    id: "borivali-west", name: "Borivali West", area: "Western", lat: 19.2307, lng: 72.8568,
    r1: 30, r2: 50, r3: 75, sc: [6, 8, 6, 6, 6, 7],
    rz: ["Elevated, rarely floods", "Western Line + upcoming coastal road", "Family neighborhoods, playgrounds", "LT Rd jams during school hours", "SGNP literally next door", "Mostly 90s-2000s, well-maintained"],
    flags: ["family", "green-adjacent", "national-park"],
    com: { bkc: 55, lp: 65, nm: 80, se: 45, pw: 55, ar: 70, gr: 30 },
    tip: "Where Mumbai families raise Mumbai families.",
  },
  {
    id: "powai", name: "Powai", area: "Central", lat: 19.1197, lng: 72.9073,
    r1: 42, r2: 75, r3: 120, sc: [6, 6, 7, 3, 6, 8],
    rz: ["Lake helps drain; IIT side holds up", "No train station — buses, autos, JVLR", "Gated, planned, Hiranandani dense", "JVLR + LBS = one-way-in nightmare", "Lake + tree cover help (~120)", "Mostly Hiranandani-era new build"],
    flags: ["it-hub", "planned", "lake", "gated"],
    com: { bkc: 25, lp: 45, nm: 60, se: 20, pw: 5, ar: 25, gr: 30 },
    tip: "Planned city inside chaos city. Paradise until you need to leave.",
  },
  {
    id: "chembur", name: "Chembur", area: "Central", lat: 19.0622, lng: 72.8996,
    r1: 35, r2: 60, r3: 90, sc: [5, 8, 5, 4, 2, 6],
    rz: ["Diamond Garden dry, Ghatkopar end dips", "Harbour + Metro 2B + Freeway", "Gated societies + older chawls", "Eastern Express + Sion-Panvel crawl", "Mahul refinery drags AQI (~195)", "50s-80s colonies + heavy redev"],
    flags: ["metro", "aqi-risk"],
    com: { bkc: 20, lp: 35, nm: 50, se: 30, pw: 20, ar: 35, gr: 40 },
    tip: "Great connectivity. Air is a known problem nobody talks about.",
  },
  {
    id: "ghatkopar", name: "Ghatkopar", area: "Central", lat: 19.0863, lng: 72.9081,
    r1: 38, r2: 65, r3: 95, sc: [5, 10, 3, 3, 4, 6],
    rz: ["Pant Nagar & Rajawadi pockets flood", "Central + Metro 1 interchange", "Dense Gujarati core, compressed lanes", "LBS Marg jams, JVLR spillover", "Central Line dust (~170)", "Active redev, chawls remain"],
    flags: ["metro", "veg-dominant"],
    com: { bkc: 15, lp: 35, nm: 50, se: 20, pw: 15, ar: 30, gr: 30 },
    tip: "Gujju commuter colony. Food is elite, density is extreme.",
  },
  {
    id: "mulund-west", name: "Mulund West", area: "Central", lat: 19.1726, lng: 72.9566,
    r1: 35, r2: 60, r3: 90, sc: [6, 9, 6, 5, 5, 7],
    rz: ["Rarely floods, hills help drainage", "Central fast trains stop here", "Planned Gujarati family belt", "LBS Marg jams during office hours", "SGNP helps; highway hurts (~140)", "2000s buildings, decent maintenance"],
    flags: ["family", "green-adjacent"],
    com: { bkc: 40, lp: 55, nm: 75, se: 40, pw: 30, ar: 20, gr: 45 },
    tip: "Suburban sanity with a Central Line sentence.",
  },
  {
    id: "wadala", name: "Wadala", area: "Central", lat: 19.0176, lng: 72.8639,
    r1: 40, r2: 70, r3: 110, sc: [2, 9, 4, 3, 4, 6],
    rz: ["Wadala-Sion belt is a classic flood zone", "Harbour + Central + Monorail + Freeway", "Chawls, colonies, new towers", "EEH + Freeway bleed into interior", "Diesel-heavy east, RCF smoke", "Lots of recent redev stock"],
    flags: ["flood-prone"],
    com: { bkc: 20, lp: 20, nm: 30, se: 35, pw: 30, ar: 45, gr: 35 },
    tip: "Four transit modes. Also four inches of water, one week a year.",
  },
  {
    id: "hindmata", name: "Hindmata / Parel East", area: "Central", lat: 18.9974, lng: 72.837,
    r1: 38, r2: 65, r3: 95, sc: [1, 10, 3, 2, 4, 5],
    rz: ["Meme-tier flood spot of Mumbai", "Every line + Parel stn + Freeway", "Chawl density, no breathing room", "Dr Ambedkar Road jams 24/7", "Central Mumbai diesel bath (~170)", "Old cessed stock, slow redev"],
    flags: ["flood-prone", "heritage"],
    com: { bkc: 22, lp: 10, nm: 25, se: 40, pw: 45, ar: 60, gr: 35 },
    tip: "Best commute in Mumbai. Also the most famous waterlogging video on Twitter.",
  },
  {
    id: "vashi", name: "Vashi", area: "Harbour", lat: 19.0759, lng: 72.9989,
    r1: 28, r2: 48, r3: 72, sc: [6, 8, 7, 6, 6, 8],
    rz: ["Planned, drains well; sector edges dip", "Harbour Line + Palm Beach Road", "CIDCO-planned, wider roads", "Palm Beach + Sion-Panvel flow reasonably", "Cleaner than island city average", "2000s CIDCO stock, well-built"],
    flags: ["planned", "family", "navi-mumbai"],
    com: { bkc: 30, lp: 40, nm: 55, se: 50, pw: 35, ar: 25, gr: 55 },
    tip: "Navi Mumbai's OG. The city Mumbai wishes it could be.",
  },
];

// ============================================================
// FULL CITY REGISTRY — Mumbai inline + Bangalore + Gurgaon from cities.ts
// ============================================================
interface CityFullConfig {
  localities: Locality[];
  trainLines: TrainLine[];
  offices: { key: string; name: string; short: string; lng: number; lat: number }[];
}

const CITIES_FULL: Record<CityKey, CityFullConfig> = {
  mumbai: {
    localities: LOCALITIES,
    trainLines: TRAIN_LINES,
    offices: OFFICES,
  },
  bangalore: {
    localities: CITIES_DATA.bangalore.localities as unknown as Locality[],
    trainLines: CITIES_DATA.bangalore.trainLines as unknown as TrainLine[],
    offices: CITIES_DATA.bangalore.offices,
  },
  gurgaon: {
    localities: CITIES_DATA.gurgaon.localities as unknown as Locality[],
    trainLines: CITIES_DATA.gurgaon.trainLines as unknown as TrainLine[],
    offices: CITIES_DATA.gurgaon.offices,
  },
};

// ============================================================
// HELPERS
// ============================================================
function zoneOf(sc: number[]): Zone {
  const avg = sc.reduce((a, b) => a + b, 0) / sc.length;
  return avg >= 6.5 ? "green" : avg >= 4.5 ? "yellow" : "red";
}

function avgScore(sc: number[]) {
  return sc.reduce((a, b) => a + b, 0) / sc.length;
}

function zoneColor(z: Zone) {
  return z === "green" ? T.green : z === "yellow" ? T.yellow : T.red;
}

function zoneBg(z: Zone) {
  return z === "green" ? T.greenDim : z === "yellow" ? T.yellowDim : T.redDim;
}

function zoneLabel(z: Zone) {
  return z === "green" ? "Green" : z === "yellow" ? "Yellow" : "Red";
}

function commuteColor(min: number) {
  return min <= 20 ? T.green : min <= 40 ? T.yellow : T.red;
}

function fmtK(k: number) {
  return k >= 100 ? `₹${(k / 100).toFixed(1)}L` : `₹${k}k`;
}

function fmtCr(totalKs: number) {
  // totalKs = sum of rents (in ₹ thousands). 1 Cr = 10,000 thousand.
  const cr = totalKs / 10000;
  if (cr >= 1) return `₹${cr.toFixed(2)} Cr`;
  const l = totalKs / 100;
  return `₹${l.toFixed(1)} L`;
}

function fmtRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

// Deterministic seeded RNG (xorshift-ish from string)
function sr(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

// Generate ~300 synthetic rent pins distributed around each locality of the given city
function generateSeedPins(localities: Locality[], cityKey: string): Pin[] {
  const pins: Pin[] = [];
  let id = 0;
  localities.forEach((loc) => {
    const z = zoneOf(loc.sc);
    const count = 12 + Math.floor(sr(cityKey + ":" + loc.id + "c") * 8);
    for (let i = 0; i < count; i++) {
      const s1 = sr(cityKey + ":" + loc.id + "bhk:" + i);
      const s2 = sr(cityKey + ":" + loc.id + "var:" + i);
      const s3 = sr(cityKey + ":" + loc.id + "lat:" + i);
      const s4 = sr(cityKey + ":" + loc.id + "lng:" + i);
      const s5 = sr(cityKey + ":" + loc.id + "fur:" + i);

      const bhk: Bhk = s1 < 0.28 ? 1 : s1 < 0.78 ? 2 : 3;
      const baseRent = bhk === 1 ? loc.r1 : bhk === 2 ? loc.r2 : loc.r3;
      const variance = 0.78 + s2 * 0.44;
      const rent = Math.max(10, Math.round(baseRent * variance));

      const latOff = (s3 - 0.5) * 0.009;
      const lngOff = (s4 - 0.5) * 0.009;

      pins.push({
        id: `${cityKey}-s${id++}`,
        locId: loc.id,
        locName: loc.name,
        lat: loc.lat + latOff,
        lng: loc.lng + lngOff,
        bhk,
        rent,
        furnished: s5 < 0.32,
        source: "seed",
        zone: z,
      });
    }
  });
  return pins;
}

// Build GeoJSON for the pin source
function pinsToGeoJSON(pins: Pin[], colorMode: "zone" | "commute" | "monsoon", commuteKey: string, locMap: Record<string, Locality>) {
  return {
    type: "FeatureCollection" as const,
    features: pins.map((p) => {
      let color = zoneColor(p.zone);
      if (colorMode === "commute" && commuteKey) {
        const loc = locMap[p.locId];
        if (loc) color = commuteColor(loc.com[commuteKey]);
      } else if (colorMode === "monsoon") {
        const loc = locMap[p.locId];
        if (loc) {
          const f = loc.sc[0];
          color = f >= 7 ? T.green : f >= 4 ? T.yellow : T.red;
        }
      }
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          bhk: p.bhk,
          rent: p.rent,
          rentLabel: `${p.bhk}B ${p.rent}k`,
          color,
          source: p.source,
          locName: p.locName,
        },
      };
    }),
  };
}

function zonesToGeoJSON(localities: Locality[]) {
  return {
    type: "FeatureCollection" as const,
    features: localities.map((loc) => {
      const z = zoneOf(loc.sc);
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [loc.lng, loc.lat] },
        properties: {
          id: loc.id,
          name: loc.name,
          color: zoneColor(z),
          zoneScore: avgScore(loc.sc),
        },
      };
    }),
  };
}

function officesToGeoJSON(offices: { key: string; name: string; short: string; lng: number; lat: number }[]) {
  return {
    type: "FeatureCollection" as const,
    features: offices.map((o) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [o.lng, o.lat] },
      properties: { id: o.key, name: o.name, short: o.short },
    })),
  };
}

// MapLibre GL CDN loader
async function loadMapLibre(): Promise<any> {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (w.maplibregl) return w.maplibregl;

  if (!document.querySelector("link[data-maplibre]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
    link.setAttribute("data-maplibre", "1");
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-maplibre]");
    if (existing) {
      const iv = setInterval(() => {
        if ((window as any).maplibregl) {
          clearInterval(iv);
          resolve((window as any).maplibregl);
        }
      }, 60);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
    script.setAttribute("data-maplibre", "1");
    script.onload = () => resolve((window as any).maplibregl);
    script.onerror = () => reject(new Error("MapLibre failed to load"));
    document.body.appendChild(script);
  });
}

// LIVE: fetch Mumbai train stations from OSM Overpass API
function bboxToOverpass(bbox: [[number, number], [number, number]]): string {
  // Overpass uses south,west,north,east
  const [[minLng, minLat], [maxLng, maxLat]] = bbox;
  return `${minLat},${minLng},${maxLat},${maxLng}`;
}

async function fetchStations(bbox: [[number, number], [number, number]]): Promise<Station[]> {
  const b = bboxToOverpass(bbox);
  const query = `[out:json][timeout:25];(node["railway"="station"](${b});node["railway"="halt"](${b}););out body;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.elements || [])
      .filter((el: any) => el.tags?.name)
      .map((el: any) => ({
        id: String(el.id),
        name: el.tags.name,
        lat: el.lat,
        lng: el.lon,
      }));
  } catch {
    return [];
  }
}

// LIVE: Nominatim geocoding search
async function searchPlaces(q: string, cityName: string, bbox: [[number, number], [number, number]]): Promise<any[]> {
  if (!q || q.trim().length < 3) return [];
  try {
    const [[minLng, minLat], [maxLng, maxLat]] = bbox;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + " " + cityName)}&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=1&limit=6`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// LIVE: Metro stations via Overpass (separate from local trains)
async function fetchMetroStations(bbox: [[number, number], [number, number]]): Promise<Station[]> {
  const b = bboxToOverpass(bbox);
  const query = `[out:json][timeout:25];(node["station"="subway"](${b});node["railway"="station"]["subway"="yes"](${b});node["railway"="subway_entrance"](${b}););out body;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const seen = new Set<string>();
    const out: Station[] = [];
    (data.elements || []).forEach((el: any) => {
      if (!el.tags?.name) return;
      const key = el.tags.name;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ id: String(el.id), name: el.tags.name, lat: el.lat, lng: el.lon });
    });
    return out;
  } catch {
    return [];
  }
}

// LIVE: OSM construction sites via Overpass
interface ConstructionSite {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}
async function fetchConstruction(bbox: [[number, number], [number, number]]): Promise<ConstructionSite[]> {
  const b = bboxToOverpass(bbox);
  const query = `[out:json][timeout:25];(way["landuse"="construction"](${b});way["building"="construction"](${b});node["construction"](${b}););out center 60;`;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.elements || [])
      .map((el: any) => {
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        if (lat == null || lng == null) return null;
        return { id: String(el.id), lat, lng, name: el.tags?.name };
      })
      .filter(Boolean) as ConstructionSite[];
  } catch {
    return [];
  }
}

// LIVE: RainViewer — latest radar frame URL
async function fetchRainViewer(): Promise<string | null> {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    if (!res.ok) return null;
    const data = await res.json();
    const past = data.radar?.past || [];
    if (past.length === 0) return null;
    const latest = past[past.length - 1];
    const host = data.host;
    // Tile URL template: {host}{path}/{size}/{z}/{x}/{y}/{color}/{options}.png
    return `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
  } catch {
    return null;
  }
}

// LIVE: Open-Meteo Air Quality
interface AirQuality {
  pm25: number;
  usAqi: number;
}
async function fetchAirQuality(lat: number, lng: number): Promise<AirQuality | null> {
  try {
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&current=pm2_5,us_aqi`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.current;
    if (!c) return null;
    return { pm25: c.pm2_5, usAqi: c.us_aqi };
  } catch {
    return null;
  }
}

// LIVE: Open-Meteo current weather
async function fetchWeather(lat: number, lng: number): Promise<Weather | null> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&current_weather=true`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const cw = data.current_weather;
    if (!cw) return null;
    const code = cw.weathercode;
    const isRaining = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99);
    let summary = "Clear";
    if (code === 0) summary = "Clear";
    else if (code <= 3) summary = "Partly cloudy";
    else if (code <= 48) summary = "Foggy";
    else if (code <= 57) summary = "Drizzle";
    else if (code <= 67) summary = "Raining";
    else if (code <= 77) summary = "Snow";
    else if (code <= 82) summary = "Rain showers";
    else if (code <= 99) summary = "Thunderstorm";
    return { temperature: cw.temperature, weathercode: code, isRaining, summary };
  } catch {
    return null;
  }
}

const PIN_KEY = "bambaibhada_pins_v2";
const DROP_KEY = "bambaibhada_drops_v1";

function loadUserPins(): Pin[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PIN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserPins(pins: Pin[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PIN_KEY, JSON.stringify(pins));
  } catch {}
}

function loadDrops(): UserDrop[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DROP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDrops(drops: UserDrop[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DROP_KEY, JSON.stringify(drops));
  } catch {}
}

// Distance between two lat/lng in km
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Build a circle polygon for map rendering (64 points)
function circleGeoJSON(lat: number, lng: number, radiusKm: number) {
  const points: [number, number][] = [];
  const n = 64;
  const latRad = (lat * Math.PI) / 180;
  const latKm = 110.574; // km per degree latitude
  const lngKm = 111.32 * Math.cos(latRad); // km per degree longitude
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const dLat = (Math.sin(t) * radiusKm) / latKm;
    const dLng = (Math.cos(t) * radiusKm) / lngKm;
    points.push([lng + dLng, lat + dLat]);
  }
  return {
    type: "Feature" as const,
    geometry: { type: "Polygon" as const, coordinates: [points] },
    properties: {},
  };
}

function sanitizeHandle(h: string): string {
  return h.trim().replace(/^@+/, "").replace(/[^a-zA-Z0-9._]/g, "");
}

// Parse a free-text drop message for structured fields.
// This is lossy on purpose — the message is the source of truth, the
// parse is just for filters + pin labels.
function parseMessage(text: string): {
  bhk?: 0 | 1 | 2 | 3;
  amount?: number;
  radiusKm?: number;
  instagram?: string;
  telegram?: string;
  twitter?: string;
} {
  if (!text) return {};
  const out: {
    bhk?: 0 | 1 | 2 | 3;
    amount?: number;
    radiusKm?: number;
    instagram?: string;
    telegram?: string;
    twitter?: string;
  } = {};

  // BHK: "2BHK", "2 BHK", "2-BHK", "1RK"
  const bhkMatch = text.match(/(\d)\s*[-–]?\s*bhk/i);
  if (bhkMatch) {
    const n = parseInt(bhkMatch[1]);
    if (n >= 1 && n <= 3) out.bhk = n as 1 | 2 | 3;
  }

  // Amount: "₹50k", "Rs 50k", "50k", "₹1.5L", "1.5 lakh", "₹50,000"
  const lMatch = text.match(/(?:₹|rs\.?\s*)?(\d{1,3}(?:\.\d+)?)\s*l(?:akh)?s?\b/i);
  const kMatch = text.match(/(?:₹|rs\.?\s*)?(\d{1,3})\s*k\b/i);
  const commaMatch = text.match(/(?:₹|rs\.?\s*)(\d{1,2}),?(\d{3})(?![\d])/);
  if (lMatch) {
    out.amount = Math.round(parseFloat(lMatch[1]) * 100);
  } else if (kMatch) {
    out.amount = parseInt(kMatch[1]);
  } else if (commaMatch) {
    out.amount = Math.round(parseInt(commaMatch[1] + commaMatch[2]) / 1000);
  }

  // Radius: "within 3km", "3 km radius", "3-5km"
  const radMatch = text.match(/(\d+(?:\.\d+)?)\s*km/i);
  if (radMatch) out.radiusKm = Math.max(1, Math.min(10, parseFloat(radMatch[1])));

  // Instagram handle: @handle (Latin chars, dots, underscores)
  const handles = [...text.matchAll(/@([a-zA-Z0-9._]{2,30})/g)].map((m) => m[1]);
  if (handles.length > 0) {
    // If message explicitly says "telegram" or "tg" near a handle, route it there
    const lower = text.toLowerCase();
    handles.forEach((h) => {
      const idx = text.toLowerCase().indexOf("@" + h.toLowerCase());
      const window = lower.slice(Math.max(0, idx - 25), idx);
      if (/telegram|t\.me|tg\b/.test(window)) {
        if (!out.telegram) out.telegram = h;
      } else if (/twitter|x\.com|\btwitter|\bx\b/.test(window)) {
        if (!out.twitter) out.twitter = h;
      } else {
        if (!out.instagram) out.instagram = h;
      }
    });
  }

  return out;
}

// Build a short summary chip from parsed data for pin labels + card headers
function dropSummary(d: UserDrop): string {
  const bits: string[] = [];
  if (d.bhk) bits.push(`${d.bhk}B`);
  if (d.amount) bits.push(`${d.amount}k`);
  if (bits.length === 0) return d.kind === "listing" ? "AVAILABLE" : "LOOKING";
  return bits.join(" · ");
}

// Build a shareable text blurb for a drop (WhatsApp-friendly)
function buildShareText(drop: UserDrop, siteUrl: string): string {
  const header = drop.kind === "listing" ? "AVAILABLE IN MUMBAI" : "LOOKING IN MUMBAI";
  const parts: string[] = [header, "", drop.message];
  if (drop.instagram && !drop.message.toLowerCase().includes(`@${drop.instagram.toLowerCase()}`)) {
    parts.push("", `DM me @${drop.instagram} on Instagram.`);
  }
  parts.push(
    "",
    `Pinned on Bambai Bhada — ${siteUrl}?d=${drop.id}`,
    "India's rent map without the Flat-n-Flatmates BS. No login."
  );
  return parts.join("\n");
}

function shareDrop(drop: UserDrop) {
  const siteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/bambaibhada`
      : "https://boredfolio.com/bambaibhada";
  const text = buildShareText(drop, siteUrl);

  // Try native share sheet first (mobile + supported desktop)
  const nav = typeof navigator !== "undefined" ? (navigator as any) : null;
  if (nav && typeof nav.share === "function") {
    nav
      .share({
        title: "Bambai Bhada",
        text,
        url: siteUrl,
      })
      .catch(() => {
        // User cancelled or share failed — fall back to WhatsApp
        if (typeof window !== "undefined") {
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }
      });
  } else if (typeof window !== "undefined") {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
}

// ============================================================
// COMPONENT
// ============================================================
export default function BambaiBhadaPage() {
  const [city, setCityState] = useState<CityKey>("mumbai");
  const cfg = useMemo(() => CITIES_FULL[city], [city]);
  const cfgRef = useRef(cfg);
  useEffect(() => {
    cfgRef.current = cfg;
  }, [cfg]);

  // Real rental drops scraped from public Reddit endpoints (see
  // scripts/ingest-rentals.mjs). When the JSON is present and has data
  // for the current city, we use it as the pin source instead of the
  // synthetic seed. Falls back to seed so dev/preview never looks empty.
  const [realPinsByCity, setRealPinsByCity] = useState<Record<CityKey, Pin[]> | null>(null);
  const [realDataMeta, setRealDataMeta] = useState<{ generatedAt: string; total: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/rentals.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (cancelled || !payload || !payload.cities) return;
        const byCity: Record<CityKey, Pin[]> = { mumbai: [], bangalore: [], gurgaon: [] };
        for (const cityKey of Object.keys(byCity) as CityKey[]) {
          const drops = payload.cities[cityKey] || [];
          const locs = CITIES_FULL[cityKey].localities;
          const locById: Record<string, Locality> = {};
          locs.forEach((l) => {
            locById[l.id] = l;
          });
          byCity[cityKey] = drops
            .map((d: any, i: number): Pin | null => {
              // Prefer exact id match. If the scraper tagged a locality that
              // doesn't exist in cfg (extra sectors, less-covered neighbourhoods),
              // fall back to the NEAREST cfg locality by great-circle distance
              // so the pin still lands on the map and PinCard has metadata.
              let loc = locById[d.locality];
              if (!loc && typeof d.lat === "number" && typeof d.lng === "number") {
                let bestDist = Infinity;
                for (const candidate of locs) {
                  const dLat = candidate.lat - d.lat;
                  const dLng = candidate.lng - d.lng;
                  const dist = dLat * dLat + dLng * dLng;
                  if (dist < bestDist) {
                    bestDist = dist;
                    loc = candidate;
                  }
                }
              }
              if (!loc) return null;
              const bhkVal = (d.bhk && d.bhk >= 1 && d.bhk <= 3 ? d.bhk : 2) as Bhk;
              const rentK = d.rent
                ? Math.max(5, Math.round(d.rent / 1000))
                : bhkVal === 1
                ? loc.r1
                : bhkVal === 2
                ? loc.r2
                : loc.r3;
              // Prefer the scraper's more-precise locality name (e.g. "Sector
              // 48") over the snapped cfg locality ("Sector 54"). This keeps
              // pin labels honest even when we had to fall back.
              const displayLocName = d.localityName || loc.name;
              return {
                id: d.id || `${cityKey}-r${i}`,
                locId: loc.id,
                locName: displayLocName,
                lat: typeof d.lat === "number" ? d.lat : loc.lat,
                lng: typeof d.lng === "number" ? d.lng : loc.lng,
                bhk: bhkVal,
                rent: rentK,
                furnished: false,
                source: "real",
                zone: zoneOf(loc.sc),
                title: d.title,
                message: d.message,
                handle: d.handle,
                subreddit: d.subreddit,
                author: d.author,
                sourceUrl: d.sourceUrl,
                createdAt: d.createdAt,
                role: d.role,
              };
            })
            .filter((p: Pin | null): p is Pin => p !== null);
        }
        setRealPinsByCity(byCity);
        setRealDataMeta({ generatedAt: payload.generatedAt, total: payload.counts?.total || 0 });
      })
      .catch(() => {
        // fall back to generated seed silently
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const seedPins = useMemo(() => {
    const real = realPinsByCity?.[city];
    if (real && real.length > 0) return real;
    return generateSeedPins(cfg.localities, city);
  }, [cfg, city, realPinsByCity]);

  const [userPins, setUserPins] = useState<Pin[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [metro, setMetro] = useState<Station[]>([]);
  const [construction, setConstruction] = useState<ConstructionSite[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [aqi, setAqi] = useState<AirQuality | null>(null);
  const [rainTileUrl, setRainTileUrl] = useState<string | null>(null);

  const [selected, setSelected] = useState<Pin | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<Locality | null>(null);

  const [bhk, setBhk] = useState<BhkFilter>(0);
  const [commuteTo, setCommuteTo] = useState<string>("");
  const [monsoon, setMonsoon] = useState(false);
  const [rentMax, setRentMax] = useState(300);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [mapReady, setMapReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stationsLoaded, setStationsLoaded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const setCity = setCityState;
  const [imageMode, setImageMode] = useState(false);
  const [densityPopup, setDensityPopup] = useState<{
    lat: number;
    lng: number;
    loading: boolean;
    aqi?: number;
    pm25?: number;
    popDensity?: "low" | "medium" | "high" | "very high";
    traffic?: "flowing" | "moderate" | "heavy";
  } | null>(null);

  // --- Drop flow state ---
  const [drops, setDrops] = useState<UserDrop[]>([]);
  const [dropStage, setDropStage] = useState<"idle" | "picking" | "filling">("idle");
  const [draftDrop, setDraftDrop] = useState<Partial<UserDrop> | null>(null);
  const [selectedDropId, setSelectedDropId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [deepLinkDropId, setDeepLinkDropId] = useState<string | null>(null);

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mlRef = useRef<any>(null);

  const locMap = useMemo(() => {
    const m: Record<string, Locality> = {};
    cfg.localities.forEach((l) => (m[l.id] = l));
    return m;
  }, [cfg]);

  // Mobile detection
  useEffect(() => {
    function c() {
      setIsMobile(window.innerWidth < 920);
    }
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  // Welcome overlay + deep-link + city parsing on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem("bambaibhada_welcome_v1");
    if (!seen) setShowWelcome(true);
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (d) setDeepLinkDropId(d);
    const c = params.get("city") as CityKey | null;
    const storedCity = localStorage.getItem("bambaibhada_city_v1") as CityKey | null;
    const initial = (c && CITY_REGISTRY[c] ? c : storedCity && CITY_REGISTRY[storedCity] ? storedCity : "mumbai") as CityKey;
    if (initial !== "mumbai") setCity(initial);
  }, []);

  // Persist city + sync URL (non-destructive replace)
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("bambaibhada_city_v1", city);
    const url = new URL(window.location.href);
    if (city === "mumbai") url.searchParams.delete("city");
    else url.searchParams.set("city", city);
    window.history.replaceState({}, "", url.toString());
  }, [city]);

  // Fly to city center + REPLACE all city-bound layer data when city changes
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const c = CITY_REGISTRY[city];
    const map = mapRef.current;

    // 1) Replace zones / lines / offices data
    const zonesSrc = map.getSource("zones");
    if (zonesSrc) zonesSrc.setData(zonesToGeoJSON(cfg.localities));
    const linesSrc = map.getSource("rail-lines");
    if (linesSrc) linesSrc.setData(trainLinesToGeoJSON(cfg.trainLines));
    const officesSrc = map.getSource("offices");
    if (officesSrc) officesSrc.setData(officesToGeoJSON(cfg.offices));

    // 2) Clear the old stations / metro / construction layers (will refetch in their effects)
    const stationsSrc = map.getSource("stations");
    if (stationsSrc) stationsSrc.setData({ type: "FeatureCollection", features: [] });
    const metroSrc = map.getSource("metro");
    if (metroSrc) metroSrc.setData({ type: "FeatureCollection", features: [] });
    const constructionSrc = map.getSource("construction");
    if (constructionSrc) constructionSrc.setData({ type: "FeatureCollection", features: [] });

    // 3) Clear stale loaded flag so live feeds re-fetch for the new city
    setStationsLoaded(false);
    setMetro([]);
    setConstruction([]);
    setStations([]);

    // 4) Fit bounds to the new city's localities (or fall back to flyTo center)
    const locs = cfg.localities;
    if (locs.length > 0) {
      const lats = locs.map((l) => l.lat);
      const lngs = locs.map((l) => l.lng);
      const bounds = [
        [Math.min(...lngs) - 0.02, Math.min(...lats) - 0.02],
        [Math.max(...lngs) + 0.02, Math.max(...lats) + 0.02],
      ];
      try {
        map.fitBounds(bounds, {
          padding: { top: 110, bottom: 110, left: 60, right: 60 },
          duration: 1200,
          maxZoom: 12,
        });
      } catch {
        map.flyTo({ center: c.center, zoom: c.zoom, duration: 1200 });
      }
    } else {
      map.flyTo({ center: c.center, zoom: c.zoom, duration: 1200 });
    }
  }, [city, mapReady, cfg]);

  // Image mode — swap base map to Esri satellite imagery
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const satSourceId = "sat-imagery";
    const satLayerId = "sat-imagery-layer";
    if (imageMode) {
      if (!map.getSource(satSourceId)) {
        map.addSource(satSourceId, {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "© Esri World Imagery",
        });
      }
      if (!map.getLayer(satLayerId)) {
        // Insert above the default base map layers but below our overlays
        const layers = map.getStyle().layers;
        // Find the first of our custom layers to insert before
        const beforeId = ["zone-halo", "rail-lines-glow", "drops-glow", "pin-dots"].find((id) =>
          map.getLayer(id)
        );
        map.addLayer(
          {
            id: satLayerId,
            type: "raster",
            source: satSourceId,
            paint: { "raster-opacity": 1 },
          },
          beforeId || undefined
        );
      }
    } else {
      if (map.getLayer(satLayerId)) map.removeLayer(satLayerId);
      if (map.getSource(satSourceId)) map.removeSource(satSourceId);
    }
  }, [mapReady, imageMode]);

  // Click-map density popup handler — click empty map (not on pins) shows live AQI + estimated pop/traffic
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    function onMapClick(e: any) {
      if (dropStageRef.current !== "idle") return; // Don't interfere with drop flow
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["pin-dots", "drops", "stations", "metro", "construction"].filter((id) =>
          map.getLayer(id)
        ),
      });
      if (features && features.length > 0) return; // Clicked on a pin
      const { lat, lng } = e.lngLat;
      setDensityPopup({ lat, lng, loading: true });

      // Compute estimated pop density from proximity to current city's locality centers
      const nearest = cfg.localities
        .map((l) => ({ l, d: haversineKm(lat, lng, l.lat, l.lng) }))
        .sort((a, b) => a.d - b.d)[0];
      let popDensity: "low" | "medium" | "high" | "very high" = "medium";
      if (nearest && nearest.d < 5) {
        const density = nearest.l.sc[2]; // 0-10, higher = less dense
        popDensity = density >= 7 ? "low" : density >= 5 ? "medium" : density >= 3 ? "high" : "very high";
      }

      // Compute traffic from time-of-day rule
      const h = new Date().getHours();
      const traffic: "flowing" | "moderate" | "heavy" =
        (h >= 8 && h < 11) || (h >= 17 && h < 21)
          ? "heavy"
          : (h >= 7 && h < 8) || (h >= 16 && h < 17) || (h >= 21 && h < 22)
          ? "moderate"
          : "flowing";

      // Fetch live AQI for that point
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}&current=pm2_5,us_aqi`
      )
        .then((r) => r.json())
        .then((data) => {
          const c = data?.current;
          setDensityPopup((prev) =>
            prev
              ? {
                  ...prev,
                  loading: false,
                  aqi: c?.us_aqi != null ? Math.round(c.us_aqi) : undefined,
                  pm25: c?.pm2_5 != null ? Math.round(c.pm2_5) : undefined,
                  popDensity,
                  traffic,
                }
              : null
          );
        })
        .catch(() => {
          setDensityPopup((prev) =>
            prev ? { ...prev, loading: false, popDensity, traffic } : null
          );
        });
    }
    map.on("click", onMapClick);
    return () => {
      if (map && typeof map.off === "function") map.off("click", onMapClick);
    };
  }, [mapReady]);

  // Load saved user pins (localStorage) + remote drops (Supabase, if configured)
  useEffect(() => {
    setUserPins(loadUserPins());
    setDrops(loadDrops()); // Start with local cache instantly

    const sb = getSupabase();
    if (sb) {
      (async () => {
        const { data, error } = await sb
          .from(BB_TABLE)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);
        if (error) {
          console.warn("[bambaibhada] Supabase load failed:", error.message);
          return;
        }
        if (data) {
          const remote = (data as DbDrop[]).map(dbToDrop);
          // Merge with local cache — prefer remote for same id
          setDrops((prev) => {
            const map = new Map<string, UserDrop>();
            prev.forEach((d) => map.set(d.id, d));
            remote.forEach((d) => map.set(d.id, d as UserDrop));
            return Array.from(map.values());
          });
        }
      })();

      // Subscribe to realtime inserts
      const channel = sb
        .channel("bambai_bhada_drops_insert")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: BB_TABLE },
          (payload: any) => {
            const row = payload.new as DbDrop;
            if (!row) return;
            setDrops((prev) => {
              if (prev.some((d) => d.id === row.id)) return prev;
              return [...prev, dbToDrop(row) as UserDrop];
            });
          }
        )
        .subscribe();

      return () => {
        sb.removeChannel(channel);
      };
    }
  }, []);

  // All pins after filtering
  const visiblePins = useMemo(() => {
    const all = [...seedPins, ...userPins];
    return all.filter((p) => {
      if (bhk !== 0 && p.bhk !== bhk) return false;
      if (p.rent > rentMax) return false;
      return true;
    });
  }, [seedPins, userPins, bhk, rentMax]);

  // Stats
  const stats = useMemo(() => {
    const count = visiblePins.length;
    const sumK = visiblePins.reduce((s, p) => s + (Number(p.rent) || 0), 0);
    const avg = count > 0 ? Math.round(sumK / count) : 0;
    return { count, totalKs: sumK, avg };
  }, [visiblePins]);

  // Initialize MapLibre — only once per page load
  useEffect(() => {
    // If a map already exists on this container, don't create another
    if (mapContainerRef.current && mapContainerRef.current.querySelector(".maplibregl-map")) {
      return;
    }
    let cancelled = false;
    let localMap: any = null;

    loadMapLibre()
      .then((ml) => {
        if (cancelled || !ml || !mapContainerRef.current || mapRef.current) return;
        // Double-check container isn't already mapped
        if (mapContainerRef.current.querySelector(".maplibregl-map")) return;
        mlRef.current = ml;

        const map = new ml.Map({
          container: mapContainerRef.current,
          style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
          center: [72.87, 19.07],
          zoom: 10.4,
          attributionControl: false,
          pitch: 0,
          minZoom: 9,
          maxZoom: 17,
        });
        localMap = map;
        mapRef.current = map;

        // Define load handler (closures all the layer setup)
        const onMapLoad = () => {
          try {
          // Zone halos (soft glow behind pin clusters)
          map.addSource("zones", { type: "geojson", data: zonesToGeoJSON(cfgRef.current.localities) });
          map.addLayer({
            id: "zone-halo",
            source: "zones",
            type: "circle",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 22, 12, 60, 15, 180],
              "circle-color": ["get", "color"],
              "circle-opacity": 0.08,
              "circle-blur": 1.2,
            },
          });

          // Pins source with CLUSTERING so rent shows at every zoom level
          map.addSource("pins", {
            type: "geojson",
            data: pinsToGeoJSON(visiblePins, "zone", "", locMap),
            cluster: true,
            clusterMaxZoom: 13,
            clusterRadius: 42,
          });

          // CLUSTER bubbles — dark glass-style circles with pin count (like bengaluru.rent)
          map.addLayer({
            id: "clusters",
            source: "pins",
            type: "circle",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": "rgba(17,24,32,0.92)",
              "circle-stroke-color": "rgba(212,168,67,0.8)",
              "circle-stroke-width": 1.5,
              "circle-radius": [
                "step",
                ["get", "point_count"],
                18, // <10 pins → 18px
                10,
                22, // 10-24 → 22px
                25,
                28, // 25+ → 28px
              ],
            },
          });

          // Cluster count label — prominent
          map.addLayer({
            id: "cluster-count",
            source: "pins",
            type: "symbol",
            filter: ["has", "point_count"],
            layout: {
              "text-field": "{point_count_abbreviated} pins",
              "text-size": 11,
              "text-font": ["Open Sans Bold"],
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": "#E8EDF2",
              "text-halo-color": "rgba(11,15,20,0.8)",
              "text-halo-width": 0.5,
            },
          });

          // Individual rent pin — background circle
          map.addLayer({
            id: "pin-dots",
            source: "pins",
            type: "circle",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 16, 14, 22, 16, 28],
              "circle-color": ["get", "color"],
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "rgba(11,15,20,0.85)",
              "circle-opacity": 0.95,
            },
          });

          // Individual rent pin — LABEL with rent, the hero data
          map.addLayer({
            id: "pin-labels",
            source: "pins",
            type: "symbol",
            filter: ["!", ["has", "point_count"]],
            layout: {
              "text-field": ["get", "rentLabel"],
              "text-size": ["interpolate", ["linear"], ["zoom"], 12, 9, 14, 11, 16, 13],
              "text-font": ["Open Sans Bold"],
              "text-allow-overlap": true,
              "text-ignore-placement": true,
            },
            paint: {
              "text-color": "#0B0F14",
              "text-halo-color": "rgba(255,255,255,0.4)",
              "text-halo-width": 0.3,
            },
          });

          // Stations source (empty; filled after Overpass)
          map.addSource("stations", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "stations",
            source: "stations",
            type: "circle",
            minzoom: 11,
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 2.5, 14, 5, 16, 7],
              "circle-color": T.blue,
              "circle-stroke-width": 1.4,
              "circle-stroke-color": "rgba(11,15,20,0.95)",
              "circle-opacity": 0.9,
            },
          });
          map.addLayer({
            id: "station-labels",
            source: "stations",
            type: "symbol",
            minzoom: 13.5,
            layout: {
              "text-field": ["get", "name"],
              "text-size": 9,
              "text-offset": [0, 0.9],
              "text-anchor": "top",
              "text-font": ["Noto Sans Regular"],
              "text-optional": true,
            },
            paint: {
              "text-color": T.blue,
              "text-halo-color": "rgba(11,15,20,0.95)",
              "text-halo-width": 1.3,
            },
          });

          // Train + Metro line polylines (always on)
          map.addSource("rail-lines", {
            type: "geojson",
            data: trainLinesToGeoJSON(cfgRef.current.trainLines),
          });
          map.addLayer({
            id: "rail-lines-glow",
            source: "rail-lines",
            type: "line",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": ["get", "color"],
              "line-width": 6,
              "line-opacity": 0.12,
              "line-blur": 2,
            },
          });
          map.addLayer({
            id: "rail-lines",
            source: "rail-lines",
            type: "line",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": ["get", "color"],
              "line-width": 1.8,
              "line-opacity": 0.65,
              "line-dasharray": [3, 2],
            },
          });

          // Live animated trains source — empty until animation starts
          map.addSource("trains", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          map.addLayer({
            id: "trains-glow",
            source: "trains",
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": ["get", "color"],
              "circle-opacity": 0.35,
              "circle-blur": 1.2,
            },
          });
          map.addLayer({
            id: "trains",
            source: "trains",
            type: "circle",
            paint: {
              "circle-radius": 4,
              "circle-color": ["get", "color"],
              "circle-stroke-width": 1.8,
              "circle-stroke-color": "rgba(255,255,255,0.95)",
            },
          });

          // Metro stations source (empty; filled after Overpass)
          map.addSource("metro", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "metro",
            source: "metro",
            type: "circle",
            minzoom: 11,
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 3, 14, 6, 16, 9],
              "circle-color": "#A855F7",
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "rgba(11,15,20,0.95)",
              "circle-opacity": 0.95,
            },
          });
          map.addLayer({
            id: "metro-labels",
            source: "metro",
            type: "symbol",
            minzoom: 14,
            layout: {
              "text-field": ["get", "name"],
              "text-size": 9,
              "text-offset": [0, 1.0],
              "text-anchor": "top",
              "text-font": ["Noto Sans Regular"],
              "text-optional": true,
            },
            paint: {
              "text-color": "#A855F7",
              "text-halo-color": "rgba(11,15,20,0.95)",
              "text-halo-width": 1.3,
            },
          });

          // Construction sites source
          map.addSource("construction", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "construction",
            source: "construction",
            type: "circle",
            minzoom: 12,
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 3, 15, 5],
              "circle-color": "#FB923C",
              "circle-stroke-width": 1,
              "circle-stroke-color": "rgba(11,15,20,0.9)",
              "circle-opacity": 0.85,
            },
          });

          // User-dropped REQUEST circles (radius polygons)
          map.addSource("drop-circles", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          map.addLayer({
            id: "drop-circles-fill",
            source: "drop-circles",
            type: "fill",
            paint: {
              "fill-color": T.accent,
              "fill-opacity": 0.06,
            },
          });
          map.addLayer({
            id: "drop-circles-line",
            source: "drop-circles",
            type: "line",
            paint: {
              "line-color": T.accent,
              "line-width": 1.4,
              "line-opacity": 0.6,
              "line-dasharray": [2, 2],
            },
          });

          // User-dropped pins source (listings + requests)
          map.addSource("drops", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          map.addLayer({
            id: "drops-glow",
            source: "drops",
            type: "circle",
            paint: {
              "circle-radius": 14,
              "circle-color": ["get", "color"],
              "circle-opacity": 0.2,
              "circle-blur": 1,
            },
          });
          map.addLayer({
            id: "drops",
            source: "drops",
            type: "circle",
            paint: {
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                6,
                14,
                9,
                16,
                12,
              ],
              "circle-color": ["get", "color"],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#FFFFFF",
              "circle-opacity": 0.98,
            },
          });
          map.addLayer({
            id: "drops-labels",
            source: "drops",
            type: "symbol",
            minzoom: 11,
            layout: {
              "text-field": ["get", "label"],
              "text-size": 10,
              "text-font": ["Open Sans Bold"],
              "text-offset": [0, 1.3],
              "text-anchor": "top",
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": "#FFFFFF",
              "text-halo-color": "rgba(11,15,20,0.9)",
              "text-halo-width": 1.2,
            },
          });

          // Draft (preview) drop — shown while user is filling the form
          map.addSource("draft", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          map.addSource("draft-circle", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
          });
          map.addLayer({
            id: "draft-circle-fill",
            source: "draft-circle",
            type: "fill",
            paint: { "fill-color": T.accent, "fill-opacity": 0.12 },
          });
          map.addLayer({
            id: "draft-circle-line",
            source: "draft-circle",
            type: "line",
            paint: {
              "line-color": T.accent,
              "line-width": 2,
              "line-dasharray": [3, 2],
            },
          });
          map.addLayer({
            id: "draft-point",
            source: "draft",
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": T.accent,
              "circle-stroke-width": 3,
              "circle-stroke-color": "#FFFFFF",
            },
          });

          // Offices layer
          map.addSource("offices", { type: "geojson", data: officesToGeoJSON(cfgRef.current.offices) });
          map.addLayer({
            id: "offices",
            source: "offices",
            type: "symbol",
            minzoom: 10,
            layout: {
              "text-field": ["concat", "■ ", ["get", "short"]],
              "text-size": 11,
              "text-font": ["Open Sans Bold"],
              "text-allow-overlap": true,
            },
            paint: {
              "text-color": T.accent,
              "text-halo-color": "rgba(11,15,20,0.95)",
              "text-halo-width": 1.6,
            },
          });

          // Click pin
          map.on("click", "pin-dots", (e: any) => {
            if (dropStageRef.current !== "idle") return;
            if (!e.features?.length) return;
            const id = e.features[0].properties.id;
            const pool = [...seedPinsRefArr.current, ...userPinsRefArr.current];
            const full = pool.find((p: Pin) => p.id === id);
            if (full) {
              setSelected(full);
              setSelectedLoc(locMap[full.locId] || null);
              map.flyTo({ center: [full.lng, full.lat], zoom: Math.max(map.getZoom(), 13.5), duration: 700 });
            }
          });

          // Click user-dropped pin
          map.on("click", "drops", (e: any) => {
            if (dropStageRef.current !== "idle") return;
            if (!e.features?.length) return;
            e.originalEvent.stopPropagation?.();
            setSelectedDropId(e.features[0].properties.id);
          });
          map.on("mouseenter", "drops", () => {
            if (dropStageRef.current === "idle") map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "drops", () => {
            if (dropStageRef.current === "idle") map.getCanvas().style.cursor = "";
          });

          // Map click for drop-mode pin placement
          map.on("click", (e: any) => {
            if (dropStageRef.current !== "picking") return;
            // Ignore clicks on existing pin layers (handled above)
            const features = map.queryRenderedFeatures(e.point, {
              layers: ["pin-dots", "drops"],
            });
            if (features && features.length > 0) return;
            setDraftDrop({
              lat: e.lngLat.lat,
              lng: e.lngLat.lng,
              kind: "request",
              message: "",
              radiusKm: 3,
            });
            setDropStage("filling");
          });

          map.on("mouseenter", "pin-dots", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "pin-dots", () => {
            map.getCanvas().style.cursor = "";
          });

          mapRef.current = map;
          setMapReady(true);
          setTimeout(() => {
            map.resize();
            const locs = cfgRef.current.localities;
            const lats = locs.map((l) => l.lat);
            const lngs = locs.map((l) => l.lng);
            const bounds = [
              [Math.min(...lngs) - 0.02, Math.min(...lats) - 0.02],
              [Math.max(...lngs) + 0.02, Math.max(...lats) + 0.02],
            ];
            map.fitBounds(bounds, { padding: { top: 110, bottom: 110, left: 60, right: 60 }, duration: 0, maxZoom: 12 });
          }, 50);
          setTimeout(() => map.resize(), 300);
          } catch (err) {
            console.error("[bambaibhada] map load handler error:", err);
            // Still set ready so the UI isn't stuck — layers may be missing
            // but the user can at least see the overlay and weather/AQI pills.
            mapRef.current = map;
            setMapReady(true);
          }
        };

        // Detect when the style is loaded via 3 mechanisms —
        // map.on('load') has been unreliable in this React/MapLibre setup,
        // so we also listen for 'idle' and poll isStyleLoaded() as fallbacks.
        let onLoadCalled = false;
        const safeOnLoad = () => {
          if (onLoadCalled) return;
          onLoadCalled = true;
          onMapLoad();
        };
        map.on("load", safeOnLoad);
        map.on("idle", safeOnLoad);
        map.on("styledata", safeOnLoad);
        map.on("sourcedata", safeOnLoad);
        const pollIv = setInterval(() => {
          if (onLoadCalled) {
            clearInterval(pollIv);
            return;
          }
          if (map.isStyleLoaded && map.isStyleLoaded()) {
            clearInterval(pollIv);
            safeOnLoad();
          }
        }, 100);
        // Hard safety net — if none of the events fire in 2s (can happen when
        // the container starts at 0x0, headless browsers, OS throttling),
        // force the load handler anyway. The layer code is idempotent-ish
        // because we only enter it once (onLoadCalled gate).
        setTimeout(() => {
          if (!onLoadCalled) safeOnLoad();
        }, 2000);
        setTimeout(() => clearInterval(pollIv), 15000);

        map.addControl(new ml.NavigationControl({ showCompass: false, visualizePitch: false }), "bottom-right");
        map.addControl(
          new ml.AttributionControl({
            compact: true,
            customAttribution: "© OpenMapTiles © OSM © CARTO",
          }),
          "bottom-left"
        );

        map.on("error", (e: any) => {
          // Silent
        });

        // Also resize on window resize
        const onResize = () => map.resize();
        window.addEventListener("resize", onResize);
        (map as any).__onResize = onResize;

        // Observe the container so the map auto-resizes whenever it gets a
        // real size (important when the map is created before the viewport
        // has finished laying out — common in headless / mobile orientation
        // changes / tab-restore scenarios).
        if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
          let lastW = 0;
          let lastH = 0;
          const ro = new ResizeObserver(() => {
            const rect = mapContainerRef.current?.getBoundingClientRect();
            if (!rect) return;
            if (rect.width === lastW && rect.height === lastH) return;
            lastW = rect.width;
            lastH = rect.height;
            map.resize();
          });
          ro.observe(mapContainerRef.current);
          (map as any).__ro = ro;
        }
      })
      .catch(() => {
        console.error("MapLibre load failed");
      });

    return () => {
      cancelled = true;
      // Don't destroy the map — keep it alive across StrictMode dev double-mount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs to current pins arrays (so map click handler always sees latest)
  const seedPinsRefArr = useRef<Pin[]>(seedPins);
  const userPinsRefArr = useRef<Pin[]>(userPins);
  const dropStageRef = useRef<"idle" | "picking" | "filling">("idle");
  useEffect(() => {
    seedPinsRefArr.current = seedPins;
  }, [seedPins]);
  useEffect(() => {
    userPinsRefArr.current = userPins;
  }, [userPins]);
  useEffect(() => {
    dropStageRef.current = dropStage;
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor =
        dropStage === "picking" ? "crosshair" : "";
    }
  }, [dropStage]);

  // Deep-link: once the map is ready and drops are loaded, auto-select the drop from the URL
  useEffect(() => {
    if (!mapReady || !deepLinkDropId) return;
    const target = drops.find((d) => d.id === deepLinkDropId);
    if (target) {
      setSelectedDropId(target.id);
      flyTo(target.lng, target.lat, 14);
      setDeepLinkDropId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, deepLinkDropId, drops]);

  function dismissWelcome() {
    if (typeof window !== "undefined") {
      localStorage.setItem("bambaibhada_welcome_v1", "1");
    }
    setShowWelcome(false);
  }

  // Update draft layer as user moves draftDrop
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const src = map.getSource("draft");
    const circleSrc = map.getSource("draft-circle");
    if (!src || !circleSrc) return;

    if (!draftDrop || draftDrop.lat == null || draftDrop.lng == null) {
      src.setData({ type: "FeatureCollection", features: [] });
      circleSrc.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    src.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [draftDrop.lng, draftDrop.lat] },
          properties: {},
        },
      ],
    });

    if (draftDrop.kind === "request" && draftDrop.radiusKm) {
      circleSrc.setData({
        type: "FeatureCollection",
        features: [circleGeoJSON(draftDrop.lat!, draftDrop.lng!, draftDrop.radiusKm)],
      });
    } else {
      circleSrc.setData({ type: "FeatureCollection", features: [] });
    }
  }, [mapReady, draftDrop]);

  // Update drops layer when drops change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const src = map.getSource("drops");
    const circleSrc = map.getSource("drop-circles");
    if (!src || !circleSrc) return;

    // Point features
    src.setData({
      type: "FeatureCollection",
      features: drops.map((d) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [d.lng, d.lat] },
        properties: {
          id: d.id,
          kind: d.kind,
          color: d.kind === "listing" ? T.accent : T.green,
          label: dropSummary(d as UserDrop),
        },
      })),
    });

    // Circle polygons for requests only
    circleSrc.setData({
      type: "FeatureCollection",
      features: drops
        .filter((d) => d.kind === "request" && d.radiusKm)
        .map((d) => circleGeoJSON(d.lat, d.lng, d.radiusKm!)),
    });
  }, [mapReady, drops]);

  // Fetch LIVE local train stations for the active city
  useEffect(() => {
    if (!mapReady) return;
    if (stationsLoaded && stations.length > 0) return;
    fetchStations(cfg as any === cfg ? CITY_REGISTRY[city].bounds : CITY_REGISTRY[city].bounds).then((s) => {
      setStations(s);
      setStationsLoaded(true);
      const map = mapRef.current;
      if (!map) return;
      const src = map.getSource("stations");
      if (src) {
        src.setData({
          type: "FeatureCollection",
          features: s.map((st) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [st.lng, st.lat] },
            properties: { id: st.id, name: st.name },
          })),
        });
      }
    });
  }, [mapReady, stationsLoaded, city]);

  // Fetch LIVE weather for the active city center
  useEffect(() => {
    const c = CITY_REGISTRY[city];
    fetchWeather(c.center[1], c.center[0]).then((w) => {
      if (w) {
        setWeather(w);
        if (w.isRaining) setMonsoon(true);
      }
    });
  }, [city]);

  // Fetch LIVE air quality for the active city center
  useEffect(() => {
    const c = CITY_REGISTRY[city];
    fetchAirQuality(c.center[1], c.center[0]).then((a) => {
      if (a) setAqi(a);
    });
  }, [city]);

  // Fetch LIVE RainViewer radar frame URL (global, not city-specific)
  useEffect(() => {
    fetchRainViewer().then((url) => {
      if (url) setRainTileUrl(url);
    });
  }, []);

  // Fetch LIVE Metro stations for the active city
  useEffect(() => {
    if (!mapReady) return;
    fetchMetroStations(CITY_REGISTRY[city].bounds).then((m) => {
      setMetro(m);
      const map = mapRef.current;
      if (!map) return;
      const src = map.getSource("metro");
      if (src) {
        src.setData({
          type: "FeatureCollection",
          features: m.map((st) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [st.lng, st.lat] },
            properties: { id: st.id, name: st.name },
          })),
        });
      }
    });
  }, [mapReady, city]);

  // Fetch LIVE Construction sites for the active city
  useEffect(() => {
    if (!mapReady) return;
    fetchConstruction(CITY_REGISTRY[city].bounds).then((c) => {
      setConstruction(c);
      const map = mapRef.current;
      if (!map) return;
      const src = map.getSource("construction");
      if (src) {
        src.setData({
          type: "FeatureCollection",
          features: c.map((site) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [site.lng, site.lat] },
            properties: { id: site.id, name: site.name || "Construction" },
          })),
        });
      }
    });
  }, [mapReady, city]);

  // Add rain radar tile layer only when monsoon mode is on
  useEffect(() => {
    if (!mapReady || !mapRef.current || !rainTileUrl) return;
    const map = mapRef.current;
    const sourceId = "rain-radar";
    const layerId = "rain-radar-layer";

    if (monsoon) {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [rainTileUrl],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 10,
          attribution: "© RainViewer",
        });
      }
      if (!map.getLayer(layerId)) {
        map.addLayer(
          {
            id: layerId,
            type: "raster",
            source: sourceId,
            paint: {
              "raster-opacity": 0.55,
              "raster-fade-duration": 300,
            },
          },
          "pin-dots"
        );
      }
    } else {
      // Remove when monsoon turns off to avoid visual clutter
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
  }, [mapReady, rainTileUrl, monsoon]);

  // Live animated trains — simulate locals + metro moving along lines
  // Re-spawns when city changes so each city's lines get their own trains
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    let raf = 0;
    let lastTime = performance.now();
    const trains = spawnTrains(cfg.trainLines);

    function tick(now: number) {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const features = trains.map((train) => {
        train.t += train.speed * train.direction * dt * 0.15;
        if (train.t >= 1) {
          train.t = 1;
          train.direction = -1;
        } else if (train.t <= 0) {
          train.t = 0;
          train.direction = 1;
        }
        const line = cfgRef.current.trainLines.find((l) => l.id === train.lineId);
        if (!line) return null;
        const [lng, lat] = interpolateOnLine(line.stations, train.t);
        return {
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [lng, lat] },
          properties: { id: train.id, color: train.color, lineId: train.lineId },
        };
      });

      const src = map.getSource("trains");
      if (src) {
        src.setData({
          type: "FeatureCollection",
          features: features.filter(Boolean) as any[],
        });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [mapReady, cfg]);

  // Time-aware traffic advisory (client-only to avoid SSR hydration mismatch)
  const [traffic, setTraffic] = useState<{
    level: "peak" | "moderate" | "off";
    label: string;
    note: string;
  } | null>(null);
  useEffect(() => {
    function computeTraffic() {
      const d = new Date();
      const t = d.getHours() + d.getMinutes() / 60;
      if (t >= 8 && t < 11)
        return { level: "peak" as const, label: "Morning rush", note: "WEH, SV Rd, LBS Marg crawling" };
      if (t >= 17 && t < 21)
        return { level: "peak" as const, label: "Evening rush", note: "BKC, Lower Parel, SB Rd crawling" };
      if ((t >= 7 && t < 8) || (t >= 11 && t < 12) || (t >= 16 && t < 17) || (t >= 21 && t < 22))
        return { level: "moderate" as const, label: "Building up", note: "Main roads slowing" };
      return { level: "off" as const, label: "Off peak", note: "Roads flow" };
    }
    setTraffic(computeTraffic());
    const iv = setInterval(() => setTraffic(computeTraffic()), 60000);
    return () => clearInterval(iv);
  }, []);

  // Update pin layer when filters change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const src = mapRef.current.getSource("pins");
    if (!src) return;
    const colorMode = monsoon ? "monsoon" : commuteTo ? "commute" : "zone";
    src.setData(pinsToGeoJSON(visiblePins, colorMode, commuteTo, locMap));
  }, [mapReady, visiblePins, monsoon, commuteTo, locMap]);

  // Debounced search
  useEffect(() => {
    if (!searchQ || searchQ.length < 3) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      const cfg = CITY_REGISTRY[city];
      searchPlaces(searchQ, cfg.name, cfg.bounds).then((r) => {
        setSearchResults(r);
        setSearching(false);
      });
    }, 450);
    return () => clearTimeout(t);
  }, [searchQ]);

  function flyTo(lng: number, lat: number, zoom = 14) {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom, duration: 1200 });
    }
  }

  const [locateState, setLocateState] = useState<"idle" | "asking" | "found" | "denied">("idle");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  function locateMe() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateState("denied");
      return;
    }
    setLocateState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        setLocateState("found");
        flyTo(longitude, latitude, 14);
      },
      () => {
        setLocateState("denied");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  // Render user location as a pulsing dot on the map
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const sourceId = "user-location";
    if (!userLoc) {
      if (map.getLayer(sourceId + "-pulse")) map.removeLayer(sourceId + "-pulse");
      if (map.getLayer(sourceId)) map.removeLayer(sourceId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      return;
    }
    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: [userLoc.lng, userLoc.lat] },
          properties: {},
        },
      });
      map.addLayer({
        id: sourceId + "-pulse",
        source: sourceId,
        type: "circle",
        paint: {
          "circle-radius": 18,
          "circle-color": "#60A5FA",
          "circle-opacity": 0.25,
          "circle-blur": 0.6,
        },
      });
      map.addLayer({
        id: sourceId,
        source: sourceId,
        type: "circle",
        paint: {
          "circle-radius": 6,
          "circle-color": "#60A5FA",
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#FFFFFF",
        },
      });
    } else {
      (map.getSource(sourceId) as any).setData({
        type: "Feature",
        geometry: { type: "Point", coordinates: [userLoc.lng, userLoc.lat] },
        properties: {},
      });
    }
  }, [mapReady, userLoc]);

  function addPin(p: Pin) {
    const next = [...userPins, p];
    setUserPins(next);
    saveUserPins(next);
    setAddOpen(false);
    flyTo(p.lng, p.lat, 14);
  }

  function saveDraft() {
    if (!draftDrop || draftDrop.lat == null || draftDrop.lng == null) return;
    const message = (draftDrop.message || "").trim().slice(0, 500);
    if (message.length < 10) return;
    const parsed = parseMessage(message);
    const newDrop: UserDrop = {
      id: `d${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      kind: (draftDrop.kind as DropKind) || "request",
      lat: draftDrop.lat,
      lng: draftDrop.lng,
      message,
      bhk: parsed.bhk,
      amount: parsed.amount,
      radiusKm: draftDrop.kind === "request" ? parsed.radiusKm || 3 : undefined,
      instagram: parsed.instagram ? sanitizeHandle(parsed.instagram) : undefined,
      telegram: parsed.telegram ? sanitizeHandle(parsed.telegram) : undefined,
      twitter: parsed.twitter ? sanitizeHandle(parsed.twitter) : undefined,
      ts: Date.now(),
    };
    const next = [...drops, newDrop];
    setDrops(next);
    saveDrops(next);
    setDraftDrop(null);
    setDropStage("idle");
    setSelectedDropId(newDrop.id);

    // Push to Supabase if configured (fire and forget)
    const sb = getSupabase();
    if (sb) {
      sb.from(BB_TABLE)
        .insert(dropToDb(newDrop))
        .then(({ error }: any) => {
          if (error) {
            console.warn("[bambaibhada] Supabase insert failed:", error.message);
          }
        });
    }
  }

  function cancelDraft() {
    setDraftDrop(null);
    setDropStage("idle");
  }

  function deleteDrop(id: string) {
    const next = drops.filter((d) => d.id !== id);
    setDrops(next);
    saveDrops(next);
    if (selectedDropId === id) setSelectedDropId(null);
  }

  const selectedDrop = useMemo(
    () => drops.find((d) => d.id === selectedDropId) || null,
    [drops, selectedDropId]
  );

  // Matches: how many opposite-type drops are inside the selected drop's circle (or within 2km of a listing)
  const selectedDropMatches = useMemo(() => {
    if (!selectedDrop) return [] as UserDrop[];
    const oppositeKind: DropKind = selectedDrop.kind === "listing" ? "request" : "listing";
    const radius = selectedDrop.kind === "request" ? selectedDrop.radiusKm || 3 : 2;
    return drops.filter((d) => {
      if (d.kind !== oppositeKind) return false;
      const dist = haversineKm(selectedDrop.lat, selectedDrop.lng, d.lat, d.lng);
      if (selectedDrop.kind === "request") return dist <= (selectedDrop.radiusKm || 3);
      // For listings: show all requests whose circle contains this listing
      return dist <= (d.radiusKm || 3);
    });
  }, [selectedDrop, drops]);

  // Close pin/loc selection with Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
        setSelectedLoc(null);
        setAddOpen(false);
        setSelectedDropId(null);
        if (dropStage !== "idle") {
          setDraftDrop(null);
          setDropStage("idle");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dropStage]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            `@import url('${FONTS}');` +
            `*{margin:0;padding:0;box-sizing:border-box}` +
            `html,body{background:${T.bg};color:${T.text};font-family:${Bf};-webkit-font-smoothing:antialiased}` +
            `::selection{background:${T.accent};color:${T.bg}}` +
            `.maplibregl-canvas{outline:none!important}` +
            `.maplibregl-ctrl-attrib{background:rgba(11,15,20,0.7)!important;color:${T.textFaint}!important;font-size:9px!important;backdrop-filter:blur(8px)}` +
            `.maplibregl-ctrl-attrib a{color:${T.textDim}!important}` +
            `.maplibregl-ctrl-bottom-right .maplibregl-ctrl{margin:0 14px 14px 0!important;background:rgba(17,24,32,0.85)!important;backdrop-filter:blur(12px);border:1px solid ${T.border}!important;box-shadow:0 4px 20px rgba(0,0,0,0.3)!important}` +
            `.maplibregl-ctrl button{background:transparent!important;filter:invert(0.85) hue-rotate(180deg)}` +
            `.maplibregl-ctrl button:hover{background:${T.surfaceHi}!important}` +
            `input,textarea,select,button{font-family:${Bf}}` +
            `input:focus,textarea:focus,select:focus{outline:none}` +
            `.glass{background:rgba(17,24,32,0.72);backdrop-filter:blur(20px) saturate(1.2);-webkit-backdrop-filter:blur(20px) saturate(1.2);border:1px solid ${T.border};box-shadow:0 8px 32px rgba(0,0,0,0.4)}` +
            `.glass-hi{background:rgba(20,28,38,0.85);backdrop-filter:blur(24px) saturate(1.3);-webkit-backdrop-filter:blur(24px) saturate(1.3);border:1px solid ${T.borderHi};box-shadow:0 12px 40px rgba(0,0,0,0.5)}` +
            `@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}` +
            `@keyframes fadeIn{from{opacity:0}to{opacity:1}}` +
            `@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}` +
            `@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}` +
            `@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 ${T.accentGlow}}50%{box-shadow:0 0 0 12px rgba(212,168,67,0)}}` +
            `@keyframes spin{to{transform:rotate(360deg)}}` +
            `.spin{animation:spin 1s linear infinite}` +
            `.scrollbar::-webkit-scrollbar{width:6px}` +
            `.scrollbar::-webkit-scrollbar-track{background:transparent}` +
            `.scrollbar::-webkit-scrollbar-thumb{background:${T.borderHi};border-radius:3px}` +
            `button:disabled{cursor:not-allowed;opacity:0.4}` +
            `.link:hover{color:${T.accent}!important}`,
        }}
      />

      {/* ===================== MAP SHELL ===================== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: T.bg,
          overflow: "hidden",
        }}
      >
        {/* The map canvas fills everything */}
        <div
          ref={mapContainerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
        />

        {/* Loading state */}
        {!mapReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: T.bg,
              zIndex: 100,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontFamily: Sf,
                fontSize: 32,
                fontWeight: 900,
                color: T.text,
                letterSpacing: -0.5,
                marginBottom: 10,
              }}
            >
              Bambai Bhada
            </div>
            <div
              style={{
                fontFamily: Mf,
                fontSize: 10,
                letterSpacing: 3,
                color: T.textFaint,
                textTransform: "uppercase",
                animation: "pulse 1.4s infinite",
              }}
            >
              Loading India's rent map
            </div>
          </div>
        )}

        {/* ===================== OVERLAY LAYER ===================== */}
        {mapReady && (
          <>
            {/* ==================== TOP BAR ==================== */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? 12 : 18,
                left: isMobile ? 12 : 18,
                right: isMobile ? 12 : 18,
                zIndex: 500,
                display: "flex",
                alignItems: "center",
                gap: 10,
                animation: "fadeUp 0.5s ease-out",
              }}
            >
              {/* Brand + back */}
              <a
                href="https://boredfolio.com"
                className="glass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: isMobile ? "11px 12px" : "11px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  color: T.text,
                  flexShrink: 0,
                  height: 44,
                }}
                title="Back to boredfolio"
              >
                <span style={{ color: T.textFaint, fontSize: 15, lineHeight: 1 }}>←</span>
                {!isMobile && (
                  <span
                    style={{
                      fontFamily: Bf,
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: -0.4,
                      lineHeight: 1,
                    }}
                  >
                    <span style={{ color: T.accent }}>Bambai Bhada</span>
                  </span>
                )}
              </a>

              {/* Search bar (inline, takes remaining space) */}
              <div
                className="glass"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  borderRadius: 12,
                  gap: 10,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    color: T.textFaint,
                    flexShrink: 0,
                  }}
                >
                  FIND
                </span>
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={
                    isMobile
                      ? `Search ${CITY_REGISTRY[city].name}…`
                      : `Search any ${CITY_REGISTRY[city].name} neighbourhood or address`
                  }
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: "none",
                    color: T.text,
                    fontSize: 13,
                    fontFamily: Bf,
                  }}
                />
                {searching && (
                  <div
                    className="spin"
                    style={{
                      width: 14,
                      height: 14,
                      border: `2px solid ${T.border}`,
                      borderTopColor: T.accent,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                )}
                {!searching && searchQ.length > 0 && (
                  <button
                    onClick={() => setSearchQ("")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: T.textFaint,
                      cursor: "pointer",
                      fontSize: 16,
                      lineHeight: 1,
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                )}

                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                  <div
                    className="glass-hi scrollbar"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      borderRadius: 12,
                      maxHeight: 300,
                      overflowY: "auto",
                      animation: "fadeUp 0.2s ease-out",
                    }}
                  >
                    {searchResults.map((r, i) => (
                      <button
                        key={r.place_id || i}
                        onClick={() => {
                          flyTo(parseFloat(r.lon), parseFloat(r.lat), 14.5);
                          setSearchResults([]);
                          setSearchQ("");
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "11px 16px",
                          background: "transparent",
                          border: "none",
                          borderBottom:
                            i < searchResults.length - 1 ? `1px solid ${T.border}` : "none",
                          color: T.text,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHi)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>
                          {r.display_name?.split(",")[0] || r.name}
                        </div>
                        <div style={{ fontSize: 10, color: T.textFaint, fontFamily: Mf }}>
                          {r.display_name?.split(",").slice(1, 4).join(",").trim()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* BHK segmented (desktop only) */}
              {!isMobile && (
                <div
                  className="glass"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    borderRadius: 12,
                    gap: 2,
                    height: 44,
                    flexShrink: 0,
                  }}
                >
                  {[
                    { n: 0, label: "All" },
                    { n: 1, label: "1" },
                    { n: 2, label: "2" },
                    { n: 3, label: "3" },
                  ].map((b) => (
                    <button
                      key={b.n}
                      onClick={() => setBhk(b.n as BhkFilter)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "0 12px",
                        height: 36,
                        background: bhk === b.n ? T.accent : "transparent",
                        color: bhk === b.n ? T.bg : T.textDim,
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        minWidth: 36,
                        transition: "all 0.15s",
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}

              {/* City switcher — mobile: single pill that cycles, desktop: segmented */}
              {isMobile ? (
                <button
                  onClick={() => {
                    const idx = CITY_ORDER.indexOf(city);
                    const next = CITY_ORDER[(idx + 1) % CITY_ORDER.length];
                    setCity(next);
                  }}
                  className="glass"
                  title="Tap to switch city"
                  style={{
                    height: 44,
                    padding: "0 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    color: T.accent,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: Mf,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    flexShrink: 0,
                    borderColor: T.accent + "55",
                  }}
                >
                  {CITY_REGISTRY[city].name}
                </button>
              ) : (
                <div
                  className="glass"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: 3,
                    borderRadius: 12,
                    gap: 2,
                    height: 44,
                    flexShrink: 0,
                  }}
                >
                  {CITY_ORDER.map((k) => (
                    <button
                      key={k}
                      onClick={() => setCity(k)}
                      style={{
                        fontFamily: Mf,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "0 12px",
                        height: 36,
                        background: city === k ? T.accent : "transparent",
                        color: city === k ? T.bg : T.textDim,
                        border: "none",
                        borderRadius: 9,
                        cursor: "pointer",
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        minWidth: 36,
                      }}
                    >
                      {CITY_REGISTRY[k].name}
                    </button>
                  ))}
                </div>
              )}

              {/* Image mode toggle (satellite basemap) */}
              <button
                onClick={() => setImageMode((v) => !v)}
                className="glass"
                title={imageMode ? "Back to map view" : "Switch to satellite view"}
                style={{
                  height: 44,
                  padding: "0 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  color: imageMode ? T.accent : T.textDim,
                  background: imageMode ? T.accentDim : "rgba(17,24,32,0.72)",
                  borderColor: imageMode ? T.accent : T.border,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  flexShrink: 0,
                  fontFamily: Mf,
                }}
              >
                {imageMode ? "MAP" : "SAT"}
              </button>

              {/* Locate me */}
              <button
                onClick={locateMe}
                className="glass"
                style={{
                  height: 44,
                  width: 44,
                  padding: 0,
                  borderRadius: 12,
                  cursor: locateState === "asking" ? "wait" : "pointer",
                  color: userLoc ? T.blue : T.textDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
                title={
                  locateState === "denied"
                    ? "Location permission denied"
                    : locateState === "found"
                    ? "Your location"
                    : "Find my location"
                }
              >
                <span
                  style={{
                    position: "relative",
                    width: 14,
                    height: 14,
                    display: "inline-block",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: `2px solid ${userLoc ? T.blue : T.textDim}`,
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 4,
                      height: 4,
                      background: userLoc ? T.blue : T.textDim,
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                  {userLoc && (
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: -6,
                        width: 2,
                        height: 4,
                        background: T.blue,
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}
                </span>
              </button>

              {/* Filters toggle */}
              <button
                onClick={() => setFiltersOpen((f) => !f)}
                className="glass"
                style={{
                  height: 44,
                  padding: "0 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  color:
                    filtersOpen || commuteTo || monsoon || rentMax < 300
                      ? T.accent
                      : T.textDim,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
                title="Filters"
              >
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                  }}
                >
                  FILTERS
                </span>
                {(commuteTo || monsoon || rentMax < 300) && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: T.accent,
                      boxShadow: `0 0 8px ${T.accent}`,
                    }}
                  />
                )}
              </button>

              {/* Drop pin */}
              <button
                onClick={() => {
                  if (dropStage === "idle") setDropStage("picking");
                  else cancelDraft();
                }}
                style={{
                  height: 44,
                  padding: isMobile ? "0 14px" : "0 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: dropStage === "idle" ? T.bg : T.accent,
                  background: dropStage === "idle" ? T.accent : "transparent",
                  border: `1px solid ${T.accent}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: dropStage === "idle" ? `0 4px 16px ${T.accentGlow}` : "none",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {dropStage === "idle" ? (isMobile ? "DROP" : "DROP A PIN") : "CANCEL"}
              </button>
            </div>

            {/* ==================== DROP MODE BANNER ==================== */}
            {dropStage === "picking" && (
              <div
                className="glass-hi"
                style={{
                  position: "absolute",
                  top: isMobile ? 68 : 76,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 510,
                  padding: "12px 20px",
                  borderRadius: 999,
                  border: `1px solid ${T.accent}`,
                  color: T.accent,
                  fontFamily: Mf,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  animation: "fadeUp 0.25s ease-out",
                }}
              >
                Click anywhere on the map to drop your pin
              </div>
            )}

            {/* ==================== DRAFT QUICK-FORM ==================== */}
            {dropStage === "filling" && draftDrop && (
              <DraftForm
                draft={draftDrop}
                setDraft={setDraftDrop}
                onSave={saveDraft}
                onCancel={cancelDraft}
                isMobile={isMobile}
              />
            )}

            {/* ==================== SELECTED DROP CARD ==================== */}
            {selectedDrop && (
              <DropCard
                drop={selectedDrop}
                matches={selectedDropMatches}
                isMobile={isMobile}
                onClose={() => setSelectedDropId(null)}
                onDelete={() => deleteDrop(selectedDrop.id)}
                onFocusMatch={(id) => {
                  setSelectedDropId(id);
                  const m = drops.find((d) => d.id === id);
                  if (m) flyTo(m.lng, m.lat, 14);
                }}
              />
            )}

            {/* ==================== FILTERS PANEL ==================== */}
            {filtersOpen && (
              <div
                className="glass-hi"
                style={{
                  position: "absolute",
                  top: isMobile ? 68 : 74,
                  right: isMobile ? 12 : 18,
                  zIndex: 499,
                  width: isMobile ? "calc(100% - 24px)" : 320,
                  padding: "20px 22px",
                  borderRadius: 14,
                  animation: "fadeUp 0.22s ease-out",
                }}
              >
                {/* Mobile BHK */}
                {isMobile && (
                  <>
                    <FormLabel>BHK</FormLabel>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: 18,
                        background: T.surface,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: 3,
                        gap: 2,
                      }}
                    >
                      {[
                        { n: 0, label: "All" },
                        { n: 1, label: "1 BHK" },
                        { n: 2, label: "2 BHK" },
                        { n: 3, label: "3 BHK" },
                      ].map((b) => (
                        <button
                          key={b.n}
                          onClick={() => setBhk(b.n as BhkFilter)}
                          style={{
                            flex: 1,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "8px 4px",
                            background: bhk === b.n ? T.accent : "transparent",
                            color: bhk === b.n ? T.bg : T.textDim,
                            border: "none",
                            borderRadius: 7,
                            cursor: "pointer",
                          }}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <FormLabel>View mode</FormLabel>
                <select
                  value={commuteTo}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCommuteTo(v);
                    if (v) setMonsoon(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: T.text,
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 9,
                    cursor: "pointer",
                    marginBottom: 12,
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23E8EDF2' d='M5 6L0 0h10z' opacity='.5'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: 36,
                  }}
                >
                  <option value="" style={{ background: T.bg2 }}>
                    View — Zone score
                  </option>
                  {cfg.offices.map((o) => (
                    <option key={o.key} value={o.key} style={{ background: T.bg2 }}>
                      Commute to {o.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setMonsoon((m) => !m);
                    if (!monsoon) setCommuteTo("");
                  }}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: monsoon ? T.blue : T.textDim,
                    background: monsoon ? T.blueDim : T.surface,
                    border: `1px solid ${monsoon ? T.blue : T.border}`,
                    borderRadius: 9,
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>Monsoon mode {monsoon ? "ON" : "OFF"}</span>
                </button>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontFamily: Mf,
                    fontSize: 9,
                    letterSpacing: 1.6,
                    color: T.textFaint,
                    textTransform: "uppercase",
                  }}
                >
                  <span>Max rent</span>
                  <span style={{ color: T.accent, fontWeight: 700 }}>{fmtK(rentMax)}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={300}
                  step={5}
                  value={rentMax}
                  onChange={(e) => setRentMax(parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: T.accent, cursor: "pointer" }}
                />
              </div>
            )}

            {/* ==================== BOTTOM STATUS STRIP (live data) ==================== */}
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "calc(14px + env(safe-area-inset-bottom))" : 22,
                left: isMobile ? 14 : "50%",
                right: isMobile ? 14 : "auto",
                transform: isMobile ? "none" : "translateX(-50%)",
                zIndex: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "fadeUp 0.5s ease-out 0.1s backwards",
                maxWidth: isMobile ? "calc(100% - 28px)" : "calc(100% - 280px)",
                flexWrap: "wrap",
                justifyContent: isMobile ? "flex-end" : "center",
                overflowX: isMobile ? "auto" : "visible",
              }}
            >
              {weather && <WeatherPill w={weather} cityName={CITY_REGISTRY[city].name} />}
              {aqi && <AqiPill aqi={aqi} />}
              {!isMobile && traffic && <TrafficPill traffic={traffic} />}
              <LiveCounter totalKs={stats.totalKs} count={stats.count} />
              {!isMobile && realDataMeta && (
                <DataSourcePill
                  generatedAt={realDataMeta.generatedAt}
                  total={realDataMeta.total}
                />
              )}
              {!isMobile && (
                <LiveFeedsPill
                  counts={{
                    weather: !!weather,
                    aqi: !!aqi,
                    radar: !!rainTileUrl,
                    stations: stations.length,
                    metro: metro.length,
                    construction: construction.length,
                  }}
                />
              )}
            </div>

            {/* ==================== LEGEND (compact, bottom-left) ==================== */}
            <div
              className="glass"
              style={{
                position: "absolute",
                bottom: isMobile ? 14 : 22,
                left: isMobile ? 14 : 18,
                zIndex: 500,
                padding: "10px 13px",
                borderRadius: 10,
                animation: "fadeUp 0.5s ease-out 0.2s backwards",
              }}
            >
              <div
                style={{
                  fontFamily: Mf,
                  fontSize: 8,
                  letterSpacing: 1.5,
                  color: T.textFaint,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {monsoon
                  ? "Flood risk"
                  : commuteTo
                  ? `Commute · ${cfg.offices.find((o) => o.key === commuteTo)?.short}`
                  : "Zone score"}
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                {[
                  { c: T.green, l: monsoon ? "Dry" : commuteTo ? "≤20m" : "Green" },
                  { c: T.yellow, l: monsoon ? "Wet" : commuteTo ? "≤40m" : "Yellow" },
                  { c: T.red, l: monsoon ? "Flood" : commuteTo ? ">40m" : "Red" },
                ].map((x) => (
                  <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: x.c,
                        boxShadow: `0 0 6px ${x.c}66`,
                      }}
                    />
                    <span style={{ fontSize: 10, color: T.text }}>{x.l}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  paddingTop: 6,
                  borderTop: `1px solid ${T.border}`,
                  fontSize: 9,
                  color: T.textFaint,
                  fontFamily: Mf,
                  flexWrap: "wrap",
                  maxWidth: 220,
                }}
              >
                {cfg.trainLines.map((tl) => {
                  const short = tl.name.replace(/\s*Line\s*$/i, "").trim();
                  return (
                    <span key={tl.id}>
                      <span style={{ color: tl.color, fontSize: 11 }}>─</span> {short}
                    </span>
                  );
                })}
                <span>
                  <span style={{ color: T.accent, fontSize: 11 }}>■</span> Office
                </span>
              </div>
            </div>

            {/* ==================== PER-CITY CRITICAL ISSUE BANNER ==================== */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? 68 : 76,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 450,
                pointerEvents: "none",
                maxWidth: isMobile ? "calc(100% - 28px)" : 520,
                animation: "fadeUp 0.6s ease-out 0.3s backwards",
              }}
            >
              <div
                className="glass"
                style={{
                  padding: "9px 16px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderColor: T.accent + "44",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.accent,
                    boxShadow: `0 0 8px ${T.accent}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1.4,
                    color: T.accent,
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {CITY_REGISTRY[city].name} · {CITY_REGISTRY[city].critical.label}
                </span>
                {!isMobile && (
                  <>
                    <span style={{ color: T.textFaint, flexShrink: 0 }}>·</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.textDim,
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {CITY_REGISTRY[city].critical.line}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* ==================== DENSITY POPUP (click-empty-map) ==================== */}
            {densityPopup && (
              <DensityPopup
                popup={densityPopup}
                onClose={() => setDensityPopup(null)}
                isMobile={isMobile}
              />
            )}

            {/* ==================== SELECTED PIN CARD ==================== */}
            {selected && selectedLoc && (
              <PinCard
                pin={selected}
                loc={selectedLoc}
                commuteTo={commuteTo}
                offices={cfg.offices}
                isMobile={isMobile}
                onClose={() => {
                  setSelected(null);
                  setSelectedLoc(null);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* ===================== WELCOME OVERLAY (first visit) ===================== */}
      {showWelcome && mapReady && <WelcomeOverlay onDismiss={dismissWelcome} isMobile={isMobile} />}
    </>
  );
}

// ============================================================
// WELCOME OVERLAY — one-shot first-visit moment
// ============================================================
function WelcomeOverlay({ onDismiss, isMobile }: { onDismiss: () => void; isMobile: boolean }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,15,20,0.85)",
        backdropFilter: "blur(16px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        animation: "fadeIn 0.3s",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-hi"
        style={{
          borderRadius: 18,
          maxWidth: 440,
          width: "100%",
          padding: isMobile ? "30px 24px" : "40px 36px",
          animation: "fadeUp 0.4s ease-out",
        }}
      >
        <div
          style={{
            fontFamily: Mf,
            fontSize: 10,
            letterSpacing: 2.5,
            color: T.accent,
            textTransform: "uppercase",
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          BAMBAI BHADA · MUMBAI · BANGALORE · GURGAON
        </div>
        <div
          style={{
            fontFamily: Bf,
            fontSize: isMobile ? 24 : 32,
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.1,
            letterSpacing: -0.8,
            marginBottom: 14,
          }}
        >
          India's rent map
          <br />
          without the{" "}
          <span style={{ color: T.accent }}>Flat-n-Flatmates BS</span>.
        </div>
        <div
          style={{
            fontSize: 14,
            color: T.textDim,
            lineHeight: 1.6,
            marginBottom: 22,
          }}
        >
          No login. No phone numbers. No pay-to-contact paywall. Drop a pin on the map,
          write a short message, leave your Instagram handle, done.
        </div>

        {/* 3-step */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[
            { n: "01", t: "Click DROP A PIN, then click anywhere on the map" },
            { n: "02", t: "Write what you want or what you're offering — add @yourhandle" },
            { n: "03", t: "Share the link on WhatsApp — people DM you on Instagram" },
          ].map((s) => (
            <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: Mf,
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.accent,
                  letterSpacing: 1,
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {s.n}
              </span>
              <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{s.t}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onDismiss}
          style={{
            width: "100%",
            padding: "16px 20px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            background: T.accent,
            color: T.bg,
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            boxShadow: `0 8px 28px ${T.accentGlow}`,
          }}
        >
          Show me the map
        </button>

        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            color: T.textFaint,
            marginTop: 14,
            textAlign: "center",
            letterSpacing: 0.3,
            lineHeight: 1.5,
          }}
        >
          Built anonymously. Your data lives in your browser until the public backend goes live.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SEARCH BAR
// ============================================================
function SearchBar({
  q,
  setQ,
  results,
  searching,
  onPick,
  isMobile,
}: {
  q: string;
  setQ: (s: string) => void;
  results: any[];
  searching: boolean;
  onPick: (lng: number, lat: number) => void;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? 60 : 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 500,
        width: isMobile ? "calc(100% - 28px)" : 440,
        maxWidth: "calc(100% - 48px)",
      }}
    >
      <div
        className="glass"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          borderRadius: 12,
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: Mf,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: T.textFaint,
          }}
        >
          FIND
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search any locality or address"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: T.text,
            fontSize: 13,
            fontFamily: Bf,
          }}
        />
        {searching && (
          <div
            style={{
              width: 14,
              height: 14,
              border: `2px solid ${T.border}`,
              borderTopColor: T.accent,
              borderRadius: "50%",
            }}
            className="spin"
          />
        )}
        {!searching && q.length > 0 && (
          <button
            onClick={() => setQ("")}
            style={{
              background: "transparent",
              border: "none",
              color: T.textFaint,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div
          className="glass-hi scrollbar"
          style={{
            marginTop: 6,
            borderRadius: 12,
            maxHeight: 280,
            overflowY: "auto",
            animation: "fadeUp 0.2s ease-out",
          }}
        >
          {results.map((r, i) => (
            <button
              key={r.place_id || i}
              onClick={() => onPick(parseFloat(r.lon), parseFloat(r.lat))}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "11px 16px",
                background: "transparent",
                border: "none",
                borderBottom: i < results.length - 1 ? `1px solid ${T.border}` : "none",
                color: T.text,
                fontSize: 12,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHi)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {r.display_name?.split(",")[0] || r.name}
              </div>
              <div style={{ fontSize: 10, color: T.textFaint, fontFamily: Mf }}>
                {r.display_name?.split(",").slice(1, 4).join(",").trim()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LIVE COUNTER (rent pinned)
// ============================================================
function LiveCounter({ totalKs, count }: { totalKs: number; count: number }) {
  return (
    <div
      className="glass"
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 160,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: T.green,
          boxShadow: `0 0 10px ${T.green}`,
          flexShrink: 0,
        }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.5,
            color: T.textFaint,
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Bhada pinned
        </div>
        <div
          style={{
            fontFamily: Sf,
            fontSize: 18,
            fontWeight: 900,
            color: T.text,
            letterSpacing: -0.3,
          }}
        >
          {fmtCr(totalKs)}
          <span style={{ fontSize: 10, color: T.textFaint, fontWeight: 400, marginLeft: 6, fontFamily: Mf }}>
            · {count} pins
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WEATHER PILL (live)
// ============================================================
function WeatherPill({ w, cityName }: { w: Weather; cityName: string }) {
  return (
    <div
      className="glass"
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderColor: w.isRaining ? T.blue : T.border,
        background: w.isRaining ? T.blueDim : "rgba(17,24,32,0.72)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: w.isRaining ? T.blue : T.textDim,
          boxShadow: w.isRaining ? `0 0 8px ${T.blue}` : "none",
          flexShrink: 0,
        }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.5,
            color: T.textFaint,
            textTransform: "uppercase",
          }}
        >
          {cityName} now
        </div>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 12,
            fontWeight: 700,
            color: w.isRaining ? T.blue : T.text,
          }}
        >
          {Math.round(w.temperature)}° · {w.summary}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AQI PILL (live)
// ============================================================
function AqiPill({ aqi }: { aqi: AirQuality }) {
  const v = Math.round(aqi.usAqi);
  // US AQI categories: 0–50 good, 51–100 moderate, 101–150 USG, 151–200 unhealthy, 201+ very unhealthy
  let color = T.green;
  let label = "Good";
  if (v > 200) {
    color = T.red;
    label = "V.Unhealthy";
  } else if (v > 150) {
    color = T.red;
    label = "Unhealthy";
  } else if (v > 100) {
    color = T.yellow;
    label = "Sensitive";
  } else if (v > 50) {
    color = T.yellow;
    label = "Moderate";
  }
  return (
    <div
      className="glass"
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.5,
            color: T.textFaint,
            textTransform: "uppercase",
          }}
        >
          Air · US AQI
        </div>
        <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color }}>
          {v} · {label}
          <span
            style={{ fontSize: 9, color: T.textFaint, fontWeight: 400, marginLeft: 5 }}
          >
            PM2.5 {Math.round(aqi.pm25)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TRAFFIC PILL (time-aware, local)
// ============================================================
function TrafficPill({
  traffic,
}: {
  traffic: { level: "peak" | "moderate" | "off"; label: string; note: string };
}) {
  const color = traffic.level === "peak" ? T.red : traffic.level === "moderate" ? T.yellow : T.green;
  return (
    <div
      className="glass"
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />
      <div style={{ lineHeight: 1.1 }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.5,
            color: T.textFaint,
            textTransform: "uppercase",
          }}
        >
          Traffic · now
        </div>
        <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color }}>
          {traffic.label}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DATA SOURCE PILL — shows scraped pin count + last refresh time
// so the user knows the map is actually real Reddit data and not
// a static mockup.
// ============================================================
function DataSourcePill({
  generatedAt,
  total,
}: {
  generatedAt: string;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const age = Math.max(0, Date.now() - new Date(generatedAt).getTime());
  const hours = Math.floor(age / 3600000);
  const days = Math.floor(hours / 24);
  const ago =
    hours < 1 ? "<1h ago" : days >= 1 ? `${days}d ago` : `${hours}h ago`;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass"
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          border: `1px solid ${T.green}44`,
          background: "rgba(74,222,128,0.08)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: T.green,
            boxShadow: `0 0 10px ${T.green}`,
            flexShrink: 0,
          }}
        />
        <div style={{ lineHeight: 1.1, textAlign: "left" }}>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.5,
              color: T.textFaint,
              textTransform: "uppercase",
            }}
          >
            Real data
          </div>
          <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: T.green }}>
            {total} drops · {ago}
          </div>
        </div>
      </button>
      {open && (
        <div
          className="glass-hi"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            right: 0,
            borderRadius: 10,
            padding: "14px 16px",
            minWidth: 280,
            animation: "fadeUp 0.2s ease-out",
          }}
        >
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.5,
              color: T.textFaint,
              textTransform: "uppercase",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Where this data comes from
          </div>
          <div style={{ fontFamily: Bf, fontSize: 12, color: T.textDim, lineHeight: 1.55 }}>
            {total} real rental posts scraped from public Reddit:
            <br />
            <span style={{ color: T.text, fontWeight: 600 }}>
              r/bangaloreflats, r/bangalorehousing, r/mumbairental, r/delhirentals, r/Gurgaonflats,
              r/bangalore, r/mumbai, r/gurgaon, r/navimumbai, r/indianrealestate
            </span>
            , plus classifieds megathread comments. BHK, rent and Instagram handles are parsed from
            post text. Every pin links back to its source.
          </div>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              color: T.textFaint,
              marginTop: 10,
              letterSpacing: 0.5,
            }}
          >
            Last refreshed {ago} · rebuilds on every deploy
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LIVE FEEDS PILL (shows what's connected)
// ============================================================
function LiveFeedsPill({
  counts,
}: {
  counts: {
    weather: boolean;
    aqi: boolean;
    radar: boolean;
    stations: number;
    metro: number;
    construction: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const active = [
    counts.weather && "Weather",
    counts.aqi && "AQI",
    counts.radar && "Rain radar",
    counts.stations > 0 && `${counts.stations} stations`,
    counts.metro > 0 && `${counts.metro} metro`,
    counts.construction > 0 && `${counts.construction} sites`,
  ].filter(Boolean);
  const total = active.length;
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass"
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          border: `1px solid ${T.border}`,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: T.green,
            boxShadow: `0 0 10px ${T.green}`,
            flexShrink: 0,
            animation: "pulse 2s infinite",
          }}
        />
        <div style={{ lineHeight: 1.1, textAlign: "left" }}>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.5,
              color: T.textFaint,
              textTransform: "uppercase",
            }}
          >
            Live feeds
          </div>
          <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: T.text }}>
            {total} active
          </div>
        </div>
      </button>
      {open && (
        <div
          className="glass-hi"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            right: 0,
            borderRadius: 10,
            padding: "10px 14px",
            minWidth: 180,
            animation: "fadeUp 0.2s ease-out",
          }}
        >
          {active.map((a) => (
            <div
              key={String(a)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 0",
                fontFamily: Mf,
                fontSize: 10,
                color: T.text,
              }}
            >
              <span style={{ color: T.green, fontSize: 8 }}>●</span>
              {String(a)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PIN CARD (selected pin — shows pin + its locality scorecard)
// ============================================================
function PinCard({
  pin,
  loc,
  commuteTo,
  offices,
  isMobile,
  onClose,
}: {
  pin: Pin;
  loc: Locality;
  commuteTo: string;
  offices: { key: string; name: string; short: string; lng: number; lat: number }[];
  isMobile: boolean;
  onClose: () => void;
}) {
  const zone = zoneOf(loc.sc);
  const avg = avgScore(loc.sc);
  const median = pin.bhk === 1 ? loc.r1 : pin.bhk === 2 ? loc.r2 : loc.r3;
  const delta = pin.rent - median;
  const deltaPct = Math.round((delta / median) * 100);

  return (
    <div
      className="glass-hi scrollbar"
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 22,
        right: isMobile ? 0 : 24,
        bottom: isMobile ? 0 : 24,
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : 380,
        maxHeight: isMobile ? "68vh" : "calc(100% - 44px)",
        overflow: "auto",
        zIndex: 700,
        borderRadius: isMobile ? "16px 16px 0 0" : 16,
        animation: isMobile ? "fadeUp 0.3s ease-out" : "slideIn 0.3s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "22px 24px 18px",
          background: zoneBg(zone),
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          backdropFilter: "blur(20px)",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: Mf,
                fontSize: 9,
                letterSpacing: 1.8,
                color: zoneColor(zone),
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              {zoneLabel(zone)} Zone · {avg.toFixed(1)}/10
              {pin.source === "real" && (
                <span style={{ color: T.green, marginLeft: 8, fontWeight: 700 }}>
                  · LIVE · r/{pin.subreddit}
                </span>
              )}
              {pin.source === "seed" && (
                <span style={{ color: T.textFaint, marginLeft: 8, fontWeight: 400 }}>
                  · SEED DATA
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: Bf,
                fontSize: 30,
                fontWeight: 700,
                color: T.text,
                lineHeight: 1.1,
                letterSpacing: -0.8,
                marginBottom: 4,
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span>{fmtK(pin.rent)}</span>
              <span style={{ fontSize: 20, color: T.textDim, fontWeight: 500 }}>·</span>
              <span style={{ fontSize: 22, color: T.textDim, fontWeight: 600 }}>{pin.bhk} BHK</span>
            </div>
            <div style={{ fontSize: 12, color: T.textDim, fontFamily: Bf }}>
              {pin.locName} · {loc.area}
              {pin.furnished && <span style={{ color: T.accent, marginLeft: 6 }}>· furnished</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: T.textFaint,
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
              padding: 4,
              flexShrink: 0,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Rent vs median delta */}
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            background: delta > 0 ? T.redDim : delta < 0 ? T.greenDim : T.surface,
            border: `1px solid ${delta > 0 ? T.red + "44" : delta < 0 ? T.green + "44" : T.border}`,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.3,
              color: T.textFaint,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            vs locality median
          </div>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 13,
              fontWeight: 700,
              color: delta > 0 ? T.red : delta < 0 ? T.green : T.text,
            }}
          >
            {delta > 0
              ? `+${deltaPct}% (${fmtK(Math.abs(delta))} over)`
              : delta < 0
              ? `${deltaPct}% (${fmtK(Math.abs(delta))} under)`
              : "Right on median"}
            <span style={{ color: T.textFaint, fontWeight: 400, marginLeft: 6 }}>
              ({fmtK(median)} median)
            </span>
          </div>
        </div>
      </div>

      {/* Real post body (when the pin is sourced from a live scrape) */}
      {pin.source === "real" && pin.title && (
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${T.border}`,
            background: "rgba(74,222,128,0.04)",
          }}
        >
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.8,
              color: T.green,
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            {pin.role === "has-place"
              ? "Someone has a place"
              : pin.role === "seeking"
              ? "Someone is looking"
              : "Rental post"}
            {pin.createdAt && (
              <span style={{ color: T.textFaint, marginLeft: 8, fontWeight: 400 }}>
                · {fmtRelativeTime(pin.createdAt)}
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: Bf,
              fontSize: 14,
              fontWeight: 600,
              color: T.text,
              lineHeight: 1.35,
              marginBottom: pin.message ? 8 : 12,
            }}
          >
            {pin.title}
          </div>
          {pin.message && (
            <div
              style={{
                fontFamily: Bf,
                fontSize: 12,
                color: T.textDim,
                lineHeight: 1.5,
                maxHeight: 96,
                overflow: "hidden",
                position: "relative",
                marginBottom: 12,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {pin.message.replace(/\\n/g, "\n").slice(0, 420)}
              {pin.message.length > 420 && "…"}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {pin.handle && (
              <a
                href={`https://instagram.com/${pin.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: Mf,
                  fontSize: 10,
                  letterSpacing: 0.5,
                  color: T.accent,
                  textDecoration: "none",
                  padding: "5px 10px",
                  border: `1px solid ${T.accent}55`,
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                @{pin.handle}
              </a>
            )}
            {pin.sourceUrl && (
              <a
                href={pin.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: Mf,
                  fontSize: 10,
                  letterSpacing: 0.5,
                  color: T.green,
                  textDecoration: "none",
                  padding: "5px 10px",
                  border: `1px solid ${T.green}55`,
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                VIEW ON REDDIT →
              </a>
            )}
            {pin.author && (
              <span
                style={{
                  fontFamily: Mf,
                  fontSize: 9,
                  color: T.textFaint,
                  letterSpacing: 0.5,
                }}
              >
                by u/{pin.author}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tip */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${T.border}`,
          fontFamily: Sf,
          fontSize: 15,
          fontStyle: "italic",
          color: T.textDim,
          lineHeight: 1.45,
        }}
      >
        “{loc.tip}”
      </div>

      {/* 6 axes */}
      <div style={{ padding: "18px 24px" }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.8,
            color: T.textFaint,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          The 6 scores · higher is better
        </div>
        {AXES.map((a) => {
          const s = loc.sc[a.i];
          const barColor = s >= 7 ? T.green : s >= 4 ? T.yellow : T.red;
          return (
            <div key={a.i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    color: T.textFaint,
                    width: 16,
                    textAlign: "center",
                  }}
                >
                  {a.short}
                </span>
                <span style={{ fontSize: 12, color: T.text, fontWeight: 500, flex: 1 }}>{a.label}</span>
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 11,
                    fontWeight: 700,
                    color: barColor,
                  }}
                >
                  {s}/10
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: T.border,
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    width: `${s * 10}%`,
                    height: "100%",
                    background: barColor,
                    borderRadius: 2,
                    boxShadow: `0 0 8px ${barColor}88`,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textFaint,
                  lineHeight: 1.5,
                  paddingLeft: 21,
                }}
              >
                {loc.rz[a.i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Commute row */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: `1px solid ${T.border}`,
          background: T.surface,
        }}
      >
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.8,
            color: T.textFaint,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Peak-hour commute (min)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
          {offices.map((o) => {
            const m = loc.com[o.key];
            if (m == null) return null;
            const col = commuteColor(m);
            const isActive = commuteTo === o.key;
            return (
              <div
                key={o.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  background: isActive ? T.surfaceHi : "transparent",
                  border: `1px solid ${isActive ? col + "88" : "transparent"}`,
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 10, color: T.textDim }}>{o.short}</span>
                <span style={{ fontFamily: Mf, fontSize: 11, fontWeight: 700, color: col }}>{m}m</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flags */}
      {loc.flags.length > 0 && (
        <div style={{ padding: "14px 24px 20px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {loc.flags.map((f) => (
            <span
              key={f}
              style={{
                fontFamily: Mf,
                fontSize: 9,
                padding: "4px 9px",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 999,
                color: T.textDim,
                letterSpacing: 0.3,
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DRAFT QUICK-FORM — inline floating form for drop flow
// ============================================================
function DraftForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  isMobile,
}: {
  draft: Partial<UserDrop>;
  setDraft: (d: Partial<UserDrop>) => void;
  onSave: () => void;
  onCancel: () => void;
  isMobile: boolean;
}) {
  const isRequest = draft.kind === "request";
  const message = draft.message || "";
  const parsed = useMemo(() => parseMessage(message), [message]);
  const canSave = message.trim().length >= 10;

  const placeholder = isRequest
    ? "Looking for a 2BHK in Bandra W. Budget ₹70k. Pet-friendly. Move in by 1st May. DM me @yourhandle"
    : "2BHK available in Khar W. ₹85k furnished. Sea-facing, 8th floor. Bachelors welcome. DM @yourhandle";

  return (
    <div
      className="glass-hi scrollbar"
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 76,
        right: isMobile ? 0 : 24,
        bottom: isMobile ? 0 : 24,
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : 420,
        maxHeight: isMobile ? "78vh" : "calc(100% - 100px)",
        overflow: "auto",
        zIndex: 700,
        borderRadius: isMobile ? "18px 18px 0 0" : 16,
        padding: isMobile
          ? "18px 20px calc(20px + env(safe-area-inset-bottom))"
          : "22px 24px 20px",
        animation: isMobile ? "fadeUp 0.3s ease-out" : "slideIn 0.25s ease-out",
      }}
    >
      {/* Mobile drag handle */}
      {isMobile && (
        <div
          style={{
            width: 40,
            height: 4,
            background: T.borderHi,
            borderRadius: 999,
            margin: "0 auto 14px",
          }}
        />
      )}

      {/* Role toggle */}
      <div
        style={{
          display: "flex",
          gap: 0,
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: 3,
          marginBottom: 16,
        }}
      >
        {[
          { k: "request", label: "I NEED A PLACE" },
          { k: "listing", label: "I HAVE A PLACE" },
        ].map((r) => (
          <button
            key={r.k}
            onClick={() => setDraft({ ...draft, kind: r.k as DropKind })}
            style={{
              flex: 1,
              padding: "11px 4px",
              fontFamily: Mf,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.8,
              background: draft.kind === r.k ? T.accent : "transparent",
              color: draft.kind === r.k ? T.bg : T.textDim,
              border: "none",
              borderRadius: 7,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Big message textarea */}
      <FormLabel>Your message</FormLabel>
      <textarea
        value={message}
        onChange={(e) => setDraft({ ...draft, message: e.target.value.slice(0, 500) })}
        placeholder={placeholder}
        rows={isMobile ? 5 : 6}
        autoFocus
        style={{
          width: "100%",
          fontFamily: Bf,
          fontSize: 14,
          lineHeight: 1.55,
          padding: "14px 16px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          color: T.text,
          outline: "none",
          resize: "none",
          marginBottom: 8,
        }}
      />

      {/* Live parse feedback */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 10,
          minHeight: 22,
        }}
      >
        {parsed.bhk && <ParseChip label={`${parsed.bhk}BHK`} />}
        {parsed.amount && <ParseChip label={`₹${parsed.amount}k`} />}
        {parsed.radiusKm && <ParseChip label={`${parsed.radiusKm}km`} />}
        {parsed.instagram && <ParseChip label={`@${parsed.instagram}`} highlighted />}
      </div>

      <div
        style={{
          fontFamily: Mf,
          fontSize: 9,
          color: parsed.instagram ? T.green : T.textFaint,
          lineHeight: 1.5,
          marginBottom: 16,
          letterSpacing: 0.3,
        }}
      >
        {parsed.instagram
          ? "Instagram detected — people tap to DM you directly."
          : "Tip — include @yourhandle so people can message you on Instagram."}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "14px 20px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: "transparent",
            color: T.textDim,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          style={{
            flex: 2,
            padding: "14px 20px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            background: canSave ? T.accent : T.border,
            color: canSave ? T.bg : T.textFaint,
            border: "none",
            borderRadius: 10,
            cursor: canSave ? "pointer" : "not-allowed",
            boxShadow: canSave ? `0 6px 20px ${T.accentGlow}` : "none",
          }}
        >
          Post it
        </button>
      </div>
    </div>
  );
}

// ============================================================
// DENSITY POPUP — shows AQI, pop density, traffic for clicked coord
// ============================================================
function DensityPopup({
  popup,
  onClose,
  isMobile,
}: {
  popup: {
    lat: number;
    lng: number;
    loading: boolean;
    aqi?: number;
    pm25?: number;
    popDensity?: "low" | "medium" | "high" | "very high";
    traffic?: "flowing" | "moderate" | "heavy";
  };
  onClose: () => void;
  isMobile: boolean;
}) {
  const aqiColor =
    popup.aqi == null
      ? T.textFaint
      : popup.aqi <= 50
      ? T.green
      : popup.aqi <= 100
      ? T.yellow
      : T.red;
  const popColor =
    popup.popDensity === "low"
      ? T.green
      : popup.popDensity === "medium"
      ? T.yellow
      : popup.popDensity === "high"
      ? "#FB923C"
      : popup.popDensity === "very high"
      ? T.red
      : T.textFaint;
  const trafficColor =
    popup.traffic === "flowing"
      ? T.green
      : popup.traffic === "moderate"
      ? T.yellow
      : popup.traffic === "heavy"
      ? T.red
      : T.textFaint;

  return (
    <div
      className="glass-hi"
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 120,
        right: isMobile ? 14 : 24,
        bottom: isMobile ? 110 : "auto",
        left: isMobile ? 14 : "auto",
        width: isMobile ? "auto" : 280,
        maxWidth: isMobile ? "calc(100% - 28px)" : undefined,
        zIndex: 650,
        borderRadius: 14,
        padding: "14px 18px",
        animation: "fadeUp 0.22s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 9,
              letterSpacing: 1.8,
              color: T.textFaint,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            At this point
          </div>
          <div style={{ fontFamily: Mf, fontSize: 11, color: T.text }}>
            {popup.lat.toFixed(4)}, {popup.lng.toFixed(4)}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: T.textFaint,
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            padding: 2,
          }}
        >
          ×
        </button>
      </div>

      {popup.loading && (
        <div
          style={{
            fontFamily: Mf,
            fontSize: 10,
            color: T.textFaint,
            animation: "pulse 1.4s infinite",
          }}
        >
          Pulling live data…
        </div>
      )}

      {!popup.loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <DensityRow
            label="POLLUTION"
            value={popup.aqi != null ? `${popup.aqi} AQI` : "No data"}
            sub={popup.pm25 != null ? `PM2.5 · ${popup.pm25}` : ""}
            color={aqiColor}
          />
          <DensityRow
            label="POPULATION"
            value={popup.popDensity ? popup.popDensity.toUpperCase() : "—"}
            sub={popup.popDensity === "very high" ? "Chawl-belt density" : popup.popDensity === "low" ? "Planned, open" : ""}
            color={popColor}
          />
          <DensityRow
            label="TRAFFIC (now)"
            value={popup.traffic ? popup.traffic.toUpperCase() : "—"}
            sub={popup.traffic === "heavy" ? "Peak hour" : popup.traffic === "flowing" ? "Off peak" : "Building up"}
            color={trafficColor}
          />
        </div>
      )}
    </div>
  );
}

function DensityRow({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />
      <div style={{ lineHeight: 1.15, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 8,
            letterSpacing: 1.5,
            color: T.textFaint,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color }}>{value}</div>
        {sub && (
          <div style={{ fontFamily: Mf, fontSize: 9, color: T.textFaint, marginTop: 2 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function ParseChip({ label, highlighted }: { label: string; highlighted?: boolean }) {
  return (
    <span
      style={{
        fontFamily: Mf,
        fontSize: 10,
        padding: "4px 10px",
        background: highlighted ? T.accentDim : T.surface,
        border: `1px solid ${highlighted ? T.accent : T.border}`,
        borderRadius: 999,
        color: highlighted ? T.accent : T.textDim,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </span>
  );
}

// ============================================================
// DROP CARD — shown when user selects a dropped pin
// ============================================================
function DropCard({
  drop,
  matches,
  isMobile,
  onClose,
  onDelete,
  onFocusMatch,
}: {
  drop: UserDrop;
  matches: UserDrop[];
  isMobile: boolean;
  onClose: () => void;
  onDelete: () => void;
  onFocusMatch: (id: string) => void;
}) {
  const isRequest = drop.kind === "request";
  const handles = [
    drop.instagram && { label: "Instagram", base: "https://instagram.com/", val: drop.instagram },
    drop.telegram && { label: "Telegram", base: "https://t.me/", val: drop.telegram },
    drop.twitter && { label: "X / Twitter", base: "https://x.com/", val: drop.twitter },
  ].filter(Boolean) as { label: string; base: string; val: string }[];

  return (
    <div
      className="glass-hi scrollbar"
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 76,
        right: isMobile ? 0 : 24,
        bottom: isMobile ? 0 : 24,
        left: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : 380,
        maxHeight: isMobile ? "70vh" : "calc(100% - 100px)",
        overflow: "auto",
        zIndex: 700,
        borderRadius: isMobile ? "16px 16px 0 0" : 16,
        animation: isMobile ? "fadeUp 0.3s ease-out" : "slideIn 0.25s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "22px 24px 20px",
          background: isRequest ? T.greenDim : T.accentDim,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: Mf,
                fontSize: 9,
                letterSpacing: 1.8,
                color: isRequest ? T.green : T.accent,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              {isRequest ? "Someone needs a place" : "Someone has a place"}
            </div>
            <div
              style={{
                fontFamily: Bf,
                fontSize: 16,
                fontWeight: 500,
                color: T.text,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {drop.message || `${drop.bhk || "?"}BHK ${drop.amount ? `· ₹${drop.amount}k` : ""}`}
            </div>
            {(drop.bhk || drop.amount || drop.radiusKm) && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 5,
                  marginTop: 12,
                }}
              >
                {drop.bhk && <ParseChip label={`${drop.bhk}BHK`} />}
                {drop.amount && <ParseChip label={`₹${drop.amount}k`} />}
                {isRequest && drop.radiusKm && <ParseChip label={`${drop.radiusKm}km`} />}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: T.textFaint,
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
              padding: 4,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Contact handles */}
      <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.border}` }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.8,
            color: T.textFaint,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Contact
        </div>
        {handles.length === 0 ? (
          <div style={{ fontSize: 12, color: T.textFaint, fontStyle: "italic" }}>
            No handle provided
          </div>
        ) : (
          handles.map((h) => (
            <a
              key={h.label}
              href={h.base + h.val}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                textDecoration: "none",
                color: T.text,
                marginBottom: 8,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = T.surfaceHi;
                e.currentTarget.style.borderColor = T.borderHi;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.surface;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: Mf,
                    fontSize: 9,
                    letterSpacing: 1.2,
                    color: T.textFaint,
                    textTransform: "uppercase",
                  }}
                >
                  {h.label}
                </div>
                <div style={{ fontFamily: Mf, fontSize: 13, fontWeight: 700 }}>@{h.val}</div>
              </div>
              <span
                style={{
                  fontFamily: Mf,
                  fontSize: 10,
                  letterSpacing: 1,
                  color: T.accent,
                  fontWeight: 700,
                }}
              >
                OPEN →
              </span>
            </a>
          ))
        )}
      </div>

      {/* Matches magic reveal */}
      <div style={{ padding: "18px 24px" }}>
        <div
          style={{
            fontFamily: Mf,
            fontSize: 9,
            letterSpacing: 1.8,
            color: T.textFaint,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {isRequest ? "Listings inside your circle" : "Renters searching near you"}
        </div>
        {matches.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: T.textFaint,
              fontStyle: "italic",
              padding: "8px 0",
            }}
          >
            {isRequest
              ? "No listings here yet. Be the first to tell friends to drop theirs."
              : "No one searching here yet. As pins drop in, you'll see them."}
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: Sf,
                fontSize: 22,
                fontWeight: 900,
                color: T.accent,
                marginBottom: 10,
              }}
            >
              {matches.length} {matches.length === 1 ? "match" : "matches"}
            </div>
            {matches.slice(0, 8).map((m) => (
              <button
                key={m.id}
                onClick={() => onFocusMatch(m.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  marginBottom: 6,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: T.text }}>
                    {m.kind === "listing" ? `${fmtK(m.amount)}` : `Up to ${fmtK(m.amount)}`} ·{" "}
                    {m.bhk === 0 ? "Any" : `${m.bhk}B`}
                  </div>
                  {m.instagram && (
                    <div style={{ fontFamily: Mf, fontSize: 10, color: T.textFaint }}>
                      @{m.instagram}
                    </div>
                  )}
                </div>
                <span style={{ fontFamily: Mf, fontSize: 10, color: T.accent, fontWeight: 700 }}>
                  →
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Share + Delete */}
      <div
        style={{
          padding: "14px 24px 22px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          onClick={() => shareDrop(drop)}
          style={{
            width: "100%",
            padding: "14px 18px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            background: T.accent,
            color: T.bg,
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: `0 4px 16px ${T.accentGlow}`,
          }}
        >
          Share on WhatsApp →
        </button>
        <button
          onClick={onDelete}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            background: "transparent",
            color: T.textFaint,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Delete this pin
        </button>
      </div>
    </div>
  );
}

function DropFlag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: Mf,
        fontSize: 9,
        padding: "4px 9px",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 999,
        color: T.textDim,
        letterSpacing: 0.4,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: Mf,
        fontSize: 9,
        letterSpacing: 1.5,
        color: T.textFaint,
        textTransform: "uppercase",
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {children}
    </div>
  );
}

function formInput(): React.CSSProperties {
  return {
    width: "100%",
    fontFamily: Bf,
    fontSize: 14,
    padding: "12px 14px",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    color: T.text,
    outline: "none",
    marginBottom: 18,
  };
}

