import React, { useEffect } from 'react';
import CustomScroll from 'react-customscroll';
import { useUssrState, useWillMount, isClient } from '../../../src';
import './styles.css';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: ['1', '2', '3'] }), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: [] });

  useWillMount(() => (
    effect()
      .then(data => {
        setState(data);
      })
  ));

  useEffect(() => {
    if (isClient()) {
      setTimeout(() => {
        document.getElementById('block-3')
          .scrollIntoView();
      }, 100);
    }
  }, []);

  return (
    <CustomScroll>
      <div>
        <h1>Items</h1>
        {state.text.map((item) => (
          <div id={`block-${item}`} style={{ height: '1000px' }} key={`block-${item}`}>
            <h2>{item}</h2>
          </div>
        ))}
      </div>
    </CustomScroll>
  );
};
