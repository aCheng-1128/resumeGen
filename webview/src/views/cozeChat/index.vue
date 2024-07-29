<script setup lang="ts">
import { createConversation, getMessageList, genChat, getChatStatus, sendMessage } from '@/api/cozeChat'
import { computed, ref, onMounted, watch } from 'vue'

interface IConvIds {
    id: number
    conversationId: string
}

const convIds = ref<IConvIds[]>([])
const curConvId = ref<number>(-1)

const curConvIdValue = computed(() => {
    const currentConv = convIds.value.find((conv) => conv.id === curConvId.value)
    return currentConv ? currentConv.conversationId : ''
})

const msgList = ref<any[]>([])
const iptText = ref<string>('')

const fetchConversations = async () => {
    try {
        const res = await createConversation()
        convIds.value = res.data.conversationIds.map((item: string, index: number) => ({
            id: index,
            conversationId: item
        }))
        if (convIds.value.length > 0) {
            curConvId.value = convIds.value[0].id
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

const sendMsg = async () => {
    if (!iptText.value.trim()) return

    try {
        await sendMessage(curConvIdValue.value, iptText.value)
        await createChatFn()
        iptText.value = ''
    } catch (error) {
        console.error('Failed to send message:', error)
    }
}

const chatId = ref<string>('')
let timer: NodeJS.Timer | any = null

const createChatFn = async () => {
    try {
        const res = await genChat(curConvIdValue.value)
        chatId.value = res.data.id
        timer = setInterval(getChatStatusFn, 1000)
    } catch (error) {
        console.error('Failed to create chat:', error)
    }
}

const getChatStatusFn = async () => {
    if (!chatId.value) return

    try {
        const res = await getChatStatus(curConvIdValue.value, chatId.value)
        if (res.data.status === 'completed') {
            if (timer) clearInterval(timer)
            await getMessageListFn(curConvIdValue.value)
        }
    } catch (error) {
        console.error('Failed to get chat status:', error)
    }
}

const switchNav = (item: IConvIds) => {
    curConvId.value = item.id
    getMessageListFn(item.conversationId)
}

watch(curConvId, (newVal) => {
    if (convIds.value.length > 0) {
        const selectedConv = convIds.value.find((conv) => conv.id === newVal)
        if (selectedConv) {
            getMessageListFn(selectedConv.conversationId).then(() => {
                scrollYToBottom()
            })
        }
    }
})

const msgListScroll = ref<HTMLElement | null>(null)
const scrollYToBottom = () => {
    if (msgListScroll.value) {
        console.log('scrollYToBottom')
        msgListScroll.value.scrollTop = msgListScroll.value.scrollHeight
    }
}

onMounted(fetchConversations)
</script>

<template>
    <div class="coze_chat">
        <div class="convIds-list">
            <div v-for="item in convIds" :key="item.id" @click="switchNav(item)" class="item" :class="{ active: item.id === curConvId }">
                {{ item.id }}
            </div>
        </div>
        <div class="msg-list" ref="msgListScroll">
            <div v-for="item in msgList" :key="item.id">
                <div>{{ item.content }}</div>
            </div>
        </div>
        <div class="ipt-box">
            <input type="text" v-model="iptText" />
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

    .convIds-list {
        height: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        .item {
            font-size: 16px;
            padding: 4px 16px;
            background-color: aliceblue;
            color: blue;
            text-align: center;
            cursor: pointer;
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

    .msg-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .ipt-box {
        height: 50px;
    }
}
</style>
