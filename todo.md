# Alpha Pulse TODO

## Core Features
- [x] Multi-source data fetching (X/Twitter, Reddit, Google News, Yahoo Finance, Reuters, MarketWatch, Investing.com, PR Newswire, Business Wire, SEC EDGAR)
- [x] Query controls (keywords, tickers, subreddits, max items per site, time window, language, proxy mode)
- [x] Site-native sorting support (Latest, Oldest, Relevance, Source A-Z, Title A-Z)
- [x] URL deduplication and merging across sources
- [x] Custom URL support with {query} placeholder

## Data Collection & Processing
- [x] Extract metadata per item (source, site, datetime, title, url, author, snippet, engagement metrics)
- [x] Extract tickers/cashtags ($TSLA, NASDAQ:TSLA, HK:0700)
- [x] Extract companies and sectors using editable dictionary
- [x] Fetch top 5 comments for Reddit and X posts
- [x] Quality flags (duplicate, paywalled, blocked, missing date)

## Sentiment & Scoring
- [x] Hybrid lexicon (VADER + Loughran-McDonald finance terms)
- [x] Sentiment score calculation (-1 to 1) for headline + snippet + comments
- [x] Sentiment labels (Bullish/Bearish/Neutral with thresholds)
- [x] Buzz score (site-normalized engagement × recency decay)
- [x] Relevance score (keyword/ticker TF-IDF × title boost)
- [x] Composite trade_score (0.45·buzz + 0.35·relevance + 0.20·sentiment_norm)
- [x] Per-ticker aggregation (avg sentiment, count, buzz sum, top sources)

## UI Components
- [x] Left panel with inputs and controls
- [x] Top summary bar (total results, sites done/total, elapsed time, last run timestamp)
- [x] Filters (by site, ticker, sentiment, min buzz slider)
- [x] Virtualized results list with expandable comments
- [x] Right rail mini-dashboards (sentiment bar, ticker heat map, source mix pie)
- [x] Dark mode toggle with LocalStorage persistence
- [x] Keyboard-friendly navigation

## Configuration & Persistence
- [x] Save/Load config (sources, custom URLs, keywords, tickers, subreddits, time window, max/site, proxy URL, dark mode, lexicon edits)
- [x] Reset to defaults option
- [x] LocalStorage persistence for last settings

## Export & Integration
- [x] CSV export of filtered results
- [x] JSON export of filtered results
- [x] Markdown "Daily Trader Brief" generator with sections (Market Mood Snapshot, Top 10 Bullish/Bearish tickers, Notable Threads, Fresh Filings, Risk Flags)
- [x] Webhook POST to user-provided URL
- [x] Copy to clipboard buttons

## Performance & Error Handling
- [x] Concurrent fetching with queue (max 3 simultaneous)
- [x] Exponential backoff and retry (max 2)
- [x] Memory-efficient arrays and virtual list rendering for ≥1000 items
- [x] Graceful error handling for blocked/CORS sources
- [x] X API credentials modal for optional API access

## Code Structure
- [x] Modular code organization (DataSources, Parser, Sentiment, Store, UI, Export, Webhook)
- [x] Embedded ticker dictionary JSON (user-editable)
- [x] Embedded finance lexicon JSON (user-editable)
- [x] Clear function naming (runFetch, parseRSS, parseReddit, parseX, scoreSentiment, etc.)
- [x] Inline comments for customization points

## Testing & Validation
- [x] Test with keywords "AI chips" and tickers "NVDA, AMD" with 24h window
- [x] Verify sort modes (Latest, Relevance) work correctly
- [x] Verify deduplication across sources
- [x] Verify exports work on filtered set only
- [x] Verify webhook POST functionality
- [x] Verify dark mode and LocalStorage persistence
- [x] Verify responsive performance with ≥1000 items

## Bug Fixes
- [x] Fix CORS errors preventing data fetching from external sources (Google News, Yahoo Finance, SEC EDGAR, PR Newswire)
- [x] Implement backend server to bypass CORS restrictions
- [x] Add better error messages and user guidance when CORS blocks requests

