/*
For the guide CSS, we want to do the following when building the app:
1. For reliable cache busting, add a hash to the CSS file and the font files it uses.
2. Keep the files as separate chunks so that we can load them only when a particular guide is viewed.

Vite has 2 ways of handling static assets that will hash the files:
1. Use an import statement, i.e. import css from './guide.css'. However, this will bundle it into the main .css file,
   and it's difficult to configure Vite/Rollup to split it into a separate file instead.
2. Use new URL, i.e. const css = new URL('./guide.css', import.meta.url).href. While this will split the CSS into a
   separate file, it won't follow the URLs in the CSS file itself, so the font files are excluded from the build.

To work around this, we use import.meta.glob(). By default it lazy loads assets, so each file will be built into a
separate file. It also returns functions that we can call to import assets, but we can't use them because while the
function will automatically add a <link rel="stylesheet"> to the CSS file, there's no way to remove it afterwards if the
user is switching to another guide. We work around this second issue by using the new URL, which gives us the URL
to the correct CSS file and we can manually add a <link>.
 */
import.meta.glob('/src/assets/**/*.css')

export const aircraftLookup = {
  dcs: {
    'a-10c': {
      title: 'A-10C',
      subtitle: 'Warthog',
      path: 'aircraft/dcs/a-10c',
      hash: 'a841cb9d048a429e365fa703a9b131c3',
      cssUrl: new URL('/src/assets/aircraft/dcs/a-10c/guide.css', import.meta.url).href,
      pageCount: 522,
      hasOutline: true,
    },
    'av-8b': {
      title: 'AV-8B',
      subtitle: 'Harrier II',
      path: '/aircraft/dcs/av-8b',
      cssPath: new URL('/src/assets/aircraft/dcs/av-8b/guide.css', import.meta.url).href,
      imgSrc: '/src/assets/img/dcs/AV-8B.webp',
    },
    'f-14b': {
      title: 'F-14B',
      subtitle: 'Tomcat',
      path: '/aircraft/dcs/f-14b',
      imgSrc: '/src/assets/img/dcs/F-14B.webp',
    },
    'f-16cm': {
      title: 'F-16CM',
      subtitle: 'Viper',
      path: '/aircraft/dcs/f-16cm',
      imgSrc: '/src/assets/img/dcs/F-16CM.webp',
    },
    'fa-18c': {
      title: 'F/A-18C',
      subtitle: 'Hornet',
      path: '/aircraft/dcs/fa-18c',
      imgSrc: '/src/assets/img/dcs/FA-18C.webp',
    },
    'jf-17': {
      title: 'JF-17',
      subtitle: 'Thunder',
      path: '/aircraft/dcs/jf-17',
      imgSrc: '/src/assets/img/dcs/JF-17.webp',
    },
    'm-2000c': {
      title: 'Mirage 2000C',
      path: '/aircraft/dcs/m-2000c',
      imgSrc: '/src/assets/img/dcs/M-2000C.webp',
    },
  },
}

export default {
  DcsModern: [
    aircraftLookup.dcs['a-10c'],
    aircraftLookup.dcs['av-8b'],
    aircraftLookup.dcs['f-14b'],
    aircraftLookup.dcs['f-16cm'],
    aircraftLookup.dcs['fa-18c'],
    aircraftLookup.dcs['jf-17'],
    aircraftLookup.dcs['m-2000c'],
  ],
  DcsColdWar: [
    {
      title: 'AJS-37',
      subtitle: 'Viggen',
      path: '/aircraft/dcs/ajs-37',
      imgSrc: '/src/assets/img/dcs/AJS-37.webp',
    },
    {
      title: 'F-5E3',
      subtitle: 'Tiger II',
      path: '/aircraft/dcs/f-5e3',
      imgSrc: '/src/assets/img/dcs/F-5E3.webp',
    },
    {
      title: 'F-86F',
      subtitle: 'Sabre',
      path: '/aircraft/dcs/f-86f',
      imgSrc: '/src/assets/img/dcs/F-86F.webp',
    },
    {
      title: 'Mig-15bis',
      path: '/aircraft/dcs/mig-15bis',
      imgSrc: '/src/assets/img/dcs/MiG-15bis.webp',
    },
    {
      title: 'MiG-19P',
      path: '/aircraft/dcs/mig-19p',
      imgSrc: '/src/assets/img/dcs/MiG-19P.webp',
    },
    {
      title: 'Mig-21bis',
      path: '/aircraft/dcs/mig-21bis',
      imgSrc: '/src/assets/img/dcs/MiG-21bis.webp',
    },
  ],
  DcsHelicopters: [],
}
