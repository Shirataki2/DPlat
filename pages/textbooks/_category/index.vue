<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/textbooks')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>準備中</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
}
export default Index
</script>
