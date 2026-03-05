"use client";
import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700;1,800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&display=swap";

var C = {
  cream:"#F5F0E8", sage:"#6B8F71", sageDk:"#5A7A5F", mustard:"#C9A227",
  char:"#1A1A1A", body:"#3D3D3D", muted:"#6B6B6B", light:"#999",
  faint:"#C8C3B8", border:"#DCD6C8", white:"#FFF", bg:"#F5F0E8",
  green:"#4A7C59", gBg:"#4A7C5915", red:"#C4453C", rBg:"#C4453C15"
};
var Sf="'Playfair Display',Georgia,serif", Bf="'DM Sans',-apple-system,sans-serif", Mf="'JetBrains Mono','SF Mono',monospace", Hf="'Caveat',cursive";
var NavCtx = createContext(null);
var useGo = function(){ return useContext(NavCtx); };

// ── Utils ──
var fN = function(n){ return parseFloat(n).toFixed(2); };
var fI = function(n){ var s=Math.round(n).toString(),l=s.slice(-3),r=s.slice(0,-3); return r?r.replace(/\B(?=(\d{2})+(?!\d))/g,",")+","+l:l; };
var sipFV = function(m,r,y){ var ri=r/100/12,n=y*12; return Math.round(m*((Math.pow(1+ri,n)-1)/ri)*(1+ri)); };

// Calculate returns from NAV history
var calcReturn = function(data, days) {
  if (!data || data.length < days+1) return null;
  var a = parseFloat(data[0].nav), b = parseFloat(data[Math.min(days, data.length-1)].nav);
  return ((a-b)/b*100);
};
var calcCAGR = function(data, days) {
  if (!data || data.length < days+1) return null;
  var a = parseFloat(data[0].nav), b = parseFloat(data[Math.min(days, data.length-1)].nav);
  var years = days/365;
  return ((Math.pow(a/b, 1/years)-1)*100);
};
var calcVolatility = function(data, days) {
  if (!data || data.length < days) return null;
  var slice = data.slice(0, Math.min(days, data.length));
  var returns = [];
  for (var i=0; i<slice.length-1; i++) {
    var a = parseFloat(slice[i].nav), b = parseFloat(slice[i+1].nav);
    if (b>0) returns.push((a-b)/b);
  }
  if (returns.length < 2) return null;
  var mean = returns.reduce(function(s,v){return s+v;},0)/returns.length;
  var variance = returns.reduce(function(s,v){return s+Math.pow(v-mean,2);},0)/(returns.length-1);
  return Math.sqrt(variance)*Math.sqrt(252)*100;
};
var calcMaxDrawdown = function(data, days) {
  if (!data || data.length < 10) return null;
  var slice = data.slice(0, Math.min(days||data.length, data.length)).map(function(d){return parseFloat(d.nav);}).reverse();
  var peak = slice[0], maxDD = 0;
  for (var i=1; i<slice.length; i++) {
    if (slice[i]>peak) peak=slice[i];
    var dd = (peak-slice[i])/peak*100;
    if (dd>maxDD) maxDD=dd;
  }
  return maxDD;
};
var fP = function(n){ if(n===null||n===undefined) return "—"; var v=typeof n==="number"?n:parseFloat(n); if(isNaN(v)) return "—"; return (v>=0?"+":"")+v.toFixed(1)+"%"; };
var fPn = function(n){ if(n===null||n===undefined) return null; var v=typeof n==="number"?n:parseFloat(n); return isNaN(v)?null:v; };

// ── AMC Utilities ──
var slugify = function(name) {
  return name.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
};
var FUND_TYPES = ["Overnight","Liquid","Ultra Short","Low Duration","Money Market","Short Duration","Medium Duration","Medium to Long","Long Duration","Dynamic Bond","Corporate Bond","Credit Risk","Banking and PSU","Gilt","Floater","Flexi Cap","Large Cap","Large & Mid Cap","Mid Cap","Small Cap","Multi Cap","Multi Asset","Value Fund","Contra","Dividend Yield","Focused","ELSS","Sectoral","Thematic","Equity Savings","Aggressive Hybrid","Conservative Hybrid","Balanced Advantage","Balanced","Arbitrage","Index","ETF","Fund of Funds","FMP","Retirement","Children","Tax Saver","Nifty","Sensex","S&P BSE","Capital Protection","Fixed Maturity","Interval","Infrastructure","Regular Savings","Income"];
var extractAMC = function(schemeName) {
  var name = schemeName.trim();
  var cutoff = name.length;
  for (var i = 0; i < FUND_TYPES.length; i++) {
    var idx = name.indexOf(FUND_TYPES[i]);
    if (idx > 0 && idx < cutoff) cutoff = idx;
  }
  var delimiters = [" - "," -","- ","("];
  for (var j = 0; j < delimiters.length; j++) {
    var dIdx = name.indexOf(delimiters[j]);
    if (dIdx > 0 && dIdx < cutoff) cutoff = dIdx;
  }
  var prefix = name.substring(0, cutoff).trim();
  prefix = prefix.replace(/\s*Mutual\s*Fund\s*$/i,"").trim();
  return prefix || name.split(" ")[0];
};
var amcToEditorialSlug = function(amcName) {
  var lower = amcName.toLowerCase();
  if (lower.indexOf("parag parikh") >= 0 || lower === "ppfas") return "ppfas";
  if (lower === "quant") return "quant";
  return null;
};

// ── Hooks ──
function useTitle(title) {
  useEffect(function() {
    if (title) document.title = title + " | Boredfolio";
    return function() { document.title = "Boredfolio — India's Most Honest Mutual Fund Platform"; };
  }, [title]);
}

function useVis(t) {
  var threshold = t || 0.12;
  var ref = useRef(null);
  var _s = useState(false), v = _s[0], sv = _s[1];
  useEffect(function(){
    var el = ref.current; if(!el) return;
    var obs = new IntersectionObserver(function(entries){ if(entries[0].isIntersecting){sv(true);obs.disconnect();} },{threshold:threshold});
    obs.observe(el); return function(){obs.disconnect();};
  },[threshold]);
  return [ref, v];
}

function useFund(code) {
  var _s = useState(null), d = _s[0], sd = _s[1];
  var _l = useState(true), l = _l[0], sl = _l[1];
  useEffect(function(){
    var cancel = false;
    if(!code){sl(false);return;}
    fetch("https://api.mfapi.in/mf/"+code).then(function(r){return r.json();}).then(function(j){if(!cancel)sd(j);}).catch(function(){}).finally(function(){if(!cancel)sl(false);});
    return function(){cancel=true;};
  },[code]);
  return {data:d, loading:l};
}

