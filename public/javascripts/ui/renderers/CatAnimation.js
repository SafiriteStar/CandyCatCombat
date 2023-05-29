class Animation {
    constructor(images, loop) {
        this.images = [];
        for (let i = 0; i < images.length; i++) {
            if (images[i] !== null && images[i] !== undefined) {
                this.images.push(images[i]);
            }
        }
        this.loop = loop;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    reset() {
        this.xOffset = 0;
        this.yOffset = 0;
    }

    draw() {
        for (let i = 0; i < this.images.length; i++) {
            image(this.images[i], (-this.images[i].width * 0.5) + this.xOffset, (-this.images[i].height * 0.5) + this.yOffset);
        }
    }
}

class IdleAnimation extends Animation {
    constructor(images, loop) {
        super(images, loop);
        this.maxJumpHeight = 75;
        this.jumpDirection = -1;
        this.jumpSpeed = 5;
        this.gravity = 2;
        this.currentSpeed = -this.jumpSpeed;
        
        this.bounceWaitTime = 10 + Math.floor(Math.random() * 10);
        this.bounceWaitTimer = 0;
        
    }

    reset() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.bounceWaitTimer = 0;
        this.currentSpeed = -this.jumpSpeed;
    }

    draw() {
        if (this.yOffset > 0 && this.bounceWaitTimer > this.bounceWaitTime && this.loop) {
            // Add an impulse to go up
            this.currentSpeed = -this.jumpSpeed;
            this.yOffset = 0;
            this.bounceWaitTimer = 0;
        }

        if (this.bounceWaitTimer > this.bounceWaitTime) {
            this.yOffset = this.yOffset + (this.currentSpeed);
    
            this.currentSpeed = this.currentSpeed + (this.gravity);
        }
        else {
            this.bounceWaitTimer = this.bounceWaitTimer + (1);
        }
        
        for (let i = 0; i < this.images.length; i++) {
            image(this.images[i], (-this.images[i].width * 0.5) + this.xOffset, (-this.images[i].height * 0.5) + this.yOffset);
        }
    }
}

class MoveAnimation extends IdleAnimation {
    constructor(images, loop) {
        super(images, loop);
        this.jumpSpeed = this.jumpSpeed;
        this.gravity = this.gravity;
        this.bounceWaitTime = 0;
    }
}

class AttackAnimation extends Animation {
    constructor(images, loop) {
        super(images, loop);
        this.durationTime = 40;
        this.durationTimer = 0;
        this.finishedPlaying = false;
    }

    reset() {
        this.xOffset = 0;
        this.yOffset = 0;
        this.durationTimer = 0;
        this.finishedPlaying = false;
    }

    draw() {
        if (this.durationTimer > this.durationTime) {
            this.finishedPlaying = true;
        }
        else if (!this.finishedPlaying) {
            this.durationTimer = this.durationTimer + (1);
        }

        for (let i = 0; i < this.images.length; i++) {
            image(this.images[i], (-this.images[i].width * 0.5) + this.xOffset, (-this.images[i].height * 0.5) + this.yOffset);
        }
    }
}

class FaintAnimation extends Animation {
    constructor(images, loop) {
        super(images, loop);

    }
}

class CatAnimator {
    constructor(images, baseState) {
        this.images = images;
        this.state = baseState;

        this.idleAnimation = new IdleAnimation([this.images.weapon2, this.images.base, this.images.weapon], true);
        this.moveAnimation = new MoveAnimation([this.images.weapon2, this.images.base, this.images.weapon], true);
        this.attackAnimation = new AttackAnimation([this.images.weapon2, this.images.attack, this.images.weapon], false);
        if (this.images.stealth !== null && this.images.stealth !== undefined) {
            this.stealthIdleAnimation = new IdleAnimation([this.images.weapon2, this.images.stealth, this.images.weapon], true);
            this.stealthMoveAnimation = new MoveAnimation([this.images.weapon2, this.images.stealth, this.images.weapon], true);
        }
        this.faintAnimation = new FaintAnimation([this.images.weapon2, this.images.fainted, this.images.weapon], false);
    }

    changeState(newState) {
        this.state = newState;

        // Reset some variables
        this.idleAnimation.reset();
        this.moveAnimation.reset();

        if (this.images.stealth !== null && this.images.stealth !== undefined) {
            this.stealthIdleAnimation.reset();
            this.stealthMoveAnimation.reset();
        }

        this.attackAnimation.reset();
        this.faintAnimation.reset();
    }

    draw() {
        push();
        if (this.state == "idle") {
            this.idleAnimation.draw();
        }
        else if (this.state == "move") {
            this.moveAnimation.draw();
        }
        else if (this.state == "attack") {
            if (!this.attackAnimation.finishedPlaying) {
                this.attackAnimation.draw();
            }
            else {
                if (this.attackAnimation.finishedPlaying) {
                    this.state = "idle";
                }
            }
        }
        else if (this.state == "stealthIdle") {
            this.stealthIdleAnimation.draw();
        }
        else if (this.state == "stealthMove") {
            this.stealthMoveAnimation.draw();
        }
        else if (this.state == "faint") {
            this.faintAnimation.draw();
        }
        pop();
    }
}