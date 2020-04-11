import clearDayIcon from '../client/images/clear-day.png';
import clearNightIcon from '../client/images/clear-night.png';
import cloudyIcon from '../client/images/cloudy.png';
import fogIcon from '../client/images/fog.png';
import partlyCloudyDayIcon from '../client/images/partly-cloudy-day.png';
import partlyCloudyNightIcon from '../client/images/partly-cloudy-night.png';
import rainIcon from '../client/images/rain.png';
import sleetIcon from '../client/images/sleet.png';
import snowIcon from '../client/images/snow.png';
import windIcon from '../client/images/wind.png';

const icons = {
  'clear-day': clearDayIcon,
  'clear-night': clearNightIcon,
  'partly-cloudy-day': partlyCloudyDayIcon,
  'partly-cloudy-night': partlyCloudyNightIcon,
  'cloudy': cloudyIcon,
  'rain': rainIcon,
  'sleet': sleetIcon,
  'snow': snowIcon,
  'wind': windIcon,
  'fog': fogIcon,
};

export const getIcon = (iconName) => {
  return icons[iconName];
};