var _allFundsCache = null;
var _allFundsLoading = false;
var _allFundsListeners = [];
function useAllFunds() {
  var _s = useState(_allFundsCache), funds = _s[0], setFunds = _s[1];
  var _l = useState(!_allFundsCache), loading = _l[0], setLoading = _l[1];
  var _e = useState(null), err = _e[0], setErr = _e[1];
  useEffect(function() {
    if (_allFundsCache) { setFunds(_allFundsCache); setLoading(false); return; }
    if (_allFundsLoading) {
      var listener = function(data) { setFunds(data); setLoading(false); };
      _allFundsListeners.push(listener);
      return function() { var idx = _allFundsListeners.indexOf(listener); if (idx >= 0) _allFundsListeners.splice(idx, 1); };
    }
    _allFundsLoading = true;
    setLoading(true);
    fetch("https://api.mfapi.in/mf")
      .then(function(r) { return r.json(); })
      .then(function(allSchemes) {
        // Step 1: Clean scheme names — strip junk prefix, take part before " - "
        var cleaned = [];
        for (var i = 0; i < allSchemes.length; i++) {
          var raw = (allSchemes[i].schemeName || "").replace(/^[\s\d.\t(]+/, "").trim();
          if (!raw) continue;
          var dashIdx = raw.indexOf(" - ");
          if (dashIdx < 0) dashIdx = raw.indexOf(" -");
          var clean = dashIdx > 0 ? raw.substring(0, dashIdx).trim() : raw.trim();
          cleaned.push({ scheme: allSchemes[i], words: clean.split(/\s+/) });
        }
        // Step 2: Group by first word (lowercased)
        var byFirst = {};
        for (var j = 0; j < cleaned.length; j++) {
          var first = (cleaned[j].words[0] || "").toLowerCase();
          if (!first) continue;
          if (!byFirst[first]) byFirst[first] = [];
          byFirst[first].push(cleaned[j]);
        }
        // Step 3: Find longest common word prefix within each group
        var amcGroups = {};
        var keys = Object.keys(byFirst);
        for (var k = 0; k < keys.length; k++) {
          var group = byFirst[keys[k]];
          var prefix = group[0].words.slice();
          for (var g = 1; g < group.length; g++) {
            var w = group[g].words;
            var len = Math.min(prefix.length, w.length);
            var match = 0;
            for (var m = 0; m < len; m++) {
              if (prefix[m].toLowerCase() === w[m].toLowerCase()) match = m + 1;
              else break;
            }
            prefix = prefix.slice(0, match);
          }
          if (prefix.length === 0) prefix = [group[0].words[0]];
          var amcName = prefix.join(" ").replace(/\s*(Mutual|Fund|Funds)\s*$/gi,"").trim();
          if (!amcName) amcName = keys[k];
          if (!amcGroups[amcName]) { amcGroups[amcName] = { name: amcName, slug: slugify(amcName), schemes: [], editorialSlug: amcToEditorialSlug(amcName) }; }
          for (var n = 0; n < group.length; n++) { amcGroups[amcName].schemes.push(group[n].scheme); }
        }
        var result = Object.keys(amcGroups).map(function(key) { return amcGroups[key]; });
        result.sort(function(a, b) {
          if (a.editorialSlug && !b.editorialSlug) return -1;
          if (!a.editorialSlug && b.editorialSlug) return 1;
          return b.schemes.length - a.schemes.length;
        });
        _allFundsCache = result;
        _allFundsLoading = false;
        setFunds(result);
        setLoading(false);
        for (var j = 0; j < _allFundsListeners.length; j++) { _allFundsListeners[j](result); }
        _allFundsListeners = [];
      })
      .catch(function() { _allFundsLoading = false; setLoading(false); setErr("Failed to load fund data"); });
  }, []);
  return { funds: funds, loading: loading, error: err };
}

function useW() {
  var _s = useState(1200), w = _s[0], sw = _s[1];
  useEffect(function(){ sw(window.innerWidth); var h=function(){sw(window.innerWidth);}; window.addEventListener("resize",h); return function(){window.removeEventListener("resize",h);}; },[]);
  return w;
}

// ── Atoms ──
var e = React.createElement;

function Wrap(p) { return e("div", {style:{maxWidth:1080,margin:"0 auto",padding:"0 28px",...(p.style||{})}}, p.children); }
function A(p) { var d=p.delay||0,v=p.vis!==false; return e("div",{style:{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) "+d+"s",...(p.style||{})}},p.children); }

function Spark(p) {
  var w=p.w||140,h=p.h||48,data=p.data;
  if(!data||data.length<2) return null;
  var vals=data.map(function(d){return parseFloat(d.nav);}).reverse();
  var mn=Math.min.apply(null,vals),mx=Math.max.apply(null,vals),rg=mx-mn||1;
  var up=vals[vals.length-1]>=vals[0], col=up?C.green:C.red;
  var pts=vals.map(function(v,i){return(i/(vals.length-1))*w+","+(h-((v-mn)/rg)*h*0.8-h*0.1);}).join(" ");
  return e("svg",{width:w,height:h,viewBox:"0 0 "+w+" "+h},
    e("polyline",{points:pts,fill:"none",stroke:col,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})
  );
}

function HoverRow(p) {
  var _s=useState(false),h=_s[0],sh=_s[1];
  return e("div",{onClick:p.onClick,onMouseEnter:function(){sh(true);},onMouseLeave:function(){sh(false);},style:{cursor:"pointer",transition:"background 0.2s",background:h?C.cream:C.white,...(p.style||{})}},p.children);
}

function HoverCard(p) {
  var _s=useState(false),h=_s[0],sh=_s[1];
  return e("div",{onClick:p.onClick,onMouseEnter:function(){sh(true);},onMouseLeave:function(){sh(false);},style:{cursor:"pointer",transition:"all 0.35s",transform:h?"translateY(-4px)":"none",boxShadow:h?"0 12px 40px rgba(26,26,26,0.1)":"0 1px 4px rgba(26,26,26,0.04)",border:"1px solid "+(h?C.sage+"60":C.border),...(p.style||{})}},p.children);
}

// ── DATA ──
var PPFAS = {
  slug:"ppfas", name:"PPFAS Mutual Fund", aum:"₹1,47,517 Cr", numSchemes:6, inception:"May 2013",
  personality:"The quiet kid who aces every exam without studying (spoiler: they studied)",
  vibe:"Conservative rebels. They hold cash when the world is buying. They buy global when India is partying. They run 6 schemes when competitors run 60.",
  philosophy:"We buy good companies at reasonable prices. We wait. That's it. When there's nothing good to buy, we hold cash. The industry hates this because cash doesn't generate fees. We don't care.",
  skinInGame:"₹1,261 Cr of insiders' own money is in the fund. That's not a fact from a brochure. That's the fund manager betting on himself with his rent money.",
  greenFlags:["21% cash position — patience isn't just a virtue, it's a portfolio strategy","Global diversification — they own Meta, Alphabet, Microsoft while everyone else buys only Nifty","₹1,261 Cr insider investment — your fund manager eats what he cooks","6 schemes only — discipline to say no is rarer than alpha"],
  redFlags:["High cash means lower returns in bull markets — you'll feel FOMO","Exit load is 2% if you leave before 1 year — they want commitment","Overseas allocation adds currency risk — rupee depreciation is your friend, appreciation isn't","Concentrated bets — when HDFC Bank sneezes, PPFCF catches a cold"],
  keyPeople:[
    {name:"Rajeev Thakkar",role:"CIO - Equity",note:"Runs the flagship since inception. In an industry where fund managers switch jobs like dating apps, he's been married to PPFAS since day one."},
    {name:"Raunak Onkar",role:"Research Head & Overseas FM",note:"The person who decided your SIP should own Instagram and YouTube. You're welcome."},
    {name:"Raj Mehta",role:"EVP & Fund Manager",note:"Fresh blood in the system. Joined Sep 2025. New perspectives on old positions."},
  ],
  whoIsThisFor:"Patient investors who can handle seeing 20% cash in a bull market without losing their minds. People who want global diversification without opening a US brokerage account.",
  schemes:[
    {code:"122639",name:"Parag Parikh Flexi Cap Fund",short:"PPFCF",cat:"Flexi Cap",
     aum:"₹1,33,372 Cr",exp:"0.63%",inception:"May 24, 2013",
     personality:"Your money's designated driver — boring, responsible, gets you home safe",
     one:"India's most boring outperformer. 65% India, 35% global. 21% in cash because they'd rather earn nothing than overpay for something.",
     benchmarkName:"Nifty 500 TRI",
     sharpe:"1.67",beta:"0.59",alpha:"—",stdDev:"8.28%",
     factReturns:{y1:"6.98%",y3:"16.42%",y5:"18.42%",si:"19.25% CAGR"},
     holdings:[
       {name:"HDFC Bank",sector:"Banks",pct:7.69,note:"India's largest private bank. If you've ever used a credit card, you've funded this holding."},
       {name:"Meta Platforms",sector:"Tech (US)",pct:4.39,note:"Facebook, Instagram, WhatsApp, Threads. Your MF owns the apps you doom-scroll on. Ironic."},
       {name:"Bajaj Holdings",sector:"Finance",pct:3.87,note:"Holding company of Bajaj Finance. Not glamorous. Quietly prints money."},
       {name:"Coal India",sector:"Energy",pct:3.63,note:"India's government-owned coal miner. ESG investors look away. Dividend investors look twice."},
       {name:"Alphabet",sector:"Tech (US)",pct:2.91,note:"Google Search, YouTube, Android, Cloud. The internet's landlord."},
       {name:"Microsoft",sector:"Tech (US)",pct:2.27,note:"Office, Azure, Teams, Copilot. Enterprise software's final boss."},
       {name:"Amazon",sector:"E-Commerce (US)",pct:2.17,note:"Everything store + AWS. When the internet needs a backbone, it calls Amazon."},
       {name:"Power Grid Corp",sector:"Power",pct:2.14,note:"Transmission lines across India. The unglamorous plumbing of electrification."},
       {name:"ITC",sector:"FMCG",pct:2.08,note:"Cigarettes to biscuits to hotels. India's most debated stock. The hotel division alone is worth a therapy session."},
       {name:"ICICI Bank",sector:"Banks",pct:1.97,note:"India's #2 private bank. The comeback story the market loves."},
     ],
     sectors:[{n:"Banks & Finance",p:22.5},{n:"IT/Software (US+India)",p:12.2},{n:"Auto & Ancillaries",p:6.6},{n:"Power & Energy",p:8.0},{n:"FMCG",p:5.1},{n:"Cash & Arbitrage",p:21.3},{n:"Others",p:24.3}],
     commentary:"The elephant in the room: 21% cash. In a bull market, this looks like laziness. In a crash, it looks like prophecy. The overseas allocation (Meta, Google, Microsoft, Amazon) gives you global diversification that 99% of Indian MFs don't offer. Beta of 0.59 means when Nifty falls 10%, this falls ~6%. That's not magic — that's cash acting as a cushion. The flip side? When Nifty rises 10%, you only get ~6% of that party. PPFAS is the fund for people who'd rather arrive late than crash early.",
     expenseNote:"At 0.63% on ₹1,33,372 Cr, PPFAS collects roughly ₹840 Cr/year in fees. That's ₹2.3 Cr per day. For context, that's a luxury apartment in Bandra every single day. Is it worth it? Their 19.25% CAGR since inception suggests yes — but you're paying regardless of performance.",
     exitLoadNote:"2% if you leave before 365 days. 1% between 365-730 days. Free after 2 years. Translation: they want you to commit. This is actually good — it prevents panic-selling, which is the #1 wealth destroyer.",
    },
    {code:"149923",name:"Parag Parikh ELSS Tax Saver",short:"PPTSF",cat:"ELSS",
     aum:"₹5,825 Cr",exp:"0.62%",inception:"Jul 24, 2019",
     personality:"PPFCF's younger sibling who also gets you a tax receipt",
     one:"Same DNA as Flexi Cap. Comes with Section 80C deduction and a 3-year lock-in that's secretly the best feature — it prevents you from panic-selling.",
     factReturns:{y1:"6.98%",y3:"—",y5:"—",si:"—"},sharpe:"1.01",
     holdings:[{name:"HDFC Bank",sector:"Banks",pct:7.69},{name:"Bajaj Holdings",sector:"Finance",pct:6.60},{name:"Coal India",sector:"Energy",pct:6.27},{name:"Power Grid",sector:"Power",pct:6.07},{name:"Maharashtra Scooters",sector:"Finance",pct:5.51},{name:"ITC",sector:"FMCG",pct:5.04}],
     commentary:"Nearly identical brain to Flexi Cap but with a 3-year lock-in. Controversial take: the lock-in is the best feature. It's a behavioural straightjacket that prevents you from doing the dumbest thing in investing — selling when it's down. If you have ₹1.5L to save tax and 3 years of patience, this is a no-brainer.",
    },
    {code:"152221",name:"Parag Parikh Dynamic Asset Allocation",short:"PPDAAF",cat:"Dynamic AA",
     aum:"₹2,716 Cr",exp:"0.33%",inception:"Feb 27, 2024",
     personality:"The new kid who plays it safe but isn't boring about it",
     one:"35% equity, 47% government bonds. Adjusts automatically so you don't wake up at 3am checking Nifty.",
     factReturns:{y1:"6.59%",y3:"—",y5:"—",si:"7.67%"},
     commentary:"Brand new. Mostly government bonds and state development loans. This is for the person who wants exposure to PPFAS's brain but can't handle equity volatility. At 0.33% expense, it's practically free by Indian MF standards.",
    },
    {code:"151780",name:"Parag Parikh Liquid Fund",short:"PPLF",cat:"Liquid",
     aum:"₹4,360 Cr",exp:"0.15%",inception:"May 25, 2018",
     personality:"The parking lot for money that's between decisions",
     one:"Where the insiders park ₹3,128 Cr of their own cash. If it's good enough for the fund house, it's good enough for your emergency fund.",
     factReturns:{y1:"7.21%",y3:"6.68%",y5:"5.80%",si:"5.98%"},
     commentary:"The sleeper stat: insiders have ₹3,128 Cr in this fund. That's more than the total AUM of most small fund houses. This is where PPFAS parks its own treasury. When someone puts their OWN money in their OWN liquid fund, that's the strongest endorsement possible.",
    },
    {code:"151802",name:"Parag Parikh Conservative Hybrid",short:"PPCHF",cat:"Conservative Hybrid",
     aum:"₹1,244 Cr",exp:"0.32%",inception:"Apr 7, 2021",
     personality:"The 75% boring, 25% exciting financial sandwich",
     one:"~25% equity, ~75% debt. For your parents who want 'safe' but also want 'returns' and can't pick one.",
     factReturns:{y1:"9.30%",y3:"9.50%",y5:"—",si:"8.74%"},
     commentary:"The PPFAS fund nobody talks about. 75% debt, 25% equity — and it's delivering 9.5% CAGR over 3 years. That's better than most FDs and almost as boring. Ideal for retirees or people within 3-5 years of a goal.",
    },
    {code:"152219",name:"Parag Parikh Arbitrage Fund",short:"PPAF",cat:"Arbitrage",
     aum:"₹940 Cr",exp:"0.26%",inception:"Dec 3, 2024",
     personality:"The tax-efficient FD that pretends to be an equity fund",
     one:"Exploits price differences between cash and futures markets. Taxed like equity (lower). Returns like debt (stable).",
     factReturns:{y1:"—",y3:"—",y5:"—",si:"—"},
     commentary:"Brand new, launched Dec 2024. The pitch: get near-FD returns but pay equity taxation (12.5% LTCG vs 20%+ for debt). The catch: returns depend on market volatility — more volatility = more arbitrage opportunities. In calm markets, it just parks your cash.",
    },
  ]
};

var QUANT = {
  slug:"quant", name:"Quant Mutual Fund", aum:"₹95,000 Cr", numSchemes:28, inception:"1996",
  personality:"The wildcard who quotes Vedic scriptures before making leveraged bets",
  vibe:"Unpredictable geniuses or reckless gamblers — depends on who you ask and what the market did this quarter. They use a framework called VLRT MARCOV that nobody fully understands, and their factsheet reads like a geopolitical thriller.",
  philosophy:"VLRT MARCOV framework: Valuation, Liquidity, Risk Appetite, Timing. Inspired by Vedic philosophy — Atman (fundamentals), Prana (liquidity), Maya (price vs perception). Before you laugh: their Small Cap fund has a 25.86% 5Y CAGR.",
  greenFlags:["25.86% 5Y CAGR in Small Cap — numbers talk louder than philosophy","BFSI fund delivered 34.7% in one year — sectoral timing at its finest","28 schemes means something for every type of investor","Inception in 1996 — survived dot-com, GFC, COVID, and still here"],
  redFlags:["Concentration risk: top 10 holdings often 60%+ of portfolio","VLRT MARCOV framework is proprietary and opaque — you're trusting the process without seeing it","Reliance Industries in a Small Cap fund? That's creative interpretation of 'small cap'","When sectors rotate against them, the falls are steep — Teck fund: -16.8% in same period BFSI did +34.7%"],
  keyPeople:[
    {name:"Sandeep Tandon",role:"CIO & Fund Manager",note:"The brain behind VLRT. Believes in timing over everything else. Talks about geopolitics the way others talk about P/E ratios. Either a genius or a very confident storyteller."},
    {name:"Ankit Pande",role:"FM - Valuation Analytics",note:"Runs valuation models for most equity schemes. The quant behind Quant (yes, the pun writes itself)."},
    {name:"Sanjeev Sharma",role:"FM - Debt",note:"Manages the less exciting but equally important debt portfolio. Someone has to be responsible."},
  ],
  whoIsThisFor:"Investors with high risk tolerance who believe in active management and don't mind concentrated bets. People who won't panic-sell when their small cap fund drops 20% in a quarter. Definitely not for someone who checks their portfolio daily.",
  schemes:[
    {code:"120828",name:"Quant Small Cap Fund",short:"QSCF",cat:"Small Cap",
     aum:"₹27,654 Cr",exp:"0.64%",inception:"Oct 29, 1996",
     personality:"The friend who skydives on weekends and has surprisingly good life insurance",
     one:"Goes up 25% some years. Goes down 15% others. Has Reliance as top holding in a 'small cap' fund. Quant plays by its own rules.",
     benchmarkName:"Nifty Small Cap 250 TRI",
     sharpe:"0.97",alpha:"6.04",beta:"0.87",stdDev:"15.6%",
     factReturns:{y1:"12.47%",y3:"22.06%",y5:"25.86%",si:"16.66% CAGR"},
     holdings:[
       {name:"Reliance Industries",sector:"Conglomerate",pct:9.36,note:"Yes. Reliance. In a small cap fund. With a market cap of ₹17 lakh crore. Quant uses SEBI's flexible mandate to hold up to 25% in non-small-cap stocks. Legal? Yes. Small cap? Laughable."},
       {name:"RBL Bank",sector:"Banks",pct:4.38,note:"A private bank that's had its share of drama — CEO exits, asset quality concerns, and a stock price that looks like an ECG. Quant sees value in the chaos."},
       {name:"Sun TV Network",sector:"Media",pct:3.43,note:"Tamil Nadu's media monopoly. Low debt, high cash flow, dynasty management. A cash cow disguised as a TV channel."},
       {name:"Adani Power",sector:"Power",pct:3.06,note:"Adani group's power generation arm. If you believe in India's electricity demand story, this is a direct bet."},
       {name:"Jio Financial Services",sector:"Finance",pct:2.85,note:"Ambani's fintech play. Brand new, unproven, but with Reliance's distribution muscle. A lottery ticket with good odds."},
       {name:"Piramal Finance",sector:"NBFC",pct:2.73,note:"An NBFC with a complicated past — restructured from real estate lending to retail. The turnaround story is either genius or premature."},
       {name:"Aster DM Healthcare",sector:"Healthcare",pct:2.68,note:"Hospitals across India and the Gulf. Sold the Gulf business to focus on India. Healthcare is the theme, but execution is the question."},
       {name:"Anand Rathi Wealth",sector:"Wealth Mgmt",pct:2.64,note:"Manages rich people's money. You're investing in a fund that invests in a company that manages investments. Very meta."},
       {name:"HFCL",sector:"Telecom Infra",pct:2.23,note:"Fiber optics and defense electronics. The picks and shovels play for 5G and defense modernization."},
       {name:"Aegis Logistics",sector:"Gas Infrastructure",pct:2.17,note:"LPG and gas terminals. Boring infrastructure that becomes exciting when gas demand spikes."},
     ],
     sectors:[{n:"Finance & NBFC",p:22},{n:"Healthcare",p:12},{n:"Power & Energy",p:10},{n:"Conglomerate",p:9.4},{n:"Media",p:5},{n:"Telecom",p:4},{n:"Others",p:37.6}],
     concentration:{top10:"35.53%",top30:"68.89%"},
     commentary:"The big reveal: 9.36% in Reliance. In a small cap fund. That's not a bug — it's Quant's entire philosophy. They use SEBI's flexible allocation to hold large caps when small caps look overpriced. Alpha of 6.04 means they've genuinely added value over the benchmark. But downside capture of 0.87 means when markets fall 10%, you feel 8.7% of it. This isn't a parachute — it's a slightly padded landing. 25.86% 5Y CAGR is spectacular, but survivorship bias is real. Would you have held through the 30%+ drawdowns?",
     expenseNote:"At 0.64% on ₹27,654 Cr, Quant collects roughly ₹177 Cr/year from this single fund. That's almost ₹50 lakh per day. For a small cap fund that holds Reliance.",
    },
    {code:"120847",name:"Quant ELSS Tax Saver",short:"QELSS",cat:"ELSS",
     aum:"₹12,080 Cr",exp:"0.69%",inception:"Apr 13, 2000",
     personality:"Tax savings meets gambling addiction — but in a good way",
     one:"Top 10 holdings = 64% of the fund. Most ELSS funds diversify. Quant concentrates. When they're right, they're very right.",
     factReturns:{y1:"20.67%",y3:"19.56%",y5:"21.08%",si:"19.65% CAGR"},sharpe:"0.83",
     holdings:[{name:"Reliance",sector:"Conglomerate",pct:9.02},{name:"L&T",sector:"Infra",pct:8.34},{name:"Samvardhana Motherson",sector:"Auto",pct:8.30},{name:"Adani Power",sector:"Power",pct:7.24},{name:"Aurobindo Pharma",sector:"Pharma",pct:6.78},{name:"Britannia",sector:"FMCG",pct:4.93}],
     concentration:{top10:"63.7%",top30:"87.2%"},
     commentary:"Top 10 = 63.7%. This isn't diversification — it's conviction. For an ELSS (which you're stuck with for 3 years), that concentration is either brilliant timing or a ticking time bomb. 21.08% 5Y CAGR speaks for itself, but notice how different this portfolio is from PPFAS's ELSS. Same tax benefit, completely different investment personality.",
    },
    {code:"120837",name:"Quant Flexi Cap Fund",short:"QFCF",cat:"Flexi Cap",
     aum:"₹6,354 Cr",exp:"0.59%",inception:"Oct 17, 2008",
     personality:"The multi-talented friend who can't pick a lane — and somehow that's working",
     one:"Large, mid, small — whatever Sandeep Tandon feels like this quarter. Two Adani stocks in the top 5. High conviction, high controversy.",
     factReturns:{y1:"16.40%",y3:"19.79%",y5:"21.41%",si:"18.27% CAGR"},sharpe:"0.85",
     holdings:[{name:"Aurobindo Pharma",sector:"Pharma",pct:9.75},{name:"Samvardhana Motherson",sector:"Auto",pct:8.62},{name:"Adani Power",sector:"Power",pct:7.54},{name:"Adani Enterprises",sector:"Conglomerate",pct:6.16},{name:"Kotak Mahindra Bank",sector:"Banks",pct:5.15},{name:"L&T",sector:"Infra",pct:4.18}],
     commentary:"Two Adani stocks in the top 5. That's not diversification — that's a view on India's capex cycle expressed through one business group. 21.41% 5Y CAGR is excellent, but this fund's fortunes are heavily tied to the Adani thesis and pharma exports. If both work, extraordinary. If either stumbles, turbulence.",
    },
    {code:"120823",name:"Quant BFSI Fund",short:"QBFSI",cat:"Sectoral - BFSI",
     aum:"₹3,200 Cr",exp:"0.67%",inception:"Jun 20, 2023",
     personality:"The one-trick pony that's spectacular at the trick",
     one:"+34.7% in one year. All banks and financials. When BFSI works, nothing else comes close. When it doesn't, there's nowhere to hide.",
     factReturns:{y1:"34.70%",y3:"—",y5:"—",si:"28.66%"},sharpe:"1.22",alpha:"15.12",
     commentary:"Jensen's Alpha of 15.12 is the highest in Quant's lineup. In plain English: the fund manager added 15% more return than what the risk warranted. That's exceptional — if it's repeatable. Sectoral funds are streaky. This quarter's hero is next quarter's zero. Only for investors who have a specific view on India's banking sector and the discipline to exit when the thesis changes.",
    },
  ]
};

var JARGON = [
  {fake:"Wealth creation through systematic investment",real:"Put money in every month. Don't touch it. That's the whole strategy.",ic:"wallet"},
  {fake:"NAV-based pricing with mark-to-market valuations",real:"The price changes daily based on what the fund owns. Like your house value, except you can check every morning.",ic:"chart"},
  {fake:"Risk-adjusted alpha generation vs benchmark",real:"Did the fund manager beat a computer that just bought the whole market? Usually no.",ic:"target"},
  {fake:"Total expense ratio of 1.5% inclusive of GST",real:"They take 1.5% of your money every year. Win or lose. Deducted daily. You never see a bill.",ic:"receipt"},
  {fake:"SIP with rupee cost averaging over market cycles",real:"Buy more units when cheap, fewer when expensive. Automatically. The only strategy that rewards not paying attention.",ic:"repeat"},
  {fake:"Standard deviation of 12% with Sharpe ratio 1.2",real:"It swings 12% up or down in a typical year. For every 1% of risk, you got 1.2% of return. Not bad.",ic:"scale"},
];

var TOP3 = [
  {r:1,name:"Quant Small Cap",cagr:"25.86%",vibe:"The overachiever with Vedic vibes and Reliance in a small cap portfolio.",route:"/scheme/quant/120828"},
  {r:2,name:"Quant ELSS Tax Saver",cagr:"21.08%",vibe:"Tax savings wrapped in concentrated bets that somehow keep paying off.",route:"/scheme/quant/120847"},
  {r:3,name:"PPFAS Flexi Cap",cagr:"19.25%",vibe:"The one that holds cash in bull markets and still wins.",route:"/scheme/ppfas/122639"},
];

// ══════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════
function Navbar(p) {
  var _s=useState(false),sc=_s[0],ssc=_s[1]; var _m=useState(false),mo=_m[0],smo=_m[1];
  var go=useGo(), m=useW()<768;
  useEffect(function(){var h=function(){ssc(window.scrollY>50);};window.addEventListener("scroll",h);return function(){window.removeEventListener("scroll",h);};},[]);
  useEffect(function(){smo(false);},[p.page]);
  var logoClick = function(){go("/");};
  return e("div",null,
    e("nav",{style:{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:sc?"12px 28px":"20px 28px",background:sc?"rgba(245,240,232,0.92)":"transparent",backdropFilter:sc?"blur(30px)":"none",WebkitBackdropFilter:sc?"blur(30px)":"none",borderBottom:sc?"1px solid "+C.border:"1px solid transparent",transition:"all 0.4s",display:"flex",justifyContent:"space-between",alignItems:"center"}},
      e("div",{onClick:logoClick,style:{fontFamily:Sf,fontSize:m?20:22,color:C.char,cursor:"pointer"}},e("span",{style:{fontWeight:900}},"bored"),e("span",{style:{fontWeight:400}},"folio"),e("span",{style:{color:C.sage}},".")),
      m ? e("div",{onClick:function(){smo(!mo);},style:{fontFamily:Mf,fontSize:10,fontWeight:700,color:C.char,cursor:"pointer",letterSpacing:2}},mo?"CLOSE":"MENU")
        : e("div",{style:{display:"flex",alignItems:"center",gap:28}},
            e("span",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,color:C.light,cursor:"pointer",fontWeight:500}},"Explore"),
            e("span",{onClick:function(){go("/learn");},style:{fontFamily:Bf,fontSize:13,color:C.light,cursor:"pointer",fontWeight:500}},"Learn"),
            e("span",{onClick:function(){go("/calculator");},style:{fontFamily:Bf,fontSize:13,color:C.light,cursor:"pointer",fontWeight:500}},"Calculator"),
            e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"10px 22px",borderRadius:8,cursor:"pointer"}},"Explore funds")
          )
    ),
    m&&mo ? e("div",{style:{position:"fixed",inset:0,background:C.cream,zIndex:999,padding:"100px 28px",animation:"fadeIn 0.3s ease"}},
      ["Explore","Learn","Calculator","Manifesto"].map(function(t){return e("div",{key:t,onClick:function(){go("/"+t.toLowerCase());},style:{fontFamily:Sf,fontSize:36,color:C.char,padding:"18px 0",borderBottom:"1px solid "+C.border,cursor:"pointer"}},t);})
    ) : null
  );
}

// ══════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════
function Footer() {
  var go=useGo(),m=useW()<768;
  return e("footer",{style:{borderTop:"1px solid "+C.border,padding:m?"40px 0 24px":"60px 0 36px"}},
    e(Wrap,null,
      e("div",{style:{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:20,marginBottom:28}},
        e("div",{style:{maxWidth:260}},
          e("div",{onClick:function(){go("/");},style:{fontFamily:Sf,fontSize:20,color:C.char,marginBottom:8,cursor:"pointer"}},e("span",{style:{fontWeight:900}},"bored"),"folio",e("span",{style:{color:C.sage}},".")),
          e("p",{style:{fontFamily:Bf,fontSize:12,color:C.light,lineHeight:1.7}},"India's mutual funds, explained without the sales pitch. No commissions. No sponsored rankings.")
        ),
        e("div",{style:{display:"flex",gap:m?24:40,flexWrap:"wrap"}},
          e("div",null,
            e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,marginBottom:10,textTransform:"uppercase"}},"Explore"),
            ["PPFAS MF|/house/ppfas","Quant MF|/house/quant","All Funds|/explore"].map(function(x){var p=x.split("|"); return e("div",{key:p[1],onClick:function(){go(p[1]);},style:{fontFamily:Bf,fontSize:13,color:C.muted,marginBottom:8,cursor:"pointer",padding:"2px 0"}},p[0]);})
          ),
          e("div",null,
            e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,marginBottom:10,textTransform:"uppercase"}},"More"),
            ["Calculator|/calculator","Direct vs Regular|/direct-vs-regular","Manifesto|/manifesto","Rankings|/top-funds"].map(function(x){var p=x.split("|"); return e("div",{key:p[1],onClick:function(){go(p[1]);},style:{fontFamily:Bf,fontSize:13,color:C.muted,marginBottom:8,cursor:"pointer",padding:"2px 0"}},p[0]);})
          )
        )
      ),
      e("div",{style:{borderTop:"1px solid "+C.border,paddingTop:16}},
        e("p",{style:{fontFamily:Bf,fontSize:11,color:C.light,margin:0,lineHeight:1.7}},"Mutual fund investments are subject to market risks. Read all scheme documents carefully. Boredfolio is for education only — we don't sell funds, earn commissions, or give personalised advice. Holdings data is sourced from public factsheets and may not reflect the most recent portfolio. 2 fund houses profiled so far. More coming. © 2025")
      )
    )
  );
}

