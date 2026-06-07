import { Alert, Modal } from 'antd'

import { SModalContent } from './styles'

type Props = {
    cancelText?: string
    confirmText?: string
    error?: Error
    loading?: boolean
    message: string
    open: boolean
    title: string
    onCancel: () => void
    onConfirm: () => void
}

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
}: Props) => {
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
