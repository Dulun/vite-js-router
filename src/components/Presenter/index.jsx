import React from 'react'
import classnames from 'classnames'

// import {
//   SIDER_WIDTH,
//   LEFT_CONTENT_WIDTH,
//   COLLPSED_LEFT_CONTENT_WIDTH,
// } from '@constant/app'
// import ErrorBoundary from '../error-boundary'
import styles from './index.module.scss'

const SIDER_WIDTH = 100
const LEFT_CONTENT_WIDTH = 100
const COLLPSED_LEFT_CONTENT_WIDTH = 50

const ErrorBoundary = (props) => {
  return <div>ErrorBoundary</div>
}

const PresenterEvent = {
  willEnter: 'willEnter',
  willLeave: 'willLeave',
  didEnter: 'didEnter',
  didLeave: 'didLeave',
  focus: 'focus',
  blur: 'blur',
}

// const SAFE_TRANSITION_DURATION = 200
// const D3_SHIFTING = {
//   x: 36,
//   y: 32,
// }

class Presenter extends React.Component {
  // static propTypes = {
  //   absolute: PropTypes.bool,
  //   leaving: PropTypes.bool,
  //   ex: PropTypes.bool,
  //   children: PropTypes.node,
  //   animate: PropTypes.bool,
  //   animateEnter: PropTypes.bool,

  //   willLeave: PropTypes.func,
  //   willEnter: PropTypes.func,
  //   didLeave: PropTypes.func,
  //   didEnter: PropTypes.func,
  //   onEventChanged: PropTypes.func,

  //   close: PropTypes.func,
  //   componentRender: PropTypes.oneOfType([
  //     PropTypes.func,
  //     PropTypes.node,
  //   ]),
  //   setRequestCloseCallback: PropTypes.func,

  //   __isValidTop: PropTypes.bool,

  //   // demo
  //   d3: PropTypes.bool,
  //   idx: PropTypes.number,
  // }

  static defauleProps = {
    absolute: false,
    leaving: false,
    animate: true,
    animateEnter: true,
  }

  constructor(props) {
    super(props)

    let { animateEnter, setRequestCloseCallback, idx } =
      props

    this.state = {
      // shiftX: 100,
      // shiftY: 0,
      animateEnter: !!animateEnter,
      shifting: {
        x: animateEnter ? 100 : 0,
        y: 0,
      },
      leaving: false,

      animateState: null,

      active: false,
      d3Top: false,

      __isValidTop: props.__isValidTop,
    }

    this._willLeaveCalled = false
    this._didLeaveCalled = false
    this._didEnterCalled = false

    this._isFirst = idx === 0

    // v2
    this.eventChangeCallback = null
    this.didLeaveCallback = null
    this._render = props.componentRender

    // v2 - presneter
    if (typeof props.componentRender === 'function') {
      let self = this
      const lifeCycle = {
        get isOpen() {
          return self.state.isOpen
        },
        onRequestClose: (callback) => {
          setRequestCloseCallback(callback)
        },
        close: (callback) => {
          self.props.close(callback)
        },
        onEventChanged: (callback) => {
          self.eventChangeCallback = callback
        },
      }

      this._render = props.componentRender(lifeCycle)
    }

    // focus
    if (props.__isValidTop) {
      this._callEvent(PresenterEvent.focus)
    }
  }

  componentWillUnmount() {
    this._callEvent(PresenterEvent.blur)
    this._callEvent(PresenterEvent.willLeave)
    this._callEvent(PresenterEvent.didLeave)
  }

