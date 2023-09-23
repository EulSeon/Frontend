import { createGlobalStyle } from 'styled-components';
import '../static/fonts/Font.css';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: SUIT;
  }

  input {
    outline: none;
    border: none;
   }

   button {
    outline: none;
    border: none;
   }

   textarea {
    resize: none;
    outline: none;
    border: none;
   }

   li {
    list-style: none;
   }
`;

export default GlobalStyle;
