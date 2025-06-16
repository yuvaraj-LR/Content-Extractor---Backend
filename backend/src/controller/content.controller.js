

export const getContent = (req, res) => {
    try {
        return res.status(200).send("Hello, I am GET content.");
    } catch (error) {
        
    }
}


export const addContent = (req, res) => {
    try {
        return res.status(200).send("Hello, I am POST content.");
    } catch (error) {
        
    }
}