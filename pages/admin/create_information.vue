<template>
  <transition>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pt-1 pb-3">
            <div class="title">
              <v-btn text style="cursor: pointer" @click="$router.push('/admin')">
                <v-icon>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <b>お知らせの新規作成</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-form
            ref="form"
          >
            <v-text-field
              v-model="info.name"
              outlined
              label="題名 *"
              required
              @change="onInput"
            />
            <v-textarea
              v-model="info.description"
              label="短い説明 *"
              outlined
              auto-grow
              rows="4"
              required
              @change="onInput"
            />
            <v-textarea
              v-model="info.text"
              label="概要 *"
              outlined
              auto-grow
              rows="20"
              required
              hint="Markdownの文法が使えます"
              @change="onInput"
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
                  <div class="md" v-html="$md.render(info.text)" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="green darken-1" text @click="dialog = false">
                    閉じる
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <div class="text-center">
              <v-checkbox v-model="send" label="お知らせ通知を行う" />
            </div>
            <v-btn
              color="info"
              class="mb-12"
              block
              @click="submit"
            >
              作成
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </transition>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { db, store } from '@/plugins/firebase'

@Component({
  layout: 'admin',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  info = {
    name: '',
    description: '',
    text: ''
  }

  dialog = false
  send = false

  mounted () {
    const data = localStorage.getItem('admin/newInfo')
    if (data) {
      this.info = JSON.parse(data)
    }
  }

  async submit () {
    const ref = await db.collection('informations').add({
      ...this.info,
      created_at: store.Timestamp.now()
    })
    alert('作成完了')
    // localStorage.removeItem('admin/newInfo')
    const userSnaps = await db.collection('users').get()
    const processes: any[] = []
    if (!this.send) {
      this.info = {
        name: '',
        description: '',
        text: ''
      }
      return
    }
    userSnaps.forEach((snap) => {
      processes.push(
        snap.ref.collection('notifications').doc(ref.id).set({
          type: 'info/new',
          created_at: store.Timestamp.now(),
          checked: false,
          name: this.info.name
        })
      )
    })
    await Promise.all(processes)
    this.info = {
      name: '',
      description: '',
      text: ''
    }
    alert('送信完了')
  }

  onInput () {
    localStorage.setItem('admin/newInfo', JSON.stringify(this.info))
  }
}
export default Index
</script>
