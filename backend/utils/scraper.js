import puppeteer from "puppeteer";

export const scrapeWithPuppeteer = async (url) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Extract content
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, nav, footer, header, aside');
      scripts.forEach(el => el.remove());

      // Try to find main content areas
      const contentSelectors = [
        'article',
        '[role="main"]',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        'main',
        '.container'
      ];

      let mainContent = '';
      let title = '';

      // Extract title
      title = document.querySelector('h1')?.textContent?.trim() || 
              document.querySelector('title')?.textContent?.trim() || '';

      // Try to find main content
      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          mainContent = element.textContent?.trim();
          if (mainContent && mainContent.length > 200) {
            break;
          }
        }
      }

      // Fallback: get all paragraph text
      if (!mainContent || mainContent.length < 200) {
        const paragraphs = Array.from(document.querySelectorAll('p'))
          .map(p => p.textContent?.trim())
          .filter(text => text && text.length > 50)
          .join(' ');
        mainContent = paragraphs;
      }

      return {
        title: title,
        content: mainContent,
        url: window.location.href
      };
    });

    return content;
  } catch (error) {
    throw new Error(`Scraping failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}