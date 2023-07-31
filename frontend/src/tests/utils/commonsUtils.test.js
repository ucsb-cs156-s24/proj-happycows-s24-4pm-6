import { cellToAxiosParamsDelete, commonsNotJoined, onDeleteSuccess } from "main/utils/commonsUtils";
import mockConsole from "jest-mock-console";
import commonsFixtures from "fixtures/commonsFixtures";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("CommonsUtils", () => {
    describe("onDeleteSuccess", () => {
        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDeleteSuccess("abc");
            
            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsDelete", () => {
        test("It returns the correct params", () => {
            // arrange
            const cell = { row: { values: { "commons.id" : 17 } } };

            // act
            const result = cellToAxiosParamsDelete(cell);

            // assert
            expect(result).toEqual({
                url: "/api/commons",
                method: "DELETE",
                params: { id: 17 }
            });
        });
    });

    describe("commonsNotJoined", () => {
        test("it computes the correct result", () => {
            // arrange
            const allCommons = commonsFixtures.sevenCommons;
            const commonsJoined = [ allCommons[0], allCommons[2], allCommons[4] ];
            const expectedCommonsNotJoined = [ allCommons[1], allCommons[3], allCommons[5], allCommons[6] ];
           
            // act
            const result = commonsNotJoined(allCommons, commonsJoined);

            // assert
            expect(result).toEqual(expectedCommonsNotJoined);
        });
    });
});
