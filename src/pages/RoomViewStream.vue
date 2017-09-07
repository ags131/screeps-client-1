<template>
  <div id="app">
    <table cellpadding="0" cellspacing="0" width="100%" height="100%">
      <tr><td id="room-main-td">
        <div id="room-main">
          <div id="room-name">
            <img class="logo" src="https://beta.screepspl.us/images/logo_small.png"><b style="padding-right:10px">BotArena</b> Tick: {{ tick }} - Room: {{ roomName }} - RCL: {{ level }} - Owned By: {{ owner }} 
            <!-- <router-link to="/map/stream?room=W5N5">map</router-link> -->
          </div>
          <div class="cont">
            <game :client="client"></game>
            <div class="rooms">
              <table>
                <tr>
                  <th colspan="3">Claimed Rooms</th>
                </tr>
                <tr>
                  <th>Room</th>
                  <th>RCL</th>
                  <th>Owner</th>
                </tr>
                <template v-for="room in owned">
                  <tr class="room" v-bind:class="{ active: roomName == room.name }">
                    <td>{{ room.name }}</td>
                    <td>{{ room.own.level }}</td>
                    <td>{{ room.user.username }}</td>
                  </tr>
                  <tr class="sign" v-if="room.sign">
                    <td colspan="3">{{ room.sign && room.sign.label }}</td>
                  </tr>
                </template>
              </table>
              <div style="display:none;font-size:32pt">We are experiencing some minor issues, tournament will resume shortly.</div>
            </div>
          </div>
        </div>
      </td></tr>
    </table>
  </div>

</template>

<script>

import SplitPane from '../components/SplitPane.vue';
import SplitPaneVertical from '../components/SplitPaneVertical.vue';
import Game from '../components/Game.vue';
import Console from '../components/Console.vue';
import RoomMap from '../components/RoomMapStream.vue';
import CodePane from '../components/CodePane.vue';
import eventBus from '../global-events';

const RESTART_AFTER = Date.now() + (5 * 50 * 1000)

export default {
  props: ['roomName'],
  data() {
    return {
      owner: '',
      sign: '',
      level: 0,
      owned: [],
      ownedIndex: 0,
      tick: 0
    };
  },

  created() {
    this.setClientRoom();
    eventBus.$emit('resize');

    this.interval = setInterval(() => this.fetchRooms(), 10*1000)
    setTimeout(()=>this.fetchRooms(),1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },

  watch: {
    'client': function(client) {
      console.log('watch client');
      this.setClientRoom();
    },

    'roomName': function(roomName) {
      console.log('watch roomName');
      this.setClientRoom();
    },

    'nextRoom': function(roomName) {
      this.roomName = roomName
      this.setClientRoom();
    }
  },

  computed: {
    api() {
      return eventBus.api;
    },
    client() {
      return eventBus.client;
    },
    controller() {
      let controller = this.client && this.client.controller || { sign: { text: '' }}
      console.log('com',controller,this.client)
      return controller
    },
    money() {
      return this.client && this.client.money || 0;
    },
    cpu() {
      return this.client && this.client.cpuMemory? this.client.cpuMemory.cpu : 0;
    },
    memory() {
      return this.client && this.client.cpuMemory? this.client.cpuMemory.memory : 0;
    },
    // roomName() {
    //   if (this.)
    //   return this.client && this.client.roomName || "";
    // },
    shards() {
      return this.client && this.client.shards || {};
    },

    rooms() {
      return this.client && this.client.rooms || [];
    }
  },

  methods: {
    navigateToRoom(roomName) {
      this.$router.replace({name: 'room', params: {roomName}});
    },

    setClientRoom() {
      if (this.client) {
        if (this.roomName === "" && this.client.rooms) {
          this.navigateToRoom(this.client.rooms[0]);
        }
        this.client.setRoom(this.roomName);
      }
    },

    onResize() {
      eventBus.$emit('resize');
    },

    fetchRooms() {
      if (Date.now() > RESTART_AFTER && this.ownedIndex && (this.ownedIndex+1)% this.owned.length === 0) {
        location.reload()
        return
      }
      eventBus.api.getToken()
        .then(()=>{
          eventBus.api.time().then(res=>{
		this.tick = res.time - 3295048
	  })
          let rooms = []
          let statName = 'owner0'
          for (let x = 0;x<=11;x++) {
            for (let y = 0;y<=11;y++) {
              rooms.push(`W${x}N${y}`)
              // rooms.push(`E${x}S${y}`)
              // rooms.push(`E1${x}S${y}`)
              // rooms.push(`E2${x}S${y}`)
              // rooms.push(`E${x}S1${y}`)
              // rooms.push(`E1${x}S1${y}`)
              // rooms.push(`E2${x}S1${y}`)
            }
          }
          return eventBus.api.req('POST','/api/game/map-stats',{ rooms, statName })
        }).then(({ data }) => {
          console.log('MAP',data)
          this.owned = [];
          for(let name in data.stats){
            let room = data.stats[name]
            if(room.own && room.own.level){
              room.name = name
              room.user = data.users[room.own.user]
              if(room.sign) {
                room.sign.label = room.sign && (room.sign.text + ' -' + data.users[room.sign.user].username) || ''
              }
              this.owned.push(room)
            }
          }
          this.owned.sort((a, b) => {
            return a.user.username.toLowerCase() > b.user.username.toLowerCase()?1:-1
          })
          // let rand = this.owned[Math.floor(this.owned.length * Math.random())]
          let next = this.owned[this.ownedIndex++ % this.owned.length]
          if (next) {
            this.roomName = next.name
            this.owner = next.user.username
            this.level = next.own.level
            this.sign = next.sign && next.sign.label
            this.setClientRoom();
          }
        })
    }
  },

  components: { 
    Game,
    Console,
    SplitPane,
    SplitPaneVertical,
    RoomMap,
    CodePane,
  },
}
</script>

<style>
html, body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
  position: relative;
}

#app {
  flex-direction: column;
  /*display: flex;*/
  margin: 0;
  padding: 0;
  min-height: 100%;
  height: 100%;
}

#app > table {
  height: 100%;
}

#topbar {
  /*height: 20px;*/
}

#room-main-td {
  position: relative;
  height: 100%;
}

#room-main {
  flex: 1;
}

#room-name {
  color:  white;
  background: black;
  font-size: 20pt;
}

#roomMaps {
  flex-direction: row;
  display: flex;
  height: calc(150px + 1em + 4px + 1em); /* scrollbar */
  background: black;
  overflow-y: hidden;
  overflow-x: scroll;
}

.rooms {
  flex: 1 100px;
  color:  white;
  background-color: black;
}
.cont {
  display: flex;
}
.cont > * {
  flex: 1;
}
.rooms table {
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 20pt;
  width: 100%;
}

.rooms td, 
.rooms th {
  padding: 1px 8px;
  text-align: left;
}

.rooms .room td, 
.rooms .room tr {
  border-top: 1px solid white;
}

.rooms .sign {
  font-size: 16pt;
}
.room.active {
  background-color: white;
  color: black;
}
.logo {
  width: 92px;
  height: 42px;
}
</style>
