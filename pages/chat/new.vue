<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/chat')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>スレッドの新規作成</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider class="pb-5" />
      <v-row>
        <v-col xs="12" sm="8" offset-sm="2">
          <v-alert v-if="!!alertText" class="ma-3" type="error">
            {{ alertText }}
          </v-alert>
          <v-alert v-if="!!successText" class="ma-3" type="success">
            {{ successText }}
          </v-alert>
          <template>
            <v-form ref="form" v-model="valid" lazy-validation class="mt-2">
              <v-text-field
                v-model="name"
                label="スレッド名 *"
                :rules="[
                  (v) => !!v || '入力してください',
                  (v) => v.length <= 32 || '32字以内で入力してください',
                ]"
                :counter="32"
                required
                @input="onInput"
              />
              <v-textarea
                v-model="description"
                label="概要 *"
                rows="3"
                :counter="140"
                :rules="[
                  (v) => !!v || '入力してください',
                  (v) => v.length <= 140 || '140字以内で入力してください',
                ]"
                required
                @input="onInput"
              />
              <v-textarea
                v-model="text"
                label="本文 *"
                auto-grow
                rows="20"
                :counter="5000"
                :rules="[
                  (v) => !!v || '入力してください',
                  (v) => v.length <= 5000 || '5000字以内で入力してください',
                ]"
                required
                hint="Markdownの文法が使えます"
                @input="onInput"
              />
              <v-dialog v-model="dialog" max-width="1000px" scrollable>
                <template v-slot:activator="{ on }">
                  <div class="text-center">
                    <v-btn color="info" dark outlined v-on="on">
                      <v-icon>
                        mdi-view-quilt
                      </v-icon>
                      open Preview
                    </v-btn>
                  </div>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Preview</span>
                  </v-card-title>
                  <v-card-text>
                    <div class="md" v-html="$md.render(text)" />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="green darken-1" text @click="dialog = false">
                      閉じる
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <div class="text-center mt-5">
                <v-btn
                  :disabled="disable"
                  color="success"
                  outlined
                  @click="submit"
                >
                  <v-icon>
                    mdi-upload
                  </v-icon>
                  submit
                </v-btn>
                <v-btn
                  color="error"
                  outlined
                  @click="clear"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                  clear
                </v-btn>
              </div>
            </v-form>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { db, store } from '@/plugins/firebase'
import { authStore } from '@/store'

@Component({
  layout: 'protected',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  valid: boolean = false
  disable: boolean = false
  dialog: boolean = false
  name: string = ''
  description: string = ''
  text: string = ''
  alertText: string = ''
  successText: string = ''

  async submit () {
    const form: any = this.$refs.form
    if (!form.validate()) { return }
    this.disable = true
    const roomsRef = db.collection('chatrooms')
    if (!authStore.user) {
      this.disable = false
      return
    }
    const [roomsSnap, userdata] = await Promise.all([roomsRef.get(), db.collection('users').doc(authStore.user.uid).get()])
    const isExist = roomsSnap.docs.map(snap => snap.id).includes(this.name)
    if (isExist) {
      this.alertText = '既にその名前のスレッドは作られています'
      this.disable = false
      return
    }
    roomsRef.doc(this.name).set({
      description: this.description.replace(/\r?\n/g, ''),
      text: this.text,
      created_at: store.Timestamp.now(),
      length: 0,
      user_ref: userdata.id,
      username: userdata.data()?.nickname
    })
    db.collection('users').doc(authStore.user.uid).collection('chatrooms').doc(this.name).set({
      description: this.description.replace(/\r?\n/g, ''),
      created_at: store.Timestamp.now()
    })
    this.name = ''
    this.description = ''
    this.text = ''
    form.resetValidation()
    this.disable = false
    localStorage.removeItem('chat/new')
    this.successText = '正常に作成されました'
  }

  clear () {
    this.successText = ''
    this.alertText = ''
    if (!confirm('内容を消去してもよろしいですか')) { return }
    this.name = ''
    this.description = ''
    this.text = ''
    localStorage.removeItem('chat/new')
    const form: any = this.$refs.form
    form.resetValidation()
  }

  mounted () {
    const store = localStorage.getItem('chat/new')
    if (store) {
      const data = JSON.parse(store)
      this.name = data.name
      this.description = data.description
      this.text = data.text
    }
  }

  onInput () {
    this.successText = ''
    this.alertText = ''
    localStorage.setItem('chat/new', JSON.stringify({
      name: this.name,
      description: this.description,
      text: this.text
    }))
  }
}
export default Index
</script>

<style lang="css">
textarea {
  width: 100%;
}
</style>
