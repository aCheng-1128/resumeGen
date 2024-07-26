<script lang="ts" setup>
interface IProps {
    html: string
}
const Props = withDefaults(defineProps<IProps>(), {
    html: ''
})
</script>

<template>
    <div class="render_html_container_box">
        <div v-html="Props.html"></div>
    </div>
</template>

<style lang="scss">
.render_html_container_box {
}
</style>
