# vue-project/Dockerfile

# 1단계: build
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# 2단계: Nginx로 서빙
FROM nginx:stable-alpine

# Nginx 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 nginx가 서비스하는 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
