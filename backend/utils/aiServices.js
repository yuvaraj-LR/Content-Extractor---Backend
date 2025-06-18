const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

export const summarizeContent = async (text) => {
  console.log("LENGTH: ", text.length);
  
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: `Summarize the following in 10 lines:\n\n${text}`,
    }),
  });

  console.log("STATUS: ", response.status);

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    const errText = await response.text();
    console.log(errText, "TEXTT");
    
    throw new Error(`HuggingFace API Error: ${errText}`);
  }

  if (!contentType?.includes("application/json")) {
    const errText = await response.text();
    throw new Error(`Expected JSON, but got: ${errText}`);
  }

  const result = await response.json();
  console.log("RESULT: ", result);
  
  return result;
};
