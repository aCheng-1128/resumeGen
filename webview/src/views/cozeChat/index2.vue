<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { getConversations, getMessageList, genConversation, getChatStatus, getChatMessages, sendMessage } from '@/api/cozeChat'
import type { IConversation, IChatMessage } from '@/api/cozeChat'
import { getResumePngByUrl } from '@/api/resume'
import { useScroll } from '@vueuse/core'
import { getZoomRatio } from '@/utils'

const convs = ref<IConversation[]>([])
const curConvId = ref<string>('')
const msgList = ref<any[]>([])
const iptText = ref<string>('')
const chatId = ref<string>('')
const chatStatus = ref<string>('')
let timer: NodeJS.Timer | any = null
const chatMsgs = ref<IChatMessage[]>([])
const resumeImageUrl = ref<string>('')

const resumeUrl = computed(() => {
    return JSON.parse(chatMsgs.value.find((item) => item.type === 'tool_response')?.content || '{}').url
})

const fetchConversations = async () => {
    const res = await getConversations()
    convs.value = res.data
    if (convs.value.length > 0) {
        curConvId.value = convs.value[0].id
    }
}

const getMessageListFn = async (convId: string) => {
    const res = await getMessageList(convId)
    msgList.value = res.data.reverse()
    scrollYToBottom()
}

const getChatId = async () => {
    const res = await sendMessage(curConvId.value, iptText.value)
    chatId.value = res.data.chat_id
}

const getChatStatusFn = async () => {
    if (!chatId.value) return

    const res = await getChatStatus(curConvId.value, chatId.value)
    chatStatus.value = res.data.status
    if (chatStatus.value === 'completed') {
        if (timer) clearInterval(timer)
        await getMessageListFn(curConvId.value)
        await getChatMessagesFn()
        const imageResponse = await getResumePngByUrl(resumeUrl.value)
        resumeImageUrl.value = URL.createObjectURL(new Blob([imageResponse as any], { type: 'image/png' }))
    }
}

const sendMsg = async () => {
    if (!iptText.value.trim()) return
    msgList.value.push({ role: 'user', content: iptText.value })
    scrollYToBottom()
    await getChatId()
    timer = setInterval(getChatStatusFn, 1000)
    iptText.value = ''
}

const switchNav = (item: IConversation) => {
    curConvId.value = item.id
    getMessageListFn(item.id)
}

watch(curConvId, (newVal) => {
    getMessageListFn(newVal)
})

const msgListScroll = ref<HTMLElement | null>(null)
const { y: scrollY } = useScroll(msgListScroll, {
    behavior: 'smooth'
})
const scrollYToBottom = async () => {
    await nextTick()
    if (msgListScroll.value) scrollY.value = msgListScroll.value.scrollHeight
}

const getChatMessagesFn = async () => {
    const res = await getChatMessages(curConvId.value, chatId.value)
    chatMsgs.value = res.data
}

const addConversation = async () => {
    await genConversation().then(fetchConversations)
}

onMounted(fetchConversations)
</script>

<template>
    <div class="coze_chat">
        <!-- <div class="header">
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
        </div> -->
        <div class="send-msg-box">
            <div class="ipt-content">
                <label for="chatInput" class="label">
                    <span class="label-title">输入信息</span>
                    <input v-model="iptText" @keyup.enter="sendMsg" id="chatInput" class="input" name="text" placeholder="请输入问题.." type="text" />
                </label>
            </div>
            <button class="button" @click="sendMsg">点击生成</button>
        </div>
        <div
            v-if="resumeImageUrl"
            class="resume-png-box"
            :style="{
                zoom: getZoomRatio()
            }"
        >
            <img :src="resumeImageUrl" alt="Resume PNG" class="resume-image" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.coze_chat {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

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
                background-color: #e6f7ff;
                color: #1890ff;
                text-align: center;
                cursor: pointer;
                white-space: nowrap;
                border-radius: 4px;

                &:hover {
                    color: #ff4d4f;
                    background-color: #fff1f0;
                }

                &.active {
                    color: #ff4d4f;
                    background-color: #fff1f0;
                }
            }
        }

        .add {
            font-size: 16px;
            padding: 8px 16px;
            background-color: #e6f7ff;
            color: #1890ff;
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

        &::-webkit-scrollbar {
            width: 2px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #1890ff;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            background-color: #e6f7ff;
        }

        .msg-item {
            display: flex;
            align-items: flex-end;

            &.user-msg {
                justify-content: flex-end;

                .msg-content {
                    background-color: #1890ff;
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

    .send-msg-box {
        display: flex;
        padding: 50px 25px 10px;
        background-color: #ffffff;
        align-items: center;
        gap: 30px;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);

        .ipt-content {
            flex: 1;
            .label {
                --border: rgba(66, 66, 66, 0.733);
                --bgLabel: rgba(120, 120, 120, 1);
                --bgInput: rgba(255, 255, 255, 1);
                --color-light: rgb(98, 0, 255);
                --color-light-a: rgb(133, 123, 150);
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: min-content min-content;
                background: var(--bgLabel);
                position: relative;
                font-size: 0.65rem;
                transition: all 0.3s ease-out;
            }

            .label > .label-title {
                border: 1px solid var(--color-light);
                color: var(--color-light);
                box-shadow: 0 2px 2px rgba(120, 120, 120, 0.25);
                padding: 0.25em 0.5em;
                background-color: var(--bgInput);
                grid-column: 1 / span 1;
                grid-row: 1 / span 1;
                position: relative;
                border-radius: 4px;
                translate: 10px -10px;
                transition: all 0.5s ease-out 0.5s;
                z-index: 10;
            }

            .label:focus .input,
            .label:focus-within .input {
                background-color: var(--bgInput);
                padding: 1em;
                color: var(--color-light);
                border: 2px solid var(--color-light);
                outline: 2px solid var(--color-light);
                outline-offset: -2px;
                border-radius: 12px;
                box-shadow:
                    0 5px 10px rgba(98, 0, 255, 0.25),
                    0 -5px 20px rgba(98, 0, 255, 0.1);
                scale: 1.15;
                transition: all 0.5s cubic-bezier(0, 1.46, 1, 1.62) 0.3s;
            }

            .label:focus,
            .label:focus-within .label-title {
                translate: 10px -20px;
                border-radius: 4px 4px 0 0;
                z-index: 0;
                transition: all 0.3s cubic-bezier(0, 1.46, 1, 1.62);
            }

            .input {
                appearance: none;
                border-top: 2px solid transparent;
                border-right: 2px solid transparent;
                border-bottom: 2px solid var(--color-light);
                border-left: 2px solid transparent;
                background-color: var(--bgInput);
                caret-color: var(--color-light);
                min-width: 200px;
                padding: 1.25em 1em 0.25em;
                outline: 0px solid var(--color-light);
                grid-column: 1/-1;
                grid-row: 1 / -1;
                position: relative;
                transition: all 0.3s cubic-bezier(0.5, 0.6, 0.5, 0.62);
                z-index: 0;
            }

            .input,
            .input::placeholder {
                color: var(--color-light-a);
            }
        }

        button {
            padding: 10px 15px;
            border: none;
            background-color: rgb(98, 0, 255);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
        }
    }

    .resume-png-box {
        width: 210mm;
        height: 297mm;
        margin: 0 auto;
        overflow-y: scroll;
    }
}
</style>
