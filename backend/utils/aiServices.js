import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const processWithGemini = async (scrapedData) => {
  try {
    const prompt = `
      Please analyze the following web content and provide:
      1. A clear, concise title (if the original title is unclear, create a better one)
      2. A comprehensive summary (2-3 paragraphs)
      3. 3-5 key points from the content

      Format your response as JSON:
      {
        "title": "Clear title here",
        "summary": "Detailed summary here",
        "keypoints": [
          "Key point 1",
          "Key point 2",
          "Key point 3",
          "Key point 4",
          "Key point 5"
        ]
      }

      Content to analyze:
      Title: ${scrapedData.title}
      Content: ${scrapedData.content.substring(0, 4000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI Response:", text);

    // Parse JSON response
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return parsedData;
      }
    } catch (parseError) {
      console.log('JSON parsing failed, using fallback parsing');
    }

    // Fallback: extract data using regex if JSON parsing fails
    const titleMatch = text.match(/"title":\s*"([^"]+)"/);
    const summaryMatch = text.match(/"summary":\s*"([^"]+)"/);
    const keypointsMatch = text.match(/"keypoints":\s*\[([\s\S]*?)\]/);

    let keypoints = [];
    if (keypointsMatch) {
      keypoints = keypointsMatch[1]
        .split(',')
        .map(point => point.replace(/"/g, '').trim())
        .filter(point => point.length > 0);
    }

    return {
      title: titleMatch ? titleMatch[1] : scrapedData.title || 'Untitled Content',
      summary: summaryMatch ? summaryMatch[1] : 'Summary could not be generated',
      keypoints: keypoints.length ? keypoints : ['Key points could not be extracted']
    };

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
};