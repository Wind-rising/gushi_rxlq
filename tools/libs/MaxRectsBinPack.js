/**
 *
 * How to use

	//Create new MaxRectsBinPack instance 
	var maxRect:MaxRectsBinPack = new MaxRectsBinPack(1024,1024,false); 
	// insert new rectangle 
	maxRect.insert(300,200,0); 
	
	//There are 5 insert method 
	// public static const BEST_SHORT_SIDE_FIT:int = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best. 
	// public static const BEST_LONG_SIDE_FIT:int = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best. 
	// public static const BEST_AREA_FIT:int = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits. 
	// public static const BOTTOM_LEFT_RULE:int = 3; ///< -BL: Does the Tetris placement. 
	// public static const CONTRACT_POINT_RULE:int = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible. 
	
	this.usedRectangles: storage of all used rectangles 
	freeRectangles: storage of all free rectangles 
	The insert method will return a rectangle. when its width an height are both 0. That means it can not be inserted anymore. 
	
	
	var bitmap:Bitmap = Bitmap(new defence());
    trace(bitmap.width, bitmap.height);
    
    //Create new MaxRectsBinPack instance
    var maxRect:MaxRectsBinPack = new MaxRectsBinPack(bitmap.width,bitmap.height,false);
    // insert new rectangle
    //maxRect.insert(bitmap.width/2, bitmap.height/2, BEST_LONG_SIDE_FIT);
    // insert new rectangle
    //maxRect.insert(bitmap.width/2, bitmap.height/2, BEST_LONG_SIDE_FIT);
    // insert new rectangle
    //maxRect.insert(bitmap.width/2, bitmap.height/2, BEST_LONG_SIDE_FIT);
    // insert new rectangle
    //maxRect.insert(bitmap.width/2, bitmap.height/2, BEST_LONG_SIDE_FIT);
    
    
    var rects:Vector.<Rectangle> = new Vector.<Rectangle>();
    rects.push(new Rectangle(0,0,bitmap.width/2, bitmap.height/2));
    rects.push(new Rectangle(0,0,bitmap.width/2, bitmap.height/2));
    rects.push(new Rectangle(0,0,bitmap.width/2, bitmap.height/2));
    rects.push(new Rectangle(0,0,bitmap.width/2, bitmap.height/2));
    maxRect.insert2(rects, new Vector.<Rectangle>(), BEST_LONG_SIDE_FIT);
    
    for(var i:int = 0; i < maxRect.this.usedRectangles.length; i++) {
        var rect:Rectangle = maxRect.this.usedRectangles[i];
        trace(rect);
        var bitmapData:BitmapData = new BitmapData(rect.width, rect.height, true, 0);
        bitmapData.copyPixels(bitmap.bitmapData, rect, new Point());
        
        var newBitmap:Bitmap = new Bitmap(bitmapData);
        newBitmap.x = rect.x;
        newBitmap.y = rect.y;
        this.addChild(newBitmap);
    }
 * 
 */


function MaxRectsBinPack(width, height, rotations) {
    this.freeRectangles = [];//Rectangle
    this.usedRectangles = [];//Rectangle
    this.init(width, height, rotations);
}
MaxRectsBinPack.BEST_AREA_FIT = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
MaxRectsBinPack.BEST_LONG_SIDE_FIT = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
MaxRectsBinPack.BEST_SHORT_SIDE_FIT = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
MaxRectsBinPack.BOTTOM_LEFT_RULE = 3; ///< -BL: Does the Tetris placement.
MaxRectsBinPack.CONTRACT_POINT_RULE = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
MaxRectsBinPack.prototype.init = function (width, height, rotations) {
    if (!this.is2N(width) || !this.is2N(height)) {
        throw new Error("Must be 2,4,8,16,32,...512,1024,...");
    }
    this.bestLongSideFit = 0;
    this.bestShortSideFit = 0;

    this.score1 = 0; // Unused in this function. We don't need to know the score after finding the position.
    this.score2 = 0;
    this.binWidth = width;
    this.binHeight = height;
    this.allowRotations = rotations;

    var n = {
        x: 0,
        y: 0,
        width: width,
        height: height
    }

    this.usedRectangles.length = 0;

    this.freeRectangles.length = 0;
    this.freeRectangles.push(n);

}

