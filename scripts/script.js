const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 1280 * 1.3;
canvas.height = 720 * 1.3;

class InputListener {
  constructor(game) {
    this.game = game;
    this.keysPressed = new Set();
    this.keyReleased = new Set();

    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      this.keysPressed.add(e.key);
      if (e.key === "c" && !this.game.player.isCPressed) {
        this.game.player.isCPressed = true;
        this.game.player.frameX = 0;
      }
      this.game.updateKeys(this.keysPressed);
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key);
      this.keyReleased.add(e.key);
      this.game.updateKeys(this.keysPressed);
    });

    const upButton = document.querySelector("#up");
    const downButton = document.querySelector("#down");
    const leftButton = document.querySelector("#left");
    const rightButton = document.querySelector("#right");
    const cButton = document.querySelector("#c");

    upButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowUp")
    );
    downButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowDown")
    );
    leftButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowLeft")
    );
    rightButton.addEventListener("mousedown", () =>
      this.simulateKeyPress("ArrowRight")
    );
    cButton.addEventListener("mousedown", () => this.simulateKeyPress("c"));

    upButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowUp")
    );
    downButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowDown")
    );
    leftButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowLeft")
    );
    rightButton.addEventListener("touchstart", () =>
      this.simulateKeyPress("ArrowRight")
    );
    cButton.addEventListener("touchstart", () => this.simulateKeyPress("c"));

    upButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowUp")
    );
    downButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowDown")
    );
    leftButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowLeft")
    );
    rightButton.addEventListener("mouseup", () =>
      this.simulateKeyRelease("ArrowRight")
    );
    cButton.addEventListener("mouseup", () => this.simulateKeyRelease("c"));

    upButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowUp")
    );
    downButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowDown")
    );
    leftButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowLeft")
    );
    rightButton.addEventListener("touchend", () =>
      this.simulateKeyRelease("ArrowRight")
    );
    cButton.addEventListener("touchend", () => this.simulateKeyRelease("c"));
  }

  simulateKeyPress(key) {
    const event = new KeyboardEvent("keydown", {
      key: key,
    });
    window.dispatchEvent(event);
  }

  simulateKeyRelease(key) {
    const event = new KeyboardEvent("keyup", {
      key: key,
    });
    window.dispatchEvent(event);
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 24;
    this.spriteHeight = 24;
    this.width = 95;
    this.height = 100;
    this.frameX = 0;
    this.frameY = 3;
    this.maxFrame = 9;
    this.frameDelay = 3.2;
    this.frameCount = 0;
    this.x = 575;
    this.y = 350;

    this.velX = 0;
    this.velY = 0;
    this.velMax = 10;

    this.sprite = document.getElementById("player");

    this.lastKey = 0;
    this.isCPressed = false;
    this.isIntersectingWithGrass = false;
  }

  draw(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(
      this.sprite,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  setarVel(velX, velY) {
    this.velX = velX;
    this.velY = velY;
  }

  update() {
    if (this.isCPressed) {
      this.velX = 0;
      this.velY = 0;
      this.frameY = 8;
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.isCPressed = false;
          this.frameX = 0;
        }
      }
    } else {
      if (this.game.pressedKeys.has("ArrowLeft")) {
        this.velX = -this.velMax;
        this.frameY = 5;
        this.lastKey = 1;
      } else if (this.game.pressedKeys.has("ArrowRight")) {
        this.velX = this.velMax;
        this.frameY = 6;
        this.lastKey = 2;
      } else {
        this.velX = 0;
      }
      if (this.game.pressedKeys.has("ArrowUp")) {
        this.velY = -this.velMax;
        this.frameY = 7;
        this.lastKey = 3;
      } else if (this.game.pressedKeys.has("ArrowDown")) {
        this.velY = this.velMax;
        this.frameY = 4;
        this.lastKey = 0;
      } else {
        this.velY = 0;
      }
      if (this.velX === 0 && this.velY === 0) {
        if (this.frameY !== this.lastKey) {
          this.frameY = this.lastKey;
        }
      }
    }
    this.x += this.velX;
    this.y += this.velY;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }

    if (this.y < this.game.topMargin) {
      this.y = this.game.topMargin;
    } else if (this.y > this.game.height - this.height) {
      this.y = this.game.height - this.height;
    }

    if (!this.isCPressed) {
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
    }
  }
}

