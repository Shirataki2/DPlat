<template>
  <div>
    <v-app-bar
      :color="$vuetify.theme.dark ? 'blue darken-4' : 'blue darken-1'"
      dark
      clipped-left
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="logo" style="cursor: pointer" @click="$router.push('/')">
        D Plat
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="isLoggedIn" text icon style="cursor: pointer" @click="$router.push('/accounts/notifications')">
        <v-badge
          v-if="notificationCount !== 0"
          color="error"
          bottom
          bordered
          :offset-x="11"
          :offset-y="11"
          :content="notificationCount"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
        <v-icon v-else>
          mdi-bell
        </v-icon>
      </v-btn>
      <v-btn v-if="isLoggedIn" text icon style="cursor: pointer" @click="$router.push('/accounts')">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn
        v-if="isLoggedIn"
        text
        icon
        style="cursor: pointer"
        @click="$vuetify.theme.dark = !$vuetify.theme.dark"
      >
        <v-icon>
          {{ $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list
        nav
        dense
      >
        <div v-if="isLoggedIn">
          <v-subheader>
            Home
          </v-subheader>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                トップページ
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/informations">
            <v-list-item-icon>
              <v-icon>mdi-information-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                お知らせ
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>
            Community
          </v-subheader>
          <v-list-item to="/competitions">
            <v-list-item-icon>
              <v-icon>mdi-medal</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                コンテスト
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/chat">
            <v-list-item-icon>
              <v-icon>mdi-chat-processing</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                質問・雑談
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>
            Resources
          </v-subheader>
          <v-list-group prepend-icon="mdi-school">
            <template v-slot:activator>
              <v-list-item-title>学習テキスト</v-list-item-title>
            </template>
            <v-list-item
              v-for="text in texts"
              :key="text.name"
              :to="`/textbooks/${text.id}`"
            >
              <v-list-item-icon class="pl-3">
                <v-icon>{{ text.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ text.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </div>
        <v-subheader>
          Accounts
        </v-subheader>
        <!-- 未ログイン -->
        <v-list-item v-if="!isLoggedIn" to="/login">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              登録/ログイン
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!isLoggedIn" to="register">
          <v-list-item-icon color="gray lighten-3">
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title color="gray lighten-3">
              メール登録 (停止中)
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- ログイン済 -->
        <v-list-item v-if="isLoggedIn" to="/accounts">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              マイアカウント
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" to="/accounts/notifications">
          <v-list-item-icon>
            <v-badge
              v-if="notificationCount !== 0"
              color="error"
              bottom
              bordered
              :offset-x="11"
              :offset-y="11"
              :content="notificationCount"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
            <v-icon v-else>
              mdi-bell
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              通知
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLoggedIn" @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              ログアウト
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import twemoji from 'twemoji'
import { db } from '@/plugins/firebase'
import { authStore } from '@/store'
@Component
class Header extends Vue {
  drawer = null
  notificationCount = 0
  texts: any[] = []

  get isLoggedIn () { return authStore.isLoggedIn }
  get user () { return authStore.user }

  beforeMount () {
    const t: any = this
    t.$md.renderer.rules.emoji = function (token:any, idx:any) {
      return twemoji.parse(token[idx].content)
    }
  }

  async logout () {
    await authStore.logout()
    this.$router.push('/login')
  }

  async mounted () {
    const user = authStore.user
    this.$router.afterEach(async (_from, _to) => {
      this.notificationCount = 0
      if (user) {
        const notificationSnap = await db.collection('users').doc(user.uid).collection('notifications').orderBy('created_at', 'desc').get()
        notificationSnap.forEach((snap) => {
          const data = snap.data()
          if (!data.checked) { this.notificationCount++ }
        })
      }
    })
    const textSnaps = await db.collection('texts').orderBy('priority').get()
    textSnaps.forEach((snap) => {
      const data = snap.data()
      this.texts.push({
        id: snap.id,
        ...data
      })
    })
  }
}

export default Header
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Oxanium:300,600&display=swap');

.logo {
    font-size: 1.5rem !important;
    font-weight: 600;
    line-height: 2rem;
    letter-spacing: 0.0125em !important;
    font-family: "Oxanium", sans-serif !important;
}
</style>
