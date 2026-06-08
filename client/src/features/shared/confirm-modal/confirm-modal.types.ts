export type ConfirmModalProps = {
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
