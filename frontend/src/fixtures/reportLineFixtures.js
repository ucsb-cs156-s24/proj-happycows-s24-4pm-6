const reportLineFixtures = {
    twoReportLinesHeader:  {
      "id": 5,
      "commonsId": 1,
      "name": "Blue",
      "cowPrice": 100,
      "milkPrice": 5,
      "startingBalance": 10000,
      "startingDate": "2023-08-06T00:00:00",
      "showLeaderboard": true,
      "carryingCapacity": 10,
      "degradationRate": 0.1,
      "belowCapacityHealthUpdateStrategy": "Constant",
      "aboveCapacityHealthUpdateStrategy": "Linear",
      "numUsers": 2,
      "numCows": 10,
      "createDate": "2023-08-07T01:12:54.765+00:00"
    },
    twoReportLines: [
      
        {
          "id": 5,
          "reportId": 5,
          "userId": 1,
          "username": "Phill Conrad",
          "totalWealth": 9745,
          "numOfCows": 3,
          "avgCowHealth": 100,
          "cowsBought": 3,
          "cowsSold": 0,
          "cowDeaths": 0,
          "createDate": "2023-08-07T01:12:54.767+00:00"
        },
        {
          "id": 6,
          "reportId": 5,
          "userId": 2,
          "username": "Phillip Conrad",
          "totalWealth": 9335,
          "numOfCows": 7,
          "avgCowHealth": 100,
          "cowsBought": 7,
          "cowsSold": 0,
          "cowDeaths": 0,
          "createDate": "2023-08-07T01:12:54.767+00:00"
        }
      
    ],
}

export default reportLineFixtures;
