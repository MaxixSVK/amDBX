const checkModPermissions = async (req, res, next) => {
    if (req.user.role !== 'mod' && req.user.role !== 'admin') {
        return res.status(403).send({ msg: 'Nemáte dostatočné oprávnenia' });
    }
    next();
}

module.exports = checkModPermissions;