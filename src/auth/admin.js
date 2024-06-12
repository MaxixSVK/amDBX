const checkAdminPermissions = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ msg: 'Nemáte dostatočné oprávnenia' });
    }
    next();
}

module.exports = checkAdminPermissions;