// ══════════════════════════════════════════
// HERO — matching uploaded image design
// ══════════════════════════════════════════
function Hero() {
  var _p=useState(0),phase=_p[0],sp=_p[1]; var _t=useState(""),typed=_t[0],st=_t[1];
  var _r=useVis(0.05),ref=_r[0],vis=_r[1]; var go=useGo(),m=useW()<768;

  if (phase===0) {
    return e("section",{ref:ref,style:{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",position:"relative"}},
      e("div",{style:{position:"absolute",inset:0,opacity:0.035,backgroundImage:"radial-gradient("+C.char+" 1px, transparent 1px)",backgroundSize:"32px 32px"}}),
      e(Wrap,{style:{position:"relative",zIndex:1}},
        e(A,{vis:vis,delay:0.1},
          e("div",{style:{fontFamily:Mf,fontSize:m?9:11,fontWeight:600,letterSpacing:m?3:5,color:C.sage,marginBottom:m?28:40,textTransform:"uppercase"}},"Financial advice you didn't ask for")
        ),
        e(A,{vis:vis,delay:0.3},
          e("h1",{style:{fontFamily:Sf,fontSize:m?40:80,fontWeight:900,color:C.char,lineHeight:1.05,margin:"0 0 8px",maxWidth:m?"100%":800}},
            "Your mutual fund",e("br",null),"has a ",
            e("span",{style:{background:C.char,color:C.cream,padding:m?"2px 10px":"4px 16px",borderRadius:4,display:"inline-block",transform:"rotate(-0.5deg)"}},"secret"),
            "."
          )
        ),
        e(A,{vis:vis,delay:0.5},
          e("h2",{style:{fontFamily:Sf,fontSize:m?28:52,fontWeight:400,color:C.sage,lineHeight:1.15,margin:"0 0 40px"}},"We'll tell you.")
        ),
        e(A,{vis:vis,delay:0.7},
          e("button",{onClick:function(){sp(1);},style:{fontFamily:Bf,fontSize:m?14:16,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:m?"14px 28px":"18px 44px",borderRadius:8,cursor:"pointer",transition:"all 0.3s"}},
            "Prove it →"
          )
        )
      )
    );
  }

  if (phase===1) {
    return e("section",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}},
      e(Wrap,null,
        e(A,{vis:true,delay:0},
          e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:24,textTransform:"uppercase"}},"Pop quiz — no googling allowed")
        ),
        e(A,{vis:true,delay:0.15},
          e("h1",{style:{fontFamily:Sf,fontSize:m?32:64,fontWeight:400,color:C.char,lineHeight:1.08,margin:"0 0 32px",maxWidth:720}},
            "Name ",e("span",{style:{fontStyle:"italic"}},"one")," stock inside your mutual fund."
          )
        ),
        e(A,{vis:true,delay:0.3},
          e("div",{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:20}},
            e("input",{value:typed,onChange:function(ev){st(ev.target.value);if(ev.target.value.length>2)setTimeout(function(){sp(2);},900);},onKeyDown:function(ev){if(ev.key==="Enter")sp(2);},placeholder:"Go ahead. We'll wait.",autoFocus:true,style:{fontFamily:Bf,fontSize:m?16:18,padding:"14px 22px",border:"2px solid "+C.border,borderRadius:8,background:C.white,outline:"none",color:C.char,width:m?"100%":380}}),
            e("span",{onClick:function(){sp(2);},style:{fontFamily:Bf,fontSize:14,color:C.light,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:4}},"I genuinely have no idea →")
          )
        ),
        e(A,{vis:true,delay:0.45},
          e("p",{style:{fontFamily:Hf,fontSize:m?17:22,color:C.sage,transform:"rotate(-1.5deg)"}},"(most people can't. that's why we built this.)")
        )
      )
    );
  }

  return e("section",{style:{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center"}},
    e(Wrap,null,
      e(A,{vis:true,delay:0},
        e("div",{style:{fontFamily:Hf,fontSize:m?17:22,color:C.red,marginBottom:16}}, typed ? '"'+typed+'" — sure. Now name the other 47 stocks you own and didn\'t pick.' : "Yeah. That's the whole point.")
      ),
      e(A,{vis:true,delay:0.2},
        e("h1",{style:{fontFamily:Sf,fontSize:m?32:64,fontWeight:400,color:C.char,lineHeight:1.08,margin:"0 0 20px",maxWidth:780}},
          "Every month, you wire money to strangers ",
          e("span",{style:{fontStyle:"italic",color:C.muted}},"who buy things you can't name, charge fees you can't see, and call it 'wealth creation'.")
        )
      ),
      e(A,{vis:true,delay:0.35},
        e("p",{style:{fontFamily:Bf,fontSize:m?15:17,color:C.muted,lineHeight:1.7,maxWidth:500,margin:"0 0 32px"}},"We show you what your fund actually holds, what it actually costs, and whether the manager actually earned their fee. No jargon. No commissions. No reason to lie.")
      ),
      e(A,{vis:true,delay:0.45},
        e("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
          e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 32px",borderRadius:8,cursor:"pointer"}},"Show me what I own"),
          e("button",{onClick:function(){var el=document.getElementById("translator");if(el)el.scrollIntoView({behavior:"smooth"});},style:{fontFamily:Bf,fontSize:14,fontWeight:500,color:C.muted,background:"none",border:"none",padding:"14px 0",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:4}},"Start from zero ↓")
        )
      )
    )
  );
}

// ══════════════════════════════════════════
// HOMEPAGE SECTIONS
// ══════════════════════════════════════════
function JargonCard(p) {
  var _s=useState(false),rev=_s[0],sr=_s[1]; var m=useW()<768;
  return e(A,{vis:p.vis,delay:0.12+p.i*0.06},
    e("div",{onClick:function(){sr(!rev);},style:{background:rev?C.cream:C.white,border:"1px solid "+(rev?C.sage+"40":C.border),borderRadius:10,padding:m?"16px":"20px 24px",cursor:"pointer",transition:"all 0.3s"}},
      e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}},
        e("div",{style:{flex:1}},
          e("div",{style:{fontFamily:Bf,fontSize:m?13:15,color:rev?C.light:C.char,fontWeight:rev?400:600,lineHeight:1.5,textDecoration:rev?"line-through":"none",transition:"all 0.3s"}},p.j.fake),
          rev ? e("div",{style:{fontFamily:Bf,fontSize:m?13:15,color:C.char,fontWeight:600,marginTop:10,lineHeight:1.55,paddingTop:10,borderTop:"1px dashed "+C.border}},p.j.real) : null
        ),
        e("span",{style:{fontFamily:Mf,fontSize:9,color:C.light,flexShrink:0,marginTop:4}},rev?"HIDE":"TAP")
      )
    )
  );
}

function Translator() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var go=useGo(),m=useW()<768;
  return e("section",{ref:ref,id:"translator",style:{padding:m?"64px 0":"100px 0",background:C.white,borderTop:"1px solid "+C.border,borderBottom:"1px solid "+C.border}},
    e(Wrap,null,
      e(A,{vis:vis,delay:0.1},
        e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:10,textTransform:"uppercase"}},"Jargon → Human"),
        e("h2",{style:{fontFamily:Sf,fontSize:m?26:42,fontWeight:400,color:C.char,lineHeight:1.12,margin:"0 0 6px",maxWidth:560}},"They don't want you to understand this."),
        e("p",{style:{fontFamily:Hf,fontSize:m?16:20,color:C.sage,margin:"0 0 32px"}},"(tap to translate)")
      ),
      e("div",{style:{display:"flex",flexDirection:"column",gap:8}},JARGON.map(function(j,i){return e(JargonCard,{key:i,j:j,i:i,vis:vis});})),
      e(A,{vis:vis,delay:0.5},
        e("div",{style:{marginTop:m?24:36,paddingTop:m?24:32,borderTop:"1px dashed "+C.border,display:"flex",flexDirection:m?"column":"row",justifyContent:"space-between",alignItems:m?"flex-start":"center",gap:m?16:20}},
          e("div",null,
            e("p",{style:{fontFamily:Sf,fontSize:m?18:24,fontWeight:400,color:C.char,lineHeight:1.25,margin:"0 0 4px"}},"This was just 6 terms."),
            e("p",{style:{fontFamily:Hf,fontSize:m?15:18,color:C.sage,margin:0}},"We wrote the full dictionary — plus the math they hide behind it.")
          ),
          e("button",{onClick:function(){go("/learn");},style:{fontFamily:Bf,fontSize:m?13:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:m?"12px 24px":"14px 32px",borderRadius:8,cursor:"pointer",flexShrink:0,transition:"all 0.3s"}},"Read the investigations →")
        )
      )
    )
  );
}

function BigNumber() {
  var _r=useVis(0.2),ref=_r[0],vis=_r[1]; var m=useW()<768;
  return e("section",{ref:ref,style:{padding:m?"72px 0":"120px 0",textAlign:"center"}},
    e(Wrap,null,
      e(A,{vis:vis,delay:0.1},e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:4,color:C.red,marginBottom:16,textTransform:"uppercase"}},"The number they hope you never google")),
      e(A,{vis:vis,delay:0.2},e("div",{style:{fontFamily:Mf,fontSize:m?44:100,fontWeight:700,color:C.char,letterSpacing:-3,lineHeight:1,marginBottom:8}},"₹50,000 Cr")),
      e(A,{vis:vis,delay:0.3},e("p",{style:{fontFamily:Hf,fontSize:m?18:24,color:C.red,marginBottom:14}},"(every single year)")),
      e(A,{vis:vis,delay:0.35},e("p",{style:{fontFamily:Sf,fontSize:m?18:28,fontWeight:400,color:C.muted,lineHeight:1.45,maxWidth:520,margin:"0 auto"}},"That's what India's mutual fund industry skims off your returns. Every single year. Whether they beat the index or not."))
    )
  );
}

function Comparison() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var m=useW()<768; var sv=sipFV(500,12,10);
  return e("section",{ref:ref,style:{padding:m?"64px 0":"100px 0",background:C.char}},
    e(Wrap,null,
      e(A,{vis:vis,delay:0.1},e("h2",{style:{fontFamily:Sf,fontSize:m?24:38,fontWeight:400,color:C.cream,lineHeight:1.15,margin:"0 0 36px"}},"Same ₹500/month. ",e("span",{style:{fontStyle:"italic",opacity:0.5}},"Very different futures."))),
      e(A,{vis:vis,delay:0.2},
        e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 50px 1fr",gap:m?16:0,alignItems:"center"}},
          e("div",{style:{background:C.red+"15",border:"1px solid "+C.red+"30",borderRadius:12,padding:m?20:28,textAlign:"center"}},
            e("div",{style:{fontFamily:Bf,fontSize:13,color:C.red,fontWeight:600,marginBottom:8}},"₹500/month on food delivery"),
            e("div",{style:{fontFamily:Mf,fontSize:m?24:32,fontWeight:700,color:C.cream,marginBottom:6}},"₹"+fI(60000)),
            e("div",{style:{fontFamily:Bf,fontSize:12,color:C.light,lineHeight:1.5}},"Spent. Gone. Can you even name last Tuesday's order?")
          ),
          e("div",{style:{textAlign:"center"}},e("span",{style:{fontFamily:Sf,fontSize:22,fontStyle:"italic",color:C.muted}},"vs")),
          e("div",{style:{background:C.green+"15",border:"1px solid "+C.green+"30",borderRadius:12,padding:m?20:28,textAlign:"center"}},
            e("div",{style:{fontFamily:Bf,fontSize:13,color:C.green,fontWeight:600,marginBottom:8}},"₹500/month in a SIP"),
            e("div",{style:{fontFamily:Mf,fontSize:m?24:32,fontWeight:700,color:C.cream,marginBottom:6}},"₹"+fI(sv)),
            e("div",{style:{fontFamily:Bf,fontSize:12,color:C.light,lineHeight:1.5}},"Compounding quietly. No app required."),
            e("div",{style:{fontFamily:Hf,fontSize:16,color:C.green,marginTop:8}},"₹"+fI(sv-60000)+" that didn't exist before")
          )
        )
      )
    )
  );
}

function FundCard(p) {
  var fd=useFund(p.fund.code); var _h=useState(false),h=_h[0],sh=_h[1]; var go=useGo(),m=useW()<768;
  var nav90=fd.data&&fd.data.data?fd.data.data.slice(0,90):[]; var nav=nav90[0]?nav90[0].nav:"—";
  var ret=fd.data&&fd.data.data?calcReturn(fd.data.data,252):null; var pos=ret!==null&&ret>=0;
  return e("div",{onClick:function(){go("/scheme/"+p.houseSlug+"/"+p.fund.code);},onMouseEnter:function(){sh(true);},onMouseLeave:function(){sh(false);},style:{flex:m?"1 1 100%":"1 1 0",minWidth:m?"auto":280,background:C.white,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all 0.4s",transform:h?"translateY(-4px)":"none",boxShadow:h?"0 12px 40px rgba(26,26,26,0.1)":"0 1px 4px rgba(26,26,26,0.04)",border:"1px solid "+(h?C.sage+"60":C.border)}},
    e("div",{style:{background:"linear-gradient(135deg, "+C.sage+", "+C.sageDk+")",padding:"12px 18px"}},e("span",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:"rgba(255,255,255,0.7)",textTransform:"uppercase"}},p.fund.cat)),
    e("div",{style:{padding:m?16:20}},
      e("div",{style:{fontFamily:Bf,fontSize:m?14:15,fontWeight:700,color:C.char,lineHeight:1.3,marginBottom:4}},p.fund.name),
      e("div",{style:{fontFamily:Hf,fontSize:14,color:C.sage,marginBottom:10}},'"'+p.fund.personality+'"'),
      e("p",{style:{fontFamily:Bf,fontSize:12,color:C.muted,lineHeight:1.55,marginBottom:12,minHeight:40}},p.fund.one),
      e("div",{style:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12,paddingBottom:12,borderBottom:"1px solid "+C.border}},
        e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"AUM"),
          e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:C.char}},p.fund.aum||"—")
        ),
        e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"Expense"),
          e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:C.char}},p.fund.exp||"—")
        ),
        e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"Since"),
          e("div",{style:{fontFamily:Mf,fontSize:11,fontWeight:700,color:C.char}},p.fund.inception||"—")
        ),
        p.fund.sharpe?e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"Sharpe"),
          e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:parseFloat(p.fund.sharpe)>1.5?C.green:parseFloat(p.fund.sharpe)>1?C.mustard:C.red}},p.fund.sharpe)
        ):null,
        p.fund.beta?e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"Beta"),
          e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:C.char}},p.fund.beta)
        ):null,
        p.fund.alpha&&p.fund.alpha!=="—"?e("div",{style:{flex:"1 1 calc(33% - 4px)",minWidth:76,background:C.cream,borderRadius:8,padding:"7px 9px"}},
          e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:1,color:C.light,textTransform:"uppercase",marginBottom:2}},"Alpha"),
          e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:parseFloat(p.fund.alpha)>0?C.green:C.red}},p.fund.alpha)
        ):null
      ),
      !fd.loading&&nav90.length>0?e("div",null,
        e("div",{style:{marginBottom:8}},e(Spark,{data:nav90,w:m?260:220,h:40})),
        e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}},
          e("div",null,
            e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:1}},"CURRENT NAV"),
            e("div",{style:{fontFamily:Mf,fontSize:16,fontWeight:700,color:C.char}},"₹"+fN(nav))
          ),
          ret!==null?e("div",{style:{textAlign:"right"}},
            e("div",{style:{fontFamily:Mf,fontSize:12,fontWeight:700,color:pos?C.green:C.red,background:pos?C.gBg:C.rBg,padding:"4px 8px",borderRadius:4}},(pos?"↑":"↓")+" "+ret.toFixed(1)+"%"),
            e("div",{style:{fontFamily:Bf,fontSize:10,color:C.light,marginTop:1}},"1-year return")
          ):null
        )
      ):null,
      fd.loading?e("div",{style:{fontFamily:Mf,fontSize:11,color:C.light,padding:"14px 0",animation:"pulse 1.5s ease-in-out infinite"}},"Fetching live data..."):null,
      e("div",{style:{marginTop:10,paddingTop:8,borderTop:"1px solid "+C.border,display:"flex",alignItems:"center",gap:4}},
        e("span",{style:{fontFamily:Bf,fontSize:11,fontWeight:700,color:C.sage}},"Full analysis →"),
        e("span",{style:{fontFamily:Bf,fontSize:10,color:C.light}},"Holdings, returns, fact sheet")
      )
    )
  );
}

function FundProfiles() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var go=useGo(),m=useW()<768;
  return e("section",{ref:ref,style:{padding:m?"64px 0":"100px 0"}},
    e(Wrap,null,
      e(A,{vis:vis,delay:0.1},
        e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32,flexWrap:"wrap",gap:12}},
          e("div",null,
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}},e("span",{style:{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s ease-in-out infinite"}}),"Live from mfapi.in"),
            e("h2",{style:{fontFamily:Sf,fontSize:m?26:38,fontWeight:400,color:C.char,margin:0,lineHeight:1.12}},"Three funds. ",e("span",{style:{fontStyle:"italic",color:C.muted}},"Zero sugar-coating."))
          ),
          e("span",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:4}},"See all funds →")
        )
      ),
      e(A,{vis:vis,delay:0.2},
        e("div",{style:{display:"flex",gap:14,flexWrap:"wrap"}},
          e(FundCard,{fund:PPFAS.schemes[0],houseSlug:"ppfas"}),
          e(FundCard,{fund:QUANT.schemes[0],houseSlug:"quant"}),
          e(FundCard,{fund:QUANT.schemes[1],houseSlug:"quant"})
        )
      )
    )
  );
}

function LeaderItem(p) {
  var go=useGo(),m=useW()<768;
  return e(HoverRow,{onClick:function(){go(p.f.route);},style:{display:"flex",alignItems:"center",gap:m?12:24,padding:m?"16px":"22px 28px",borderBottom:p.i<2?"1px solid "+C.border:"none"}},
    e("div",{style:{fontFamily:Sf,fontSize:m?24:40,fontStyle:"italic",color:p.f.r===1?C.mustard:C.faint,minWidth:m?28:44,lineHeight:1}},p.f.r),
    e("div",{style:{flex:1}},e("div",{style:{fontFamily:Bf,fontSize:m?13:15,fontWeight:700,color:C.char}},p.f.name),e("div",{style:{fontFamily:Hf,fontSize:m?12:14,color:C.muted,marginTop:2}},p.f.vibe)),
    e("div",{style:{fontFamily:Mf,fontSize:m?16:24,fontWeight:700,color:C.green}},p.f.cagr)
  );
}

function Leaders() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var m=useW()<768;
  return e("section",{ref:ref,style:{padding:m?"64px 0":"80px 0",background:C.white,borderTop:"1px solid "+C.border,borderBottom:"1px solid "+C.border}},
    e(Wrap,null,
      e(A,{vis:vis,delay:0.1},e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.mustard,marginBottom:8,textTransform:"uppercase"}},"5-Year CAGR Leaderboard"),e("h2",{style:{fontFamily:Sf,fontSize:m?24:36,fontWeight:400,color:C.char,margin:"0 0 28px"}},"The ones winning right now",e("br",null),e("span",{style:{fontFamily:Hf,fontSize:m?16:22,color:C.sage}},"past performance, future uncertainty"))),
      e(A,{vis:vis,delay:0.2},e("div",{style:{borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}},TOP3.map(function(f,i){return e(LeaderItem,{key:f.r,f:f,i:i});})))
    )
  );
}

