export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
//export const UPDATE = "UPDATE";
export const LOGOUT = "LOGOUT";
export const LOAD_EVENT_TYPES = "LOAD_EVENT_TYPES";

export const initialState = {
  isUserLogged: false,
  loggedUser: {
    name: "",
    email: "",
  },
  eventTypes: [],
};

const auth = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case "SIGNUP":
      let { users } = state;
      let last = users.length;

      let lastElement = users[last - 1];

      let lastId = lastElement.userId;

      //console.log(lastId);

      return {
        loggedUser: 0,
        users: [
          ...state.users,
          {
            userId: lastId + 1,
            name: action.payload.name,
            contact: action.payload.contact,
            email: action.payload.email,
            username: action.payload.username,
            password: action.payload.password,
          },
        ],
      };

    case "LOGIN":
      console.log("Login initiated");
      return {
        isUserLogged: true,
        loggedUser: action.payload,
      };

    case "LOGOUT":
      console.log("Hey");
      return {
        loggedUser: { name: "", email: "" },
      };

    case "LOAD_EVENT_TYPES":
      console.log("Load events initiated: ", action.payload);
      return {
        ...state,
        eventTypes: action.payload,
      };
    default:
      return state;
  }
};

export default auth;
