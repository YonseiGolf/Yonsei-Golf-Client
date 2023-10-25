<template>
  <h1>
    자주 묻는 질문
  </h1>

  <div id="tab-container">
    <button
        @click="activeTab='qualifications'"
        :class="{'active': isActive('qualifications')}">
      지원자격
    </button>

    <button
        @click="activeTab='interview'"
        :class="{'active': isActive('interview')}">
      면접
    </button>

    <button
        @click="activeTab='activity'"
        :class="{'active': isActive('activity')}">
      활동
    </button>
  </div>

  <div class="qualifications" v-show="activeTab === 'qualifications'">
    <QualificationsTab></QualificationsTab>
  </div>

  <div class="interview" v-show="activeTab === 'interview'">
    <InterviewTab></InterviewTab>
  </div>

  <div class="activity" v-show="activeTab === 'activity'">
    <ActivityTab></ActivityTab>
  </div>
  <div class="white-container"></div>


</template>

<script>
import ActivityTab from "@/components/qna/tab/ActivityTab.vue";
import InterviewTab from "@/components/qna/tab/InterviewTab.vue";
import QualificationsTab from "@/components/qna/tab/QualificationsTab.vue";

export default {
  components: {
    QualificationsTab,
    InterviewTab,
    ActivityTab
  },
  data() {
    return {
      activeTab: 'qualifications'
    }
  },
  computed: {
    isActive() {
      return (tab) => {
        return this.activeTab === tab;
      };
    }
  }
}
</script>

<style lang="scss" scoped>

#tab-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 540px;
  height: 60px;
  margin: 10px auto;
  margin-bottom: 50px;

  border-radius: 40px;
  border: 1px solid #143790;

  background-color: white;

  overflow: hidden; // 추가: button의 스타일이 이 컨테이너를 벗어나지 않도록 합니다.

}

button {

  position: relative; /* position을 relative나 absolute로 설정 */
  z-index: 1; /* z-index 값을 낮게 설정 */

  flex: 1;
  border: none;
  border-radius: 25px;
  margin: 0;
  padding: 0 30px;
  height: 100%;
  line-height: 60px;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: white;

  &:hover {
    background-color: #ddd;
  }

  &.active {
    background-color: #143790;
    color: white;
  }
}

.white-container{
  height: 100px;
}

</style>