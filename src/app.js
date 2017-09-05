
import Vue from 'vue';
import App from './components/App.vue';
import Root from './pages/Root.vue';
import Login from './pages/Login.vue';
import Logout from './pages/Logout.vue';
import Register from './pages/Register.vue';
import RoomView from './pages/RoomView.vue';
import RoomViewStream from './pages/RoomViewStream.vue';
import MapView from './pages/MapView.vue';
import MapViewStream from './pages/MapViewStream.vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'root',
    path: '/',
    component: Root
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'logout',
    path: '/logout',
    component: Logout
  },
  {
    name: 'register',
    path: '/register',
    component: Register
  },
  {
    name: 'room',
    path: '/room/:roomName',
    component: RoomView,
    props: true
  },
  {
    name: 'room-stream',
    path: '/room/:roomName/stream',
    component: RoomViewStream,
    props: true
  },
  {
    name: 'map',
    path: '/map/',
    component: MapView,
    props: true
  },
  {
    name: 'map-steam',
    path: '/map/stream',
    component: MapViewStream,
    props: true
  },
  {
    name: 'map-shard',
    path: '/map/:shard',
    component: MapView,
    props: true
  },
]

const router = new VueRouter({
  routes
})

Vue.router = router;


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
