import { Router } from 'express';
import {
    renderProductsView,
    renderRealTimeProductsView,
    renderCartView,
    renderResetPasswordView,
    renderTicketView
} from '../controllers/views.controller.js';

const router = Router();

router.get('/products', renderProductsView);
router.get('/realtimeproducts', renderRealTimeProductsView);
router.get('/cart/:cid', renderCartView);
router.get('/reset-password', renderResetPasswordView);
router.get('/ticket/:tid', renderTicketView);

export default router;
