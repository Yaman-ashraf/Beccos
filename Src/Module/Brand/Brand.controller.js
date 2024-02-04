import brandModel from "../../../DB/model/Brand.model.js";
import productModel from "../../../DB/model/Product.model.js";
import cloudinary from "../../Services/cloudinary.js";

export const createBrand = async (req, res) => {

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.APP_NAME}/brands` });

    req.body.image = { secure_url, public_id };
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;
    const brand = await brandModel.create(req.body);
    return res.status(201).json({ message: "success", brand });
}

export const getAllBrand = async (req, res) => {
    const brands = await brandModel.find({});
    return res.json({ message: "success", count: brands.length, brands });
}
export const deleteBrand = async (req, res) => {
    const brand = await brandModel.findByIdAndDelete(req.params.brandId);
    if (!brand) {
        return res.status(404).json({ message: "brand not found" });
    }
    return res.json({ message: "success" });
}


export const getProducts = async (req, res) => {

    const { brandId } = req.params;
    const products = await productModel.find({ brandId });

    return res.status(200).json({ message: "success", products });
}

export const updateBrand = async (req, res) => {
    const { brandId } = req.params;
    let brand = await brandModel.findById(brandId);
    if (!brand) {
        return res.status(404).json({ message: "brand not found" });
    }

    if (req.body.name) {
        brand.name = req.body.name;
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.APP_NAME}/brands` });

        cloudinary.uploader.destroy(brand.image.public_id);
        brand.image = { secure_url, public_id };
    }

    req.body.updatedBy = req.user._id;

    brand = await brand.save();

    return res.json({ message: "success", brand });

}

export const getBrand = async (req, res) => {

    const brand = await brandModel.findById(req.params.id);
    if (!brand) {
        return res.status(404).json({ message: "brand not found" });
    }

    return res.status(200).json({ message: "success", brand });

}
