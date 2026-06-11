<template>
  <div class="w-full">
    <!-- Upload Area -->
    <div v-if="!data && !showCamera"
      class="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-2 transition-all duration-300 hover:border-blue-400 hover:shadow-md">
      <div class="flex flex-col items-center space-y-2">
        <!-- Icon -->

        <!-- Text -->
        <div class="text-center">
          <p class="text-gray-700 font-medium">Upload File atau Ambil Foto</p>
          <p class="text-sm text-gray-500">PNG, JPG, PDF Maks. 2MB</p>
        </div>

        <!-- Buttons -->
        <div >
          <el-button type="primary" size="small" round v-if="!showCameraOnly" @click="openInput" :icon="Paperclip">Pilih File</el-button>
          <el-button type="primary" size="small" plain v-if="!showUploadOnly" round @click="openCamera" :icon="Camera">Ambil Photo</el-button>
        </div>
      </div>

      <input type="file" ref="inputRef" hidden @change="handleFileSelect" capture="user" :accept="accept.join(',')" />
    </div>

    <!-- Camera View -->
    <div v-if="showCamera" class="space-y-2">
      <div class="relative bg-black rounded-xl overflow-hidden">
        <video ref="videoRef" autoplay playsinline class="w-full h-96 object-cover"></video>

        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div class="flex justify-center gap-4">
            <button @click="capturePhoto" type="button"
              class="w-16 h-16 bg-white rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg flex items-center justify-center">
              <div class="w-14 h-14 border-4 border-gray-800 rounded-full"></div>
            </button>
          </div>
        </div>
        <button @click="switchCamera" type="button"
          class="absolute bottom-4 left-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h16c1.11 0 2-.89 2-2V7a2 2 0 0 0-2-2m0 14H4V7h4.05l1.83-2h4.24L16 7h4zM5 12h2.1A4.997 4.997 0 0 1 13 8.1c.76.15 1.43.49 2 .9l-1.44 1.45c-.45-.28-.98-.45-1.56-.45c-1.26 0-2.4.8-2.82 2H11l-3 3zm11.91 2c-.55 2.71-3.19 4.45-5.91 3.9a5.4 5.4 0 0 1-2-.9l1.44-1.45c.46.28.99.45 1.56.45c1.27 0 2.41-.8 2.83-2H13l3-3l3 3z"/></svg>
        </button>
        <button @click="closeCamera" type="button"
          class="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        </button>
      </div>

      <p class="text-center text-sm text-gray-600">Posisikan kamera dan tekan tombol untuk mengambil foto</p>
    </div>

    <!-- Preview File -->
    <div v-if="data && !showCamera" class="bg-white border-2 border-green-200 rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Icon based on file type -->
          <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg v-if="isImage" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              class="text-green-600" viewBox="0 0 16 16">
              <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
              <path
                d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
              class="text-green-600" viewBox="0 0 16 16">
              <path
                d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z" />
              <path
                d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 truncate">
              {{ 'Upload File/Gambar' }}
            </p>
          </div>
        </div>

        <button @click="clearData" type="button"
          class="flex-shrink-0 ml-3 w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors active:scale-95"
          title="Hapus file">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fill-rule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
          </svg>
        </button>
      </div>

      <!-- Image Preview -->
      
      <div v-if="isImage && previewUrl" class="mt-4 rounded-lg overflow-hidden">
        <img :src="previewUrl" alt="Preview" class="w-full h-auto max-h-64 object-contain bg-gray-50" />
      </div>
    </div>
   <div v-if="previewUrlEdit && fileType != 'unknown'" class="rounded-lg overflow-hidden">
     <img v-if="isImagePreviewFormat" :src="baseUrl+previewUrlEdit" alt="Preview" class="w-full h-auto max-h-64 object-contain bg-gray-50" />
     <a v-else :href="baseUrl+previewUrlEdit" class="px-2 py-1 border rounded bg-primary text-white text-xs"> <el-icon><Download /></el-icon> {{ previewUrlEdit.split('/').pop() }}</a>
   </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue';
import { Paperclip, Camera, Download } from '@element-plus/icons-vue';

const baseUrl = import.meta.env.MODE == 'production' ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV

const props = defineProps({
  modelValue: {
    required: true,
  },
  accept: {
    type: Array,
    default() {
      return ['image/*', '.pdf', '.doc', '.docx'];
    },
  },
  showCameraOnly: {
    type: Boolean,
    default: false,
  },
  showUploadOnly: {
    type: Boolean,
    default: false,
  },
  previewUrlEdit: {
    type: String
  }
});

const emit = defineEmits(['update:modelValue', 'upload', 'clear']);

const inputRef = ref(null);
const videoRef = ref(null);
const data = ref(null);
const showCamera = ref(false);
const stream = ref(null);
const previewUrl = ref(null);
const front = ref(true);

const propsModelValue = computed(() => props.modelValue);
const showCameraOnly = computed(() => props.showCameraOnly);
const showUploadOnly = computed(() => props.showUploadOnly);
const previewUrlEdit = computed(() => props.previewUrlEdit);

const isImage = computed(() => {
  if (!data.value) return false;

  // base64
  if (typeof data.value === 'string') {
    return data.value.startsWith('data:image');
  }

  // File
  if (data.value instanceof File) {
    return data.value.type.startsWith('image/');
  }

  return false;
});

const fileType = computed(() => {
  const url = previewUrlEdit.value?.toLowerCase() || '';

  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'image';
  if (/\.pdf$/i.test(url)) return 'pdf';

  return 'unknown';
});

const isImagePreviewFormat = computed(() => fileType.value === 'image');

watch(propsModelValue, (value) => {
  data.value = value;
  updatePreview(value);
});

watch(data, (value) => {
  updatePreview(value);
});

function updatePreview(file) {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  if (!file) return;

  // BASE64
  if (typeof file === 'string' && file.startsWith('data:image')) {
    previewUrl.value = file;
    return;
  }

  // FILE
  if (file instanceof File && file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file);
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result; // sudah dalam format base64 (data:image/...;base64,...)

      data.value = base64;
      emit('update:modelValue', base64);
      emit('upload', base64);
    };

    reader.onerror = (error) => {
      console.error('Error converting file to base64:', error);
    };

    reader.readAsDataURL(file); // ini yang mengubah ke base64
  }

  inputRef.value.value = '';
}

function openInput() {
  inputRef.value.click();
}

async function switchCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  openCamera();
}

async function openCamera() {
  try {
    front.value = !front.value;
    showCamera.value = true;
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: front.value ? "user" : "environment" },
      audio: false,
    });

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;
      videoRef.value.style.transform = front.value ? "scaleX(-1)" : "scaleX(1)"; // NO mirror
    }
    // // console.log(stream.value + 'stream');
  } catch (error) {
    console.error('Error accessing camera:', error);
    alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
    showCamera.value = false;
  }
}

function closeCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  showCamera.value = false;
}

function capturePhoto() {
  const video = videoRef.value;
  const canvas = document.createElement('canvas');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  // convert canvas ke base64
  const base64 = canvas.toDataURL('image/jpeg', 0.9);

  data.value = base64;

  emit('update:modelValue', base64);
  emit('upload', base64);

  closeCamera();
}

function clearData() {
  data.value = null;
  emit('update:modelValue', null);
  emit('clear', null);

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

onUnmounted(() => {
  closeCamera();
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
