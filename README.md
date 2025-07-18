Hi! This application is meant to be an athan app ONLY for Windows 10/11 desktops. 

## Motivation

I saw a real lack of easy to use, uncomplicated, Athan Apps specifically for windows computers. For phones there are a plethora of apps but like Athan, Athan Utilities, Muslim Pro and so much more, and with macbooks, those notifications can pop up for them. So i thought I'd create something really small just for desktops.

## Behind the Scenes

This application uses (Electron)[https://www.electronjs.org] to enable desktop apps using HTML, CSS, and JS. All I'm doing in this application is gathering __**(locally saved)**__ via (GeoJS)[https://www.geojs.io] your location and then using the (Al Adhan)[https://aladhan.com] prayer times api to get that locations prayer times. Then it parses the data to be readable easily and when the sysem clock reaches that time, it sends a notification. The applciation also will run in your `tray` after being closed, so it'll still be able to send notifications

## Configurables

There are essentially 2 settings pages, one is asking whether or not your `Hanafi` because of the Asr delay, your `Calculation method` and your `High Latitude Rule`. These settings are specific to getting the accurate Adhan timings. The next settings page is to `enable` or `disable` each and every one of the Salah's, including Sunrise.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Al Adhan API](https://aladhan.com) for providing accurate prayer time calculations
- [GeoJS](https://www.geojs.io) for location detection services
- [Electron](https://www.electronjs.org) for the cross-platform framework
- The Muslim community and Friends for feedback and support

## Support

- **Issues**: [GitHub Issues](https://github.com/NumairHussain/AthanApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NumairHussain/AthanApp/discussions)
- **Email**: [Contact via GitHub](https://github.com/NumairHussain)


## Privacy & Data

- **Location Data**: Only used locally for prayer time calculations, not transmitted or stored remotely
- **Prayer Times**: Fetched from Al Adhan API based on your location
- **Settings**: Stored locally on your device using Electron's secure storage
- **No Analytics**: No user tracking or analytics collection


*Made with ❤️ for the Muslim community*