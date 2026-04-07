---
name: "Sameer Kashyap"
tagline: "I am graudate student at UC Santa Cruz researching AI systems. My research interests are in Scientific Computing and modelling, AI Safety and fairness, and Agentic AI systems. I previously worked as SDE-II full stack mobile engineer and love building rich user experiences."
location: "San Francisco / Santa Cruz, California"
email: "ssudars1@ucsc.edu"
github: "https://github.com/sameeerkashyap"
linkedin: "https://www.linkedin.com/in/sameer-kashyap-083a89184/"
twitter: "https://twitter.com/sameeerkashyap"
scholar: "https://scholar.google.com/citations?user=sameerkashyap"
stickyBanner: "Hiring for AI roles ? Let's chat! Get my resumé ->"
stickyBannerLink: "https://drive.google.com/file/d/1IpJnyL4Uo7TlsJvLeqAbowLNzS0AQh8Q/view?usp=sharing"

education:
  - degree: "M.S in Computer Science & Engineering"
    institution: "University of California, Santa Cruz"
    location: "Santa Cruz, CA"
    period: "September 2025 – June 2027"

skills:
  languages:
    - Python
    - JavaScript
    - TypeScript
    - Java
    - Dart
    - Solidity
    - Julia
  ai:
    - PyTorch
    - Agentic AI
    - RAG
    - Generative-AI
    - LLM Fine-tuning
    - LangChain
  frontend:
    - React
    - Next.js
    - Flutter
    - React Native
  backend:
    - Node.js
    - Express.js
    - Django
    - RESTful APIs
    - GraphQL
  databases:
    - MongoDB
    - PostgreSQL
    - MySQL
    - Redis
    - Vector Databases
  infrastructure:
    - AWS
    - Google Cloud
    - Docker
    - Kubernetes
    - CI/CD
    - Terraform

researchInterests:
  - "Scientific Machine Learning"
  - "Agentic AI & LLM Systems"
  - "AI Safety and Fairness"
  - "Computational Sciences"

about: "I am a computational researcher and software engineer focused on the intersection of scientific machine learning, agentic AI, and large-scale simulation. My current work involves modeling planetary-scale thermodynamic systems for Mars terraforming using PyTorch-based differential equation solvers. Previously, I built production systems at scale — from LLM-driven server-driven UI frameworks to offline-first mobile architectures serving millions of users."

currentWork:
  title: "Terraforming Mars — Planetary Simulation with Scientific ML"
  description: "My current research focused on building a PyTorch-based differential equation simulator projecting the energy requirements to achieve habitable surface conditions on Mars."
  concept: "Using ODEs and physics-informed neural networks to model coupled atmospheric, thermal, and chemical dynamics of Mars terraforming. The simulator aims to become a platform for simulating energy cost required, biological impact and chemical simulations required to make Mars habitable."
  progress: "A core framework consisting of celestial abstractions and a time-controller engine that models temperature, pressure, and ice-mass variations across a Martian year at three points (North Pole, South Pole, and Equator) using a coupled ODE system and Runge-Kutta integration."
  reading:
    - "[The case for Mars terraforming research:](https://www.nature.com/articles/s41550-025-02548-0)"
    - "[How to create an artificial magnetosphere for Mars:](https://www.sciencedirect.com/science/article/abs/pii/S0094576521005099)"
    - "[Neural ODEs by Chen et al.](https://arxiv.org/abs/1806.07366)"
    - "[Feasibility of keeping Mars warm with nanoparticles](https://www.science.org/doi/epdf/10.1126/sciadv.adn4650)"
    - "[The radiation environment on the surface of Mars](https://www.sciencedirect.com/science/article/abs/pii/S2214552417300111)"
  tags:
    - PyTorch
    - Neural ODE
    - Scientific ML
    - Planetary Science

researchExperience:
  - title: "Graduate Researcher"
    institution: "UC Santa Cruz"
    location: "Santa Cruz, CA"
    period: "October 2025 – Present"
    description: "Engineered a PyTorch-based differential equation Mars terraforming simulator projecting 10⁴⁰ and 10²⁶ J to achieve 0°C mean surface temperature and 20 Pa O₂ partial pressure within one Martian year. Developed a self-refining Prolog system integrating LangChain, LangGraph, and RAG to enable iterative logic tracing in LLM pipelines, improving logical output interpretability from natural language by 40%."
    tags:
      - PyTorch
      - Neural ODE
      - LangChain
      - RAG
      - Prolog

