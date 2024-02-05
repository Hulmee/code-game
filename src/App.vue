<template>
  <div
    id="main"
    class="theme dark container">
    <div
      id="game-board"
      class="card">
      <div
        id=""
        class="section title">
        <h3>Cracking the Code</h3>
        <p>
          Try to guess the 4-digit code. You will be told how many digits are in
          the correct place after each attempt
        </p>
      </div>
      <div
        class="section"
        id="game-cons">
        <div
          id="game-mode"
          class="">
          <label
            style="margin-left: 0.5rem"
            for=""
            >Decimal</label
          >
          <Toggle
            v-model="mode"
            on-label="Hex"
            off-label="Dec"
            @change="newGame" />
          <label
            style="margin-right: 0.5rem"
            for=""
            >Hexadecimal</label
          >
        </div>
        <div
          id="guess"
          class="container">
          <p>{{ guess }}</p>
        </div>
        <div id="keypad">
          <button
            @click="addToGuess"
            value="1">
            1
          </button>
          <button
            @click="addToGuess"
            value="2">
            2
          </button>
          <button
            @click="addToGuess"
            value="3">
            3
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="A">
            A
          </button>
          <button
            @click="addToGuess"
            value="4">
            4
          </button>
          <button
            @click="addToGuess"
            value="5">
            5
          </button>
          <button
            @click="addToGuess"
            value="6">
            6
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="B">
            B
          </button>
          <button
            @click="addToGuess"
            value="7">
            7
          </button>
          <button
            @click="addToGuess"
            value="8">
            8
          </button>
          <button
            @click="addToGuess"
            value="9">
            9
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="C">
            C
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="D">
            D
          </button>
          <button
            @click="addToGuess"
            value="0">
            0
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="E">
            E
          </button>
          <button
            :disabled="!mode"
            @click="addToGuess"
            value="F">
            F
          </button>
        </div>
        <div id="actions">
          <button @click="handelDelete">Delete</button>
          <button
            :disabled="checkDisabled"
            @click="checkGuess">
            Check Guess
          </button>
          <button @click="newGame">New Game</button>
        </div>
        <!-- {{ code }} -->
      </div>
    </div>
    <Transition name="slide-fade">
      <div
        v-if="guesses.length"
        id="guesses"
        class="card">
        <div class="section title">
          <h3>Past Guesses</h3>
        </div>
        <div class="section guesses">
          <h4 class="container">
            <span class="">Guess</span><span>Code</span><span>Correct</span>
          </h4>
          <p
            class="container"
            v-for="guess in guesses"
            :key="guess.attempt">
            <span>{{ guess.attempt }}</span
            ><span>{{ guess.code }}</span
            ><span
              :class="{
                fail: guess.corect == 0,
                something: guess.corect == 1,
                better: guess.corect == 2,
                almost: guess.corect == 3,
              }">
              {{ guess.corect }}</span
            >
          </p>
        </div>
      </div>
    </Transition>
  </div>
  <Transition
    name="fade"
    mode="out-in">
    <div
      v-if="winner"
      class="modal">
      <div class="card">
        <div class="section">
          <h2>Congratulations!</h2>
          <p>You've cracked the code!</p>
          <button @click="newGame">New Game</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
  import Toggle from '@vueform/toggle'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  let attempt = 0
  const mode = ref(false),
    guess = ref(''),
    code = ref(''),
    guesses = ref([]),
    winner = ref(false),
    geneNumber = (isHexadecimal = true) => {
      // Generate a random number between 0 and 65535 (0xFFFF in hexadecimal)
      const maxNumber = isHexadecimal ? 65535 : 9999
      const randomNumber = Math.floor(Math.random() * (maxNumber + 1))
      if (isHexadecimal) {
        // Convert the random number to a 4-digit hexadecimal string
        return randomNumber.toString(16).toUpperCase().padStart(4, '0')
      } else {
        // Return the random number as a 4-digit decimal string
        return randomNumber.toString().padStart(4, '0')
      }
    },
    checkGuess = () => {
      if (guess.value.length) {
        attempt++
        // Logic to check the user's guess
        const corect = guess.value
          .split('')
          .filter((digit, index) => digit === code.value[index]).length
        guesses.value.push({ attempt, code: guess.value, corect })
        guess.value = ''
        if (corect === 4) {
          winner.value = true
        }
      }
    },
    handelDelete = () => {
      guess.value = guess.value.slice(0, -1)
    },
    addToGuess = e => {
      if (guess.value.length < 4) {
        guess.value += e.target.value
        // console.log(e)
      }
    },
    keypress = e => {
      if ((e.key === 'Enter') & !checkDisabled.value) {
        checkGuess()
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        handelDelete()
        return
      }
      if (guess.value.length < 4) {
        if (/^[A-Fa-f]$/.test(e.key) & mode.value) {
          guess.value += e.key.toUpperCase()
          return
        }
        if (e.key >= '0' && e.key <= '9') {
          guess.value += e.key
          return
        }
      }
    },
    newGame = () => {
      code.value = geneNumber(mode.value)
      guess.value = ''
      guesses.value = []
      winner.value = false
      attempt = 0
    },
    checkDisabled = computed(() => {
      return guess.value.length !== 4
    })

  onMounted(() => {
    newGame()
    document.addEventListener('keydown', keypress)
  })
  onUnmounted(() => {
    newGame()
    document.removeEventListener('keydown', keypress)
  })
