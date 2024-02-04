import slugify from "slugify";
import categoryModel from "../../../DB/model/Category.model.js";
import cloudinary from "../../Services/cloudinary.js";
import productModel from "../../../DB/model/Product.model.js";

export const createCategory = async (req, res) => {


    const name = req.body.name.toLowerCase();

    const slug = slugify(name);


    const category = await categoryModel.create({
        name, slug,
        createdBy: req.user._id, updatedBy: req.user._id
    });

    return res.status(201).json({ message: "success", category });
}

export const getCategories = async (req, res) => {

    const categories = await categoryModel.find().populate('products');

    return res.status(200).json({ message: "success", categories });

}

export const getActiveCategories = async (req, res) => {

    const categories = await categoryModel.find({ status: 'Active' }).populate('products');
    return res.status(200).json({ message: "success", categories });

}

export const getCategory = async (req, res) => {

    const { id } = req.params;

    const category = await categoryModel.findById(id);

    return res.status(200).json({ message: "success", category });
}

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.name);
    const category = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: 'success', category });
}

export const deleteCategory = async (req, res) => {

    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
        return res.status(404).json({ message: "not found" });
    }



    await categoryModel.findByIdAndDelete(id);
    await productModel.deleteMany({ categoryId: id })

    return res.status(200).json({ message: "success" });
}

export const getSimilerProduct = async (req, res) => {

    const { categoryId, productId } = req.params;

    const products = await productModel.find({ categoryId, _id: { $ne: productId } }).limit(4);
    return res.json({ message: "success", products });
};
