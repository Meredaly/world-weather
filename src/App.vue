<template>
  <div class="wrapper">
    <div class="container">
      <h1 class="main-name">World Weather</h1>
      <h3 class="second-name">Watch weather in your current location</h3>
      <div class="weather-card">
        <div class="weather-card__row">
          <WeatherCard
            v-for="(cardItem, index) in cardItems"
            :key="cardItem.id"
            :class="index === 0 && 'weather-card__column_main'"
            :weather="cardItem"
            :remove-disable="index === 0 && true"
            @remove="removeWeather(index)"
            @reload="reloadWeather(index)"
          />
        </div>
      </div>
      <button class="add-weather" @click="showPopUp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
  <div class="pop-up" v-if="popUpVisibility">
    <div class="pop-up__container">
      <div class="pop-up__box">
        <h2 class="pop-up__title">Choose a city</h2>
        <h3 class="pop-up__sub-title">To find city start typing and pick one from the suggestions</h3>
        <div class="pop-up__input input" :class="{ input_error: v$.$error }">
          <input v-model="popUpInput" type="text" placeholder="Search city" />
          <span>Choose a city</span>
        </div>
        <div class="pop-up__controllers">
          <div class="pop-up__controller pop-up__controller_clear">
            <button :disabled="!popUpInput" @click="popUpInput = ''">CLEAR</button>
          </div>
          <div class="pop-up__controller pop-up__controller_cancel">
            <button @click="cancelPopUp">CANCEL</button>
          </div>
          <div class="pop-up__controller pop-up__controller_add">
            <button type="submit" @click="addItem">ADD</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useVuelidate } from '@vuelidate/core'
  import { required } from '@vuelidate/validators'
  import WeatherCard from './components/WeatherCard.vue'
  import { getWeatherRes } from '@/api'
  import { ref, reactive, onMounted, computed } from 'vue'

  const popUpVisibility = ref(false)
  const popUpInput = ref('')
  const cardItems = reactive([])
  const rules = computed(() => ({
    popUpInput: {
      required
    }
  }))
  const v$ = useVuelidate(rules, { popUpInput })

  onMounted(() => {
    const currentLocation = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')
    const locationCountry = currentLocation[currentLocation.length - 1 > 0 ? currentLocation.length - 1 : 0]
    popUpInput.value = locationCountry
    addItem()
  })

  const cancelPopUp = () => {
    popUpVisibility.value = false
    popUpInput.value = ''
    v$.value.$reset()
  }
  const showPopUp = () => {
    v$.value.$reset()
    popUpVisibility.value = true
  }
  const addItem = async () => {
    v$.value.$touch()
    if (v$.value.$error) return
    popUpVisibility.value = false
    const weather = await getWeatherRes(popUpInput.value)
    cardItems.push({
      id: new Date().getTime(),
      region: weather.name,
      country: cardItems.length === 0 ? 'Your current location' : weather.sys.country,
      weather: weather.weather[0].main || '',
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      elapcied_time: new Date()
    })
    popUpInput.value = ''
  }
  const removeWeather = (index) => {
    cardItems.splice(index, 1)
  }

  const reloadWeather = async (index) => {
    const weather = await this.getWeatherRes(this.cardItems[index].region)
    cardItems[index] = {
      id: index,
      region: weather.name,
      country: index === 0 ? 'Your current location' : weather.sys.country,
      weather: weather.weather[0].main || '',
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      elapcied_time: new Date()
    }
  }
</script>
