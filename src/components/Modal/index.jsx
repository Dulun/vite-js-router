import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import styles from './index.module.scss'

const Modal = (props) => {
  const modalRef = useRef(null)
  const isAnimating = useRef(false)
  const modalWrapperRef = useRef(null)

  const [_visible, setVisible] = useState(false)

  const onShow = () => {
    if (isAnimating.current) return
    isAnimating.current = true

    modalWrapperRef?.current?.classList.add(styles.fadeIn)
    modalRef?.current?.classList.add(styles.fadeIn)
    setVisible(true)

    const timer = setTimeout(() => {
      isAnimating.current = false
      modalWrapperRef?.current?.classList.remove(
        styles.fadeIn
      )
      modalRef?.current?.classList.remove(styles.fadeIn)
      clearTimeout(timer)
    }, 300)
  }

  const onHide = (e) => {
    e.stopPropagation()
    if (isAnimating.current) return
    isAnimating.current = true

    modalWrapperRef?.current?.classList.add(styles.fadeOut)
    modalRef?.current?.classList.add(styles.fadeOut)

    const timer = setTimeout(() => {
      setVisible(false)
      props.onClose()
      isAnimating.current = false
      modalWrapperRef?.current?.classList.remove(
        styles.fadeOut
      )
      modalRef?.current?.classList.remove(styles.fadeOut)
      clearTimeout(timer)
    }, 300)
  }

  useEffect(() => {
    if (props.visible) {
      onShow()
    }
  }, [props.visible])

  const onModalClicked = (e) => {
    e.stopPropagation()
  }

  if (!props.visible && !_visible) {
    return null
  }

  return createPortal(
    <div
      className={styles.modalWrapper}
      ref={modalWrapperRef}
      onClick={onHide}
    >
      <div
        ref={modalRef}
        className={cx(
          styles.modalContainer,
          props.className
        )}
        style={{
          left: `calc(50% + ${
            props?.driftLeftSider / 2
          }px)`,
        }}
        onClick={onModalClicked}
      >
        {props.children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