class Animal {
  constructor(game, x, y, name) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.sprite = document.querySelector(`#${name}`);
    this.spriteWidth = 16;
    this.spriteHeight = 16;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 3;
    this.frameDelay = 3.2;
    this.frameCount = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 1;
    this.moveCount = 0;
    this.maxMoveCount = Math.floor(Math.random() * 100) + 50;
    this.stopDuration = 60;
    this.stopped = false;
    this.originalY = y;
    this.jumpSpeed = 10;
    this.gravity = 0.5;
    this.jumping = true;
    this.randomizeDirection();
  }
  draw(context) {
    context.drawImage(
      this.sprite,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;

          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 5;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }

      if (this.directionX < 0) {
        this.frameY = 3;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }

  randomizeDirection() {
    this.stopped = false;
    this.directionX = Math.random() * 2 - 1;
    this.directionY = Math.random() * 2 - 1;
    const magnitude = Math.sqrt(this.directionX ** 2 + this.directionY ** 2);
    this.directionX /= magnitude;
    this.directionY /= magnitude;
    this.moveCount = 0;
    this.maxMoveCount = Math.floor(Math.random() * 100) + 50;
  }
}

class Hen extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "hen");
    this.frameY = 0;
    this.frameDelay = 3.2;
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;
          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 6;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 3;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Cat extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "cat");
    this.width = 80;
    this.height = 80;
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.frameY = 0;
    this.frameDelay = 6;
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;

          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 5;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 3;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Bat extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "bat");
    this.width = 60;
    this.height = 60;
    this.spriteWidth = 17;
    this.spriteHeight = 17;
    this.frameY = 0;
    this.frameDelay = 6;
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;
          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 0;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 0;
      } else if (this.directionX > 0) {
        this.frameY = 0;
      } else if (this.directionY < 0) {
        this.frameY = 0;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Cow extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "cow");
    this.width = 100;
    this.height = 100;
    this.spriteWidth = 32;
    this.spriteHeight = 32;
    this.frameY = 0;
    this.frameDelay = 6;
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;
          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 4;
            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;
            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;
          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 7;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Duck extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "duck");
  }
  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;
          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 6;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 5;
      } else if (this.directionX > 0) {
        this.frameY = 1;
      } else if (this.directionY < 0) {
        this.frameY = 2;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Ghost extends Animal {
  constructor(game, x, y) {
    super(game, x, y, "ghost");
    this.width = 66;
    this.height = 100;
    this.spriteWidth = 16;
    this.spriteHeight = 24;
    this.frameY = 0;
    this.frameDelay = 6;
  }

  update() {
    if (this.jumping) {
      this.y -= this.jumpSpeed;
      this.jumpSpeed -= this.gravity;
      if (this.y >= this.originalY) {
        this.y = this.originalY;
        this.jumping = false;
      }
    } else {
      if (!this.stopped) {
        if (this.moveCount < this.maxMoveCount) {
          const nextX = this.x + this.directionX * this.speed;
          const nextY = this.y + this.directionY * this.speed;
          let withinBounds = false;
          for (let grass of this.game.grass) {
            if (
              nextX >= grass.x &&
              nextX <= grass.x + grass.width &&
              nextY >= grass.y &&
              nextY <= grass.y + grass.height
            ) {
              withinBounds = true;
              break;
            }
          }
          if (withinBounds) {
            this.x = nextX;
            this.y = nextY;
            this.moveCount++;
          } else {
            this.frameY = 0;

            this.directionX = 0;
            this.directionY = 0;
            this.stopped = true;

            setTimeout(() => {
              this.randomizeDirection();
            }, 3000);
          }
        } else {
          this.directionX = 0;
          this.directionY = 0;
          this.stopped = true;

          setTimeout(() => {
            this.randomizeDirection();
          }, 3000);
        }
      } else {
        for (let grass of this.game.grass) {
          const distance = Math.sqrt(
            (this.x - grass.x) ** 2 + (this.y - grass.y) ** 2
          );
          if (distance <= 50) {
            this.randomizeDirection();
            break;
          }
        }
      }
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        if (this.frameX < this.maxFrame - 1) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
      }
      if (this.directionX < 0) {
        this.frameY = 0;
      } else if (this.directionX > 0) {
        this.frameY = 0;
      } else if (this.directionY < 0) {
        this.frameY = 0;
      } else if (this.directionY > 0) {
        this.frameY = 0;
      }
    }
  }
}

