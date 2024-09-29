const categorySchema = require("../models/Category")
exports.addCategory= async(req, res) =>{


    try {
        const { nameCategory } = req.body;

        // Tạo một đối tượng danh mục mới từ thông tin request
        const newCategory = new categorySchema({
            nameCategory
        });

        // Lưu danh mục vào cơ sở dữ liệu
        const savedCategory = await newCategory.save();

        // Trả về phản hồi thành công
        res.status(201).json({
            message: "Danh mục đã được thêm thành công",
            category: savedCategory
        });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({
            message: "Lỗi khi thêm danh mục",
            error: error.message
        });
    }
};