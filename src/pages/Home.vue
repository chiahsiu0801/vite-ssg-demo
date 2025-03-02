<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>This page is pre-rendered with SSG.</p>
    <p>Generated at: {{ generationTime }}</p>
    <p>Current client time: {{ clientTime }}</p>
    <p>Rendering type: <strong>{{ renderType }}</strong></p>
    <button @click="updateClientTime">Update Client Time</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// This will be replaced at build time by vite
const generationTime = ref(`Build time: __BUILD_TIME__`);
const clientTime = ref('Not loaded yet');
const renderType = ref('SSG (Static Site Generated)');

// This will only run in the browser after hydration
onMounted(() => {
  clientTime.value = new Date().toLocaleString();
  console.log('Home page hydrated on client side');
});

const updateClientTime = () => {
  clientTime.value = new Date().toLocaleString();
};
</script>

<style scoped>
.home {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 20px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
