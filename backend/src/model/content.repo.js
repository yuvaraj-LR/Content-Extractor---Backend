import ContentModel from "./content.model.js"

export const addContentRepo = async (contentData) => {
    return await new ContentModel(contentData).save();
}

export const getAllContentRepo = async () => {
    return await ContentModel.find({});
};

export const getContentByIdRepo = async (_id) => {
    return await ContentModel.findById(_id);
};

export const getContentByUrlRepo = async (url) => {
    return await ContentModel.findOne({ url });
};

export const deleteContentRepo = async( _id) => {
    return await ContentModel.deleteOne({_id});
}

export const searchContentByTitleRepo = async (searchTerm) => {
    return await ContentModel.find({
        "extractedContent.title": { $regex: searchTerm, $options: "i" }
    });
};