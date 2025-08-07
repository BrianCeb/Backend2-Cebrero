import { Router } from 'express';
import passport from 'passport';

import {
    purchaseCart,
    getCart,
    createCart,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductInCart,
    clearCart
} from '../controllers/cart.controller.js';

const router = Router();

router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), purchaseCart);
router.get('/:cid', getCart);
router.post('/', createCart);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/product/:pid', updateProductInCart);
router.delete('/:cid', clearCart);

export default router;
