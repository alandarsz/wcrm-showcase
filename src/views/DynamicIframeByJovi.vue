<template>
  <div>
    <iframe
      ref="myIframe"
      :src="urlIframe"
      class="iframe"
      @load="resizeIframe"
      :scrolling="scrolling"
      :allowTransparency="true"
      title="Dynamic Frame"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {useStore  } from 'vuex'
import { mobileWahanaIframeHost } from '../helper/mobileWahanaIframeConfig'

// refs
const title = ref(null)
const hostIframe = mobileWahanaIframeHost
const typeIframe = ref(null)
const urlIframe = ref(null)
const scrolling = ref('yes')
const myIframe = ref(null)

// router
const router = useRouter()
const route = useRoute()

// store
const store = useStore()

const tag = computed(() => store.getters.tag || localStorage.getItem('tag'))

// console.log(tag.value);


const messageHandler = (event) => {
  if (event.origin !== hostIframe) return

  if (event.data.type === 'iframeHeight') {
    const iframe = myIframe.value
    iframe.style.height = event.data.height + 'px'
    scrolling.value = 'no'
  }
}

const resizeIframe = () => {
  const iframe = myIframe.value

  try {
    const height = iframe.contentWindow.document.body.scrollHeight
    iframe.style.height = height + 'px'
    // console.log(height)
  } catch (e) {
    console.warn('Tidak bisa akses iframe beda origin.', e)

    iframe.contentWindow.postMessage(
      { type: 'getHeight' },
      hostIframe
    )

    window.addEventListener('message', messageHandler)
  }
}

// lifecycle
onMounted(() => {
  typeIframe.value = route.query.type
  title.value = route.query.title
  document.title = 'Wahana CRM ' + title.value

  urlIframe.value =
    hostIframe +
    '/apps/wahana/cgi-bin/dw.cgi?b=setsessredirmenu&u=' +
    tag.value +
    '&at=' +
    typeIframe.value
    // console.log(urlIframe.value);
    
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<style scoped>
.page {
  width: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e0e0e0;
  padding: 10px 16px;
}

.home-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.iframe {
  width: 100%;
  height: 86vh;
  border: none;
  overflow: hidden;
}
</style>