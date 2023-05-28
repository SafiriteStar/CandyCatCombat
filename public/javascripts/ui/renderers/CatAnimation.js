class Animation {
    constructor(image, loop) {
        this.image = image;
        this.loop = loop;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    reset() {
        this.xOffset = 0;
        this.yOffset = 0;
    }

    draw() {
        image(this.image, (-this.image.width * 0.5) + this.xOffset, (-this.image.height * 0.5) + this.yOffset);
    }
}

class IdleAnimation extends Animation {
    constructor(image, loop) {
        super(image, loop);
        this.maxJumpHeight = 75;
        this.jumpDirection = -1;
        this.jumpSpeed = 10;
        this.gravity = 1;
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
            this.yOffset += this.currentSpeed;
    
            this.currentSpeed += this.gravity;
        }
        else {
            this.bounceWaitTimer += 1;
        }

        image(this.image, (-this.image.width * 0.5) + this.xOffset, (-this.image.height * 0.5) + this.yOffset);
    }
}

class MoveAnimation extends IdleAnimation {
    constructor(image, loop) {
        super(image, loop);
        this.jumpSpeed = this.jumpSpeed;
        this.gravity = this.gravity;
        this.bounceWaitTime = 0;
    }
}

class AttackAnimation extends Animation {
    constructor(image, loop) {
        super(image, loop);
        this.durationTime = 40;
        this.durationTimer = 0;
        this.finishedPlaying = false;
    }

    draw() {
        if (this.durationTimer > this.durationTime) {
            this.finishedPlaying = true;
        }
        else if (!this.finishedPlaying) {
            this.durationTimer += 1;
        }

        image(this.image, (-this.image.width * 0.5) + this.xOffset, (-this.image.height * 0.5) + this.yOffset);
        
    }
}

class CatAnimator {
    constructor(images) {
        this.images = images;
        this.state = "idle";

        this.idleAnimation = new IdleAnimation(this.images.base, true);
        this.moveAnimation = new MoveAnimation(this.images.base, true);
        this.attackAnimation = new AttackAnimation(this.images.attack, false);
    }

    changeState(newState) {
        this.state = newState;

        // Reset some variables
        this.idleAnimation.reset();
        this.moveAnimation.reset();
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
            this.attackAnimation.draw();
            if (this.attackAnimation.finishedPlaying) {
                this.state = "idle";
            }
        }
        pop();
    }
}