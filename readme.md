# WEEK10
Week 10 - Vue Cil and connect with back-end

## Tutorial


### 1. Install Vue CLI

1. Run command เพื่อสร้าง Project Vue และ run project

```sh
npm install @vue/cli 

./node_modules/.bin/vue create myfrontend
```
เลือก `Default ([Vue 2] babel, eslint)` และกด Enter
```sh
Vue CLI v4.5.12
? Please pick a preset: (Use arrow keys)
❯ Default ([Vue 2] babel, eslint) 
  Default (Vue 3 Preview) ([Vue 3] babel, eslint) 
  Manually select features 

```
ไปที่ folder myfrontend เพื่อ ติดตั้ง Bulma และ Axios
```sh
cd myfrontend

npm install bulma axios

npm run serve
```

2. ไปที่ <http://localhost:8080> จะได้แบบนี้


    <img src="image/Screen Shot 2564-03-30 at 22.48.42.png" width="600" />

3. เพื่อความสะดวกในการเขียนโปรแกรม ติดตั้ง VS Code Extension: `Vetur` by Pine Wu
___

### 2. Install Vue-Router

1. ใน folder `myfrontend` พิมพ์คำสั่ง
```sh
npm install vue-router
```

2. สร้าง folder `router` ใน folder `src` และสร้างไฟล์ `index.js` ใน folder `router`


3. สร้าง folder ชื่อว่า `views` ใน folder `src` และสร้างไฟล์ `Home.vue` ใน folder `views`

```javascript
// folder และไฟล์ที่สร้างมาใหม่
src
 |__ router
 |     |__ index.js
 |__ views
       |__ Home.vue
```

4. ในไฟล์ `views/Home.vue` ใส่ code นี้ลงไป
```html
<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<script>
export default {
    data() {
      return {}
    }
  }
</script>

<style scoped>
</style>
```

5. copy code ไปลงใน `router/index.js` เพื่อเป็น config ของ router ใน project vue

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue') // set home as path '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
```

6. ที่ไฟล์ `main.js` ให้เพิ่มการเรียกใช้ router
```javascript
import router from './router/index'

// other code ...

new Vue({
  router,  // add router here
  render: h => h(App),
}).$mount('#app')

```

7. ไปที่ไฟล์ `App.vue` ให้ลบ code เก่าออก และใส่ code นี้เข้าไปแทน โดย tag `<router-view/>` จะเปลี่ยนไปตาม router ที่ตั้งไว้
```html
<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>
```

___
### 3. แปลง ejs ที่ทำในสัปดาห์ก่อน ๆ ให้เป็น Vue

เราจะนำ code ที่เราทำในสัปดาห์ก่อน ๆ มาใช้กับ project vue โดยหน้าที่นำมาใช้คือหน้า `index.ejs` ใน Week ที่ 9

1. ในไฟล์ `views/Home.vue` ให้ import axios เพื่อใช้งานการเรียก api ใน tag script
```javascript
<script>
import axios from "axios";
// other code
```

2. ใน `data()` ให้เพิ่มตัวแปร blogs เพิ่อใช้เก็บค่าผลลัพท์ที่ได้จาก api
```javascript
data() {
    return {
        blogs: null // add blogs variable
    };
  },
```

3. เพิ่ม code ดึง api ใน `create()` เพื่อให้ดึง api แบบอัตโนมัติเมื่อเข้ามาหน้านี้ และให้ลองดูใน console ว่าได้ data ออกมามั้ย
```javascript
created() {
    axios.get("http://localhost:3000/")
        .then((response) => {
          this.blogs = response.data;
          console.log(this.blogs)
        })
        .catch((err) => {
          console.log(err);
        });
}
```

4. หลังจากที่ได้ data เราก็จะ render ออกมา โดยให้ copy ส่วนที่**อยู่ใน** `<body>` จาก `index.ejs` โดยเอามาไว้ในส่วน `<template>` ในไฟล์ `Home.vue`
```html
<template>
  <div class="container is-widescreen">
    <!-- other code -->
  </div>
</template>
```

5. จะมี code จาก ejs บางบรรทัด เช่น code ที่ใช้ loop blog ก็ให้ลบออก และใช้ v-for ของ vue มาใช้แทนได้เลย ตัวอย่าง
```html
<% for (let blog of blogs) { %>
    <div class="column is-3">

<!-- change to  -->

<div v-for="blog in blogs" :key="blog.id">
```

> คำเตือนนนนน : เมื่อใช้ v-for ให้ใส่ :key ทุกครั้ง ตามในตัวอย่าง

6. สุดท้าย code ใน `<template>` หลังจากแปลงเป็น vue แล้วจะได้แบบนี้

```html
<template>
  <div class="container is-widescreen">
    <section class="hero">
      <div class="hero-body">
        <p class="title">My Stories</p>
      </div>
    </section>
    <section class="section" id="app">
      <div class="content">
        <div class="columns is-multiline">
          <div class="column is-3" v-for="blog in blogs" :key="blog.id">
            <div class="card">
              <div class="card-image pt-5">
                <figure class="image">
                  <img style="height: 120px" :src="blog.file_path" alt="Placeholder image" />
                </figure>
              </div>
              <div class="card-content">
                <div class="title">{{ blog.title }}</div>
                <div class="content">{{ blog.content }}</div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item">Read more...</a>
                <a class="card-footer-item">
                  <span class="icon-text">
                    <span class="icon">
                      <i class="far fa-heart"></i>
                    </span>
                    <span>Like</span>
                  </span>
                </a>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
```

7. หากของใครที่หน้าเว็บมัน render ออกมาไม่สวยงาม เพราะว่าเรายังไม่ได้เรียกใช้ bulma ให้ไปที่ไฟล์ `main.js` และเพิ่ม code นี้เข้าไป
```javascript
import 'bulma/css/bulma.css'
```

8. หากใครมีปัญหาเรื่อง icon ไม่แสดง ให้ copy script ดังกล่าวไปไว้ที่ `myfrontend/public/index.html`

```html
<script src="https://kit.fontawesome.com/466f7f0339.js" crossorigin="anonymous"></script>
```


___
### 4. Fix CORS Problems
1. ไปที่ folder `backend` and ติดตั้ง cors
```
npm install cors
```
2. ไปที่ index.js และเพิ่ม code
```javascript
var cors = require('cors')
```
**NOTE: แต่ว่าใน folder `backend` ที่เตรียมมาให้นี้ทำการติดตั้ง cors ไว้แล้ว สามารถสั่ง `npm install` ได้เลย**


___
## Exercise

1. เมื่อกดปุ่ม Like ของแต่ละ Blog ให้ยิง axios เพื่อไปเรียก api addlike และเพิ่มจำนวนยอดไลค์ของ Blog ที่กด

2. ให้แปลงหน้า Detail ที่มีอยู่แล้วให้เป็น version vue โดยให้เพิ่มเป็น path ตามนี้ `/detail/:id` โดย id ที่อยู่บน path คือเลขของ blog ที่ใส่เข้ามา จากนั้นเอา id ที่ใส่มาใช้ในการยิง api เพื่อ get ข้อมูลจาก backend





