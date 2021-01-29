<template>
    <div>
        111
        <!-- {{msg}} -->
        <HelloWorld ref="hw" @myClick='onClick' msg="Hello Vue 3 + Vite" />
    </div>
</template>

<script setup>
import HelloWorld from 'comps/HelloWorld.vue'
import { ref } from 'vue';

const hw = ref(null);


const onClick = () => {
  // console.log('onClick');
  hw.value.someMethod()
}
</script>

<style scoped>

</style>