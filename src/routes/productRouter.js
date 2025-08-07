import { Router } from 'express';
import passport from 'passport';
import { authorizeRole } from '../middlewares/authorization.js';
import { uploader } from '../utils/multerUtil.js';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:pid', getProductById);

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorizeRole(['admin']),
    uploader.array('thumbnails', 3),
    createProduct
);

router.put(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizeRole(['admin']),
    uploader.array('thumbnails', 3),
    updateProduct
);

router.delete(
    '/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizeRole(['admin']),
    deleteProduct
);

export default router;
