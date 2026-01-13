<template>
  <div class="apply-period-admin">
    <h2>지원 기간 관리</h2>

    <!-- 모집 기간 목록 -->
    <div class="list-section">
      <div class="list-header">
        <h3>모집 기간 목록</h3>
        <button class="btn-add" @click="addNewPeriod">+ 새로 추가</button>
      </div>

      <table v-if="periodList.length > 0">
        <thead>
          <tr>
            <th>기수</th>
            <th>서류 접수 기간</th>
            <th>서류 발표</th>
            <th>면접 기간</th>
            <th>최종 발표</th>
            <th>OT</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="period in periodList"
            :key="period.id"
            :class="{ selected: selectedPeriod?.id === period.id }"
            @click="selectPeriod(period)"
          >
            <td>{{ period.semester }}기</td>
            <td>{{ formatDateRange(period.startDate, period.endDate) }}</td>
            <td>{{ formatDate(period.firstResultDate) }}</td>
            <td>{{ formatDateRange(period.interviewStartDate, period.interviewEndDate) }}</td>
            <td>{{ formatDate(period.finalResultDate) }}</td>
            <td>{{ formatDate(period.orientationDate) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-list">
        등록된 모집 기간이 없습니다.
      </div>
    </div>

    <!-- 모집 기간 폼 -->
    <div class="form-section" v-if="showForm">
      <h3>{{ isEditMode ? '모집 기간 수정' : '새 모집 기간 등록' }}</h3>

      <div class="form-container">
        <div class="form-group">
          <label>기수</label>
          <input type="number" v-model="formData.semester" placeholder="예: 1" />
        </div>

        <div class="form-group">
          <label>서류 접수 기간</label>
          <div class="date-range">
            <input type="date" v-model="formData.startDate" />
            <span>~</span>
            <input type="date" v-model="formData.endDate" />
          </div>
        </div>

        <div class="form-group">
          <label>서류 합격 발표일</label>
          <input type="date" v-model="formData.firstResultDate" />
        </div>

        <div class="form-group">
          <label>면접 기간</label>
          <div class="date-range">
            <input type="date" v-model="formData.interviewStartDate" />
            <span>~</span>
            <input type="date" v-model="formData.interviewEndDate" />
          </div>
        </div>

        <div class="form-group">
          <label>최종 결과 발표일</label>
          <input type="date" v-model="formData.finalResultDate" />
        </div>

        <div class="form-group">
          <label>오리엔테이션 날짜</label>
          <input type="date" v-model="formData.orientationDate" />
        </div>

        <div class="button-group">
          <button v-if="isEditMode" class="btn-save" @click="updatePeriod">수정</button>
          <button v-else class="btn-save" @click="createPeriod">등록</button>
          <button v-if="isEditMode" class="btn-delete" @click="deletePeriod">삭제</button>
          <button class="btn-cancel" @click="cancelForm">취소</button>
        </div>
      </div>
    </div>

    <!-- 면접 시간 관리 섹션 -->
    <div class="interview-section" v-if="isEditMode && selectedPeriod">
      <div class="list-header">
        <h3>면접 시간 관리 ({{ selectedPeriod.semester }}기)</h3>
      </div>

      <!-- 면접 시간 추가 폼 -->
      <div class="interview-add-form">
        <div class="interview-input-row">
          <input
            type="datetime-local"
            v-model="newInterviewTime"
            class="interview-input"
          />
          <button class="btn-add-interview" @click="addInterviewTime">+ 추가</button>
        </div>
      </div>

      <!-- 면접 시간 목록 -->
      <div class="interview-list">
        <table v-if="interviewTimeList.length > 0">
          <thead>
            <tr>
              <th>면접 일시</th>
              <th>수정</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="time in interviewTimeList" :key="time.id">
              <td>
                <span v-if="editingInterviewId !== time.id">{{ time.interviewDateTime }}</span>
                <input
                  v-else
                  type="datetime-local"
                  v-model="editingInterviewValue"
                  class="interview-edit-input"
                />
              </td>
              <td>
                <button
                  v-if="editingInterviewId !== time.id"
                  class="btn-edit"
                  @click="startEditInterview(time)"
                >수정</button>
                <button
                  v-else
                  class="btn-save-small"
                  @click="saveEditInterview(time.id)"
                >저장</button>
              </td>
              <td>
                <button
                  v-if="editingInterviewId !== time.id"
                  class="btn-delete-small"
                  @click="deleteInterviewTime(time.id)"
                >삭제</button>
                <button
                  v-else
                  class="btn-cancel-small"
                  @click="cancelEditInterview"
                >취소</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-list">
          등록된 면접 시간이 없습니다.
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <img src="https://yg-img-storage.s3.ap-northeast-2.amazonaws.com/image/loading.a11988e6.gif" alt="Loading">
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      periodList: [],
      selectedPeriod: null,
      showForm: false,
      formData: {
        id: null,
        semester: null,
        startDate: '',
        endDate: '',
        firstResultDate: '',
        interviewStartDate: '',
        interviewEndDate: '',
        finalResultDate: '',
        orientationDate: ''
      },
      isEditMode: false,
      isLoading: false,
      // 면접 시간 관리
      interviewTimeList: [],
      newInterviewTime: '',
      editingInterviewId: null,
      editingInterviewValue: ''
    }
  },

  async mounted() {
    await this.fetchPeriodList();
  },

  methods: {
    async fetchPeriodList() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/admin/recruits`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });
        if (response.status === 200 && response.data.data) {
          this.periodList = response.data.data;
        }
      } catch (error) {
        console.error('모집 기간 목록 조회 실패:', error);
      }
    },

    async selectPeriod(period) {
      this.selectedPeriod = period;
      this.formData = {
        id: period.id,
        semester: period.semester,
        startDate: period.startDate || '',
        endDate: period.endDate || '',
        firstResultDate: period.firstResultDate || '',
        interviewStartDate: period.interviewStartDate || '',
        interviewEndDate: period.interviewEndDate || '',
        finalResultDate: period.finalResultDate || '',
        orientationDate: period.orientationDate || ''
      };
      this.isEditMode = true;
      this.showForm = true;

      // 면접 시간 목록 조회
      await this.fetchInterviewTimes();
    },

    addNewPeriod() {
      this.selectedPeriod = null;
      this.formData = {
        id: null,
        semester: null,
        startDate: '',
        endDate: '',
        firstResultDate: '',
        interviewStartDate: '',
        interviewEndDate: '',
        finalResultDate: '',
        orientationDate: ''
      };
      this.isEditMode = false;
      this.showForm = true;
      this.interviewTimeList = [];
    },

    cancelForm() {
      this.showForm = false;
      this.selectedPeriod = null;
      this.resetForm();
      this.interviewTimeList = [];
    },

    async createPeriod() {
      const result = await Swal.fire({
        title: '모집 기간을 등록하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#08366f',
        cancelButtonColor: '#d33',
        confirmButtonText: '등록',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/admin/recruit`, this.getPayload(), {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
          }
        });

        await Swal.fire({
          title: response.data.message || '모집 기간 등록 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        this.showForm = false;
        await this.fetchPeriodList();
      } catch (error) {
        await Swal.fire({
          title: '모집 기간 등록 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    async updatePeriod() {
      const result = await Swal.fire({
        title: '모집 기간을 수정하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#08366f',
        cancelButtonColor: '#d33',
        confirmButtonText: '수정',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_URL}/admin/recruit/${this.formData.id}`,
          this.getPayload(),
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );

        await Swal.fire({
          title: response.data.message || '모집 기간 수정 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        this.showForm = false;
        await this.fetchPeriodList();
      } catch (error) {
        await Swal.fire({
          title: '모집 기간 수정 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    async deletePeriod() {
      const result = await Swal.fire({
        title: '모집 기간을 삭제하시겠습니까?',
        text: `${this.formData.semester}기 모집 기간이 삭제됩니다.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.delete(
          `${process.env.VUE_APP_API_URL}/admin/recruit/${this.formData.id}`,
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );

        await Swal.fire({
          title: response.data.message || '모집 기간 삭제 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        this.showForm = false;
        await this.fetchPeriodList();
      } catch (error) {
        await Swal.fire({
          title: '모집 기간 삭제 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    // 면접 시간 관리 메서드
    async fetchInterviewTimes() {
      if (!this.selectedPeriod) return;

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/admin/recruit/${this.selectedPeriod.id}/interview-times`,
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );
        if (response.status === 200 && response.data.data) {
          this.interviewTimeList = response.data.data;
        }
      } catch (error) {
        console.error('면접 시간 목록 조회 실패:', error);
        this.interviewTimeList = [];
      }
    },

    async addInterviewTime() {
      if (!this.newInterviewTime) {
        await Swal.fire({
          title: '면접 시간을 입력해주세요.',
          icon: 'warning',
          confirmButtonColor: '#08366f'
        });
        return;
      }

      const result = await Swal.fire({
        title: '면접 시간을 추가하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#08366f',
        cancelButtonColor: '#d33',
        confirmButtonText: '추가',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/admin/recruit/${this.selectedPeriod.id}/interview-times`,
          {
            interviewDateTime: this.formatDateTimeForApi(this.newInterviewTime)
          },
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );

        await Swal.fire({
          title: response.data.message || '면접 시간 추가 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        this.newInterviewTime = '';
        await this.fetchInterviewTimes();
      } catch (error) {
        await Swal.fire({
          title: '면접 시간 추가 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    startEditInterview(time) {
      this.editingInterviewId = time.id;
      // datetime-local 형식으로 변환
      this.editingInterviewValue = this.formatDateTimeForInput(time.interviewDateTime);
    },

    cancelEditInterview() {
      this.editingInterviewId = null;
      this.editingInterviewValue = '';
    },

    async saveEditInterview(interviewTimeId) {
      if (!this.editingInterviewValue) {
        await Swal.fire({
          title: '면접 시간을 입력해주세요.',
          icon: 'warning',
          confirmButtonColor: '#08366f'
        });
        return;
      }

      const result = await Swal.fire({
        title: '면접 시간을 수정하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#08366f',
        cancelButtonColor: '#d33',
        confirmButtonText: '수정',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.patch(
          `${process.env.VUE_APP_API_URL}/admin/interview-times/${interviewTimeId}`,
          {
            interviewDateTime: this.formatDateTimeForApi(this.editingInterviewValue)
          },
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );

        await Swal.fire({
          title: response.data.message || '면접 시간 수정 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        this.editingInterviewId = null;
        this.editingInterviewValue = '';
        await this.fetchInterviewTimes();
      } catch (error) {
        await Swal.fire({
          title: '면접 시간 수정 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    async deleteInterviewTime(interviewTimeId) {
      const result = await Swal.fire({
        title: '면접 시간을 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      });

      if (!result.isConfirmed) {
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.delete(
          `${process.env.VUE_APP_API_URL}/admin/interview-times/${interviewTimeId}`,
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
            }
          }
        );

        await Swal.fire({
          title: response.data.message || '면접 시간 삭제 성공',
          icon: 'success',
          confirmButtonColor: '#08366f'
        });

        await this.fetchInterviewTimes();
      } catch (error) {
        await Swal.fire({
          title: '면접 시간 삭제 실패',
          text: error.response?.data?.message || '오류가 발생했습니다.',
          icon: 'error',
          confirmButtonColor: '#08366f'
        });
      } finally {
        this.isLoading = false;
      }
    },

    // datetime-local input용 포맷 (2026-01-01T20:00)
    formatDateTimeForInput(dateTimeStr) {
      if (!dateTimeStr) return '';
      // "2026-01-01 20:00" -> "2026-01-01T20:00"
      return dateTimeStr.replace(' ', 'T');
    },

    // API 전송용 포맷 (2026-01-01T20:00:00)
    formatDateTimeForApi(dateTimeStr) {
      if (!dateTimeStr) return null;
      // "2026-01-01T20:00" -> "2026-01-01T20:00:00"
      if (dateTimeStr.length === 16) {
        return dateTimeStr + ':00';
      }
      return dateTimeStr;
    },

    getPayload() {
      return {
        semester: this.formData.semester,
        startDate: this.formData.startDate || null,
        endDate: this.formData.endDate || null,
        firstResultDate: this.formData.firstResultDate || null,
        interviewStartDate: this.formData.interviewStartDate || null,
        interviewEndDate: this.formData.interviewEndDate || null,
        finalResultDate: this.formData.finalResultDate || null,
        orientationDate: this.formData.orientationDate || null
      };
    },

    resetForm() {
      this.formData = {
        id: null,
        semester: null,
        startDate: '',
        endDate: '',
        firstResultDate: '',
        interviewStartDate: '',
        interviewEndDate: '',
        finalResultDate: '',
        orientationDate: ''
      };
      this.isEditMode = false;
    },

    formatDate(date) {
      if (!date) return '-';
      return date;
    },

    formatDateRange(start, end) {
      if (!start && !end) return '-';
      return `${start || ''} ~ ${end || ''}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-period-admin {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h3 {
  color: #333;
  margin: 0;
}

/* 목록 섹션 */
.list-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.btn-add {
  padding: 8px 16px;
  background-color: #08366f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1a5cc8;
  }
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  &.selected {
    background-color: #e3f2fd;
  }
}

.empty-list {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* 폼 섹션 */
.form-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  h3 {
    margin-bottom: 20px;
  }
}

.form-container {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #08366f;
      box-shadow: 0 0 0 2px rgba(8, 54, 111, 0.1);
    }
  }
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    flex: 1;
  }

  span {
    color: #666;
  }
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 30px;

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-save {
    background-color: #08366f;
    color: white;

    &:hover {
      background-color: #1a5cc8;
    }
  }

  .btn-delete {
    background-color: #d33;
    color: white;

    &:hover {
      background-color: #b02a2a;
    }
  }

  .btn-cancel {
    background-color: #f5f5f5;
    color: #333;

    &:hover {
      background-color: #e0e0e0;
    }
  }
}

/* 면접 시간 관리 섹션 */
.interview-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .list-header {
    margin-bottom: 20px;
  }
}

.interview-add-form {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.interview-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.interview-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #08366f;
  }
}

.interview-edit-input {
  padding: 6px 10px;
  border: 1px solid #08366f;
  border-radius: 4px;
  font-size: 13px;
}

.btn-add-interview {
  padding: 10px 20px;
  background-color: #08366f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #1a5cc8;
  }
}

.interview-list {
  table {
    margin-top: 10px;
  }

  tbody tr {
    cursor: default;
  }
}

.btn-edit, .btn-save-small {
  padding: 6px 12px;
  background-color: #08366f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #1a5cc8;
  }
}

.btn-delete-small {
  padding: 6px 12px;
  background-color: #d33;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #b02a2a;
  }
}

.btn-cancel-small {
  padding: 6px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .apply-period-admin {
    padding: 15px;
  }

  .list-section,
  .form-section,
  .interview-section {
    padding: 15px;
  }

  .list-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px 4px;
  }

  .date-range {
    flex-direction: column;
    gap: 5px;

    span {
      display: none;
    }
  }

  .interview-input-row {
    flex-direction: column;
  }

  .interview-input {
    width: 100%;
  }

  .btn-add-interview {
    width: 100%;
  }
}
</style>
