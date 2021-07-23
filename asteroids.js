const canvas = document.querySelector('canvas');

canvas.width = innerWidth - 400
canvas.height = 600;

const ctx = canvas.getContext('2d');


class Player{
    constructor(x,y, radius, color){
        //Size
        this.x = x
        this.y = y
        this.velY = 0,
        this.velX = 0,
        this.speed = 2,
        this.friction = 0.98,

        //Position
        this.radius = radius

        //Colour
        this.color = color
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.strokeStyle = 'rgba(255,255,255,1)'
        ctx.stroke()
    }

    update(){
        if (keys[38] || keys[87]) {
            if (this.velY > -this.speed) {
                this.velY--;
            }
          }
        
          if (keys[40] || keys[83]) {
            if (this.velY < this.speed) {
                this.velY++;
            }
          }
          if (keys[39] || keys[68]) {
            if (this.velX < this.speed) {
                this.velX++;
            }
          }
          if (keys[37] || keys[65]) {
            if (this.velX > -this.speed) {
                this.velX--;
            }
          }
        
          this.velY *= this.friction;
          this.y += this.velY;
          this.velX *= this.friction;
          this.x += this.velX;
        
          if (this.x >= canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
          } else if (this.x <= this.radius) {
            this.x = this.radius;
          }
        
          if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
          } else if (this.y <= this.radius) {
            this.y = this.radius;
          }
        this.draw()
    }
}

class Projectile{
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
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'red'
        ctx.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x * 5
        this.y = this.y + this.velocity.y * 5
    }
}

class Enemy{
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
  }

  draw(){
      ctx.beginPath()
      ctx.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
      ctx.fillStyle = this.color
      ctx.fill()
  }

  update(){
      this.draw()
      this.x = this.x + this.velocity.x * 5
      this.y = this.y + this.velocity.y * 5
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

const x = canvas.width /2
const y = canvas.height /2



const total_score = document.getElementById('total-score')
player = new Player(x,y, 25, 'blue')
interval = ''
interval_list = []
projectiles = []
enemies = []
particles = []
keys = [];

function spawnEnemies(){
    const radius = 10 + Math.random() * 30
    let x
    let y
    if (Math.random() < 0.5){
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() *canvas.height
    }
    else{
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius

    }
    
    const color = "#CD7F32"
    var deltaX = (player.x + canvas.width/25) - (x + radius);
    var deltaY = (player.y + canvas.height/25) - (y + radius);

    var magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    var velocityScale = 1 / magnitude;
    const velocity = {
        x: deltaX * velocityScale,
        y: deltaY * velocityScale,
    }

    enemies.push(new Enemy(
      x,
      y,
      radius,
      color,
      velocity
))
}
let animationId
let score = 0
let scoreboard
let scoretext
let SPEED = 1000

function animate(keys){
  animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    player.update(keys)
    particles.forEach((particle, particleidx) =>{
      if (particle.alpha - 0.025 <= 0 || particle.radius - 0.01 <= 0){
        particles.splice(particleidx, 1)
      }
      particle.update()
    })
    projectiles.forEach((projectile, projectileidx) =>
        {
            projectile.update()

            if (projectile.x + projectile.radius < 0 ||
               projectile.x - projectile.radius > canvas.width||
               projectile.y + projectile.radius < 0||
               projectile.y - projectile.radius > canvas.height){
              projectiles.splice(projectileidx, 1)
            }
        })
    enemies.forEach((enemy, index) =>{
      enemy.update()
      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        
      //game ends
        if (dist - enemy.radius - player.radius < 1) {
          cancelAnimationFrame(animationId)
          interval_list.forEach((interval, intervalidx) =>{
            clearInterval(interval)
            interval_list.splice(intervalidx, 1)
          })
          scoreboard.className = 'gameover'
          scoreboard.style.marginLeft = String(canvas.width/2.5) + 'px';
          scoreboard.style.marginTop = String(canvas.height/2.5) + 'px';
          scoretext.innerHTML = "GAME OVER  <br/> Score: " + score
          total_score.innerHTML = ''
          $(document).ready(function(){
            $.ajax({
              global: false,
              type: 'POST',
              url: "/submission",
              dataType: 'html',
              data: {
                  score: totalmoves,
                  game: "Asteroids"
              },
              success: function (result) {
                  console.log('Score Submitted');
              },
              error: function (request, status, error) {
                  serviceError();
              }
          });
        });
        }

      projectiles.forEach((projectile, projectileidx) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
        if (dist - enemy.radius - projectile.radius < 1) {
          for (let i = 0; i < enemy.radius; i++){
            particles.push(new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 3,
              enemy.color,
              {x:Math.random() - 0.5,
              y:Math.random() - 0.5,}

            ))
          }
          if (enemy.radius - 10 >  10){
            let angle
            let velocity


            //If projectile is fired with original velocity moving towards player
            angle = Math.atan2(projectile.y - enemy.y, projectile.x - enemy.x)
            velocity = {
              x: Math.cos(angle),
              y: Math.sin(angle),
            }
            enemies.push(new Enemy(
              enemy.x + Math.random() - 1,
              enemy.y + Math.random() - 1,
              enemy.radius / 2,
              enemy.color,
              {x: velocity.x, y: velocity.y}
              
            ))
            if (enemy.x > projectile.x){
              velocity = {
                x: Math.cos(angle + 30),
                y: Math.sin(angle + 30),
              }
            }
            else{
              velocity = {
                x: Math.cos(angle - 30),
                y: Math.sin(angle - 30),
              }
            }
            enemies.push(new Enemy(
              enemy.x + Math.random() - 1,
              enemy.y + Math.random() - 1,
              enemy.radius / 2,
              enemy.color,
              {x: velocity.x, y: velocity.y}
              
            ))
            

            setTimeout(() => {
              enemies.splice(index, 1)
              projectiles.splice(projectileidx, 1)
              score += 1
              total_score.innerHTML = score
            }, 0)
          }
          else{
            setTimeout(() => {
            enemies.splice(index, 1)
            projectiles.splice(projectileidx, 1)
            score += 3
            if (score % 100 == 0){
              if (SPEED - 100 > 1){
                SPEED -= 100
              }
              interval_list.forEach((interval, intervalidx) =>{
                clearInterval(interval)
                interval_list.splice(intervalidx, 1)
              })
              interval = setInterval(spawnEnemies, SPEED)
              interval_list.push(interval)
            }
            total_score.innerHTML = score
          }, 0)}
        }
      
      })
    })
}

