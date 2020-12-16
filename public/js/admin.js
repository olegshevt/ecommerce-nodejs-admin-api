const deleteProduct = btn => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        }).then(data => {
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err);
        });
};


const deleteCategory = btn => {
    const catId = btn.parentNode.querySelector('[name=categoryId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const catElement = btn.closest('article');

    fetch('/admin/category/' + catId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        }).then(data => {
            catElement.parentNode.removeChild(catElement);
        })
        .catch(err => {
            console.log(err);
        });
};


const delNews = btn => {
    const newsId = btn.parentNode.querySelector('[name=newsId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const newsElement = btn.closest('article');

    fetch('/admin/news/news/' + newsId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        }).then(data => {
            newsElement.parentNode.removeChild(newsElement);
        })
        .catch(err => {
            console.log(err);
        });
};