</script>

<style lang="scss">
  $darkBlue: rgb(31 41 55);
  * {
    --toggle-bg-on: rgb(55 65 81);
    --toggle-bg-off: rgb(55 65 81);
    --toggle-border-on: rgb(255 255 255);
    --toggle-border-off: rgb(255 255 255);
    --toggle-text-on: rgb(255 255 255);
    --toggle-text-off: rgb(255 255 255);

    --toggle-width: 4rem;
    --toggle-height: 1.5rem;
  }
  #main {
    height: 100%;
    width: 100%;
    flex-wrap: wrap;
    overflow-y: auto;
    &::-webkit-scrollbar {
      height: 10px;
    }
    &::-webkit-scrollbar-track {
      box-shadow: $dark;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background: $light;
      border-radius: 10px;
    }
    .card {
      // width: 50%;
      width: 450px;
      // height: 100%;
      height: 650px;
      /* add to when cards are side by side
       max-height: 650px; */
      background-color: $darkBlue;
      border-radius: 0.5rem;
      border: 1px solid rgb(255 255 255);
      margin: 1rem;
      &#guesses {
        height: fit-content;
      }
      .section {
        // padding: 1.5rem;
        &.title {
          h3 {
            letter-spacing: -0.025rem;
            font-weight: 700;
            font-size: 1.5rem;
            line-height: 2rem;
            white-space: nowrap;
            margin: 0;
            text-align: center;
          }
          p {
            margin-top: calc(0.375rem * calc(1 - 0));
            margin-bottom: calc(0.375rem * calc(1 - 0));
            color: hsl(240 3.8% 46.1%);
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
        }
        &#game-cons {
          display: flex;
          flex-direction: column;
          #game-mode {
            display: flex;
            align-items: center;
            justify-content: space-between;
            label {
              line-height: 1;
              font-weight: 500;
              font-size: 0.875rem;
            }
          }
          #guess {
            // padding: 0.5rem;
            background-color: rgb(55 65 81);
            border-radius: 0.25rem;
            margin-top: 1rem;
            min-height: 2rem;
            p {
              color: rgb(255 255 255);
              text-align: center;

              // letter-spacing: -0.025rem;
            }
          }
          #keypad {
            display: grid;
            gap: 0.5rem;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            margin-top: 1rem;
          }
          #actions {
            display: grid;
            gap: 0.5rem;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            margin-top: 1rem;
          }
        }
        &.guesses {
          // add to when cards are side by side

          /* max-height: calc(650px - 80px);
           overflow: auto; */
          h4 {
            border-bottom: rgb(255, 255, 255) solid 1.5px;
          }
          p {
            border-bottom: rgb(255, 255, 255) dotted 0.5px;
          }
          .container {
            justify-content: space-between;
            text-align: center;
            margin: 0.25rem 0;
            :first-child {
              width: 25%;
            }
            :nth-child(2) {
              width: 75%;
            }
            :last-child {
              width: 25%;
              &.fail {
                color: #ff5714;
              }
              &.something {
                color: #e8aa14;
              }
              &.better {
                color: #e4ff1a;
              }
              &.almost {
                color: #6eeb83;
              }
            }
          }
        }
      }
    }
  }
  button {
    font-family: inherit;
    font-feature-settings: inherit;
    margin: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 2.5rem;
    white-space: nowrap;
    border-radius: calc(0.5rem - 2px);
    border: 1px solid rgb(255, 255, 255);
    padding: 0.5rem 1rem;
    line-height: 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(255, 255, 255);
    &:hover {
      background-color: rgb(55 65 81);
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.3;
    }
  }
  .modal {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $dark-trans;

    color: $light;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    transition: background-color 500ms ease-in-out, color 500ms;

    .card {
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
      // height: 75%;
      width: 450px;

      // width: 75%;
      background: #6eeb83;
      color: $dark;
      filter: drop-shadow(10px 10px 10px $light);
      border-radius: 1em;
      border: solid 1px $light;
      text-align: center;
      transition: background-color 500ms ease-in-out, color 500ms;
      button {
        margin-top: 1rem;
        background-color: $darkBlue;
      }
    }
    &.fade-enter-active {
      transition: all 0.3s ease-out;
    }

    &.fade-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    &.fade-enter-from,
    &.fade-leave-to {
      opacity: 0;
    }
  }
  .section {
    padding: 1.5rem;
    h2 {
      letter-spacing: -0.025rem;
      font-weight: 700;
      font-size: 1.5rem;
      line-height: 2rem;
      white-space: nowrap;
      margin: 0;
      text-align: center;
    }
    p {
      margin-top: calc(0.375rem * calc(1 - 0));
      margin-bottom: calc(0.375rem * calc(1 - 0));
      // color: hsl(240 3.8% 46.1%);
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
</style>
