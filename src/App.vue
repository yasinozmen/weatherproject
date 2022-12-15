<template>
  <div class="main-container container-fluid text-center">
    <div
      v-if="backgroundImg"
      class="bg-image"
      :style="{
        backgroundImage: `url(${require(`./assets/images/${backgroundImg}`)})`,
      }"
    ></div>
    <div class="weather__container" ref="printcontent">
      <WeatherBox
        :weatherData="weather"
        :showSBox="show"
        @searchForCity="handleSearch"
        :bg="backgroundImg"
      />
      <WeatherForecastVue :forecastList="forecastList" />
    </div>
    <img
      src="https://cdn3.iconfinder.com/data/icons/essential-flat/100/Camera-512.png"
      @click="printThis"
      width="50"
      style="float: right; z-index: 999; position: sticky"
    />
  </div>
</template>

<script>
import "./assets/style.scss";
import { weatherApi } from "./api";
import { backgroundImage } from "./utils";
import WeatherBox from "./components/WeatherBox.vue";
import moment from "moment";
import tzlookup from "tz-lookup";
import WeatherForecastVue from "./components/WeatherForecast.vue";
import html2canvas from "html2canvas";

export default {
  name: "App",
  components: {
    WeatherBox,
    WeatherForecastVue,
  },
  data() {
    return {
      weather: [],
      lat: 40.852,
      lon: 29.878,
      code: "",
      backgroundImg: "",
      query: "",
      cityLocalTimeFormatted: "",
      timezoneLookup: "",
      forecastList: [],
      show: true,
    };
  },
  computed: {
    isDayTime() {
      const format = "HH:mm a";
      const time = moment(new Date(), format);
      const startTime = moment("07:00am", format);
      const endTime = moment("08:00pm", format);

      if (
        (startTime.hour() >= 12 && endTime.hour() <= 12) ||
        endTime.isBefore(startTime)
      ) {
        endTime.add(1, "days");

        if (time.hour() <= 12) {
          time.add(1, "days");
        }
      }
      const isBetween = time.isBetween(startTime, endTime);

      return isBetween;
    },
  },
  methods: {
    handleSearch(query) {
      this.query = query;
      this.fetchWeather();
      this.fetchForecast();
    },
    async printThis() {
      setTimeout(() => (this.show = false), 250);

      setTimeout(async () => {
        console.log("printing..");
        const el = this.$refs.printcontent;

        const options = {
          type: "dataURL",
          useCORS: true,
        };
        const printCanvas = await html2canvas(el, options);
        const link = document.createElement("a");
        link.setAttribute("download", this.weather.name + ".png");
        link.setAttribute(
          "href",
          printCanvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream")
        );
        link.click();

        console.log("done");
      }, 500);
      setTimeout(() => (this.show = true), 750);
    },
    getBackground() {
      const image = backgroundImage(this.code, this.isDayTime);
      image.then((img) => {
        this.backgroundImg = img;
      });
    },
    fetchData(url) {
      let parameters;
      var token = JSON.parse(localStorage.getItem("WeatherLastSearch"));
      if (this.query !== "") {
        parameters = {
          params: {
            q: this.query,
            units: "metric",
            cnt: 10,
          },
        };
      } else {
        if (token != "" && token != undefined && token != null) {
          parameters = {
            params: {
              lat: token.lat,
              lon: token.lon,
              units: "metric",
              cnt: 10,
            },
          };
        } else {
          parameters = {
            params: {
              lat: this.lat,
              lon: this.lon,
              units: "metric",
              cnt: 10,
            },
          };
        }
      }

      return weatherApi.get(url, parameters);
    },

    fetchWeather() {
      this.fetchData("/weather").then((res) => {
        this.weather = res.data;
        this.lat = res.data.coord.lat;
        this.lon = res.data.coord.lon;
        this.timezoneLookup = tzlookup(this.lat, this.lon);
        this.code = res.data.weather[0].id;
        this.getBackground();

        localStorage.setItem(
          "WeatherLastSearch",
          JSON.stringify(res.data.coord)
        );
      });
    },
    fetchForecast() {
      this.fetchData("/forecast")
        .then((res) => {
          this.forecastList = res.data.list;
          console.log(this.forecastList);
        })
        .catch((error) => {
          setTimeout(() => {
            console.log(error);
          }, 2000);
        });
    },
  },
  created() {
    this.fetchWeather();
    this.fetchForecast();
    this.query = "";
  },
};
</script>

<style lang="scss"></style>
