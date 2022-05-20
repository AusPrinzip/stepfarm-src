
const routes = {
    404: {
        template: "/pages/404.html",
        title: "404",
        description: "Page not found",
    },
    "/": {
        template: "/pages/index.html",
        title: "Home",
        description: "This is the home page",
    },
    swap: {
        template: "/pages/swap.html",
        title: "Swap",
        description: "This is the swap page",
    },
    contact: {
        template: "/pages/contact.html",
        title: "Contact Us",
        description: "This is the contact page",
    },
};

const locationHandler = async () => {
    // get the url path, replace hash with empty string
    var location = window.location.hash.replace("#", "");
    // if the path length is 0, set it to primary page route
    if (location.length == 0) {
        location = "/";
    }
    // get the route object from the routes object
    const route = routes[location] || routes["404"];
    // get the html from the template
    const html = await fetch(route.template).then((response) => response.text());

    const script = document.createElement("script");
    const scriptName = location == "/" ? "index" : location;
    script.src = `/scripts/${scriptName}.js`;
    document.getElementById("content").appendChild(script);
    

    // set the content of the content div to the html
    document.getElementById("content").innerHTML = html;
    // set the title of the document to the title of the route
    document.title = route.title;
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);
};

// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
// call the urlLocationHandler to load the page
locationHandler();