function SIPCalc() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var _m=useState(5000),mo=_m[0],smo=_m[1]; var m=useW()<768;
  var inv=mo*120,corp=sipFV(mo,12,10),gain=corp-inv;
  return e("section",{ref:ref,style:{padding:m?"64px 0":"100px 0"}},
    e(Wrap,{style:{maxWidth:600,textAlign:"center"}},
      e(A,{vis:vis,delay:0.1},e("h2",{style:{fontFamily:Sf,fontSize:m?24:36,fontWeight:400,color:C.char,margin:"0 0 4px"}},"Slide the bar. Try not to get emotional."),e("p",{style:{fontFamily:Hf,fontSize:m?15:18,color:C.sage,margin:"0 0 28px"}},"(12% assumed. math doesn't care about feelings.)")),
      e(A,{vis:vis,delay:0.2},
        e("div",{style:{background:C.white,borderRadius:12,padding:m?20:36,border:"1px solid "+C.border,textAlign:"left"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:12}},e("span",{style:{fontFamily:Bf,fontSize:13,color:C.muted}},"Monthly SIP"),e("span",{style:{fontFamily:Mf,fontSize:m?22:30,fontWeight:700,color:C.char}},"₹"+fI(mo))),
          e("input",{type:"range",min:500,max:100000,step:500,value:mo,onChange:function(ev){smo(Number(ev.target.value));},style:{width:"100%",height:6,WebkitAppearance:"none",appearance:"none",background:"linear-gradient(to right, "+C.sage+" "+((mo-500)/99500*100)+"%, "+C.border+" "+((mo-500)/99500*100)+"%)",borderRadius:3,outline:"none",cursor:"pointer"}}),
          e("div",{style:{textAlign:"center",padding:"28px 0 12px",borderTop:"1px solid "+C.border,marginTop:20}},
            e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:3,color:C.light,marginBottom:10,textTransform:"uppercase"}},"After 10 years at 12%"),
            e("div",{style:{fontFamily:Mf,fontSize:m?36:52,fontWeight:700,color:C.mustard,letterSpacing:-2,lineHeight:1,marginBottom:10}},"₹"+fI(corp)),
            e("div",{style:{fontFamily:Bf,fontSize:13,color:C.muted}},"You invest ₹"+fI(inv)+". Compounding adds ₹"+fI(gain)+"."),
            e("div",{style:{fontFamily:Hf,fontSize:m?17:20,color:C.green,marginTop:8}},(corp/inv).toFixed(1)+"x your money."),
            e("div",{style:{marginTop:14,paddingTop:12,borderTop:"1px dashed "+C.border}},
              e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.red,marginBottom:4,textTransform:"uppercase"}},"What your fund house takes"),
              e("div",{style:{fontFamily:Mf,fontSize:m?16:20,fontWeight:700,color:C.red}},"~₹"+fI(Math.round(corp*0.006))+" to ₹"+fI(Math.round(corp*0.015))),
              e("div",{style:{fontFamily:Bf,fontSize:11,color:C.light,marginTop:2}},"At 0.6% to 1.5% TER. Every year. From your corpus.")
            )
          )
        )
      )
    )
  );
}

function Closing() {
  var _r=useVis(),ref=_r[0],vis=_r[1]; var go=useGo(),m=useW()<768;
  return e("section",{ref:ref,style:{padding:m?"72px 0":"120px 0",background:C.sage}},
    e(Wrap,{style:{maxWidth:660,textAlign:"center"}},
      e(A,{vis:vis,delay:0.1},e("h2",{style:{fontFamily:Sf,fontSize:m?28:48,fontWeight:400,color:C.cream,lineHeight:1.15,margin:"0 0 16px"}},"Your money is already invested.",e("br",null),"The only question is whether ",e("span",{style:{fontStyle:"italic"}},"you")," know what it's doing.")),
      e(A,{vis:vis,delay:0.2},e("p",{style:{fontFamily:Hf,fontSize:m?17:22,color:"rgba(255,255,255,0.45)",marginBottom:28}},"(no app to download. no KYC to complete. just clarity.)")),
      e(A,{vis:vis,delay:0.3},e("div",{style:{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}},
        e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.sage,background:C.cream,border:"none",padding:"14px 32px",borderRadius:8,cursor:"pointer"}},"Explore your funds"),
        e("button",{onClick:function(){go("/manifesto");},style:{fontFamily:Bf,fontSize:14,fontWeight:600,color:C.cream,background:"transparent",border:"1.5px solid rgba(255,255,255,0.3)",padding:"14px 32px",borderRadius:8,cursor:"pointer"}},"Why we built this →")
      ))
    )
  );
}

function Landing() { return e("div",null,e(Hero),e(Translator),e(BigNumber),e(Comparison),e(FundProfiles),e(Leaders),e(SIPCalc),e(Closing)); }

// ══════════════════════════════════════════
// FUND HOUSE PAGE — editorial deep dive
// ══════════════════════════════════════════
function SchemeRow(p) {
  var go=useGo(),m=useW()<768;
  return e(HoverRow,{onClick:function(){go("/scheme/"+p.houseSlug+"/"+p.s.code);},style:{display:"flex",alignItems:"center",gap:m?12:16,padding:m?"14px 16px":"18px 22px",border:"1px solid "+C.border,borderRadius:10,marginBottom:8}},
    e("div",{style:{flex:1}},e("div",{style:{fontFamily:Bf,fontSize:m?13:15,fontWeight:700,color:C.char}},p.s.name),e("div",{style:{fontFamily:Hf,fontSize:m?12:14,color:C.muted}},p.s.personality)),
    e("div",{style:{textAlign:"right",flexShrink:0}},e("div",{style:{fontFamily:Mf,fontSize:m?12:14,fontWeight:700,color:C.char}},p.s.aum||"—"),e("div",{style:{fontFamily:Mf,fontSize:9,color:C.light}},p.s.cat))
  );
}

function FundHousePage(p) {
  var house=p.slug==="ppfas"?PPFAS:p.slug==="quant"?QUANT:null;
  useTitle(house ? house.name + " — Fund House Profile" : null);
  var go=useGo(),m=useW()<768; var _r=useVis(0.05),ref=_r[0],vis=_r[1];
  if(!house) return e(DynamicHousePage,{slug:p.slug});
  return e("div",{style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap,null,
      e("span",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,display:"inline-block",marginBottom:20}},"← Home"),
      e("div",{ref:ref},
        // Header
        e(A,{vis:vis,delay:0.05},e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase"}},"Fund House Profile")),
        e(A,{vis:vis,delay:0.1},e("h1",{style:{fontFamily:Sf,fontSize:m?28:52,fontWeight:400,color:C.char,lineHeight:1.08,margin:"0 0 8px"}},house.name)),
        e(A,{vis:vis,delay:0.15},e("p",{style:{fontFamily:Hf,fontSize:m?18:24,color:C.sage,margin:"0 0 6px"}},'"'+house.personality+'"')),
        e(A,{vis:vis,delay:0.2},e("p",{style:{fontFamily:Bf,fontSize:m?14:16,color:C.muted,lineHeight:1.7,margin:"0 0 24px",maxWidth:600}},house.vibe)),

        // Stats
        e(A,{vis:vis,delay:0.25},e("div",{style:{display:"flex",gap:12,flexWrap:"wrap",marginBottom:36}},
          [{l:"AUM",v:house.aum},{l:"Schemes",v:house.numSchemes},{l:"Since",v:house.inception}].map(function(s,i){
            return e("div",{key:i,style:{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"10px 16px"}},
              e("div",{style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase"}},s.l),
              e("div",{style:{fontFamily:Mf,fontSize:m?14:16,fontWeight:700,color:C.char}},s.v)
            );
          })
        )),

        // Philosophy
        e(A,{vis:vis,delay:0.3},e("div",{style:{background:C.char,borderRadius:12,padding:m?20:36,marginBottom:36}},
          e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:12,textTransform:"uppercase"}},"Investment philosophy — translated to english"),
          e("p",{style:{fontFamily:Bf,fontSize:m?14:16,color:"#ccc",lineHeight:1.75,margin:0,maxWidth:620}},house.philosophy)
        )),

        // Green flags
        e(A,{vis:vis,delay:0.35},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.green,marginBottom:14}},"✦ Green flags"),
          e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:8,marginBottom:28}},
            house.greenFlags.map(function(f,i){return e("div",{key:i,style:{background:C.green+"08",border:"1px solid "+C.green+"20",borderRadius:10,padding:m?"14px":"16px 20px"}},e("p",{style:{fontFamily:Bf,fontSize:m?12:14,color:C.body,lineHeight:1.6,margin:0}},f));})
          )
        ),

        // Red flags
        e(A,{vis:vis,delay:0.4},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.red,marginBottom:14}},"✦ Red flags (yes, even the good ones have them)"),
          e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:8,marginBottom:36}},
            house.redFlags.map(function(f,i){return e("div",{key:i,style:{background:C.red+"08",border:"1px solid "+C.red+"20",borderRadius:10,padding:m?"14px":"16px 20px"}},e("p",{style:{fontFamily:Bf,fontSize:m?12:14,color:C.body,lineHeight:1.6,margin:0}},f));})
          )
        ),

        // People
        e(A,{vis:vis,delay:0.45},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.char,marginBottom:14}},"The people spending your money"),
          e("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:36}},
            house.keyPeople.map(function(p,i){return e("div",{key:i,style:{flex:m?"1 1 100%":"1 1 0",minWidth:240,background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?16:20}},
              e("div",{style:{fontFamily:Bf,fontSize:m?14:15,fontWeight:700,color:C.char}},p.name),
              e("div",{style:{fontFamily:Mf,fontSize:9,color:C.light,letterSpacing:1,marginBottom:8}},p.role),
              e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},p.note)
            );})
          )
        ),

        // Who is this for
        e(A,{vis:vis,delay:0.5},
          e("div",{style:{background:C.sage+"10",border:"1px solid "+C.sage+"25",borderRadius:12,padding:m?20:28,marginBottom:36}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:10,textTransform:"uppercase"}},"Who is this for?"),
            e("p",{style:{fontFamily:Bf,fontSize:m?13:15,color:C.body,lineHeight:1.7,margin:0}},house.whoIsThisFor)
          )
        ),

        // Scheme lineup
        e(A,{vis:vis,delay:0.55},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.char,marginBottom:4}},"The lineup"),
          e("p",{style:{fontFamily:Hf,fontSize:m?15:17,color:C.sage,marginBottom:16}},"(tap any fund for the full breakdown)"),
          e("div",null,house.schemes.map(function(s,i){return e(SchemeRow,{key:i,s:s,houseSlug:house.slug});}))
        ),

        // Skin in game
        house.skinInGame ? e(A,{vis:vis,delay:0.6},
          e("div",{style:{background:C.mustard+"10",border:"1px solid "+C.mustard+"25",borderRadius:12,padding:m?20:28,marginTop:28}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.mustard,marginBottom:8,textTransform:"uppercase"}},"Skin in the game"),
            e("p",{style:{fontFamily:Bf,fontSize:m?13:15,color:C.body,lineHeight:1.7,margin:0}},house.skinInGame)
          )
        ) : null
      )
    )
  );
}

// ══════════════════════════════════════════
// SCHEME PAGE — editorial deep dive with live data
// ══════════════════════════════════════════
function HoldingRow(p) {
  var _s=useState(false),exp=_s[0],se=_s[1]; var m=useW()<768;
  return e("div",{onClick:function(){se(!exp);},style:{background:exp?C.cream:C.white,border:"1px solid "+(exp?C.sage+"40":C.border),borderRadius:10,padding:m?"12px 14px":"14px 18px",cursor:"pointer",transition:"all 0.3s",marginBottom:6}},
    e("div",{style:{display:"flex",alignItems:"center",gap:10}},
      e("div",{style:{fontFamily:Sf,fontSize:m?16:20,fontStyle:"italic",color:p.i<3?C.mustard:C.faint,minWidth:m?22:28,textAlign:"center"}},p.i+1),
      e("div",{style:{flex:1}},
        e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:5}},
          e("span",{style:{fontFamily:Bf,fontSize:m?12:14,fontWeight:700,color:C.char}},p.h.name),
          e("span",{style:{fontFamily:Mf,fontSize:m?12:14,fontWeight:700,color:C.char}},p.h.pct+"%")
        ),
        e("div",{style:{height:4,background:C.border,borderRadius:2,overflow:"hidden"}},e("div",{style:{height:"100%",width:(p.h.pct/p.maxPct*100)+"%",background:p.i<3?C.sage:C.faint,borderRadius:2}})),
        p.h.sector?e("div",{style:{fontFamily:Mf,fontSize:9,color:C.light,marginTop:3,letterSpacing:1}},p.h.sector):null
      )
    ),
    exp&&p.h.note?e("div",{style:{marginTop:8,marginLeft:m?32:38,paddingTop:8,borderTop:"1px dashed "+C.border}},
      e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},p.h.note)
    ):null
  );
}

function ReturnRow(p) {
  var val = fPn(p.v); var color = val===null?C.faint:val>=0?C.green:C.red;
  return e("div",{style:{padding:p.m?"12px 14px":"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:p.last?"none":"1px solid "+C.border,background:p.highlight?C.sage+"08":C.white}},
    e("div",null,
      e("span",{style:{fontFamily:Bf,fontSize:p.m?12:13,color:C.char,fontWeight:600}},p.label),
      p.note?e("div",{style:{fontFamily:Hf,fontSize:p.m?11:13,color:C.sage,marginTop:2}},p.note):null
    ),
    e("span",{style:{fontFamily:Mf,fontSize:p.m?14:16,fontWeight:700,color:color}},fP(p.v))
  );
}

// ══════════════════════════════════════════
// DYNAMIC HOUSE PAGE — non-profiled fund houses
// ══════════════════════════════════════════
function DynamicHousePage(p) {
  var go = useGo(), m = useW() < 768;
  var allFunds = useAllFunds();
  var _v = useState(false), vis = _v[0], setVis = _v[1];
  var _filter = useState(""), filter = _filter[0], setFilter = _filter[1];

  var amc = null;
  if (allFunds.funds) {
    for (var i = 0; i < allFunds.funds.length; i++) {
      if (allFunds.funds[i].slug === p.slug) { amc = allFunds.funds[i]; break; }
    }
  }

  useTitle(amc ? amc.name + " — All Schemes, Live NAV & Returns" : null);

  useEffect(function() {
    if (!allFunds.loading && amc) {
      var t = setTimeout(function() { setVis(true); }, 60);
      return function() { clearTimeout(t); };
    }
  }, [allFunds.loading]);

  if (allFunds.loading) return e("div", {style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap, null,
      e("span", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,display:"inline-block",marginBottom:20,textDecoration:"underline",textUnderlineOffset:4}}, "← Explore"),
      e("div", {style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase"}}, "Fund House"),
      e("h1", {style:{fontFamily:Sf,fontSize:m?24:44,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 24px"}}, "Loading fund house..."),
      e("div", {style:{fontFamily:Mf,fontSize:12,color:C.light,animation:"pulse 1.5s infinite"}}, "Fetching scheme data from mfapi.in")
    )
  );

  if (!amc) return e(Shell, {label:"Fund House",title:"Fund house not found",sub:"We couldn't find a fund house matching this URL. It may have been renamed or merged."},
    e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}}, "Browse all fund houses →")
  );

  var schemes = amc.schemes;
  if (filter.trim()) {
    var filterWords = filter.toLowerCase().split(/\s+/).filter(function(w) { return w; });
    schemes = schemes.filter(function(s) { var low = s.schemeName.toLowerCase(); return filterWords.every(function(w) { return low.indexOf(w) >= 0; }); });
  }

  return e("div", {style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap, null,
      e("div", {style:{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}},
        e("span", {onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}}, "Home"),
        e("span", {style:{color:C.faint}}, " / "),
        e("span", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}}, "Explore"),
        e("span", {style:{color:C.faint}}, " / "),
        e("span", {style:{fontFamily:Bf,fontSize:12,color:C.muted}}, amc.name)
      ),

      e("div", null,
        e(A, {vis:vis,delay:0.05},
          e("div", {style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase"}}, "Fund House")
        ),
        e(A, {vis:vis,delay:0.1},
          e("h1", {style:{fontFamily:Sf,fontSize:m?28:52,fontWeight:400,color:C.char,lineHeight:1.08,margin:"0 0 8px"}}, amc.name)
        ),
        e(A, {vis:vis,delay:0.15},
          e("p", {style:{fontFamily:Bf,fontSize:m?14:16,color:C.muted,lineHeight:1.7,margin:"0 0 24px",maxWidth:600}},
            amc.schemes.length + " scheme" + (amc.schemes.length !== 1 ? "s" : "") + " on file. Live data powered by mfapi.in. Tap any scheme for NAV history, returns, and volatility."
          )
        ),

        e(A, {vis:vis,delay:0.2},
          e("div", {style:{background:C.sage+"08",border:"1px solid "+C.sage+"20",borderRadius:12,padding:m?16:20,marginBottom:24}},
            e("p", {style:{fontFamily:Bf,fontSize:m?12:13,color:C.body,margin:0,lineHeight:1.6}},
              "This is a data-only view. We haven't written an editorial for " + amc.name + " yet. Full analysis is available for ",
              e("span", {onClick:function(){go("/house/ppfas");},style:{color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}, "PPFAS"),
              " and ",
              e("span", {onClick:function(){go("/house/quant");},style:{color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}, "Quant"),
              "."
            )
          )
        ),

        amc.schemes.length > 10 ? e(A, {vis:vis,delay:0.22},
          e("input", {
            value: filter,
            onChange: function(ev) { setFilter(ev.target.value); },
            placeholder: "Filter — 'growth', 'direct', 'flexi cap'...",
            style: {width:"100%",fontFamily:Bf,fontSize:m?13:14,padding:"12px 18px",border:"1.5px solid "+C.border,borderRadius:8,background:C.white,outline:"none",color:C.char,marginBottom:16,boxSizing:"border-box"}
          })
        ) : null,

        e(A, {vis:vis,delay:0.25},
          e("div", {style:{fontFamily:Mf,fontSize:10,color:C.light,letterSpacing:1,marginBottom:10}},
            filter ? schemes.length + " of " + amc.schemes.length + " schemes" : amc.schemes.length + " scheme" + (amc.schemes.length !== 1 ? "s" : "")
          )
        ),

        e(A, {vis:vis,delay:0.3},
          e("div", {style:{borderRadius:10,overflow:"hidden",border:"1px solid "+C.border}},
            schemes.length === 0
              ? e("div", {style:{padding:16,textAlign:"center"}}, e("p", {style:{fontFamily:Bf,fontSize:13,color:C.muted}}, "No schemes match '" + filter + "'"))
              : schemes.map(function(s, i) {
                  return e(HoverRow, {
                    key: s.schemeCode,
                    onClick: function() { go("/fund/" + s.schemeCode); },
                    style: {padding:m?"12px 14px":"14px 18px",borderBottom:i<schemes.length-1?"1px solid "+C.border:"none"}
                  },
                    e("div", {style:{fontFamily:Bf,fontSize:m?12:14,fontWeight:600,color:C.char,marginBottom:2}}, s.schemeName),
                    e("div", {style:{fontFamily:Mf,fontSize:10,color:C.light}}, "Code: " + s.schemeCode)
                  );
                })
          )
        ),

        e(A, {vis:vis,delay:0.35},
          e("div", {style:{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}},
            e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage,background:"transparent",border:"1.5px solid "+C.sage,padding:"12px 22px",borderRadius:8,cursor:"pointer"}}, "← All fund houses"),
            e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 22px",borderRadius:8,cursor:"pointer"}}, "Search all schemes →")
          )
        )
      )
    )
  );
}

