<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Voice recorder</router-link>
      <router-link to="/how-to-record">How to record</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/disclaimer">Disclaimer</router-link>
      <router-link to="/feedback">Feedback</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {}
};
</script>

<style scoped>
@import "./assets/css/base.css";
@import "./assets/css/icomoon/style.css";

#app {
  width: 880px;
  margin: 0 auto;
}

#nav {
  display: flex;
  line-height: 20px;
}
a {
  padding: 20px;
}
a:nth-child(1) {
  margin-right: auto;
}
.router-link-exact-active {
  text-decoration: none;
}
</style>