MaxRectsBinPack.prototype.insert2 = function (rects, method) {
    while (rects.length > 0) {
        var bestScore1 = Number.MAX_VALUE;
        var bestScore2 = Number.MAX_VALUE;
        var bestRectangleIndex = -1;
        var bestNode = { x: 0, y: 0, width: 0, height: 0 };

        for (var i = 0; i < rects.length; ++i) {
            var score1 = 0;
            var score2 = 0;
            var newNode = this.scoreRectangle(rects[i].width, rects[i].height, method, score1, score2);

            if (score1 < bestScore1 || (score1 == bestScore1 && score2 < bestScore2)) {
                bestScore1 = score1;
                bestScore2 = score2;
                bestNode = newNode;
                bestRectangleIndex = i;
            }
        }

        if (bestRectangleIndex == -1) {
            return;
        }

        this.placeRectangle(bestNode);
        rects.splice(bestRectangleIndex, 1);
    }
}
MaxRectsBinPack.prototype.insert = function (width, height, method) {
    var newNode = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    this.score1 = 0;
    this.score2 = 0;

    switch (method) {
        case MaxRectsBinPack.BEST_SHORT_SIDE_FIT:
            newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
            break;
        case MaxRectsBinPack.BOTTOM_LEFT_RULE:
            newNode = this.findPositionForNewNodeBottomLeft(width, height, this.score1, this.score2);
            break;
        case MaxRectsBinPack.CONTRACT_POINT_RULE:
            newNode = this.findPositionForNewNodeContactPoint(width, height, this.score1);
            break;
        case MaxRectsBinPack.BEST_LONG_SIDE_FIT:
            newNode = this.findPositionForNewNodeBestLongSideFit(width, height, this.score2, this.score1);
            break;
        case MaxRectsBinPack.BEST_AREA_FIT:
            newNode = this.findPositionForNewNodeBestAreaFit(width, height, this.score1, this.score2);
            break;
    }

    if (newNode.height == 0) {
        return newNode;
    }

    this.placeRectangle(newNode);
    return newNode;
}

/// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
MaxRectsBinPack.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
    if (i1end < i2start || i2end < i1start) {
        return 0;
    }
    return Math.min(i1end, i2end) - Math.max(i1start, i2start);
}

MaxRectsBinPack.prototype.contactPointScoreNode = function (x, y, width, height) {
    var score = 0;

    if (x == 0 || x + width == this.binWidth) {
        score += height;
    }

    if (y == 0 || y + height == this.binHeight) {
        score += width;
    }
    var rect;

    for (var i = 0; i < this.usedRectangles.length; i++) {
        rect = this.usedRectangles[i];

        if (rect.x == x + width || rect.x + rect.width == x) {
            score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
        }

        if (rect.y == y + height || rect.y + rect.height == y) {
            score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
        }
    }
    return score;
}

MaxRectsBinPack.prototype.is2N = function (i) {
    return (i > 0) && ((i & (i - 1)) == 0);
}

MaxRectsBinPack.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit) {
    var bestNode = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    //memset(&bestNode, 0, sizeof(Rectangle));
    bestAreaFit = Number.MAX_VALUE;

    var rect;

    var leftoverHoriz;
    var leftoverVert;
    var shortSideFit;
    var areaFit;

    for (var i = 0; i < this.freeRectangles.length; i++) {
        rect = this.freeRectangles[i];
        areaFit = (rect.width * rect.height - width * height);

        // Try to place the Rectangle in upright (non-flipped) orientation.
        if (rect.width >= width && rect.height >= height) {
            leftoverHoriz = Math.abs(rect.width - width);
            leftoverVert = Math.abs(rect.height - height);
            shortSideFit = Math.min(leftoverHoriz, leftoverVert);

            if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = width;
                bestNode.height = height;
                bestShortSideFit = shortSideFit;
                bestAreaFit = areaFit;
            }
        }

        if (this.allowRotations && rect.width >= height && rect.height >= width) {
            leftoverHoriz = Math.abs(rect.width - height);
            leftoverVert = Math.abs(rect.height - width);
            shortSideFit = Math.min(leftoverHoriz, leftoverVert);

            if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = height;
                bestNode.height = width;
                bestShortSideFit = shortSideFit;
                bestAreaFit = areaFit;
            }
        }
    }
    return bestNode;
}