addEventListener('click', (event) =>{
    // const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2) //This takes y first idk why
                                                //player.y and player.x == canvas.height/2 and cavnas/width/2 
    var deltaX = event.clientX - (player.x + player.radius * 2);
    var deltaY = event.clientY - (player.y + player.radius * 2);

    // const velocity = {
    //     x: Math.cos(angle),
    //     y: Math.sin(angle),
    // }
    var magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    var velocityScale = 2 / magnitude;
    const velocity = {
        x: deltaX * velocityScale,
        y: deltaY * velocityScale,
    }


    projectiles.push(new Projectile(
            player.x,
            player.y,
            5,
            'red',
            velocity
    ))
})

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
     e.preventDefault();
  });
  document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
     e.preventDefault();
  });

function reset(){
cancelAnimationFrame(animationId)
SPEED = 1000
interval_list.forEach((interval, intervalidx) =>{
  clearInterval(interval)
  interval_list.splice(intervalidx, 1)
})
interval = setInterval(spawnEnemies, SPEED)
interval_list.push(interval)
score = 0
total_score.innerHTML = score
projectiles = [];
enemies = [];
keys = []
particles = []
player.x = x
player.y = y
scoreboard = document.getElementById('score')
scoreboard.className = 'score'
scoreboard.style.marginLeft = '10px';
scoreboard.style.marginTop = '10px';
scoretext = document.getElementById('score-text')
scoretext.innerHTML = 'Score: '  
animate(keys)
}
ctx.fillStyle = 'rgba(0,0,0,1)'
ctx.fillRect(0,0, canvas.width, canvas.height)
