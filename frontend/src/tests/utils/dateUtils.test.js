import { padWithZero, timestampToDate, daysSinceTimestamp, formatTime } from "main/utils/dateUtils";


describe("dateUtils tests", () => {

  describe("padWithZero tests", () => {

    test("pads when less than 10", () => {
      expect(padWithZero(0)).toBe("00");
      expect(padWithZero(1)).toBe("01");
      expect(padWithZero(9)).toBe("09");

    });

    test("does not pad with 10 or greater", () => {
      expect(padWithZero(10)).toBe(10);
      expect(padWithZero(11)).toBe(11);
    });

  });

  describe("timestampToDate tests", () => {
    it("converts properly", () => {
      expect(timestampToDate(1653346250816)).toBe("2022-05-23");
    });
  });

  describe("daysSinceTimestamp tests", () => {
    it("calculates days properly", () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-06-01'));
      expect(daysSinceTimestamp(1653346250816)).toBe(9);
    });
  });

  describe("formatTime tests", () => {
    it('should return empty string for null input', () => {
      expect(formatTime(null)).toEqual('');
    });

    it('should return `Online now` for less than 2 minutes', () => {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
      expect(formatTime(oneMinuteAgo)).toEqual('Online now');
    });
  
    it('should return minutes ago format', () => {
      const thirtyMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      expect(formatTime(thirtyMinutesAgo)).toEqual('2 minutes ago');
    });
  
    it('should return hours ago format', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatTime(threeHoursAgo)).toEqual('3 hours ago');
    });
  
    it('should return 1 hour ago for 1 hour', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      expect(formatTime(oneHourAgo)).toEqual('1 hour ago');
    });
  
    it('should return days ago format', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatTime(twoDaysAgo)).toEqual('2 days ago');
    });
  
    it('should return 1 day ago for 1 day', () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(formatTime(oneDayAgo)).toEqual('1 day ago');
    });
  
    it('should return date string for over a week', () => {
      const twoWeeksAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      expect(formatTime(twoWeeksAgo.toISOString())).toEqual(twoWeeksAgo.toLocaleDateString());
    });
  })
});
