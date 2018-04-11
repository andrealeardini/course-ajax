(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashKEY = 'Client-ID ' + config.UNSPLASH;
        const requestHeaders = new Headers();

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
                headers: {
                    'Authorization': unsplashKEY
                }
            })
            .then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, 'image'));

        const NYTimesKEY = config.NYT;
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${NYTimesKEY}`).then(response => response.json())
            .then(addArticle)
            .catch(e => requestError(e, 'article'));
    });

    function addImage(images) {
        let HtmlContent = '';
        if (images.results.length > 0) {
            const firstImage = images.results[0];

            HtmlContent =
                `<figure>
                  <img src="${firstImage.urls.small}" alt="${searchedForText}">
                  <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
        } else {
            HtmlContent =
                '<p class="error-no-image">Nothing to show in Upsplash on this search</p>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', HtmlContent);
    }

    function addArticle(articles) {
        let HtmlContent = '';
        if (articles.response.docs.length > 0) {
            HtmlContent = '<ul>' + articles.response.docs.map(article =>
                `<li class="article">
                  <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                  <p>${article.snippet}</p>
                </li>`
            ).join('') + '<ul>';
        } else {
            HtmlContent = '<p class="error-no-articles">Nothing to show in NY Times on this search</p>';
        }
        responseContainer.insertAdjacentHTML('beforeend', HtmlContent);
    }

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();
