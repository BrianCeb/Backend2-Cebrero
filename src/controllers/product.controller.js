import { productDBManager } from '../dao/productDBManager.js';

const ProductService = new productDBManager();

export const getAllProducts = async (req, res) => {
    try {
        const result = await ProductService.getAllProducts(req.query);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const result = await ProductService.getProductByID(req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = req.files.map(file => file.path);
        }
        const result = await ProductService.createProduct(req.body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        if (req.files) {
            req.body.thumbnails = req.files.map(file => file.filename);
        }
        const result = await ProductService.updateProduct(req.params.pid, req.body);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const result = await ProductService.deleteProduct(req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};
