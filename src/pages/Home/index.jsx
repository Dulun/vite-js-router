import React, { useEffect, useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'
import Presenter from '@/components/Presenter'
import { useAppcontext } from '@/context'
import { v4 as uuidv4 } from 'uuid'

const _presenter = () => {
  let self = this

  return {
    push(render, options = {}, routeMode = false) {
      let uid = ''

      let replaceingUid = ''

      let { key } = options
      if (key) {
        uid = key + '___SLASH___' + uuidv4()

        // todo: update uidStack to [{ uid, key, ...rest }, {}]
        // if (self.uidStack.find((x) => x === key)) {
        replaceingUid = self.uidStack.find((x) =>
          x.match(new RegExp('^' + key + '___SLASH___'))
        )
        if (replaceingUid) {
          // exiting /project/2 & pushing /project/x ?
          if (
            self.state.leavingUid === uid ||
            self.state.leavingUid.match(
              new RegExp('^' + key + '___SLASH___')
            )
          ) {
            console.info(
              `canceling presenter-${key} leaving`
            )
            self.saveState({
              leavingUid: '',
            })
            return
          }
          // replacing
          console.info(
            `presenter-${key}, has rendered`,
            `replacing ${replaceingUid} to ${uid}`
          )

          // return;
        } else {
        }

        // cancel first hit-page animation & reset self._initRoute to false
        if (self._initRoute) {
          options.animateEnter =
            'animateEnter' in options
              ? options.animateEnter
              : self._initRoute
              ? false
              : true
          // options.animateEnter = (self._initRoute ? false : true);
          if (self._initRoute && !options.animateEnter) {
            self._initRoute = false
          }
        }
      } else {
        uid = 'presenter_' + uuidv4()

        // hold history stack
        window.history.pushState(
          null,
          '',
          window.location.pathname
        )
      }

      let { presenters } = self.state

      let {
        onWillEnter = null,
        onWillLeave = null,
        onDidEnter = null,
        onDidLeave = null,
        onFocus = null,
        onBlur = null,
        onEventChanged = null,
        animate = true,
        animateEnter = true,
        pageTitle = '',
      } = options

      const renderComp = (
        <Presenter
          {...options}
          key={uid}
          didLeave={self.presenterDidLeave.bind(
            self,
            uid,
            onDidLeave
          )}
          didEnter={self.presenterDidEnter.bind(
            self,
            uid,
            onDidEnter
          )}
          willEnter={() => {
            // clear all modals ?
            self._context.hideAllModals()
            onWillEnter &&
              typeof onWillEnter === 'function' &&
              onWillEnter(uid)
          }}
          willLeave={() => {
            onWillLeave &&
              typeof onWillLeave === 'function' &&
              onWillLeave(uid)
          }}
          foucs={() => {
            onFocus &&
              typeof onFocus === 'function' &&
              onFocus(uid)
          }}
          blur={() => {
            onBlur &&
              typeof onBlur === 'function' &&
              onBlur(uid)
          }}
          leftContentCollapse={
            self.state.leftContentCollapse
          }
          leftContentCollapsedExpand={
            self.state.leftContentCollapsedExpand
          }
          onEventChanged={onEventChanged}
          __uid={uid}
          animate={animate}
          animateEnter={animateEnter}
          absolute
          componentRender={render}
          close={(cb) => {
            this.hide(uid, cb)
          }}
          closeUtil={(uid) => {
            this.closeUntilUid(uid)
          }}
          // v2 - lifecycle
          setRequestCloseCallback={(cb) => {
            if (typeof cb === 'function') {
              self._requestCloseCallbackMap[uid] = cb
            }
          }}
        />
      )

      if (replaceingUid) {
        let lastIdx = presenters.length - 1
        for (; lastIdx >= 0; lastIdx--) {
          // if (presenters[lastIdx].uid === uid) {
          if (presenters[lastIdx].uid === replaceingUid) {
            presenters[lastIdx].Comp = renderComp
            presenters[lastIdx].uid = uid

            console.log('qweqwe', renderComp)
            break
          }
        }
        presenters = presenters.slice(0, lastIdx + 1)

        let lastUidStackIdx = self.uidStack.findIndex(
          (id) => id === replaceingUid
        )

        self.uidStack[lastUidStackIdx] = uid
        self.uidStack = self.uidStack.slice(
          0,
          lastUidStackIdx + 1
        )

        console.log('here', lastUidStackIdx, self.uidStack)
      } else {
        if (pageTitle) {
          self.pageTitleMap.set(uid, pageTitle)
        }

        presenters.push({
          uid,
          Comp: renderComp,
        })

        // into stack
        self.uidStack.push(uid)
      }

      if (routeMode) {
        self.routeStack.push(options)
      }
      self.saveState(
        {
          presenters,
        },
        () => {
          console.log('zzzz', self.uidStack)
        }
      )
    },

    hide: (uid, cb = null) => {
      uid =
        uid ||
        this.state.presenters[
          this.state.presenters.length - 1
        ]['uid']

      /**
       * TBD:
       * bug:
       *  1. V2.close() call hide() => hiding this.uidStack[-1]
       *  2. hideOverlay.requestCloseCallback() = false (preventing backing)
       *  3. call normal hide, will hide this.uidStack[-2] (this.uidStack[-1] still on the top)
       *
       * refer: mouse back?
       *
       */
      // remove from uidStack first
      // let index = this.uidStack.findIndex(x => x === uid)
      // // if (index !== -1) {
      // //   this.uidStack.splice(index, 1)
      // // }
      this._uidStackHideCallbackMap[uid] = cb
      self._context.hideOverlay(uid)
    },
    closeUntilUid: (
      uid = null,
      closeIncludeUid = true,
      needAnimation = true
    ) => {
      const { presenters } = this.state
      const newPresenters = []
      const newUidStack = []
      const removingUids = []
      let topPresnterUid
      let skip = false
      /*
       * 目标uid之前的presenter存入newPresenters
       * 目标uid匹配的presenter根据closeIncludeUid判断是否存入newPresenters
       * 目标uid之后的presenter直接跳过
       * topPresnterUid为newPresenters中最顶层presenter的uid，用于判断是否展示动画
       */
      for (let presenter of presenters) {
        if (presenter.uid === uid) {
          if (!closeIncludeUid) {
            newPresenters.push(presenter)
            topPresnterUid = presenter.uid
          }
          break
        }
        newPresenters.push(presenter)
        topPresnterUid = presenter.uid
      }
      /*
       * 目标uid之前的uid存入newUidStack
       * 目标uid匹配的uid根据closeIncludeUid判断是存入newUidStack还是removingUids
       * 目标uid之后的uid存入removingUids
       */
      for (let item of this.uidStack) {
        if (item === uid) {
          if (!closeIncludeUid) {
            newUidStack.push(item)
          } else {
            removingUids.push(item)
          }
          skip = true
        }
        if (skip) {
          removingUids.push(item)
        } else {
          newUidStack.push(item)
        }
      }
      /*
       * leavingPresenter为原来presenters中最顶层的presenter，用于关闭presenter时展示退出动画
       * leavingPresenter的uid与topPresnterUid相等时没有presenter被关闭，不展示动画
       */
      const leavingPresenter = presenters.pop()
      const showAnimation =
        needAnimation &&
        leavingPresenter.uid !== topPresnterUid
      if (showAnimation) {
        newPresenters.push(leavingPresenter)
        newUidStack.push(leavingPresenter.uid)
      }
      this.uidStack = newUidStack
      this.setState(
        {
          presenters: newPresenters,
        },
        () => {
          if (showAnimation) {
            setTimeout(() => {
              this.setState({
                leavingUid: leavingPresenter.uid,
              })
            }, 0)
          }
          // close Maps
          if (removingUids.length > 0) {
            removingUids.forEach(
              (uid) => self._context._clearMapByUid
            )
          }

          this.setState({ d3: false })
        }
      )

      /* close one by one */
      // let lastId = self.state.presenters[self.state.presenters.length - 1]['uid'];
      // if (lastId === uid) {
      //   this.hide(lastId);
      //   return;
      // }

      // this.hide(lastId, () => {
      //   this.closeUntilUid(uid)
      // })
    },
  }
}
const Home = (props) => {
  const [showDialog, setShowDialog] = React.useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)
  const data = useLoaderData()

  const { state, setState } = useAppcontext()

  const [presenters, setPresenters] = useState([])

  useEffect(() => {
    console.log('@@@@ state', state)
  }, [state])

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className='close-button' onClick={close}>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
      <button
        onClick={() => {
          setState({
            count: state.count + 1,
            oldCount: state.count,
          })
        }}
      >
        {state.count}
      </button>

      <button
        onClick={() => {
          _presenter().push(<div>666</div>)
        }}
      >
        Presenter push
      </button>
      <p>data:</p>
      {data.data}

      {presenters.map((p, i) =>
        React.cloneElement(p.Comp, {
          // leaving: this.state.leavingUid === p.uid,
          idx: i,
          //d3: this.state.d3,
          d3: false,
          allCount: presenters.length,
          //ex: context.expandMode,
          //leftContentCollapse: context.leftContentCollapse,
          //leftContentCollapsedExpand:
          //context.leftContentCollapsedExpand,
          //setLeftContentCollapsedExpand:
          //context.setLeftContentCollapsedExpand,
          //__isTop: context.topPageUid === p.uid,
          //__isValidTop: context.validTopPageUid === p.uid,
        })
      )}
    </div>
  )
}

export default Home
