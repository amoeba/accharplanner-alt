<template>
  <div id="app">
    <Notifications />
    <header>
      <div class="logo">
        <a href="/">
          <img
            src="/img/icons/axe_shield.gif"
            width="32"
            height="32"
            alt="Overly-Detailed Asheron's Call Character Planner (ODAACP)"
          />
        </a>
      </div>
      <nav>
        <router-link to="/">Planner</router-link>
        <router-link to="/builds">Builds</router-link>
        <router-link to="/import">Import</router-link>
      </nav>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Notifications from "./Notifications";

export default {
  name: "App",
  components: {
    Notifications
  }
};
</script>
