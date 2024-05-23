const pagedProfitsFixtures = {
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
            "pageSize": 5,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 0,
        "totalElements": 0,
        "last": true,
        "size": 5,
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
                "amount": 120,
                "timestamp": "2023-05-16T20:55:00.04076",
                "numCows": 6,
                "avgCowHealth": 91,
                
            },
            {
                "amount": 115,
                "timestamp": "2023-05-17T20:38:00.04076",
                "numCows": 4,
                "avgCowHealth": 94,
            },
            
        ],
        "pageable": {
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 5,
            "paged": true,
            "unpaged": false
        },
        "totalPages": 1,
        "totalElements": 2,
        "last": true,
        "size": 5,
        "number": 0,
        "sort": {
            "empty": false,
            "unsorted": false,
            "sorted": true
        },
        "numberOfElements": 2,
        "first": true,
        "empty": false
    },
    twoPages: [
        {
            "content": [
                {
                    "amount": 10,
                    "timestamp": "2026-04-11T20:55:00.04076",
                    "numCows": 3,
                    "avgCowHealth": 72,
                },
                {
                    "amount": 1,
                    "timestamp": "2025-03-12T20:55:00.04076",
                    "numCows": 9,
                    "avgCowHealth": 91,
                },
                {
                    "amount": 10,
                    "timestamp": "2024-10-20T20:55:00.04076",
                    "numCows": 2,
                    "avgCowHealth": 50,
                },
                {
                    "amount": 18,
                    "timestamp": "2023-03-03T20:55:00.04076",
                    "numCows": 8,
                    "avgCowHealth": 34,
                },
                {
                    "amount": 120,
                    "timestamp": "2022-05-16T20:55:00.04076",
                    "numCows": 6,
                    "avgCowHealth": 78,
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
                "pageSize": 5,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 2,
            "totalElements": 9,
            "last": false,
            "size": 5,
            "number": 0,
            "sort": {
                "empty": false,
                "unsorted": false,
                "sorted": true
            },
            "numberOfElements": 5,
            "first": true,
            "empty": false
        },
        {
            "content": [
                {
                    "amount": 5,
                    "timestamp": "2021-02-06T20:55:00.04076",
                    "numCows": 8,
                    "avgCowHealth": 56,
                },
                {
                    "amount": 908,
                    "timestamp": "2020-12-01T20:55:00.04076",
                    "numCows": 9,
                    "avgCowHealth": 89,
                },
                {
                    "amount": 19,
                    "timestamp": "2019-02-16T20:55:00.04076",
                    "numCows": 11,
                    "avgCowHealth": 91,
                },
                {
                    "amount": 14,
                    "timestamp": "1967-05-18T20:55:00.04076",
                    "numCows": 7,
                    "avgCowHealth": 99,
                }
            ],
            "pageable": {
                "sort": {
                    "empty": false,
                    "unsorted": false,
                    "sorted": true
                },
                "offset": 5,
                "pageNumber": 1,
                "pageSize": 5,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 2,
            "totalElements": 9,
            "last": true,
            "size": 5,
            "number": 1,
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

export default pagedProfitsFixtures;