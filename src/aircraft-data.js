export const aircraftLookup = {
  dcs: {
    'a-10c': {
      title: 'A-10C',
      subtitle: 'Warthog',
      href: '/aircraft/dcs/a-10c',
      pageCount: 522,
      hasOutline: true,
    },
    'av-8b': {
      title: 'AV-8B',
      subtitle: 'Harrier II',
      href: '/aircraft/dcs/av-8b',
      imgSrc: '/src/assets/img/dcs/AV-8B.webp',
    },
    'f-14b': {
      title: 'F-14B',
      subtitle: 'Tomcat',
      href: '/aircraft/dcs/f-14b',
      imgSrc: '/src/assets/img/dcs/F-14B.webp',
    },
    'f-16cm': {
      title: 'F-16CM',
      subtitle: 'Viper',
      href: '/aircraft/dcs/f-16cm',
      imgSrc: '/src/assets/img/dcs/F-16CM.webp',
    },
    'fa-18c': {
      title: 'F/A-18C',
      subtitle: 'Hornet',
      href: '/aircraft/dcs/fa-18c',
      imgSrc: '/src/assets/img/dcs/FA-18C.webp',
    },
    'jf-17': {
      title: 'JF-17',
      subtitle: 'Thunder',
      href: '/aircraft/dcs/jf-17',
      imgSrc: '/src/assets/img/dcs/JF-17.webp',
    },
    'm-2000c': {
      title: 'Mirage 2000C',
      href: '/aircraft/dcs/m-2000c',
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
      href: '/aircraft/dcs/ajs-37',
      imgSrc: '/src/assets/img/dcs/AJS-37.webp',
    },
    {
      title: 'F-5E3',
      subtitle: 'Tiger II',
      href: '/aircraft/dcs/f-5e3',
      imgSrc: '/src/assets/img/dcs/F-5E3.webp',
    },
    {
      title: 'F-86F',
      subtitle: 'Sabre',
      href: '/aircraft/dcs/f-86f',
      imgSrc: '/src/assets/img/dcs/F-86F.webp',
    },
    {
      title: 'Mig-15bis',
      href: '/aircraft/dcs/mig-15bis',
      imgSrc: '/src/assets/img/dcs/MiG-15bis.webp',
    },
    {
      title: 'MiG-19P',
      href: '/aircraft/dcs/mig-19p',
      imgSrc: '/src/assets/img/dcs/MiG-19P.webp',
    },
    {
      title: 'Mig-21bis',
      href: '/aircraft/dcs/mig-21bis',
      imgSrc: '/src/assets/img/dcs/MiG-21bis.webp',
    },
  ],
  DcsHelicopters: [],
}
