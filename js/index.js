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

// const b = new Barrier(true)
// b.setHeight(300)
// document.querySelector('[wm-flappy]').appendChild(b.element)

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

// const b = new PairOfBarriers (700, 200, 200)
// document.querySelector('[wm-flappy]').appendChild(b.element)

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

            // crossedMiddle && notifyScore() 
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

    this.animateBird = () => {
        const newAxisY = this.getAxisY() + (flying ? 4 : -3)
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

const barriers = new Barriers (700, 1200, 200, 500)
const bird = new Bird (700)
const gameArea = document.querySelector('[wm-flappy]')

gameArea.appendChild(bird.element)
barriers.barriers.forEach( pair => gameArea.appendChild(pair.element))
setInterval(() => {
    barriers.animate()
    bird.animateBird()
}, 20)
