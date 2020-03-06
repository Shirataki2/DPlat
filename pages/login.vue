<template>
  <v-container>
    <v-row>
      <v-col xs="12" lg="8" offset-lg="2" sm="10" offset-sm="1">
        <v-card raised>
          <v-card-title class="display-2 justify-center pa-8">
            登録/ログイン
          </v-card-title>
          <v-card-text class="text-center caption">
            keio.jpドメインでのみログインできます
          </v-card-text>
          <v-divider />
          <v-alert v-if="!!alertText" class="ma-3" type="error">
            {{ alertText }}
          </v-alert>
          <v-card-text class="text-center mt-5 pb-10">
            <v-btn color="info" @click="login">
              Sign In With Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { authStore } from '../store'
import { providers } from '@/plugins/firebase'

@Component({
  middleware: 'not-authenticated'
})
class Login extends Vue {
  valid = false
  email = 'tmy1997530@gmail.com'
  password = 'fgjiutx530'
  alertText = ''
  passwordInvisibility = true

  async login () {
    try {
      providers.google.setCustomParameters({
        hd: 'keio.jp'
      })
      const userCredential = await this.$auth.signInWithPopup(providers.google)
      const user = userCredential.user
      if (user) {
        await authStore.login(user)
        this.$router.push('/')
      }
    } catch (e) {
      const errorCode = e.code
      if (errorCode === 'auth/popup-closed-by-user') {
        this.alertText = 'ポップアップ画面が閉じられました'
      } else if (errorCode === 'auth/popup-blocked') {
        this.alertText = 'ブラウザによりポップアップがブロックされました'
      } else if (errorCode === 'auth/unauthorized-domain') {
        this.alertText = '認可されていないドメインです'
      } else if (errorCode === 'auth/cancelled-popup-request') {
      } else {
        this.alertText = '不明なエラーが発生しました'
      }
    }
  }

  reset () {
    this.email = ''
    this.password = ''
    this.passwordInvisibility = true
    this.alertText = ''
    const form:any = this.$refs.form
    if (form) {
      form.resetValidation()
    }
  }
}
export default Login
</script>
