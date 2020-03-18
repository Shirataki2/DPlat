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
              <b>お知らせ</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" md="8" offset-md="2">
          <v-pagination
            v-model="page"
            :length="numPage"
            @input="onPageChange"
          />
          <v-card
            v-for="information in informations"
            :key="information.id"
            :to="`/informations/${information.id}`"
          >
            <v-card-title>
              {{ information.name }}
            </v-card-title>
            <v-card-text class="ml-3">
              {{ information.description }}
            </v-card-text>
            <v-card-subtitle class="overline text-right">
              {{ information.created_at }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
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
  informations: any[] = []
  allInformations: any[] = []
  page = 1
  numPerPage = 5
  numPage = 0

  head () {
    return {
      title: 'お知らせ'
    }
  }

  async mounted () {
    const infoSnaps = await db.collection('informations').orderBy('created_at', 'desc').get()
    infoSnaps.forEach((snap) => {
      const data = snap.data()
      this.allInformations.push({
        id: snap.id,
        ...data,
        created_at: dateFormatter(data.created_at.toDate())
      })
    })
    this.informations = this.allInformations.slice(0, this.numPerPage)
    this.numPage = Math.ceil(this.allInformations.length / this.numPerPage)
  }

  onPageChange () {
    this.informations = this.allInformations.slice((this.page - 1) * this.numPerPage, this.page * this.numPerPage)
  }
}
export default Index
</script>
