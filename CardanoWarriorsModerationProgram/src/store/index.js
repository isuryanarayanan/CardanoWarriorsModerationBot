import Vuex from "vuex";

const store = new Vuex.Store({
  state: {
    tickets: [],
  },
  getters: {
    getTickets: (state) => {
      return state.tickets;
    },
  },
  mutations: {
    set_tickets: function (state, arg) {
      state.tickets= arg;
    },
  },
  actions: {
    GET_TICKETS: function ({ getters, dispatch, commit }) {
      let xhr = new XMLHttpRequest();
      let promise = new Promise((resolve, reject) => {
				xhr.open("GET", "https://bx8slrgohi.execute-api.us-east-1.amazonaws.com/");
        xhr.setRequestHeader("Content-Type", "Application/json");

        xhr.onload = () => {
          resolve(xhr);
        };

        xhr.onerror = () => {
          reject(xhr);
        };
        xhr.send();
      });
      promise.then((e) => {
				commit("set_tickets", JSON.parse(e.response));
      });
      return promise;
    },
  },
});

export default store;
