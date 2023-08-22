import getBackgroundImage from "main/components/Utils/HomePageBackground";


describe("HomePageBackground tests", () => {
    test("expect correct morning background", () => {

        for(let i = 6; i < 9; i++) {
            expect(getBackgroundImage(i)).toEqual('HomePageBackground-morning.png');
        }
    });

    test("expect correct day background", () => {

        for (let i = 9; i < 18; i++) {
            expect(getBackgroundImage(i)).toEqual('HomePageBackground-day.png');
        }
    });

    test("expect correct evening background", () => {

        for (let i = 18; i < 21; i++) {
            expect(getBackgroundImage(i)).toEqual('HomePageBackground-evening.png');
        }
    });

    test("expect correct night background", () => {

        for (let i = 21; i < 24; i++) {
            expect(getBackgroundImage(i)).toEqual('HomePageBackground-night.png');
        }

        for (let i = 0; i < 6; i++) {
            expect(getBackgroundImage(i)).toEqual('HomePageBackground-night.png');
        }
    });
});