class Grass {
  constructor(game, row, col) {
    this.game = game;
    this.sprite = document.querySelector("#grass");
    this.width = 130;
    this.height = 78;
    this.row = row;
    this.col = col;
    this.randomNumber = null;
    this.interacted = false;
    this.calculatePosition();
  }
  draw(context) {
    context.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
  generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  calculatePosition(index) {
    const gridSize = 200;
    const spacingX = 65;
    const maxCols = 4;
    const marginX =
      (this.game.width - maxCols * (gridSize + spacingX) + spacingX) / 2;
    const marginY =
      (this.game.height - 3 * gridSize) / 2 + this.game.topMargin * 0.75;
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    this.x = col * (gridSize + spacingX) + marginX;
    this.y = row * gridSize + marginY;
  }
  setRandomNumber(pair) {
    if (pair) {
      this.randomNumber = pair.value;
    } else {
      this.randomNumber = this.generateRandomNumber();
    }
  }
  reset() {
    this.interacted = false;
  }
}

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.topMargin = 200;
    this.flips = 0;
    this.flipsWrapper = document.querySelector(".flips span");
    this.pressedKeys = new Set();
    this.input = new InputListener(this);
    this.player = new Player(this);
    this.grassQuantity = 12;
    this.grass = [];
    this.gameObjects = [];
    this.animals = [];
    this.detections = 0;
    this.generatedAnimals = [];
    this.lastInteractedGrassID = undefined;
  }

  updateKeys(key) {
    this.pressedKeys = key;
  }

  resetGrasses() {
    for (let grass of this.grass) {
      grass.reset();
      this.interacted = false;
    }
    const lastInteractedGrass = this.grass.find((grass) => grass.interacted);
    if (lastInteractedGrass) {
      lastInteractedGrass.interacted = false;
    }

    this.generatedAnimals = [];
  }

  detectInteraction() {
    if (!this.excludedGrasss) {
      this.excludedGrasss = [];
    }

    const ANIMALSCLASSES = {
      1: Hen,
      2: Cat,
      3: Duck,
      4: Cow,
      5: Ghost,
      6: Bat,
    };

    for (let grass of this.grass) {
      if (
        !grass.interacted &&
        Math.abs(this.player.x - grass.x) <= this.player.width &&
        Math.abs(this.player.y - grass.y) <= this.player.height &&
        !this.waitingToDelete
      ) {
        if (this.player.isCPressed) {
          const AnimalClass = ANIMALSCLASSES[grass.randomNumber];
          this.flips++;
          this.flipsWrapper.textContent = this.flips
            .toString()
            .padStart(2, "0");

          if (AnimalClass) {
            const animal = new AnimalClass(this, grass.x, grass.y);
            this.animals.push(animal);

            this.generatedAnimals.push({ animal, grass });
            grass.interacted = true;
          }

          if (
            this.selectedGrass &&
            this.selectedGrass.randomNumber !== grass.randomNumber
          ) {
            this.detections++;
          }

          if (this.detections >= 1) {
            this.detections = 0;
            this.waitingToDelete = true;

            let generatedAnimalCount = this.generatedAnimals.length;
            setTimeout(() => {
              for (let i = 0; i < 2 && generatedAnimalCount > 0; i++) {
                const { animal, grass: associatedGrass } =
                  this.generatedAnimals.pop();
                const index = this.animals.indexOf(animal);
                if (index !== -1) {
                  this.animals.splice(index, 1);

                  animal.x = associatedGrass.x;
                  animal.y = associatedGrass.y;
                }
                generatedAnimalCount--;
              }
              this.waitingToDelete = false;
              this.grass.forEach((grass) => {
                if (!this.excludedGrasss.includes(grass)) {
                  grass.interacted = false;
                }
              });
            }, 2000);
          }
          if (!this.selectedGrass) {
            this.selectedGrass = grass;
          } else {
            this.lastInteractedGrassID = grass.randomNumber;

            if (
              this.selectedGrass.randomNumber === this.lastInteractedGrassID
            ) {
              this.excludedGrasss.push(this.selectedGrass);
              this.excludedGrasss.push(grass);
            }
            this.selectedGrass = null;
          }
          this.player.isCPressed = false;
        }
      }
    }
  }
  render(context) {
    this.gameObjects = [...this.grass, ...this.animals, this.player];
    this.gameObjects.sort((a, b) => {
      return a.y + a.height - (b.y + b.height);
    });

    this.gameObjects.forEach((object) => {
      object.draw(context);
      if (object instanceof Player || object instanceof Animal) {
        object.update();
      }
    });
  }
  play() {
    const values = [1, 2, 3, 4, 5, 6];
    const grassPerValue = 2;
    const shuffledValues = values.sort(() => Math.random() - 0.5);
    let grasses = [];

    for (const value of shuffledValues) {
      for (let i = 0; i < grassPerValue; i++) {
        const grass = new Grass(this, 0, 0);
        grass.setRandomNumber({ value: value });
        grasses.push(grass);
      }
    }
    grasses.sort(() => Math.random() - 0.5);

    grasses.forEach((grass, index) => {
      grass.calculatePosition(index);
      this.grass.push(grass);
    });
  }
}
window.addEventListener("load", () => {
  const game = new Game(canvas.width, canvas.height);
  game.resetGrasses();
  game.play();
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.detectInteraction();
    game.render(ctx);
    requestAnimationFrame(animate);
  };
  animate();
});
