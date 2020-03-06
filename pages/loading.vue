<template>
  <v-container>
    <v-row>
      <v-col xs="12" lg="8" offset-lg="2" sm="10" offset-sm="1">
        <p class="display-3">
          Loading...
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  middleware: 'not-authenticated'
})
class Index extends Vue {
  mounted () {
    this.$auth.onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    })
  }
}
export default Index
</script>
