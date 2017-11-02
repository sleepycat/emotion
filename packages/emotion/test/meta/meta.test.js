import React from 'react'
import renderer from 'react-test-renderer'
import { css, flush, sheet } from 'emotion'

describe('meta', () => {
  afterEach(() => flush())
  test('css generated class name should have the correct id', () => {
    const cls1 = css`
      color: blue;
    `
    const cls2 = css`
      & .${cls1} {
        color: red;
      }
    `
    const tree = renderer
      .create(
        <div className={cls2}>
          <div className={cls1} />
        </div>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(sheet).toMatchSnapshot()
  })

  test('css prop correctly adds the id', () => {
    const SFC = () => {
      return <div css={`display: flex;`}>Hello</div>
    }

    class ClsComp extends React.Component {
      render() {
        return <div css={`display: grid;`}>Hello</div>
      }
    }

    const hoc = W =>
      class extends React.Component {
        render() {
          return (
            <div css={`display: block;`}>
              <W {...this.props} />
            </div>
          )
        }
      }

    const Wrapped = hoc(ClsComp)

    const sfcTree = renderer.create(<SFC>Hello</SFC>).toJSON()
    expect(sfcTree).toMatchSnapshot()

    const clsCompTree = renderer.create(<ClsComp>Hello</ClsComp>).toJSON()
    expect(clsCompTree).toMatchSnapshot()

    const hocTree = renderer.create(<Wrapped>Hello</Wrapped>).toJSON()
    expect(hocTree).toMatchSnapshot()

    expect(sheet).toMatchSnapshot()
  })
})