// ══════════════════════════════════════════
// DYNAMIC SCHEME PAGE — non-profiled funds
// ══════════════════════════════════════════
function DynamicSchemePage(p) {
  var fd = useFund(p.code);
  var go = useGo(), m = useW() < 768;
  useTitle(fd.data && fd.data.meta && fd.data.meta.scheme_name ? fd.data.meta.scheme_name + " — Live NAV & Returns" : null);
  var _v = useState(false), vis = _v[0], setVis = _v[1];
  useEffect(function(){
    if(!fd.loading && fd.data && fd.data.meta && fd.data.meta.scheme_name){
      var t = setTimeout(function(){ setVis(true); }, 60);
      return function(){ clearTimeout(t); };
    }
  },[fd.loading]);

  if (fd.loading) return e("div", {style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap, null,
      e("span", {onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,display:"inline-block",marginBottom:20,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}}, "← Home"),
      e("div", {style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase"}}, "Fund"),
      e("h1", {style:{fontFamily:Sf,fontSize:m?24:44,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 24px"}}, "Fetching live data..."),
      e("div", {style:{fontFamily:Mf,fontSize:12,color:C.light,animation:"pulse 1.5s infinite"}}, "Loading NAV history from mfapi.in")
    )
  );

  if (!fd.data || !fd.data.meta || !fd.data.meta.scheme_name) return e(Shell, {label:"Fund",title:"Fund not found",sub:"This scheme code doesn't exist on mfapi.in. It may have been merged or closed."},
    e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}}, "Explore funds →")
  );

  var meta = fd.data.meta;
  var data = fd.data.data || [];
  var nav90 = data.slice(0, 90);
  var latest = data[0] || null;

  var liveReturns = {
    d1: calcReturn(data, 1), w1: calcReturn(data, 5), m1: calcReturn(data, 21),
    m3: calcReturn(data, 63), m6: calcReturn(data, 126), y1: calcReturn(data, 252),
    y3: calcCAGR(data, 756), y5: calcCAGR(data, 1260)
  };
  var vol1y = calcVolatility(data, 252);
  var maxDD = calcMaxDrawdown(data, 1260);
  var hasReturns = liveReturns.m1 !== null || liveReturns.y1 !== null;

  return e("div", {style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap, null,
      // 1. Breadcrumb
      e("div", {style:{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}},
        e("span", {onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}}, "Home"),
        e("span", {style:{color:C.faint}}, " / "),
        e("span", {style:{fontFamily:Bf,fontSize:12,color:C.muted}}, meta.fund_house)
      ),

      e("div", null,
        // 2. Category badge
        e(A, {vis:vis,delay:0.05},
          e("div", {style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:6,textTransform:"uppercase"}}, meta.scheme_category || "Fund")
        ),

        // 3. Fund name
        e(A, {vis:vis,delay:0.1},
          e("h1", {style:{fontFamily:Sf,fontSize:m?24:44,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 8px"}}, meta.scheme_name)
        ),

        // 4. Subtitle
        e(A, {vis:vis,delay:0.15},
          e("p", {style:{fontFamily:Bf,fontSize:m?14:16,color:C.muted,lineHeight:1.7,margin:"0 0 24px"}}, meta.fund_house + " · " + (meta.scheme_type || "Open Ended"))
        ),

        // 5 & 6. NAV card + Returns table (2-col grid)
        e(A, {vis:vis,delay:0.2},
          e("div", {style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:14,marginBottom:32}},
            // 5. NAV card (left)
            e("div", {style:{background:C.white,border:"1px solid "+C.border,borderRadius:12,padding:m?20:28}},
              e("div", {style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,marginBottom:4,textTransform:"uppercase"}}, "Latest NAV" + (latest ? " · " + latest.date : "")),
              e("div", {style:{fontFamily:Mf,fontSize:m?28:40,fontWeight:700,color:C.char,letterSpacing:-1,marginBottom:14}}, latest ? "₹" + fN(latest.nav) : "—"),
              nav90.length > 0 ? e(Spark, {data:nav90,w:m?280:380,h:60}) : null,
              vol1y !== null ? e("div", {style:{marginTop:12,padding:"10px 0",borderTop:"1px solid "+C.border}},
                e("div", {style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:4}}, "Annualized volatility (1Y)"),
                e("div", {style:{fontFamily:Mf,fontSize:16,fontWeight:700,color:vol1y>20?C.red:vol1y>12?C.mustard:C.green}}, vol1y.toFixed(1) + "%"),
                e("div", {style:{fontFamily:Hf,fontSize:m?12:14,color:C.sage,marginTop:2}}, vol1y > 20 ? "Wild ride. Seatbelts required." : vol1y > 12 ? "Moderate swings. Normal for equity." : "Unusually calm. The cash helps.")
              ) : null,
              maxDD !== null && maxDD > 5 ? e("div", {style:{marginTop:8}},
                e("div", {style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:4}}, "Max drawdown (5Y)"),
                e("div", {style:{fontFamily:Mf,fontSize:16,fontWeight:700,color:C.red}}, "-" + maxDD.toFixed(1) + "%"),
                e("div", {style:{fontFamily:Hf,fontSize:m?12:14,color:C.sage,marginTop:2}}, maxDD > 30 ? "That's a stomach test. Could you hold through this?" : maxDD > 15 ? "Painful but recoverable." : "Relatively gentle decline.")
              ) : null
            ),

            // 6. Returns table (right)
            hasReturns ? e("div", {style:{background:C.white,border:"1px solid "+C.border,borderRadius:12,overflow:"hidden"}},
              e("div", {style:{padding:m?"12px 14px":"14px 20px",borderBottom:"1px solid "+C.border,background:C.cream}},
                e("div", {style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase"}}, "Report card — calculated from live NAV data")
              ),
              e(ReturnRow, {label:"1 Day",v:liveReturns.d1,m:m}),
              e(ReturnRow, {label:"1 Week",v:liveReturns.w1,m:m}),
              e(ReturnRow, {label:"1 Month",v:liveReturns.m1,m:m}),
              e(ReturnRow, {label:"3 Months",v:liveReturns.m3,m:m}),
              e(ReturnRow, {label:"6 Months",v:liveReturns.m6,m:m}),
              e(ReturnRow, {label:"1 Year",v:liveReturns.y1,note:liveReturns.y1!==null?(liveReturns.y1>15?"Strong year":"Meh year"):null,m:m,highlight:true}),
              e(ReturnRow, {label:"3Y CAGR",v:liveReturns.y3,note:liveReturns.y3!==null?(liveReturns.y3>18?"Beating most FMs":"Decent"):null,m:m}),
              e(ReturnRow, {label:"5Y CAGR",v:liveReturns.y5,note:liveReturns.y5!==null?(liveReturns.y5>20?"Elite":"Solid"):null,m:m,highlight:true,last:true})
            ) : null
          )
        ),

        // 7. Editorial coming soon note
        e(A, {vis:vis,delay:0.25},
          e("div", {style:{background:C.sage+"08",border:"1px solid "+C.sage+"20",borderRadius:12,padding:m?16:20,marginTop:24}},
            e("p", {style:{fontFamily:Bf,fontSize:m?12:13,color:C.body,margin:0,lineHeight:1.6}},
              "We haven't written an editorial profile for this fund yet. Live NAV data from mfapi.in. Deep-dive analysis with holdings, commentary, and honest opinions is available for ",
              e("span", {onClick:function(){go("/house/ppfas");},style:{color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}, "PPFAS"),
              " and ",
              e("span", {onClick:function(){go("/house/quant");},style:{color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}, "Quant"),
              ". More fund houses coming soon."
            )
          )
        ),

        // 8. CTAs
        e(A, {vis:vis,delay:0.3},
          e("div", {style:{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}},
            e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage,background:"transparent",border:"1.5px solid "+C.sage,padding:"12px 22px",borderRadius:8,cursor:"pointer"}}, "← Explore funds"),
            e("button", {onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 22px",borderRadius:8,cursor:"pointer"}}, "Search all 12,247 →")
          )
        )
      )
    )
  );
}

function SchemePage(p) {
  var house=p.houseSlug==="ppfas"?PPFAS:p.houseSlug==="quant"?QUANT:null;
  var scheme=house?house.schemes.find(function(s){return s.code===p.code;}):null;
  useTitle(scheme ? scheme.name + " — Full Analysis" : null);
  var fd=useFund(p.code); var go=useGo(),m=useW()<768;
  var _r=useVis(0.05),ref=_r[0],vis=_r[1]; var _sa=useState(false),showAll=_sa[0],setSA=_sa[1];
  if(!scheme) return e(DynamicSchemePage,{code:p.code});

  var data = fd.data&&fd.data.data?fd.data.data:[];
  var nav90 = data.slice(0,90); var latest = data[0]||null;

  // Calculate returns from live data
  var liveReturns = {
    d1: calcReturn(data,1), w1: calcReturn(data,5), m1: calcReturn(data,21),
    m3: calcReturn(data,63), m6: calcReturn(data,126), y1: calcReturn(data,252),
    y2: calcCAGR(data,504), y3: calcCAGR(data,756), y5: calcCAGR(data,1260)
  };
  var vol1y = calcVolatility(data,252);
  var maxDD = calcMaxDrawdown(data,1260);

  var holdings = scheme.holdings||[];
  var maxPct = holdings.length?Math.max.apply(null,holdings.map(function(h){return h.pct;})):10;
  var sectors = scheme.sectors||[];
  var sectorColors = [C.sage,C.char,C.mustard,C.green,"#8B7355","#7B68AE",C.faint,"#C4453C"];

  return e("div",{style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap,null,
      // Breadcrumb
      e("div",{style:{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}},
        e("span",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}},"Home"),
        e("span",{style:{color:C.faint}}," / "),
        e("span",{onClick:function(){go("/house/"+p.houseSlug);},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}},house.name)
      ),
      e("div",{ref:ref},
        // Hero
        e(A,{vis:vis,delay:0.05},e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:6,textTransform:"uppercase"}},scheme.cat)),
        e(A,{vis:vis,delay:0.1},e("h1",{style:{fontFamily:Sf,fontSize:m?24:44,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 6px"}},scheme.name)),
        e(A,{vis:vis,delay:0.15},e("p",{style:{fontFamily:Hf,fontSize:m?16:22,color:C.sage,margin:"0 0 10px"}},'"'+scheme.personality+'"')),
        e(A,{vis:vis,delay:0.2},e("p",{style:{fontFamily:Bf,fontSize:m?14:16,color:C.muted,lineHeight:1.7,maxWidth:560,margin:"0 0 24px"}},scheme.one)),

        // Quick stats — readable inline explanations on every metric
        e(A,{vis:vis,delay:0.25},e("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:32}},
          [
            {l:"AUM",v:scheme.aum,c:"Total money in this fund. Larger = more stable but harder to outperform.",col:C.char},
            {l:"Expense (D)",v:scheme.exp||"—",c:"Annual fee deducted from your returns daily. Win or lose, they take this.",col:C.char},
            {l:"Inception",v:scheme.inception,c:"Fund launch date. Longer track record = more data to judge the manager."}
          ].concat(
            scheme.sharpe?[{l:"Sharpe Ratio",v:scheme.sharpe,c:parseFloat(scheme.sharpe)>1.5?"Excellent — for every unit of risk, "+scheme.sharpe+" units of return. This is rare.":parseFloat(scheme.sharpe)>1?"Good trade-off. You are compensated for the volatility.":"Below average. Returns don't fully justify the roller coaster.",col:parseFloat(scheme.sharpe)>1.5?C.green:parseFloat(scheme.sharpe)>1?C.mustard:C.red}]:[],
            scheme.alpha&&scheme.alpha!=="—"?[{l:"Alpha",v:scheme.alpha,c:"Extra return above what market risk alone would generate. Positive = manager adds real skill.",col:parseFloat(scheme.alpha)>5?C.green:C.char}]:[{l:"Alpha",v:"—",c:"Not measured for this fund type or insufficient track record."}],
            scheme.beta?[{l:"Beta",v:scheme.beta,c:parseFloat(scheme.beta)<0.7?"Low sensitivity — when Nifty drops 10%, this drops only ~"+Math.round(parseFloat(scheme.beta)*10)+"%. Cash cushion works.":"Moves "+Math.round(parseFloat(scheme.beta)*100)+"% as much as Nifty. Standard market exposure.",col:C.char}]:[],
            scheme.factReturns?[{l:"Fact Sheet",v:"Official data below",c:"Scroll down for returns published by the fund house. Compare with our live calculations.",col:C.sage,isFs:true}]:[]
          ).map(function(s,i){return e("div",{key:i,style:{background:s.isFs?C.sage+"08":C.white,border:"1px solid "+(s.col&&s.col!==C.char?s.col+"35":C.border),borderRadius:10,padding:m?"10px 14px":"12px 18px",flex:m?"1 1 calc(50% - 5px)":"0 0 auto",minWidth:m?140:155,maxWidth:m?"100%":270}},
            e("div",{style:{fontFamily:Mf,fontSize:10,letterSpacing:1.5,color:C.light,textTransform:"uppercase",marginBottom:3,fontWeight:700}},s.l),
            e("div",{style:{fontFamily:Mf,fontSize:m?15:17,fontWeight:700,color:s.col||C.char,marginBottom:5}},s.v),
            e("div",{style:{fontFamily:Bf,fontSize:m?11:12,color:C.sage,lineHeight:1.5,fontStyle:"italic"}},s.c)
          );})
        )),

        // NAV + Returns grid
        e(A,{vis:vis,delay:0.3},e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:14,marginBottom:32}},
          // Left: NAV + sparkline
          e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:12,padding:m?20:28}},
            e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:6}},"Latest NAV"+(latest?" · "+latest.date:"")),
            e("div",{style:{fontFamily:Mf,fontSize:m?28:40,fontWeight:700,color:C.char,letterSpacing:-1,marginBottom:14}},fd.loading?"...":latest?"₹"+fN(latest.nav):"—"),
            nav90.length>0?e(Spark,{data:nav90,w:m?280:380,h:60}):null,
            vol1y!==null?e("div",{style:{marginTop:12,padding:"10px 0",borderTop:"1px solid "+C.border}},
              e("div",{style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:4}},"Annualized volatility (1Y)"),
              e("div",{style:{fontFamily:Mf,fontSize:16,fontWeight:700,color:vol1y>20?C.red:vol1y>12?C.mustard:C.green}},vol1y.toFixed(1)+"%"),
              e("div",{style:{fontFamily:Hf,fontSize:m?12:14,color:C.sage,marginTop:2}},vol1y>20?"Wild ride. Seatbelts required.":vol1y>12?"Moderate swings. Normal for equity.":"Unusually calm. The cash helps.")
            ):null,
            maxDD!==null&&maxDD>5?e("div",{style:{marginTop:8}},
              e("div",{style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:4}},"Max drawdown (5Y)"),
              e("div",{style:{fontFamily:Mf,fontSize:16,fontWeight:700,color:C.red}},"-"+maxDD.toFixed(1)+"%"),
              e("div",{style:{fontFamily:Hf,fontSize:m?12:14,color:C.sage,marginTop:2}},maxDD>30?"That's a stomach test. Could you hold through this?":maxDD>15?"Painful but recoverable.":"Relatively gentle decline.")
            ):null
          ),
          // Right: Returns table
          e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:12,overflow:"hidden"}},
            e("div",{style:{padding:m?"12px 14px":"14px 20px",borderBottom:"1px solid "+C.border,background:C.cream}},
              e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase"}},"Report card — calculated from live NAV data")
            ),
            e(ReturnRow,{label:"1 Day",v:liveReturns.d1,note:"Yesterday",m:m}),
            e(ReturnRow,{label:"1 Week",v:liveReturns.w1,m:m}),
            e(ReturnRow,{label:"1 Month",v:liveReturns.m1,m:m}),
            e(ReturnRow,{label:"3 Months",v:liveReturns.m3,m:m}),
            e(ReturnRow,{label:"6 Months",v:liveReturns.m6,m:m}),
            e(ReturnRow,{label:"1 Year",v:liveReturns.y1,note:liveReturns.y1!==null?(liveReturns.y1>15?"Strong year":"Meh year"):null,m:m,highlight:true}),
            e(ReturnRow,{label:"3Y CAGR",v:liveReturns.y3,note:liveReturns.y3!==null?(liveReturns.y3>18?"Beating most FMs":"Decent"):null,m:m}),
            e(ReturnRow,{label:"5Y CAGR",v:liveReturns.y5,note:liveReturns.y5!==null?(liveReturns.y5>20?"Elite":"Solid"):null,m:m,highlight:true,last:true})
          )
        )),

        // Factsheet returns comparison
        scheme.factReturns?e(A,{vis:vis,delay:0.22},
          e("div",{style:{background:C.sage+"08",border:"1px solid "+C.sage+"20",borderRadius:12,padding:m?16:24,marginBottom:32}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:10,textTransform:"uppercase"}},"Factsheet returns (as published)"),
            e("div",{style:{display:"flex",gap:m?10:20,flexWrap:"wrap"}},
              Object.keys(scheme.factReturns).map(function(k){
                var labels={y1:"1 Year",y3:"3 Year",y5:"5 Year",si:"Since Inception"};
                return e("div",{key:k,style:{minWidth:m?80:100}},
                  e("div",{style:{fontFamily:Mf,fontSize:8,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:2}},labels[k]||k),
                  e("div",{style:{fontFamily:Mf,fontSize:m?14:18,fontWeight:700,color:C.char}},scheme.factReturns[k])
                );
              })
            ),
            e("p",{style:{fontFamily:Hf,fontSize:m?12:14,color:C.sage,marginTop:10,margin:0}},"(Our live calculations above may differ slightly — different dates, different math.)")
          )
        ):null,

        // Risk metrics explained
        (scheme.sharpe||scheme.beta||scheme.stdDev)?e(A,{vis:vis,delay:0.25},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.char,marginBottom:14}},"Risk metrics — in plain English"),
          e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:10,marginBottom:32}},
            scheme.sharpe?e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:20}},
              e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light,letterSpacing:1}},"SHARPE RATIO"),e("span",{style:{fontFamily:Mf,fontSize:18,fontWeight:700,color:parseFloat(scheme.sharpe)>1.5?C.green:parseFloat(scheme.sharpe)>1?C.mustard:C.red}},scheme.sharpe)),
              e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},parseFloat(scheme.sharpe)>1.5?"Excellent risk-reward. Every unit of risk is generating "+scheme.sharpe+" units of return. This is rare.":parseFloat(scheme.sharpe)>1?"Decent trade-off between risk and reward. You're being compensated for the volatility.":"Below average. The returns don't fully justify the roller coaster.")
            ):null,
            scheme.beta?e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:20}},
              e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light,letterSpacing:1}},"BETA"),e("span",{style:{fontFamily:Mf,fontSize:18,fontWeight:700,color:C.char}},scheme.beta)),
              e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},parseFloat(scheme.beta)<0.7?"Low market sensitivity. When Nifty drops 10%, this drops ~"+Math.round(parseFloat(scheme.beta)*10)+"%. The cash cushion works.":"Moves roughly with the market. When Nifty moves, this moves "+Math.round(parseFloat(scheme.beta)*100)+"% as much. No free lunch.")
            ):null,
            scheme.alpha?e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:20}},
              e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light,letterSpacing:1}},"ALPHA"),e("span",{style:{fontFamily:Mf,fontSize:18,fontWeight:700,color:parseFloat(scheme.alpha)>5?C.green:C.char}},scheme.alpha)),
              e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},"Fund manager added "+scheme.alpha+"% above what the risk alone would've generated. "+(parseFloat(scheme.alpha)>5?"That's genuinely impressive and suggests real skill.":"Positive alpha is good — it means the manager isn't just riding the market."))
            ):null,
            scheme.stdDev?e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:20}},
              e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light,letterSpacing:1}},"STD DEVIATION"),e("span",{style:{fontFamily:Mf,fontSize:18,fontWeight:700,color:C.char}},scheme.stdDev)),
              e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},"Returns swing "+scheme.stdDev+" up or down in a typical year. "+(parseFloat(scheme.stdDev)>15?"That's a wild ride — only for those who don't check their portfolio daily.":"Relatively controlled. The diversification is doing its job."))
            ):null
          )
        ):null,

        // Holdings
        holdings.length>0?e(A,{vis:vis,delay:0.28},
          e("h3",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.char,marginBottom:4}},"Where your money actually sits"),
          e("p",{style:{fontFamily:Hf,fontSize:m?14:16,color:C.sage,marginBottom:8}},"(tap any holding — we'll explain what the company does and why it matters)"),
          e("p",{style:{fontFamily:Mf,fontSize:9,color:C.light,marginBottom:12,letterSpacing:1}},"HOLDINGS FROM LATEST PUBLISHED FACTSHEET · MAY NOT REFLECT CURRENT PORTFOLIO"),
          e("div",null,(showAll?holdings:holdings.slice(0,6)).map(function(h,i){return e(HoldingRow,{key:i,h:h,i:i,maxPct:maxPct});})),
          holdings.length>6&&!showAll?e("div",{style:{textAlign:"center",marginTop:12}},e("span",{onClick:function(){setSA(true);},style:{fontFamily:Bf,fontSize:12,fontWeight:600,color:C.sage,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:4}},"Show all "+holdings.length+" holdings →")):null
        ):null,

        // Sector breakdown
        sectors.length>0?e(A,{vis:vis,delay:0.3},
          e("h3",{style:{fontFamily:Sf,fontSize:m?18:24,fontWeight:400,color:C.char,marginBottom:14,marginTop:28}},"Sector allocation"),
          e("div",{style:{display:"flex",borderRadius:6,overflow:"hidden",height:m?28:32,marginBottom:10}},
            sectors.map(function(s,i){return s.p>3?e("div",{key:i,style:{width:s.p+"%",background:sectorColors[i%sectorColors.length],display:"flex",alignItems:"center",justifyContent:"center"}},e("span",{style:{fontFamily:Mf,fontSize:8,fontWeight:600,color:C.white}},Math.round(s.p)+"%")):null;})
          ),
          e("div",{style:{display:"flex",gap:12,flexWrap:"wrap",marginBottom:28}},
            sectors.map(function(s,i){return e("div",{key:i,style:{display:"flex",alignItems:"center",gap:5}},e("div",{style:{width:8,height:8,borderRadius:2,background:sectorColors[i%sectorColors.length]}}),e("span",{style:{fontFamily:Bf,fontSize:11,color:C.muted}},s.n+" ("+s.p+"%)"));})
          )
        ):null,

        // Boredfolio's take
        scheme.commentary?e(A,{vis:vis,delay:0.3},
          e("div",{style:{background:C.char,borderRadius:12,padding:m?20:32,marginBottom:28}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,letterSpacing:3,color:C.sage,marginBottom:10,textTransform:"uppercase"}},"✦ Boredfolio's take"),
            e("p",{style:{fontFamily:Bf,fontSize:m?13:15,color:"#ccc",lineHeight:1.8,margin:0}},scheme.commentary)
          )
        ):null,

        // Concentration risk
        scheme.concentration?e(A,{vis:vis,delay:0.32},
          e("div",{style:{background:C.mustard+"10",border:"1px solid "+C.mustard+"25",borderRadius:12,padding:m?16:24,marginBottom:28}},
            e("div",{style:{fontFamily:Bf,fontSize:m?13:14,fontWeight:700,color:C.char,marginBottom:4}},"⚡ Concentration risk"),
            e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},"Top 10 holdings = "+scheme.concentration.top10+". Top 30 = "+scheme.concentration.top30+". This isn't diversification — it's conviction. When these bets work, you look like a genius for investing here. When they don't, you'll question every life decision.")
          )
        ):null,

        // Expense ratio comparison
        scheme.exp?e(A,{vis:vis,delay:0.34},
          e("h3",{style:{fontFamily:Sf,fontSize:m?18:24,fontWeight:400,color:C.char,marginBottom:12,marginTop:4}},"Your invisible subscription"),
          e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr 1fr",gap:10,marginBottom:28}},
            e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:18,textAlign:"center"}},
              e("div",{style:{fontFamily:Bf,fontSize:12,color:C.muted,marginBottom:4}},"Netflix"),
              e("div",{style:{fontFamily:Mf,fontSize:m?18:22,fontWeight:700,color:C.char}},"₹199/mo"),
              e("div",{style:{fontFamily:Mf,fontSize:11,color:C.light}},"= ₹2,388/yr")
            ),
            e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?14:18,textAlign:"center"}},
              e("div",{style:{fontFamily:Bf,fontSize:12,color:C.muted,marginBottom:4}},"Spotify"),
              e("div",{style:{fontFamily:Mf,fontSize:m?18:22,fontWeight:700,color:C.char}},"₹119/mo"),
              e("div",{style:{fontFamily:Mf,fontSize:11,color:C.light}},"= ₹1,428/yr")
            ),
            e("div",{style:{background:C.sage+"10",border:"1px solid "+C.sage+"30",borderRadius:10,padding:m?14:18,textAlign:"center"}},
              e("div",{style:{fontFamily:Bf,fontSize:12,color:C.sage,fontWeight:600,marginBottom:4}},"This fund (on ₹5L)"),
              e("div",{style:{fontFamily:Mf,fontSize:m?18:22,fontWeight:700,color:C.sage}},"₹"+fI(Math.round(500000*parseFloat(scheme.exp)/100))+"/yr"),
              e("div",{style:{fontFamily:Mf,fontSize:11,color:C.sage}},scheme.exp+" TER")
            )
          ),
          e("p",{style:{fontFamily:Hf,fontSize:m?13:15,color:C.sage,marginBottom:28}},"Netflix sends you a bill. Your fund just quietly takes it from your returns. Every. Single. Day.")
        ):null,

        // Expense & exit load editorial
        scheme.expenseNote?e(A,{vis:vis,delay:0.35},
          e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?16:22,marginBottom:12}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:6}},"The fee math"),
            e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},scheme.expenseNote)
          )
        ):null,
        scheme.exitLoadNote?e(A,{vis:vis,delay:0.36},
          e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?16:22,marginBottom:28}},
            e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:6}},"Exit load decoded"),
            e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:0}},scheme.exitLoadNote)
          )
        ):null,

        // CTAs
        e(A,{vis:vis,delay:0.38},
          e("div",{style:{display:"flex",gap:12,flexWrap:"wrap",marginBottom:32}},
            e("button",{onClick:function(){go("/house/"+p.houseSlug);},style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage,background:"transparent",border:"1.5px solid "+C.sage,padding:"12px 22px",borderRadius:6,cursor:"pointer"}},"← "+house.name),
            e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 22px",borderRadius:6,cursor:"pointer"}},"Explore more funds")
          )
        )
      )
    )
  );
}

