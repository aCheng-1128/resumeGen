<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { getConversations, getChatStatus, getChatMessages, sendMessage } from '@/api/cozeChat'
import type { IChatMessage } from '@/api/cozeChat'
import { getResumePngByUrl, getResumeHtmlByUrl } from '@/api/resume'
import { useScroll } from '@vueuse/core'
import { getZoomRatio } from '@/utils'
import { showFailToast } from 'vant'

const curConvId = ref<string>('')
const msgList = ref<any[]>([])
const iptText = ref<string>('')
const chatId = ref<string>('')
const chatStatus = ref<string>('')
let timer: NodeJS.Timer | any = null
const chatMsgs = ref<IChatMessage[]>([])
const resumeImageUrl = ref<string>('')
const resumeHtml = ref<string>('')
const loadingText = ref<string>('')

const resumeUrl = computed(() => {
    return JSON.parse(chatMsgs.value.find((item) => item.type === 'tool_response')?.content || '{}').url
})

const fetchConversations = async () => {
    const res = await getConversations()
    curConvId.value = res.data[0].id
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
        loadingText.value = '正在生成简历图片...'
        if (timer) clearInterval(timer)
        await getChatMessagesFn()
        console.log(resumeUrl.value)
        if (resumeUrl.value) {
            const imageResponse = await getResumePngByUrl(resumeUrl.value)
            resumeImageUrl.value = URL.createObjectURL(new Blob([imageResponse as any], { type: 'image/png' }))
            const htmlResponse = await getResumeHtmlByUrl(resumeUrl.value)
            resumeHtml.value = htmlResponse as unknown as string
        } else {
            showFailToast('生成简历失败，请重新尝试')
        }
        loadingText.value = ''
    }
}

const sendMsg = async () => {
    if (!iptText.value.trim()) return
    loadingText.value = '正在生成简历模板...'
    msgList.value.push({ role: 'user', content: iptText.value })
    scrollYToBottom()
    await getChatId()
    timer = setInterval(getChatStatusFn, 1000)
    iptText.value = ''
}

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

onMounted(fetchConversations)
</script>

