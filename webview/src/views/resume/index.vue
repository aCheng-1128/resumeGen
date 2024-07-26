<script setup lang="ts">
import { getZoomRatio } from '@/utils'

const resumeStyle = {
    zoom: getZoomRatio()
}
</script>

<template>
    <div class="resume" :style="resumeStyle">resume</div>
</template>

<style scoped lang="scss">
.resume {
    width: 210mm;
    height: 297mm;
    border: 1px solid #000;
}
</style>
