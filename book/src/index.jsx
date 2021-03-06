import React from 'react';
import createDocumentation from '../generator';
import logo from './assets/header-logo.svg';
import Rockpack from './Pages/Rockpack';
import FastSetup from './Pages/Fast-setup';
// eslint-disable-next-line no-unused-vars
import LogDrivenDevelopment from './Pages/Log-Driven-Development';
// eslint-disable-next-line no-unused-vars
import LocalizationTrueWay from './Pages/Localization-True-Way';
// eslint-disable-next-line no-unused-vars
import SSR1Basic from './Pages/SSR-1-Creating-simple-SSR-application';
// eslint-disable-next-line no-unused-vars
import SSR2Migration from './Pages/SSR-2-Migration-legacy-app-to-SSR';
// eslint-disable-next-line no-unused-vars
import SSR3Advanced from './Pages/SSR-3-Advanced-Techniques';

createDocumentation({
  logo,
  logoAlt: 'Rockpack',
  docgen: [
    Rockpack,
    FastSetup,
    {
      title: 'Articles:',
      menuOnly: true,
    },
    //SSR1Basic,
    //SSR2Migration,
    //SSR3Advanced,
    //LogDrivenDevelopment,
    //LocalizationTrueWay,
  ],
  title: 'Rockpack',
  github: 'https://github.com/AlexSergey/rockpack',
  footer: <div>License MIT, 2020</div>,
  ga: 'UA-155200418-1',
}, document.getElementById('root'));
