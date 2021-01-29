<template>
  <h1>{{ msg }}</h1>
  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button @click="state.count++">count is: {{ state.count }}</button>

  <!-- <button @click="emit('myClick')">emit1</button> -->
   <button @click="onClick">emit2</button>
</template>

<script setup>
import { defineProps, reactive, defineEmit, useContext } from 'vue';

defineProps({
  msg: String
})

const ctx = useContext();

ctx.expose({
  someMethod() {
    console.log('someMethod');
  }
})

const emit = defineEmit(['myClick']);

const onClick = ()=>{
  emit('myClick')
  // ctx.emit('myClick');
}


const state = reactive({ count: 0 })
</script>

<style scoped>
a {
  color: #42b983;
}
</style>