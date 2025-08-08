import { productDBManager } from '../dao/productDBManager.js';
import { cartDBManager } from '../dao/cartDBManager.js';
import { ticketDBManager } from '../dao/ticketDBManager.js';

const TicketService = new ticketDBManager();
const ProductService = new productDBManager();
const CartService = new cartDBManager(ProductService);

export const renderProductsView = async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('index', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs)),
        prevLink: {
            exist: !!products.prevLink,
            link: products.prevLink
        },
        nextLink: {
            exist: !!products.nextLink,
            link: products.nextLink
        }
    });
};

export const renderRealTimeProductsView = async (req, res) => {
    const products = await ProductService.getAllProducts(req.query);

    res.render('realTimeProducts', {
        title: 'Productos',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(products.docs))
    });
};

export const renderCartView = async (req, res) => {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    if (response.status === 'error') {
        return res.render('notFound', {
            title: 'Not Found',
            style: 'index.css'
        });
    }

    res.render('cart', {
        title: 'Carrito',
        style: 'index.css',
        products: JSON.parse(JSON.stringify(response.products))
    });
};

export const renderResetPasswordView = (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Token no proporcionado');

    res.render('resetPassword', { token });
};
export const renderTicketView = async (req, res) => {
    try {
        const ticket = await TicketService.getTicketById(req.params.tid);
        res.render('ticket', {
            title: 'Compra realizada con éxito',
            ticket
        });
    } catch (error) {
        res.status(404).send('Ticket no encontrado');
    }
};