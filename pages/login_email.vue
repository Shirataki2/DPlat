<template>
  <v-container>
    <v-row>
      <v-col xs="12" lg="8" offset-lg="2" sm="10" offset-sm="1">
        <v-card raised>
          <v-card-title class="display-2 justify-center pa-8">
            Login
          </v-card-title>
          <v-divider />
          <v-alert v-if="!!alertText" class="ma-3" type="error">
            {{ alertText }}
          </v-alert>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent
            >
              <v-text-field
                v-model="email"
                name="email"
                label="メールアドレス *"
                :rules="[
                  (v) => !!v || '必須項目です',
                  (v) => /.+@.+\..+/.test(v) || '有効な形式ではありません'
                ]"
              />
              <v-text-field
                v-model="password"
                name="password"
                label="パスワード *"
                :rules="[
                  (v) => !!v || '必須項目です',
                ]"
                counter
                :append-icon="passwordInvisibility ? 'mdi-eye' : 'mdi-eye-off'"
                :type="passwordInvisibility ? 'password' : 'text'"
                @click:append="passwordInvisibility = !passwordInvisibility"
              />
              <v-btn color="info" text @click="submit">
                Login
              </v-btn>
            </v-form>
            <v-col xs="12" class="text-center ma-1">
              <p class="caption">
                管理者専用のログインページです．通常は
                <nuxt-link to="/login">
                  こちら
                </nuxt-link>
                よりログインしてください
              </p>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { authStore } from '../store'

@Component({
  middleware: 'not-authenticated'
})
class Login extends Vue {
  valid = false
  email = ''
  password = ''
  alertText = ''
  passwordInvisibility = true

  async submit () {
    try {
      const userCredential = await this.$auth.signInWithEmailAndPassword(this.email, this.password)
      const user = userCredential.user
      if (user) {
        await authStore.login(user)
        this.$router.push('/')
      }
    } catch (e) {
      const errorCode = e.code
      if (errorCode === 'auth/user-not-found') {
        this.alertText = 'ユーザが見つかりません'
      } else if (errorCode === 'auth/user-disabled') {
        this.alertText = 'ユーザが管理者により無効化されています'
      } else if (errorCode === 'auth/wrong-password') {
        this.alertText = 'パスワードが一致しません'
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
