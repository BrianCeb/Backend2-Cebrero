export const authorizeRole = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).send({ status: 'error', message: 'Usuario no autenticado' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({ status: 'error', message: 'Acceso denegado: rol no autorizado' });
        }

        next();
    };
};
