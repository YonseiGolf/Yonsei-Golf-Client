// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: 'myCustomTheme', // 기본 테마 이름을 설정합니다.
        themes: {
            myCustomTheme: { // 새 테마를 정의합니다.
                colors: {
                    primary: '#0a3d91',
                    // ... 추가 커스텀 색상
                },
            },
        },
    },
})