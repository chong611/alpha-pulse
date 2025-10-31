# Data Sources Guide

## Working Sources

### ✅ Google News
- **Status:** Fully working
- **Features:** Multi-language support (auto-detects Chinese, Japanese, Korean, etc.)
- **Search:** Keyword-based
- **Limit:** Respects maxItems parameter

### ✅ Reddit
- **Status:** Fully working
- **Features:** Subreddit filtering, top comments extraction
- **Search:** Keyword + subreddit combination
- **Limit:** Up to 100 items per request (API limitation)

### ✅ Yahoo Finance
- **Status:** Fully working
- **Features:** Ticker-based news
- **Search:** Requires tickers (e.g., TSLA, NVDA)
- **Limit:** Respects maxItems parameter

### ✅ SEC EDGAR
- **Status:** Fully working
- **Features:** Recent filings (8-K, 10-K, 10-Q, etc.)
- **Search:** Returns latest filings
- **Limit:** Respects maxItems parameter

### ✅ PR Newswire
- **Status:** Fully working
- **Features:** Press releases
- **Search:** Returns latest releases
- **Limit:** Respects maxItems parameter

### ✅ MarketWatch
- **Status:** Fully working
- **Features:** Top financial news stories
- **Search:** Returns top stories (no keyword filtering)
- **Limit:** Respects maxItems parameter
- **Note:** MarketWatch RSS doesn't support keyword search, returns latest top stories

### ✅ Custom URLs
- **Status:** Fully working
- **Features:** RSS/Atom feed parsing with `{query}` placeholder
- **Example:** `https://news.google.com/rss/search?q={query}&hl=zh-CN`
- **Limit:** Respects maxItems parameter

---

## Limited/Blocked Sources

### ⚠️ Reuters
- **Status:** Not working (placeholder only)
- **Issue:** Reuters discontinued public RSS feeds
- **Solution:** Use Custom URLs with Reuters API key if you have access
- **Alternative:** Use Google News which aggregates Reuters content

### ⚠️ X (Twitter)
- **Status:** Requires API credentials
- **Issue:** Twitter API requires authentication
- **Solution:** Click "🔑 X API Settings" and enter your Twitter API credentials
- **Cost:** Twitter API Basic tier starts at $100/month

### ❌ WallStreetCN (华尔街见闻)
- **Status:** Not working via standard methods
- **Issue:** Single Page Application (SPA) - requires JavaScript rendering
- **Technical Details:**
  - Returns empty HTML shell: `<div id="app"></div>`
  - Content loaded via JavaScript after page load
  - RSS endpoint times out: `{"message":"Prerender worker timed out."}`
  - Blocks automated scraping

**Possible Solutions:**

1. **Use WallStreetCN API (Recommended)**
   - Check if WallStreetCN offers a developer API
   - Contact their business development team for API access
   - Add API endpoint as Custom URL once you have credentials

2. **Browser Automation (Not Recommended)**
   - Requires Puppeteer/Playwright
   - Very slow (5-10 seconds per request)
   - High server resource usage
   - May violate terms of service
   - Can be detected and blocked

3. **Alternative Chinese Financial News Sources**
   - Use Google News with Chinese language: `https://news.google.com/rss/search?q={query}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans`
   - Sina Finance RSS (if available)
   - Eastmoney RSS (if available)
   - Add these as Custom URLs

---

## How to Add Custom Data Sources

### For RSS/Atom Feeds

1. Find the RSS feed URL for your source
2. Test it in a browser to ensure it works
3. Add to "Custom URLs" field in Alpha Pulse
4. Use `{query}` placeholder for keyword substitution

**Example:**
```
https://news.google.com/rss/search?q={query}&hl=zh-CN
https://example.com/feed.rss?search={query}
```

### For API-Based Sources

1. Obtain API key from the service provider
2. Find the API endpoint URL
3. Add to "Custom URLs" with `{query}` placeholder
4. Note: Some APIs may require additional authentication headers (not currently supported in Custom URLs)

---

## Troubleshooting

### Source Returns 0 Items

**Possible causes:**
1. **Keyword too specific** - Try broader terms
2. **Time window too narrow** - Try "All time" instead of "Last 24 hours"
3. **Source doesn't support keyword search** - Some sources (like MarketWatch) return top stories only
4. **maxItems too low** - Increase the limit
5. **Source is blocking requests** - Check DATASOURCES.md for alternatives

### CORS Errors (Should Not Happen)

All fetching is done server-side, so CORS should not be an issue. If you see CORS errors:
1. Check that you're using the deployed version (not the standalone HTML file)
2. Ensure the backend server is running
3. Check browser console for actual error messages

### Slow Performance

**Normal behavior:**
- 6-7 sources: 2-5 seconds
- With Custom URLs: +1-2 seconds per URL

**If slower than expected:**
1. Reduce number of enabled sources
2. Lower maxItems per site
3. Check your internet connection
4. Some sources (like SEC EDGAR) can be slow during peak hours

---

## Recommended Source Combinations

### For US Stock Trading
- ✅ Google News
- ✅ Reddit (wallstreetbets, stocks, investing)
- ✅ Yahoo Finance
- ✅ SEC EDGAR
- ✅ MarketWatch
- ✅ PR Newswire

### For Chinese Markets
- ✅ Google News (with Chinese keywords)
- ✅ Custom URL: Google News Chinese `https://news.google.com/rss/search?q={query}&hl=zh-CN`
- ❌ WallStreetCN (use alternatives listed above)

### For Crypto Trading
- ✅ Reddit (cryptocurrency, bitcoin, ethereum)
- ✅ Google News
- ✅ Custom URLs: CoinDesk RSS, CoinTelegraph RSS

---

## Future Enhancements

Potential additions (not yet implemented):
- Bloomberg RSS (if available)
- Financial Times RSS (may require subscription)
- Seeking Alpha RSS
- Benzinga RSS
- Custom API authentication headers for Custom URLs