// ══════════════════════════════════════════
// UTILITY PAGES
// ══════════════════════════════════════════
function Shell(p) {
  var go=useGo(),m=useW()<768;
  return e("div",{style:{paddingTop:m?90:110,minHeight:"80vh",paddingBottom:40}},
    e(Wrap,null,
      e("span",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,display:"inline-block",marginBottom:20,textDecoration:"underline",textUnderlineOffset:4}},"← Home"),
      e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:C.sage,marginBottom:8}},p.label),
      e("h1",{style:{fontFamily:Sf,fontSize:m?26:44,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 12px",maxWidth:680}},p.title),
      p.sub?e("p",{style:{fontFamily:Bf,fontSize:15,color:C.muted,lineHeight:1.7,maxWidth:520,margin:"0 0 36px"}},p.sub):null,
      p.children
    )
  );
}

function ExplorePage() {
  useTitle("Explore Every Mutual Fund in India");
  var _q=useState(""),q=_q[0],sq=_q[1]; var _r=useState(null),res=_r[0],sr=_r[1]; var _l=useState(false),ld=_l[0],sld=_l[1];
  var _f=useState(""),filter=_f[0],setFilter=_f[1];
  var _sa=useState(false),showAll=_sa[0],setShowAll=_sa[1];
  var go=useGo(),m=useW()<768;
  var allFunds=useAllFunds();
  var search = useCallback(function(){ if(!q.trim())return; sld(true); fetch("https://api.mfapi.in/mf/search?q="+encodeURIComponent(q)).then(function(r){return r.json();}).then(function(j){sr(j.slice(0,20));}).catch(function(){sr([]);}).finally(function(){sld(false);}); },[q]);

  var activeFunds = allFunds.funds ? allFunds.funds.filter(function(amc) { return amc.editorialSlug || amc.schemes.length >= 10; }) : [];
  var displayFunds = showAll ? allFunds.funds || [] : activeFunds;
  var filteredFunds = displayFunds.filter(function(amc) {
    if (!filter.trim()) return true;
    return amc.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
  });
  var totalAMCs = activeFunds.length;
  var totalSchemes = allFunds.funds ? allFunds.funds.reduce(function(sum, amc) { return sum + amc.schemes.length; }, 0) : 0;

  return e(Shell,{label:"Explore",title:"Every mutual fund in India.",
    sub:allFunds.loading ? "Loading the entire universe..." : totalAMCs+" fund houses. "+fI(totalSchemes)+" schemes. 2 with full editorial profiles. The rest get live NAV data."},
    // Search bar
    e("div",{style:{display:"flex",gap:10,marginBottom:24}},
      e("input",{value:q,onChange:function(ev){sq(ev.target.value);},onKeyDown:function(ev){if(ev.key==="Enter")search();},placeholder:"Search any scheme — 'parag parikh', 'hdfc flexi cap', 'nifty 50 index'",style:{flex:1,fontFamily:Bf,fontSize:m?14:15,padding:"12px 18px",border:"1.5px solid "+C.border,borderRadius:8,background:C.white,outline:"none",color:C.char}}),
      e("button",{onClick:search,style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 20px",borderRadius:8,cursor:"pointer"}},"Search")
    ),
    // Search results
    ld?e("p",{style:{fontFamily:Mf,fontSize:11,color:C.light}},"Searching..."):null,
    res&&res.length===0?e("p",{style:{fontFamily:Bf,fontSize:13,color:C.muted}},"Nothing found."):null,
    res&&res.length>0?e("div",{style:{borderRadius:10,overflow:"hidden",border:"1px solid "+C.border,marginBottom:32}},res.map(function(r,i){
      return e(HoverRow,{key:i,onClick:function(){go("/fund/"+r.schemeCode);},style:{padding:"12px 18px",borderBottom:i<res.length-1?"1px solid "+C.border:"none"}},
        e("div",{style:{fontFamily:Bf,fontSize:m?12:14,fontWeight:600,color:C.char,marginBottom:1}},r.schemeName),
        e("div",{style:{fontFamily:Mf,fontSize:10,color:C.light}},r.schemeCode)
      );
    })):null,
    // AMC grid (when no search results active)
    !res?e("div",{style:{marginTop:20}},
      e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:m?"flex-start":"center",flexDirection:m?"column":"row",gap:12,marginBottom:16}},
        e("div",{style:{display:"flex",alignItems:"center",gap:12}},
          e("p",{style:{fontFamily:Bf,fontSize:13,color:C.light,margin:0}},
            allFunds.loading ? "Loading fund houses..." : showAll ? "All "+(allFunds.funds?allFunds.funds.length:0)+" fund houses" : totalAMCs+" active fund houses"
          ),
          !allFunds.loading && allFunds.funds && allFunds.funds.length > totalAMCs ? e("button",{
            onClick:function(){setShowAll(!showAll);},
            style:{fontFamily:Mf,fontSize:10,color:C.sage,background:"none",border:"1px solid "+C.sage+"40",padding:"4px 10px",borderRadius:4,cursor:"pointer",letterSpacing:0.5}
          },showAll?"Hide historical":"Show all "+allFunds.funds.length) : null
        ),
        !allFunds.loading && totalAMCs > 10 ? e("input",{
          value:filter,
          onChange:function(ev){setFilter(ev.target.value);},
          placeholder:"Filter fund houses...",
          style:{fontFamily:Bf,fontSize:13,padding:"8px 14px",border:"1px solid "+C.border,borderRadius:6,background:C.white,outline:"none",color:C.char,width:m?"100%":220}
        }) : null
      ),
      // Loading
      allFunds.loading ? e("div",{style:{textAlign:"center",padding:"40px 0"}},
        e("div",{style:{fontFamily:Mf,fontSize:12,color:C.light,animation:"pulse 1.5s infinite"}},"Fetching all schemes from mfapi.in..."),
        e("div",{style:{fontFamily:Hf,fontSize:14,color:C.sage,marginTop:8}},"This takes a few seconds. We're downloading every scheme in India.")
      ) : null,
      // Error
      allFunds.error ? e("div",{style:{background:C.rBg,border:"1px solid "+C.red+"30",borderRadius:10,padding:16,marginBottom:16}},
        e("p",{style:{fontFamily:Bf,fontSize:13,color:C.red,margin:0}},"Couldn't load fund data. The API might be down. Try refreshing.")
      ) : null,
      // AMC grid
      !allFunds.loading && filteredFunds.length > 0 ? e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr 1fr",gap:10}},
        filteredFunds.map(function(amc) {
          var isEditorial = amc.editorialSlug !== null;
          var route = isEditorial ? "/house/" + amc.editorialSlug : "/house/" + amc.slug;
          return e(HoverCard,{key:amc.slug,onClick:function(){go(route);},style:{background:C.white,borderRadius:10,padding:m?14:18,border:isEditorial?"1.5px solid "+C.sage+"50":"1px solid "+C.border}},
            e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}},
              e("div",{style:{fontFamily:Bf,fontSize:m?13:14,fontWeight:700,color:C.char,lineHeight:1.3}},amc.name),
              isEditorial ? e("div",{style:{fontFamily:Mf,fontSize:8,fontWeight:700,letterSpacing:1,color:C.sage,background:C.sage+"12",padding:"3px 7px",borderRadius:4,flexShrink:0,textTransform:"uppercase"}},"Profiled") : null
            ),
            e("div",{style:{fontFamily:Mf,fontSize:11,color:C.light,marginTop:6}},amc.schemes.length+" scheme"+(amc.schemes.length!==1?"s":""))
          );
        })
      ) : null,
      // Empty filter
      !allFunds.loading && filter && filteredFunds.length === 0 ? e("p",{style:{fontFamily:Bf,fontSize:13,color:C.muted,textAlign:"center",padding:"20px 0"}},"No fund house matches '"+filter+"'") : null
    ):null
  );
}

function FundPage(p) {
  var fd=useFund(p.id),go=useGo(),m=useW()<768;
  if(fd.loading) return e(Shell,{label:"Fund",title:"Loading..."});
  if(!fd.data||!fd.data.meta||!fd.data.meta.scheme_name) return e(Shell,{label:"Fund",title:"Fund not found"});
  var meta=fd.data.meta, data=fd.data.data||[], nav90=data.slice(0,90), latest=data[0]||null;
  var allS=PPFAS.schemes.concat(QUANT.schemes), known=allS.find(function(s){return s.code===p.id;});
  if(known){var hs=PPFAS.schemes.indexOf(known)>=0?"ppfas":"quant"; return e(Shell,{label:meta.scheme_category||"Fund",title:meta.scheme_name},e("p",{style:{fontFamily:Bf,fontSize:14,color:C.muted,marginBottom:14}},"We have a detailed editorial analysis of this fund."),e("button",{onClick:function(){go("/scheme/"+hs+"/"+p.id);},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.sage,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}},"View full breakdown →"));}
  return e(DynamicSchemePage,{code:p.id});
}

function CalcPage() {
  useTitle("SIP Calculator — See What Compounding Actually Does");
  var _m=useState(10000),mo=_m[0],smo=_m[1]; var _r=useState(12),rate=_r[0],sr=_r[1]; var _y=useState(10),yrs=_y[0],sy=_y[1]; var m=useW()<768;
  var inv=mo*12*yrs,corp=sipFV(mo,rate,yrs),gain=corp-inv;
  return e(Shell,{label:"Calculator",title:"The money machine"},
    e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?20:36,maxWidth:560}},
      [{l:"Monthly SIP",v:mo,s:smo,min:500,max:200000,step:500,f:"₹"+fI(mo)},{l:"Return %",v:rate,s:sr,min:4,max:25,step:0.5,f:rate+"%"},{l:"Years",v:yrs,s:sy,min:1,max:30,step:1,f:yrs+" yrs"}].map(function(x,i){
        return e("div",{key:i,style:{marginBottom:22}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8}},e("span",{style:{fontFamily:Bf,fontSize:12,color:C.muted}},x.l),e("span",{style:{fontFamily:Mf,fontSize:m?18:22,fontWeight:700,color:C.char}},x.f)),
          e("input",{type:"range",min:x.min,max:x.max,step:x.step,value:x.v,onChange:function(ev){x.s(Number(ev.target.value));},style:{width:"100%",height:6,WebkitAppearance:"none",appearance:"none",background:"linear-gradient(to right, "+C.sage+" "+((x.v-x.min)/(x.max-x.min)*100)+"%, "+C.border+" "+((x.v-x.min)/(x.max-x.min)*100)+"%)",borderRadius:3,outline:"none",cursor:"pointer"}})
        );
      }),
      e("div",{style:{textAlign:"center",padding:"28px 0",borderTop:"1px solid "+C.border}},
        e("div",{style:{fontFamily:Mf,fontSize:m?30:48,fontWeight:700,color:C.mustard,letterSpacing:-2}},"₹"+fI(corp)),
        e("p",{style:{fontFamily:Bf,fontSize:13,color:C.muted,marginTop:8}},"Invested ₹"+fI(inv)+" · Gained ₹"+fI(gain)+" · "+(corp/inv).toFixed(1)+"x")
      )
    )
  );
}

