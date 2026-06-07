import { setup, createActor, fromPromise, assign } from "xstate";

const FURHATURI = "127.0.0.1:54321";

async function fhVoice(name: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encName = encodeURIComponent(name);
  return fetch(`http://${FURHATURI}/furhat/voice?name=${encName}`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function fhSay(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(text);
  return fetch(`http://${FURHATURI}/furhat/say?text=${encText}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function nodGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "nod",
      frames: [
        {
          time: [0.0], //ADD THE TIME FRAME OF YOUR LIKING
          persist: true,
          params: {
            //ADD PARAMETERS HERE IN ORDER TO CREATE A GESTURE
            NECK_PAN: 0,
            NECK_TILT: 20,
          },
        },
        {
          time: [0.5], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS
          params: {
            NECK_TILT: -10,
          },
        },
        {
          time: [1.0], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS}
          params: {
            NECK_TILT: 20,
          },
        },
        {
          time: [1.5], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS
          params: {
            NECK_TILT: 0,
            reset: true,
          },
        },
        //ADD MORE TIME FRAMES IF YOUR GESTURE REQUIRES THEM
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function eyeROLLGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(
    `http://${FURHATURI}/furhat/gesture`,
    {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        name: "eyeRoll",
        frames: [
          {
            time: [0.0], //ADD THE TIME FRAME OF YOUR LIKING
            params: {
              EYES_YAW: -30,
              EYES_PITCH: 20,
            },
          },
          {
            time: [0.8], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS
            params: {
              EYES_YAW: 30,
            },
          },
          {
            time: [1.5], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS
            params: {
              reset: true,
            },
          },
        ],
        class: "furhatos.gestures.Gesture",
      }),
    });
}

async function fhListen() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/listen`, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => response.body)
    .then((body) => body.getReader().read())
    .then((reader) => reader.value)
    .then((value) => JSON.parse(new TextDecoder().decode(value)).message);
}

// new gesture: shake head 
async function shakeHeadGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "shakeHead",
      frames: [
        {
          time: [0.0],
          params: {
            NECK_PAN: 0,
          },
        },
        {
          time: [0.25],
          params: {
            NECK_PAN: -15,
          },
        },
        {
          time: [0.75],
          params: {
            NECK_PAN: 15,
          },
        },
        {
          time: [1.25],
          params: {
            NECK_PAN: -10,
          },
        },
        {
          time: [1.75],
          params: {
            NECK_PAN: 0,
            reset: true,
          },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// New gesture: surprise one
async function surpriseGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "surprise",
      frames: [
        {
          time: [0.0],
          params: {
            BROW_UP_LEFT: 0.0,
            BROW_UP_RIGHT: 0.0,
            NECK_TILT: 0.0,
          },
        },
        {
          time: [0.4],
          params: {
            BROW_UP_LEFT: 1.0,
            BROW_UP_RIGHT: 1.0,
            NECK_TILT: -10.0,
          },
        },
        {
          time: [1.5],
          params: {
            BROW_UP_LEFT: 0.0,
            BROW_UP_RIGHT: 0.0,
            NECK_TILT: 0.0,
            reset: true,
          },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// track
async function fhAttend(user: string = "CLOSEST_USER") {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  // Supports different parameter naming conventions depending on the Remote API version
  return fetch(`http://${FURHATURI}/furhat/attend?user=${user}&user_id=${user}`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

// new gesture + audio
async function angryGestureWithSound() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");


  const visualPromise = fetch(`http://${FURHATURI}/furhat/gesture`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "angry",
      frames: [
        {
          time: [0.0],
          params: {
            BROW_DOWN_LEFT: 1.0,
            BROW_DOWN_RIGHT: 1.0,
            SMILE_CLOSED: -0.6,
            NECK_TILT: 10.0,
          },
        },
        {
          time: [2.5],
          params: {
            reset: true,
          },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });

  // play audio 
  const audioUrl = "https://raw.githubusercontent.com/web-platform-tests/wpt/master/webaudio/resources/sin_440Hz_-6dBFS_1s.wav";
  const audioPromise = fetch(`http://${FURHATURI}/furhat/say?url=${encodeURIComponent(audioUrl)}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });

  return Promise.all([visualPromise, audioPromise]);
}

const dmMachine = setup({
  actors: {
    fhVoice: fromPromise<any, null>(async () => {
      return fhVoice("Joanna");
    }),
    fhAttend: fromPromise<any, null>(async () => {
      return fhAttend("CLOSEST_USER");
    }),
    fhGreet: fromPromise<any, null>(async () => {
      return fhSay("Hello there! I am Furhat, and I am now tracking you to attend to your presence.");
    }),
    fhSurprise: fromPromise<any, null>(async () => {
      await surpriseGesture();
      return fhSay("Oh! Wow, look at that! I can also make a surprised expression by raising my eyebrows and tilting my head.");
    }),
    fhShakeHead: fromPromise<any, null>(async () => {
      await shakeHeadGesture();
      return fhSay("If you tell me something incorrect, I will shake my head like this.");
    }),
    fhEyeRoll: fromPromise<any, null>(async () => {
      await eyeROLLGesture();
      return fhSay("Oh, please... not this again.");
    }),
    fhAngerWithSound: fromPromise<any, null>(async () => {
      return angryGestureWithSound();
    }),
    fhGoodbye: fromPromise<any, null>(async () => {
      return fhSay("Well, that concludes our short demonstration dialogue. Goodbye!");
    }),
    fhAttendNobody: fromPromise<any, null>(async () => {
      return fhAttend("nobody");
    }),
  },
}).createMachine({
  id: "root",
  initial: "Start",
  states: {
    Start: {
      invoke: {
        src: "fhVoice",
        onDone: "StartTracking",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed to set voice (fhVoice). Is the Furhat SDK/robot running? Details:", event.error),
        },
      },
    },
    StartTracking: {
      invoke: {
        src: "fhAttend",
        onDone: "Greet",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed to start user tracking (fhAttend). Details:", event.error),
        },
      },
    },
    Greet: {
      invoke: {
        src: "fhGreet",
        onDone: "Surprise",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed greeting (fhGreet). Details:", event.error),
        },
      },
    },
    Surprise: {
      invoke: {
        src: "fhSurprise",
        onDone: "ShakeHead",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed surprise gesture (fhSurprise). Details:", event.error),
        },
      },
    },
    ShakeHead: {
      invoke: {
        src: "fhShakeHead",
        onDone: "EyeRoll",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed shake head gesture (fhShakeHead). Details:", event.error),
        },
      },
    },
    EyeRoll: {
      invoke: {
        src: "fhEyeRoll",
        onDone: "AngerWithSound",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed eye roll gesture (fhEyeRoll). Details:", event.error),
        },
      },
    },
    AngerWithSound: {
      invoke: {
        src: "fhAngerWithSound",
        onDone: "Goodbye",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed anger with sound gesture (fhAngerWithSound). Details:", event.error),
        },
      },
    },
    Goodbye: {
      invoke: {
        src: "fhGoodbye",
        onDone: "StopTracking",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed goodbye (fhGoodbye). Details:", event.error),
        },
      },
    },
    StopTracking: {
      invoke: {
        src: "fhAttendNobody",
        onDone: "DoneState",
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error("❌ Failed to stop tracking (fhAttendNobody). Details:", event.error),
        },
      },
    },
    DoneState: {
      type: "final",
    },
    Fail: {
      type: "final",
    },
  },
});

const actor = createActor(dmMachine).start();
console.log("Initial State:", actor.getSnapshot().value);

actor.subscribe((snapshot) => {
  console.log("Current State:", snapshot.value);
});

