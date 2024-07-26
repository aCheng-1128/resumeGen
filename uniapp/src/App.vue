<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch((options) => {
    console.log('App Launch', options)
})
onShow((options) => {
    console.log('App Show', options)
})
onHide(() => {
    console.log('App Hide')
})
</script>
