import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import styles from './index.module.scss'

const Modal = (props) => {
  const { visible } = props
  const modalRef = useRef(null)
  const isAnimating = useRef(false)
  const modalWrapperRef = useRef(null)

  const [_visible, setVisible] = useState(false)

  const onShow = () => {
    if (isAnimating.current) return
    isAnimating.current = true

    window.prompt('123')

    modalWrapperRef?.current?.classList.add(styles.fadeIn)
    modalRef?.current?.classList.add(styles.fadeIn)
    setVisible(true)

    const timer = setTimeout(() => {
      isAnimating.current = false
      clearTimeout(timer)
    }, 300)
  }

  const onHide = () => {
    if (isAnimating.current) return
    isAnimating.current = true

    modalWrapperRef?.current?.classList.add(styles.fadeOut)
    modalRef?.current?.classList.add(styles.fadeOut)

    const timer = setTimeout(() => {
      setVisible(false)
      props.onClose()
      isAnimating.current = false
      clearTimeout(timer)
    }, 300)
  }

  useEffect(() => {
    if (visible) {
      onShow()
    }
    if (!visible) {
      onHide()
    }
  }, [visible])

  if (!visible && !_visible) {
    return null
  }

  const onModalClicked = (e) => {
    e.stopPropagation()
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
