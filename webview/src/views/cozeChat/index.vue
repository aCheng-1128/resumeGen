<script setup lang="ts">
import { getConversations, getMessageList, genConversation, getChatStatus, getChatMessages, sendMessage } from '@/api/cozeChat'
import { ref, onMounted, watch } from 'vue'

interface IConv {
    id: string
    created_at: string
    name: string
}

const convs = ref<IConv[]>([])
const curConvId = ref<string>('')
const msgList = ref<any[]>([])
const iptText = ref<string>('')
const chatId = ref<string>('')
const chatStatus = ref<string>('')
let timer: NodeJS.Timer | any = null

const fetchConversations = async () => {
    try {
        const res = await getConversations()
        convs.value = res.data.conversations
        if (convs.value.length > 0) {
            curConvId.value = convs.value[0].id
        }
    } catch (error) {
        console.error('Failed to fetch conversations:', error)
    }
}

const getMessageListFn = async (convId: string) => {
    try {
        const res = await getMessageList(convId)
        msgList.value = res.data.messages.reverse()
    } catch (error) {
        console.error('Failed to fetch message list:', error)
    }
}

const getChatId = async () => {
    try {
        const res = await sendMessage(curConvId.value, iptText.value)
        chatId.value = res.data.id
    } catch (error) {
        console.error('Failed to get chat id:', error)
    }
}

const getChatStatusFn = async () => {
    if (!chatId.value) return

    try {
        const res = await getChatStatus(curConvId.value, chatId.value)
        chatStatus.value = res.data.status
        if (chatStatus.value === 'completed') {
            if (timer) clearInterval(timer)
            await getMessageListFn(curConvId.value)
            getChatMessagesFn()
        }
    } catch (error) {
        console.error('Failed to get chat status:', error)
    }
}

const sendMsg = async () => {
    if (!iptText.value.trim()) return
    await getChatId()
    timer = setInterval(getChatStatusFn, 1000)
    iptText.value = ''
}

const switchNav = (item: IConv) => {
    curConvId.value = item.id
    getMessageListFn(item.id)
}

watch(curConvId, (newVal) => {
    getMessageListFn(newVal).then(() => {
        scrollYToBottom()
    })
})

const msgListScroll = ref<HTMLElement | null>(null)
const scrollYToBottom = () => {
    if (msgListScroll.value) {
        console.log('scrollYToBottom')
        msgListScroll.value.scrollTop = msgListScroll.value.scrollHeight
    }
}

const getChatMessagesFn = async () => {
    try {
        const res = await getChatMessages(curConvId.value, chatId.value)
        console.log('getChatMessages:', res)
    } catch (error) {
        console.error('Failed to fetch chat messages:', error)
    }
}

const addConversation = async () => {
    await genConversation().then(fetchConversations)
}

onMounted(fetchConversations)
</script>

<template>
    <div class="coze_chat">
        <div class="header">
            <div class="convIds-list">
                <div v-for="item in convs" :key="item.id" @click="switchNav(item)" class="item" :class="{ active: item.id === curConvId }">
                    {{ item.name }}
                </div>
            </div>
            <div class="add" @click="addConversation">+</div>
        </div>
        <div class="msg-list" ref="msgListScroll">
            <div v-for="item in msgList" :key="item.id" class="msg-item" :class="{ 'user-msg': item.role === 'user', 'ai-msg': item.role === 'assistant' }">
                <div class="msg-content">{{ item.content }}</div>
            </div>
        </div>
        <div class="ipt-box">
            <input type="text" v-model="iptText" @keyup.enter="sendMsg" placeholder="请输入消息..." />
            <button @click="sendMsg">发送</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.coze_chat {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #f1f1f1;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        background-color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        .convIds-list {
            height: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            overflow-x: auto;
            .item {
                font-size: 16px;
                padding: 8px 16px;
                background-color: aliceblue;
                color: blue;
                text-align: center;
                cursor: pointer;
                white-space: nowrap;
                border-radius: 4px;
                &:hover {
                    color: red;
                    background-color: antiquewhite;
                }
                &.active {
                    color: red;
                    background-color: antiquewhite;
                }
            }
        }

        .add {
            font-size: 16px;
            padding: 8px 16px;
            background-color: aliceblue;
            color: blue;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
        }
    }

    .msg-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        background-color: #f1f1f1;

        .msg-item {
            display: flex;
            align-items: flex-end;

            &.user-msg {
                justify-content: flex-end;

                .msg-content {
                    background-color: #007bff;
                    color: white;
                    border-radius: 12px 12px 0 12px;
                }
            }

            &.ai-msg {
                justify-content: flex-start;

                .msg-content {
                    background-color: #e0e0e0;
                    color: black;
                    border-radius: 12px 12px 12px 0;
                }
            }

            .msg-content {
                max-width: 70%;
                padding: 10px;
                border-radius: 12px;
                word-wrap: break-word;
                word-break: break-all;
            }
        }
    }

    .ipt-box {
        height: 50px;
        display: flex;
        padding: 5px 10px;
        background-color: #ffffff;
        align-items: center;
        gap: 10px;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

        input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }

        button {
            padding: 10px 15px;
            border: none;
            background-color: #007bff;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            &:hover {
                background-color: #0056b3;
            }
        }
    }
}
</style>
