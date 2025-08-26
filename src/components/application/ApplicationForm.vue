<template>
  <div class="section-spacer"></div>
  <div class="form-header">
    <h1>연세 골프 지원서</h1>
    <div class="notice-text">* 지원서는 임시저장되지 않습니다.</div>
    <div class="notice-text">*지원서 작성 시 이모지 사용을 자제해주세요. 이모지 사용으로 인한 불이익은 지원자에게 있습니다.</div>
  </div>

  <div class="default_info">
    <div class="section-title">지원자 정보</div>

    <div class="photo-upload-section">
      <div class="photo-container">
        <div class="file-upload-container">
          <input v-if="!applications.photo" type="file" @change="handleFileUpload" accept="image/*"/>
          <div v-if="!applications.photo" class="upload-placeholder">
            <div class="upload-icon">👤</div>
            <div class="upload-text">지원자 사진</div>
            <div class="upload-hint">클릭하여 업로드</div>
          </div>
        </div>
        <div v-if="applications.photo" class="photo-display">
          <img class="apply-photo" :src="applications.photo" alt="지원자 사진"/>
          <button type="button" class="photo-delete-btn" @click="deletePhoto">×</button>
        </div>
      </div>
    </div>

    <div class="info-field">
      <input type="text" placeholder="이름을 입력해주세요" v-model="applications.name" @input="handleNameInput">
    </div>
    <div class="info-field">
      <div class="email-container">
        <input type="email" placeholder="이메일을 입력해주세요" v-model="applications.email" @input="handleEmailInput">
        <button type="button" class="email-confirm-btn">이메일 확인</button>
      </div>
    </div>
    <div class="info-field">
      <input type="tel" placeholder="전화번호를 입력해주세요" v-model="applications.phoneNumber" @input="handlePhoneNumberInput">
    </div>

    <div class="info-field">
      <input type="text" placeholder="학번을 입력해주세요" v-model="applications.studentId" @input="handleStudentIdInput">
    </div>

    <div class="info-field">
      <input type="text" placeholder="전공을 입력해주세요" v-model="applications.major" @input="handleMajorInput">
    </div>

    <div class="info-field">
      <label>생년월일</label>
      <input type="date" v-model="applications.birthDate">
    </div>

    <div class="section-spacer"></div>

     <div class="info-field">
       <label>간략하게 자기소개 부탁드립니다. (군대 계획이나 교환학생 계획이 있다면 적어주세요)</label>
       <textarea ref="selfIntroTextarea" placeholder="최대 500자까지 작성 가능합니다." v-model="applications.selfIntroduction" rows="6" @input="handleSelfIntroductionInput"></textarea>
       <div class="error-message" v-if="selfInfoInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="info-field">
       <label>연세 골프에 지원하게 된 동기를 작성해주세요</label>
       <textarea ref="applyReasonTextarea" placeholder="최대 500자까지 작성 가능합니다." v-model="applications.applyReason" rows="6" @input="handleApplyReasonInput"></textarea>
       <div class="error-message" v-if="applyReasonInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="info-field">
       <label>현재 본인의 골프 실력을 객관적으로 평가해주세요.</label>
       <textarea ref="skillEvaluationTextarea" placeholder="최대 500자까지 작성 가능합니다." v-model="applications.skillEvaluation" rows="6" @input="handleSkillEvaluationInput"></textarea>
       <div class="error-message" v-if="golfSkillInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="info-field">
       <label>골프와 관련된 추억이 있으시다면 말씀해주세요</label>
       <textarea ref="golfMemoryTextarea" placeholder="최대 500자까지 작성 가능합니다." v-model="applications.golfMemory" rows="6" @input="handleGolfMemoryInput"></textarea>
       <div class="error-message" v-if="golfMemoryInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="info-field">
       <label>현재 활동하는 다른 동아리나 학회가 있다면 적어주세요</label>
       <textarea ref="otherClubTextarea" placeholder="최대 500자까지 작성 가능합니다." v-model="applications.otherClub" rows="6" @input="handleOtherClubInput"></textarea>
       <div class="error-message" v-if="otherClubInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="info-field">
       <label>본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)</label>
       <textarea ref="swingVideoTextarea" placeholder="유튜브 링크를 첨부해주세요. (비공개 영상이 아닌지 확인해주세요)" v-model="applications.swingVideo" rows="6" @input="handleSwingVideoInput"></textarea>
       <div class="error-message" v-if="golfSwingInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>
  </div>
  <div class="form-footer">
    <div class="notice-text">* 지원서 제출 전 이메일과 전화번호를 다시 한번 확인해주세요.</div>
    <div class="notice-text">* 결과는 이메일로 전송해드립니다.</div>
  </div>
  <button class="apply-button" @click="submitApplication" type="submit">지원서 제출</button>

  <div v-if="isLoading" class="loading-container">
    <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif" alt="Loading">
  </div>

