function newElement (tagName, className) {
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function Barrier (reverse = false) {
    this.element = newElement('div', 'barrier')

    const barrierBorder = newElement('div', 'barrier-border')
    const barrierBody = newElement('div', 'barrier-body')
    this.element.appendChild(reverse ? barrierBody : barrierBorder)
    this.element.appendChild(reverse ? barrierBorder : barrierBody)

    this.setHeight = height => barrierBody.style.height = `${height}px`
}

function PairOfBarriers (heightDisplay, gap, axisX) {
    this.element = newElement ('div', 'pair-of-barriers')

    this.barrierTop = new Barrier (true)
    this.barrierBottom = new Barrier (false)

    this.element.appendChild(this.barrierTop.element)
    this.element.appendChild(this.barrierBottom.element)

    this.raffleGap = () => {
        const topHeight = Math.random() * (heightDisplay - gap)
        const bottomHeight = heightDisplay - gap - topHeight

        this.barrierTop.setHeight(topHeight)
        this.barrierBottom.setHeight(bottomHeight)
    }

    this.getAxisX = () => parseInt(this.element.style.left.split('px')[0])
    this.setAxisX = axisX => this.element.style.left = `${axisX}px`
    this.getWidth = () => this.element.clientWidth

    this.raffleGap()
    this.setAxisX(axisX)
}

function Barriers (heightDisplay, widthDisplay, gap, spaceBetween, notifyScore) {
    this.barriers = [
        new PairOfBarriers (heightDisplay, gap, widthDisplay),
        new PairOfBarriers (heightDisplay, gap, widthDisplay + spaceBetween),
        new PairOfBarriers (heightDisplay, gap, widthDisplay + spaceBetween * 2),
        new PairOfBarriers (heightDisplay, gap, widthDisplay + spaceBetween * 3),
    ]

    const displacement = 3

    this.animate = () => {
        this.barriers.forEach ( pair => {
            pair.setAxisX (pair.getAxisX() - displacement)

            if (pair.getAxisX() < -pair.getWidth()) {
                pair.setAxisX(pair.getAxisX() + spaceBetween * this.barriers.length)
                pair.raffleGap()
            }

            const middle = widthDisplay / 2
            const crossedMiddle = pair.getAxisX() + displacement >= middle
                && pair.getAxisX() < middle

            if (crossedMiddle) notifyScore()
        })
    }
}

function Bird (heightDisplay) {
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = 'img/passaro.png'

    this.getAxisY = () => parseInt(this.element.style.bottom.split('px')[0])
    this.setAxisY = axisY => this.element.style.bottom = `${axisY}px`

    window.onkeydown = e => flying = true 
    window.onkeyup = e => flying = false

    this.animate = () => {
        const newAxisY = this.getAxisY() + (flying ? 4 : -4)
        const maxHeightFlying = heightDisplay - this.element.clientHeight

        if (newAxisY <= 0) {
            this.setAxisY(0)
        }else if (newAxisY >= maxHeightFlying){
            this.setAxisY(maxHeightFlying)

        } else {
            this.setAxisY(newAxisY)
        }        
    }

    this.setAxisY(heightDisplay / 2)
}

function Progress () {    
    this.element = newElement ('span', 'game-progress')
    this.upDateScore = score => {
        this.element.innerHTML = score
    }
    
    this.upDateScore(0)
}

function overlap (elementA, elementB) {
    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top    
    return horizontal && vertical
}

function collision (bird, barriers) {
    let collided = false
    barriers.barriers.forEach (pair => {
        if (!collided) {
            const barrierTop = pair.barrierTop.element
            const barrierBottom = pair.barrierBottom.element 
            collided = overlap (bird.element, barrierTop)
                || overlap(bird.element, barrierBottom)
        }
    })
    return collided
}

function gameOverDisplay (gameArea) {
    const element = newElement ('p', 'game-over-display')

    element.innerHTML = 'GAME OVER'

    gameArea.appendChild(element)
}

function BoxInstructions () {
    this.element = newElement('div', 'instructions')
    this.button = newElement('button', 'instructions-button')
    this.paragraph = newElement('p', 'instructions-paragraph button-no-active')

    this.button.innerHTML = 'Instruções'
    this.paragraph.innerHTML = '- Pressione qualquer tecla para subir' + 
        '<br> <br>' + 
        '- Solte a tecla para descer' +
        '<br> <br>' +
        '- Conduza o Bird entre as barreira para pontuar' +
        '<br> <br>' +
        '- Atualize a página para iniciar um novo jogo'
    
    this.element.appendChild(this.button)
    this.element.appendChild(this.paragraph)

    this.button.addEventListener('click', () => {
        if (this.paragraph.classList.contains('button-no-active')) {
            this.paragraph.classList.remove('button-no-active')
            this.paragraph.classList.add('button-active')

        } else if (this.paragraph.classList.contains('button-active')) {
            this.paragraph.classList.remove('button-active')
            this.paragraph.classList.add('button-no-active')
        }

    })
}

function Game () {
    let score = 0   

    const content = document.querySelector('.content')
    const gameArea = document.querySelector('[wm-flappy]') 
    const heightDisplay = gameArea.clientHeight
    const widthDisplay = gameArea.clientWidth

    const boxInstruction = new BoxInstructions()
    const progress = new Progress()
    const barriers = new Barriers(heightDisplay, widthDisplay, 200, 500, 
        () => progress.upDateScore (++score))
    const bird = new Bird (heightDisplay)

    content.appendChild(boxInstruction.element)
    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.barriers.forEach( pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriers.animate()
            bird.animate()

            if (collision(bird, barriers)) {
                clearInterval(timer)

                gameOverDisplay(gameArea)
            }

        }, 20);
    }
}

new Game().start()

