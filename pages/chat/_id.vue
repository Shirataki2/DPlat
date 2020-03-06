<template>
  <transition>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="title pt-1 pb-3">
              <v-btn text style="cursor: pointer" @click="$router.push('/chat')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>
                {{ $route.params.id }}
              </b>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" sm="10" offset-sm="1">
            <div class="md" v-html="$md.render(description)" />
          </v-col>
        </v-row>
        <p class="subtitle1 grey--text text--lighten-1 text-right mb-2" style="cursor: pointer" @click="$router.push(`/accounts/${uid}`)">
          {{ createdAt }} &middot; {{ username }}
        </p>
        <v-divider class="pb-2" />
        <v-row>
          <v-col
            xs="12"
            sm="10"
            md="8"
            lg="6"
            offset-sm="1"
            offset-md="2"
            offset-lg="3"
          >
            <p class="title justify-center text-center">
              {{ posts.length }}件のコメント
            </p>
            <v-card v-for="(post, index) in posts" :key="post.id" style="background-color: transparent" flat tile>
              <v-divider v-if="index > 0" />
              <v-card-title class="pb-n4">
                <span style="cursor: pointer" @click="$router.push(`/accounts/${post.uid}`)">
                  {{ post.user }}
                </span>
              </v-card-title>
              <v-card-text class="body-2 pl-7 mt-n4" style="white-space: pre-line">
                {{ post.text.trim() }}
              </v-card-text>
              <v-card-subtitle class="caption gray lighten-1 mt-n4">
                {{ post.post_at }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          top
          color="info"
          :timeout="10000"
        >
          {{ infotext }}
          <v-btn flat color="primary" @click.native="snackbar = false">
            Close
          </v-btn>
        </v-snackbar>
      </v-container>
      <v-footer>
        <v-row>
          <v-col xs="12" sm="10" offset-sm="1" md="8" offset-md="2">
            <v-form ref="textbox">
              <v-textarea
                v-model="text"
                name="input"
                label="コメントを残そう!"
                maxlength="500"
                :disabled="disable"
                counter
                auto-grow
                filled
                :rules="[
                  (v) => v.length <= 500 || '文字数超過です',
                ]"
              />
            </v-form>
          </v-col>
          <v-col
            xs="12"
            sm="10"
            offset-sm="1"
            md="8"
            offset-md="2"
            class="mt-n6"
          >
            <v-btn text color="primary" :disabled="disable" @click="submit">
              送信
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import firebase from 'firebase'
import { db, store } from '@/plugins/firebase'
import formatDate from '@/utils/date-formatter'
import { authStore } from '@/store'

interface Post {
  id: string,
  uid: string,
  user: string,
  // photoURL: string,
  text: string,
  post_at: string
}

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  posts: Post[] = []
  text = ''
  description = ''
  uid = ''
  disable = false
  username = ''
  createdAt = ''
  infotext = ''
  snackbar = false

  async mounted () {
    const [doc, snaps] = await Promise.all([
      db.collection('chatrooms').doc(this.$route.params.id).get(),
      db.collection('chatrooms').doc(this.$route.params.id).collection('posts').orderBy('post_at').get()
    ])
    if (doc?.exists) {
      const data = doc.data()
      if (!data) { return }
      this.description = data.text
      this.createdAt = formatDate(data.created_at.toDate())
      const userRef: string = data.user_ref
      const userSnap = await db.collection('users').doc(userRef).get()
      const userdata = userSnap.data()
      this.uid = userRef
      this.username = userdata?.nickname
    } else {
      this.description = '### 指定されたスレッドはありません'
      this.disable = true
      return
    }
    if (!snaps) { return }
    snaps.forEach((snap) => {
      const data = snap.data()
      const uref: string = data.user_ref
      const user = data.username
      this.posts.push({
        id: data.id,
        uid: uref,
        user,
        // photoURL: imgsrc,
        text: data.text,
        post_at: formatDate(data.post_at.toDate(), { displaySec: true })
      })
    })
  }

  async submit () {
    if (!this.text) { return }
    const form: any = this.$refs.textbox
    if (!form.validate()) { return }
    const currentUser = authStore.user
    this.infotext = '送信中...'
    this.snackbar = true
    if (!currentUser) { return }
    this.disable = true
    const [userSnap, roomSnap] = await Promise.all([
      db.collection('users').doc(currentUser.uid).get(),
      db.collection('chatrooms').doc(this.$route.params.id).get()
    ])
    db.collection('chatrooms').doc(this.$route.params.id).collection('posts').add({
      user_ref: currentUser.uid,
      username: userSnap.data()?.nickname,
      text: this.text,
      post_at: store.Timestamp.now()
    })
    roomSnap.ref.update({
      length: roomSnap.data()?.length + 1
    })
    const subscribers: Object = roomSnap.data()?.subscribers
    const processes: Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>[] = []
    if (subscribers) {
      Object.keys(subscribers).forEach((subscriber) => {
        processes.push(
          db.collection('users').doc(subscriber).collection('notifications').add({
            from: currentUser.uid,
            from_name: userSnap.data()?.nickname,
            // eslint-disable-next-line camelcase
            to: roomSnap.data()?.user_ref,
            roomId: this.$route.params.id,
            type: 'chat/newMessage',
            created_at: store.Timestamp.now(),
            checked: false
          })
        )
      })
    }
    this.text = ''
    Promise.all(processes).then(() => location.reload())
    this.disable = false
  }
}
export default Index
</script>
