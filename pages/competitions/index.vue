<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>コンテスト</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <p v-if="competitions.length === 0" class="text-center mt-12">
        {{ alertText }}
      </p>
      <v-row v-else>
        <v-col cols="12" md="8" offset-md="2">
          <v-card
            v-for="competition in competitions"
            :key="competition.id"
            :to="`/competitions/${competition.id}`"
          >
            <v-card-title>
              {{ competition.name }}
            </v-card-title>
            <v-card-text class="ml-3">
              {{ competition.shortDescription }}
            </v-card-text>
            <v-card-subtitle class="overline text-right">
              {{ competition.created_at }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { db } from '../../plugins/firebase'
import dateFormatter from '../../utils/date-formatter'

export interface Competition {
  id: string,
  name: string,
  description: string,
  shortDescription: string,
  dataText: string,
  submitText: string,
  sort: string,
  maxFileSize: number,
  allowExtension: string,
  created_at: string,
  apiURL: string
}

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  competitions: Competition[] = []
  alertText: string = ''

  head () {
    return {
      title: 'コンテスト'
    }
  }

  async mounted () {
    const snapComp = await db.collection('competitions').orderBy('created_at', 'desc').get()
    if (snapComp.empty) {
      this.alertText = '開催しているコンテストは無いようです...'
    } else {
      snapComp.forEach((snap) => {
        const data: any = snap.data()
        this.competitions.push({
          ...data,
          created_at: dateFormatter(data.created_at.toDate(), { displayHM: false })
        })
      })
    }
  }
}
export default Index
</script>
