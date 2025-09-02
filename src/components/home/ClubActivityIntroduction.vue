<template>
  <div class="blue-container">
    <h2 id="title">연골 동아리는 이런 활동을 해요</h2>

    <!-- 데스크톱: 4개 카드 모두 표시 -->
    <div class="desktop-cards">
      <div class="card grey-card hover-card" @click="handleCardClick(0)">
        <img src="https://minio.birdiehyun.store/yg-img-storage/store-image/freshmen-mt.jpegUsgBCksEbD" alt="정규 활동"
             class="introduction-image">
        <div class="hover-content" :class="{ 'active': activeCards[0] }">
          <main-title>
            정규 활동<br><br>
          </main-title>
          <main-body>
            매주 목요일 신촌역 부근에서<br>
          정기활동을 진행해요
          </main-body>
        </div>
      </div>

      <div class="card grey-card hover-card" @click="handleCardClick(1)">
        <img src="https://minio.birdiehyun.store/yg-img-storage/store-image/freshmen-mt.jpegUsgBCksEbD" alt="신입 환영 MT"
             class="introduction-image">
        <div class="hover-content" :class="{ 'active': activeCards[1] }">
          <main-title>
            신입 환영 MT<br><br>
          </main-title>
          <main-body>
            신입 부원들과 기존 부원들과의 조화를 위해<br>
            신입 환영 MT를 진행해요</main-body>
        </div>
      </div>

      <div class="card grey-card hover-card" @click="handleCardClick(2)">
        <img
            src="https://minio.birdiehyun.store/yg-img-storage/store-image/yb-rounding.jpegm2v2OBd1a3"
            alt="단체 라운딩" class="introduction-image">
        <div class="hover-content" :class="{ 'active': activeCards[2] }">
          <main-title>
            단체 라운딩<br><br>
          </main-title>
          <main-body>
            매 학기 경기권에서 라운딩을 진행해요
          </main-body>
        </div>
      </div>

      <div class="card grey-card hover-card" @click="handleCardClick(3)">
        <img
            src="https://minio.birdiehyun.store/yg-img-storage/store-image/ob-rounding.jpegfy6Y06Pp3R"
            alt="OB 엠티" class="introduction-image">
        <div class="hover-content" :class="{ 'active': activeCards[3] }">
          <main-title>
            OB 라운딩<br><br>
          </main-title>
          <main-body>
            YB 활동이 끝나더라도<br>
            OB 부원과 라운딩을 함께해요
          </main-body>
        </div>
      </div>
    </div>

    <!-- 모바일: 캐러셀 형태 -->
    <div class="mobile-carousel">
      <div class="carousel-container">
        <button class="carousel-arrow left-arrow" @click="prevSlide">‹</button>
        
        <div class="carousel-slide">
          <div class="mobile-card grey-card hover-card" @click="handleCardClick(currentSlide)">
            <img :src="carouselData[currentSlide].image" :alt="carouselData[currentSlide].title"
                 class="introduction-image">
            <div class="hover-content" :class="{ 'active': activeCards[currentSlide] }">
              <main-title>
                {{ carouselData[currentSlide].title }}<br><br>
              </main-title>
              <main-body>
                {{ carouselData[currentSlide].description }}
              </main-body>
            </div>
          </div>
        </div>
        
        <button class="carousel-arrow right-arrow" @click="nextSlide">›</button>
      </div>
      
      <!-- 페이지네이션 도트 -->
      <div class="carousel-dots">
        <span 
          v-for="(item, index) in carouselData" 
          :key="index"
          class="dot"
          :class="{ 'active': index === currentSlide }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlueComponent",
  data() {
    return {
      activeCards: [false, false, false, false],
      currentSlide: 0,
      carouselData: [
        {
          image: "https://minio.birdiehyun.store/yg-img-storage/store-image/freshmen-mt.jpegUsgBCksEbD",
          title: "정규 활동",
          description: "매주 목요일 신촌역 부근에서\n정기활동을 진행해요"
        },
        {
          image: "https://minio.birdiehyun.store/yg-img-storage/store-image/freshmen-mt.jpegUsgBCksEbD",
          title: "신입 환영 MT",
          description: "신입 부원들과 기존 부원들과의 조화를 위해\n신입 환영 MT를 진행해요"
        },
        {
          image: "https://minio.birdiehyun.store/yg-img-storage/store-image/yb-rounding.jpegm2v2OBd1a3",
          title: "단체 라운딩",
          description: "매 학기 경기권에서 라운딩을 진행해요"
        },
        {
          image: "https://minio.birdiehyun.store/yg-img-storage/store-image/ob-rounding.jpegfy6Y06Pp3R",
          title: "OB 라운딩",
          description: "YB 활동이 끝나더라도\nOB 부원과 라운딩을 함께해요"
        }
      ]
    }
  },
  methods: {
    handleCardClick(index) {
      // 모바일에서만 클릭 이벤트 처리
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        this.activeCards[index] = !this.activeCards[index];
      }
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.carouselData.length;
    },
    prevSlide() {
      this.currentSlide = this.currentSlide === 0 ? this.carouselData.length - 1 : this.currentSlide - 1;
    },
    goToSlide(index) {
      this.currentSlide = index;
    }
  }
};
</script>

<style scoped>
#title {
  margin-bottom: 20px; /* 제목과 카드 컨테이너 사이의 간격 설정 */
  color: white; /* 제목 색상 설정 */
}

.blue-container {

  background-color: #08366f;
  padding: 4%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 3%;
}


h2 {
  font-size: 30px;

  font-family: 'GmarketSansMedium', sans-serif;
}

/* 데스크톱 카드 스타일 */
.desktop-cards {
  width: 40%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 50px;
}

/* 모바일 캐러셀 스타일 */
.mobile-carousel {
  display: none;
  width: 90%;
  margin-top: 50px;
}

.card {
  margin-bottom: 3%; /* 카드 간의 위아래 간격 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px; /* 글자 크기 설정 */

  border: 1px solid #a5b1c2;
  border-radius: 10px;

  overflow: hidden;
  min-height: 200px; /* 최소 높이 설정 */
}

.hover-card {
  position: relative;
  cursor: pointer;
}

.hover-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(8, 54, 111, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;
}

/* 데스크톱: hover 사용 */
@media (hover: hover) {
  .hover-card:hover .hover-content {
    opacity: 1;
  }
}

/* 모바일: active 클래스 사용 (클릭 시) */
.hover-content.active {
  opacity: 1;
}

/* 캐러셀 컨테이너 */
.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* 캐러셀 화살표 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  color: #08366f;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;
}

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 1);
}

.left-arrow {
  left: -20px;
}

.right-arrow {
  right: -20px;
}

/* 캐러셀 슬라이드 */
.carousel-slide {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 모바일 카드 */
.mobile-card {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  border: 1px solid #a5b1c2;
  border-radius: 10px;
  overflow: hidden;
  min-height: 200px;
}

/* 페이지네이션 도트 */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background: white;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

@media (max-width: 1024px) {
  /* 데스크톱 카드 숨기기 */
  .desktop-cards {
    display: none;
  }
  
  /* 모바일 캐러셀 표시 */
  .mobile-carousel {
    display: block;
    width: 100%;
  }
}

.introduction-image {
  max-width: 100%;
  height: auto;
  border-radius: 9px;
}

main-title {
  font-size: 24px;
  font-weight: bold;
  font-family: 'GmarketSansMedium', sans-serif;
}

main-body {
  font-size: 14px;
  font-family: 'Pretendard-Regular', sans-serif;
}
</style>
