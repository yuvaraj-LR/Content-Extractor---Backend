import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeWithCheerio = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .advertisement').remove();

    // Extract title
    let title = $('h1').first().text().trim() || 
                $('title').text().trim() || 
                $('meta[property="og:title"]').attr('content') || '';

    // Extract main content
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      'main'
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim();
        break;
      }
    }

    // Fallback: collect paragraph text
    if (!content || content.length < 200) {
      content = $('p').map((i, el) => $(el).text().trim())
        .get()
        .filter(text => text.length > 50)
        .join(' ');
    }

    return {
      title: title,
      content: content,
      url: url
    };
  } catch (error) {
    throw new Error(`Cheerio scraping failed: ${error.message}`);
  }
};