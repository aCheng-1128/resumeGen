<route lang="json5">
{
    style: { navigationStyle: 'custom', navigationBarTitleText: '' },
}
</route>
<script lang="ts" setup></script>

<template>
    <view class="index">
        <web-view src="http://localhost:82/resume" />
    </view>
</template>

<style lang="scss" scoped>
.index {
}
</style>