MaxRectsBinPack.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
    var bestNode = { x: 0, y: 0, width: 0, height: 0 };
    //memset(&bestNode, 0, sizeof(Rectangle));
    bestLongSideFit = Number.MAX_VALUE;
    var rect;

    var leftoverHoriz;
    var leftoverVert;
    var shortSideFit;
    var longSideFit;

    for (var i = 0; i < this.freeRectangles.length; i++) {
        rect = this.freeRectangles[i];

        // Try to place the Rectangle in upright (non-flipped) orientation.
        if (rect.width >= width && rect.height >= height) {
            leftoverHoriz = Math.abs(rect.width - width);
            leftoverVert = Math.abs(rect.height - height);
            shortSideFit = Math.min(leftoverHoriz, leftoverVert);
            longSideFit = Math.max(leftoverHoriz, leftoverVert);

            if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = width;
                bestNode.height = height;
                bestShortSideFit = shortSideFit;
                bestLongSideFit = longSideFit;
            }
        }

        if (this.allowRotations && rect.width >= height && rect.height >= width) {
            leftoverHoriz = Math.abs(rect.width - height);
            leftoverVert = Math.abs(rect.height - width);
            shortSideFit = Math.min(leftoverHoriz, leftoverVert);
            longSideFit = Math.max(leftoverHoriz, leftoverVert);

            if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = height;
                bestNode.height = width;
                bestShortSideFit = shortSideFit;
                bestLongSideFit = longSideFit;
            }
        }
    }
    return bestNode;
}

MaxRectsBinPack.prototype.findPositionForNewNodeBestShortSideFit = function (width, height) {
    var bestNode = { x: 0, y: 0, width: 0, height: 0 };
    //memset(&bestNode, 0, sizeof(Rectangle));

    this.bestShortSideFit = Number.MAX_VALUE;
    this.bestLongSideFit = this.score2;
    var rect;
    var leftoverHoriz;
    var leftoverVert;
    var shortSideFit;
    var longSideFit;

    for (var i = 0; i < this.freeRectangles.length; i++) {
        rect = this.freeRectangles[i];

        // Try to place the Rectangle in upright (non-flipped) orientation.
        if (rect.width >= width && rect.height >= height) {
            leftoverHoriz = Math.abs(rect.width - width);
            leftoverVert = Math.abs(rect.height - height);
            shortSideFit = Math.min(leftoverHoriz, leftoverVert);
            longSideFit = Math.max(leftoverHoriz, leftoverVert);

            if (shortSideFit < this.bestShortSideFit || (shortSideFit == this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = width;
                bestNode.height = height;
                this.bestShortSideFit = shortSideFit;
                this.bestLongSideFit = longSideFit;
            }
        }
        var flippedLeftoverHoriz;
        var flippedLeftoverVert;
        var flippedShortSideFit;
        var flippedLongSideFit;

        if (this.allowRotations && rect.width >= height && rect.height >= width) {
            flippedLeftoverHoriz = Math.abs(rect.width - height);
            flippedLeftoverVert = Math.abs(rect.height - width);
            flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
            flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

            if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit == this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = height;
                bestNode.height = width;
                this.bestShortSideFit = flippedShortSideFit;
                this.bestLongSideFit = flippedLongSideFit;
            }
        }
    }

    return bestNode;
}

MaxRectsBinPack.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX) {
    var bestNode = { x: 0, y: 0, width: 0, height: 0 };
    //memset(bestNode, 0, sizeof(Rectangle));

    bestY = Number.MAX_VALUE;
    var rect;
    var topSideY;

    for (var i = 0; i < this.freeRectangles.length; i++) {
        rect = this.freeRectangles[i];

        // Try to place the Rectangle in upright (non-flipped) orientation.
        if (rect.width >= width && rect.height >= height) {
            topSideY = rect.y + height;

            if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = width;
                bestNode.height = height;
                bestY = topSideY;
                bestX = rect.x;
            }
        }

        if (this.allowRotations && rect.width >= height && rect.height >= width) {
            topSideY = rect.y + width;

            if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = height;
                bestNode.height = width;
                bestY = topSideY;
                bestX = rect.x;
            }
        }
    }
    return bestNode;
}

MaxRectsBinPack.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore) {
    var bestNode = { x: 0, y: 0, width: 0, height: 0 };
    //memset(&bestNode, 0, sizeof(Rectangle));

    bestContactScore = -1;

    var rect;
    var score;

    for (var i = 0; i < this.freeRectangles.length; i++) {
        rect = this.freeRectangles[i];

        // Try to place the Rectangle in upright (non-flipped) orientation.
        if (rect.width >= width && rect.height >= height) {
            score = this.contactPointScoreNode(rect.x, rect.y, width, height);

            if (score > bestContactScore) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = width;
                bestNode.height = height;
                bestContactScore = score;
            }
        }

        if (this.allowRotations && rect.width >= height && rect.height >= width) {
            score = this.contactPointScoreNode(rect.x, rect.y, height, width);

            if (score > bestContactScore) {
                bestNode.x = rect.x;
                bestNode.y = rect.y;
                bestNode.width = height;
                bestNode.height = width;
                bestContactScore = score;
            }
        }
    }
    return bestNode;
}


