
const canvas = document.querySelector('canvas');
var EatSFX = new Audio('EatSFX.mp3');
var DeathSFX = new Audio('DeathSFX.mp3');

canvas.width = 1000
canvas.height = 600;

const ctx = canvas.getContext('2d');

class Player{
    constructor(x,y, radius, color){
        //Size
        this.x = x
        this.y = y
        this.velY = 0,
        this.velX = 0,

        //Position
        this.radius = radius

        //Colour
        this.color = color
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'blue'
        ctx.fill()
    }

    update(direction){
        player.draw()
        if (direction == 'Left' && prevdirection != 'Right'){
            player.velX = 0
            player.velY = 0
            player.velX -= SPEED
            prevdirection = 'Left'
            if (player.x < 1){
                player.x = canvas.width
            }
        }
        else if (direction == 'Up' && prevdirection != 'Down'){
            player.velX = 0
            player.velY = 0
            player.velY -= SPEED
            prevdirection = 'Up'
            if (player.y < 1){
                player.y = canvas.height
            }
        }
        else if (direction == 'Right' && prevdirection != 'Left'){
            player.velX = 0
            player.velY = 0
            player.velX += SPEED
            prevdirection = 'Right'
            if (player.x > canvas.width + 1){
                player.x = 0
            }
        }
        else if (direction == 'Down' && prevdirection != 'Up'){
            player.velX = 0
            player.velY = 0
            player.velY += SPEED
            prevdirection = 'Down'
            if (player.y > canvas.height + 1){
                player.y = 0
            }
        }
        player.x += player.velX
        player.y += player.velY

    }
}

class Tail{
    constructor(x,y, radius, color){
        //Size
        this.x = x
        this.y = y

        //Position
        this.radius = radius

        //Colour
        this.color = color
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'blue'
        ctx.fill()
    }
}
class Particle{
    constructor(x,y, radius, color, velocity){
        //Size
        this.x = x
        this.y = y
  
        //Position
        this.radius = radius
  
        //Colour
        this.color = color
  
        //Velocity
        this.velocity = velocity
        
        //Alpha
        this.alpha = 1
    }
  
    draw(){
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }
  
    update(){
        this.draw()
        this.alpha -= 0.025
        if (this.radius > 0.01){
          this.radius -= 0.01
        }
        this.x = this.x + this.velocity.x * 5
        this.y = this.y + this.velocity.y * 5
    }
  }
  
