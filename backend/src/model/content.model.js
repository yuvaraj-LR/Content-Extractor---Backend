import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        url: {
            type: String, 
            required: [true, "Public url is required."]
        }, 
        extractedContent: {
            type: Object,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        }
    }
)

const ContentModel = new mongoose.model("Content", contentSchema);
export default ContentModel;