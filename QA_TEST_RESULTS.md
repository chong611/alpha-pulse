# Alpha Pulse - QA Test Results

## Test Date: October 31, 2025

---

## Phase 1: Input Fields Testing

### ✅ Keywords Field
- **Test:** Multiple keywords with Chinese characters: "AI, machine learning, 人工智能"
- **Result:** PASS - Field accepts and displays correctly
- **Note:** Chinese characters render properly

### ✅ Tickers Field  
- **Test:** Multiple ticker formats: "NVDA, $TSLA, NASDAQ:AMD, HK:0700"
- **Result:** PASS - All formats accepted
- **Note:** Supports standard, $-prefix, exchange:ticker, and HK formats

### ✅ Subreddits Field
- **Test:** Multiple subreddits: "wallstreetbets, stocks, investing"
- **Result:** PASS - Comma-separated values accepted

### ✅ Max Items Per Site
- **Current Value:** 50 (default)
- **Result:** PASS - Default value displayed correctly

### ✅ Time Window
- **Current Value:** Last 24 hours (default)
- **Result:** PASS - Dropdown works correctly

### ✅ Sort By
- **Current Value:** Latest (default)
- **Result:** PASS - Dropdown works correctly

---

## Phase 2: Data Sources Testing

### Test Run Results
- **Total Results:** 90 items
- **Sources Active:** 7/7 (but only 4 returned data)
- **Elapsed Time:** 1 second
- **Last Run:** 12:49:26 PM

### Source Breakdown:
1. ✅ **SEC EDGAR:** 40 items - WORKING
2. ✅ **PR Newswire:** 20 items - WORKING  
3. ✅ **Yahoo Finance:** 20 items - WORKING
4. ✅ **MarketWatch:** 10 items - WORKING
5. ❌ **Google News:** 0 items - NOT WORKING (expected results)
6. ❌ **Reddit:** 0 items - NOT WORKING (expected results)

### Issues Found:

#### Issue #1: Google News returned 0 items
- **Expected:** Should return Chinese news for "人工智能" keyword
- **Actual:** 0 results
- **Possible Cause:** Language detection not working, or query not being sent correctly

#### Issue #2: Reddit returned 0 items
- **Expected:** Should return posts from wallstreetbets, stocks, investing
- **Actual:** 0 results
- **Possible Cause:** Subreddits parameter not being sent to backend, or Reddit API blocking

---

## Phase 3: Results Display Testing

### ✅ Results Rendering
- **Result:** PASS - Items displayed correctly
- **Items Shown:** SEC EDGAR 8-K filings with proper formatting

### ✅ Metadata Display
- **Title:** Displayed correctly (e.g., "8-K - ACTELIS NETWORKS INC")
- **Source Badge:** Displayed (sec-edgar)
- **Sentiment Badge:** Displayed (neutral)
- **Buzz Score:** Displayed (10)
- **Timestamp:** Displayed ("just now")
- **Snippet:** Displayed with filing details

### ✅ Sentiment Overview
- **Bullish:** 0
- **Neutral:** 90
- **Bearish:** 0
- **Result:** PASS - Counts match total results

### ✅ Source Distribution
- **sec-edgar:** 40 items
- **prnewswire:** 20 items
- **yahoo-finance:** 20 items
- **marketwatch:** 10 items
- **Result:** PASS - Breakdown displayed correctly

### ❌ Top Tickers by Trade Score
- **Result:** "No data yet"
- **Issue:** Ticker extraction not working (expected NVDA, TSLA, AMD, HK:0700)

---

## Phase 4: Filter Testing

### ✅ Filter by Site Dropdown
- **Options:** All Sites, marketwatch, prnewswire, sec-edgar, yahoo-finance
- **Result:** PASS - Dropdown populated correctly
- **Note:** Google News and Reddit missing (because they returned 0 results)

### ⚠️ Filter by Ticker Dropdown
- **Options:** Only "All Tickers"
- **Result:** FAIL - No tickers extracted
- **Expected:** Should show NVDA, TSLA, AMD, HK:0700

### ✅ Filter by Sentiment Dropdown
- **Options:** All, Bullish, Neutral, Bearish
- **Result:** PASS - All options available

### ✅ Min Buzz Slider
- **Current Value:** 0
- **Result:** PASS - Slider visible and functional

---

## Critical Issues Summary

### 🔴 High Priority

1. **Google News not fetching results**
   - Impact: Major - missing primary news source
   - Keywords tested: "AI, machine learning, 人工智能"
   - Expected: Chinese news articles
   - Actual: 0 results

2. **Reddit not fetching results**
   - Impact: Major - missing social sentiment source
   - Subreddits tested: "wallstreetbets, stocks, investing"
   - Expected: Reddit posts
   - Actual: 0 results

3. **Ticker extraction not working**
   - Impact: High - no ticker filtering available
   - Tickers input: "NVDA, $TSLA, NASDAQ:AMD, HK:0700"
   - Expected: Tickers extracted and filterable
   - Actual: No tickers in dropdown, "No data yet" in Top Tickers

### 🟡 Medium Priority

4. **Top Tickers dashboard empty**
   - Impact: Medium - missing key analytics feature
   - Related to ticker extraction issue

---

## Next Steps

1. ✅ Investigate why Google News returns 0 results with Chinese keywords
2. ✅ Investigate why Reddit returns 0 results with subreddits
3. ✅ Fix ticker extraction from input field and article content
4. ⏳ Test export features (CSV, JSON, Markdown, Webhook)
5. ⏳ Test configuration save/load
6. ⏳ Test dark mode toggle
7. ⏳ Test all sorting options
8. ⏳ Test all filtering options with actual data

---

## Test Environment
- Browser: Chrome (via automation)
- URL: https://3000-ivvcgasgoqse5i39b795k-bee9722b.manus-asia.computer/alpha-pulse.html
- Backend: Running on port 3000
- Database: PostgreSQL
