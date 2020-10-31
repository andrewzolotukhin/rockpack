import React from 'react';
import { Helmet } from 'react-helmet-async';
import Logo from './logo.component.svg';

const Home = () => (
  <>
    <Helmet>
      <title>Home Page</title>
      <meta name="description" content="Home page" />
    </Helmet>
    <div>
      <Logo />
      <p>
        This project generated by
        {' '}
        <strong>Rockpack</strong>
        . Please read official
        {' '}
        <a
          href="https://www.rockpack.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentation
        </a>
        .
      </p>
    </div>
  </>
);

export default Home;
