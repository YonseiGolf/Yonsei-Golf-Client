<template>
  <div class="modal">
    <div class="modal-content">
      <h3>면접 시간 변경</h3>
      <input type="datetime-local" v-model="newTime" />
      <button @click="saveTime">면접 시간 변경</button>
      <button @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, { emit }) {
    const newTime = ref('');

    const saveTime = () => {
      emit('save', newTime.value);
    };

    console.log(newTime.value)

    return {
      newTime,
      saveTime
    };
  }
};
</script>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  width: 300px;
  padding: 20px;
  background: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
