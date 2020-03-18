<template>
  <v-app dark>
    <AppHeader />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { authStore } from '@/store'
import AppHeader from '@/components/Header.vue'

@Component({
  components: {
    AppHeader
  }
})
class Index extends Vue {
  mounted () {
    this.$auth.onAuthStateChanged((user) => {
      if (user) {
        authStore.login(user)
      } else {
        authStore.logout()
      }
    })
  }
}
export default Index
</script>
