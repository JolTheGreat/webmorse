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
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
        }, data.duration);
      }
    }
  },
  methods: {
    settings() {
      console.log("Settings")

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
    }
  }
})
</script>

<template>
  <h1>モールス信号通信機</h1>
  <h2>Id: {{id}}</h2>
  <div id="settings">
    <input type="text" placeholder="発信チャンネル(コンマで複数可)" v-model="sendTo">
    <input type="text" placeholder="受信チャンネル" v-model="receiveFrom">
    <button @click="settings" @keydown.prevent>設定する</button>
  </div>

  <img src="../assets/OIPen.jpeg" alt="morse-code">
  <img src="../assets/OIPjp.jpeg" alt="morse-code">




</template>

<style scoped>
img {
  margin: 2rem 0;
}

</style>