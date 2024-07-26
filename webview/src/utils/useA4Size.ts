function getDPI() {
    const tempDiv = document.createElement('div')
    tempDiv.style.width = '1in'
    tempDiv.style.visibility = 'hidden'
    document.body.appendChild(tempDiv)
    const dpi = tempDiv.offsetWidth
    document.body.removeChild(tempDiv)
    return dpi
}

function mmToPixel(mm: number, dpi: number) {
    const inches = mm / 25.4
    const pixels = inches * dpi
    return Math.round(pixels)
}

function a4SizeInPixels() {
    const dpi = getDPI()
    const width_mm = 210 // A4纸宽度，单位：毫米
    const height_mm = 297 // A4纸高度，单位：毫米
    const width_px = mmToPixel(width_mm, dpi)
    const height_px = mmToPixel(height_mm, dpi)
    return { width: width_px, height: height_px }
}

function getScreenWH() {
    return { width: window.innerWidth, height: window.innerHeight }
}

function getZoomRatio() {
    const { width } = a4SizeInPixels()
    const zoomRatio = getScreenWH().width / width
    return zoomRatio
}

export { getZoomRatio }
