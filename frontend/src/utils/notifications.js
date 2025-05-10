import { toast } from "react-toastify"

/**
 * Show success notification
 * @param {String} message - Message to display
 */
export const showSuccess = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

/**
 * Show error notification
 * @param {String} message - Message to display
 */
export const showError = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

/**
 * Show info notification
 * @param {String} message - Message to display
 */
export const showInfo = (message) => {
  toast.info(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

/**
 * Show warning notification
 * @param {String} message - Message to display
 */
export const showWarning = (message) => {
  toast.warning(message, {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}
