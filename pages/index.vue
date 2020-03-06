<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12" sm="10" offset-sm="1">
          <v-card>
            <v-card-text>
              <v-img
                class="text-center pt-12 pb-10"
                src="/header.jpg"
                :aspect-ratio="25/9"
                max-height="220"
                :gradient="$vuetify.theme.dark ? 'to top right, rgba(60,60,60,.43), rgba(25,32,33,.8)' : 'to top right, rgba(220,220,220,.43), rgba(255,255,255,.2)'"
              >
                <p class="title-font">
                  <i>Deep Learning</i>
                </p>
                <p class="title-font">
                  <i>Platform</i>
                </p>
              </v-img>
              <v-divider class="mt-6" />
              <p class="mt-3 ml-4 mr-4">
                このサイトは慶應義塾大学のAIC及びKCSで行われる講習会で使用する，補助的なサイトです．
                このサイトでは，講習会中行われるコンテストの他，質問を受けるためのスレッドサービスや，
                Pythonの基礎文法教材などの閲覧を行うことが可能です．
              </p>
              <p class="mt-3 ml-4 mr-4">
                画面左にはサービスの一覧が表示されます．
                まずは，「アカウント」ページに飛んで自分の自己紹介を行いましょう．
              </p>
              <p class="mt-3 ml-4 mr-4">
                なお，本サイトはAIC公式のものではなく，講師が勝手に作ったものです．質問等があれば開発者のスレッド「<nuxt-link to="/chat/一般">
                  一般
                </nuxt-link>」に投稿いただくか，メールアドレス「isitmy0530*keio.jp」までご連絡ください．
              </p>
              <v-row>
                <v-col cols="12" fill-height>
                  <v-card outlined :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
                    <v-card-title style="cursor: pointer" @click="$router.push('/informations')">
                      <v-icon>
                        mdi-information-variant
                      </v-icon>
                      最新お知らせ
                    </v-card-title>
                    <v-card-subtitle>
                      <div class="mb-2">
                        5件まで表示しています
                      </div>
                      <v-card
                        v-for="(information, i) in informations"
                        :key="information.id"
                        outlined
                        class="mb-n1"
                        :to="`/informations/${information.id}`"
                      >
                        <v-divider v-if="i" />
                        <v-card-title class="mb-n4 mt-n2">
                          {{ information.name }}
                        </v-card-title>
                        <v-card-text class="mb-n6">
                          {{ information.description }}
                        </v-card-text>
                        <v-card-subtitle class="overline text-right">
                          {{ information.created_at }}
                        </v-card-subtitle>
                      </v-card>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
                <v-col cols="12" fill-height>
                  <v-card outlined :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
                    <v-card-title style="cursor: pointer" @click="$router.push('/competitions')">
                      <v-icon>
                        mdi-medal
                      </v-icon>
                      最新コンテスト
                    </v-card-title>
                    <v-card-subtitle>
                      <div class="mb-2">
                        5件まで表示しています
                      </div>
                      <v-card v-for="(competition, i) in competitions" :key="competition.id" outlined class="mb-n1" :to="`/competitions/${competition.id}`">
                        <v-divider v-if="i" />
                        <v-card-title class="mb-n4 mt-n2">
                          {{ competition.name }}
                        </v-card-title>
                        <v-card-text class="mb-n6">
                          {{ competition.shortDescription }}
                        </v-card-text>
                        <v-card-subtitle class="overline text-right">
                          {{ competition.created_at }}
                        </v-card-subtitle>
                      </v-card>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
                <v-col cols="12" fill-height>
                  <v-card outlined :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
                    <v-card-title style="cursor: pointer" @click="$router.push('/chat')">
                      <v-icon>
                        mdi-comment
                      </v-icon>
                      最新スレッド
                    </v-card-title>
                    <v-card-subtitle>
                      <div class="mb-2">
                        5件まで表示しています
                      </div>
                      <v-card v-for="(chatroom, i) in chatrooms" :key="chatroom.id" outlined class="mb-n1" :to="`/chat/${chatroom.id}`">
                        <v-divider v-if="i" />
                        <v-card-title class="mb-n4 mt-n2">
                          {{ chatroom.id }}
                        </v-card-title>
                        <v-card-text class="mb-n6">
                          {{ chatroom.description }}
                        </v-card-text>
                        <v-card-subtitle class="overline text-right">
                          {{ chatroom.created_at }}
                        </v-card-subtitle>
                      </v-card>
                    </v-card-subtitle>
                  </v-card>
                </v-col>
                <v-col cols="12" fill-height>
                  <v-card outlined :color="$vuetify.theme.dark ? 'grey darken-4' : 'grey lighten-4'">
                    <v-card-title style="cursor: pointer" @click="$router.push('/accounts')">
                      <v-icon>
                        mdi-account
                      </v-icon>
                      マイアカウント
                    </v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
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
  informations: any[] = []
  chatrooms: any[] = []
  competitions: any[] = []

  async mounted () {
    const [infoSnaps, chatSnaps, compSnaps] = await Promise.all([
      db.collection('informations').orderBy('created_at', 'desc').limit(5).get(),
      db.collection('chatrooms').orderBy('created_at', 'desc').limit(5).get(),
      db.collection('competitions').orderBy('created_at', 'desc').limit(5).get()
    ])
    if (!infoSnaps.empty) {
      infoSnaps.forEach((snap) => {
        this.informations.push({
          id: snap.id,
          name: snap.data().name,
          description: snap.data().description,
          text: snap.data().text,
          created_at: dateFormatter(snap.data().created_at.toDate())
        })
      })
    }
    if (!chatSnaps.empty) {
      chatSnaps.forEach((snap) => {
        this.chatrooms.push({
          id: snap.id,
          description: snap.data().description,
          created_at: dateFormatter(snap.data().created_at.toDate())
        })
      })
    }
    if (!compSnaps.empty) {
      compSnaps.forEach((snap) => {
        this.competitions.push({
          id: snap.id,
          name: snap.data().name,
          shortDescription: snap.data().shortDescription,
          created_at: dateFormatter(snap.data().created_at.toDate())
        })
      })
    }
  }
}
export default Index
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Oxanium:300,600&display=swap');

.title-font {
  color: #ffffffec;
  font-family: Oxanium !important;
  font-weight: 600 !important;
  font-size: 3.75rem !important;
  line-height: 3.75rem;
  letter-spacing: -0.0083333333em !important;
}
</style>