workExperience:
  - title: "Software Development Engineer II"
    company: "Acko"
    location: "Bengaluru, KA"
    period: "Apr 2024 – Aug 2025"
    startDate: "2024-04"
    endDate: "2025-08"
    description: "Built Acko's Server-Driven UI engine from scratch, shipped an offline-first Service OS app, overhauled the traffic violation payments flow, and wired up a cache layer that cut redundant API calls by two-thirds."
    detailedDescription: "One of the things I'm most proud of at Acko is building Server-Driven UI from the ground up — not just the client-side parser, but also the middleware layer. The idea was that product teams should be able to ship a new screen without ever touching the app binary. We defined the UI contract in Protobuf, and I built the Flutter parsing framework that consumed those definitions and rendered fully interactive screens on the fly. What used to be a 2-week release cycle — code, review, build, ship, wait for store approval — became a 3-minute config push. That shift fundamentally changed how fast the team could move.\n\nThe Service OS app was a different beast entirely. It's a field-agent tool used by Acko's on-ground teams to inspect vehicles, capture claims media, and submit reports, all from a phone in some pretty rough network conditions. I built it to be offline-first: media gets compressed on-device before any upload attempt, background sync is handled via Android Foreground Service and iOS BGTaskScheduler so uploads don't die when the agent switches apps. Image and video sizes dropped by 85%, and load times got 20% faster even on spotty connections.\n\nThe traffic violation payments feature was a fun one — it involved injecting JavaScript into a government web portal via a WebView, bridging responses back to native Flutter, and managing some pretty gnarly state across the payment funnel. Long story short: purchase funnel completions went up 73%.\n\nOn the infrastructure side, I built a Cache Manager module that sits between the app and the network layer. It deduplicates in-flight requests, serves images from disk LRU cache, and persists enough state that our analytics pipeline can reconstruct sessions even when the user goes offline mid-flow. API call volume dropped by 65% and we got much richer offline analytics as a bonus."
    highlights:
      - "Built Server-Driven UI engine end-to-end — Protobuf contracts + Flutter parser — slashing feature release from 2 weeks to 3 minutes"
      - "Shipped offline-first Service OS app with on-device media compression (85% size reduction) and background sync via Android Foreground Service / iOS BGTaskScheduler"
      - "Overhauled traffic violation payments with JS injection + native interoperability, boosting funnel completion by 73%"
      - "Engineered Cache Manager reducing API calls by 65% and enabling richer offline analytics"
    tags:
      - Flutter
      - Server-Driven UI
      - Protobuf
      - Android
      - iOS
      - Offline-First

  - title: "Software Development Engineer I"
    company: "Acko"
    location: "Bengaluru, KA"
    period: "Nov 2022 – Apr 2024"
    startDate: "2022-11"
    endDate: "2024-04"
    description: "Built Acko's emergency assist flow end-to-end, launched AckoDrive (a car marketplace module) that drove 600+ new users in two weeks, scaled developer tooling, and led the mobile engineering guild."
    detailedDescription: "My first big project at Acko was the Emergency Assist flow — basically, if you're in a car accident, this feature is what connects you to an ambulance, a tow truck, or a claims agent. The problem was that we were depending on third-party service APIs that had wildly inconsistent response times and SLAs. Some would hang for 30 seconds, others would return junk data. I built the integration using a combination of long polling, async queues, and a pub-sub pattern so the UI stayed responsive no matter what the back end was doing. Retry logic with circuit breakers made sure we didn't hammer failing services. Emergency response time went down by 20% and we cut out a lot of the manual overhead in the ambulance booking workflow.\n\nAckoDrive was a greenfield project — a car marketplace embedded inside the insurance app. I owned the mobile module end-to-end: contract design with the backend team, the Flutter UI, and the real-time analytics tracking that let us iterate on the funnel daily. Within two weeks of launch we had 600+ new user sign-ups and a 400% spike in qualified leads. That kind of early traction in a crowded space felt really good.\n\nAside from product work, I spent a meaningful chunk of time improving how the team operated. I wrote detailed architecture docs that cut onboarding time for new engineers by 75%. I ran 5+ mobile engineering guild sessions on topics like SDK performance profiling, state management patterns in Flutter, and modular architecture. I also introduced local LLMs and agentic coding workflows to the team, which automated a surprising amount of the boilerplate-heavy stuff and freed people up for more interesting problems.\n\nOn the maintenance side, I kept the Android and iOS codebases healthy — managing API deprecations across major Flutter upgrades, enforcing standards through CI pipelines, linting configs, and branch protection rules."
    highlights:
      - "Built Emergency Assist flow using polling, async queues, and pub-sub with circuit-breaker retry — cut emergency response time by 20%"
      - "Launched AckoDrive car marketplace module — 600+ user acquisitions and 400% spike in qualified leads within 2 weeks"
      - "Accelerated developer onboarding by 75% through system architecture docs and workflow guides"
      - "Led mobile engineering guild with 5+ forums on SDK performance, state management, and modular design"
      - "Introduced agentic AI and local LLM workflows to automate code tasks across the team"
    tags:
      - Flutter
      - Android
      - iOS
      - Async Systems
      - Agentic AI


  - title: "Software Engineer"
    company: "FrontRow"
    location: "Bengaluru, KA"
    period: "Aug 2021 – Oct 2022"
    startDate: "2021-08"
    endDate: "2022-10"
    description: "Shipped 30+ features on a live learning app that grew from 700K to 2.2M users in 8 months — worked across the full product surface from onboarding to monetization to retention."
    detailedDescription: "FrontRow was moving fast — the kind of fast where you're shipping multiple features a week and watching the numbers move in real time. Over 14 months I built 30+ features across the app, spanning onboarding flows, live class experiences, user management, and the monetization layer. Watching the user base go from 700K to 2.2M in that window was genuinely exciting.\n\nThe biggest thing I was part of was building the Premium subscription feature. This was the main revenue lever for the business, and getting it right meant thinking carefully about the paywall experience, trial flows, and how we surfaced value to users before asking them to pay. It ended up hitting 1M ARR — a milestone the team had been chasing for a while.\n\nA lot of my energy went into the Freemium live session experience. The core problem was that users were dropping out of free classes before they could experience the value that might convert them. I ran a series of iterative experiments — tweaking entry points, session previews, social signals — and we got to a 120% improvement in Freemium retention and roughly doubled organic premium conversions as a result.\n\nI also owned the onboarding rework. The original flow had too many steps and too little immediacy. After tightening it up — fewer screens, faster time-to-value, better personalization — drop-off rates fell 60-70%. On the architecture side, I co-designed the Freemium class validation system and the user blocking feature, both of which contributed to a 200% jump in 60-minute retention for free classes."
    highlights:
      - "Shipped 30+ features contributing to user growth from 700K → 2.2M in 8 months"
      - "Built the Premium subscription feature, achieving 1M ARR"
      - "Improved Freemium live session retention by 120%, doubling organic premium conversions"
      - "Reduced onboarding drop-off by 60-70% through iterative UX improvements"
      - "Co-architected Freemium class validation and user blocking — 200% increase in 60-min retention"
    tags:
      - React Native
      - Mobile
      - Product
      - Freemium

