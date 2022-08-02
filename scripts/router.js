
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
    earn: {
        template: "/pages/earn.html",
        title: "Staking & Yield Farming",
        description: "This is the staking & yield farming page"
    },
    liquidity: {
        template: "/pages/liquidity.html",
        title: "Liquidity | Step Farm",
        description: "This is the page where you can check your liquidity"
    },
    add: {
        template: "/pages/add.html",
        title: "Add Liquidity | Step Farm",
        description: "This is the page where you can provide liquidity"
    },
    lottery: {
        template: "/pages/lottery.html",
        title: "Lottery | Step Farm",
        description: "This is the Lottery page"
    },
    admin: {
        template: "/pages/admin.html",
        title: "Admin Pannel | Step Farm",
        description: "This is the Admin pannel page"
    }
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

    // set the content of the content div to the html
    document.getElementById("content").innerHTML = html;
    // set the title of the document to the title of the route
    document.title = route.title;
    // set the description of the document to the description of the route
    document
        .querySelector('meta[name="description"]')
        .setAttribute("content", route.description);

    // trigger functions for each page
    switch (location) {
        case '/':
            $('#footer').show();
            indexInit()
            break;
        case 'swap':
            $('#footer').show();
            swapInit()
            break;
        case 'earn':
            $('#footer').show();
            farmInit()
            break;
        case 'add':
            $('#footer').show();
            addInit()
            break;
        case 'liquidity':
            $('#footer').show();
            liquidityInit()
            break;
        case 'lottery':
            $('#footer').hide();
            lotteryInit();
            break;
        case 'admin':
            $('#footer').hide();
            // adminInit();
            break;
        default:
            console.log('Unknown route: '+location)
    }
};

// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
// call the urlLocationHandler to load the page
locationHandler();