function DirectVsRegularPage() {
  useTitle("Direct vs Regular Plan — The ₹ You Lose to Your Distributor");
  var _m=useState(10000),mo=_m[0],smo=_m[1];
  var _y=useState(20),yrs=_y[0],sy=_y[1];
  var _ret=useState(12),ret=_ret[0],sret=_ret[1];
  var _gap=useState(0.7),gap=_gap[0],sgap=_gap[1];
  var go=useGo(),m=useW()<768;

  // Direct = full return minus direct TER (~0.5%)
  // Regular = full return minus regular TER (~1.2%)
  // We let user set the gap (regular TER - direct TER)
  var directReturn = ret;
  var regularReturn = ret - gap;
  var directCorpus = sipFV(mo, directReturn, yrs);
  var regularCorpus = sipFV(mo, regularReturn, yrs);
  var diff = directCorpus - regularCorpus;
  var invested = mo * 12 * yrs;
  var diffPct = regularCorpus > 0 ? ((diff / regularCorpus) * 100).toFixed(0) : 0;

  var slider = function(label, val, setter, min, max, step, fmt) {
    return e("div",{style:{marginBottom:20}},
      e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8}},
        e("span",{style:{fontFamily:Bf,fontSize:12,color:C.muted}},label),
        e("span",{style:{fontFamily:Mf,fontSize:m?16:20,fontWeight:700,color:C.char}},fmt)
      ),
      e("input",{type:"range",min:min,max:max,step:step,value:val,onChange:function(ev){setter(Number(ev.target.value));},
        style:{width:"100%",height:6,WebkitAppearance:"none",appearance:"none",background:"linear-gradient(to right, "+C.sage+" "+((val-min)/(max-min)*100)+"%, "+C.border+" "+((val-min)/(max-min)*100)+"%)",borderRadius:3,outline:"none",cursor:"pointer"}})
    );
  };

  return e(Shell,{label:"Calculator",title:"The ₹14 lakh question.",
    sub:"Same fund. Same stocks. Same manager. Two different expense ratios. One makes your distributor rich."},

    // Sliders
    e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:m?20:32,maxWidth:600,marginBottom:28}},
      slider("Monthly SIP", mo, smo, 500, 200000, 500, "₹"+fI(mo)),
      slider("Investment period", yrs, sy, 1, 30, 1, yrs+" years"),
      slider("Expected return (pre-TER)", ret, sret, 8, 18, 0.5, ret+"%"),
      slider("TER gap (Regular − Direct)", gap, sgap, 0.3, 1.5, 0.1, gap.toFixed(1)+"%"),
      e("p",{style:{fontFamily:Hf,fontSize:m?13:15,color:C.sage,margin:"8px 0 0"}},"(average equity fund gap: 0.5%–1.0%. some go up to 1.5%.)")
    ),

    // Results: two columns
    e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:16,marginBottom:28}},
      // Direct
      e("div",{style:{background:C.gBg,border:"1px solid "+C.green+"30",borderRadius:10,padding:m?20:28,textAlign:"center"}},
        e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:C.green,textTransform:"uppercase",marginBottom:12}},"Direct Plan"),
        e("div",{style:{fontFamily:Mf,fontSize:m?28:36,fontWeight:700,color:C.char,letterSpacing:-1}},"₹"+fI(directCorpus)),
        e("div",{style:{fontFamily:Bf,fontSize:12,color:C.muted,marginTop:6}},"Effective return: "+directReturn.toFixed(1)+"%"),
        e("div",{style:{fontFamily:Bf,fontSize:11,color:C.light,marginTop:2}},"You invested ₹"+fI(invested))
      ),
      // Regular
      e("div",{style:{background:C.rBg,border:"1px solid "+C.red+"30",borderRadius:10,padding:m?20:28,textAlign:"center"}},
        e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:C.red,textTransform:"uppercase",marginBottom:12}},"Regular Plan"),
        e("div",{style:{fontFamily:Mf,fontSize:m?28:36,fontWeight:700,color:C.char,letterSpacing:-1}},"₹"+fI(regularCorpus)),
        e("div",{style:{fontFamily:Bf,fontSize:12,color:C.muted,marginTop:6}},"Effective return: "+regularReturn.toFixed(1)+"%"),
        e("div",{style:{fontFamily:Bf,fontSize:11,color:C.light,marginTop:2}},"Same stocks. Higher fee.")
      )
    ),

    // The damage
    e("div",{style:{background:C.char,borderRadius:12,padding:m?24:36,textAlign:"center",marginBottom:28}},
      e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:3,color:C.red,textTransform:"uppercase",marginBottom:12}},"What your distributor takes"),
      e("div",{style:{fontFamily:Mf,fontSize:m?36:56,fontWeight:700,color:C.cream,letterSpacing:-2,lineHeight:1}},"₹"+fI(diff)),
      e("div",{style:{fontFamily:Hf,fontSize:m?18:24,color:C.red,marginTop:12}},diffPct+"% of your Regular plan corpus. Gone."),
      e("div",{style:{fontFamily:Bf,fontSize:13,color:C.light,marginTop:12,lineHeight:1.6,maxWidth:420,margin:"12px auto 0"}},
        "That's "+gap.toFixed(1)+"% every year, compounded over "+yrs+" years. Your distributor earned this for filling a form you could've filled yourself."
      )
    ),

    // The table
    e("div",{style:{background:C.white,border:"1px solid "+C.border,borderRadius:10,overflow:"hidden",marginBottom:28}},
      e("div",{style:{padding:"14px 20px",borderBottom:"1px solid "+C.border,background:C.cream}},
        e("div",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:C.light}},"Year-by-year damage")
      ),
      [5,10,15,20,25,30].filter(function(y){return y<=yrs;}).map(function(y,i,arr) {
        var dc = sipFV(mo, directReturn, y);
        var rc = sipFV(mo, regularReturn, y);
        var d = dc - rc;
        return e("div",{key:y,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderBottom:i<arr.length-1?"1px solid "+C.border:"none"}},
          e("span",{style:{fontFamily:Bf,fontSize:13,color:C.char,fontWeight:600}},y+" years"),
          e("span",{style:{fontFamily:Mf,fontSize:13,fontWeight:700,color:C.red}},"−₹"+fI(d))
        );
      })
    ),

    // Explainer
    e("div",{style:{background:C.cream,border:"1px solid "+C.border,borderRadius:10,padding:m?20:28,marginBottom:28}},
      e("div",{style:{fontFamily:Sf,fontSize:m?18:22,fontWeight:400,color:C.char,marginBottom:12}},"Wait — what's the actual difference?"),
      e("p",{style:{fontFamily:Bf,fontSize:14,color:C.muted,lineHeight:1.7,marginBottom:12}},
        "Every mutual fund has two versions: Direct and Regular. Same stocks. Same manager. Same portfolio. The only difference is the expense ratio."
      ),
      e("p",{style:{fontFamily:Bf,fontSize:14,color:C.muted,lineHeight:1.7,marginBottom:12}},
        "Regular plans pay a commission to your distributor (bank, app, advisor) — typically 0.5% to 1.5% per year. That comes out of your returns. Direct plans skip the middleman, so you keep more."
      ),
      e("p",{style:{fontFamily:Bf,fontSize:14,color:C.char,fontWeight:600,lineHeight:1.7}},
        "Switching is free. You can do it on AMC websites, MFCentral, or apps like Kuvera and Zerodha Coin."
      )
    ),

    // CTAs
    e("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
      e("button",{onClick:function(){go("/learn/direct-vs-regular");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}},"Read the full breakdown →"),
      e("button",{onClick:function(){go("/calculator");},style:{fontFamily:Bf,fontSize:14,fontWeight:500,color:C.muted,background:"none",border:"1px solid "+C.border,padding:"14px 28px",borderRadius:8,cursor:"pointer"}},"SIP Calculator")
    )
  );
}

function ManifestoPage() {
  useTitle("Manifesto — Why We Built This");
  var m=useW()<768;
  var blocks=[
    {t:"The confession",b:"India has ₹68 lakh crore in mutual funds. Most owners can't name a single stock inside them. Not because they're careless — because the system was designed this way."},
    {t:"The business model",b:"Mutual fund distributors earn when you invest. Not when you profit. Read that again. Their incentive is to get your money in, not to make sure it grows. This isn't a conspiracy — it's the fee structure."},
    {t:"The language",b:"Every brochure uses words designed to impress, not inform. 'Risk-adjusted alpha generation' means 'did the manager beat a basic index fund.' Usually the answer is no. They'd rather you didn't know that."},
    {t:"The gap",b:"Smart, educated people are making financial decisions with less information than they use to pick a restaurant. There are 47 reviews for your local biryani shop. There are zero honest reviews for the fund managing your retirement."},
    {t:"What we do",b:"Boredfolio translates what mutual funds actually do — in words that respect your intelligence without requiring a CFA. We show you the holdings, the fees, the risks, and the parts the factsheet conveniently leaves boring."},
    {t:"What we don't do",b:"We don't sell funds. We don't earn commissions. We don't run 'sponsored rankings' where the highest bidder gets five stars. If we start doing any of this, we deserve to be shut down."},
    {t:"The bet",b:"We survive by being useful enough that you come back. That's it. No growth hacks, no dark patterns, no 'complete your KYC to continue.' Just information worth returning for."},
  ];
  var closing = "Boredfolio. Boring you into wealth.";
  return e(Shell,{label:"Manifesto",title:"Why we built this."},
    e("div",null,
      blocks.map(function(b,i){return e("div",{key:i,style:{marginBottom:m?28:36,maxWidth:580}},
        e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.sage,textTransform:"uppercase",marginBottom:6}},b.t),
        e("p",{style:{fontFamily:Bf,fontSize:m?14:15,color:C.body,lineHeight:1.85,margin:0}},b.b)
      );}),
      e("div",{style:{borderTop:"1px solid "+C.border,paddingTop:m?24:32,marginTop:m?8:16,maxWidth:580}},
        e("p",{style:{fontFamily:Sf,fontSize:m?20:24,fontStyle:"italic",color:C.sage,lineHeight:1.5,margin:0}},closing)
      )
    )
  );
}

// ══════════════════════════════════════════
// LEARN — full article system
// ══════════════════════════════════════════
var ARTICLES = [
  {slug:"fees",tag:"Investigation",time:"12 min read",
   title:"₹50,000 crore in fees. Every year. From your returns.",
   subtitle:"Every mutual fund charges a fee. Daily. Win or lose. We did the math on what this actually costs you over 20 years.",
   hero:"You wouldn't pay a chef who burns your food. But you pay your fund manager every single day — even when your portfolio is bleeding red. Here's how that works, and what it really costs.",
   sections:[
     {h:"The invisible bill",
      body:"Your mutual fund charges something called a Total Expense Ratio (TER). On paper, it looks small — 0.5% to 2.25%. But here's the trick: it's not deducted from your bank account. It's deducted from your NAV. Every single day. You never see a bill, never get an invoice, never approve the charge. The money just… quietly disappears from your returns before you see them.\n\nThink of it this way: if your fund earned 15% this year but charges 1.5% TER, you see 13.5%. The fund house has already taken its cut. Win or lose, they eat first."},
     {h:"The math nobody shows you",
      body:"Let's say you invest ₹10,000/month for 20 years at 12% annual returns.\n\nWith 0.5% TER (a cheap index fund): You end up with ₹99.9 lakhs.\nWith 1.5% TER (a typical active fund): You end up with ₹85.4 lakhs.\nWith 2.25% TER (an expensive regular plan): You end up with ₹74.8 lakhs.\n\nThat's a ₹25 lakh difference — and you invested the exact same amount every month. The fund earned the same returns. The only difference was how much was siphoned off before it reached you.\n\n₹25 lakhs. Gone. Not because the market crashed. Because of fees."},
     {h:"Why it compounds against you",
      body:"Fees don't just reduce your returns — they reduce the base on which your returns compound. Every rupee taken as a fee is a rupee that can never earn returns for you again. Over 20 years, a 1% difference in fees doesn't cost you 1% — it costs you roughly 18-22% of your final corpus. The longer you invest, the worse it gets. Fees are the only guaranteed negative return in your portfolio."},
     {h:"The ₹50,000 crore number",
      body:"India's mutual fund industry manages roughly ₹68 lakh crore. At an average TER of 0.75% (blending direct and regular plans across equity and debt), the industry collects approximately ₹50,000 crore in fees annually. That's ₹137 crore per day. ₹5.7 crore per hour.\n\nFor context, that's more than the GDP of several small countries. Collected whether the funds outperform their benchmarks or not. Most don't."},
     {h:"Direct vs Regular — the quiet scandal",
      body:"Every mutual fund in India comes in two versions: Direct and Regular. The Regular plan pays a commission to the distributor who sold it to you — typically 0.5% to 1% extra per year. This commission comes from YOUR returns, built into a higher TER.\n\nThe fund is identical. Same manager. Same stocks. Same office. You just pay more because someone introduced you to it. Over 25 years on a ₹15,000/month SIP, this difference alone can cost ₹12-18 lakhs. Your bank RM won't mention this because they earn that commission."},
     {h:"What you can actually do",
      body:"Switch to Direct plans. Every fund house offers them through their website — no distributor needed. If you invest through a platform, use one that offers Direct plans (and verify the TER matches the Direct plan TER on the fund house website).\n\nCompare TERs before investing. Two flexi cap funds with similar returns but different expense ratios are not equivalent. The cheaper one is literally giving you more of your own money back.\n\nAnd remember: low fees don't guarantee good returns. But high fees guarantee lower returns than you could have had."},
   ],
   closing:"Every fund house will tell you their fees are 'competitive.' We'd rather you see the numbers and decide for yourself.",
  },
  {slug:"returns",tag:"Data",time:"8 min read",
   title:"Your fund's 1-year return is correct. And misleading.",
   subtitle:"A fund can show +40% on its factsheet while most of its investors lost money. Here's how that sleight of hand works.",
   hero:"The most dangerous number in a mutual fund factsheet isn't a wrong number. It's a right number presented in the most flattering light possible. Let's talk about how returns are manufactured — legally, technically, correctly — and yet completely misleading.",
   sections:[
     {h:"Point-to-point is not your return",
      body:"When a fund says '1-year return: +32%', it means: if you invested exactly one year ago, on that specific date, and checked today, your return would be 32%. That's called point-to-point return.\n\nBut you didn't invest on one specific date. You invest via SIP — a little every month. Which means some of your money has been invested for 12 months, some for 11, some for 6, some for just 1 month. Your actual return (called XIRR) can be dramatically different from the headline number."},
     {h:"The SIP return gap",
      body:"Here's a real scenario: A fund shows +40% 1-year return on its factsheet. Impressive. But someone doing a ₹10,000 monthly SIP in the same fund over the same period might have an XIRR of just 18%. Still good — but less than half the headline.\n\nWhy? Because the +40% assumes all your money was invested on Day 1. With SIP, your later installments had less time to grow, and some were invested when the NAV was already high. The fund's return is 40%. YOUR return is 18%. Both numbers are correct. Only one is relevant to your life."},
     {h:"The cherry-picked starting point",
      body:"Fund houses legally must show 1-year, 3-year, 5-year, and since-inception returns. But marketing materials can highlight whichever period looks best. A fund that crashed in Year 1, recovered in Year 2, and boomed in Year 3 will proudly show its 1-year return while burying the 3-year number.\n\nWatch for this: if the marketing leads with 1-year return but the 3-year and 5-year returns are mediocre, the fund had one good year, not a good track record. One good year is luck. Five good years is a pattern. (Even that isn't a guarantee — but it's better evidence.)"},
     {h:"Survivorship bias — the ghost funds",
      body:"India has roughly 12,000 mutual fund schemes. But hundreds have been merged or shut down over the years. Guess which ones get merged? The ones that performed badly. When a terrible fund is merged into a better one, its bad track record disappears. Poof.\n\nThis means the 'average mutual fund return' you see quoted in articles is inflated — it only includes the survivors. The failures have been quietly removed from the record. It's like calculating the average batting score but only including players who scored a century."},
     {h:"How to read returns honestly",
      body:"Check XIRR, not point-to-point. If you invest via SIP, your real return is your XIRR (which accounts for timing of each installment). Most fund tracking apps show this.\n\nLook at rolling returns, not trailing. A 5-year trailing return tells you about one specific window. Rolling returns show you every possible 5-year window — giving you a much better picture of consistency.\n\nCompare against the benchmark. A fund that returned 18% sounds great until you learn the Nifty 50 did 20% in the same period. The fund manager got paid to underperform a free index.\n\nFinally, always check drawdowns alongside returns. A fund that returned 22% CAGR but dropped 45% in one year has a very different feel than one that returned 18% but never dropped below 15%. The first one tests your resolve. Most people fail that test."},
   ],
   closing:"Returns tell you what happened. They don't tell you what it felt like. The best fund for you is the one you can hold through a 30% crash without panic-selling.",
  },
  {slug:"direct-vs-regular",tag:"Money",time:"6 min read",
   title:"Direct vs Regular: The ₹14 lakh question nobody answers clearly.",
   subtitle:"Same fund. Same manager. Same stocks. One version silently pays your distributor from your returns. The other doesn't.",
   hero:"There's a version of every mutual fund in India that costs less and earns more. It's not a hack, not a secret, and not illegal. It's called the Direct plan. Here's why most Indians don't use it — and what it costs them.",
   sections:[
     {h:"Two versions, one fund",
      body:"Every mutual fund scheme in India comes in two flavours: Direct and Regular. The Direct plan is what you buy straight from the fund house. The Regular plan is what you buy through a distributor — your bank, your financial advisor, or an app that earns commission.\n\nThe fund portfolio is identical. Same stocks, same bonds, same manager, same strategy, same office, same coffee machine. The only difference is the TER. The Regular plan has a higher expense ratio because it includes the distributor's commission — typically 0.5% to 1% more per year."},
     {h:"The math over 25 years",
      body:"₹15,000/month SIP, 12% return assumption, 25 years.\n\nDirect plan (TER: 0.5%): Final value ≈ ₹1.58 Cr\nRegular plan (TER: 1.5%): Final value ≈ ₹1.24 Cr\n\nDifference: ₹34 lakhs. Not because the market treated you differently. Not because the fund manager made different decisions. Because someone took a slightly bigger cut from your returns every single day for 25 years.\n\nThat 1% difference didn't cost you 1%. Over 25 years, it cost you 22% of your wealth."},
     {h:"Why your bank pushes Regular",
      body:"Your relationship manager at the bank earns a trailing commission every year you stay invested in a Regular plan. This isn't illegal — it's the standard business model. But it creates a misaligned incentive: they earn more when you invest more, not when you earn more.\n\nThey will never suggest a Direct plan. They will never mention that the same fund exists at a lower cost. They might not even know the difference — because they were trained to sell, not to educate.\n\nThis isn't about blaming individuals. It's about understanding the system. When someone recommends a fund to you, ask: 'Do you earn a commission on this?' The answer changes how you should weigh their advice."},
     {h:"When Regular plans make sense",
      body:"We'd be dishonest if we said Direct is always better. If you genuinely need a financial advisor who reviews your portfolio, rebalances it, and stops you from panic-selling during crashes — that service has real value. A good advisor who charges through Regular plan commissions might be worth the cost if they prevent even one emotional mistake.\n\nBut be honest with yourself: is your distributor actually advising you? Or did they just put you in a fund and disappear? If you haven't heard from your advisor in the last 6 months, you're paying for a service you're not receiving."},
     {h:"How to switch",
      body:"You can switch from Regular to Direct in two ways. First: stop new SIPs in the Regular plan and start fresh SIPs in the Direct plan of the same fund (through the AMC website or a Direct platform). Second: redeem the Regular plan and reinvest in Direct — but this triggers capital gains tax, so do the math first.\n\nMost fund houses allow direct purchases through their website. You can also use platforms like MF Utilities, Kuvera, or others that offer Direct plans. Verify by checking that the TER matches what's listed on the fund house website under 'Direct Plan.'"},
   ],
   closing:"Nobody will voluntarily tell you about the cheaper version of something they're selling you. Now you know.",
  },
  {slug:"sip-day-one",tag:"Mechanics",time:"5 min read",
   title:"What happens to your SIP money on Day 1.",
   subtitle:"You set up a SIP for ₹5,000. The money leaves your account on the 5th. Then what? A blow-by-blow of the next 48 hours.",
   hero:"Most SIP investors know they invest monthly. Very few know what physically happens to their money between the time it leaves their bank account and the time it appears as 'units' in their portfolio. Here's the full chain.",
   sections:[
     {h:"T+0: The debit",
      body:"On your SIP date, your bank debits the amount via a mandate (NACH/ECS). This typically happens between 9 AM and 2 PM. The money goes to the fund house's collection account — not directly into stocks.\n\nImportant: the NAV you get is based on the date your money is RECEIVED by the fund house, not the date it leaves your bank. If there's a bank holiday or processing delay, you might get the next business day's NAV. This is why your SIP units sometimes show a slightly different date than your bank statement."},
     {h:"T+0: NAV allocation",
      body:"For equity funds, if the money reaches the fund house before 3 PM on a business day, you get that day's NAV. After 3 PM, you get the next business day's NAV. The NAV is calculated after market close (~3:30 PM) based on the closing prices of all stocks and bonds the fund holds, minus the TER for the day.\n\nThis means when you check your portfolio at 10 AM and see the NAV, that's yesterday's number. Today's NAV won't be known until tonight. Your money is in a brief limbo — committed but not yet priced."},
     {h:"T+1: Units credited",
      body:"By the next business day, your units are typically credited. The number of units = Your investment ÷ NAV on allotment date. If you invested ₹5,000 and the NAV was ₹50, you get 100 units.\n\nThese units are held electronically in a folio number linked to your PAN. You don't 'own' specific stocks — you own units of the fund, which in turn owns stocks. This is an important distinction: you can't vote at shareholder meetings of the companies your fund holds. The fund manager does that on your behalf."},
     {h:"What the fund manager does with it",
      body:"Your ₹5,000 gets pooled with money from thousands of other investors. The fund manager uses this pool to buy stocks/bonds according to the fund's mandate and their current strategy.\n\nHere's what most people miss: the fund manager doesn't buy stocks specifically with YOUR money. It's all one pool. When you invest ₹5,000, you're buying a tiny slice of an existing, already-diversified portfolio — plus whatever the manager buys with the net inflows that day.\n\nIf the fund received ₹200 crore in inflows that day and ₹180 crore in outflows, the manager has ₹20 crore of new money to deploy. Your ₹5,000 is a rounding error. But multiplied by 10 lakh SIP investors, those rounding errors become the fund's growth engine."},
     {h:"The small print that matters",
      body:"Cut-off times are strict: miss the 3 PM window for equity funds (1:30 PM for liquid/debt funds) and you get the next day's NAV. This can matter during volatile markets.\n\nSIP dates aren't sacred: if your SIP date falls on a holiday, it processes on the next business day. Some investors obsess over picking the 'best' SIP date. Research shows it barely matters over 10+ year horizons — the difference between the best and worst SIP date is typically less than 0.5% CAGR.\n\nYour money is protected by SEBI regulations. Fund house money and investor money are kept in separate accounts. If the fund house goes bankrupt, your investments are safe — held by a custodian (usually a bank like Deutsche or HDFC). This is genuinely one of the better-designed parts of India's financial system."},
   ],
   closing:"Your SIP isn't magic. It's plumbing. Good plumbing — but plumbing. Understanding the mechanics makes you a better investor because you stop attributing mystical properties to a monthly bank debit.",
  },
  {slug:"fund-manager-quit",tag:"Risk",time:"7 min read",
   title:"Your fund manager quit. Nobody told you.",
   subtitle:"You chose a fund because of the person running it. That person is gone. Your SIP continues like nothing happened.",
   hero:"You spent hours researching a fund. You read about the manager's philosophy, their track record, their investing style. You invested. Three months later, that person quietly left. Your SIP kept running. The factsheet updated a name. No email. No alert. No nothing.",
   sections:[
     {h:"It happens more than you think",
      body:"India's mutual fund industry sees significant fund manager churn. A manager who builds a track record at one fund house gets poached by another — often for double the salary. The fund you chose based on their decisions is now run by someone you've never heard of.\n\nSome recent examples: star managers have left Axis, HDFC, SBI, and Mirae Asset in the last few years, taking their investment philosophy (and their track record) with them. The fund stays. The name stays. The AUM stays. The brain leaves."},
     {h:"Why it matters more than people admit",
      body:"The fund industry will tell you 'processes matter more than people.' That a good fund house has systems, research teams, and investment committees that ensure continuity. This is partially true — for large fund houses with deep benches.\n\nBut be honest: did you invest in 'Axis Bluechip Fund' because of Axis's investment committee? Or because of the specific person whose stock picks returned 22% CAGR? When that person leaves, the committee remains. But the decision-making style, risk appetite, and conviction levels change. Sometimes subtly. Sometimes not.\n\nA new fund manager might have a completely different view on cash allocation, sector bets, or position sizing. The fund's name stays the same. The strategy might not."},
     {h:"The track record illusion",
      body:"Here's the part that should bother you: the fund's historical returns remain attributed to the fund, not the manager. When you look at a 5-year CAGR, you might be seeing 4 years of Manager A's decisions and 1 year of Manager B's. The blended number tells you almost nothing about what to expect going forward.\n\nImagine rating a restaurant: the chef who earned the 4.5 stars left last month. The new chef has a completely different menu. But the restaurant still shows 4.5 stars. Would you trust that rating? That's exactly what happens with mutual fund returns after a manager change."},
     {h:"What SEBI requires (and doesn't)",
      body:"Fund houses must disclose manager changes in their monthly factsheets and on their websites. There's no requirement to email you, SMS you, or alert you in any way. In a country where you get 47 promotional messages per day about credit cards, nobody is required to tell you that the person managing your retirement fund has changed.\n\nSome progressive fund houses (like PPFAS) are vocal about their team. Others quietly swap names on a factsheet and hope nobody notices. The asymmetry of information is staggering."},
     {h:"What you should do",
      body:"Check your fund's factsheet quarterly — specifically the 'Fund Manager' section. If the name has changed, research the new manager's track record at their previous fund.\n\nGive it time. A new manager needs 2-3 quarters to meaningfully reshape a portfolio. Don't panic-sell on a manager change — but don't ignore it either. Monitor whether the fund's style (value vs growth, concentrated vs diversified, high-cash vs fully-invested) shifts in ways you didn't sign up for.\n\nConsider this when choosing funds: a fund house with a strong process-driven culture (where the team matters more than any individual) may be more resilient than a star-manager-driven fund. PPFAS and Quantum are examples where the philosophy is institutional. Many others are personality-driven — which works brilliantly until that personality walks out the door."},
   ],
   closing:"You chose your fund for a reason. Make sure that reason is still there. Nobody is obligated to tell you when it leaves.",
  },
];

