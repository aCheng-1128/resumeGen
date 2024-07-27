<script setup lang="ts">
import { computed } from 'vue'
import { getZoomRatio } from '@/utils'
import { useHtml } from './hooks/useHtml'
import { ResumeModuleKeys } from './hooks/useHtml'

const resumeStyle = {
    zoom: getZoomRatio()
}

const { resumeData, bgModule, personalModule, otherModule } = useHtml()

const personalData = computed(() => {
    return resumeData.value.personal.data[0]
})
</script>

<template>
    <div class="resume_container" :style="resumeStyle">
        <div class="bg"><bgModule /></div>
        <div class="personal">
            <personalModule>
                <template #avatar>
                    <img :src="personalData.avatar" alt="avatar" />
                </template>
                <template #name>
                    {{ personalData.name }}
                </template>
                <template #list>
                    <ul class="flex flex-wrap items-center gap-2">
                        <li v-for="item in personalData" :key="item">{{ item }}</li>
                    </ul>
                </template>
            </personalModule>
        </div>
        <div class="other-list">
            <template v-for="otherModule in resumeData" :key="otherModule.type">
                <div v-if="otherModule.type !== ResumeModuleKeys.Personal">
                    <otherModule>
                        <template #title>
                            {{ otherModule.type }}
                        </template>
                        <template #content>
                            <template v-for="item in otherModule.data" :key="item">
                                <div v-for="item2 in item" :key="item2">
                                    {{ item2 }}
                                </div>
                            </template>
                        </template>
                    </otherModule>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.resume_container {
    box-sizing: border-box;
    width: 210mm;
    height: 297mm;
    padding: 15mm;
    position: relative;

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .personal {
    }

    .other-list {
    }
}
</style>
