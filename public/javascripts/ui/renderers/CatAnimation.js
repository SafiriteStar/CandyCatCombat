class Animation {
    constructor(image, loop) {
        this.image = image;
        this.loop = loop;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    draw(opacity) {
        tint(255, 255, 255, opacity);
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

    draw(opacity) {
        if (this.yOffset > 0 && this.bounceWaitTimer > this.bounceWaitTime && this.loop) {
            console.log("Bottom");
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

        tint(255, 255, 255, opacity);
        image(this.image, (-this.image.width * 0.5) + this.xOffset, (-this.image.height * 0.5) + this.yOffset);
    }
}

class MoveAnimation extends IdleAnimation {
    constructor(image, loop) {
        super(image, loop);
        this.jumpSpeed = this.jumpSpeed * 2;
        this.gravity = this.gravity * 3;
        this.bounceWaitTime = 0;
    }
}

class CatAnimator {
    constructor(images) {
        this.images = images;
        this.state = "idle";

        this.idleAnimation = new IdleAnimation(this.images.base, true);
        this.moveAnimation = new MoveAnimation(this.images.base, true);
    }

    draw(opacity) {
        if (this.state == "idle") {
            this.idleAnimation.draw(opacity);
        }
        else if (this.state == "move") {
            this.moveAnimation.draw(opacity);
        }
    }
}