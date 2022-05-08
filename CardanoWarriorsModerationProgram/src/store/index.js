import Vuex from "vuex";

const store = new Vuex.Store({
  state: {
    tickets: [],
    current_ticket: null,
    current_ticket_tag: null,
    current_logs: null,
  },
  getters: {
    getTickets: (state) => {
      return state.tickets;
    },
    getCurrentTicket: (state) => {
      return [state.current_ticket_tag, state.current_ticket];
    },
    getLogs: (state) => {
      return state.current_logs;
    },
  },
  mutations: {
    set_tickets: function (state, arg) {
      state.tickets = arg;
    },
    set_logs: function (state, logs) {
      state.current_logs = logs;
    },
    set_current_ticket: function (state, ticket) {
      state.current_ticket = ticket;
      state.current_ticket_tag = ticket.ticket_tag;
    },
  },
  actions: {
    SET_CURRENT_TICKET: function ({ commit,dispatch }, ticket) {
      commit("set_current_ticket", ticket);
			dispatch("GET_TICKET", ticket.ticket_tag)
    },
    GET_TICKETS: function ({ getters, dispatch, commit }) {
      let xhr = new XMLHttpRequest();
      let promise = new Promise((resolve, reject) => {
        xhr.open(
          "GET",
          "https://bx8slrgohi.execute-api.us-east-1.amazonaws.com/"
        );
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
    GET_TICKET: function ({ getters, dispatch, commit }, id) {
      let xhr = new XMLHttpRequest();
      let promise = new Promise((resolve, reject) => {
        xhr.open(
          "GET",
          "https://bx8slrgohi.execute-api.us-east-1.amazonaws.com/logs/" + id
        );
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
				console.log(e.response)
        commit("set_logs", JSON.parse(e.response));
      });
      return promise;
    },
  },
});

export default store;