</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {

  data() {
    return {
      applications: {
        name: '',
        photo: '',
        age: '',
        studentId: '',
        birthDate: '',
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
      golfSwingInvalid: false,
      isLoading: false,
    }
  },

  methods: {
    async submitApplication() {

      if (this.isFormValid) {
        Swal.fire({
          title: "지원서를 제출하시겠습니까?",
          text: `이메일로 결과가 발송되니 이메일을 다시 한번 확인해주세요 \n${this.applications.email}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: '#0a3d91',
          cancelButtonColor: "#d33",
          confirmButtonText: "제출"
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              this.isLoading = true;
              const response =
                  await axios.post(`${process.env.VUE_APP_API_URL}/application`, {
                    name: this.applications.name,
                    age: this.applications.age,
                    photo: this.applications.photo,
                    studentId: this.applications.studentId,
                    birthDate: this.applications.birthDate,
                    major: this.applications.major,
                    phoneNumber: this.applications.phoneNumber.replace(/[^0-9]/g, ''),
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
                    semester: 1
                  });

              // 응답 처리
              if (response.status === 200) {
                await Swal.fire({
                  title: `${this.applications.email}로 지원서 접수 메일을 전송해드릴 예정입니다. 10분 내로 접수 메일을 받지 못했다면 인스타로 문의 부탁드립니다.`,
                  confirmButtonColor: '#08366f',
                });

                this.isLoading = false;
                this.$router.push('/');
              }
            } catch (error) {
              await Swal.fire({
                title: `${this.applications.email}로 지원서 접수 메일을 전송해드릴 예정입니다. 10분 내로 접수 메일을 받지 못했다면 인스타로 문의 부탁드립니다.`,
                confirmButtonColor: '#08366f',
              });
              this.isLoading = false;
              this.$router.push('/');
            }
          }
        });

      } else {
        await Swal.fire({
          title: '지원서 모든 항목을 작성해주세요.',
          confirmButtonColor: '#08366f',
        });
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

    deletePhoto() {
      this.applications.photo = '';
      this.applications.selectedFile = null;
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
      // 숫자만 추출
      const numbers = this.applications.phoneNumber.replace(/[^0-9]/g, '');

      // 11자리로 제한
      const limitedNumbers = numbers.substring(0, 11);

      // 하이픈 추가
      let formattedNumber = '';
      if (limitedNumbers.length <= 3) {
        formattedNumber = limitedNumbers;
      } else if (limitedNumbers.length <= 7) {
        formattedNumber = limitedNumbers.substring(0, 3) + '-' + limitedNumbers.substring(3);
      } else {
        formattedNumber = limitedNumbers.substring(0, 3) + '-' + limitedNumbers.substring(3, 7) + '-' + limitedNumbers.substring(7);
      }

      this.applications.phoneNumber = formattedNumber;
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

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.selfIntroTextarea) {
          const textarea = this.$refs.selfIntroTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },

    handleApplyReasonInput() {
      if (this.applications.applyReason.length > 500) {
        this.applications.applyReason = this.applications.applyReason.substring(0, 500);
      }
      this.applyReasonInvalid = this.applications.applyReason.length >= 500;

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.applyReasonTextarea) {
          const textarea = this.$refs.applyReasonTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },

    handleSkillEvaluationInput() {
      if (this.applications.skillEvaluation.length > 500) {
        this.applications.skillEvaluation = this.applications.skillEvaluation.substring(0, 500);
      }
      this.golfSkillInvalid = this.applications.skillEvaluation.length >= 500;

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.skillEvaluationTextarea) {
          const textarea = this.$refs.skillEvaluationTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },

    handleGolfMemoryInput() {
      if (this.applications.golfMemory.length > 500) {
        this.applications.golfMemory = this.applications.golfMemory.substring(0, 500);
      }
      this.golfMemoryInvalid = this.applications.golfMemory.length >= 500;

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.golfMemoryTextarea) {
          const textarea = this.$refs.golfMemoryTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },

    handleOtherClubInput() {
      if (this.applications.otherClub.length > 500) {
        this.applications.otherClub = this.applications.otherClub.substring(0, 500);
      }
      this.otherClubInvalid = this.applications.otherClub.length >= 500;

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.otherClubTextarea) {
          const textarea = this.$refs.otherClubTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },

    handleSwingVideoInput() {
      if (this.applications.swingVideo.length > 500) {
        this.applications.swingVideo = this.applications.swingVideo.substring(0, 500);
      }
      this.golfSwingInvalid = this.applications.swingVideo.length >= 500;

      // textarea 높이 자동 조절
      this.$nextTick(() => {
        if (this.$refs.swingVideoTextarea) {
          const textarea = this.$refs.swingVideoTextarea;
          textarea.style.height = 'auto';
          textarea.style.height = textarea.scrollHeight + 'px';
        }
      });
    },
  }
  ,

  computed: {
    applicationNameInput: {
      get() {
        return this.applications.name;
      }
      ,
      set(val) {
        this.applications.name = val;
      }
    }
    ,

    applicationAgeInput: {
      get() {
        return this.applications.age;
      }
      ,
      set(val) {
        this.applications.age = val;
      }
    }
    ,

    applicationStudentIdInput: {
      get() {
        return this.applications.studentId;
      }
      ,
      set(val) {
        this.applications.studentId = val;
      }
    }
    ,

    applicationMajorInput: {
      get() {
        return this.applications.major;
      }
      ,
      set(val) {
        this.applications.major = val;
      }
    }
    ,

    applicationPhoneNumberInput: {
      get() {
        return this.applications.phoneNumber;
      }
      ,
      set(val) {
        this.applications.phoneNumber = val;
      }
    }
    ,

    applicationEmailInput: {
      get() {
        return this.applications.email;
      }
      ,
      set(val) {
        this.applications.email = val;
      }
    }
    ,

    applicationSelfIntroductionInput: {
      get() {
        return this.applications.selfIntroduction;
      }
      ,
      set(val) {
        this.applications.selfIntroduction = val;
      }
    }
    ,

    applicationApplyReasonInput: {
      get() {
        return this.applications.applyReason;
      }
      ,
      set(val) {
        this.applications.applyReason = val;
      }
    }
    ,

    applicationSkillEvaluation: {
      get() {
        return this.applications.skillEvaluation;
      }
      ,
      set(val) {
        this.applications.skillEvaluation = val;
      }
    }
    ,

    applicationGolfMemory: {
      get() {
        return this.applications.golfMemory;
      }
      ,
      set(val) {
        this.applications.golfMemory = val;
      }
    }
    ,

    applicationOtherClub: {
      get() {
        return this.applications.otherClub;
      }
      ,
      set(val) {
        this.applications.otherClub = val;
      }
    }
    ,

    applicationSwingVideo: {
      get() {
        return this.applications.swingVideo;
      }
      ,
      set(val) {
        this.applications.swingVideo = val;
      }
    }
    ,

    isFormValid() {
      return this.applications.name.trim().length > 0 &&
          this.applications.photo.trim().length > 0 &&
          this.applications.studentId.trim().length > 0 &&
          this.applications.birthDate.trim().length > 0 &&
          this.applications.major.trim().length > 0 &&
          this.applications.phoneNumber.replace(/[^0-9]/g, '').length >= 10 &&
          this.applications.email.trim().length > 0 &&
          this.applications.selfIntroduction.trim().length > 0 &&
          this.applications.applyReason.trim().length > 0 &&
          this.applications.skillEvaluation.trim().length > 0 &&
          this.applications.golfMemory.trim().length > 0 &&
          this.applications.otherClub.trim().length > 0 &&
          this.applications.swingVideo.trim().length > 0;
    }
  }
  ,

}
</script>


<style lang="scss" scoped>

.file-upload-container {
  display: flex;
  flex-direction: column;
}

.photo-upload-section {
  margin-bottom: 25px;
  text-align: center;
}

.photo-container {
  display: inline-block;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.photo-container:hover {
  border-color: #08366f;
}

.file-upload-container {
  position: relative;
  cursor: pointer;
}

.file-upload-container input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 120px;
  cursor: pointer;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #666;
}

.photo-display {
  position: relative;
  display: inline-block;
}

.apply-photo {
  max-width: 150px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.photo-delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff4444;
  color: white;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.photo-delete-btn:hover {
  background-color: #cc0000;
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
  border: 1px solid #08366f;
  background-color: #08366f;
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

.loading-container {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  height: 100%; /* 화면 전체 높이 */
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 회색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 요소들 위에 표시 */
}

.loading-image {
  width: 100px; /* 로딩 이미지 크기 조절 */
  height: 100px;
}

/* 폼 헤더 스타일 */
.form-header {
  width: 100%;
  max-width: 800px;
  margin: 0 auto 30px auto;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
}

.form-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.notice-text {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

.form-footer {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
}

.section-spacer {
  height: 30px;
  margin: 20px 0;
}

/* 기본 정보 섹션 스타일 */
.default_info {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  text-align: left;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .form-header,
  .form-footer,
  .default_info {
    max-width: 100%;
    padding: 0 15px;
  }

  .form-header h1 {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .section-subtitle {
    font-size: 13px;
  }

  .notice-text {
    font-size: 12px;
  }

  .info-field {
    margin-bottom: 20px;
  }

  .info-field label {
    font-size: 13px;
  }

  .info-field input,
  .info-field textarea {
    font-size: 13px;
  }

  .email-container {
    flex-direction: column;
    gap: 8px;
  }

  .email-confirm-btn {
    align-self: flex-start;
  }

  .photo-container {
    padding: 15px;
  }

  .apply-photo {
    max-width: 120px;
    max-height: 120px;
  }

  .photo-delete-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
    top: -6px;
    right: -6px;
  }

  .upload-placeholder {
    min-height: 100px;
    padding: 15px;
  }

  .upload-icon {
    font-size: 28px;
  }

  .upload-text {
    font-size: 13px;
  }

  .upload-hint {
    font-size: 11px;
  }
}

.info-field {
  margin-bottom: 25px;
}

.info-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.info-field input {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  background: transparent;
  outline: none;
  transition: border-bottom-color 0.3s;
}

.info-field input:focus {
  border-bottom-color: #08366f;
}

.info-field input::placeholder {
  color: #999;
  font-size: 14px;
}

.email-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.email-container input {
  flex: 1;
}

.email-confirm-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.email-confirm-btn:hover {
  background-color: #e9e9e9;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  margin-bottom: 0;
}

/* 자기소개 textarea 스타일 */
.info-field textarea {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background: #f5f5f5;
  outline: none;
  resize: none;
  height: auto;
  min-height: 120px;
  overflow: hidden;
  transition: background-color 0.3s;
  box-sizing: border-box;
}

.info-field textarea:focus {
  background: #fff;
  border: 1px solid #08366f;
}

.info-field textarea::placeholder {
  color: #999;
  font-size: 14px;
}

</style>