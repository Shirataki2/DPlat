<template>
  <transition>
    <v-container>
      <div class="pt-1 pb-3">
        <div class="title">
          <v-btn text style="cursor: pointer" @click="$router.push('/')">
            <v-icon>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <b>テスト</b>
        </div>
      </div>
      <v-divider />
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-pagination v-model="page" :length="numPage" @input="onPageChange" />
          <v-card
            v-for="information in informations"
            :key="information.id"
          >
            <v-card-title>
              {{ information.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  },
  asyncData ({ error }) {
    error({ statusCode: 503 })
  }
})
class Index extends Vue {
}
export default Index
</script>
