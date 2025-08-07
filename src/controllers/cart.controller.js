import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';

const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);
const TicketService = new ticketDBManager();

export const purchaseCart = async (req, res) => {
    try {
        const cart = await CartService.getProductsFromCartByID(req.params.cid);
        const user = req.user;

        let total = 0;
        const productsToKeep = [];
        const productsToBuy = [];

        for (const item of cart.products) {
            const product = await ProductService.getProductByID(item.product._id);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                total += product.price * item.quantity;
                productsToBuy.push(item);
            } else {
                productsToKeep.push(item);
            }
        }

        let ticket = null;
        if (productsToBuy.length > 0) {
            const code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const purchase_datetime = new Date();

            ticket = await TicketService.createTicket({
                code,
                amount: total,
                purchase_datetime,
                purchaser: `${user.first_name} ${user.last_name} <${user.email}>`,
            });
        }

        await CartService.updateAllProducts(req.params.cid, productsToKeep);

        res.send({
            status: 'success',
            ticket,
            notProcessed: productsToKeep,
        });
    } catch (err) {
        res.status(500).send({ status: 'error', message: err.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const createCart = async (req, res) => {
    try {
        const result = await CartService.createCart();
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const result = await CartService.addProductByID(req.params.cid, req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const result = await CartService.deleteProductByID(req.params.cid, req.params.pid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const updateProductInCart = async (req, res) => {
    try {
        const result = await CartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const result = await CartService.deleteAllProducts(req.params.cid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
};
