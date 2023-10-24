<template>
  <h1>
    모집 일정
  </h1>
  <div class="container">
    <div class="text-box">
      서류 접수
      &nbsp;&nbsp;&nbsp;&nbsp;
      {{ applicationDates.startDate }} ~ {{ applicationDates.endDate }}
      <br><br>

      서류 합격 발표
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {{ applicationDates.firstResultDate }}
      <br><br>

      면접
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {{ applicationDates.interviewStartDate }} ~ {{ applicationDates.interviewEndDate }}
      <br><br>

      최종 결과 발표
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {{ applicationDates.finalResultDate }}
      <br><br>

      오리엔테이션
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {{ applicationDates.orientationDate }}
      <br><br>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      applicationDates: {
        startDate: '',
        endDate: '',
        firstResultDate: '',
        interviewStartDate: '',
        interviewEndDate: '',
        finalResultDate: '',
        orientationDate: ''
      }
    }
  },

  async mounted() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/application/recruit`);

      if (response.status === 200) {
        this.applicationDates = response.data.data;  // API 응답에 따라 적절하게 맞춰주어야 합니다.
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  }
}
</script>

<style lang="scss" scoped>

h1 {
  color: #143673;
}

.container {
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  margin-top: 30px;
  margin-bottom: 100px;
}

.text-box {
  border: 1px solid #e3e3e3; /* 테두리 색상 */
  padding: 20px; /* 내부 패딩 */
  width: 600px; /* 박스의 너비 */
  height: 200px; /* 박스의 높이 */
  display: flex; /* 텍스트를 중앙에 위치시키기 위한 flex 사용 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
  border-radius: 20px;
}

</style>