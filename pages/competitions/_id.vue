<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/competitions')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b v-if="competition">{{ competition.name }}</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-tabs
            v-if="competition"
            v-model="tab"
            color="primary"
            grow
            icons-and-text
            slider-color="primary"
          >
            <v-tab ripple>
              概要
              <v-icon>mdi-file-document</v-icon>
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text class="md" v-html="$md.render(competition.description)" />
              </v-card>
            </v-tab-item>
            <v-tab ripple>
              データ
              <v-icon>mdi-database</v-icon>
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text class="md" v-html="$md.render(competition.dataText)" />
              </v-card>
            </v-tab-item>
            <v-tab ripple>
              提出形式/評価
              <v-icon>mdi-format-list-numbered</v-icon>
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text class="md" v-html="$md.render(competition.submitText)" />
              </v-card>
            </v-tab-item>
            <v-tab ripple>
              提出
              <v-icon>mdi-file-upload</v-icon>
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-alert v-if="alertText" :type="alertType">
                    {{ alertText }}
                  </v-alert>
                  <b class="mt-2 pb-6">
                    提出ファイルの注意点
                  </b>
                  <p class="mt-1 ml-4">
                    ・ 提出するファイルの拡張子は{{ competition.allowExtension }}である必要があります
                  </p>
                  <p class="mt-1 ml-4">
                    ・ 提出するファイルの大きさは{{ getFileSize() }}以下である必要があります
                  </p>
                  <p class="mt-1 mb-4 ml-4">
                    ・ 提出するファイルの結果はサーバに保存されません
                  </p>
                  <v-file-input
                    v-model="file"
                    :accept="competition.allowExtension"
                    class="pt-6 mb-6"
                    :rules="fileRules"
                    placeholder="選択 ..."
                    :disabled="disableSelect"
                    show-size
                    label="提出ファイル"
                  />
                  <v-btn
                    outlined
                    large
                    block
                    color="success"
                    :disabled="disableSubmit"
                    @click="submit"
                  >
                    提出
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab ripple>
              ランキング
              <v-icon>mdi-podium</v-icon>
            </v-tab>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-card v-if="resultText" :color="getColor()" class="mb-6 mt-6" outlined>
                    <v-card-text class="text-center white--text">
                      <p class="title">
                        {{ resultText }}
                      </p>
                      <b class="display-4">{{ resultRank }}</b>
                    </v-card-text>
                  </v-card>
                  <p v-if="submits.length === 0" class="text-center mt-10 pb-10">
                    まだ投稿はありません
                  </p>
                  <v-simple-table v-else>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-right">
                            Rank
                          </th>
                          <th class="text-center">
                            User
                          </th>
                          <th class="text-right">
                            提出回数
                          </th>
                          <th class="text-center">
                            スコア
                          </th>
                          <th class="text-center">
                            日時
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="submit in submits" :id="submit.id === highlight ? 'highlight' : ''" :key="submit.id">
                          <td class="text-right">
                            {{ submit.rank }}
                          </td>
                          <td class="text-center">
                            <nuxt-link :to="`/accounts/${submit.userid}`">
                              {{ submit.user }}
                            </nuxt-link>
                          </td>
                          <td class="text-right">
                            {{ submit.n }}
                          </td>
                          <td class="text-center">
                            {{ submit.score }}
                          </td>
                          <td class="text-center">
                            {{ submit.post_at }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import firebase from 'firebase'
import { authStore } from '../../store'
import { Competition } from '@/pages/competitions/index.vue'
import { db, store } from '@/plugins/firebase'
import dateFormatter from '@/utils/date-formatter'

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  competitionSnap: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> | null = null
  competition: Competition | null = null
  tab = 0
  file: File | null = null
  disableSelect = false
  disableSubmit = false
  alertText = ''
  alertType = ''
  resultText = ''
  resultRank = ''
  rank = 9
  highlight: string | null = null
  highlightUser: string | null = null
  submits: any[] = []

  fileRules: ((value: File) => true|string)[] = []

  @Watch('file', { immediate: true, deep: true })
  onFileSelect () {
    this.disableSubmit = !this.file
  }

  head () {
    return {
      title: this.competition ? this.competition.name : 'コンテスト'
    }
  }

  async mounted () {
    this.competitionSnap = await db.collection('competitions').doc(this.$route.params.id).get()
    if (!this.competitionSnap.exists) {
      this.competition = {
        name: '指定されたコンテストが見つかりませんでした',
        id: '',
        description: '',
        shortDescription: '',
        dataText: '',
        submitText: '',
        sort: '',
        maxFileSize: NaN,
        allowExtension: 'NaN',
        created_at: '',
        apiURL: ''
      }
      this.disableSelect = true
      this.disableSubmit = true
      return
    }
    const data: any = this.competitionSnap?.data()
    this.competition = data
    this.fileRules.push((value: File|null) => !value || value.size < (this.competition?.maxFileSize || NaN) || `ファイルサイズの上限は${this.getFileSize()}`)
    const sort = this.competition?.sort
    if (sort === 'desc' || sort === 'asc') {
      db.collection('competitions').doc(this.$route.params.id).collection('submits').orderBy('score', sort).onSnapshot((snaps) => {
        let i = 1
        this.submits = []
        snaps.forEach((snap) => {
          this.submits.push({
            rank: i,
            id: snap.id,
            score: snap.data().score,
            user: snap.data().user,
            userid: snap.data().userid,
            n: snap.data().n,
            post_at: dateFormatter(snap.data().post_at.toDate())
          })
          if (snap.id === this.highlight) {
            this.resultText = `あなたのスコア: ${snap.data().score}`
            this.resultRank = `${i}位`
            this.rank = i
          }
          i++
        })
      })
    }
  }

  submit () {
    const reader = new FileReader()
    if (this.file) {
      this.disableSelect = true
      this.disableSubmit = true
      reader.addEventListener('loadend', async (e) => {
        if (e && e.srcElement && this.competition) {
          const t: any = e.srcElement
          const result: string = t.result
          const { data } = await this.$axios.post(
            this.competition.apiURL,
            {
              body: result
            }
          )
          const userSubmitsRef = db.collection('users').doc(authStore.user?.uid).collection('competitions').doc(this.$route.params.id)
          const compSubmitsRef = db.collection('competitions').doc(this.$route.params.id).collection('submits')
          const [submits, userdata] = await Promise.all([userSubmitsRef.collection('submits').get(), userSubmitsRef.get()])
          const highscore = (userdata.data() && userdata.data()?.highscore) ? (this.competition.sort === 'desc' ? Math.max(userdata.data()?.highscore, data.score) : Math.min(userdata.data()?.highscore, data.score)) : data.score
          const user = await db.collection('users').doc(authStore.user?.uid).get()
          const nos = submits.size + 1
          this.highlight = `${authStore.user?.uid}_${nos}`
          this.highlightUser = `${authStore.user?.uid}`
          await Promise.all([
            userSubmitsRef.collection('submits').doc(`${authStore.user?.uid}_${nos}`).set({
              score: data.score,
              n: nos,
              post_at: store.Timestamp.now()
            }),
            compSubmitsRef.doc(`${authStore.user?.uid}_${nos}`).set({
              score: data.score,
              userid: authStore.user?.uid,
              user: user.data()?.nickname,
              n: nos,
              post_at: store.Timestamp.now()
            }),
            userSubmitsRef.set({
              sort: this.competition.sort,
              shortDescription: this.competition.shortDescription,
              name: this.competition.name,
              highscore,
              n: nos
            }, { merge: true })
          ])
          this.alertText = '投稿が完了しました'
          this.alertType = 'success'
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 1000)
          })
          this.alertText = ''
          this.tab = 4
          this.file = null
          this.disableSelect = false
          this.disableSubmit = false
        }
      })
      reader.readAsText(this.file)
    }
  }

  getColor () {
    switch (this.rank) {
      case 1:
        return 'yellow darken-1'
      case 2:
        return 'grey lighten-1'
      case 3:
        return 'orange accent-3'
      default:
        return 'light-blue darken-2'
    }
  }

  getFileSize () {
    const size = this.competition?.maxFileSize
    if (!size) {
      return 'NaN'
    }
    if (size < 1024) {
      return `${size} B`
    }
    if (size < 1024 * 1024) {
      return `${size / 1024} kB`
    }
    return `${size / 1024 / 1024} MB`
  }
}
export default Index
</script>

<style scoped>
#highlight {
  background-color: deepskyblue;
}
</style>