  componentDidMount() {
    let { animateEnter, willEnter, __uid } = this.props

    // willEnter
    setTimeout(() => {
      willEnter && willEnter(__uid)
      this._stateChanged(PresenterEvent.willEnter)

      this.callAnimationV2()
    }, 0)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // willLeave
    if (!!prevState.leaving !== !!this.state.leaving) {
      if (this.state.leaving) {
        this._callEvent(PresenterEvent.willLeave)
      }
      this.callAnimationV2()
    }

    // focus & blur
    if (
      prevState.__isValidTop !== this.state.__isValidTop
    ) {
      if (this.state.__isValidTop) {
        this._callEvent(PresenterEvent.focus)
      } else {
        this._callEvent(PresenterEvent.blur)
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {}
    if (!!props.leaving !== !!state.leaving) {
      newState.leaving = !!props.leaving
    }

    if (props.__isValidTop !== state.__isValidTop) {
      newState.__isValidTop = !!props.__isValidTop
    }

    return Object.keys(newState).length > 0
      ? newState
      : null
  }

  _stateChanged = (event = null) => {
    let { onEventChanged, __uid } = this.props
    let { eventChangeCallback } = this // v2-presenter
    let resetEnter = false

    // v2 - presenter
    if (
      event &&
      PresenterEvent[event] &&
      eventChangeCallback &&
      typeof eventChangeCallback === 'function'
    ) {
      eventChangeCallback(event)

      if (event === PresenterEvent.didLeave) {
        // temp: v2
        if (
          this.didLeaveCallback &&
          typeof this.didLeaveCallback === 'function'
        ) {
          this.didLeaveCallback()
        }
      }
    }
    if (
      PresenterEvent[event] === PresenterEvent.didEnter ||
      PresenterEvent[event] === PresenterEvent.willLeave
    ) {
      this.setState({
        isOpen:
          PresenterEvent[event] === PresenterEvent.didEnter,
      })
    }

    // v3
    if (
      event &&
      PresenterEvent[event] &&
      onEventChanged &&
      typeof onEventChanged === 'function'
    ) {
      onEventChanged(PresenterEvent[event], __uid)
    }

    // v3 - flags: call by animate
    if (PresenterEvent[event] === PresenterEvent.didLeave) {
      this._didLeaveCalled = true
    }
    if (
      PresenterEvent[event] === PresenterEvent.willLeave
    ) {
      this._willLeaveCalled = true
    }
    if (PresenterEvent[event] === PresenterEvent.didEnter) {
      this._didEnterCalled = true
      resetEnter = true
    }

    this.setState({
      animateState: event,

      // reset enter payload(remove class)
      animateEnter: resetEnter
        ? true
        : this.state.animateEnter,
    })
  }

  callAnimationV2 = () => {
    this.setState(
      {
        active: !this.state.leaving,
      },
      () => {
        let { animateEnter, active } = this.state
        let { animate } = this.props
        let { x, y } = this.state.shifting
        x = active ? 0 : 100

        if (!animateEnter && !this._didEnterCalled) {
          x = 0
          this._callEvent(PresenterEvent.didEnter)
        }

        if (!animate) {
          x = active ? 0 : 100
        }
        this.setState(
          {
            shifting: { x, y },
          },
          () => {
            setTimeout(() => {
              let { x, y } = this.state.shifting
              if (!animate) {
                this._callEvent(
                  x === 0
                    ? PresenterEvent.didEnter
                    : PresenterEvent.didLeave
                )
              }
            })
          }
        )
      }
    )
  }

  _callEvent = (event) => {
    let {
      didEnter,
      didLeave,
      willLeave,
      __uid,
      onFocus,
      onBlur,
    } = this.props
    setTimeout(() => {
      // action-events
      if (event === PresenterEvent.didEnter) {
        if (!this._didEnterCalled) {
          didEnter && didEnter(__uid)
          this._stateChanged(PresenterEvent.didEnter)
          this._didEnterCalled = true
        }
      }
      if (event === PresenterEvent.didLeave) {
        if (!this._didLeaveCalled) {
          didLeave && didLeave(__uid)
          this._stateChanged(PresenterEvent.didLeave)
          this._didLeaveCalled = true
        }
      }
      if (event === PresenterEvent.willLeave) {
        if (!this._willLeaveCalled) {
          willLeave && willLeave(__uid)
          this._stateChanged(PresenterEvent.willLeave)
          this._willLeaveCalled = true
        }
      }

      // focus & blur
      if (event === PresenterEvent.focus) {
        onFocus && onFocus(__uid)
        this._stateChanged(PresenterEvent.focus)
      }
      if (event === PresenterEvent.blur) {
        onBlur && onBlur(__uid)
        this._stateChanged(PresenterEvent.blur)
      }
    }, 0)
  }

  handleTransitionEnd = (e) => {
    if (
      e.target.isSameNode(e.currentTarget) &&
      (e.propertyName === 'transform' ||
        e.propertyName === 'opacity') // first
    ) {
      const enter = this.state.shifting.x === 0

      if (enter) {
        this._callEvent(PresenterEvent.didEnter)
      } else {
        this._callEvent(PresenterEvent.didLeave)
      }
    }
  }
  // todo: d3.mask.over
  handleMaskOver = (e) => {
    // console.log('x', this.props.__uid);
  }
  handleMaskClick = (e) => {
    this.props.closeUtil(this.props.__uid)
  }

  handleBodyClick = (e) => {
    e.stopPropagation()
    // this.props.closeUtil(null);
  }

  render() {
    let { shifting } = this.state
    let { x, y } = shifting
    let {
      absolute = false,
      ex = false,
      leftContentCollapse = false,
      _ref,
      animate = false,
      __uid,
      idx,
      leftContentCollapsedExpand,
    } = this.props
    let presenterClassNames = classnames(styles.presenter, {
      [styles.absolute]: absolute,
    })

    /*
     * 的绝对定位时left值和宽度
     * left:
     * 1. 第一个presenter{left: 208}
     * 2. 不是第一个 且 当前leftcontent 收缩没有被点击展开 left 为 208+51
     * 3. 其他情况 left: 208+191
     * width: 为 calc(100% - left)
     */
    const absoluteLeft = ex
      ? SIDER_WIDTH
      : this._isFirst
      ? SIDER_WIDTH
      : leftContentCollapse && !leftContentCollapsedExpand
      ? SIDER_WIDTH + COLLPSED_LEFT_CONTENT_WIDTH
      : SIDER_WIDTH + LEFT_CONTENT_WIDTH

    let absolutePageStyles = absolute
      ? {
          left: absoluteLeft,
          width: `calc(100% - ${absoluteLeft}px)`,
          ...(animate && {
            transform: `translate3d(${
              this._isFirst ? 0 : x
            }%, ${y}%, 0)`,
          }),
          zIndex: this.state.d3Top ? 2 : 1,

          ...(this.props.d3 && {
            transform: `translate3d(${
              -(this.props.idx + 1) * 36
            }px, ${
              (this.props.idx + 1) * 48
            }px, 0px) rotate3d(0,1,0, -15deg) scale(${
              (0.7 * (100 - x)) / 100
            })`,
            boxShadow: '0 0 32px rgba(0,0,0, .2)',
            // transitionDelay: (this.props.idx + 1) * .1 + 's'
            // filter: `blur(${(this.props.allCount - this.props.idx - 1) * 1}px)`
          }),
          opacity: x === 100 ? 0 : 1,
        }
      : {}

    // append data
    const children = React.cloneElement(this._render, {
      __isTop: this.props.__isTop,
      __isValidTop: this.props.__isValidTop,
      __uid: this.props.__uid,
    })

    return (
      <>
        {absolute && (
          <div
            className={styles.mask}
            onMouseOver={this.handleMaskOver}
            onClick={this.handleMaskClick}
            style={{
              ...absolutePageStyles,
              transform: this.props.d3
                ? `translate3d(${-this.props.idx * 36}px, ${
                    this.props.idx * 32
                  }px, 0px) rotate3d(0,1,0, -15deg) scale(.7)`
                : 'none',
              boxShadow: 'none',
              // zIndex: this.props.d3 ? 2 : absolutePageStyles.zIndex
            }}
          />
        )}
        <div
          className={presenterClassNames}
          style={{
            backgroundColor: 'rgba(#F4F4F4)',
            flex: 1,
            // height: '100vh',
            // opacity: (100 - Math.max(x, y)) / 100,
            ...absolutePageStyles,
          }}
          ref={_ref}
          onTransitionEnd={this.handleTransitionEnd}
          onClick={
            this.props.d3 &&
            this.props.idx === this.props.allCount - 1
              ? this.handleBodyClick
              : null
          }
        >
          <ErrorBoundary>{children}</ErrorBoundary>
          {!this._isFirst &&
            leftContentCollapse &&
            leftContentCollapsedExpand &&
            this.props.__isTop && (
              <div
                className={styles.presenterMask}
                onClick={() => {
                  this.props.setLeftContentCollapsedExpand(
                    false
                  )
                }}
              />
            )}
        </div>
      </>
    )
  }
}

export default Presenter
