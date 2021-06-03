const blossomParent = document.getElementById('container');
const canvasSize = 450;
const blossomCurveDepth = 30;
let blossomRadius;
let blossoms = [];
let courbeIncrement = 0;

class Courbe {

    constructor(firstControlX, firstControlY, secondControlX, secondControlY, pointX, pointY) {
        this.firstControlX = firstControlX;
        this.firstControlY = firstControlY;
        this.secondControlX = secondControlX;
        this.secondControlY = secondControlY;
        this.pointX = pointX;
        this.pointY = pointY;
    }
}

class Blossom {

    constructor(radius) {
        this.courbesNumber = 48;  // should be a multiple of 4
        this.courbes = [];
        this.courbesAngles = [];
        this.angle = Math.PI * 2 / this.courbesNumber;
        this.radius = radius;
        this.radiusAjust = blossomCurveDepth;
    }
    
    computeAngles() {

        for (let i = 0; i < this.courbesNumber; i++) {

            let firstControlTheta,
                secondControlTheta,
                pointTheta;

            let startTheta = this.angle * i;
            let middleTheta = startTheta + (this.angle / 2);
            let stopTheta = this.angle * (i + 1);
    
            if ( i % 2 == 0 ) {
    
                firstControlTheta = middleTheta;
                secondControlTheta = stopTheta * 0.995;
                pointTheta = stopTheta;
                
            } else {
    
                firstControlTheta = startTheta * 1.005;
                secondControlTheta = middleTheta;
                pointTheta = stopTheta;
            }
     
            let angles = [
                cos(firstControlTheta),
                sin(firstControlTheta),
                cos(secondControlTheta),
                sin(secondControlTheta),
                cos(pointTheta),
                sin(pointTheta)
            ];
            
            this.courbesAngles[i] = angles;
        }
    }

    render() {

        courbeIncrement = courbeIncrement + 0.006;
        let courbeVariator = cos(courbeIncrement) * this.radius / 200;
        let fullCurveCounter = 0;
        
        for (let i = 0; i < this.courbesNumber; i++) {

            let firstControlRadiusAjust,
                secondControlRadiusAjust,
                pointRadius,
                radiusPlusAjust;
            
            let ajust = this.radiusAjust;

            ajust = ajust * courbeVariator;
            
            if (fullCurveCounter % 2 == 0) { 
                ajust = ajust * -1;
            }
    
            radiusPlusAjust = this.radius + ajust; 
    
            firstControlRadiusAjust = radiusPlusAjust;
            secondControlRadiusAjust = radiusPlusAjust;
    
            if ( i % 2 == 0 ) {
    
                pointRadius = radiusPlusAjust;

            } else {
    
                fullCurveCounter++;
                pointRadius = this.radius;
            }

            this.courbes[i] = new Courbe(
                this.courbesAngles[i][0] * firstControlRadiusAjust,
                this.courbesAngles[i][1] * firstControlRadiusAjust,
                this.courbesAngles[i][2] * secondControlRadiusAjust,
                this.courbesAngles[i][3] * secondControlRadiusAjust,
                this.courbesAngles[i][4] * pointRadius,
                this.courbesAngles[i][5] * pointRadius
            );
        }

        beginShape();
        
        vertex(
            this.courbes[this.courbes.length - 1].pointX, 
            this.courbes[this.courbes.length - 1].pointY
        );

        for (let i = 0; i < this.courbes.length; i++) {
            bezierVertex(
                this.courbes[i].firstControlX, 
                this.courbes[i].firstControlY,
                this.courbes[i].secondControlX,
                this.courbes[i].secondControlY,
                this.courbes[i].pointX,
                this.courbes[i].pointY
            );
        }
    
        endShape();
    }
}

function setup() {

    blossomRadius = canvasSize / 2 - blossomCurveDepth;

    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent(blossomParent);

    stroke('#de6a00');
    strokeWeight(1);
    noFill();

    blossom = new Blossom(blossomRadius);
    blossom.computeAngles();
}

function draw() {

    translate(canvasSize / 2, canvasSize / 2);
    clear();
    
    blossom.render();
}
