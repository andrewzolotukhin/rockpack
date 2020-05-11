import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import styles from './styles.modules.scss';

export const RightBar = ({ children }: { children: JSX.Element }): JSX.Element => {
  useStyles(styles);

  return (
    <div className={styles['right-bar']}>
      {children}
    </div>
  );
};