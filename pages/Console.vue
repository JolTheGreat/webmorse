<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Console",
  data() {
    return {
      id: "",
      sendTo: "",
      receiveFrom: "",
      isPlaying: false,
      socket: null
    }
  },
  mounted() {
    const transmit = document.getElementById("transmit");
    transmit.addEventListener("touchstart", this.transmitStart);
    transmit.addEventListener("touchend", this.transmitEnd);

    const id = Math.random().toString(36).slice(-7);
    this.socket = new WebSocket("wss://webmorse-6d47f4272e41.herokuapp.com/" + id);
    this.id = id;
    this.socket.onopen = () => {
      console.log("Connected to server");
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let oscillator = audioContext.createOscillator();
      let gainNode = audioContext.createGain();

      oscillator.type = 'triangle'; // You can change this to 'square', 'sawtooth', 'triangle' for different beep sounds
      oscillator.frequency.setValueAtTime(430, audioContext.currentTime); // Frequency in Hz (A4 note)
      gainNode.gain.setValueAtTime(0.6, audioContext.currentTime); // Start with no sound

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (data.sender === this.receiveFrom) {
        //if oscillator is already playing, wait for it to stop. When finished, play instantly

        if (this.isPlaying) {
          //recheck every 25 ms
          const interval = setInterval(() => {
            if (!this.isPlaying) {
              oscillator.start();
              this.isPlaying = true;
              setTimeout(() => {
                oscillator.stop();
                this.isPlaying = false;
              }, data.duration);
              clearInterval(interval);
            }
          }, 250);
        } else {
          oscillator.start();
          this.isPlaying = true;
          setTimeout(() => {
            oscillator.stop();
            this.isPlaying = false;
          }, data.duration);
        }

      }
    }
  },
  methods: {
    settings() {
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let oscillator = audioContext.createOscillator();
      let gainNode = audioContext.createGain();

      oscillator.type = 'triangle'; // You can change this to 'square', 'sawtooth', 'triangle' for different beep sounds
      oscillator.frequency.setValueAtTime(435, audioContext.currentTime); // Frequency in Hz (A4 note)
      gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start with no sound

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      let startTime;
      window.addEventListener("keydown", (e) => {
        if (e.key === " " && !this.isPlaying) {
          startTime = new Date().getTime();
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set gain to play sound
          this.isPlaying = true;

        }
      });

      window.addEventListener("keyup", (e) => {
        if (e.key === " " && this.isPlaying) {
          gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Set gain to 0 to stop sound
          this.isPlaying = false;
          const data = {
            sendTo: this.sendTo,
            duration: new Date().getTime() - startTime
          }
          this.socket.send(JSON.stringify(data));
        }
      });
    },
    transmitStart() {
      const event = new KeyboardEvent("keydown", {
        key: " "
      });
      window.dispatchEvent(event);
    },

    transmitEnd() {
      const event = new KeyboardEvent("keyup", {
        key: " "
      });
      window.dispatchEvent(event);
    }
  }
})
</script>

<template>
  <div id="app">
    <h1>モールス信号通信機</h1>
    <h2>Id: {{ id }}</h2>
    <div id="settings">
      <input type="text" placeholder="発信チャンネル(コンマで複数可)" v-model="sendTo">
      <input type="text" placeholder="受信チャンネル" v-model="receiveFrom">
      <button @click="settings" @keydown.prevent>設定する</button>
    </div>

    <p>設定をしてからスペースキーまたはボタンで発信</p>
    <button @mousedown="transmitStart"  @mouseup="transmitEnd" id="transmit">発信</button>
    <div>
      <img src="../assets/OIPen.jpeg" alt="morse-code">
      <img src="../assets/OIPjp.jpeg" alt="morse-code">
    </div>
  </div>
</template>

<style scoped>
#app {
  padding: 2rem;
}

#transmit {
  margin: 2rem 0;
  width: 20%;
  height: 20%;
  padding: 1rem;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

img {
  margin: 2rem 0;
}

</style>