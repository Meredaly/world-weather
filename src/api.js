import axios from 'axios'

export const getWeatherRes = async (location) => {
  try {
    const response = await axios.get(`${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_API_KEY}&q=${location}`)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