<template>
    <div class="coze_chat">
        <div class="send-msg-box" contenteditable="true">
            <div class="ipt-content">
                <label for="chatInput" class="label">
                    <span class="label-title">输入信息</span>
                    <input v-model="iptText" @keyup.enter="sendMsg" id="chatInput" class="input" name="text" placeholder="请输入问题.." type="text" />
                </label>
            </div>
            <button class="button" @click="sendMsg">点击生成</button>
        </div>
        <div
            class="resume-png-box"
            :style="{
                zoom: getZoomRatio()
            }"
        >
            <img v-if="resumeImageUrl" :src="resumeImageUrl" alt="Resume PNG" class="resume-image" />
            <div v-if="loadingText" class="png-loading">
                <div class="typewriter">
                    <div class="slide"><i></i></div>
                    <div class="paper"></div>
                    <div class="keyboard"></div>
                </div>
                <div class="text-[#275efe] text-[24px]">{{ loadingText }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.coze_chat {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;

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
        box-sizing: border-box;
        border: 1px solid #275efe;
        margin: 0 auto;
        overflow-y: scroll;

        .png-loading {
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 24px;
            justify-content: center;
            align-items: center;

            .typewriter {
                --blue: #5c86ff;
                --blue-dark: #275efe;
                --key: #fff;
                --paper: #eef0fd;
                --text: #d3d4ec;
                --tool: #fbc56c;
                --duration: 3s;
                position: relative;
                -webkit-animation: bounce05 var(--duration) linear infinite;
                animation: bounce05 var(--duration) linear infinite;
            }

            .typewriter .slide {
                width: 92px;
                height: 20px;
                border-radius: 3px;
                margin-left: 14px;
                transform: translateX(14px);
                background: linear-gradient(var(--blue), var(--blue-dark));
                -webkit-animation: slide05 var(--duration) ease infinite;
                animation: slide05 var(--duration) ease infinite;
            }

            .typewriter .slide:before,
            .typewriter .slide:after,
            .typewriter .slide i:before {
                content: '';
                position: absolute;
                background: var(--tool);
            }

            .typewriter .slide:before {
                width: 2px;
                height: 8px;
                top: 6px;
                left: 100%;
            }

            .typewriter .slide:after {
                left: 94px;
                top: 3px;
                height: 14px;
                width: 6px;
                border-radius: 3px;
            }

            .typewriter .slide i {
                display: block;
                position: absolute;
                right: 100%;
                width: 6px;
                height: 4px;
                top: 4px;
                background: var(--tool);
            }

            .typewriter .slide i:before {
                right: 100%;
                top: -2px;
                width: 4px;
                border-radius: 2px;
                height: 14px;
            }

            .typewriter .paper {
                position: absolute;
                left: 24px;
                top: -26px;
                width: 40px;
                height: 46px;
                border-radius: 5px;
                background: var(--paper);
                transform: translateY(46px);
                -webkit-animation: paper05 var(--duration) linear infinite;
                animation: paper05 var(--duration) linear infinite;
            }

            .typewriter .paper:before {
                content: '';
                position: absolute;
                left: 6px;
                right: 6px;
                top: 7px;
                border-radius: 2px;
                height: 4px;
                transform: scaleY(0.8);
                background: var(--text);
                box-shadow:
                    0 12px 0 var(--text),
                    0 24px 0 var(--text),
                    0 36px 0 var(--text);
            }

            .typewriter .keyboard {
                width: 120px;
                height: 56px;
                margin-top: -10px;
                z-index: 1;
                position: relative;
            }

            .typewriter .keyboard:before,
            .typewriter .keyboard:after {
                content: '';
                position: absolute;
            }

            .typewriter .keyboard:before {
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 7px;
                background: linear-gradient(135deg, var(--blue), var(--blue-dark));
                transform: perspective(10px) rotateX(2deg);
                transform-origin: 50% 100%;
            }

            .typewriter .keyboard:after {
                left: 2px;
                top: 25px;
                width: 11px;
                height: 4px;
                border-radius: 2px;
                box-shadow:
                    15px 0 0 var(--key),
                    30px 0 0 var(--key),
                    45px 0 0 var(--key),
                    60px 0 0 var(--key),
                    75px 0 0 var(--key),
                    90px 0 0 var(--key),
                    22px 10px 0 var(--key),
                    37px 10px 0 var(--key),
                    52px 10px 0 var(--key),
                    60px 10px 0 var(--key),
                    68px 10px 0 var(--key),
                    83px 10px 0 var(--key);
                -webkit-animation: keyboard05 var(--duration) linear infinite;
                animation: keyboard05 var(--duration) linear infinite;
            }

            @keyframes bounce05 {
                85%,
                92%,
                100% {
                    transform: translateY(0);
                }

                89% {
                    transform: translateY(-4px);
                }

                95% {
                    transform: translateY(2px);
                }
            }

            @keyframes slide05 {
                5% {
                    transform: translateX(14px);
                }

                15%,
                30% {
                    transform: translateX(6px);
                }

                40%,
                55% {
                    transform: translateX(0);
                }

                65%,
                70% {
                    transform: translateX(-4px);
                }

                80%,
                89% {
                    transform: translateX(-12px);
                }

                100% {
                    transform: translateX(14px);
                }
            }

            @keyframes paper05 {
                5% {
                    transform: translateY(46px);
                }

                20%,
                30% {
                    transform: translateY(34px);
                }

                40%,
                55% {
                    transform: translateY(22px);
                }

                65%,
                70% {
                    transform: translateY(10px);
                }

                80%,
                85% {
                    transform: translateY(0);
                }

                92%,
                100% {
                    transform: translateY(46px);
                }
            }

            @keyframes keyboard05 {
                5%,
                12%,
                21%,
                30%,
                39%,
                48%,
                57%,
                66%,
                75%,
                84% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                9% {
                    box-shadow:
                        15px 2px 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                18% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 2px 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                27% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 12px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                36% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 12px 0 var(--key),
                        60px 12px 0 var(--key),
                        68px 12px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                45% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 2px 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                54% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 2px 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                63% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 12px 0 var(--key);
                }

                72% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 2px 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 10px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }

                81% {
                    box-shadow:
                        15px 0 0 var(--key),
                        30px 0 0 var(--key),
                        45px 0 0 var(--key),
                        60px 0 0 var(--key),
                        75px 0 0 var(--key),
                        90px 0 0 var(--key),
                        22px 10px 0 var(--key),
                        37px 12px 0 var(--key),
                        52px 10px 0 var(--key),
                        60px 10px 0 var(--key),
                        68px 10px 0 var(--key),
                        83px 10px 0 var(--key);
                }
            }
        }
    }
}
</style>
