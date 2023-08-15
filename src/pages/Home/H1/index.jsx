import React, { useEffect, useState, useRef } from 'react'
import Modal from '@/components/Modal'
import styles from './index.module.scss'
const HHome1 = (props) => {
  useEffect(() => {
    console.log('@@@H1', [props])
  }, [props])

  const [modalVisable, setModalVisible] = useState(false)

  const onShowModal = () => {
    setModalVisible(true)
  }

  const contaienr = useRef(null)

  return (
    <div ref={contaienr}>
      H1
      <button onClick={onShowModal}>show modal</button>
      <Modal
        driftLeftSider={200}
        visible={modalVisable}
        onClose={() => {
          setModalVisible(false)
          console.log('@@@????')
        }}
      >
        <div className={styles.modal}>13213131231</div>
      </Modal>
    </div>
  )
}

export default HHome1
