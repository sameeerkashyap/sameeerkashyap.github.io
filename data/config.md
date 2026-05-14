---
name: "Sameer Kashyap"
tagline: "I am graduate student at UC Santa Cruz. My research interests are in World models, Scientific Computing and modelling, Agentic AI systems, and AI Safety and fairness. I previously worked as SDE-II full stack mobile engineer and love building rich user experiences."
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
  title: "Terraforming Mars"
  description: "My current research focuses on building a PyTorch-based differential equation simulator to estimate the energy requirements for creating habitable surface conditions on Mars."
  concept: "I’m using ODEs and physics-informed neural networks to model coupled atmospheric, thermal, and chemical dynamics on Mars. The simulator is intended to serve as a platform for studying the energy cost, biological impact, and chemical transformations involved in making Mars more habitable."
  progress: "I’ve built a core framework with celestial abstractions and a time-controller engine that tracks temperature, pressure, and ice-mass variations across a Martian year at three locations: the North Pole, South Pole, and Equator. The model uses a coupled ODE system with Runge-Kutta integration, and I’m now extending it toward intervention policy exploration using CFGs to test temperature-raising strategies, compare different forcing schedules, and study how controllable inputs might shift the climate trajectory over time."
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
    description: "I’m currently working on research at UC Santa Cruz focused on scientific machine learning, world models, and AI systems that can reason more reliably. One part of the work is a PyTorch-based Mars terraforming simulator built around differential equations and thermodynamic surface physics, where I explored what it would take to move a Martian environment toward 0°C mean surface temperature and 20 Pa O₂ partial pressure over a Martian year. I’m also building a self-refining Prolog system that combines LangChain, LangGraph, and RAG to support iterative logic tracing in LLM pipelines, which has improved the interpretability of natural language reasoning by 40%. Alongside that, I’m continuing to explore Neural ODEs, AI safety, alignment, and automated multi-agent systems."
    highlights:
      - "Built a PyTorch-based Mars terraforming simulator using differential equations and thermodynamic surface physics to estimate energy requirements"
      - "Developed a self-refining Prolog system with LangChain, LangGraph, and RAG to support iterative logic tracing in LLM pipelines, improving interpretability by 40%"
      - "Researching scientific ML, Neural ODEs, AI safety, alignment, and automated multi-agent systems"
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
    description: "At Acko, I built the server-driven UI engine from scratch, shipped an offline-first Service OS app, improved the traffic violation payments flow, and introduced a cache layer that cut redundant API calls by two-thirds. A lot of my work sat at the intersection of product engineering and infrastructure, so I spent as much time thinking about UX and rollout speed as I did about architecture. It was a role where I got to own features end to end and make systems that were both fast to ship and robust in production."
    detailedDescription: "One of the projects I’m most proud of at Acko was building the Server-Driven UI system from the ground up. That meant owning not just the client-side parser, but also the middleware layer that made it possible for product teams to launch new screens without shipping a new app binary. We defined the UI contract in Protobuf, and I built the Flutter parsing framework that could consume those definitions and render fully interactive screens dynamically. What used to take around two weeks — code, review, build, ship, and wait for app store approval — became a matter of minutes, which completely changed the team’s release velocity.\n\nAnother major effort was the Service OS app, which was used by field agents working in difficult network conditions to inspect vehicles, capture claims media, and file reports. I designed it to work offline first, with on-device media compression before upload and background sync handled through Android Foreground Service and iOS BGTaskScheduler so that uploads would keep going even if the app was backgrounded. That work reduced image and video sizes by 85% and improved load times by 20% on unreliable connections.\n\nI also worked on the traffic violation payments flow, where I had to bridge a government web portal with native Flutter using JavaScript injection and manage a fairly complex payment state machine across the funnel. That led to a 73% improvement in purchase funnel completions. On the infrastructure side, I built a Cache Manager module between the app and the network layer that deduplicated in-flight requests, served images from a disk LRU cache, and persisted enough state for analytics to reconstruct offline sessions. That reduced API call volume by 65% and improved our offline analytics substantially."
    highlights:
      - "Built the Server-Driven UI engine end to end with Protobuf contracts and a Flutter parser, reducing feature release time from 2 weeks to 3 minutes"
      - "Shipped an offline-first Service OS app with on-device media compression that reduced file size by 85% and background sync via Android Foreground Service and iOS BGTaskScheduler"
      - "Improved the traffic violation payments flow with JS injection and native Flutter interoperability, increasing funnel completion by 73%"
      - "Designed a Cache Manager that reduced API calls by 65% and enabled richer offline analytics"
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
    description: "During my time as an SDE I at Acko, I worked on customer-facing product flows, internal engineering tooling, and mobile architecture improvements. My first major project was the Emergency Assist flow, where I helped design the experience end to end for users who needed quick access to ambulances, tow trucks, or claims support after an accident. I also launched AckoDrive, a car marketplace module inside the insurance app, and worked on team-level improvements like onboarding docs, engineering guild sessions, and LLM-assisted development workflows."
    detailedDescription: "My first big project at Acko was the Emergency Assist flow, which connected customers in accident scenarios to services like ambulances, tow trucks, or claims agents. The challenge was that we depended on third-party APIs with inconsistent latency and reliability, so I built the integration using long polling, async queues, and a pub-sub pattern to keep the UI responsive no matter what happened in the backend. I also added retry logic and circuit breakers so the system could recover gracefully without hammering failing services. That reduced emergency response time by 20% and removed a lot of manual overhead from the ambulance booking flow.\n\nAnother project I led was AckoDrive, a greenfield car marketplace embedded inside the insurance app. I owned the mobile module end to end — from contract design with backend teams to the Flutter UI and real-time analytics tracking that let us iterate on the funnel quickly. Within two weeks of launch, we saw 600+ new user sign-ups and a 400% increase in qualified leads, which was a strong early signal that the product had real demand.\n\nOutside direct product work, I spent a good amount of time improving how the team built software. I wrote architecture docs that reduced onboarding time for new engineers by 75%, ran more than five mobile engineering guild sessions on topics like SDK performance, state management, and modular architecture, and introduced local LLMs and agentic coding workflows to reduce repetitive engineering work. I also helped keep the Android and iOS codebases healthy through Flutter upgrades, API deprecations, CI enforcement, linting, and branch protection rules."
    highlights:
      - "Built the Emergency Assist flow with polling, async queues, and pub-sub plus circuit-breaker retry logic, cutting emergency response time by 20%"
      - "Launched AckoDrive, driving 600+ user acquisitions and a 400% spike in qualified leads within 2 weeks"
      - "Reduced onboarding time by 75% through architecture docs and workflow guides"
      - "Led 5+ mobile engineering guild sessions on SDK performance, state management, and modular design"
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
    description: "At FrontRow, I worked on a fast-moving learning product and shipped more than 30 features across onboarding, live classes, monetization, and retention. The app grew from 700K to 2.2M users in just eight months, so a lot of the work was about improving the product surface quickly while keeping the experience stable and meaningful for users."
    detailedDescription: "FrontRow was the kind of environment where you could see the impact of your work almost immediately. Over the course of 14 months, I built and shipped 30+ features across the app, covering everything from onboarding flows and live class experiences to user management and monetization. It was exciting to work on a product that was growing so quickly and to watch the user base scale from 700K to 2.2M in that period.\n\nOne of the biggest projects I worked on was the Premium subscription feature, which became the main revenue lever for the business. That meant thinking carefully about how we designed the paywall, structured trial flows, and communicated value before asking users to upgrade. The work ultimately helped the product reach 1M ARR, which was a major milestone for the team.\n\nA lot of my focus also went into the Freemium live session experience. The challenge there was that users were dropping out of free classes before they could really see the value of the product. I ran iterative experiments across entry points, session previews, and social signals, and those changes led to a 120% improvement in Freemium retention and roughly doubled organic premium conversions.\n\nI also owned the onboarding rework, where the goal was to reduce friction and get users to value faster. By simplifying the flow, cutting unnecessary steps, and improving personalization, I helped bring drop-off down by 60–70%. On the architecture side, I co-designed the Freemium class validation system and the user blocking feature, both of which contributed to a 200% increase in 60-minute retention for free classes."
    highlights:
      - "Shipped 30+ features contributing to user growth from 700K to 2.2M in 8 months"
      - "Built the Premium subscription feature, helping achieve 1M ARR"
      - "Improved Freemium live session retention by 120%, which doubled organic premium conversions"
      - "Reduced onboarding drop-off by 60–70% through iterative UX improvements"
      - "Co-architected Freemium class validation and user blocking, leading to a 200% increase in 60-minute retention"
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
    alt: "Triathlete"
  # - src: "/images/personal/2.jpg"
  #   alt: "Soccer 💜"
  - src: "/images/personal/5.jpg"
    alt: "Laguna Beach, Los Angeles"
  - src: "/images/personal/6.jpg"
    alt: "Santa Cruz Wharf"
  # - src: "/images/personal/9.jpg"
  #   alt: "Protien meals"
  - src: "/images/personal/8.jpg"
    alt: "Mulki, Karnataka"
  - src: "/images/personal/7.png"
    alt: "Dixon's Pinacle, Andaman Islands"
---
