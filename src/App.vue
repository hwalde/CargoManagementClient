<!-- src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>Cargo Management System</h1>
      <nav>
        <router-link to="/">Schiffe</router-link>
        <router-link to="/containers">Container</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
header {
  background-color: #2E4053;
  color: white;
  padding: 20px;
}
nav {
  margin-top: 10px;
}
nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
}
nav a.router-link-exact-active {
  text-decoration: underline;
}
main {
  padding: 20px;
}
</style>
