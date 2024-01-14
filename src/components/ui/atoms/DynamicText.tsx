import { useEffect, useState } from 'react';
import style from './DynamicText.module.css';

interface Props {
  words: string[];
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}
const DynamicText = ({ words, tag }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[currentIndex]);

  const Tag = tag;

  useEffect(() => {
    const startAnimation = () => {
      let i = 0;
      return setInterval(() => {
        i++;
        setCurrentIndex(i % words.length);
      }, 3000);
    };

    let intervalId = startAnimation();

    // // Limpiar intervalo cuando el componente se desmonta o la pestaña está oculta
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        intervalId = startAnimation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const wordForReplace = words[currentIndex];

    if (wordForReplace.length === currentWord.length) {
      let i = 0;

      const intervalo = setInterval(() => {
        setCurrentWord((prev) => {
          const newWord = prev.split('');
          newWord[i] = wordForReplace[i];
          i++;

          if (i === wordForReplace.length) {
            clearInterval(intervalo);
          }

          return newWord.join('');
        });
      }, 50);
    } else {
      let i = 0;

      const intervalo = setInterval(() => {
        setCurrentWord((prev) => {
          const newWord = prev.split('');
          if (i >= wordForReplace.length) {
            newWord.splice(i, newWord.length - i);
            clearInterval(intervalo);
          } else {
            newWord[i] = wordForReplace[i];
            i++;
          }
          return newWord.join('');
        });
      }, 50);
    }
  }, [currentIndex]);

  return <Tag className={style.dynamicText}>{currentWord}</Tag>;
};

export default DynamicText;
