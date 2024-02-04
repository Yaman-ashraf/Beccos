import sliderModel from "../../../DB/model/Slider.model.js";
import cloudinary from "../../Services/cloudinary.js";

export const createSlider = async (req, res) => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.APP_NAME}/slider` });

    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const slider = await sliderModel.create(req.body);
    return res.status(201).json({ message: "success", slider });
}

export const getAllSlider = async (req, res) => {
    const sliders = await sliderModel.find({});
    return res.json({ message: "success", count: sliders.length, sliders });
}

export const getActiveSlider = async (req, res) => {
    const sliders = await sliderModel.find({ status: 'Active' });
    return res.json({ message: "success", count: sliders.length, sliders });
}


export const updateSlider = async (req, res) => {
    const { imageId } = req.params;
    let slider = await sliderModel.findById(imageId);
    if (!slider) {
        return res.status(404).json({ message: "slider not found" });
    }


    if (req.file) {

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/slider` });

        req.body.image = { secure_url, public_id };

        cloudinary.uploader.destroy(slider.image.public_id);
    } else {

        req.body.image = slider.image;
    }

    req.body.updatedBy = req.user._id;

    slider = await sliderModel.findByIdAndUpdate(imageId, req.body, { new: true });

    return res.json({ message: "sucess", slider });

}

export const getSlider = async (req, res) => {

    const slider = await sliderModel.findById(req.params.id);
    if (!slider) {
        return res.status(404).json({ message: "slider not found" });
    }

    return res.status(200).json({ message: "success", slider });

}
export const deleteSlider = async (req, res) => {

    const slider = await sliderModel.findByIdAndDelete(req.params.imageId);
    if (!slider) {
        return res.status(404).json({ message: "image not found" });
    }

    cloudinary.uploader.destroy(slider.image.public_id);

    return res.status(200).json({ message: "success" });
}