publications:
  - title: "Explainable AI for Wildfire Management and Ecological Sustainability"
    venue: "Artificial Intelligence for Sustainability, IJCAI 2025"
    status: "Accepted"
    year: 2025

  - title: "A Comparative Review on Adaptive and Explainable Ensemble Learning for Email Phishing Detection"
    venue: "16th International IEEE Conference on Computing, Communication and Networking Technologies (ICCCNT) 2025"
    status: "Published"
    year: 2025

  - title: "Modeling the Chaotic Lorenz ODE System using Scientific Machine Learning"
    venue: "ArXiv arXiv:2410.06452"
    link: "https://arxiv.org/abs/2410.06452"
    status: "Preprint"
    year: 2024

projects:
  - title: "Democratic Agents"
    description: "Multi-agent legislative simulation powered by LangGraph. Real congressional profiles (100 Senators, 436 House members, 25 Executive, 9 SCOTUS) are loaded as heuristic data and injected into LLM agents that debate and vote in character — with vote direction computed from a 15-dimension issue alignment engine, not the LLM."
    tags:
      - Python
      - LangGraph
      - Multi-Agent
      - LLM
      - Political Simulation
    link: "https://github.com/sameeerkashyap/assembly-agents"

  - title: "Hail Mary Simulation"
    description: "GPU-accelerated physics simulation of the Hail Mary's journey from Earth to Tau Ceti, written in C++20 with Metal compute shaders and a WebGPU browser port. Simulates 2M Astrophage particles, a brachistochrone trajectory with special relativity, N-body orbital mechanics, and a live mission control dashboard."
    tags:
      - C++20
      - Metal
      - WebGPU
      - Physics Simulation
      - Apple Silicon
    link: "https://github.com/sameeerkashyap/hailmary"

  - title: "Martians"
    description: "OpenEnv-compatible RL environment simulating Mars habitability. A language model agent (DeepSeek-R1-Distill-Qwen-1.5B) applies discrete terraforming actions each step, guided by a 15-dimensional physical state vector, reaching habitability ≥ 0.80 within 13–22 steps across all episodes."
    tags:
      - Python
      - Reinforcement Learning
      - LLM Agent
      - OpenEnv
      - DeepSeek
    link: "https://github.com/sameeerkashyap/martens"

  - title: "locus.ai 🧬"
    description: "Fine-tuned Qwen2.5-3B-Instruct with QLoRA on 6,000 curated Q&A pairs from GO-CC and Human Protein Atlas. Improved subcellular location accuracy from 35% to 73% and reduced hallucination rate from 34% to 11%. Served via a Node.js inference server using node-llama-cpp at <300ms latency."
    tags:
      - Python
      - LLM Fine-tuning
      - QLoRA
      - Bioinformatics
      - Node.js
    link: "https://github.com/sameeerkashyap/locus.ai"

  - title: "CTD-FusionNet Deepfake Detection"
    description: "Designed multi-branch deepfake detection model fusing RGB, noise residuals, and transformer features. Achieved 99.4% AUC, 96.4% accuracy, and 0.961 F1-score."
    tags:
      - Python
      - PyTorch
      - Computer Vision
      - Attention
    link: "https://github.com/sameeerkashyap/ctd-fusionnet-deepfake-detection"

  - title: "Molecular Frames"
    description: "High-performing React frontend for interactive molecular dynamics visualization of complex proteins with WebGPU and Three.js. WebGPU-accelerated rendering boosted FPS by 2.5x for 10k+ atom structures."
    tags:
      - React
      - Three.js
      - WebGPU
      - Molecular Dynamics
    link: "https://github.com/sameeerkashyap/molframes"

