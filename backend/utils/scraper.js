import axios from 'axios';
import * as cheerio from 'cheerio';

export const extractTextFromUrl = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('body').text(); // simple extraction – refine as needed
};
