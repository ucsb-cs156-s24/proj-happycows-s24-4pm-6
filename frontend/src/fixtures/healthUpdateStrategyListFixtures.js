const healthUpdateStrategyListFixtures = {
    simple: {
        strategies: [
            {
                name: "strat1",
                displayName: "Strategy 1",
                description: "This is the first strategy",
            },
            {
                name: "strat2",
                displayName: "Strategy 2",
                description: "This is the second strategy",
            },
            {
                name: "strat3",
                displayName: "Strategy 3",
                description: "This is the third strategy",
            }
        ],
        defaultAboveCapacity: "strat1",
        defaultBelowCapacity: "strat2",
    }
}

export default healthUpdateStrategyListFixtures;
