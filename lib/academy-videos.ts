export type VideoChapter = {
  time: number; // in seconds
  title: string;
  description: string;
};

export type VideoVisualType =
  | "structure"
  | "moving_averages"
  | "invalidation"
  | "sr_flips"
  | "order_book"
  | "volume_profile"
  | "tape_reading"
  | "liquidity_sweeps"
  | "bonding_curve"
  | "wallet_clustering"
  | "scalp_playbook"
  | "narrative_cycle"
  | "position_sizing"
  | "drawdown_math"
  | "execution_checklist"
  | "hedging_beta"
  | "fed_liquidity"
  | "ai_capex"
  | "earnings_pead"
  | "premarket_flow";

export type VideoLesson = {
  id: string;
  title: string;
  module: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationSeconds: number;
  durationLabel: string;
  videoUrl: string;
  instructor: string;
  instructorRole: string;
  instructorInitials: string;
  visualType: VideoVisualType;
  chapters: VideoChapter[];
  summary: string;
  takeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

export const ACADEMY_MODULES = [
  "All Modules",
  "Price Action & Structure",
  "Microstructure & Order Flow",
  "Meme Coins & Pump.fun",
  "Risk Management & Sizing",
  "Macro & Tech Cycles",
] as const;

export const VIDEO_LESSONS_20: VideoLesson[] = [
  // --- Module 1: Price Action & Structure ---
  {
    id: "lesson-structure-101",
    title: "Lesson 1: Market Structure Before Indicators",
    module: "Price Action & Structure",
    level: "Beginner",
    durationSeconds: 660,
    durationLabel: "11:00",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-structure-101.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "structure",
    summary:
      "A trend is a sequence of higher highs and higher lows until it is not. Learn how to map structural swing pivots on S&P 500, Nasdaq equities, and crypto charts without getting fooled by indicator lag.",
    chapters: [
      { time: 0, title: "00:00 - Introduction to Price Structure", description: "Why 80% of indicator signals fail without structural confirmation." },
      { time: 90, title: "01:30 - Identifying Swing Highs & Lows", description: "Marking clean 3-candle swing pivots on daily and 1-hour timeframes." },
      { time: 240, title: "04:00 - The 200-Day Structural Boundary", description: "The definitive dividing line between bull and bear market regimes." },
      { time: 420, title: "07:00 - Defining Invalidation Stops", description: "Finding the exact level where your thesis is proven wrong before entering." },
      { time: 540, title: "09:00 - Live Chart Walkthrough (NVDA & BTC)", description: "Applying structure reading to live market data." },
    ],
    takeaways: [
      "Always mark the last 3 swing highs and lows before loading any oscillator.",
      "An uptrend remains structurally valid until a prior swing low breaks on a closing candle.",
      "The invalidation level is not arbitrary: it sits exactly beyond the key structural pivot.",
    ],
    quiz: {
      question: "In NextWall Street's framework, what determines if an uptrend has broken?",
      options: [
        "RSI dropping below 50",
        "A prior swing low breaking on a confirmed closing basis",
        "A 5% intraday drop in price",
        "The 20-day moving average turning red",
      ],
      correctIndex: 1,
      explanation: "Price structure takes precedence over oscillators. A trend is intact until a prior swing low breaks on a closing basis.",
    },
  },
  {
    id: "lesson-moving-averages",
    title: "Lesson 2: Moving Average Confluence & The 200-Day Regime",
    module: "Price Action & Structure",
    level: "Beginner",
    durationSeconds: 580,
    durationLabel: "09:40",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-moving-averages.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "moving_averages",
    summary:
      "Master the dynamic interplay between the 20-EMA (short momentum), 50-SMA (institutional accumulation), and 200-SMA (macro regime filter). Avoid over-trading chop and ride multi-month trends.",
    chapters: [
      { time: 0, title: "00:00 - The Triple Moving Average Stack", description: "Aligning short, medium, and long-term trend vectors." },
      { time: 120, title: "02:00 - Golden Cross & Death Cross Reality", description: "Why traditional crossovers lag and how to trade mean reversion bounces." },
      { time: 260, title: "04:20 - The 50-SMA Institutional Test", description: "How mutual funds and pensions defend the 50-day moving average." },
      { time: 410, title: "06:50 - Slopes vs. Flat MAs", description: "Identifying trending regimes versus range-bound consolidation chop." },
      { time: 500, title: "08:20 - Live Case Study: Apple & Microsoft", description: "Evaluating multi-year mega-cap moving average behavior." },
    ],
    takeaways: [
      "Never buy equities or crypto below a declining 200-day simple moving average.",
      "The 20-day exponential moving average acts as a dynamic trailing stop for high-momentum leaders.",
      "A flat moving average indicates range-bound chop where trend systems should stay on the sidelines.",
    ],
    quiz: {
      question: "What does a flattening 50-SMA signify after an extended rally?",
      options: [
        "An immediate guaranteed crash",
        "Trend momentum is slowing and the asset is entering a consolidation regime",
        "A buy signal with maximum leverage",
        "The exchange order book is frozen",
      ],
      correctIndex: 1,
      explanation: "A flattening slope reveals that buyers and sellers are reaching equilibrium, shifting market conditions from trending to range-bound consolidation.",
    },
  },
  {
    id: "lesson-invalidation-stops",
    title: "Lesson 3: Invalidation Architecture & Stop-Loss Physics",
    module: "Price Action & Structure",
    level: "Intermediate",
    durationSeconds: 610,
    durationLabel: "10:10",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-invalidation-stops.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "invalidation",
    summary:
      "If you do not know where you are wrong before entering, you are not trading: you are gambling. Learn how to place structural invalidation stops that market makers cannot easily trigger.",
    chapters: [
      { time: 0, title: "00:00 - The Concept of Invalidation", description: "Separating emotional panic from structural thesis failure." },
      { time: 110, title: "01:50 - Volatility-Based Padding (ATR)", description: "Preventing stop-outs from normal market noise and bid-ask spread." },
      { time: 270, title: "04:30 - Invalidation vs. Mental Stops", description: "Why hard broker stops protect capital during black swan liquidity events." },
      { time: 430, title: "07:10 - Trailing Stops on Breakouts", description: "Locking in asymmetric gains as higher swing lows develop." },
      { time: 540, title: "09:00 - Case Study: Palantir & Tesla", description: "Managing stop placement during explosive earnings volatility." },
    ],
    takeaways: [
      "An invalidation level must be chosen BEFORE calculating position size.",
      "Pad stops by 0.5 to 1.0 ATR below the swing pivot to avoid stop hunting sweeps.",
      "Move stops to breakeven only after price establishes a new confirmed structural swing low.",
    ],
    quiz: {
      question: "Why should stop-loss levels be padded with Average True Range (ATR)?",
      options: [
        "To increase the broker fee",
        "To absorb standard intraday noise without triggering premature exits",
        "To guarantee 100% win rate",
        "To ignore fundamental earnings reports",
      ],
      correctIndex: 1,
      explanation: "Padding stops with a fraction of ATR ensures normal volatility noise does not eject you from a structurally sound trend.",
    },
  },
  {
    id: "lesson-sr-flips",
    title: "Lesson 4: Support & Resistance Flips & The Polarity Principle",
    module: "Price Action & Structure",
    level: "Intermediate",
    durationSeconds: 590,
    durationLabel: "09:50",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-sr-flips.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "sr_flips",
    summary:
      "Prior resistance becomes future support: the foundational law of technical market memory. How to execute high-probability retests after multi-month consolidation breakouts.",
    chapters: [
      { time: 0, title: "00:00 - The Psychology of Resistance", description: "Trapped short sellers and regretful non-buyers at key levels." },
      { time: 130, title: "02:10 - The Clean S/R Retest Anatomy", description: "Candlestick confirmation on decreasing retest volume." },
      { time: 280, title: "04:40 - Failed Retests & Bear Traps", description: "Differentiating between liquidity absorption and actual rejections." },
      { time: 420, title: "07:00 - S/R Zones vs. Exact Dollar Lines", description: "Why institutional orders fill in bands, not exact penny lines." },
      { time: 510, title: "08:30 - Live Chart Review: S&P 500 ATH Breakouts", description: "Analyzing major index breakout retests." },
    ],
    takeaways: [
      "Former ceiling levels turn into support because sidelined capital seeks entry on the first pullback.",
      "Look for decreasing volume on the retest followed by an impulsive expansion bar.",
      "If price drops back inside the consolidation range on heavy volume, exit immediately.",
    ],
    quiz: {
      question: "What volume signature confirms a healthy breakout and retest?",
      options: [
        "High volume on the breakout, decreasing volume on the retest, high volume on the bounce",
        "No volume at all across all candles",
        "Massive selling volume on the retest breaking below the level",
        "Flat volume forever",
      ],
      correctIndex: 0,
      explanation: "A healthy breakout shows aggressive buying expansion, light volume as price calmly tests support, and strong resumption volume.",
    },
  },

  // --- Module 2: Microstructure & Order Flow ---
  {
    id: "lesson-crypto-liquidity",
    title: "Lesson 5: Crypto Liquidity, Order Books & Float",
    module: "Microstructure & Order Flow",
    level: "Intermediate",
    durationSeconds: 720,
    durationLabel: "12:00",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-crypto-liquidity.mp4",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    instructorInitials: "ML",
    visualType: "order_book",
    summary:
      "When evaluating Bitcoin, Solana, and Binance altcoins, there are no discounted cash flows. Here is how to price global liquidity, real yields, stablecoin float, and exchange order books.",
    chapters: [
      { time: 0, title: "00:00 - The Global Liquidity Regime", description: "Mapping M2 expansion and real interest rates to crypto momentum." },
      { time: 120, title: "02:00 - Float vs. Total Supply Dynamics", description: "Why low float/high FDV coins face perpetual downward pressure." },
      { time: 300, title: "05:00 - Exchange Order Book Depth", description: "Measuring bid-ask slippage and market-maker inventory skew." },
      { time: 480, title: "08:00 - Volatility-Scaled Sizing Maths", description: "Sizing crypto so a 40% drawdown is fully survivable." },
      { time: 630, title: "10:30 - Execution Checklist", description: "Three strict rules for entering liquid digital asset positions." },
    ],
    takeaways: [
      "Crypto has no valuation floor — it has a liquidity ceiling driven by macro conditions.",
      "Float, not total paper market cap, decides how violently price moves.",
      "Scale position sizes by realized 60-day volatility rather than fixed dollar allocations.",
    ],
    quiz: {
      question: "Why does the model emphasize float over fully diluted valuation (FDV)?",
      options: [
        "Because FDV includes tokens not yet circulating in the order book",
        "Because all tokens trade at the same speed",
        "Because FDV is always zero for Bitcoin",
        "Because market makers only look at social media mentions",
      ],
      correctIndex: 0,
      explanation: "Float represents the actual supply available to trade. Large future unlocks create structural overhead that depresses token price over time.",
    },
  },
  {
    id: "lesson-volume-profile",
    title: "Lesson 6: Volume Profile & Point of Control (POC)",
    module: "Microstructure & Order Flow",
    level: "Advanced",
    durationSeconds: 650,
    durationLabel: "10:50",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-volume-profile.mp4",
    instructor: "Priya Raghunathan",
    instructorRole: "Quantitative Research Analyst",
    instructorInitials: "PR",
    visualType: "volume_profile",
    summary:
      "Traditional charts show volume over time; Volume Profile shows volume at price. Learn how to identify High Volume Nodes (HVN), Low Volume Nodes (LVN), and Value Area High/Low boundaries.",
    chapters: [
      { time: 0, title: "00:00 - Volume Profile vs. Standard Volume Bars", description: "Understanding price acceptance versus price rejection." },
      { time: 140, title: "02:20 - The Point of Control (POC)", description: "The price level where institutions transacted the largest volume." },
      { time: 290, title: "04:50 - Value Area (VAH & VAL) 70% Rule", description: "Trading mean reversion inside value and breakouts outside value." },
      { time: 440, title: "07:20 - Low Volume Nodes (LVN) as Launchpads", description: "Why price moves through thin volume profiles with zero friction." },
      { time: 550, title: "09:10 - Applying POC to Nasdaq Futures & Solana", description: "Live execution examples on high-frequency assets." },
    ],
    takeaways: [
      "The Point of Control acts as a magnetic anchor during consolidation regimes.",
      "Low Volume Nodes represent price rejection where aggressive momentum moves accelerate.",
      "If price accepts above Value Area High for 2 consecutive 1-hour candles, a trend breakout is underway.",
    ],
    quiz: {
      question: "What does a Low Volume Node (LVN) on a Volume Profile chart indicate?",
      options: [
        "Price spent very little time or volume there, so price will slice through it rapidly upon retest",
        "The market is completely closed",
        "Institutions bought 100% of their shares at that exact price",
        "A guaranteed reversal point where everyone buys",
      ],
      correctIndex: 0,
      explanation: "Low Volume Nodes represent prices where market participants moved quickly with minimal resistance. Price typically traverses LVNs with high velocity.",
    },
  },
  {
    id: "lesson-order-book-depth",
    title: "Lesson 7: Level 2 Depth of Market & Tape Reading",
    module: "Microstructure & Order Flow",
    level: "Advanced",
    durationSeconds: 620,
    durationLabel: "10:20",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-order-book-depth.mp4",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    instructorInitials: "ML",
    visualType: "tape_reading",
    summary:
      "Decode the Time & Sales tape and Level 2 order book. Spot spoofing, iceberg orders, and aggressive market sweeps that precede massive directional expansions in tech stocks and crypto.",
    chapters: [
      { time: 0, title: "00:00 - Demystifying the Level 2 Book", description: "Bids, asks, queue priority, and market maker limits." },
      { time: 120, title: "02:00 - Iceberg Orders & Hidden Size", description: "How institutional algorithms hide multi-million dollar orders." },
      { time: 260, title: "04:20 - Tape Speed & Delta Acceleration", description: "Interpreting green prints at the ask vs. red prints at the bid." },
      { time: 400, title: "06:40 - Spoofing & Order Book Liquidity Illusions", description: "Recognizing fake walls that vanish right before price reaches them." },
      { time: 520, title: "08:40 - Combining Tape Reading with Key Levels", description: "Validating structural breakout entries using tape velocity." },
    ],
    takeaways: [
      "Large visible bid walls are often spoof orders designed to lure retail into trapped longs.",
      "Watch the speed of Time & Sales: frantic prints at the ask signal urgent institutional accumulation.",
      "An iceberg order reveals itself when the ask size refreshes continuously despite heavy buying.",
    ],
    quiz: {
      question: "What is an 'iceberg order' on Level 2?",
      options: [
        "A large order divided into small visible chunks to avoid moving the market price",
        "A frozen trade that was cancelled by the SEC",
        "A cold-storage cryptocurrency transfer",
        "A sell limit placed below the bid price",
      ],
      correctIndex: 0,
      explanation: "Icebergs allow institutional desks to execute massive block sizes without tipping off retail participants in the visible Level 2 book.",
    },
  },
  {
    id: "lesson-liquidity-sweeps",
    title: "Lesson 8: Liquidity Sweeps, Stop Hunts & Trapped Traders",
    module: "Microstructure & Order Flow",
    level: "Intermediate",
    durationSeconds: 640,
    durationLabel: "10:40",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-liquidity-sweeps.mp4",
    instructor: "Priya Raghunathan",
    instructorRole: "Quantitative Research Analyst",
    instructorInitials: "PR",
    visualType: "liquidity_sweeps",
    summary:
      "Stop hunts are not conspiracies: they are mathematical market-making realities. Discover where buy-stop and sell-stop liquidity pools cluster, and how to trade the resulting rejection wicks.",
    chapters: [
      { time: 0, title: "00:00 - Where Liquidity Gathers", description: "Why equal highs and equal lows represent magnetic stop pools." },
      { time: 130, title: "02:10 - The Mechanics of a Sweep", description: "Institutions engineering counter-party liquidity to fill large positions." },
      { time: 270, title: "04:30 - The Turtle Soup Reversal Pattern", description: "Fading breakouts that quickly close back inside the prior range." },
      { time: 420, title: "07:00 - Displacement Candlesticks", description: "Confirming that smart money has absorbed retail stop losses." },
      { time: 530, title: "08:50 - Real Market Example on Bitcoin & Nvidia", description: "Identifying high-probability sweep-and-reverse entries." },
    ],
    takeaways: [
      "Equal highs and obvious swing points are where retail place their stops.",
      "A sweep candle that wicks beyond a level and closes back inside indicates aggressive absorption.",
      "Wait for displacement (a strong candle close in the opposite direction) before triggering entry.",
    ],
    quiz: {
      question: "Why do institutional algorithms push price through obvious swing highs before reversing?",
      options: [
        "To trigger buy-stops and provide the liquidity needed to fill large short orders",
        "Because computers make random errors",
        "To let retail traders win easily",
        "Because moving averages require it",
      ],
      correctIndex: 0,
      explanation: "Breakout buy-stops act as market buy orders, giving large institutions the counterparty liquidity they require to execute large sell positions.",
    },
  },

  // --- Module 3: Meme Coins & Pump.fun ---
  {
    id: "lesson-pump-fun-risk",
    title: "Lesson 9: Pump.fun & Meme Coins — The Pure Risk Protocol",
    module: "Meme Coins & Pump.fun",
    level: "Intermediate",
    durationSeconds: 540,
    durationLabel: "09:00",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-pump-fun-risk.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "bonding_curve",
    summary:
      "From Fartcoin and Goat to viral pump.fun tokens: an institutional breakdown of bonding curves, wallet concentration, narrative half-life, and mechanical profit-taking.",
    chapters: [
      { time: 0, title: "00:00 - Attention Economics Explained", description: "Why meme coins are liquidity events dressed in community mascots." },
      { time: 100, title: "01:40 - Top 100 Wallet Concentration", description: "Reading on-chain wallet clusters and bubble maps before buying." },
      { time: 220, title: "03:40 - Pump.fun Bonding Curve Mechanics", description: "Understanding the migration threshold to Raydium and DEXs." },
      { time: 360, title: "06:00 - The Distribution Phase Signature", description: "Spotting volume divergence when smart money exits into retail hype." },
      { time: 460, title: "07:40 - The Hard 2% Portfolio Rule", description: "Never averaging down and taking partial profits mechanically." },
    ],
    takeaways: [
      "If top-100 wallets hold over 40% of supply, the exit door is narrower than the entrance.",
      "A rising price on declining volume is an immediate liquidity exit signal.",
      "Never average down on a broken meme trend; the thesis is momentum only.",
    ],
    quiz: {
      question: "What is the primary risk management rule when trading pump.fun meme tokens?",
      options: [
        "Hold until a 100x return occurs",
        "Average down when the coin drops 80%",
        "Cap total meme exposure under 2% and never average down",
        "Only buy tokens with animal names",
      ],
      correctIndex: 2,
      explanation: "Because meme tokens have no fundamental anchor, position size is the entire risk control. Capping exposure and never averaging down prevents catastrophic loss.",
    },
  },
  {
    id: "lesson-onchain-wallet-clusters",
    title: "Lesson 10: On-Chain Wallet Clustering & Bubble Map Forensics",
    module: "Meme Coins & Pump.fun",
    level: "Advanced",
    durationSeconds: 630,
    durationLabel: "10:30",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-onchain-wallet-clusters.mp4",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    instructorInitials: "ML",
    visualType: "wallet_clustering",
    summary:
      "Before trading any high-velocity meme coin, you must inspect the blockchain. Learn how to uncover insider wallet dispersion, dev wallet funding trees, and sniper bot collusion.",
    chapters: [
      { time: 0, title: "00:00 - The Reality of Token Launches", description: "How creators deploy sniper bots to buy up initial bonding curve supply." },
      { time: 130, title: "02:10 - Reading Solscan & Bubble Maps", description: "Spotting clustered nodes funded by the same root transaction." },
      { time: 280, title: "04:40 - Liquidity Pool Locking Verification", description: "Verifying whether LP tokens are burned or timelocked." },
      { time: 430, title: "07:10 - The 'First 10 Minutes' Volume Profile", description: "Analyzing buyer diversity vs. single-wallet wash trading." },
      { time: 540, title: "09:00 - Live Analysis on Recent Pump.fun Breakouts", description: "Walking through wallet distribution metrics on live tokens." },
    ],
    takeaways: [
      "If 10 different wallets were all funded by the same centralized exchange deposit, treat them as one single insider.",
      "Always verify that LP tokens have been permanently sent to the dead burn address.",
      "Smart money exits slowly via small market sells while broadcasting bullish social media sentiment.",
    ],
    quiz: {
      question: "What is a major red flag on an on-chain bubble map of a newly launched meme coin?",
      options: [
        "Multiple top holder wallets being funded by the exact same parent wallet shortly before launch",
        "Thousands of small independent retail buyers",
        "The creator wallet has zero tokens left",
        "The coin has a website with a whitepaper",
      ],
      correctIndex: 0,
      explanation: "A cluster of top holder wallets sharing a single funding parent indicates coordinated insider bundling, creating severe dumping risk.",
    },
  },
  {
    id: "lesson-meme-scalp-playbook",
    title: "Lesson 11: Scalping High-Beta Memes: 5-Minute Timeframe Playbook",
    module: "Meme Coins & Pump.fun",
    level: "Advanced",
    durationSeconds: 570,
    durationLabel: "09:30",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-meme-scalp-playbook.mp4",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    instructorInitials: "ML",
    visualType: "scalp_playbook",
    summary:
      "Scalping 50% intraday meme coin swings requires ruthless discipline. Explore the 5-minute EMA crossover, VWAP reclaim entries, and rapid multi-tier profit taking.",
    chapters: [
      { time: 0, title: "00:00 - The 5-Minute Momentum Framework", description: "Setting up 9-EMA, 21-EMA, and anchored session VWAP." },
      { time: 110, title: "01:50 - The VWAP Reclaim Trigger", description: "Why buying below VWAP is suicide and buying above VWAP offers edge." },
      { time: 260, title: "04:20 - Setting 2-to-1 Reward-to-Risk Scalps", description: "Risking 5% to make 15% with trailing stops." },
      { time: 400, title: "06:40 - Slippage & Priority Gas Fees", description: "Configuring Solana RPC settings to ensure immediate order fills." },
      { time: 500, title: "08:20 - The 'One Strike and Out' Rule", description: "Why scalpers never hold a trade that misses immediate continuation." },
    ],
    takeaways: [
      "Only initiate long scalps when price is trading above the session Volume Weighted Average Price (VWAP).",
      "Take 50% off at Target 1 (+15%) and move stops to your breakeven entry price.",
      "If momentum stalls for more than three 5-minute candles, close the trade at market.",
    ],
    quiz: {
      question: "In the 5-minute meme scalp playbook, what does VWAP represent?",
      options: [
        "The institutional benchmark price for the session, separating bullish momentum from distribution",
        "A proprietary broker commission formula",
        "The maximum leverage allowed by the exchange",
        "The total number of coins in circulation",
      ],
      correctIndex: 0,
      explanation: "VWAP reflects the true average price paid weighted by volume. Trading above VWAP indicates institutional buyers are supporting the market.",
    },
  },
  {
    id: "lesson-narrative-halflife",
    title: "Lesson 12: Narrative Half-Life & The Social Hype Curve",
    module: "Meme Coins & Pump.fun",
    level: "Intermediate",
    durationSeconds: 580,
    durationLabel: "09:40",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-narrative-halflife.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "narrative_cycle",
    summary:
      "Every meme coin narrative (AI agents, animals, political mascots) has a quantifiable attention half-life. Map Google Trends, Twitter impression spikes, and volume exhaustion.",
    chapters: [
      { time: 0, title: "00:00 - The Lifecycle of a Meme Cycle", description: "Stealth discovery, smart money accumulation, retail euphoria, and decay." },
      { time: 120, title: "02:00 - Measuring Social Velocity", description: "Tracking sentiment velocity before mainstream media pick up the story." },
      { time: 270, title: "04:30 - Derivative Meme Dilution", description: "How copycat spin-offs siphon liquidity from the primary leader." },
      { time: 410, title: "06:50 - The Second Wave Re-Accumulation", description: "Differentiating dead tokens from cult communities building real floors." },
      { time: 510, title: "08:30 - Live Case Study: Goatseus & Fartcoin", description: "Analyzing the transition from bonding curve to global CEX listings." },
    ],
    takeaways: [
      "When your non-trader acquaintances ask about a meme coin, the narrative is at peak euphoria.",
      "Leader tokens retain 80% of category mindshare; copycat tokens collapse to zero.",
      "Always rotate profits from speculative meme wins into Bitcoin, Ethereum, or blue-chip tech.",
    ],
    quiz: {
      question: "What typically happens when multiple derivative tokens launch copying a trending meme coin?",
      options: [
        "All tokens pump 1000% simultaneously",
        "Liquidity becomes fragmented and retail attention dilutes, often marking the local cycle top",
        "The Federal Reserve adjusts interest rates",
        "The blockchain network shuts down permanently",
      ],
      correctIndex: 1,
      explanation: "Derivative saturation splits limited retail capital across dozens of clones, rapidly exhausting buyer momentum across the entire category.",
    },
  },

  // --- Module 4: Risk Management & Sizing ---
  {
    id: "lesson-position-sizing",
    title: "Lesson 13: Volatility-Adjusted Position Sizing & ATR",
    module: "Risk Management & Sizing",
    level: "Beginner",
    durationSeconds: 610,
    durationLabel: "10:10",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-position-sizing.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "position_sizing",
    summary:
      "Equal dollar sizing is amateur sizing: a $10,000 position in NVDA carries vastly different risk than $10,000 in a micro-cap altcoin. Learn the institutional 1% risk formula.",
    chapters: [
      { time: 0, title: "00:00 - The Core Risk Equation", description: "Position Size = (Account Capital * Risk %) / Invalidation Distance." },
      { time: 130, title: "02:10 - Normalizing Volatility Across Assets", description: "Using 14-day Average True Range (ATR) to equalize risk." },
      { time: 280, title: "04:40 - Why Traders Blow Up", description: "Over-sizing on low conviction setups and revenge trading drawdowns." },
      { time: 420, title: "07:00 - Spreadsheet Walkthrough", description: "Building a 10-second position sizing calculator for your daily routine." },
      { time: 520, title: "08:40 - Real Portfolio Simulation", description: "Running 100 simulated trades under 1% vs. 5% risk per trade." },
    ],
    takeaways: [
      "Risk no more than 1.0% of total portfolio equity on any single directional trade.",
      "The distance to your structural stop-loss determines your share quantity, not your desired profit target.",
      "A high-volatility meme coin requires a much smaller share count than a mega-cap tech stock.",
    ],
    quiz: {
      question: "If your account is $50,000, you risk 1% ($500), and your stop loss is $5 below entry, how many shares can you buy?",
      options: ["100 shares", "500 shares", "1,000 shares", "50 shares"],
      correctIndex: 0,
      explanation: "$500 total risk divided by $5 risk per share equals exactly 100 shares ($500 / $5 = 100).",
    },
  },
  {
    id: "lesson-portfolio-drawdown-maths",
    title: "Lesson 14: Portfolio Drawdown Maths & Geometric Recovery",
    module: "Risk Management & Sizing",
    level: "Intermediate",
    durationSeconds: 560,
    durationLabel: "09:20",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-portfolio-drawdown-maths.mp4",
    instructor: "Priya Raghunathan",
    instructorRole: "Quantitative Research Analyst",
    instructorInitials: "PR",
    visualType: "drawdown_math",
    summary:
      "A 50% loss requires a 100% gain just to break even. Understand the asymmetric brutal mathematics of compounding drawdowns and how to prevent catastrophic portfolio destruction.",
    chapters: [
      { time: 0, title: "00:00 - The Non-Linear Math of Losses", description: "Why recovery requirements skyrocket exponentially past a 20% drawdown." },
      { time: 110, title: "01:50 - Maximum Historical Drawdown Limits", description: "Setting portfolio circuit breakers that force trading pauses." },
      { time: 260, title: "04:20 - The Anti-Martingale Strategy", description: "Reducing position sizes during losing streaks rather than increasing them." },
      { time: 400, title: "06:40 - The Psychological Spiral of Heavy Losses", description: "How cognitive fatigue induces reckless revenge gambling." },
      { time: 490, title: "08:10 - The Capital Preservation Rulebook", description: "Daily maximum loss rules used by proprietary trading firms." },
    ],
    takeaways: [
      "A 20% drawdown needs a 25% gain to recover; a 50% drawdown requires a 100% gain.",
      "Implement a daily loss limit (e.g. -2% of account equity) where you must step away from screens.",
      "When in a drawdown slump, cut your trade size in half until profitability stabilizes.",
    ],
    quiz: {
      question: "What percentage gain is required to restore an account after suffering a 50% loss?",
      options: ["50%", "75%", "100%", "200%"],
      correctIndex: 2,
      explanation: "If a $10,000 account drops 50% to $5,000, it must generate a $5,000 profit to return to $10,000, which is a 100% gain on the remaining $5,000.",
    },
  },
  {
    id: "lesson-execution-discipline",
    title: "Lesson 15: Execution Discipline: Pre-Trade Checklists & FOMO Elimination",
    module: "Risk Management & Sizing",
    level: "Beginner",
    durationSeconds: 570,
    durationLabel: "09:30",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-execution-discipline.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "execution_checklist",
    summary:
      "Elite traders do not rely on willpower: they rely on checklists. Transform your trading from reactive emotional clicking to calm, robotic execution with our 5-point verification filter.",
    chapters: [
      { time: 0, title: "00:00 - Why Discipline Beats Intelligence", description: "The psychological traps that cause 90% of retail traders to fail." },
      { time: 120, title: "02:00 - The 5-Point Trade Entry Checklist", description: "Trend, Level, Signal, Invalidation, and Reward-to-Risk confirmation." },
      { time: 270, title: "04:30 - Eliminating FOMO on Extended Moves", description: "Recognizing that chasing green candles is donating money to early buyers." },
      { time: 410, title: "06:50 - Keeping a Trade Journal That Works", description: "Tracking emotional state, trade screenshots, and R-multiple outcomes." },
      { time: 500, title: "08:20 - The Golden Rule of Trade Sizing", description: "If a trade causes you anxiety, your position size is objectively too large." },
    ],
    takeaways: [
      "Never click buy on an asset that has already moved more than 2 ATRs without consolidating.",
      "If a setup does not satisfy all 5 checklist conditions, let it pass without regret.",
      "Review your trade journal every weekend to identify recurrent behavioral mistakes.",
    ],
    quiz: {
      question: "What is the primary indicator that your position size is too large for your risk tolerance?",
      options: [
        "You feel chronic anxiety and obsessively check price every 30 seconds",
        "Your broker issues an execution receipt",
        "The market spread is 1 cent",
        "The company reports quarterly earnings next month",
      ],
      correctIndex: 0,
      explanation: "Physical anxiety and compulsive screen monitoring are direct physiological signals that the financial risk exceeds your emotional tolerance threshold.",
    },
  },
  {
    id: "lesson-hedging-beta-skew",
    title: "Lesson 16: Hedging Strategies: Beta Skew & Cash Allocation",
    module: "Risk Management & Sizing",
    level: "Advanced",
    durationSeconds: 620,
    durationLabel: "10:20",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-hedging-beta-skew.mp4",
    instructor: "Priya Raghunathan",
    instructorRole: "Quantitative Research Analyst",
    instructorInitials: "PR",
    visualType: "hedging_beta",
    summary:
      "When broader markets flash warning signs, selling everything triggers tax drag and emotional whiplash. Learn how institutional quants use beta-weighted short hedges and cash buffers.",
    chapters: [
      { time: 0, title: "00:00 - The Purpose of Hedging", description: "Protecting unrealized capital gains during macro market corrections." },
      { time: 130, title: "02:10 - Beta-Weighting Your Portfolio", description: "Calculating total portfolio sensitivity relative to the S&P 500." },
      { time: 280, title: "04:40 - Tactical Inverse ETFs vs. Cash", description: "Why cash is an active asset class that pays risk-free yield." },
      { time: 420, title: "07:00 - Hedging Crypto with Perp Funding Arbitrage", description: "Locking in dollar basis without closing core spot holdings." },
      { time: 530, title: "08:50 - De-Hedging at Structural Support", description: "Removing protective hedges as oversold extreme readings emerge." },
    ],
    takeaways: [
      "Cash is a position: holding 20-30% dry powder allows you to buy panics calmly.",
      "Beta weighting prevents under-hedging tech portfolios that move 2x faster than the index.",
      "Hedges are insurance policies, not profit centers; treat them as risk mitigation expenses.",
    ],
    quiz: {
      question: "If a tech portfolio has an aggregate Beta of 1.8, what happens when the S&P 500 drops 10%?",
      options: [
        "The portfolio is mathematically expected to drop approximately 18%",
        "The portfolio gains 10%",
        "The portfolio remains unchanged",
        "The broker automatically liquidates the portfolio",
      ],
      correctIndex: 0,
      explanation: "Beta measures sensitivity to the benchmark. A Beta of 1.8 means the portfolio experiences roughly 1.8 times the volatility of the benchmark index (10% * 1.8 = 18%).",
    },
  },

  // --- Module 5: Macro & Tech Cycles ---
  {
    id: "lesson-fed-liquidity-m2",
    title: "Lesson 17: Federal Reserve Liquidity, M2 Cycles & The Yield Curve",
    module: "Macro & Tech Cycles",
    level: "Intermediate",
    durationSeconds: 670,
    durationLabel: "11:10",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-fed-liquidity-m2.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "fed_liquidity",
    summary:
      "Stocks and crypto do not float in a vacuum: they float on a sea of global fiat liquidity. Learn how to track central bank balance sheets, Treasury General Account (TGA), and Reverse Repo flows.",
    chapters: [
      { time: 0, title: "00:00 - The Global Liquidity Engine", description: "Why money supply expansion explains 85% of multi-year equity returns." },
      { time: 140, title: "02:20 - Treasury General Account (TGA) Dynamics", description: "How government debt issuance drains bank reserves from Wall Street." },
      { time: 290, title: "04:50 - Reverse Repo Facility (RRP)", description: "Measuring excess cash moving into risk assets vs. overnight facilities." },
      { time: 450, title: "07:30 - The 2s10s Yield Curve Un-Inversion", description: "Why the steepest part of recessions occurs when the yield curve un-inverts." },
      { time: 570, title: "09:30 - Macro Dashboards for Everyday Traders", description: "The 3 public indicators to check every Monday morning." },
    ],
    takeaways: [
      "Net liquidity = Fed Balance Sheet - Treasury General Account (TGA) - Reverse Repo (RRP).",
      "When Net Liquidity is expanding, trend-following equity and crypto strategies have massive tailwinds.",
      "Yield curve inversion signals future stress, but the actual un-inversion is when market volatility strikes.",
    ],
    quiz: {
      question: "What happens to banking system liquidity when the Treasury General Account (TGA) rises significantly?",
      options: [
        "Liquidity is drained from commercial bank reserves, creating a headwind for risk assets",
        "All stocks immediately rise 20%",
        "The Federal Reserve cuts interest rates to zero",
        "Treasury bonds cease trading",
      ],
      correctIndex: 0,
      explanation: "A rising TGA represents cash absorbed from the private banking system into the government's account at the Fed, temporarily tightening private liquidity.",
    },
  },
  {
    id: "lesson-ai-capex-semis",
    title: "Lesson 18: Semiconductor & AI Capex Cycles: Hyperscaler Demand",
    module: "Macro & Tech Cycles",
    level: "Advanced",
    durationSeconds: 680,
    durationLabel: "11:20",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-ai-capex-semis.mp4",
    instructor: "Priya Raghunathan",
    instructorRole: "Quantitative Research Analyst",
    instructorInitials: "PR",
    visualType: "ai_capex",
    summary:
      "Deep dive into the second derivative of the AI infrastructure cycle. Learn how Microsoft, Alphabet, Amazon, and Meta capital expenditures dictate NVIDIA, Broadcom, and TSMC earnings.",
    chapters: [
      { time: 0, title: "00:00 - The AI Hardware Value Stack", description: "From silicon design (NVIDIA, AMD) to foundry (TSM) and packaging (CoWoS)." },
      { time: 140, title: "02:20 - Big Tech Capex Guidance Forensics", description: "Reading cloud infrastructure commitments in 10-Q filings." },
      { time: 300, title: "05:00 - Networking & Optical Interconnects", description: "Why Broadcom, Marvell, and Arista benefit from rack-scale clustering." },
      { time: 460, title: "07:40 - Power, Cooling & Datacenter Utilities", description: "How energy constraints shift investor capital to nuclear and power producers." },
      { time: 580, title: "09:40 - The Second Derivative Warning Sign", description: "Spotting when capex growth rates decelerate even as nominal dollars rise." },
    ],
    takeaways: [
      "Semiconductor stocks peak on the second derivative of growth (when the growth rate begins to slow), not at earnings troughs.",
      "Advanced packaging capacity (CoWoS at TSMC) is the critical bottleneck determining AI accelerator revenue.",
      "Datacenter power consumption creates multi-year secular tailwinds for clean utility providers (CEG, VST, NEE).",
    ],
    quiz: {
      question: "Why do institutional analysts obsess over 'second derivative' growth in semiconductor cycles?",
      options: [
        "Because stock multiples compress when growth deceleration begins, even if absolute profits remain record-high",
        "Because chips only operate in two mathematical dimensions",
        "Because taxes double in the second year of an investment",
        "Because dividends are paid on secondary derivatives",
      ],
      correctIndex: 0,
      explanation: "Markets are forward-looking discounting mechanisms. When year-over-year revenue growth decelerates from 100% to 50%, valuations contract even while profits expand.",
    },
  },
  {
    id: "lesson-earnings-playbook",
    title: "Lesson 19: Earnings Announcement Playbook: Implied Volatility & Gaps",
    module: "Macro & Tech Cycles",
    level: "Intermediate",
    durationSeconds: 600,
    durationLabel: "10:00",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-earnings-playbook.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "earnings_pead",
    summary:
      "Holding directional positions through earnings is binary roulette unless you understand options market implied move expectations, post-earnings announcement drift (PEAD), and guidance gaps.",
    chapters: [
      { time: 0, title: "00:00 - The Binary Risk of Earnings", description: "Why great quarterly numbers frequently result in 10% stock selloffs." },
      { time: 120, title: "02:00 - Calculating the Implied Move", description: "Using at-the-money straddles to measure market pricing of the print." },
      { time: 270, title: "04:30 - Post-Earnings Announcement Drift (PEAD)", description: "The academic market anomaly of institutional multimonth trend drift." },
      { time: 410, title: "06:50 - The Opening 30-Minute Range", description: "Trading the post-earnings gap and go versus gap and fade setups." },
      { time: 510, title: "08:30 - Live Execution Rules on Megacap Earnings", description: "Step-by-step checklist for earnings morning execution." },
    ],
    takeaways: [
      "Never gamble full position sizes into earnings blindly; implied volatility crush guarantees option buyer losses.",
      "Post-Earnings Announcement Drift allows you to buy the day AFTER a monster report with significantly lower risk.",
      "If a stock gaps up by more than the options implied move and holds the first 30-minute low, trend continuation is high.",
    ],
    quiz: {
      question: "What is Post-Earnings Announcement Drift (PEAD)?",
      options: [
        "The tendency for stocks with large positive earnings surprises to continue drifting upward for several weeks",
        "A technical software glitch during after-hours trading",
        "The fee charged by brokers for holding shares overnight",
        "The immediate crash that happens after every report",
      ],
      correctIndex: 0,
      explanation: "Institutions cannot buy their entire target allocation in a single day without moving price. PEAD represents sustained multi-week institutional accumulation following great earnings.",
    },
  },
  {
    id: "lesson-premarket-routine",
    title: "Lesson 20: Building Your Pre-Market Routine & Multi-Timezone Flow",
    module: "Macro & Tech Cycles",
    level: "Beginner",
    durationSeconds: 590,
    durationLabel: "09:50",
    videoUrl: "https://stream.nextwallstreet.com/academy/lesson-premarket-routine.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    instructorInitials: "DO",
    visualType: "premarket_flow",
    summary:
      "Consistency in trading stems directly from consistency in preparation. Build your complete 30-minute pre-market routine synchronizing Asia, London, and New York market sessions with NextWall Street.",
    chapters: [
      { time: 0, title: "00:00 - The 30-Minute Pre-Market Protocol", description: "Structuring your morning preparation before the opening bell." },
      { time: 120, title: "02:00 - Multi-Timezone Hand-Off (WIB, UTC, EST)", description: "How Asia closes influence European liquidity and New York tape openings." },
      { time: 260, title: "04:20 - Scanning the 118+ NextWall Street Universe", description: "Filtering for Top Score Gainers, Stance Upgrades, and ATR Breakouts." },
      { time: 400, title: "06:40 - Writing Your Daily Trade Plan", description: "Pre-defining exact 'If / Then' scenarios before market open." },
      { time: 500, title: "08:20 - Maintaining Peak Cognitive State", description: "Sleep, screen hygiene, and post-session trade debriefing." },
    ],
    takeaways: [
      "Review overnight economic prints and futures gaps 45 minutes before market open.",
      "Write down your entry, stop, and target in advance: never make trade decisions in heat of market action.",
      "Align with global session timings: London overlap (13:00-16:00 UTC) produces the highest liquidity of the day.",
    ],
    quiz: {
      question: "Why is an 'If / Then' trading plan essential before the opening bell?",
      options: [
        "It eliminates emotional hesitation and panic by pre-determining actions for any market outcome",
        "It guarantees that every trade will be profitable",
        "It satisfies government regulatory reporting rules",
        "It automates your tax filing",
      ],
      correctIndex: 0,
      explanation: "Having written 'If / Then' conditional rules allows you to execute with calmness and discipline regardless of how the opening market volatility behaves.",
    },
  },
];
