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