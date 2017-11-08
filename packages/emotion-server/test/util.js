/* eslint-env jest */
import React from 'react'
import { parse, stringify } from 'css'

export const getComponents = (
  { fontFace, injectGlobal, keyframes, css },
  { default: styled }
) => {
  const color = 'red'

  fontFace`
    font-family: 'Patrick Hand SC';
    font-style: normal;
    font-weight: 400;
    src: local('Patrick Hand SC'), local('PatrickHandSC-Regular'), url(https://fonts.gstatic.com/s/patrickhandsc/v4/OYFWCgfCR-7uHIovjUZXsZ71Uis0Qeb9Gqo8IZV7ckE.woff2) format('woff2');
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  `

  const bounce = keyframes`
    from, 20%, 53%, 80%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,0,0);
    }

    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
      transform: translate3d(0, -30px, 0);
    }

    70% {
      animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
      transform: translate3d(0, -15px, 0);
    }

    90% {
      transform: translate3d(0,-4px,0);
    }
  `

  const hoverStyles = css`
    color: hotpink;
    &:hover {
      color: white;
      background-color: lightgray;
      border-color: aqua;
      box-shadow: -15px -15px 0 0 aqua, -30px -30px 0 0 cornflowerblue;
    }
  `

  const Main = styled.main`
    ${hoverStyles};
    display: flex;
  `

  const Image = styled.img`
    animation: ${bounce};
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background-color: ${color};
  `

  // this will not be included since it's not used
  css`
    display: none;
  `

  // this will be included in both because it doesn't have the css- prefix

  injectGlobal`
    .no-prefix {
      display: flex;
      justify-content: center;
    }
  `

  const Page1 = () => (
    <Main>
      <Image size={30} />
      <Image size={100} />
      <Image />
    </Main>
  )

  const Page2 = () => (
    <Main>
      <div>Hello</div>
    </Main>
  )
  return { Page1, Page2 }
}

const maxColors = Math.pow(16, 6)

export const createBigComponent = ({ injectGlobal, css }) => {
  const BigComponent = ({ count }) => {
    if (count === 0) return null
    injectGlobal`
    .some-global-${count} {
      padding: 0;
      margin: ${count};
    }`
    return (
      <div
        className={css({
          color:
            '#' +
            Math.round(1 / count * maxColors)
              .toString(16)
              .padStart(6, '0')
        })}
      >
        woah there
        <span>hello world</span>
        <BigComponent count={count - 1} />
      </div>
    )
  }
  return BigComponent
}

export const prettyifyCritical = ({ html, css, ids }) => {
  return { css: stringify(parse(css)), ids, html }
}

export const getCssFromChunks = document => {
  const chunks = Array.from(
    document.head.querySelectorAll('[data-emotion-chunk]')
  )
  expect(document.body.querySelector('[data-emotion-chunk]')).toBeNull()
  return stringify(parse(chunks.map(chunk => chunk.textContent || '').join('')))
}

export const getInjectedRules = ({ inserted }) =>
  stringify(
    parse(
      Object.keys(inserted)
        .filter(hash => inserted[hash] !== true)
        .map(hash => inserted[hash])
        .join('')
    )
  )