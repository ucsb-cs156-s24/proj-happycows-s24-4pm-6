import BackgroundDay from './../../../assets/HomePageBackground-day.png';
import BackgroundEvening from './../../../assets/HomePageBackground-evening.png';
import BackgroundMorning from './../../../assets/HomePageBackground-morning.png';
import BackgroundNight from './../../../assets/HomePageBackground-night.png';

// istanbul ignore next: trivial function to ignore from coverage due to how it is structured. Should be refactored in the future so that it can be tested.
export default function getBackgroundImage(time) {
    if (time >= 6 && time < 9) {
      return BackgroundMorning;
    } else if (time >= 9 && time < 18) {
      return BackgroundDay;
    } else if (time >= 18 && time < 21) {
      return BackgroundEvening;
    } else {
      return BackgroundNight;
    }
  }