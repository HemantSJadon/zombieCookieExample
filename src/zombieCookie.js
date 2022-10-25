const app = require("express")();
let logins = {};
app.get("/", (req,res) => {
    const etag = req.headers["If-None-Match"];
    //check if there is a cookie, get the user
    console.log(etag);
    if(req.headers.cookie){
        const user = req.headers.cookie.split("=")[1];
        createUserFromEtag(etag,user);
    }
    else {
        //if there is no cookie, recreate the ZOMBIE COOKIE from persisted caching data
        const user = getUserFromEtag(etag);
        //recreate/ set the cookie if user found
        if(user){
            res.setHeader("set-cookie", [`user=${user}`]);
        }
    }

    console.log(etag);
    res.sendFile(`${__dirname}/index.html`);
})

function createUserFromEtag(etag, user){
    logins[etag] = user;
}

function getUserFromEtag(etag){
    return logins[etag]
}

app.get("/login", (req,res) => {
    const user = req.query.user;
    res.setHeader("set-cookie", [`user=${user}`]);
    res.send("set");
});

app.listen(8081, () => {
    console.log("server started on port 8081...");
});