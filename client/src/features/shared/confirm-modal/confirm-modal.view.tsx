import { Alert, Modal } from 'antd'

import type { ConfirmModalProps } from './confirm-modal.types.ts'
import { SModalContent } from './styles'

export const ConfirmModal = ({
    cancelText = 'Отмена',
    confirmText = 'Удалить',
    error,
    loading = false,
    message,
    open,
    title,
    onCancel,
    onConfirm,
}: ConfirmModalProps) => {
    return (
        <Modal
            title={title}
            open={open}
            okText={confirmText}
            cancelText={cancelText}
            okButtonProps={{
                danger: true,
                loading,
            }}
            onOk={onConfirm}
            onCancel={onCancel}
        >
            <SModalContent>
                {error && <Alert type="error" title={error.message} />}

                <p>{message}</p>
            </SModalContent>
        </Modal>
    )
}
