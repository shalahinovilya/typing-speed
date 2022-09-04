import {text, excludedButtons} from "./constants.js";

const testPanel = document.querySelector('.main__test-panel'),
    textBlock = document.querySelector('.test-panel__text-block'),
    startTestBlock = document.querySelector('.start-test'),
    startBtn = startTestBlock.querySelector('.start-test__start-btn'),
    restartBtn = document.querySelector('.restart__btn'),
    timerResult = document.querySelector('.timer__result'),
    speedResult = document.querySelector('.typing-speed__result'),
    accuracyResult = document.querySelector('.accuracy__result'),
    resultBlock = document.querySelector('.main__result'),
    resultContent = resultBlock.querySelector('.result__content'),
    changeResBtn = resultBlock.querySelector('.result__improve-result-btn button')


const initTest = () => {

    let currIndex = 0,
        time = 0,
        totalPercents = 100,
        percent = 100,
        isMistake = false,
        selectedText

    timerResult.textContent = time
    accuracyResult.textContent = totalPercents
    speedResult.textContent = '0'

    startTestBlock.style.zIndex = '99'
    startTestBlock.style.opacity = '1'
    testPanel.style.opacity = '0.6'
    resultBlock.style.opacity = '0'
    resultBlock.style.zIndex = '-99'

    createText()

    percent = 100 / selectedText.length

    startBtn.addEventListener('click', testStarted)

    function createText () {
        selectedText = getRandomText().split('')
        textBlock.innerHTML = `${selectedText.map((el, index) => `<span id=${index}>${el}</span>`).join('')}`
    }

    function getRandomText () {
        const val = Math.floor(Math.random() * text.length)
        return text[val]
    }

    function testStarted (e) {

        e.target.blur()

        startTestBlock.style.zIndex = '-99'
        startTestBlock.style.opacity = '0'
        testPanel.style.opacity = '1'

        document.getElementById(`${currIndex}`).className = 'current-text'

        const intervalId = setInterval(timerHandler, 1000)

        function timerHandler () {
            time++
            timerResult.textContent = time
            if (currIndex === 0) return;
            if (time >= 600) restartBtnHandler()
            speedResult.textContent = `${Math.ceil((currIndex * 60) / time)}`
        }

        function keyDownHandler (e) {

            if (excludedButtons[e.keyCode]) return;

            if (e.key === selectedText[currIndex]) {
                document.getElementById( `${currIndex}`).className = 'passed-text'
                currIndex++

                if (currIndex >= selectedText.length) {
                    showResult()
                    return;
                }
                document.getElementById(`${currIndex}`).className = 'current-text'
                isMistake = false
            }

            else {
                if (!isMistake) {
                    totalPercents = (totalPercents -  percent).toFixed(1)

                    if (totalPercents < 0) totalPercents = 0
                    accuracyResult.textContent = totalPercents
                    isMistake = true
                }
                document.getElementById(`${currIndex}`).className = 'wrong-text'
            }
        }

        function restartBtnHandler () {

            clearInterval(intervalId)
            startBtn.removeEventListener('click', testStarted)
            window.removeEventListener('keydown', keyDownHandler)
            restartBtn.removeEventListener('click', restartBtnHandler)
            changeResBtn.removeEventListener('click', restartBtnHandler)

            textBlock.querySelectorAll('span').forEach(el => el.className = '')
            initTest()
        }

        function showResult () {

            clearInterval(intervalId)
            resultContent.innerHTML = `Your text typing speed is <strong>${speedResult.textContent}</strong> characters
                             per minute with <strong>${totalPercents}%</strong> accuracy.`


            testPanel.style.opacity = '0.6'
            resultBlock.style.zIndex = '99'
            resultBlock.style.opacity = '1'

            changeResBtn.addEventListener('click', restartBtnHandler)
        }

        window.addEventListener('keydown', keyDownHandler)
        restartBtn.addEventListener('click', restartBtnHandler)

    }
}


initTest()

