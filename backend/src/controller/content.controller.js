import { processWithGemini } from "../../utils/aiServices.js";
import { scrapeWithCheerio } from "../../utils/scraper.js";
import { addContentRepo, deleteContentRepo, getAllContentRepo, getContentByUrlRepo, searchContentByTitleRepo } from "../model/content.repo.js";

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

    // Check in DB, if the Url is already there. 
    const existingData = await getContentByUrlRepo(url);
    const data = await getAllContentRepo();

    if (existingData) {
      return res.status(200).json({
        status: true,
        message: "URL already processed",
        extractedData: {
          title: existingData.extractedContent.title,
          summary: existingData.extractedContent.summary,
          keypoints: existingData.extractedContent.keypoints,
        },
        data
      });
    }

    console.log('Starting content extraction for:', url);

    // Step 1: Scrape the content
    const extractedData = await scrapeWithCheerio(url);
    
    if (!extractedData.content || extractedData.content.length < 100) {
      return res.status(400).json({
        status: false,
        message: 'Insufficient content extracted from the URL. Please try again with different URL.'
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
      addedData: {
        url: url,
        extractedAt: new Date().toISOString(),
        ...aiData
      },
      data
    });

  } catch (error) {
    console.error("Content extraction error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || 'An error occurred during content extraction'
    });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id, "ID");

    if(!id) {
      return res.status(400).json({
        status: false,
        message: 'Id should not be empty'
      });
    }
    
    await deleteContentRepo(id);
    const data = await getAllContentRepo();

    return res.status(200).json({status: true, msg: "Deleted Successfully.", data })
  } catch (error) {
    console.error("Content Deletion error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || 'An error occurred during Delete Item'
    });
  }
}

export const searchContent = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ status: false, message: "Search query is required." });
    }

    const result = await searchContentByTitleRepo(query);

    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Error occurred during search",
    });
  }
};
