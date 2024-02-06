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
          style="margin-bottom: 0.5rem"
          class="game-mode">
          <label
            class=""
            style="margin-left: 0.5rem"
            for=""
            >Number Type:</label
          >
          <Toggle
            v-model="codeType"
            on-label="Hex"
            off-label="Dec"
            @change="newGame" />
        </div>
        <div
          id=""
          class="game-mode">
          <label
            style="margin-left: 0.5rem"
            for=""
            >Game Mode:</label
          >
          <Toggle
            v-model="mode"
            on-label="Normal"
            off-label="Easy"
            @change="newGame"
            class="mode" />
        </div>
        <div
          id="guess"
          class="container">
          <p class="guess-val">{{ guess }}</p>
          <p
            @click="handelClear"
            class="clear">
            x
          </p>
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
            :disabled="!codeType"
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
            :disabled="!codeType"
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
            :disabled="!codeType"
            @click="addToGuess"
            value="C">
            C
          </button>
          <button
            :disabled="!codeType"
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
            :disabled="!codeType"
            @click="addToGuess"
            value="E">
            E
          </button>
          <button
            :disabled="!codeType"
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
            <span class="guess-attempt">Guess</span
            ><span class="guess-code">Code</span
            ><span class="guess-correct">Correct</span>
          </h4>
          <TransitionGroup name="slide-fade">
            <p
              class="container"
              v-for="guess in sortedGuesses"
              :key="guess.attempt">
              <span class="guess-attempt">{{ guess.attempt }}</span>
              <span class="guess-code">{{ guess.code }}</span>
              <span
                class="guess-correct"
                v-if="mode"
                :class="{
                  fail: guess.corect == 0,
                  something: guess.corect == 1,
                  better: guess.corect == 2,
                  almost: guess.corect == 3,
                }">
                {{ guess.corect }}</span
              >
              <span
                class="boxes guess-correct"
                v-else>
                <div
                  class="box"
                  :class="{ corect: guess.digit1 }"></div>
                <div
                  class="box"
                  :class="{ corect: guess.digit2 }"></div>
                <div
                  class="box"
                  :class="{ corect: guess.digit3 }"></div>
                <div
                  class="box"
                  :class="{ corect: guess.digit4 }"></div>
              </span>
            </p>
          </TransitionGroup>
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
  const codeType = ref(false),
    mode = ref(true),
    guess = ref(''),
    code = ref(''),
    guesses = ref([]),
    sortedGuesses = computed(() => {
      return guesses.value.sort((a, b) => b.attempt - a.attempt)
    }),
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
        const correctDigits = guess.value
          .split('')
          .map((digit, index) => digit === code.value[index])

        const guessObject = {
          attempt,
          code: guess.value,
        }

        if (mode.value === false) {
          // Include correctDigits only when mode.value is false
          guessObject.digit1 = correctDigits[0]
          guessObject.digit2 = correctDigits[1]
          guessObject.digit3 = correctDigits[2]
          guessObject.digit4 = correctDigits[3]
        } else {
          // Include correct count when mode.value is true
          guessObject.corect = correctDigits.filter(digit => digit).length
        }

        guesses.value.push(guessObject)

        guess.value = ''

        if (correctDigits.every(digit => digit)) {
          // If all digits are correct, set winner to true
          winner.value = true
        }
      }
    },
    handelDelete = () => {
      guess.value = guess.value.slice(0, -1)
    },
    handelClear = () => {
      guess.value = ''
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
      if (e.key === 'Escape') {
        handelClear()
        return
      }
      if (guess.value.length < 4) {
        if (/^[A-Fa-f]$/.test(e.key) & codeType.value) {
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
      code.value = geneNumber(codeType.value)
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
  // * {

  // }
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
          padding-bottom: 0;
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
          .game-mode {
            display: flex;
            align-items: center;
            justify-content: center;
            --toggle-border-off: rgb(255 255 255);
            // --toggle-bg-off: rgb(55 65 81);
            --toggle-bg-off: rgb(255 255 255);
            // --toggle-text-off: rgb(255 255 255);
            --toggle-text-off: rgb(55 65 81);

            --toggle-bg-on: rgb(55 65 81);
            --toggle-border-on: rgb(255 255 255);
            --toggle-text-on: rgb(255 255 255);

            --toggle-width: 5rem;
            --toggle-height: 1.5rem;

            .toggle-off {
              --toggle-handle-enabled: rgb(55 65 81);

              font-weight: bolder;
            }
            .toggle-container {
              // border: red solid 1px;
              width: 25%;
              margin: auto;
              display: flex;
              align-items: center;
              justify-content: center;
              // --toggle-width: 5rem;
            }
            label {
              width: 30%;
              line-height: 1;
              font-weight: 500;
              font-size: 0.875rem;
              text-align: end;
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
              &.guess-val {
                // border: red solid 1px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
              }
              &.clear {
                height: 2rem;
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
                margin-left: auto;
                border-left: $darkBlue solid 1px;
              }
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
            .guess-attempt {
              height: 1.5rem;
              width: 25%;
            }
            .guess-code {
              height: 1.5rem;
              width: 50%;
            }
            .guess-correct {
              height: 1.5rem;

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
              &.boxes {
                // gap: 2px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                .box {
                  border-radius: 0.15rem;
                  background-color: #ff5714;
                  &.corect {
                    background-color: #6eeb83;
                  }
                  height: 1rem;
                  aspect-ratio: 1;
                }
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
