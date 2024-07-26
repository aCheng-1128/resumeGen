import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/* 🍍Pinia模板🍍 for copy */
// 类形式的
export const useCounterStoreClass = defineStore('counter', {
    state: () => ({ count: 0 }),
    getters: {
        double: (state) => state.count * 2
    },
    actions: {
        increment() {
            this.count++
        }
    }
})
// setup形式的
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return { count, doubleCount, increment }
})
