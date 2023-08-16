import getBackgroundImage from "main/components/Utils/HomePageBackground";


describe("HomePageBackground tests", () => {
    test("grabs correct images", () => {
        const time = new Date().getHours();
        if (time >= 6 && time < 9) {
            expect(getBackgroundImage()).toEqual('HomePageBackground-morning.png');
        } else if (time >= 9 && time < 18) {
            expect(getBackgroundImage()).toEqual('HomePageBackground-day.png');
        } else if (time >= 18 && time < 21) {
            expect(getBackgroundImage()).toEqual('HomePageBackground-evening.png');
        } else {
            expect(getBackgroundImage()).toEqual('HomePageBackground-night.png');
        }
    });
});