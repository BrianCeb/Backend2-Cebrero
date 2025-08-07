import { Router } from 'express';
import {
    renderProductsView,
    renderRealTimeProductsView,
    renderCartView,
    renderResetPasswordView
} from '../controllers/views.controller.js';

const router = Router();

router.get('/products', renderProductsView);
router.get('/realtimeproducts', renderRealTimeProductsView);
router.get('/cart/:cid', renderCartView);
router.get('/reset-password', renderResetPasswordView);

export default router;
