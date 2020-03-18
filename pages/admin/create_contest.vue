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
              <b>コンテストの新規作成</b>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="contest.id"
              outlined
              label="コンテストID *"
              required
              @change="onInput"
            />
            <v-text-field
              v-model="contest.name"
              outlined
              label="コンテスト名 *"
              required
              @change="onInput"
            />
            <v-textarea
              v-model="contest.shortDescription"
              label="短い説明 *"
              outlined
              auto-grow
              rows="4"
              required
              @change="onInput"
            />
            <v-textarea
              v-model="contest.description"
              label="概要 *"
              outlined
              auto-grow
              rows="20"
              required
              hint="Markdownの文法が使えます"
              @change="onInput"
            />
            <v-dialog v-model="dialog1" max-width="1000px" scrollable>
              <template v-slot:activator="{ on }">
                <div class="text-center">
                  <v-btn color="info" dark outlined v-on="on">
                    <v-icon>
                      mdi-view-quilt
                    </v-icon>
                    open Preview (概要)
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Preview</span>
                </v-card-title>
                <v-card-text>
                  <div class="md" v-html="$md.render(contest.description)" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="green darken-1" text @click="dialog1 = false">
                    閉じる
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-textarea
              v-model="contest.dataText"
              label="データの説明 *"
              auto-grow
              outlined
              class="mt-6"
              rows="20"
              required
              hint="Markdownの文法が使えます"
              @change="onInput"
            />
            <v-dialog v-model="dialog2" max-width="1000px" scrollable>
              <template v-slot:activator="{ on }">
                <div class="text-center">
                  <v-btn color="info" dark outlined v-on="on">
                    <v-icon>
                      mdi-view-quilt
                    </v-icon>
                    open Preview (データ)
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Preview</span>
                </v-card-title>
                <v-card-text>
                  <div class="md" v-html="$md.render(contest.dataText)" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="green darken-1" text @click="dialog2 = false">
                    閉じる
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-textarea
              v-model="contest.submitText"
              label="提出形式の説明 *"
              auto-grow
              outlined
              class="mt-6"
              rows="20"
              required
              hint="Markdownの文法が使えます"
              @change="onInput"
            />
            <v-dialog v-model="dialog3" max-width="1000px" scrollable>
              <template v-slot:activator="{ on }">
                <div class="text-center">
                  <v-btn color="info" dark outlined v-on="on">
                    <v-icon>
                      mdi-view-quilt
                    </v-icon>
                    open Preview (提出形式)
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Preview</span>
                </v-card-title>
                <v-card-text>
                  <div class="md" v-html="$md.render(contest.submitText)" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="green darken-1" text @click="dialog3 = false">
                    閉じる
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-text-field
              v-model="contest.apiURL"
              outlined
              class="mt-6"
              label="評価API用URL *"
              hint="ヘッダにコンテストID，ボディに予測結果を含めているJSONをPOSTで受け取って精度指標を返すAPIを構築してください"
              required
              @change="onInput"
            />
            <v-radio-group v-model="contest.sort" row>
              <v-radio label="昇順" value="asc" />
              <v-radio label="降順" value="desc" />
            </v-radio-group>
            <v-text-field
              v-model="contest.allowExtension"
              outlined
              label="許可する拡張子 *"
              required
              @change="onInput"
            />
            <v-text-field
              v-model="contest.maxFileSize"
              type="Number"
              outlined
              label="最大ファイルサイズ(Byte) *"
              required
              @change="onInput"
            />
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
import { Competition } from '@/pages/competitions/index.vue'

@Component({
  layout: 'admin',
  transition (to, from) {
    if (!from) { return 'left' }
    return +to.query.page < +from.query.page ? 'right' : 'left'
  }
})
class Index extends Vue {
  valid: boolean = false
  contest: Competition = {
    id: '',
    name: '',
    description: '',
    shortDescription: '',
    dataText: '',
    submitText: '',
    apiURL: '',
    sort: 'desc',
    maxFileSize: 0,
    allowExtension: '',
    created_at: ''
  }

  dialog1 = false
  dialog2 = false
  dialog3 = false

  mounted () {
    const data = localStorage.getItem('admin/newContest')
    if (data) {
      this.contest = JSON.parse(data)
    }
  }

  async submit () {
    const form: any = this.$refs.form
    if (!form.validate()) {
      alert('不正フォーム')
      return
    }
    const snap = await db.collection('competitions').doc(this.contest.id).get()
    if (snap.exists) {
      alert('重複ID')
    } else {
      await db.collection('competitions').doc(this.contest.id).set({
        ...this.contest,
        created_at: store.Timestamp.now()
      })
      alert('作成完了')
      localStorage.removeItem('admin/newContest')
      this.contest = {
        id: '',
        name: '',
        description: '',
        shortDescription: '',
        submitText: '',
        dataText: '',
        apiURL: '',
        sort: 'desc',
        maxFileSize: 0,
        allowExtension: '',
        created_at: ''
      }
    }
  }

  onInput () {
    localStorage.setItem('admin/newContest', JSON.stringify(this.contest))
  }
}
export default Index
</script>
