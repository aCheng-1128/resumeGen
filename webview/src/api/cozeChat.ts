import { request } from '@/utils'

const baseUrl = 'coze'

interface IConversation {
    id: string
    name: string
}

/**
 * 创建会话
 * @returns {Promise<IConversation>} 返回创建的会话信息
 */
const genConversation = async () => {
    return request<IConversation>({
        url: `${baseUrl}/genConversation`,
        method: 'POST'
    })
}

/**
 * 获取会话列表
 * @returns {Promise<IConversation[]>} 返回会话列表
 */
const getConversations = async () => {
    return request<IConversation[]>({
        url: `${baseUrl}/getConversations`,
        method: 'GET'
    })
}

/**
 * 查看会话信息
 * @param {string} conversationId - 会话ID
 * @returns {Promise<IConversation>} 返回会话信息
 */
const getConversationInfo = async (conversationId: string) => {
    return request<IConversation>({
        url: `${baseUrl}/info/${conversationId}`,
        method: 'GET'
    })
}

/**
 * 删除会话
 * @param {string} conversationId - 会话ID
 * @returns {Promise<void>}
 */
const deleteConversation = async (conversationId: string) => {
    return request({
        url: `${baseUrl}/delete/${conversationId}`,
        method: 'DELETE'
    })
}

interface ISendMessageRes {
    chat_id: string
}

interface IMessage {
    id: string
    conversation_id: string
    content: string
    role: string
    type: string
    meta_data: string
    created_at: string
    updated_at: string
}

/**
 * 发送聊天消息
 * @param {string} conversationId - 会话ID
 * @param {string} message - 消息内容
 * @returns {Promise<ISendMessageRes>} 返回发送消息的响应
 */
const sendMessage = async (conversationId: string, message: string) => {
    return request<ISendMessageRes>({
        url: `${baseUrl}/sendMsg`,
        method: 'POST',
        data: { conversationId, message }
    })
}

/**
 * 查看消息列表
 * @param {string} conversationId - 会话ID
 * @returns {Promise<IMessage[]>} 返回消息列表
 */
const getMessageList = async (conversationId: string) => {
    return request<IMessage[]>({
        url: `${baseUrl}/messageList`,
        method: 'GET',
        params: { conversationId }
    })
}

/**
 * 查看消息详情
 * @param {string} messageId - 消息ID
 * @returns {Promise<IMessage>} 返回消息详情
 */
const getMessageDetail = async (messageId: string) => {
    return request<IMessage>({
        url: `${baseUrl}/message/${messageId}`,
        method: 'GET'
    })
}

interface IChatStatus {
    status: 'in_progress' | 'completed'
}

/**
 * 查看聊天状态
 * @param {string} conversationId - 会话ID
 * @param {string} chatId - 聊天ID
 * @returns {Promise<IChatStatus>} 返回聊天状态
 */
const getChatStatus = async (conversationId: string, chatId: string) => {
    return request<IChatStatus>({
        url: `${baseUrl}/status`,
        method: 'GET',
        params: { conversationId, chatId }
    })
}

interface IChatMessage {
    id: string
    conversation_id: string
    content: string
    role: string
    type: string
}

/**
 * 查看聊天消息
 * @param {string} conversationId - 会话ID
 * @param {string} chatId - 聊天ID
 * @returns {Promise<IChatMessage[]>} 返回聊天消息列表
 */
const getChatMessages = async (conversationId: string, chatId: string) => {
    return request<IChatMessage[]>({
        url: `${baseUrl}/messages`,
        method: 'GET',
        params: { conversationId, chatId }
    })
}

export {
    genConversation,
    getConversations,
    getConversationInfo,
    deleteConversation,
    sendMessage,
    getMessageList,
    getMessageDetail,
    getChatStatus,
    getChatMessages
}

export type { IConversation, ISendMessageRes, IMessage, IChatStatus, IChatMessage }
