import { summarizeContent } from "../../utils/aiServices.js";
import { extractTextFromUrl } from "../../utils/scraper.js";
import { getAllContentRepo } from "../model/content.repo.js";

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
    const rawText = await extractTextFromUrl(url);
    const cleanedText = rawText.replace(/\s+/g, ' ').trim().slice(0, 3000);

    const titlePrompt = `Give me the brand or website name or title from this content:\n\n${cleanedText}`;
    const summaryPrompt = `Summarize the following content into 10 lines:\n\n${cleanedText}`;
    const keypointsPrompt = `Give me 3 key bullet points explaining what this content is about:\n\n${cleanedText}`;

    const title = await summarizeContent(titlePrompt);
    const summary = await summarizeContent(summaryPrompt);
    const keypointsRaw = await summarizeContent(keypointsPrompt);
    const keypoints = keypointsRaw.split(/\d+\.\s|•\s|\n/).filter(Boolean);

    return res.status(200).json({
      title: title.trim(),
      summary: summary.trim(),
      keypoints: keypoints.map(k => k.trim())
    });

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

