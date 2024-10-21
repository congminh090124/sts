const express = require('express');

const ProductSchema = require('../models/Product'); // Đường dẫn tới file Product model

// API thêm sản phẩm
exports.addProduct = async (req, res) => {
    try {
        const { nameProduct } = req.body;

        if (!nameProduct) {
            return res.status(400).json({
                message: "Tên sản phẩm là bắt buộc"
            });
        }

        const newProduct = new ProductSchema({
            nameProduct
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Sản phẩm đã được thêm thành công",
            product: savedProduct
        });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        res.status(500).json({
            message: "Lỗi khi thêm sản phẩm",
            error: error.message
        });
    }
};

exports.search = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({
                message: "Vui lòng cung cấp từ khóa tìm kiếm hợp lệ"
            });
        }

        // Normalize từ khóa tìm kiếm
        const normalizedKeyword = keyword
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Lấy tất cả sản phẩm
        const allProducts = await ProductSchema.find({});
        
        // Lọc sản phẩm theo từ khóa đã chuẩn hóa
        const products = allProducts.filter(product => {
            const normalizedName = product.nameProduct
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            
            return normalizedName.includes(normalizedKeyword);
        });

        console.log(`Tìm kiếm với từ khóa: "${keyword}"`);
        console.log(`Số lượng kết quả: ${products.length}`);

        res.status(200).json({
            message: "Tìm kiếm thành công",
            results: products
        });

    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        res.status(500).json({
            message: "Lỗi khi tìm kiếm sản phẩm",
            error: error.message
        });
    }
};


