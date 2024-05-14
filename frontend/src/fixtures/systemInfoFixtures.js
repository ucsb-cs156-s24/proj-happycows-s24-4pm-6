const systemInfoFixtures = {
    showingAll:
    {
        "springH2ConsoleEnabled": true,
        "showSwaggerUILink": true,
        "sourceRepo": "https://github.com/ucsb-cs156/proj-happycows",
        "oauthLogin": "/oauth2/authorization/google"
    },
    showingNeither:
    {
        "springH2ConsoleEnabled": false,
        "showSwaggerUILink": false,
        "sourceRepo": "",
        "oauthLogin": "/oauth2/authorization/google"
    },
    oauthLoginUndefined:
    {
        "springH2ConsoleEnabled": false,
        "showSwaggerUILink": false
    }
};



export { systemInfoFixtures };