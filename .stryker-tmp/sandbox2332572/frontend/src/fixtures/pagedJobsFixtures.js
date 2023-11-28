const jobsFixtures = {
    emptyPage: {
        "content": [],
        "pageable": {
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 10,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 0,
        "totalElements": 0,
        "last": true,
        "size": 10,
        "number": 0,
        "sort": {
            "empty": false,
            "unsorted": false,
            "sorted": true
        },
        "numberOfElements": 0,
        "first": true,
        "empty": true
    },
    onePage:
    {
        "content": [
            {
                "id": 120,
                "createdAt": "2023-08-08T12:14:00.041855-07:00",
                "updatedAt": "2023-08-08T12:14:00.211631-07:00",
                "status": "complete",
                "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 54.40000000000016\n old cow health: 54.40000000000016, new cow health: 53.600000000000165\nCow health has been updated!"
            },
            {
                "id": 119,
                "createdAt": "2023-08-08T12:13:00.052523-07:00",
                "updatedAt": "2023-08-08T12:13:00.297008-07:00",
                "status": "complete",
                "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10210.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10225.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10455.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10490.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 54.40000000000016, totalWealth: $2604.80\nProfit for user: Phill Conrad is: $54.40, newWealth: $2659.20\nCows have been milked!"
            },
            {
                "id": 118,
                "createdAt": "2023-08-08T11:42:22.695515-07:00",
                "updatedAt": "2023-08-08T11:42:25.245356-07:00",
                "status": "complete",
                "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
            },
            {
                "id": 117,
                "createdAt": "2023-08-08T11:42:22.556153-07:00",
                "updatedAt": "2023-08-08T11:42:25.057215-07:00",
                "status": "complete",
                "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
            },
            {
                "id": 116,
                "createdAt": "2023-08-08T11:42:22.398358-07:00",
                "updatedAt": "2023-08-08T11:42:24.200089-07:00",
                "status": "complete",
                "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
            },
            {
                "id": 115,
                "createdAt": "2023-08-08T11:42:22.296369-07:00",
                "updatedAt": "2023-08-08T11:42:24.04618-07:00",
                "status": "complete",
                "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
            }
        ],
        "pageable": {
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 10,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 1,
        "totalElements": 6,
        "last": true,
        "size": 10,
        "number": 0,
        "sort": {
            "empty": false,
            "unsorted": false,
            "sorted": true
        },
        "numberOfElements": 6,
        "first": true,
        "empty": false
    },
    fourPages: [
        {
            "content": [
                {
                    "id": 120,
                    "createdAt": "2023-08-08T12:14:00.041855-07:00",
                    "updatedAt": "2023-08-08T12:14:00.211631-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 54.40000000000016\n old cow health: 54.40000000000016, new cow health: 53.600000000000165\nCow health has been updated!"
                },
                {
                    "id": 119,
                    "createdAt": "2023-08-08T12:13:00.052523-07:00",
                    "updatedAt": "2023-08-08T12:13:00.297008-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10210.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10225.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10455.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10490.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 54.40000000000016, totalWealth: $2604.80\nProfit for user: Phill Conrad is: $54.40, newWealth: $2659.20\nCows have been milked!"
                },
                {
                    "id": 118,
                    "createdAt": "2023-08-08T11:42:22.695515-07:00",
                    "updatedAt": "2023-08-08T11:42:25.245356-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 117,
                    "createdAt": "2023-08-08T11:42:22.556153-07:00",
                    "updatedAt": "2023-08-08T11:42:25.057215-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 116,
                    "createdAt": "2023-08-08T11:42:22.398358-07:00",
                    "updatedAt": "2023-08-08T11:42:24.200089-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 115,
                    "createdAt": "2023-08-08T11:42:22.296369-07:00",
                    "updatedAt": "2023-08-08T11:42:24.04618-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 114,
                    "createdAt": "2023-08-08T11:42:22.14669-07:00",
                    "updatedAt": "2023-08-08T11:42:23.156125-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 113,
                    "createdAt": "2023-08-08T11:42:21.995817-07:00",
                    "updatedAt": "2023-08-08T11:42:23.003502-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 112,
                    "createdAt": "2023-08-08T11:42:02.244951-07:00",
                    "updatedAt": "2023-08-08T11:42:05.295741-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 111,
                    "createdAt": "2023-08-08T11:42:02.045677-07:00",
                    "updatedAt": "2023-08-08T11:42:04.554159-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                }
            ],
            "pageable": {
                "sort": {
                    "empty": false,
                    "unsorted": false,
                    "sorted": true
                },
                "offset": 0,
                "pageNumber": 0,
                "pageSize": 10,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 4,
            "totalElements": 34,
            "last": false,
            "size": 10,
            "number": 0,
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "numberOfElements": 10,
            "first": true,
            "empty": false
        },
        {
            "content": [
                {
                    "id": 110,
                    "createdAt": "2023-08-08T11:42:01.894951-07:00",
                    "updatedAt": "2023-08-08T11:42:04.251314-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 109,
                    "createdAt": "2023-08-08T11:42:01.745402-07:00",
                    "updatedAt": "2023-08-08T11:42:03.50618-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 108,
                    "createdAt": "2023-08-08T11:42:01.598764-07:00",
                    "updatedAt": "2023-08-08T11:42:03.204012-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 107,
                    "createdAt": "2023-08-08T11:42:01.449214-07:00",
                    "updatedAt": "2023-08-08T11:42:02.495829-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 106,
                    "createdAt": "2023-08-08T11:42:01.145541-07:00",
                    "updatedAt": "2023-08-08T11:42:02.156006-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 105,
                    "createdAt": "2023-08-08T11:42:00.01123-07:00",
                    "updatedAt": "2023-08-08T11:42:00.204043-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 55.20000000000016\n old cow health: 55.20000000000016, new cow health: 54.40000000000016\nCow health has been updated!"
                },
                {
                    "id": 104,
                    "createdAt": "2023-08-08T11:41:52.398066-07:00",
                    "updatedAt": "2023-08-08T11:41:53.445837-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 103,
                    "createdAt": "2023-08-08T11:41:51.799791-07:00",
                    "updatedAt": "2023-08-08T11:41:52.845574-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 102,
                    "createdAt": "2023-08-08T11:41:51.10517-07:00",
                    "updatedAt": "2023-08-08T11:41:52.153975-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 101,
                    "createdAt": "2023-08-08T11:41:50.294837-07:00",
                    "updatedAt": "2023-08-08T11:41:51.306282-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                }
            ],
            "pageable": {
                "sort": {
                    "empty": false,
                    "unsorted": false,
                    "sorted": true
                },
                "offset": 10,
                "pageNumber": 1,
                "pageSize": 10,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 4,
            "totalElements": 34,
            "last": false,
            "size": 10,
            "number": 1,
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "numberOfElements": 10,
            "first": false,
            "empty": false
        },
        {
            "content": [
                {
                    "id": 100,
                    "createdAt": "2023-08-08T11:41:49.5453-07:00",
                    "updatedAt": "2023-08-08T11:41:50.554996-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 99,
                    "createdAt": "2023-08-08T11:41:34.310896-07:00",
                    "updatedAt": "2023-08-08T11:41:35.446034-07:00",
                    "status": "complete",
                    "log": "Hello World! from test job!\nauthentication is not null\nGoodbye from test job!"
                },
                {
                    "id": 98,
                    "createdAt": "2023-08-08T11:35:00.017525-07:00",
                    "updatedAt": "2023-08-08T11:35:00.158433-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 56.000000000000156\n old cow health: 56.000000000000156, new cow health: 55.20000000000016\nCow health has been updated!"
                },
                {
                    "id": 97,
                    "createdAt": "2023-08-08T11:28:00.010639-07:00",
                    "updatedAt": "2023-08-08T11:28:00.242304-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 56.80000000000015\n old cow health: 56.80000000000015, new cow health: 56.000000000000156\nCow health has been updated!"
                },
                {
                    "id": 96,
                    "createdAt": "2023-08-08T11:26:00.03317-07:00",
                    "updatedAt": "2023-08-08T11:26:00.193107-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10195.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10210.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10420.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10455.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 56.80000000000015, totalWealth: $2548.00\nProfit for user: Phill Conrad is: $56.80, newWealth: $2604.80\nCows have been milked!"
                },
                {
                    "id": 95,
                    "createdAt": "2023-08-08T11:13:00.025739-07:00",
                    "updatedAt": "2023-08-08T11:13:00.285787-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10180.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10195.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10385.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10420.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 56.80000000000015, totalWealth: $2491.20\nProfit for user: Phill Conrad is: $56.80, newWealth: $2548.00\nCows have been milked!"
                },
                {
                    "id": 94,
                    "createdAt": "2023-08-08T10:14:00.008943-07:00",
                    "updatedAt": "2023-08-08T10:14:00.071925-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 57.60000000000015\n old cow health: 57.60000000000015, new cow health: 56.80000000000015\nCow health has been updated!"
                },
                {
                    "id": 93,
                    "createdAt": "2023-08-08T10:13:00.028367-07:00",
                    "updatedAt": "2023-08-08T10:13:00.143601-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10165.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10180.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10350.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10385.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 57.60000000000015, totalWealth: $2433.60\nProfit for user: Phill Conrad is: $57.60, newWealth: $2491.20\nCows have been milked!"
                },
                {
                    "id": 92,
                    "createdAt": "2023-08-08T10:07:00.011244-07:00",
                    "updatedAt": "2023-08-08T10:07:00.059177-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 58.40000000000015\n old cow health: 58.40000000000015, new cow health: 57.60000000000015\nCow health has been updated!"
                },
                {
                    "id": 91,
                    "createdAt": "2023-08-08T10:00:00.012706-07:00",
                    "updatedAt": "2023-08-08T10:00:00.087001-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10150.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10165.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10315.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10350.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 58.40000000000015, totalWealth: $2375.20\nProfit for user: Phill Conrad is: $58.40, newWealth: $2433.60\nCows have been milked!"
                }
            ],
            "pageable": {
                "sort": {
                    "empty": false,
                    "unsorted": false,
                    "sorted": true
                },
                "offset": 20,
                "pageNumber": 2,
                "pageSize": 10,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 4,
            "totalElements": 34,
            "last": false,
            "size": 10,
            "number": 2,
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "numberOfElements": 10,
            "first": false,
            "empty": false
        },
        {
            "content": [
                {
                    "id": 90,
                    "createdAt": "2023-08-08T09:59:59.979338-07:00",
                    "updatedAt": "2023-08-08T10:00:00.080441-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 58.40000000000015\n old cow health: 58.40000000000015, new cow health: 57.60000000000015\nCow health has been updated!"
                },
                {
                    "id": 89,
                    "createdAt": "2023-08-08T09:52:00.005894-07:00",
                    "updatedAt": "2023-08-08T09:52:00.235908-07:00",
                    "status": "complete",
                    "log": "Starting to milk the cows\nMilking cows for Commons: Blue, Milk Price: $5.00\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0, totalWealth: $10135.00\nProfit for user: Phill Conrad is: $15.00, newWealth: $10150.00\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0, totalWealth: $10280.00\nProfit for user: Phillip Conrad is: $35.00, newWealth: $10315.00\nMilking cows for Commons: Red, Milk Price: $10.00\nUser: Phill Conrad, numCows: 10, cowHealth: 58.40000000000015, totalWealth: $2316.80\nProfit for user: Phill Conrad is: $58.40, newWealth: $2375.20\nCows have been milked!"
                },
                {
                    "id": 88,
                    "createdAt": "2023-08-08T09:49:00.023409-07:00",
                    "updatedAt": "2023-08-08T09:49:00.154346-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 59.200000000000145\n old cow health: 59.200000000000145, new cow health: 58.40000000000015\nCow health has been updated!"
                },
                {
                    "id": 87,
                    "createdAt": "2023-08-08T09:42:00.01134-07:00",
                    "updatedAt": "2023-08-08T09:42:00.07881-07:00",
                    "status": "complete",
                    "log": "Updating cow health...\nCommons Blue, degradationRate: 0.1, carryingCapacity: 10\nUser: Phill Conrad, numCows: 3, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nUser: Phillip Conrad, numCows: 7, cowHealth: 100.0\n old cow health: 100.0, new cow health: 100.0\nCommons Red, degradationRate: 0.1, carryingCapacity: 2\nUser: Phill Conrad, numCows: 10, cowHealth: 60.00000000000014\n old cow health: 60.00000000000014, new cow health: 59.200000000000145\nCow health has been updated!"
                }
            ],
            "pageable": {
                "sort": {
                    "empty": false,
                    "unsorted": false,
                    "sorted": true
                },
                "offset": 30,
                "pageNumber": 3,
                "pageSize": 10,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 4,
            "totalElements": 34,
            "last": true,
            "size": 10,
            "number": 3,
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "numberOfElements": 4,
            "first": false,
            "empty": false
        }
    ]

};

export default jobsFixtures;