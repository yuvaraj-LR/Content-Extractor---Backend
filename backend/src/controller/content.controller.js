import { processWithGemini } from "../../utils/aiServices.js";
import { scrapeWithPuppeteer } from "../../utils/scraper.js";
import { addContentRepo, getAllContentRepo } from "../model/content.repo.js";

export const getContent = async (req, res) => {
    try {
        const data = await getAllContentRepo();

        if(data) {
            return res.status(200).json({status: true, data});
        }
    } catch (error) {
        return res.status(500).json({status: false, message: error?.message});
    }
}

export const addContent = async (req, res) => {
  try {
    const { url } = req.body;

    // Validate URL
    if (!url) {
      return res.status(400).json({
        status: false,
        message: 'URL is required'
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({
        status: false,
        message: 'Invalid URL format'
      });
    }

    console.log('Starting content extraction for:', url);

    // Step 1: Scrape the content
    const extractedData = await scrapeWithPuppeteer(url);
    
    if (!extractedData.content || extractedData.content.length < 100) {
      return res.status(400).json({
        status: false,
        message: 'Insufficient content extracted from the URL'
      });
    }

    console.log('Content scraped successfully, processing with AI...');

    // Step 2: Process with Gemini AI
    const aiData = await processWithGemini(extractedData);

    // Step 3: Save to the db.
    const newData = {
      url,
      extractedContent: aiData
    }

    await addContentRepo(newData);
    
    // Step 4: Return the processed data
    return res.status(200).json({
      status: true,
      data: {
        url: url,
        extractedAt: new Date().toISOString(),
        ...aiData
      }
    });

  } catch (error) {
    console.error("Content extraction error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || 'An error occurred during content extraction'
    });
  }
};

