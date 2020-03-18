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
import AppHeader from '@/components/Header.vue'

@Component({
  middleware: 'admin',
  components: {
    AppHeader
  }
})
class Index extends Vue {
}
export default Index
</script>