blog:

recommendedReading:
  - title: "Project Hail Mary"
    author: "Andy Weir"
    description: "A lone astronaut must save the earth from disaster in this gripping interstellar adventure."
    link: "https://www.amazon.com/Project-Hail-Mary-Andy-Weir/dp/0593135202"

  - title: "The Almanack of Naval Ravikant"
    author: "Eric Jorgenson"
    description: "A guide to wealth and happiness, collecting the wisdom of Naval Ravikant."
    link: "https://www.amazon.com/Almanack-Naval-Ravikant-Wealth-Happiness/dp/1544514212"

  - title: "The Psychology of Money"
    author: "Morgan Housel"
    description: "Timeless lessons on wealth, greed, and happiness doing well with money."
    link: "https://www.amazon.com/Psychology-Money-Timeless-lessons-happiness/dp/0857197681"

  - title: "The Future of Humanity"
    author: "Michio Kaku"
    description: "Exploring our future in space, from terraforming Mars to interstellar travel."
    link: "https://www.amazon.com/Future-Humanity-Terraforming-Interstellar-Immortality/dp/0525589539"

  - title: "Thirty Years That Shook Physics"
    author: "George Gamow"
    description: "The story of quantum theory, capturing the great intellectual revolution of the 20th century."
    link: "https://www.amazon.com/Thirty-Years-Physics-Dover-Books/dp/048624895X"

  - title: "Dark Matter"
    author: "Blake Crouch"
    description: "A mind-bending thriller about choices, paths not taken, and how far we'll go to claim the lives we dream of."
    link: "https://www.amazon.com/Dark-Matter-Novel-Blake-Crouch/dp/1101904224"

  - title: "Thinking, Fast and Slow"
    author: "Daniel Kahneman"
    description: "The definitive exploration of the two systems that drive the way we think."
    link: "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555"

  - title: "Elon Musk"
    author: "Ashlee Vance"
    description: "Tesla, SpaceX, and the Quest for a Fantastic Future."
    link: "https://www.amazon.com/Elon-Musk-SpaceX-Fantastic-Future/dp/0062301233"

personalInterests:
  - "PADI Advanced Open Water Diver"
  - "Surfer"
  - "Triathlete"
  - "Ocean & Nature Lover"
  - "Reading Science Fiction"
  - "Love Cooking"

personalImages:
  - src: "/images/personal/0.jpg"
    alt: "Golden Gate, San Francisco 🌉"
  - src: "/images/personal/1.png"
    alt: "Netrani, Karnataka"
  - src: "/images/personal/4.jpg"
    alt: "Cowell, Santa Cruz 🏄"
  - src: "/images/personal/3.jpg"
    alt: "UCSC Triathlete"
  - src: "/images/personal/2.jpg"
    alt: "Soccer 💜"
  - src: "/images/personal/5.jpg"
    alt: "Laguna Beach, Los Angeles"
  - src: "/images/personal/6.jpg"
    alt: "Santa Cruz Wharf"
  - src: "/images/personal/9.jpg"
    alt: "Protien meals"
  - src: "/images/personal/8.jpg"
    alt: "Mulki, Karnataka"
  - src: "/images/personal/7.png"
    alt: "Dixon's Pinacle, Andaman Islands"
---
