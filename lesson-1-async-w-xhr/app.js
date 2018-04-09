(function() {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const imgRequest = new XMLHttpRequest();
        const unsplashKEY = 'Client-ID ' + config.UNSPLASH;

        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.onload = addImage;
        imgRequest.setRequestHeader('Authorization', unsplashKEY);
        imgRequest.send();
    });

    function addImage() {
        const data = JSON.parse(this.responseText);
        const firstImage = data.results[0];

        responseContainer.insertAdjacentHTML('afterbegin', `<figure>
      <img src="${firstImage.urls.small}" alt="${searchedForText}">
      <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
  </figure>`);
    }
})();