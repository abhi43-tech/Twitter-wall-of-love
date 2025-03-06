# Twitter wall of love

### Features:

- User authentication (Signup, Login, API Key)
- Create and manage multiple Walls
- Add tweets by pasting links (auto-fetch details)
- Reorder or randomize tweets
- Customizable Wall settings (Title, Logo, Social Links)
- Public sharable link & iframe embedding
- Responsive grid-based tweet display
- API-first approach for full feature access
- Daily cron job to update like & comment counts

Example: https://www.relume.io/community-love

# 🚀 Twitter/X Wall of Love – Feature List

## **🔐 User Authentication & Access**

- Sign up/Login using Email & Password (or Twitter OAuth)
- Password reset via email
- API token generation for programmatic access

## **🛠️ Wall Management (Admin Panel & API)**

- Create and manage multiple Walls
- Customize Wall settings:
    - Title
    - Company/Product Logo
    - Social Media Links (Twitter, LinkedIn, Instagram, etc.)
- Public/Private toggle for Wall visibility
- Generate **public sharable link** for direct access
- Embed Wall into websites using **iframe link**

## **📝 Tweet Management**

- Add tweets by **pasting tweet link** (auto-fetch details via Twitter API)
- Display fetched details including:
    - Tweet content
    - Author Name & Profile Image
    - Profile link
    - Like Count & Comment Count
- Manage order of tweets:
    - Drag & Drop reordering
    - Option for **randomized order**
- Remove unwanted tweets from Wall

## **🌍 Public Wall Page (Frontend UI)**

- Fully **responsive** design (mobile & desktop friendly)
- **Header Section**:
    - Displays Company/Product Logo
    - Displays Wall Title
- **Tweet Display Section**:
    - Grid/Bento layout for tweets
    - Shows tweet content, author details, like & comment counts
    - Auto-updates tweet engagement metrics
- **Footer Section**:
    - Displays Social Media Links from Wall settings

## **🛡️ API Features (API-First Design)**

- API endpoints for all features
- User authentication via API
- Create, update, and delete Walls
- Add, reorder, and remove tweets via API
- Fetch Wall data for custom UI integration

## **⏳ Background Services (Cron Jobs)**

- Daily **cron job to update like & comment counts** for all tweets
- Ensures tweet engagement metrics remain up-to-date