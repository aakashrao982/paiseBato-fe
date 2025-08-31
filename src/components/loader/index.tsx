import React, { type FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { type LoaderProps } from './loader.types';
import styles from './loader.module.scss';
import { GIF_URL } from './loader.constants';

const Loader: FC<LoaderProps> = ({
  loaderText = 'Just a moment please...',
  show
}) => {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild || typeof window === 'undefined') {
    return null;
  }
  const loading = show ? (
    <div className={styles.loaderBackdrop}>
      <div className={styles.loaderContainer}>
        <img src={GIF_URL} className={styles.loaderGif} />
        <div className={styles.loaderText}>
          {loaderText.includes('\n')
            ? loaderText.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={index > 0 ? styles.loaderTextSmall : undefined}
                >
                  {line}
                </div>
              ))
            : loaderText}
        </div>
      </div>
    </div>
  ) : null;

  return ReactDOM.createPortal(loading, document.body);
};

export default Loader;
