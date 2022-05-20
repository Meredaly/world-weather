<template>
  <div class="weather-card__column">
    <div class="weather-card__box">
      <h2 class="weather-card__location">{{ weather.region }}</h2>
      <p class="weather-card__location-region">{{ weather.country }}</p>
      <div class="weather-card__info">
        <p>Weather</p>
        <p>{{ weather.weather }}</p>
      </div>
      <div class="weather-card__info">
        <p>Temperature</p>
        <p>{{ weather.temperature }} °C</p>
      </div>
      <div class="weather-card__info">
        <p>Humidity</p>
        <p>{{ weather.humidity }} %</p>
      </div>
      <div class="weather-card__time">{{ fromNow }}</div>
      <div class="weather-card__controllers">
        <button @click="$emit('remove')" v-if="!removeDisable" class="weather-card__remove-button">REMOVE</button>
        <button @click="$emit('reload')" class="weather-card__reload-button">RELOAD</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, defineProps, onBeforeUnmount } from 'vue'
  import moment from 'moment'
  const props = defineProps({
    removeDisable: {
      type: Boolean,
      default: false
    },
    weather: {
      type: Object
    }
  })
  const fromNow = ref()
  const timeout = ref()
  timeout.value = setInterval(() => {
    fromNow.value = moment(props.weather?.elapcied_time, 'YYYYMMDD').fromNow() || ''
  }, 100)
  onBeforeUnmount(() => {
    clearInterval(timeout.value)
  })
</script>

<style lang="scss" scoped></style>
