const article = document.querySelector("article");

if (article) {
    const text = article.innerText;
    const words = text.split(" ");
    const wordCount = words.length;

    const badge = document.createElement("p");
    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `${wordCount} words`;

    // Support for API reference docs
    const heading = article.querySelector("h1");
    // Support for article docs with date
    const date = article.querySelector("time")?.parentNode;

    (date ?? heading).insertAdjacentElement("afterend", badge);
}