MaxRectsBinPack.prototype.isContainedIn = function (a, b) {
    return a.x >= b.x && a.y >= b.y
        && a.x + a.width <= b.x + b.width
        && a.y + a.height <= b.y + b.height;
}

/// Computes the ratio of used surface area.
/*private double occupancy()
{
    double usedSurfaceArea = 0;

    for ( int i = 0; i < this.usedRectangles.length; i++ )
    {
        usedSurfaceArea += this.usedRectangles[i].width * this.usedRectangles[i].height;
    }

    return usedSurfaceArea / (this.binWidth * this.binHeight);
}*/

MaxRectsBinPack.prototype.placeRectangle = function (node) {
    var numRectanglesToProcess = this.freeRectangles.length;

    for (var i = 0; i < numRectanglesToProcess; i++) {
        if (this.splitFreeNode(this.freeRectangles[i], node)) {
            this.freeRectangles.splice(i, 1);
            --i;
            --numRectanglesToProcess;
        }
    }

    this.pruneFreeList();

    this.usedRectangles.push(node);
}

MaxRectsBinPack.prototype.pruneFreeList = function () {
    for (var i = 0; i < this.freeRectangles.length; i++) {
        for (var j = i + 1; j < this.freeRectangles.length; j++) {
            if (this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])) {
                this.freeRectangles.splice(i, 1);
                break;
            }

            if (this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])) {
                this.freeRectangles.splice(j, 1);
            }
        }
    }
}

MaxRectsBinPack.prototype.scoreRectangle = function (width, height, method, score1, score2) {
    var newNode = { x: 0, y: 0, width: 0, height: 0 };
    score1 = Number.MAX_VALUE;
    score2 = Number.MAX_VALUE;

    switch (method) {
        case MaxRectsBinPack.BEST_SHORT_SIDE_FIT:
            newNode = this.findPositionForNewNodeBestShortSideFit(width, height);
            break;
        case MaxRectsBinPack.BOTTOM_LEFT_RULE:
            newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
            break;
        case MaxRectsBinPack.CONTRACT_POINT_RULE:
            newNode = this.findPositionForNewNodeContactPoint(width, height, score1);
            // todo: reverse
            score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
            break;
        case MaxRectsBinPack.BEST_LONG_SIDE_FIT:
            newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
            break;
        case MaxRectsBinPack.BEST_AREA_FIT:
            newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
            break;
    }

    // Cannot fit the current Rectangle.
    if (newNode.height == 0) {
        score1 = Number.MAX_VALUE;
        score2 = Number.MAX_VALUE;
    }

    return newNode;
}

MaxRectsBinPack.prototype.splitFreeNode = function (freeNode, usedNode) {
    // Test with SAT if the Rectangles even intersect.
    if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
        usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y) {
        return false;
    }
    var newNode;

    if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
        // New node at the top side of the used node.
        if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
            newNode = {
                x: freeNode.x,
                y: freeNode.y,
                width: freeNode.width,
                height: freeNode.height
            };
            newNode.height = usedNode.y - newNode.y;
            this.freeRectangles.push(newNode);
        }

        // New node at the bottom side of the used node.
        if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
            newNode = {
                x: freeNode.x,
                y: freeNode.y,
                width: freeNode.width,
                height: freeNode.height
            };;
            newNode.y = usedNode.y + usedNode.height;
            newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
            this.freeRectangles.push(newNode);
        }
    }

    if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
        // New node at the left side of the used node.
        if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
            newNode = {
                x: freeNode.x,
                y: freeNode.y,
                width: freeNode.width,
                height: freeNode.height
            };;
            newNode.width = usedNode.x - newNode.x;
            this.freeRectangles.push(newNode);
        }

        // New node at the right side of the used node.
        if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
            newNode = {
                x: freeNode.x,
                y: freeNode.y,
                width: freeNode.width,
                height: freeNode.height
            };;
            newNode.x = usedNode.x + usedNode.width;
            newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
            this.freeRectangles.push(newNode);
        }
    }

    return true;
}
module.exports = MaxRectsBinPack;