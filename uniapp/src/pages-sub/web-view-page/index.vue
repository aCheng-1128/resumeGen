<route lang="json5">
{
    style: { navigationStyle: 'custom', navigationBarTitleText: 'web-view' },
}
</route>
<script lang="ts" setup>
interface IProps {
    url: string
}

const Props = withDefaults(defineProps<IProps>(), {
    url: '',
})

watchEffect(() => {
    console.log('url', Props.url)
})
</script>

<template>
    <web-view class="web_view_page" :src="Props.url"></web-view>
</template>

<style lang="scss" scoped>
.web_view_page {
}
</style>
