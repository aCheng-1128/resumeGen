import { request } from '@/utils'

const baseUrl = 'resume'

const getResumeHtmlByUrl = (url: string) => {
    return request({
        url: `${baseUrl}/getResumeHtml`,
        method: 'POST',
        data: { url }
    })
}

const getResumePdfByUrl = (url: string) => {
    return request<Buffer>({
        url: `${baseUrl}/getResumePdf`,
        method: 'POST',
        data: { url },
        responseType: 'blob'
    })
}

const getResumePngByUrl = (url: string) => {
    return request({
        url: `${baseUrl}/getResumePng`,
        method: 'POST',
        data: { url },
        responseType: 'blob'
    })
}

export { getResumeHtmlByUrl, getResumePdfByUrl, getResumePngByUrl }