class Food{
    constructor(x,y, radius, color){
        //Size
        this.x = x
        this.y = y

        //Position
        this.radius = radius

        //Colour
        this.color = color
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

const total_score = document.getElementById('total-score')
const x = canvas.width/2
const y = canvas.height/2
let SPEED
let direction
let prevdirection
let animationId
let dist
let score = 0
let scoretext

function animate(){
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    tailscopy = []
    tailscopy = tails
    for (let i = tails.length - 1; i >= 0; i--){
        if (i == 0){
            tails[i].x = player.x
            tails[i].y = player.y
        }
        else{
            if ( tailscopy[i - 1].x > tails[i].x){
                tails[i].x =  tailscopy[i - 1].x
                tails[i].y = tailscopy[i - 1].y
            }
            else if ( tailscopy[i - 1].x < tails[i].x){
                tails[i].x =  tailscopy[i - 1].x
                tails[i].y =tailscopy[i - 1].y
            }
            else if (tailscopy[i - 1].y > tails[i].y){
                tails[i].x =  tailscopy[i - 1].x 
                tails[i].y = tailscopy[i - 1].y
            }
            else if (tailscopy[i - 1].y < tails[i].y){
                tails[i].x =  tailscopy[i - 1].x
                tails[i].y = tailscopy[i - 1].y
            }
        }
    }
    tails.forEach((tail, tailidx)=>{
        if (tailidx != 0){
            tail.draw()
            dist = Math.hypot(player.x - tail.x, player.y - tail.y)
            //Dist - tail.radius - player.radius will always = -20 on death, but kept as -16 just for debugging and insurance
            if (dist - tail.radius - player.radius < -16) {
                DeathSFX.play();
                cancelAnimationFrame(animationId)
                scoreboard.className = 'gameover'
                scoreboard.style.marginLeft = String(canvas.width/2.5) + 'px';
                scoreboard.style.marginTop = String(canvas.height/2.5) + 'px';
                scoretext.innerHTML = "GAME OVER  <br/> Score: " + score + "<br/><button class = 'playagain' onClick = reset()>Play Again?</button>"
                total_score.innerHTML = ''
            }
        }
    })
    player.update(direction)
    particles.forEach((particle, particleidx) =>{
        if (particle.alpha - 0.025 <= 0 || particle.radius - 0.01 <= 0){
          particles.splice(particleidx, 1)
        }
        particle.update()
      })
    dist = Math.hypot(player.x - food.x, player.y - food.y)
    if (dist - food.radius - player.radius < 1) {
        for (let i = 0; i < 8; i++){
            particles.push(new Particle(
              food.x,
              food.y,
              Math.random() * 3,
              food.color,
              {x:Math.random() - 0.5,
              y:Math.random() - 0.5,}

            ))
        }
        score += 1
        EatSFX.play();
        total_score.innerHTML = score
        for (let i = 0; i < 10; i++){
            if (tails.length < 10){
                if (direction == 'Left'){
                    tailx = tails[tails.length-1].x + i
                    taily = tails[tails.length-1].y
                }
                else if (direction == 'Up'){
                    tailx = tails[tails.length-1].x
                    taily = tails[tails.length-1].y + i
                }
                else if (direction == 'Right'){
                    tailx = tails[tails.length-1].x - i
                    taily = tails[tails.length-1].y
                }
                else if (direction == 'Down'){
                    tailx = tails[tails.length-1].x
                    taily = tails[tails.length-1].y - i
                }
            }
            else{
                if (tails[tails.length-1].x > tails[tails.length-2].x){
                    tailx = tails[tails.length-1].x + i
                    taily = tails[tails.length-1].y
                }
                else if (tails[tails.length-1].y > tails[tails.length-2].y){
                    tailx = tails[tails.length-1].x
                    taily = tails[tails.length-1].y + i
                }
                else if (tails[tails.length-1].x < tails[tails.length-2].x){
                    tailx = tails[tails.length-1].x - i
                    taily = tails[tails.length-1].y
                }
                else if (tails[tails.length-1].y < tails[tails.length-2].y){
                    tailx = tails[tails.length-1].x
                    taily = tails[tails.length-1].y - i
                }
            }
            tails.push(new Tail(
                tailx,
                taily,
                player.radius,
                player.color
            ))
        }
        foodcreator()
        }
    food.draw()

}

function foodcreator(){
    food.x = Math.floor(Math.random() * ((canvas.width - food.radius * 3) - food.radius * 3 + 1)) + food.radius * 3;
    food.y = Math.floor(Math.random() * ((canvas.height - food.radius * 3) - food.radius * 3 + 1)) + food.radius * 3;
    tailsfood = []
    tails.forEach(tail =>{
        tailsfood.push({x: tail.x, y: tail.y})
    })
    newtailsfood = {x: food.x, y: food.y}
    tailsfood.forEach(tail =>{
        if (newtailsfood.x == tail.x - food.radius * 3 || newtailsfood.x == tail.x + food.radius * 3 || newtailsfood.y == tail.y - food.radius * 3 || newtailsfood.y == tail.y + food.radius * 3) 
        {
            console.log('food relocated')
            foodcreator()
        }
    })
}

document.body.addEventListener("keydown", function(e) {
    e.preventDefault()
    // 37 = left
    if (e.keyCode == 37|| e.keyCode == 65){
        if (direction != 'Right'){
            direction = 'Left'
        }
    }
    // 38 = up
    if (e.keyCode == 38 || e.keyCode == 87){
        if (direction != 'Down'){
            direction = 'Up'
        }
    }
    // 39 = right
    if (e.keyCode == 39|| e.keyCode == 68){
        if (direction != 'Left'){
            direction = 'Right'
        }
    }
    // 40 = down
    if (e.keyCode == 40|| e.keyCode == 83){
        if (direction != 'Up'){
            direction = 'Down'
        }
    }
  });

function reset(){
    cancelAnimationFrame(animationId)
    direction = 'Down'
    prevdirection = 'Down'
    scoreboard = document.getElementById('score')
    scoreboard.className = 'score'
    scoreboard.style.marginLeft = '10px';
    scoreboard.style.marginTop = '10px';
    scoretext = document.getElementById('score-text')
    scoretext.innerHTML = 'Score: ' 
    SPEED = 5
    score = 0
    total_score.innerHTML = score
    player = new Player(x,y, 10, 'green')
    tails = []
    particles = []
    tails.push(new Tail(
        player.x,
        player.y,
        player.radius,
        player.color
    ))
    food = new Food ((Math.floor(Math.random() * canvas.width) - 10), (Math.floor(Math.random() * canvas.height) - 10), 10, 'red')
    animate()
}

ctx.fillStyle = 'rgba(0,0,0,1)'
ctx.fillRect(0,0, canvas.width, canvas.height)