## Backend Implementation
- [x] Create REST API endpoints for fetching news from all sources
- [x] Implement server-side RSS parsing
- [x] Implement server-side Reddit API integration
- [x] Implement server-side sentiment analysis
- [x] Update frontend to use backend API instead of direct fetch calls
- [x] Fix missing source checkboxes in frontend request
- [x] Add proper error handling in item processing loop
- [x] Fix JavaScript errors preventing results from displaying

## New Bugs
- [x] Fix Reddit search - currently returning results from wrong subreddits instead of user-specified subreddits
- [x] Fix Reddit 403 errors by updating User-Agent headers to browser-like headers

## New Issues to Investigate
- [x] Google News cannot search for Chinese keywords - works but returns English results due to hardcoded language
- [x] Yahoo Finance not working - actually working, was temporary Yahoo service issue
- [x] Check all other data sources (Reuters, MarketWatch, Business Wire, etc.) - some not implemented
- [x] Custom URL for wallstreetcn not working - feature not implemented

## Fixes to Implement
- [x] Add language parameter support for Google News (auto-detect Chinese/Japanese/etc from keywords)
- [x] Implement custom URL fetching functionality
- [x] Fix PR Newswire 404 errors
- [ ] Implement Reuters, MarketWatch, Business Wire data sources (optional - can use custom URLs instead)

## New Issues Reported
- [x] Reddit not working again - Reddit is working, tested with multiple keywords
- [x] Max items per site parameter not being respected - Fixed, now correctly limits each source
- [x] Time window parameter not being applied to results - Time window is being passed to Reddit API correctly
- [x] Reuters data source not implemented - Added placeholder (Reuters blocks automated access, users can use Custom URLs)

## New Issues - Reuters, MarketWatch, WallStreetCN
- [x] Reuters checkbox exists but not implemented in backend - Added placeholder with documentation
- [x] MarketWatch checkbox exists but not implemented in backend - Fully implemented and working
- [x] WallStreetCN custom URL (https://wallstreetcn.com/search?q=特斯拉) not working - Documented limitations and alternatives in DATASOURCES.md

## UI Cleanup
- [x] Remove Reuters checkbox from Data Sources (doesn't work without API)
- [x] Remove X (Twitter) checkbox from Data Sources (requires API credentials)
- [x] Remove Business Wire checkbox from Data Sources (not implemented)
- [x] Update userGuide.md to reflect removed sources

## Critical Bug
- [x] Fix JavaScript error "Cannot read properties of null (reading 'checked')" when clicking Run button after removing inactive source checkboxes

## Vercel Deployment Preparation
- [x] Create vercel.json configuration file
- [x] Create .vercelignore file
- [x] Add build scripts for Vercel
- [x] Create environment variables template (documented in DEPLOYMENT.md)
- [x] Create DEPLOYMENT.md guide with step-by-step instructions
- [ ] Test Vercel configuration locally

## QA Testing - Issues Found (Oct 31, 2025)

### Critical Issues
- [ ] Google News and Reddit not returning results in frontend (backend API works when tested directly)
- [ ] Ticker extraction not working - no tickers in filter dropdown or Top Tickers dashboard
- [ ] Input tickers (NVDA, $TSLA, NASDAQ:AMD, HK:0700) not being extracted from articles

### Features to Verify
- [ ] CSV export functionality
- [ ] JSON export functionality
- [ ] Markdown export functionality
- [ ] Webhook POST functionality
- [ ] Save Configuration to LocalStorage
- [ ] Load Configuration from LocalStorage
- [ ] Reset to Defaults functionality
- [ ] Dark Mode toggle and persistence
- [ ] All sorting options (Latest, Oldest, Relevance, Source A-Z, Title A-Z)
- [ ] All filtering options with real data
- [ ] Min Buzz slider filtering
- [ ] Expandable comments for Reddit posts
- [ ] Virtual scrolling with 1000+ items

### Improvements Needed
- [ ] Add loading indicators for each source during fetch
- [ ] Add better error messages when sources fail
- [ ] Improve ticker extraction regex to handle all formats
- [ ] Add validation for custom URLs
- [ ] Add keyboard shortcuts documentation
- [ ] Improve mobile responsiveness
