const appRoutes = (app) => {
    app.use('/auth', require('./routes/auth'));
    app.use('/profile', require('./routes/profile'));
    app.use('/anime', require('./routes/anime'));
    app.use('/manga', require('./routes/manga'));
    app.use('/announcements', require('./routes/announcements'));
    app.use('/account', require('./routes/account'));
    app.use('/admin', require('./routes/admin'));
    app.use('/mod', require('./routes/mod'));
}

module.exports = appRoutes;