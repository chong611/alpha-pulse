# Alpha Pulse User Guide

## Website Information

**Purpose**: Alpha Pulse helps day traders scan fresh market news and social media chatter across multiple sources with sentiment analysis and actionable insights.

**Access**: Public - no login required

---

## Powered by Manus

Alpha Pulse is built with cutting-edge web technologies for maximum performance and reliability.

**Technology Stack:**
- **Frontend**: React 19 with TypeScript, Tailwind CSS 4, and shadcn/ui component library for modern UI
- **Backend**: Node.js with Express server enabling server-side data fetching that bypasses CORS restrictions
- **Data Processing**: Hybrid sentiment analysis using VADER and Loughran-McDonald finance lexicons with automatic language detection for Chinese, Japanese, and Korean
- **Database**: PostgreSQL with Drizzle ORM for structured data management
- **Authentication**: OAuth 2.0 integration for secure user management
- **Deployment**: Auto-scaling infrastructure with global CDN for instant worldwide access

The application leverages advanced algorithms for real-time sentiment scoring, buzz calculation with recency decay, and composite trade scores. Server-side fetching ensures reliable access to all news sources without browser limitations.

---

## Using Your Website

Alpha Pulse aggregates market news from **six reliable sources**: Google News (multi-language), Reddit (with subreddit filtering), Yahoo Finance (ticker-based), MarketWatch (top financial stories), PR Newswire (press releases), and SEC EDGAR (recent filings).

**Getting Started:**

Click "Launch Alpha Pulse" on the homepage to open the full application. Enter your search terms in "Keywords" (like "AI" or "人工智能" for Chinese) and stock tickers in "Tickers" (like "AMD, NVDA"). For Reddit, add subreddits in "Subreddits" field (like "wallstreetbets, stocks"). Select your time window from the dropdown menu, then click "▶ Run" to fetch news from all enabled sources.

**Multi-Language Support:**

The application automatically detects Chinese, Japanese, and Korean characters in your keywords and fetches news in the appropriate language. For example, entering "人工智能" returns Chinese news articles from Chinese Google News sources. No configuration needed - just type in your preferred language.

**Custom Data Sources:**

Add your own RSS or JSON feeds in the "Custom URLs" textarea. Enter one URL per line and use `{query}` as a placeholder for keywords. Example for Reuters articles: `https://news.google.com/rss/search?q={query}+site:reuters.com&hl=en`. Example for Chinese news: `https://news.google.com/rss/search?q={query}&hl=zh-CN`. The backend automatically detects and parses RSS/XML or JSON formats.

**Viewing Results:**

Results appear in the center panel with sentiment badges showing "Bullish", "Bearish", or "Neutral" for each item. The top bar shows "Total Results" count and "Sites" progress. Click any headline to expand and see the full snippet. For Reddit posts, you'll see top comments included in sentiment analysis.

**Filtering and Sorting:**

Use "Filter by Site" to show only specific sources like "reddit" or "sec-edgar". Select "Filter by Ticker" to focus on specific stocks. Choose "Filter by Sentiment" to see only bullish, bearish, or neutral items. Adjust "Min Buzz" slider to filter by engagement level.

**Exporting Data:**

Click "📊 Export CSV" to download filtered results as a spreadsheet. Click "📄 Export JSON" for raw data export. Click "📋 Copy Markdown Brief" to generate a formatted daily trader report with market mood snapshot, top bullish/bearish tickers, notable threads, and risk flags. Click "🔗 Send Webhook" to POST results to your automation platform.

**Save Your Settings:**

Click "💾 Save Config" to store your keywords, tickers, subreddits, selected sources, and custom URLs to browser storage. Click "📂 Load Config" to restore saved settings instantly. Click "🔄 Reset to Defaults" to clear all settings.

---

## Managing Your Website

**Settings Panel:**

Access Settings from the Management UI to customize website name, logo, and visibility. Modify environment variables in "Settings → Secrets". Configure custom domains in "Settings → Domains".

**Dashboard Panel:**

Click "Dashboard" to view site analytics including unique visitors and page views. Monitor published site visibility and traffic patterns.

**Database Panel:**

Open "Database" to view and manage stored data using the built-in CRUD interface. Find connection details in bottom-left settings. Enable SSL when connecting from external clients.

**Code Panel:**

Click "Code" to browse the complete file tree. Download all project files using the download button. Review alpha-pulse.html and backend API code. Check DATASOURCES.md for detailed information about each data source.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features. Try entering Chinese keywords like "人工智能" or Japanese keywords like "人工知能" to explore international market sentiment. Add custom RSS feeds from your favorite financial news sites using the Custom URLs field. Experiment with different keyword combinations to discover emerging market trends and sentiment shifts.

For Reuters content specifically, add this custom URL: `https://news.google.com/rss/search?q={query}+site:reuters.com&hl=en` to filter Google News for Reuters articles only.
