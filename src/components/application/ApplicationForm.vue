<template>
  <h1>연세 골프 지원서</h1>
  <div class="before-apply">* 지원서는 임시저장되지 않습니다.</div>
  <div class="before-apply">*지원서 작성 시 이모지 사용을 자제해주세요. 이모지 사용으로 인한 불이익은 지원자에게 있습니다.</div>
  <table class="profile-info">
    <tbody>
    <tr>
      <td rowspan="2">
        사진
      </td>
      <!--          <input v-if="!applications.photo" type="file" @change="handleFileUpload"/>-->
      <!--          <button class="photo-button" v-if="!applications.photo" @click="uploadImage">사진 업로드</button>-->
      <!--        </div>-->
      <!--        <img class="apply-photo" v-if="applications.photo" :src="applications.photo"/>-->
      <!--      </td>-->
      <td rowspan="2">
        <div class="file-upload-container">
          <!-- 파일 선택 시 uploadImage 메서드를 호출하도록 변경 -->
          <input v-if="!applications.photo" type="file" @change="handleFileUpload"/>
        </div>
        <img class="apply-photo" v-if="applications.photo" :src="applications.photo"/>
      </td>

      <td>
        이름
      </td>
      <td>
        <textarea placeholder="김연골" v-model="applications.name" @input="handleNameInput"></textarea>
      </td>
    </tr>

    <tr>
      <td>나이</td>
      <td>
        <textarea placeholder="숫자만 입력해주세요" v-model="applications.age" @input="handleAgeInput"></textarea>
      </td>
    </tr>

    <tr>
      <td>
        학번
      </td>
      <td>
        <textarea placeholder="숫자만 입력해주세요" v-model="applications.studentId" @input="handleStudentIdInput"></textarea>
      </td>
      <td>
        전공
      </td>
      <td>
        <textarea placeholder="OO학과" v-model="applications.major" @input="handleMajorInput"></textarea>
      </td>
    </tr>

    <tr>
      <td>
        전화번호
      </td>
      <td>
        <textarea placeholder="숫자만 입력해주세요" v-model="applications.phoneNumber"
                  @input="handlePhoneNumberInput"></textarea>
      </td>

      <td>
        이메일
      </td>
      <td>
        <textarea placeholder="yonseigolf@email.com" v-model="applications.email" @input="handleEmailInput"></textarea>
      </td>
    </tr>

    <tr>
      <td>
        구력
      </td>
      <td>
        <select v-model="applications.golfDuration">
          <option value="0">1년 미만</option>
          <option value="1">1년</option>
          <option value="2">2년</option>
          <option value="3">3년</option>
          <option value="4">4년</option>
          <option value="5">5년 이상</option>
        </select>
      </td>

      <td>
        라운딩 횟수
      </td>
      <td>
        <select v-model="applications.roundCount">
          <option value="0">0회</option>
          <option value="1">1회</option>
          <option value="2">2회</option>
          <option value="3">3회</option>
          <option value="4">4회</option>
          <option value="5">5회 이상</option>
        </select>
      </td>
    </tr>

    <tr>
      <td>
        레슨 여부
      </td>
      <td>
        <select v-model="applications.lessonStatus">
          <option value="true">레슨 x</option>
          <option value="false">레슨 o</option>
        </select>
      </td>
      <td>
        본인 클럽 소유 여부
      </td>
      <td>
        <select v-model="applications.clubStatus">
          <option value="true">보유중</option>
          <option value="false">보유하지 않음</option>
        </select>
      </td>
    </tr>
    </tbody>
  </table>

  <table class="application-body">
    <thead>
    <tr>
      <th>
        1. 간략하게 자기소개 부탁드립니다. (군대 계획이나 교환학생 계획이 있다면 적어주세요)
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="최대 500자까지 작성 가능합니다." v-model="applications.selfIntroduction" rows="30"
                  @input="handleSelfIntroductionInput"></textarea>
        <div class="error-message" v-if="selfInfoInvalid"> 최대 500자까지 작성 가능합니다.</div>
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        2. 연세 골프에 지원하게 된 동기를 작성해주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="최대 500자까지 작성 가능합니다." v-model="applications.applyReason" rows="30"
                  @input="handleApplyReasonInput"></textarea>
        <div class="error-message" v-if="applyReasonInvalid"> 최대 500자까지 작성 가능합니다.</div>
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        3. 현재 본인의 골프 실력을 객관적으로 평가해주세요.
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="최대 500자까지 작성 가능합니다." v-model="applications.skillEvaluation" rows="30"
                  @input="handleSkillEvaluationInput"></textarea>
        <div class="error-message" v-if="golfSkillInvalid"> 최대 500자까지 작성 가능합니다.</div>
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        4. 골프와 관련된 추억이 있으시다면 말씀해주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="최대 500자까지 작성 가능합니다." v-model="applications.golfMemory" rows="30"
                  @input="handleGolfMemoryInput"></textarea>
        <div class="error-message" v-if="golfMemoryInvalid"> 최대 500자까지 작성 가능합니다.</div>
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        5. 현재 활동하는 다른 동아리나 학회가 있다면 적어주세요
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="최대 500자까지 작성 가능합니다." v-model="applications.otherClub" rows="30"
                  @input="handleOtherClubInput"></textarea>
        <div class="error-message" v-if="otherClubInvalid"> 최대 500자까지 작성 가능합니다.</div>
      </td>
    </tr>
    </tbody>

    <thead>
    <tr>
      <th>
        6. 본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)
      </th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>
        <textarea placeholder="유튜브 링크를 첨부해주세요. (비공개 영상이 아닌지 확인해주세요)" v-model="applications.swingVideo" rows="30"
                  @input="handleSwingVideoInput"></textarea>
        <p class="error-message" v-if="golfSwingInvalid"> 최대 500자까지 작성 가능합니다.</p>
      </td>
    </tr>
    </tbody>
  </table>
  <div>* 지원서 제출 전 이메일과 전화번호를 다시 한번 확인해주세요.</div>
  <div>* 결과는 이메일로 전송해드립니다.</div>
  <button class="apply-button" @click="submitApplication" type="submit">지원서 제출</button>
