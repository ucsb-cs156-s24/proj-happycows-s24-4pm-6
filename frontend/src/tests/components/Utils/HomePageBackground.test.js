import getBackgroundImage from "main/components/Utils/HomePageBackground";


describe("HomePageBackground tests", () => {
    test("grabs correct images", () => {
        expect(getBackgroundImage(7)).toEqual('HomePageBackground-morning.png');
        expect(getBackgroundImage(12)).toEqual('HomePageBackground-day.png');
        expect(getBackgroundImage(19)).toEqual('HomePageBackground-evening.png');
        expect(getBackgroundImage(2)).toEqual('HomePageBackground-night.png');
    });
});