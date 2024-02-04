import slugify from "slugify";
import categoryModel from "../../../DB/model/Category.model.js";
import productModel from "../../../DB/model/Product.model.js";
import cloudinary from "../../Services/cloudinary.js";
import { pagination } from "../../Services/pagination.js";
import XLSX from"xlsx";
import brandModel from "../../../DB/model/Brand.model.js";

export const createProduct = async (req, res) => {
  try {
    const { price, name, discount } = req.body;
    const checkCategory = await categoryModel.findById(req.body.categoryId);

    if (!checkCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    req.body.slug = slugify(name);
    req.body.finalPrice = price - (price * (discount || 0)) / 100;

    if(req.files.image){


            const { secure_url, public_id } = await cloudinary.uploader.upload(
                req.files.image[0].path,
                { folder: `${process.env.APP_NAME}/product/${req.body.name}/image` }
              );

              req.body.image = { secure_url, public_id };
}
if(req.files.subImages){
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
      );
      req.body.subImages.push({ secure_url, public_id });
    }

}
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    if(req.body.image=='undefined'){

            req.body.image = {secure_url:'https://png.pngtree.com/template/20220419/ourmid/pngtree-photo-coming-soon-abstract-admin-banner-image_1262901.jpg'}

    }

    const product = await productModel.create(req.body);

    return res.status(201).json({ message: "success", product });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const createProductWithExcel = async (req, res) => {
    try {
        const workbook = XLSX.readFile(req.file.path);
        const workSheets = workbook.Sheets[workbook.SheetNames[0]];
        const products = XLSX.utils.sheet_to_json(workSheets);

        const categories = await categoryModel.find({}, '_id name');
        const brands = await brandModel.find({}, '_id name');

        products.forEach(product => {
            // Find category
            const category = categories.find(cat => cat.name === product.categoryId);
            if (category) {
                product.categoryId = category._id;
            }

            // Find brand
            const brand = brands.find(brand => brand.name === product.brandId);
            if (brand) {
                product.brandId = brand._id;
            }

            product.slug = slugify(product.name, { lower: true });
            product.createdBy = req.user._id;
            product.updatedBy = req.user._id;
            product.image = { secure_url: 'https://png.pngtree.com/template/20220419/ourmid/pngtree-photo-coming-soon-abstract-admin-banner-image_1262901.jpg' }
            product.finalPrice = product.price - (product.price * (product.discount || 0)) / 100;
        });

        // Insert products into the database
        await productModel.insertMany(products);

        res.status(201).json({ message: 'تم إنشاء المنتجات بنجاح' });
    } catch (error) {
        console.error('خطأ في إنشاء المنتجات:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء المنتجات' });
    }
}

export const getProducts = async (req, res) => {
  try {
    let queryObj = { ...req.query };
    const execQuery = ["page", "size", "limit", "sort", "search", "fields"];
    execQuery.map((ele) => {
      delete queryObj[ele];
    });
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(
      /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
      (match) => `$${match}`
    );
    queryObj = JSON.parse(queryObj);

    const mongooseQuery = productModel.find(queryObj);

    if (req.query.search) {
      mongooseQuery.find({
        name: { $regex: req.query.search, $options: "i" },
      });
    }
    const products = await mongooseQuery
      .sort(req.query.sort?.replaceAll(",", " "))
      .select(req.query.fields?.replaceAll(",", " "))
      .populate({
        path: "reviews",
      });
    const counts = await productModel.estimatedDocumentCount();

    for (let i = 0; i < products.length; i++) {
      let calcRating = 0;
      for (let j = 0; j < products[i].reviews.length; j++) {
        calcRating += products[i].reviews[j].rating;
      }

      let avgRating = calcRating / products[i].reviews.length;
      const product = products[i].toObject();
      product.avgRating = avgRating;
      products[i] = product;
    }

    return res
      .status(200)
      .json({
        message: "success",
        count: products.length,
        total: counts,
        products,
      });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const getActiveProducts = async (req, res) => {
    try {
        let queryObj = { ...req.query };
        let {skip,limit} =  pagination(req.query.page,req.query.limit);
        const execQuery = ["page", "size", "limit", "sort", "search"];
        execQuery.map((ele) => {
          delete queryObj[ele];
        });
        queryObj = JSON.stringify(queryObj);
        queryObj = queryObj.replace(
          /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
          (match) => `$${match}`
        );
        queryObj = JSON.parse(queryObj);

        const mongooseQuery = productModel.find(queryObj).limit(limit).skip(skip);

        if (req.query.search) {
          mongooseQuery.find({
            name: { $regex: req.query.search, $options: "i" },
          });
        }
        const products = await mongooseQuery.find({status:'Active'})
          .sort(req.query.sort?.replaceAll(",", " "))
          .select(req.query.fields?.replaceAll(",", " "))
          .populate({
            path: "reviews",
          });
        const counts = await productModel.estimatedDocumentCount();

        for (let i = 0; i < products.length; i++) {
          let calcRating = 0;
          for (let j = 0; j < products[i].reviews.length; j++) {
            calcRating += products[i].reviews[j].rating;
          }

          let avgRating = calcRating / products[i].reviews.length;
          const product = products[i].toObject();
          product.avgRating = avgRating;
          products[i] = product;
        }

        return res
          .status(200)
          .json({
            message: "success",
            count: products.length,
            total: counts,
            products,
          });
      } catch (error) {
        return res.status(500).json({ message: "error", error: error.stack });
      }

};

export const getProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id).populate([
        {
          path: "categoryId",
        },
        {
          path: "reviews",
          populate: {
            path: "userId", // يحدد المسار لـ userId داخل reviews
          },
        },
      ]);


    if(!product){
        return res.status(404).json({message:"product not found"});
    }
    let calcRating = 0;
    product = product.toObject();
    for (let i = 0; i < product.reviews.length; i++) {
      if (product.reviews[i]?.rating) {
        calcRating += product.reviews[i].rating;
      }
    }

    let avgRating = 0;
    if (product.reviews.length > 0) {
      avgRating = calcRating / product.reviews.length;
      product.avgRating = avgRating;
    }
    return res.status(200).json({ message: "success", product });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.stack });
  }
};

export const deleteProduct  = async(req,res)=>{

    const {productId} = req.params;
    const product = await productModel.findByIdAndDelete(productId);
    if(!product)
    return res.status(404).json({message:"product not found"});

    return res.status(200).json({message:"success"});
}

export const updateProduct = async(req,res)=>{
    const {productId} = req.params;
    const { price, name, discount } = req.body;
    req.body.slug = slugify(req.body.name);
    req.body.finalPrice = price - (price * (discount || 0)) / 100;
    let product  = await productModel.findById(productId);
    if(!product){
        return res.status(404).json({message:"product not found"});
    }
    if(req.files.image){

        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.image[0].path,
            { folder: `${process.env.APP_NAME}/product/${req.body.name}/image` }
          );

          req.body.image = { secure_url, public_id };

          cloudinary.uploader.destroy(product.image.public_id);
    }else{
        req.body.image = product.image
    }


    if(req.files.subImages){
        for (const file of product.subImages) {
            cloudinary.uploader.destroy(file.public_id);

        }
        req.body.subImages = [];
        for (const file of req.files.subImages) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `${process.env.APP_NAME}/product/${req.body.name}/subImages` }
          );
          req.body.subImages.push({ secure_url, public_id });
        }
    }

    req.body.updatedBy = req.user._id;

   product  = await productModel.findByIdAndUpdate(productId,req.body,{new:true});


return res.json({message:"success",product});





}
