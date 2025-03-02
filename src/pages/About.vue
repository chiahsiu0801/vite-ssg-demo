<template>
  <div class="about">
    <h1>About Page</h1>
    <p>This page is client-side rendered (CSR).</p>
    <p>Current time: {{ currentTime }}</p>
    <p>Rendering type: <strong>{{ renderType }}</strong></p>
    <button @click="updateTime">Update Time</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentTime = ref('Loading...');
const renderType = ref('Determining...');

// This will only run in the browser
onMounted(() => {
  currentTime.value = new Date().toLocaleString();
  console.log('About page mounted on client side');
  
  // For CSR pages, the component is created at runtime
  // So the creation time will be very close to the current time
  renderType.value = 'CSR (Client-Side Rendered)';
});

const updateTime = () => {
  currentTime.value = new Date().toLocaleString();
};
</script>

<style scoped>
.about {
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