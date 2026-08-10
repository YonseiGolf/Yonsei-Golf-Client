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
          <input
              v-if="!applications.photo"
              type="file"
              @change="handleFileUpload"
              accept="image/jpeg,image/png,image/webp,image/gif"
              :disabled="isImageUploading"
          />
          <div v-if="!applications.photo" class="upload-placeholder">
            <div class="upload-icon">👤</div>
            <div class="upload-text">지원자 사진</div>
            <div class="upload-hint">{{ isImageUploading ? '업로드 중...' : '클릭하여 업로드' }}</div>
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
        <button
            type="button"
            class="email-confirm-btn"
            @click="sendEmailConfirmation"
            :disabled="isEmailConfirmationSending || emailConfirmationSentTo === applications.email.trim()"
        >
          {{ emailConfirmationButtonText }}
        </button>
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
       
       <!-- 활동 추가 폼 -->
       <div class="activity-form">
         <div class="activity-input-row">
           <input type="text" placeholder="동아리/학회명" v-model="newActivity.clubName" class="activity-input">
           <input type="date" v-model="newActivity.startDate" class="activity-input">
           <input type="date" v-model="newActivity.endDate" class="activity-input">
           <input type="text" placeholder="역할" v-model="newActivity.role" class="activity-input">
           <button type="button" @click="addActivity" class="add-activity-btn">추가</button>
         </div>
       </div>

       <!-- 활동 목록 -->
       <div class="activities-container">
         <div v-if="applications.activities && applications.activities.length > 0" class="activities-table">
           <table>
             <thead>
               <tr>
                 <th>동아리/학회명</th>
                 <th>시작일</th>
                 <th>종료일</th>
                 <th>역할</th>
                 <th>삭제</th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="(activity, index) in applications.activities" :key="index">
                 <td>{{ activity.clubName }}</td>
                 <td>{{ formatDate(activity.startDate) }}</td>
                 <td>{{ formatDate(activity.endDate) }}</td>
                 <td>{{ activity.role }}</td>
                 <td>
                   <button type="button" @click="removeActivity(index)" class="remove-activity-btn">×</button>
                 </td>
               </tr>
             </tbody>
           </table>
         </div>
         <div v-else class="no-activities">
           <p>등록된 활동이 없습니다.</p>
         </div>
       </div>
     </div>

     <div class="info-field">
       <label>본인의 스윙 영상이 담긴 url을 적어주세요 (유튜브, 인스타 등)</label>
       <textarea ref="swingVideoTextarea" placeholder="유튜브 링크를 첨부해주세요. (비공개 영상이 아닌지 확인해주세요)" v-model="applications.swingVideo" rows="6" @input="handleSwingVideoInput"></textarea>
       <div class="error-message" v-if="golfSwingInvalid"> 최대 500자까지 작성 가능합니다.</div>
     </div>

     <div class="section-spacer"></div>

     <div class="info-field" v-if="interviewTimeList.length > 0">
       <label>면접 가능 시간을 선택해주세요 (복수 선택 가능)</label>
       <div class="interview-time-list">
         <div
           v-for="time in interviewTimeList"
           :key="time.id"
           class="interview-time-item"
         >
           <label class="checkbox-label">
             <input
               type="checkbox"
               :value="time.id"
               v-model="selectedInterviewTimeIds"
             />
             <span class="checkbox-text">{{ time.interviewDateTime }}</span>
           </label>
         </div>
       </div>
       <div class="error-message" v-if="selectedInterviewTimeIds.length === 0">
         최소 1개 이상의 면접 시간을 선택해주세요.
       </div>
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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

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
        activities: [],
        swingVideo: '',
        selectedFile: null,
      },
      selfInfoInvalid: false,
      applyReasonInvalid: false,
      golfSkillInvalid: false,
      golfMemoryInvalid: false,
      golfSwingInvalid: false,
      isLoading: false,
      isImageUploading: false,
      isEmailConfirmationSending: false,
      emailConfirmationSentTo: '',
      newActivity: {
        clubName: '',
        startDate: '',
        endDate: '',
        role: ''
      },
      currentSemester: null,
      currentRecruitId: null,
      interviewTimeList: [],
      selectedInterviewTimeIds: [],
    }
  },

  async mounted() {
    await this.fetchCurrentRecruit();
  },

  methods: {
    async fetchCurrentRecruit() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/application/recruit`);
        console.log('현재 모집 기간 응답:', response.data);
        if (response.status === 200 && response.data.data) {
          this.currentSemester = response.data.data.semester;
          this.currentRecruitId = response.data.data.id;

          // 응답에 면접 시간 목록이 포함되어 있으면 사용
          if (response.data.data.interviewTimes) {
            this.interviewTimeList = response.data.data.interviewTimes;
            console.log('interviewTimeList (from recruit):', this.interviewTimeList);
          } else {
            // 없으면 별도 API로 조회
            await this.fetchInterviewTimes();
          }
        }
      } catch (error) {
        console.error('현재 기수 조회 실패:', error);
      }
    },

    async fetchInterviewTimes() {
      if (!this.currentRecruitId) {
        console.log('currentRecruitId가 없어서 면접 시간을 조회하지 않습니다.');
        return;
      }

      try {
        // 일반 사용자용 API 호출
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/application/recruit/${this.currentRecruitId}/interview-times`
        );
        console.log('면접 시간 응답:', response.data);
        if (response.status === 200 && response.data.data) {
          this.interviewTimeList = response.data.data;
          console.log('interviewTimeList:', this.interviewTimeList);
        }
      } catch (error) {
        console.error('면접 시간 목록 조회 실패:', error);
        this.interviewTimeList = [];
      }
    },

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
                    activityClubs: this.applications.activities,
                    swingVideo: this.applications.swingVideo,
                    semester: this.currentSemester,
                    availableInterviewTimeIds: this.selectedInterviewTimeIds
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

    async sendEmailConfirmation() {
      const email = this.applications.email.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        await Swal.fire({
          icon: 'warning',
          title: '이메일을 확인해주세요.',
          text: '올바른 이메일 형식을 입력해주세요.',
          confirmButtonColor: '#08366f',
        });
        return;
      }

      this.applications.email = email;
      this.isEmailConfirmationSending = true;
      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/application/email-confirmation`, {
          email,
        });
        this.emailConfirmationSentTo = email;
        await Swal.fire({
          icon: 'success',
          title: '확인 메일을 발송했습니다.',
          text: `${email}의 받은편지함을 확인해주세요.`,
          confirmButtonColor: '#08366f',
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: '확인 메일 발송에 실패했습니다.',
          text: error.response?.data?.message || '잠시 후 다시 시도해주세요.',
          confirmButtonColor: '#08366f',
        });
      } finally {
        this.isEmailConfirmationSending = false;
      }
    },

    async uploadImage() {
      const file = this.applications.selectedFile;

      this.isImageUploading = true;
      try {
        const response = await axios.post(
            `${process.env.VUE_APP_API_URL}/apply/forms/image/presigned-url`,
            {
              fileName: file.name,
              contentType: file.type,
              fileSize: file.size,
            }
        );
        const uploadUrl = response.data?.data?.uploadUrl;
        const imageUrl = response.data?.data?.image;
        if (!uploadUrl || !imageUrl) {
          throw new Error('이미지 업로드 정보가 응답에 없습니다.');
        }

        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read',
          },
          body: file,
        });
        if (!uploadResponse.ok) {
          throw new Error(`스토리지 업로드에 실패했습니다. (${uploadResponse.status})`);
        }

        this.applications.photo = imageUrl;
        return true;
      } catch (error) {
        console.error("Image upload failed:", error);
        await Swal.fire({
          icon: 'error',
          title: '사진 업로드에 실패했습니다.',
          text: error.response?.data?.message || error.message || '잠시 후 다시 시도해주세요.',
          confirmButtonColor: '#08366f',
        });
        return false;
      } finally {
        this.isImageUploading = false;
      }
    },

    async handleFileUpload(event) {
      this.applications.selectedFile = event.target.files[0];
      if (this.applications.selectedFile) {
        if (!ALLOWED_IMAGE_TYPES.has(this.applications.selectedFile.type)) {
          await Swal.fire({
            icon: 'warning',
            title: '지원하지 않는 이미지 형식입니다.',
            text: 'JPG, PNG, WEBP, GIF 파일만 업로드할 수 있습니다.',
            confirmButtonColor: '#08366f',
          });
          this.applications.selectedFile = null;
          event.target.value = '';
          return;
        }

        if (this.applications.selectedFile.size > MAX_IMAGE_SIZE) {
          await Swal.fire({
            icon: 'warning',
            title: '이미지 용량이 너무 큽니다.',
            text: '10MB 이하의 이미지를 선택해주세요.',
            confirmButtonColor: '#08366f',
          });
          this.applications.selectedFile = null;
          event.target.value = '';
          return;
        }

        const uploaded = await this.uploadImage();
        if (!uploaded) {
          this.applications.selectedFile = null;
          event.target.value = '';
        }
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
      if (this.applications.email.length > 254) {
        this.applications.email = this.applications.email.substring(0, 254);
      }
      if (this.emailConfirmationSentTo !== this.applications.email.trim()) {
        this.emailConfirmationSentTo = '';
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

    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    addActivity() {
      if (!this.newActivity.clubName || !this.newActivity.startDate || !this.newActivity.endDate || !this.newActivity.role) {
        Swal.fire({
          title: '모든 필드를 입력해주세요.',
          confirmButtonColor: '#08366f',
        });
        return;
      }

      // 종료일이 시작일보다 이전인지 확인
      if (new Date(this.newActivity.endDate) < new Date(this.newActivity.startDate)) {
        Swal.fire({
          title: '종료일은 시작일보다 이후여야 합니다.',
          confirmButtonColor: '#08366f',
        });
        return;
      }

      // activities 배열이 없으면 초기화
      if (!this.applications.activities) {
        this.applications.activities = [];
      }

      // 새 활동 추가
      this.applications.activities.push({
        clubName: this.newActivity.clubName,
        startDate: this.newActivity.startDate,
        endDate: this.newActivity.endDate,
        role: this.newActivity.role
      });

      // 입력 필드 초기화
      this.newActivity = {
        clubName: '',
        startDate: '',
        endDate: '',
        role: ''
      };
    },

    removeActivity(index) {
      this.applications.activities.splice(index, 1);
    },
  }
  ,

  computed: {
    emailConfirmationButtonText() {
      if (this.isEmailConfirmationSending) {
        return '발송 중...';
      }
      if (this.emailConfirmationSentTo === this.applications.email.trim()) {
        return '발송 완료';
      }
      return '이메일 확인';
    },

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
      const basicFieldsValid = this.applications.name.trim().length > 0 &&
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
          this.applications.swingVideo.trim().length > 0;

      // 면접 시간이 있을 경우 최소 1개 이상 선택해야 함
      const interviewTimeValid = this.interviewTimeList.length === 0 || this.selectedInterviewTimeIds.length > 0;

      return basicFieldsValid && interviewTimeValid;
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

.email-confirm-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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

/* 활동 추가 폼 스타일 */
.activity-form {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.activity-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.activity-input {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: white;
  outline: none;
  transition: border-color 0.3s;
}

.activity-input:focus {
  border-color: #08366f;
}

.add-activity-btn {
  padding: 8px 16px;
  background-color: #08366f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.add-activity-btn:hover {
  background-color: #1a5cc8;
}

/* 활동 테이블 스타일 */
.activities-container {
  margin-top: 10px;
}

.activities-table {
  width: 100%;
  overflow-x: auto;
}

.activities-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.activities-table th {
  background-color: #08366f;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}

.activities-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.activities-table tr:last-child td {
  border-bottom: none;
}

.activities-table tr:hover {
  background-color: #f8f9fa;
}

.no-activities {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
  background: #f5f5f5;
  border-radius: 8px;
}

.remove-activity-btn {
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

.remove-activity-btn:hover {
  background-color: #cc0000;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .activity-input-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .activity-input {
    width: 100%;
    min-width: auto;
  }
  
  .add-activity-btn {
    align-self: flex-start;
  }
  
  .activities-table {
    font-size: 12px;
  }
  
  .activities-table th,
  .activities-table td {
    padding: 8px 4px;
    font-size: 12px;
  }
  
  .activities-table th {
    font-size: 11px;
  }
  
  .remove-activity-btn {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
}

/* 면접 시간 선택 스타일 */
.interview-time-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.interview-time-item {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
  margin-bottom: 0;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #08366f;
}

.checkbox-text {
  font-size: 14px;
  color: #333;
}

@media (max-width: 768px) {
  .interview-time-list {
    padding: 12px;
  }

  .checkbox-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  .checkbox-text {
    font-size: 13px;
  }
}

</style>
