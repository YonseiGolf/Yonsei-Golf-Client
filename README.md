# vue3-yonsei-golf

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


```
yarn build
docker build -t yg-client:latest .
docker tag yg-client:latest birdiehyun/yg-client:latest
docker push birdiehyun/yg-client:latest
```