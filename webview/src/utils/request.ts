/* eslint-disable indent */
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { showFailToast } from 'vant'

const getToken = (): string | null => localStorage.getItem('token')

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3366/', // 请根据实际端口调整
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 20000
})

// 请求拦截器
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken()

        if (token) {
            config.headers!.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 处理未授权错误
                    showFailToast('未授权，请重新登录')
                    break
                case 403:
                    // 处理禁止访问错误
                    showFailToast('禁止访问')
                    break
                case 404:
                    // 处理未找到错误
                    showFailToast('请求地址不存在')
                    break
                default:
                    showFailToast(`错误: ${error.response.status}`)
            }
        } else {
            showFailToast('网络错误或服务器无响应')
        }
        return Promise.reject(error)
    }
)

interface IResData<T> {
    code: number
    data: T
    msg: string
    status: string
}

function request<T = any>(config: AxiosRequestConfig): Promise<IResData<T>> {
    return new Promise((resolve, reject) => {
        api<IResData<T>>(config)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err?.data)
            })
    })
}

export { request }