function LearnPage() {
  useTitle("Learn — Mutual Fund Education Without the Sales Pitch");
  var go=useGo(),m=useW()<768;
  var _r=useVis(0.05),ref=_r[0],vis=_r[1];
  return e("div",{style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap,null,
      e("span",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,display:"inline-block",marginBottom:20,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}},"← Home"),
      e("div",{ref:ref},
        e(A,{vis:vis,delay:0.05},
          e("div",{style:{fontFamily:Mf,fontSize:m?9:10,fontWeight:600,letterSpacing:3,color:C.sage,marginBottom:8,textTransform:"uppercase"}},"Learn")
        ),
        e(A,{vis:vis,delay:0.1},
          e("h1",{style:{fontFamily:Sf,fontSize:m?28:52,fontWeight:400,color:C.char,lineHeight:1.08,margin:"0 0 8px",maxWidth:680}},"Things your bank RM won't tell you.")
        ),
        e(A,{vis:vis,delay:0.15},
          e("p",{style:{fontFamily:Bf,fontSize:m?14:16,color:C.muted,lineHeight:1.7,maxWidth:520,margin:"0 0 36px"}},"Long-form investigations into how India's mutual fund industry actually works. No jargon. No sponsored content. Just the parts they'd rather you didn't read.")
        ),

        // Article grid
        e(A,{vis:vis,delay:0.2},
          e("div",{style:{display:"flex",flexDirection:"column",gap:m?12:16}},
            // Featured first article
            ARTICLES.slice(0,1).map(function(a,i){
              return e(HoverCard,{key:a.slug,onClick:function(){go("/learn/"+a.slug);},style:{background:C.char,borderRadius:12,padding:m?20:32,border:"1px solid "+C.char}},
                e("div",{style:{display:"flex",gap:8,marginBottom:m?12:16}},
                  e("span",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:C.sage,background:C.sage+"20",padding:"3px 8px",borderRadius:4,textTransform:"uppercase"}},a.tag),
                  e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light}},a.time)
                ),
                e("h2",{style:{fontFamily:Sf,fontSize:m?22:32,fontWeight:400,color:C.cream,lineHeight:1.2,margin:"0 0 10px",maxWidth:580}},a.title),
                e("p",{style:{fontFamily:Bf,fontSize:m?13:15,color:"#999",lineHeight:1.6,margin:"0 0 16px",maxWidth:500}},a.subtitle),
                e("span",{style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage}},"Read the investigation →")
              );
            }),
            // Rest of articles
            e("div",{style:{display:"grid",gridTemplateColumns:m?"1fr":"1fr 1fr",gap:m?12:16}},
              ARTICLES.slice(1).map(function(a){
                return e(HoverCard,{key:a.slug,onClick:function(){go("/learn/"+a.slug);},style:{background:C.white,borderRadius:12,padding:m?18:24}},
                  e("div",{style:{display:"flex",gap:8,marginBottom:10}},
                    e("span",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:C.sage,background:C.sage+"14",padding:"3px 8px",borderRadius:4,textTransform:"uppercase"}},a.tag),
                    e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light}},a.time)
                  ),
                  e("h3",{style:{fontFamily:Sf,fontSize:m?18:22,fontWeight:400,color:C.char,lineHeight:1.25,margin:"0 0 8px"}},a.title),
                  e("p",{style:{fontFamily:Bf,fontSize:m?12:13,color:C.muted,lineHeight:1.6,margin:"0 0 12px"}},a.subtitle),
                  e("span",{style:{fontFamily:Bf,fontSize:12,fontWeight:600,color:C.sage}},"Read →")
                );
              })
            )
          )
        ),

        // Bottom CTA
        e(A,{vis:vis,delay:0.3},
          e("div",{style:{marginTop:m?32:48,padding:m?20:28,background:C.sage+"10",border:"1px solid "+C.sage+"25",borderRadius:12,display:"flex",flexDirection:m?"column":"row",justifyContent:"space-between",alignItems:m?"flex-start":"center",gap:16}},
            e("div",null,
              e("p",{style:{fontFamily:Bf,fontSize:m?14:15,fontWeight:600,color:C.char,margin:"0 0 4px"}},"Want to see this knowledge applied?"),
              e("p",{style:{fontFamily:Hf,fontSize:m?14:17,color:C.sage,margin:0}},"We analyse real funds using exactly these principles.")
            ),
            e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 24px",borderRadius:8,cursor:"pointer",flexShrink:0}},"Explore funds →")
          )
        )
      )
    )
  );
}

// ══════════════════════════════════════════
// LEARN ARTICLE PAGE
// ══════════════════════════════════════════
function LearnArticlePage(p) {
  var go=useGo(),m=useW()<768;
  var article=ARTICLES.find(function(a){return a.slug===p.slug;});
  useTitle(article ? article.title : "Article Not Found");
  var _r=useVis(0.05),ref=_r[0],vis=_r[1];

  if(!article) return e(Shell,{label:"Learn",title:"Article not found.",sub:"It might have been moved or doesn't exist yet."},
    e("button",{onClick:function(){go("/learn");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}},"Browse all articles")
  );

  // Find adjacent articles for navigation
  var idx=ARTICLES.indexOf(article);
  var prev=idx>0?ARTICLES[idx-1]:null;
  var next=idx<ARTICLES.length-1?ARTICLES[idx+1]:null;

  return e("div",{style:{paddingTop:m?80:100,minHeight:"80vh",paddingBottom:60}},
    e(Wrap,{style:{maxWidth:720}},
      // Breadcrumb
      e("div",{style:{display:"flex",gap:8,marginBottom:24,alignItems:"center",flexWrap:"wrap"}},
        e("span",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}},"Home"),
        e("span",{style:{color:C.faint}}," / "),
        e("span",{onClick:function(){go("/learn");},style:{fontFamily:Bf,fontSize:12,color:C.sage,cursor:"pointer",fontWeight:600,textDecoration:"underline",textUnderlineOffset:4,padding:"6px 0"}},"Learn")
      ),

      e("div",{ref:ref},
        // Article header
        e(A,{vis:vis,delay:0.05},
          e("div",{style:{display:"flex",gap:8,marginBottom:16,alignItems:"center"}},
            e("span",{style:{fontFamily:Mf,fontSize:9,fontWeight:700,letterSpacing:2,color:C.sage,background:C.sage+"14",padding:"4px 10px",borderRadius:4,textTransform:"uppercase"}},article.tag),
            e("span",{style:{fontFamily:Mf,fontSize:10,color:C.light}},article.time)
          )
        ),
        e(A,{vis:vis,delay:0.1},
          e("h1",{style:{fontFamily:Sf,fontSize:m?28:48,fontWeight:400,color:C.char,lineHeight:1.1,margin:"0 0 12px"}},article.title)
        ),
        e(A,{vis:vis,delay:0.15},
          e("p",{style:{fontFamily:Bf,fontSize:m?15:18,color:C.muted,lineHeight:1.65,margin:"0 0 32px"}},article.subtitle)
        ),

        // Hero paragraph
        e(A,{vis:vis,delay:0.18},
          e("div",{style:{background:C.char,borderRadius:12,padding:m?20:32,marginBottom:m?32:44}},
            e("p",{style:{fontFamily:Bf,fontSize:m?14:16,color:"#ccc",lineHeight:1.8,margin:0}},article.hero)
          )
        ),

        // Article sections
        article.sections.map(function(sec,i){
          return e(A,{key:i,vis:vis,delay:Math.min(0.2+i*0.03,0.35)},
            e("div",{style:{marginBottom:m?32:40}},
              e("h2",{style:{fontFamily:Sf,fontSize:m?20:28,fontWeight:400,color:C.char,lineHeight:1.2,margin:"0 0 14px"}},sec.h),
              sec.body.split("\n\n").map(function(para,j){
                return e("p",{key:j,style:{fontFamily:Bf,fontSize:m?14:15,color:C.body,lineHeight:1.85,margin:"0 0 16px",maxWidth:640}},para);
              })
            )
          );
        }),

        // Closing
        e(A,{vis:vis,delay:0.35},
          e("div",{style:{borderTop:"2px solid "+C.sage,paddingTop:m?20:28,marginTop:m?8:16,marginBottom:m?32:44}},
            e("p",{style:{fontFamily:Sf,fontSize:m?17:22,fontStyle:"italic",color:C.sage,lineHeight:1.5,margin:0,maxWidth:560}},article.closing)
          )
        ),

        // Article navigation
        e(A,{vis:vis,delay:0.36},
          e("div",{style:{display:"grid",gridTemplateColumns:prev&&next?"1fr 1fr":"1fr",gap:12,marginBottom:32}},
            prev?e(HoverCard,{onClick:function(){go("/learn/"+prev.slug);},style:{background:C.white,borderRadius:12,padding:m?16:20}},
              e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:6}},"← Previous"),
              e("div",{style:{fontFamily:Bf,fontSize:m?13:15,fontWeight:600,color:C.char,lineHeight:1.3}},prev.title)
            ):null,
            next?e(HoverCard,{onClick:function(){go("/learn/"+next.slug);},style:{background:C.white,borderRadius:12,padding:m?16:20,textAlign:prev?"right":"left"}},
              e("div",{style:{fontFamily:Mf,fontSize:9,letterSpacing:2,color:C.light,textTransform:"uppercase",marginBottom:6}},"Next →"),
              e("div",{style:{fontFamily:Bf,fontSize:m?13:15,fontWeight:600,color:C.char,lineHeight:1.3}},next.title)
            ):null
          )
        ),

        // Back to all
        e(A,{vis:vis,delay:0.37},
          e("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
            e("button",{onClick:function(){go("/learn");},style:{fontFamily:Bf,fontSize:13,fontWeight:600,color:C.sage,background:"transparent",border:"1.5px solid "+C.sage,padding:"12px 22px",borderRadius:8,cursor:"pointer"}},"← All articles"),
            e("button",{onClick:function(){go("/explore");},style:{fontFamily:Bf,fontSize:13,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"12px 22px",borderRadius:8,cursor:"pointer"}},"See these principles in action →")
          )
        )
      )
    )
  );
}

function NotFound() { var go=useGo(); return e(Shell,{label:"404",title:"This page doesn't exist. Kind of like guaranteed returns."},e("button",{onClick:function(){go("/");},style:{fontFamily:Bf,fontSize:14,fontWeight:700,color:C.cream,background:C.char,border:"none",padding:"14px 28px",borderRadius:8,cursor:"pointer"}},"Home")); }

// ══════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════
export default function App() {
  var _p=useState(typeof window!=="undefined"?window.location.pathname:"/"),page=_p[0],setPage=_p[1];
  var go = useCallback(function(r){setPage(r);window.history.pushState({},"",r);window.scrollTo({top:0,behavior:"instant"});},[]);
  useEffect(function(){var h=function(){setPage(window.location.pathname);};window.addEventListener("popstate",h);return function(){window.removeEventListener("popstate",h);};},[]);
  var view;

  if(page==="/") view=e(Landing);
  else if(page==="/explore") view=e(ExplorePage);
  else if(page.indexOf("/fund/")===0) view=e(FundPage,{id:page.split("/fund/")[1]});
  else if(page.indexOf("/house/")===0) view=e(FundHousePage,{slug:page.split("/house/")[1]});
  else if(page.indexOf("/scheme/")===0){var s=page.split("/"); view=e(SchemePage,{houseSlug:s[2],code:s[3]});}
  else if(page==="/learn") view=e(LearnPage);
  else if(page.indexOf("/learn/")===0) view=e(LearnArticlePage,{slug:page.split("/learn/")[1]});
  else if(page==="/calculator") view=e(CalcPage);
  else if(page==="/direct-vs-regular") view=e(DirectVsRegularPage);
  else if(page==="/manifesto") view=e(ManifestoPage);
  else if(page==="/top-funds") view=e(Shell,{label:"Rankings",title:"The ones winning. For now."},TOP3.map(function(f,i){return e(LeaderItem,{key:f.r,f:f,i:i});}));
  else view=e(NotFound);

  return e(NavCtx.Provider,{value:go},
    e("div",{style:{background:C.bg,minHeight:"100vh",WebkitFontSmoothing:"antialiased"}},
      e("style",null,"@import url('"+FONTS+"');*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}body{background:"+C.bg+"}::selection{background:"+C.sage+";color:#fff}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:"+C.sage+";cursor:pointer;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15)}input::placeholder{color:"+C.light+"}"),
      e(Navbar,{page:page}),
      view,
      e(Footer)
    )
  );
}
