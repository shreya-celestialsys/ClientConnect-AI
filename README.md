# B2B ClientConnect AI: Deep Market Intelligence

B2B ClientConnect AI is a high-precision discovery engine designed to build business pipelines using real-time market data. It identifies SMEs, startups, and niche players aligned with your specific business profile and target territories.

## 🛠 Tech Stack

### AI & Intelligence (Google Tools)
- **Google Gemini API (`gemini-3-flash-preview`)**: Powering the core reasoning engine for lead identification and strategic fit analysis.
- **Google Search Grounding**: Utilizes the `googleSearch` tool to ground AI responses in real-time web data, ensuring leads are active and verifiable.
- **@google/genai SDK**: Modern, high-performance integration with Google's latest models.

### Frontend Architecture
- **React 19**: Modern UI with specialized state management for lead persistence.
- **TypeScript**: Robust typing for complex B2B data structures.
- **Tailwind CSS**: A "glass-morphism" inspired design system for a premium enterprise feel.
- **Lucide React**: Specialized iconography for business intelligence.

## ✨ Key Features

1. **Regional Territory Scout**: Define specific geographic targets (e.g., "California", "Western Europe", "Singapore") to localize the AI's search behavior.
2. **Infinite Lead Discovery**: The "Load More" mechanism triggers fresh real-time searches, automatically excluding previously found companies to ensure a unique pipeline.
3. **Persistent CRM Dashboard**:
   - **Non-Destructive Navigation**: Move between "Configuration" and "Dashboard" freely. Your leads and "Marked Client" statuses are preserved in local storage.
   - **Interactive Status**: Star a lead to move them to your "Clients" list, instantly updating your outreach filters.
   - **Search Grounding Traceability**: Every lead includes research sources (URLs) used by the AI to verify its existence.
4. **Strategic Fit Analysis**: The AI provides a customized "Why Fit" reasoning for every lead, explaining the synergy between their operations and your services.

## 🚀 How it Works

1. **Company Profile**: Define your identity, industry, and core value proposition.
2. **Targeting**: Add niche keywords and specific geographic regions where you want to find clients.
3. **Deep Scout**: The AI performs a grounded search, identifying companies that meet your criteria.
4. **Pipeline Management**: Review leads, mark your existing clients to filter them out of prospects, and load more results as your team expands.

## 💾 Local Persistence
The app uses browser LocalStorage to keep your profile and lead list safe. You can close the tab and return later to find your scouted data exactly where you left it. Use the **Reset** button in the header to clear all data and start a completely new campaign.
