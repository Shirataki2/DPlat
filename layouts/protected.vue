<template>
  <v-app dark>
    <AppHeader />
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { authStore } from '@/store'
import { db, store, realtimedb } from '@/plugins/firebase'
import AppHeader from '@/components/Header.vue'

@Component({
  middleware: 'authenticated',
  components: {
    AppHeader
  }
})
class Index extends Vue {
  mounted () {
    if (!authStore.user) { return }
    const statusRef = realtimedb().ref(`/status/${authStore.user.uid}`)
    const onlineStatus = {
      status: 'online',
      last_changed: realtimedb.ServerValue.TIMESTAMP
    }
    const offlineStatus = {
      status: 'offline',
      last_changed: realtimedb.ServerValue.TIMESTAMP
    }
    const statusRefFS = db.doc(`/status/${authStore.user.uid}`)
    const onlineStatusFS = {
      status: 'online',
      last_changed: store.FieldValue.serverTimestamp()
    }
    const offlineStatusFS = {
      status: 'offline',
      last_changed: store.FieldValue.serverTimestamp()
    }
    realtimedb().ref('.info/connected').on('value', function (snap) {
      if (!snap.val()) {
        statusRefFS.set(offlineStatusFS)
      } else {
        statusRef.onDisconnect().set(offlineStatus).then(function () {
          statusRef.set(onlineStatus)
          statusRefFS.set(onlineStatusFS)
        })
      }
    })
  }
}
export default Index
</script>
