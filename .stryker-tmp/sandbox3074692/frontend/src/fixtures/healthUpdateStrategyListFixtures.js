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
    },
    real: {
        "strategies": [
            {
                "name": "Linear",
                "displayName": "Linear",
                "description": "Cow health increases/decreases proportionally to the number of cows over/under the carrying capacity."
            },
            {
                "name": "Constant",
                "displayName": "Constant",
                "description": "Cow health changes increases/decreases by the degradation rate, depending on if the number of cows exceeds the carrying capacity."
            },
            {
                "name": "Noop",
                "displayName": "Do nothing",
                "description": "Cow health does not change."
            }
        ],
        "defaultAboveCapacity": "Linear",
        "defaultBelowCapacity": "Constant"
    }
}

export default healthUpdateStrategyListFixtures;
