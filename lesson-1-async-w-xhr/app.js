(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        const unsplashKEY = 'Client-ID ' + config.UNSPLASH;

        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.onload = addImage;
        imgRequest.setRequestHeader('Authorization', unsplashKEY);
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        const NYTimesKEY = config.NYT;

        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=` + NYTimesKEY);
        articleRequest.onload = addArticle;
        articleRequest.send();
    });

    function addImage() {
        const data = JSON.parse(this.responseText);
        let HtmlContent = '';
        if (data.results.length > 0) {
            const firstImage = data.results[0];

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

    function addArticle() {
        const data = JSON.parse(this.responseText);
        let HtmlContent = '';
        if (data.response.docs.length > 0) {
            HtmlContent = '<ul>' + data.response.docs.map(article =>
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
})();