</template>

<script>
import axios from "axios";

export default {

  data() {
    return {
      applications: {
        name: '',
        photo: '',
        age: '',
        studentId: '',
        major: '',
        phoneNumber: '',
        email: '',
        golfDuration: 0,
        roundCount: 0,
        lessonStatus: false,
        clubStatus: false,
        selfIntroduction: '',
        applyReason: '',
        skillEvaluation: '',
        golfMemory: '',
        otherClub: '',
        swingVideo: '',
        selectedFile: null,
      },
      selfInfoInvalid: false,
      applyReasonInvalid: false,
      golfSkillInvalid: false,
      golfMemoryInvalid: false,
      otherClubInvalid: false,
      golfSwingInvalid: false
    }
  },

  methods: {
    async submitApplication() {
      if (this.isFormValid) {
        if (confirm(`지원서를 제출하시겠습니까? \n이메일로 결과가 발송되니 이메일을 다시 한번 확인해주세요 \n ${this.applications.email}`)) {
          try {
            const response =
                await axios.post(`${process.env.VUE_APP_API_URL}/application`, {
                  name: this.applications.name,
                  age: this.applications.age,
                  photo: this.applications.photo,
                  studentId: this.applications.studentId,
                  major: this.applications.major,
                  phoneNumber: this.applications.phoneNumber,
                  email: this.applications.email,
                  golfDuration: this.applications.golfDuration,
                  roundCount: this.applications.roundCount,
                  lessonStatus: this.applications.lessonStatus,
                  clubStatus: this.applications.clubStatus,
                  selfIntroduction: this.applications.selfIntroduction,
                  applyReason: this.applications.applyReason,
                  skillEvaluation: this.applications.skillEvaluation,
                  golfMemory: this.applications.golfMemory,
                  otherClub: this.applications.otherClub,
                  swingVideo: this.applications.swingVideo,
                });

            // 응답 처리
            if (response.status === 200) {
              alert(`${this.applications.email}로 지원서 접수 메일을 전송해드릴 예정입니다. 10분 내로 접수 메일을 받지 못했다면 인스타로 문의 부탁드립니다.`);
              this.$router.push('/');
            }
          } catch (error) {
            alert('지원서는 접수되었으나, 이메일 발송에 실패하였습니다. \n인스타를 통해 지원 문의 바랍니다.')
            this.$router.push('/');
          }
        }
      } else {
        alert('지원서 모든 항목을 작성해주세요.')
      }
    },

    uploadImage() {
      const formData = new FormData();
      formData.append('image', this.applications.selectedFile);

      axios.post(`${process.env.VUE_APP_API_URL}/apply/forms/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(response => {
            this.applications.photo = response.data.data.image; // 응답으로 받은 이미지 URL 저장
          })
          .catch(error => {
            console.error("Image upload failed:", error);
          });
    },

    handleFileUpload(event) {
      this.applications.selectedFile = event.target.files[0];
      if (this.applications.selectedFile) {
        this.uploadImage(); // 파일 선택 후 uploadImage 메서드 호출
      }
    },


    handleNameInput() {
      if (this.applications.name.length > 10) {
        this.applications.name = this.applications.name.substring(0, 10);
      }
    },

    handleAgeInput() {
      // 숫자만 입력되도록 필터링
      this.applications.age = this.applications.age.replace(/[^0-9]/g, '');

      // 2글자를 초과하면 잘라내기
      if (this.applications.age.length > 2) {
        this.applications.age = this.applications.age.substring(0, 2);
      }
    },

    handleStudentIdInput() {
      this.applications.studentId = this.applications.studentId.replace(/[^0-9]/g, '');

      if (this.applications.studentId.length > 11) {
        this.applications.studentId = this.applications.studentId.substring(0, 11);
      }
    },

    handleMajorInput() {
      if (this.applications.major.length > 10) {
        this.applications.major = this.applications.major.substring(0, 10);
      }
    },

    handlePhoneNumberInput() {
      this.applications.phoneNumber = this.applications.phoneNumber.replace(/[^0-9]/g, '');

      if (this.applications.phoneNumber.length > 11) {
        this.applications.phoneNumber = this.applications.phoneNumber.substring(0, 11);
      }
    },

    handleEmailInput() {
      if (this.applications.email.length > 30) {
        this.applications.email = this.applications.email.substring(0, 30);
      }
    },

    handleSelfIntroductionInput() {
      if (this.applications.selfIntroduction.length > 500) {
        this.applications.selfIntroduction = this.applications.selfIntroduction.substring(0, 500);
      }
      this.selfInfoInvalid = this.applications.selfIntroduction.length >= 500;
    },

    handleApplyReasonInput() {
      if (this.applications.applyReason.length > 500) {
        this.applications.applyReason = this.applications.applyReason.substring(0, 500);
      }
      this.applyReasonInvalid = this.applications.applyReason.length >= 500;
    },

    handleSkillEvaluationInput() {
      if (this.applications.skillEvaluation.length > 500) {
        this.applications.skillEvaluation = this.applications.skillEvaluation.substring(0, 500);
      }
      this.golfSkillInvalid = this.applications.skillEvaluation.length >= 500;
    },

    handleGolfMemoryInput() {
      if (this.applications.golfMemory.length > 500) {
        this.applications.golfMemory = this.applications.golfMemory.substring(0, 500);
      }
      this.golfMemoryInvalid = this.applications.golfMemory.length >= 500;
    },

    handleOtherClubInput() {
      if (this.applications.otherClub.length > 500) {
        this.applications.otherClub = this.applications.otherClub.substring(0, 500);
      }
      this.otherClubInvalid = this.applications.otherClub.length >= 500;
    },

    handleSwingVideoInput() {
      if (this.applications.swingVideo.length > 500) {
        this.applications.swingVideo = this.applications.swingVideo.substring(0, 500);
      }
      this.golfSwingInvalid = this.applications.swingVideo.length >= 500;
    },
  },

  computed: {
    applicationNameInput: {
      get() {
        return this.applications.name;
      },
      set(val) {
        this.applications.name = val;
      }
    },

    applicationAgeInput: {
      get() {
        return this.applications.age;
      },
      set(val) {
        this.applications.age = val;
      }
    },

    applicationStudentIdInput: {
      get() {
        return this.applications.studentId;
      },
      set(val) {
        this.applications.studentId = val;
      }
    },

    applicationMajorInput: {
      get() {
        return this.applications.major;
      },
      set(val) {
        this.applications.major = val;
      }
    },

    applicationPhoneNumberInput: {
      get() {
        return this.applications.phoneNumber;
      },
      set(val) {
        this.applications.phoneNumber = val;
      }
    },

    applicationEmailInput: {
      get() {
        return this.applications.email;
      },
      set(val) {
        this.applications.email = val;
      }
    },

    applicationSelfIntroductionInput: {
      get() {
        return this.applications.selfIntroduction;
      },
      set(val) {
        this.applications.selfIntroduction = val;
      }
    },

    applicationApplyReasonInput: {
      get() {
        return this.applications.applyReason;
      },
      set(val) {
        this.applications.applyReason = val;
      }
    },

    applicationSkillEvaluation: {
      get() {
        return this.applications.skillEvaluation;
      },
      set(val) {
        this.applications.skillEvaluation = val;
      }
    },

    applicationGolfMemory: {
      get() {
        return this.applications.golfMemory;
      },
      set(val) {
        this.applications.golfMemory = val;
      }
    },

    applicationOtherClub: {
      get() {
        return this.applications.otherClub;
      },
      set(val) {
        this.applications.otherClub = val;
      }
    },

    applicationSwingVideo: {
      get() {
        return this.applications.swingVideo;
      },
      set(val) {
        this.applications.swingVideo = val;
      }
    },

    isFormValid() {
      return this.applications.name.trim().length > 0 &&
          this.applications.photo.trim().length > 0 &&
          this.applications.age.trim().length > 0 &&
          this.applications.studentId.trim().length > 0 &&
          this.applications.major.trim().length > 0 &&
          this.applications.phoneNumber.trim().length > 0 &&
          this.applications.email.trim().length > 0 &&
          this.applications.golfDuration >= 0 &&
          this.applications.roundCount >= 0 &&
          (typeof this.applications.lessonStatus === 'boolean') &&
          (typeof this.applications.clubStatus === 'boolean') &&
          this.applications.selfIntroduction.trim().length > 0 &&
          this.applications.applyReason.trim().length > 0 &&
          this.applications.skillEvaluation.trim().length > 0 &&
          this.applications.golfMemory.trim().length > 0 &&
          this.applications.otherClub.trim().length > 0 &&
          this.applications.swingVideo.trim().length > 0;
    }


  },

}
</script>


<style lang="scss" scoped>

.file-upload-container {
  display: flex;
  flex-direction: column;
}

img {
  max-width: 100px;
}

.profile-info {
  margin-top: 30px;
}

.profile-info, .application-body, .application-footer {
  width: 50%;
  border-collapse: collapse;
}

table {
  margin: 0 auto;
  font-size: 12px;
  max-width: 70%;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 10px;
  padding-top: 20px;
  text-align: center;
}

table th {
  background-color: gray;
  color: #fff;
}

.application-footer {
  margin-bottom: 30px;
}

@media (max-width: 1300px) {
  .profile-info, .application-body, .application-footer {
    max-width: 90%;
    width: 90%;
  }
}

textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  margin-top: 10px;
}

.apply-button {
  color: white;
  font-weight: bold;
  margin: 0 auto;
  width: 10%;
  height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #143673;
  background-color: #143673;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1a5cc8;
  border-color: #1a5cc8;
}

.before-apply {
  font-size: 12px;
}

.apply-photo {
  min-width: 100px;
  min-height: 100px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.photo-button {
  margin: 0 auto;
  margin-top: 5px;
  width: 30%;
}


</style>