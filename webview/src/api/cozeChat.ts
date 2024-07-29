import axios from 'axios'

const apiBaseUrl = 'http://localhost:3366/coze' // 请根据实际端口调整

// token
const getToken = () => localStorage.getItem('token')

// 创建 Axios 实例
const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
    }
})

// 创建会话
const createConversation = async () => {
    const response = await api.post('/create')
    return response.data
}

// 查看会话信息
const getConversationInfo = async (conversationId: string) => {
    const response = await api.get(`/info/${conversationId}`)
    return response.data
}

// 删除会话
const deleteConversation = async (conversationId: string) => {
    await api.delete(`/delete/${conversationId}`)
}

// 发送消息
const genMessage = async (conversationId: string, message: string) => {
    const response = await api.post('/genMessage', { conversationId, message })
    return response.data
}

// 查看消息列表
const getMessageList = async (conversationId: string) => {
    const response = await api.get(`/messageList?conversationId=${conversationId}`)
    return response.data
}

// 查看消息详情
const getMessageDetail = async (messageId: string) => {
    const response = await api.get(`/message/${messageId}`)
    return response.data
}

// 生成聊天
const genChat = async (conversationId: string) => {
    const response = await api.post('/genChat', { conversationId })
    return response.data
}

// 查看聊天状态
const getChatStatus = async (conversationId: string, chatId: string) => {
    const response = await api.get(`/status?conversationId=${conversationId}&chatId=${chatId}`)
    return response.data
}

// 查看聊天消息
const getChatMessages = async (conversationId: string, chatId: string) => {
    const response = await api.get(`/messages?conversationId=${conversationId}&chatId=${chatId}`)
    return response.data
}

// 发送聊天消息
const sendMessage = async (conversationId: string, message: string) => {
    const response = await api.post('/sendMsg', { conversationId, message })
    return response.data
}

export {
    createConversation,
    getConversationInfo,
    deleteConversation,
    genMessage,
    getMessageList,
    getMessageDetail,
    genChat,
    getChatStatus,
    getChatMessages,
    sendMessage
}
