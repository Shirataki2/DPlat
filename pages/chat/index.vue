<template>
  <transition>
    <div>
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
                <b>質問・雑談</b>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-divider class="pb-5" />
        <div class="text-center pb-3">
          <v-btn outlined tile to="/chat/new">
            <v-icon class="mr-3">
              mdi-message-plus
            </v-icon>
            新規スレッド
          </v-btn>
        </div>
        <v-row>
          <v-col xs="12" sm="8" lg="6" offset-sm="2" offset-lg="3">
            <v-pagination
              v-model="page"
              :length="numPage"
              @input="onPageChange"
            />
            <div v-if="loadingText !== ''" class="text-center">
              {{ loadingText }}
            </div>
            <v-card
              v-for="(room, idx) in rooms"
              :key="room.id"
              class="mx-auto mb-2"
              outlined
            >
              <div style="cursor: pointer" @click="$router.push(`/chat/${room.id}`)">
                <v-card-title class="mb-3">
                  {{ room.id }}
                </v-card-title>
                <v-card-subtitle>
                  作成: {{ room.user }} ({{ room.created_at }})
                </v-card-subtitle>
                <v-card-text>
                  {{ room.description }}
                </v-card-text>
              </div>
              <v-card-actions class="mr-4 mb-2">
                <v-spacer />
                <v-btn v-if="!room.subscribe" class="mr-3" icon text @click="subscribe($event, { idx: idx, id: room.id, uref: room.uref })">
                  <v-badge
                    bordered
                    color="info"
                    :content="room.subscriber_num.toString()"
                    overlap
                  >
                    <v-icon>mdi-eye-plus</v-icon>
                  </v-badge>
                </v-btn>
                <v-btn v-if="room.subscribe" class="mr-3" icon text @click="unsubscribe($event, { idx: idx, id: room.id, uref: room.uref })">
                  <v-badge
                    bordered
                    color="info"
                    :content="room.subscriber_num.toString()"
                    overlap
                  >
                    <v-icon>mdi-eye-minus</v-icon>
                  </v-badge>
                </v-btn>
                <v-badge
                  bordered
                  color="info"
                  :content="room.comment_num.toString()"
                  overlap
                >
                  <v-icon>mdi-message-reply-text</v-icon>
                </v-badge>
              </v-card-actions>
            </v-card>
            <v-pagination
              v-model="page"
              :length="numPage"
              @input="onPageChange"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar
        v-model="snackbar"
        bottom
        :color="snackbarState"
        :timeout="3000"
      >
        {{ snackbarText }}
        <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import firebase from 'firebase'
import { authStore } from '../../store'
import { db, store } from '@/plugins/firebase'
import formatDate from '@/utils/date-formatter'

interface Room {
  id: string,
  user: string,
  user_ref: string,
  subscribe: boolean,
  comment_num: number,
  subscriber_num: number,
  description: string,
  created_at: string
}

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  rooms: Room[] = []
  allRooms: Room[] = []
  snackbar: boolean = false
  snackbarText: string = ''
  loadingText: string = ''
  snackbarState: string = 'success'
  page = 1
  numPerPage = 10
  numPage = 0

  async mounted () {
    this.loadingText = 'Loading ...'
    const snap = await db.collection('chatrooms').orderBy('created_at', 'desc').get()
    snap.forEach((doc) => {
      const data = doc.data()
      const date: Date = data.created_at.toDate()
      const subscribers = data.subscribers
      const userStore = authStore.user
      if (!userStore) {
        return
      }
      const isSubscribe = subscribers ? subscribers[userStore.uid] : false
      this.allRooms.push({
        id: doc.id,
        user: data.username,
        user_ref: data.user_ref,
        subscribe: isSubscribe,
        subscriber_num: subscribers ? Object.keys(subscribers).length : 0,
        comment_num: data.length,
        description: data.description,
        created_at: formatDate(date, {
          displaySec: true
        })
      })
    })
    this.rooms = this.allRooms.slice(0, this.numPerPage)
    this.numPage = Math.ceil(this.allRooms.length / this.numPerPage)
    this.loadingText = ''
  }

  onPageChange () {
    this.rooms = this.allRooms.slice((this.page - 1) * this.numPerPage, this.page * this.numPerPage)
  }

  async subscribe ($event: MouseEvent, { idx, id, uref }: { idx: number, id: string, uref: firebase.firestore.DocumentReference }) {
    const target = $event.target
    if (target) {
      const roomSnap = await db.collection('chatrooms').doc(id).get()
      const room = roomSnap.data()
      if (room) {
        const subscribers = room.subscribers ? room.subscribers : {}
        if (authStore.user) {
          subscribers[authStore.user.uid] = true
          await db.collection('chatrooms').doc(id).update({
            subscribers
          })
          const udata = (await db.collection('users').doc(authStore.user.uid).get()).data()
          uref.collection('notifications').add({
            from: authStore.user.uid,
            from_name: udata?.nickname,
            to: id,
            roomId: roomSnap.id,
            created_at: store.Timestamp.now(),
            checked: false,
            type: 'room/subscribe'
          })
          this.rooms[idx].subscribe = true
          this.rooms[idx].subscriber_num += 1
          this.snackbarText = `スレッド「${id}」に関する通知を受け取るようにしました`
          this.snackbarState = 'success'
          this.snackbar = true
        }
      }
    }
  }

  async unsubscribe ($event: MouseEvent, { idx, id, uref }: { idx: number, id: string, uref: firebase.firestore.DocumentReference }) {
    const target = $event.target
    if (target) {
      const roomSnap = await db.collection('chatrooms').doc(id).get()
      const room = roomSnap.data()
      if (room) {
        const subscribers = room.subscribers ? room.subscribers : {}
        if (authStore.user) {
          delete subscribers[authStore.user.uid]
          await db.collection('chatrooms').doc(id).update({
            subscribers
          })
          const udata = (await db.collection('users').doc(authStore.user.uid).get()).data()
          uref.collection('notifications').add({
            from: authStore.user.uid,
            from_name: udata?.nickname,
            to: id,
            roomId: roomSnap.id,
            created_at: store.Timestamp.now(),
            checked: false,
            type: 'room/unsubscribe'
          })
          this.rooms[idx].subscribe = false
          this.rooms[idx].subscriber_num -= 1
          this.snackbarText = `スレッド「${id}」に関する通知を受け取らないようにしました`
          this.snackbarState = 'error'
          this.snackbar = true
        }
      }
    }
  }
}
export default Index
</script>
