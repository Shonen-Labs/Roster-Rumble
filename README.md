# Fantasy Sports Platform 🏆⚡

**A scalable, real-time fantasy sports platform with automated scoring and rewards**

## 📖 Overview  
A competitive fantasy sports platform where users:  
✅ Create virtual teams from real-world players  
✅ Compete in contests based on live match events  
✅ Track real-time leaderboards with dynamic scoring  
✅ Win rewards through transparent ranking systems  

## 🚀 Key Features  
- **Team Builder**  
  - Position-based selection with budget constraints  
  - Rule validation engine (composition limits, player eligibility)  
  - Saved team templates & performance history  

- **Live Scoring System**  
  - Event-driven score updates (every ball/play/minute)  
  - Multiplier logic (captain/vice-captain bonuses)  
  - Dispute resolution system for score corrections  

- **Contest Engine**  
  - Public/private contest creation  
  - Automated prize distribution  
  - Waitlist management & contest merging  

- **User System**  
  - Wallet integration (deposits/withdrawals)  
  - KYC verification pipeline  
  - Activity feed & achievement badges  

## 🛠️ Tech Stack  
**Frontend**  
- React.js + TypeScript  
- WebSocket client for real-time updates  
- Chart.js for performance analytics  

**Backend**  
- Spring Boot (Java) & Node.js microservices  
- PostgreSQL + Redis (caching)  
- Kafka for event streaming  
- Elasticsearch for player/search  

**Infra**  
- Docker + Kubernetes  
- AWS EC2/EKS  
- Prometheus + Grafana monitoring  

## 📐 Architecture  
```plaintext
┌─────────────┐     ┌──────────────┐     ┌─────────────┐  
│   React     │◄───►│  API Gateway │◄───►│  User Mgmt  │  
│  Frontend   │     │ (Rate Limit, │     │  Service    │  
└─────────────┘     │   Auth)      │     └─────────────┘  
                        ▲  ▲  ▲          
        ┌───────────────┘  │  └───────────────┐  
┌───────▼──────┐  ┌───────▼──────┐  ┌────────▼────────┐  
│  Contest      │  │  Team        │  │  Scoring       │  
│  Service      │  │  Service     │  │  Engine        │  
└───────┬───────┘  └───────┬──────┘  └────────┬────────┘  
        │                   │                  │          
┌───────▼───────────────────▼──────────┬───────▼────────┐  
│          PostgreSQL                  │     Redis      │  
│        (Main Database)               │   (Caching)    │  
└──────────────────────────────────────┴────────────────┘  
```

## 🛠️ Installation  
1. Clone repo:  
```bash 
git clone https://github.com/yourusername/fantasy-platform.git
cd fantasy-platform
```

2. Configure environment:  
```bash
cp .env.example .env
# Set values in .env for:  
# - Database credentials  
# - JWT secret key  
# - Payment gateway keys  
```

3. Start services:  
```bash
# Backend 
mvn clean install  
docker-compose up -d

# Frontend
cd frontend
npm install
npm run dev
```

## 📚 API Documentation  

| Service          | Endpoint                     | HTTP Method | Links to Smart Contract?          | Contract Function (Cairo)     |
|------------------|------------------------------|-------------|------------------------------------|-------------------------------|
| **Auth**         | `/auth/nonce`                | POST        | ❌ No                              | -                             |
|                  | `/auth/verify`               | POST        | ❌ No                              | -                             |
| **Contest**      | `/contests`                  | GET         | ❌ No                              | -                             |
|                  | `/contests`                  | POST        | ❌ No (Admin-only setup)           | -                             |
|                  | `/contests/:id/join`         | POST        | ✅ Yes                             | `PrizePool.lock_entry_fee`*   |
| **Team**         | `/teams`                     | POST        | ✅ Yes                             | `TeamValidation.validate_team`|
|                  | `/teams/:userId`             | GET         | ❌ No                              | -                             |
| **Scoring**      | `/scores/live`               | GET (WS)    | ❌ No (Uses Redis cache)           | -                             |
|                  | `/scores/sync`               | POST        | ✅ Yes (Indirect via workers)      | `ScoringEngine.update_score`  |

---

### **Smart Contract Endpoints (Cairo Functions)**  
| Contract            | Function                  | Called By                             | Linked API Endpoint(s)                |
|---------------------|---------------------------|---------------------------------------|----------------------------------------|
| **TeamValidation**  | `validate_team`           | Team Service (on team submission)     | `POST /teams`                          |
| **ScoringEngine**   | `update_score`            | Python Data Worker (via RabbitMQ)     | `POST /scores/sync` (indirect trigger) |
| **PrizePool**       | `lock_entry_fee`*         | Contest Service (on contest join)     | `POST /contests/:id/join`              |
|                     | `distribute_prizes`       | Backend (automated payout trigger)    | Internal process (no direct API link)  |

---

### **Key Linkages**  
1. **Team Submission**  
   - `POST /teams` → Calls `TeamValidation.validate_team` to verify team rules on-chain.  

2. **Contest Join**  
   - `POST /contests/:id/join` → Interacts with `PrizePool.lock_entry_fee` (hypothetical function) to lock entry fees in escrow.  

3. **Live Scoring**  
   - `POST /scores/sync` → Python worker processes data and triggers `ScoringEngine.update_score` via RabbitMQ.  

4. **Payout Automation**  
   - Backend triggers `PrizePool.distribute_prizes` after match ends (no direct API endpoint).  

---

### Notes:  
- The `PrizePool.lock_entry_fee` function is implied in the workflow (not explicitly shown in the Cairo example) but would handle fee locking.  
- `PrizePool.distribute_prizes` is called internally after Chainlink confirms match results.  
- WebSocket (`/scores/live`) reflects data updated by `ScoringEngine` contract but doesn’t directly invoke it.  

This mapping ensures **on-chain validation** for critical actions (team submission, prize distribution) while keeping non-critical paths (auth, data fetching) off-chain for speed.


## 📜 License  
MIT License - See [LICENSE](https://opensource.org/license/mit) for details.

---

**🏆 Start building your fantasy sports empire today!**  
```
