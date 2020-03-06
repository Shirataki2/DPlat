<template>
  <transition>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="title pt-1 pb-3">
              <v-btn text style="cursor: pointer" @click="$router.push('/informations')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>
                {{ name }}
              </b>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="10" offset-sm="1">
            <div class="md" v-html="$md.render(text)" />
          </v-col>
          <v-col xs="12" sm="10" offset-sm="1" class="mt-5">
            <p class="overline grey--text text--lighten-1 text-right mb-2" style="cursor: pointer" @click="$router.push(`/accounts/${uid}`)">
              {{ createdAt }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { db } from '@/plugins/firebase'
import dateFormatter from '@/utils/date-formatter'

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  text = ''
  name = ''
  createdAt = ''

  async mounted () {
    const infoSnap = await db.collection('informations').doc(this.$route.params.id).get()
    const data = infoSnap.data()
    if (infoSnap.exists && data) {
      this.text = data.text
      this.name = data.name
      this.createdAt = dateFormatter(data.created_at.toDate())
    }
  }
}
export default Index
</script>
