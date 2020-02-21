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
        console.log(topHeight,bottomHeight, gap)

        this.barrierTop.setHeight(topHeight)
        this.barrierBottom.setHeight(bottomHeight)
    }

    this.getAxisX = () => parseInt(this.element.style.left.split('px')[0])
    this.setAxisX = axisX => this.element.style.left = `${axisX}px`
    this.getWidth = () => this.element.clientWidth

    this.raffleGap()
    this.setAxisX(axisX)
}

const b = new PairOfBarriers (700, 200, 200)
document.querySelector('[wm-flappy]').appendChild(b.element)