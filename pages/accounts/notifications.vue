<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/accounts')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>通知</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-pagination
        v-model="page"
        :length="numPage"
        @input="onPageChange"
      />
      <v-card v-for="(notification, index) in notifications" :key="notification.id" style="background-color: transparent" flat tile>
        <v-divider v-if="index > 0" />
        <v-card-title class="body-2 pl-7">
          <v-row>
            <v-col class="col-1">
              <v-icon v-if="!notification.checked">
                mdi-alert-decagram
              </v-icon>
              <v-icon v-else>
                mdi-circle-small
              </v-icon>
            </v-col>
            <v-col class="col-11">
              <div v-html="texts[index]" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle class="overline gray lighten-1 mt-n4 text-right">
          {{ notification.created_at }}
        </v-card-subtitle>
      </v-card>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { db } from '@/plugins/firebase'
import { authStore } from '@/store'
import dateFormatter from '@/utils/date-formatter'

interface Notification {
  type: 'room/subscribe' | 'room/unsubscribe' | 'chat/newMessage' | 'info/new',
  from: string,
  from_name: string,
  roomId: string,
  to: string,
  created_at: string,
  checked: boolean,
  name?: string,
  id?: string
}

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  allNotifications: any[] = []
  page = 1
  numPerPage = 5
  numPage = 0
  notifications: Notification[] = []
  texts: string[] = []

  async created () {
    if (process.server) { return }
    if (authStore.user) {
      const notiSnaps = await db.collection('users').doc(authStore.user.uid).collection('notifications').orderBy('created_at', 'desc').get()
      notiSnaps.forEach((snap) => {
        const data = snap.data()
        this.allNotifications.push({
          type: data.type,
          from: data.from,
          from_name: data.from_name,
          roomId: data.roomId,
          to: data.to,
          checked: data.checked,
          name: data.name,
          id: snap.id,
          ...data,
          created_at: dateFormatter(data.created_at.toDate(), { displaySec: true })
        })
        snap.ref.update({
          checked: true
        })
      })
      this.notifications = this.allNotifications.slice(0, this.numPerPage)
      this.numPage = Math.ceil(this.allNotifications.length / this.numPerPage)
      this.texts = []
      for (let i = 0; i < this.notifications.length; i++) {
        const n = this.makeNotificationText(i)
        this.texts.push(n)
      }
    }
  }

  onPageChange () {
    this.notifications = this.allNotifications.slice((this.page - 1) * this.numPerPage, this.page * this.numPerPage)
    this.texts = []
    for (let i = 0; i < this.notifications.length; i++) {
      const n = this.makeNotificationText(i)
      this.texts.push(n)
    }
  }

  makeNotificationText (index: number) {
    const notification = this.notifications[index]
    let text = ''
    if (notification.type === 'room/subscribe') {
      text += `<a href="${notification.from}">${notification.from_name}</a>さんが`
      text += `あなたのスレッド「<a href="/chat/${notification.to}">${notification.to}</a>」を購読しました`
    } else if (notification.type === 'room/unsubscribe') {
      text += `<a href="${notification.from}">${notification.from_name}</a>さんが`
      text += `あなたのスレッド「<a href="/chat/${notification.to}">${notification.to}</a>」を購読解除しました`
    } else if (notification.type === 'chat/newMessage') {
      text += `<a href="${notification.from}">${notification.from_name}</a>さんが`
      text += `あなたのスレッド「<a href="/chat/${notification.roomId}">${notification.roomId}</a>」にコメントしました`
    } else if (notification.type === 'info/new') {
      text += `新しいお知らせ: <a href="/informations/${notification.id}">${notification.name}</a>`
    }
    return text
  }
}
export default Index
</script>
