import { showToast } from 'vant'

const customToast = (message: string, options = {}) => {
    showToast({
        message,
        className: 'custom-toast',
        ...options
    })
}

export default customToast
