// Physics.js - Lab 01: Apply Physics to Rigid Body
// Course: INFO-5144
// This file contains the physics implementation for the player's trajectory

class Physics {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.rigidBodies = [];
        this.player = null;
        this.isMoving = false;
        this.setupBoundaries();
        this.setupPlayer();
        this.setupCentralSquare();
    }

    // Create the 4 static rigid bodies as boundaries
    setupBoundaries() {
        const borderThickness = 20;
        
        // Top boundary
        this.rigidBodies.push({
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: borderThickness,
            type: 'static',
            name: 'top',
            color: '#2c3e50'
        });

        // Bottom boundary
        this.rigidBodies.push({
            x: 0,
            y: this.canvas.height - borderThickness,
            width: this.canvas.width,
            height: borderThickness,
            type: 'static',
            name: 'bottom',
            color: '#2c3e50'
        });

        // Left boundary
        this.rigidBodies.push({
            x: 0,
            y: 0,
            width: borderThickness,
            height: this.canvas.height,
            type: 'static',
            name: 'left',
            color: '#2c3e50'
        });

        // Right boundary
        this.rigidBodies.push({
            x: this.canvas.width - borderThickness,
            y: 0,
            width: borderThickness,
            height: this.canvas.height,
            type: 'static',
            name: 'right',
            color: '#2c3e50'
        });
    }

    // Create the central square static rigid body
    setupCentralSquare() {
        const size = 100;
        this.rigidBodies.push({
            x: (this.canvas.width - size) / 2,
            y: (this.canvas.height - size) / 2,
            width: size,
            height: size,
            type: 'static',
            name: 'center',
            color: '#e74c3c'
        });
    }

    // Create the movable player rigid body at top left corner
    setupPlayer() {
        const playerSize = 30;
        const margin = 30; // Distance from boundaries
        
        this.player = {
            x: margin,
            y: margin,
            width: playerSize,
            height: playerSize,
            vx: 0,
            vy: 0,
            speed: 200, // pixels per second
            type: 'dynamic',
            name: 'player',
            color: '#3498db',
            direction: 'down' // Initial direction
        };
    }

    // Start player movement on touch/click
    startMovement() {
        if (!this.isMoving) {
            this.isMoving = true;
            // Set initial velocity downward (y-axis)
            this.player.vx = 0;
            this.player.vy = this.player.speed;
            this.player.direction = 'down';
        }
    }

    // Update physics simulation
    update(deltaTime) {
        if (!this.isMoving) return;

        // Update player position based on velocity
        this.player.x += this.player.vx * deltaTime;
        this.player.y += this.player.vy * deltaTime;

        // Check collisions and update trajectory
        this.checkCollisions();
    }

    // Check for collisions with boundaries and update direction
    checkCollisions() {
        const playerRight = this.player.x + this.player.width;
        const playerBottom = this.player.y + this.player.height;

        // Bottom boundary collision - move right
        if (this.player.direction === 'down' && playerBottom >= this.canvas.height - 20) {
            this.player.y = this.canvas.height - 20 - this.player.height;
            this.player.vx = this.player.speed;
            this.player.vy = 0;
            this.player.direction = 'right';
        }

        // Right boundary collision - move up
        if (this.player.direction === 'right' && playerRight >= this.canvas.width - 20) {
            this.player.x = this.canvas.width - 20 - this.player.width;
            this.player.vx = 0;
            this.player.vy = -this.player.speed;
            this.player.direction = 'up';
        }

        // Top boundary collision - move left
        if (this.player.direction === 'up' && this.player.y <= 20) {
            this.player.y = 20;
            this.player.vx = -this.player.speed;
            this.player.vy = 0;
            this.player.direction = 'left';
        }

        // Left boundary collision - move down (complete the loop)
        if (this.player.direction === 'left' && this.player.x <= 20) {
            this.player.x = 20;
            this.player.vx = 0;
            this.player.vy = this.player.speed;
            this.player.direction = 'down';
        }
    }

    // Render all rigid bodies
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw all static rigid bodies (boundaries and center square)
        this.rigidBodies.forEach(body => {
            this.ctx.fillStyle = body.color;
            this.ctx.fillRect(body.x, body.y, body.width, body.height);
        });

        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw player outline
        this.ctx.strokeStyle = '#2980b9';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw direction indicator
        this.drawDirectionIndicator();

        // Draw instructions if not moving
        if (!this.isMoving) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click/Touch to Start', this.canvas.width / 2, this.canvas.height / 2 - 80);
        }
    }

    // Draw an arrow showing the player's direction
    drawDirectionIndicator() {
        const centerX = this.player.x + this.player.width / 2;
        const centerY = this.player.y + this.player.height / 2;
        const arrowLength = 15;

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        switch (this.player.direction) {
            case 'down':
                this.ctx.moveTo(centerX, centerY - 5);
                this.ctx.lineTo(centerX, centerY + arrowLength);
                this.ctx.lineTo(centerX - 5, centerY + arrowLength - 5);
                this.ctx.moveTo(centerX, centerY + arrowLength);
                this.ctx.lineTo(centerX + 5, centerY + arrowLength - 5);
                break;
            case 'right':
                this.ctx.moveTo(centerX - 5, centerY);
                this.ctx.lineTo(centerX + arrowLength, centerY);
                this.ctx.lineTo(centerX + arrowLength - 5, centerY - 5);
                this.ctx.moveTo(centerX + arrowLength, centerY);
                this.ctx.lineTo(centerX + arrowLength - 5, centerY + 5);
                break;
            case 'up':
                this.ctx.moveTo(centerX, centerY + 5);
                this.ctx.lineTo(centerX, centerY - arrowLength);
                this.ctx.lineTo(centerX - 5, centerY - arrowLength + 5);
                this.ctx.moveTo(centerX, centerY - arrowLength);
                this.ctx.lineTo(centerX + 5, centerY - arrowLength + 5);
                break;
            case 'left':
                this.ctx.moveTo(centerX + 5, centerY);
                this.ctx.lineTo(centerX - arrowLength, centerY);
                this.ctx.lineTo(centerX - arrowLength + 5, centerY - 5);
                this.ctx.moveTo(centerX - arrowLength, centerY);
                this.ctx.lineTo(centerX - arrowLength + 5, centerY + 5);
                break;
        }

        this.ctx.stroke();
    }

    // Get player info for debugging
    getPlayerInfo() {
        return {
            position: { x: this.player.x, y: this.player.y },
            velocity: { vx: this.player.vx, vy: this.player.vy },
            direction: this.player.direction,
            isMoving: this.isMoving
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Physics;
}
