<template>

  <div id="app">
    <table cellpadding="0" cellspacing="0" width="100%" height="100%">
      <tr><td id="room-main-td">
        <div id="room-main">
          <game :client="client"></game>
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
import RoomMap from '../components/RoomMap.vue';
import CodePane from '../components/CodePane.vue';
import eventBus from '../global-events';

export default {
  props: ['roomName'],
  data() {
    return {};
  },

  created() {
    this.setClientRoom();
  },

  watch: {
    'client': function(client) {
      console.log('watch client');
      this.setClientRoom();
    },

    'roomName': function(roomName) {
      console.log('watch roomName');
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
  /*flex: 1;*/
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

#roomMaps {
  flex-direction: row;
  display: flex;
  height: calc(150px + 1em + 4px + 1em); /* scrollbar */
  background: black;
  overflow-y: hidden;
  overflow-x: scroll;
}

</style>
