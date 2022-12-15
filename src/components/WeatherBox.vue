<template>
  <div
    class="weather__box"
    :style="{
      backgroundImage: bg ? `url(${require(`../assets/images/${bg}`)})` : '',
    }"
  >
    <WeatherInputVue @searchForCity="searchForCity" v-show="showSBox" />

    <transition name="slide">
      <span>
        <div class="weather__city">
          <div>
            <img
              :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
              alt
            />
            <div class="city">
              {{ `${weatherData.name}, ${weatherData.sys.country}` }}
            </div>
          </div>
        </div>
        <div>
          <div class="weather">
            {{ weatherData.main.temp.toFixed(1) }}
            <span class="unit degree">&deg;C</span>
          </div>
        </div>
        <div>
          <div class="wind">
            {{ kmHour }}
            <span class="unit">km/h</span>
          </div>
        </div>
        <div class="text-temp">{{ weatherData.weather[0].description }}</div>
        <br />
        <div class="text-temp-white">
          {{ clothesSelect }} <br />
          {{ activitySelect }}
        </div>
      </span>
    </transition>
  </div>
</template>

<script>
import WeatherInputVue from "./WeatherInput.vue";

export default {
  name: "WeatherBox",
  props: ["weatherData", "bg", "showSBox"],
  components: { WeatherInputVue },
  methods: {
    searchForCity(query) {
      this.$emit("searchForCity", query);
    },
  },
  computed: {
    kmHour() {
      return (this.weatherData.wind.speed * 3.6).toFixed(2);
    },
    clothesSelect() {
      if (this.weatherData.main.temp.toFixed(1) < 0) {
        return "Soğuk bir gün montunu giymelisin.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 0 &&
        this.weatherData.main.temp.toFixed(1) < 10
      ) {
        return "Kazak giymelisin.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 10 &&
        this.weatherData.main.temp.toFixed(1) < 20
      ) {
        return "Yeleğini giyebilirsin.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 20 &&
        this.weatherData.main.temp.toFixed(1) < 40
      ) {
        return "Tişört giyebilirsin.";
      }
      return "Gölgede kalmalısın.";
    },
    activitySelect() {
      if (this.weatherData.main.temp.toFixed(1) < 0) {
        return "Kayak zamanı.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 0 &&
        this.weatherData.main.temp.toFixed(1) < 5
      ) {
        return "Kar topu oynayabilirsin.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 5 &&
        this.weatherData.main.temp.toFixed(1) < 15
      ) {
        return "Sinemaya gidilebilirsin.";
      } else if (
        this.weatherData.main.temp.toFixed(1) > 15 &&
        this.weatherData.main.temp.toFixed(1) < 35
      ) {
        return "Bisiklet sürme zamanı.";
      }
      return "Ağaçların altında oturabilirsin.";
    },
  },
};
</script>

<style lang="scss" scoped>
.city {
  margin: 5px 0;
}
.text-temp {
  margin-top: 5px;
}
.text-temp-white {
  margin-top: 5px;
  color: white;
}
</style>
