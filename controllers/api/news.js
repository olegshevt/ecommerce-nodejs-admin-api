const News = require('../../models/news');

exports.getNews = (req, res, next) => {

    const page = +req.query.page || 1;
    const perPage = 10;
    let totalItems;

    News.find().countDocuments().then(news => {
        totalItems = news;
        return News.find().skip((page - 1) * perPage).limit(perPage);
    })
        .then(news => {
            res.status(200).json({
                message: 'Fetched news successfully',
                news: news,
                totalItems: totalItems
            })
        }).catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getNewsItem = (req, res, next) => {
    const newsId = req.params.newsId;

    News.findById(newsId).then(newsItem => {
        res.status(200).json({
            message: 'Fetched news item successfully',
            newsItem: newsItem,
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}